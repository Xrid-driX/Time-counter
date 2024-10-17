let counterId = 0;

// Function to create a counter
function createCounter() {
    counterId++;
    const counterContainer = document.createElement('div');
    counterContainer.className = 'border border-gray-300 p-4 rounded bg-white shadow-lg flex flex-col relative transition-transform transform hover:scale-105 duration-300';
    counterContainer.dataset.id = counterId; // Set data-id for reference

    let count = 0;
    let timerInterval;
    let timer = 0;
    let isRunning = false;

    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'text-lg font-bold mb-2 timer-display';
    timerDisplay.innerText = `Timer: 0s`;

    const countDisplay = document.createElement('div');
    countDisplay.className = 'text-lg mb-2 count-display';
    countDisplay.innerText = `Count: ${count}`;

    const updateTextColor = () => {
        const isDarkMode = document.body.classList.contains('bg-gray-800');
        timerDisplay.className = isDarkMode ? 'text-lg font-bold mb-2 text-white timer-display' : 'text-lg font-bold mb-2 timer-display';
        countDisplay.className = isDarkMode ? 'text-lg mb-2 text-white count-display' : 'text-lg mb-2 count-display';
    };

    updateTextColor();

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex flex-col items-center';

    const addButton = document.createElement('button');
    addButton.innerText = 'Add Count';
    addButton.className = 'bg-green-500 text-white py-2 px-4 w-6/12 text-center rounded mb-2 transition duration-300 transform hover:bg-green-600 hover:scale-105';
    addButton.onclick = () => {
        count++;
        countDisplay.innerText = `Count: ${count}`;
        updateCounterInLocalStorage(counterId, count, timer);

        if (isRunning) {
            const taskItem = document.createElement('li');
            taskItem.innerText = `Folded towel count: "${count}" finished in ${timer}s`;
            taskItem.className = 'task transition duration-300 hover:text-green-500';
            taskList.appendChild(taskItem);
        }
        clearInterval(timerInterval);
        isRunning = false;
    };

    const taskList = document.createElement('ul');
    taskList.className = 'mt-2 list-disc list-inside';

    const startTimer = () => {
        if (!isRunning) {
            isRunning = true;
            clearInterval(timerInterval);
            timer = 0;
            timerInterval = setInterval(() => {
                timer++;
                timerDisplay.innerText = `Timer: ${timer}s`;
                updateCounterInLocalStorage(counterId, count, timer);
            }, 1000);
        }
    };

    const pauseTimer = () => {
        clearInterval(timerInterval);
        isRunning = false;
    };

    const resetCounter = () => {
        count = 0;
        timer = 0;
        countDisplay.innerText = `Count: ${count}`;
        timerDisplay.innerText = `Timer: 0s`;
        clearInterval(timerInterval);
        isRunning = false;
        taskList.innerHTML = '';
        localStorage.removeItem(`counter_${counterId}`);
    };

    const startButton = document.createElement('button');
    startButton.innerText = 'Start Timer';
    startButton.className = 'bg-blue-500 text-white py-1 px-3 w-6/12 text-center rounded mb-1 transition duration-300 transform hover:bg-blue-600 hover:scale-105';
    startButton.onclick = startTimer;

    const pauseButton = document.createElement('button');
    pauseButton.innerText = 'Pause Timer';
    pauseButton.className = 'bg-yellow-500 text-white py-1 px-3 w-6/12 text-center rounded mb-1 transition duration-300 transform hover:bg-yellow-600 hover:scale-105';
    pauseButton.onclick = pauseTimer;

    const resetButton = document.createElement('button');
    resetButton.innerText = 'Reset Counter';
    resetButton.className = 'bg-indigo-500 text-white py-1 px-3 w-6/12 text-center rounded mb-1 transition duration-300 transform hover:bg-indigo-600 hover:scale-105';
    resetButton.onclick = resetCounter;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete Counter';
    deleteButton.className = 'bg-red-500 text-white py-1 px-3 w-6/12 text-center rounded mb-1 transition duration-300 transform hover:bg-red-600 hover:scale-105';
    deleteButton.onclick = () => {
        counterContainer.remove();
        localStorage.removeItem(`counter_${counterId}`);
        updateCountersInLocalStorage();
    };

    buttonContainer.appendChild(addButton);
    buttonContainer.appendChild(startButton);
    buttonContainer.appendChild(pauseButton);
    buttonContainer.appendChild(resetButton);
    buttonContainer.appendChild(deleteButton);

    counterContainer.appendChild(timerDisplay);
    counterContainer.appendChild(countDisplay);
    counterContainer.appendChild(buttonContainer);
    counterContainer.appendChild(taskList);

    document.getElementById('counters').appendChild(counterContainer);

    // Load count and timer from local storage
    const savedData = JSON.parse(localStorage.getItem(`counter_${counterId}`));
    if (savedData) {
        count = savedData.count;
        timer = savedData.timer;
        countDisplay.innerText = `Count: ${count}`;
        timerDisplay.innerText = `Timer: ${timer}s`;
    }

    return counterContainer; // Return the created counter element
}

// Function to update counter data in local storage
function updateCounterInLocalStorage(id, count, timer) {
    const counterData = { count, timer };
    localStorage.setItem(`counter_${id}`, JSON.stringify(counterData));
}

// Function to update the list of counters in local storage
function updateCountersInLocalStorage() {
    const counters = [];
    document.querySelectorAll('[data-id]').forEach(counter => {
        const id = counter.dataset.id;
        const count = parseInt(counter.querySelector('.count-display').innerText.split(': ')[1]);
        const timer = parseInt(counter.querySelector('.timer-display').innerText.split(': ')[1]);
        counters.push({ id, count, timer });
    });
    localStorage.setItem('counters', JSON.stringify(counters));
}

// Initialize counters from local storage on page load
function loadCountersFromLocalStorage() {
    const savedCounters = JSON.parse(localStorage.getItem('counters'));
    console.log('Loaded counters from local storage:', savedCounters); // Debugging line
    if (savedCounters) {
        savedCounters.forEach(({ id, count, timer }) => {
            const counterContainer = createCounter();
            counterContainer.dataset.id = id; // Set the data-id
            counterContainer.querySelector('.count-display').innerText = `Count: ${count}`;
            counterContainer.querySelector('.timer-display').innerText = `Timer: ${timer}s`;
            // Ensure the timer is set correctly on load
            if (timer > 0) {
                counterContainer.querySelector('.timer-display').innerText = `Timer: ${timer}s`;
                // Start the timer if it's running
                const timerInterval = setInterval(() => {
                    timer++;
                    counterContainer.querySelector('.timer-display').innerText = `Timer: ${timer}s`;
                    updateCounterInLocalStorage(id, count, timer); // Update timer in local storage
                }, 1000);
            }
        });
    }
}

document.getElementById('addCounter').onclick = createCounter;

// Dark mode functionality
const body = document.body;

const setTheme = (theme) => {
    if (theme === 'dark') {
        body.classList.add('bg-gray-800', 'text-white');
        body.classList.remove('bg-gray-100', 'text-black');
    } else {
        body.classList.remove('bg-gray-800', 'text-white');
        body.classList.add('bg-gray-100', 'text-black');
    }

    document.querySelectorAll('.border').forEach(counter => {
        counter.className = theme === 'dark' ? 'border border-gray-700 p-4 rounded bg-gray-900 shadow-lg flex flex-col relative transition-transform transform hover:scale-105 duration-300' : 'border border-gray-300 p-4 rounded bg-white shadow-lg flex flex-col relative transition-transform transform hover:scale-105 duration-300';
    });

    document.querySelectorAll('.text-lg').forEach(counter => {
        const isDarkMode = theme === 'dark';
        counter.classList.toggle('text-white', isDarkMode);
        counter.classList.toggle('text-black', !isDarkMode);
    });
};

// Initialize theme based on local storage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}

// Toggle Theme Button
document.getElementById('toggleTheme').onclick = () => {
    const currentTheme = body.classList.contains('bg-gray-800') ? 'light' : 'dark';
    setTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
};

// Load counters on page load
loadCountersFromLocalStorage();
