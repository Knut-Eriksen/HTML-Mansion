let interactionMapData = null;
const interactionMapImage = new Image();
let dracula_interaction = 0;
window.playerName = null;
window.tasksDone = 0;
let taskTries = 0;

function loadInteractionMap() {
    interactionMapImage.src = '/img/html-mansion1-interaction.png';

    interactionMapImage.onload = () => {
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = interactionMapImage.width;
        tempCanvas.height = interactionMapImage.height;

        tempContext.drawImage(interactionMapImage, 0, 0);
        interactionMapData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
    };
}

loadInteractionMap();

const changeSkin = {
    changeSkin: {
        title: "Change skin",
    }
};

// Interaction definitions
const interaction = {
    interaction1: {
        title: "<h1>Count Dracula:</h1>",
        message: "<p>Hello visitor, my housekeeper recently left without notice, could you help me with restoring the cover to my favorite book \"To Kill a Mockingbird\"? It is located in the library and the title has started to fade away. Please return to me after the deed is done.</p>",
        isCompleted: false
    },
    interaction2: {
        title: "<h1>Count Dracula:</h1>",
        message: "<p>Thank you, I didn't catch name. What was it?</p>",
        isCompleted: false
    },
    interaction3: {
        title: "<h1>Count Dracula:</h1>",
        message: "<p>I'm sorry for my bad manners, I don't get many visitors anymore... It seems I've gotten a bad reputation, would you be so kind as to light up the fireplace?</p>",
        isCompleted: false
    },
    interaction4: {
        title: "<h1>Count Dracula:</h1>",
        message: "<p>Thank you, it was freezing. There seems like someone has put some garlic in my chest as a prank of some sort, could you take this key and remove it for me?</p>",
        isCompleted: false
    },
    interaction5: {
        title: "<h1>Count Dracula:</h1>",
        message: "<p>I can see your clothes have been in better shape, you're welcome to go to my bedroom closet and change, it is by where you first met me in the hallway.</p>",
        isCompleted: false
    },
    interaction6: {
        title: "<h1>Count Dracula:</h1>",
        message: "<p>Now that we are nearing Christmas, I've been wanting to make the jail cell a bit more cosy. See what you can do.</p>",
        isCompleted: false
    },
    interaction7: {
        title: "<h1>Count Dracula:</h1>",
        message: "<p> So long </p>",
        isCompleted: false
    }
};

// Task definitions
const tasks = {
    task1: {
        title: "<title>Task 1: Fix the title.</title>",
        description: "<p>You find a book with the title 'To K ll a Mo kingb  d', Fix it using HTML.</p>",
        expectedHtml: "<title>To Kill a Mockingbird</title>",
        isCompleted: false,
        hint1: "'To Kill a Mockingbird' is Dracula's favourite book",
        hint2: "Use the tag <title></title> for titles"
    },
    task2: {
        title: "<title>Task 2: Light the fire</title>",
        description: "<p>The fireplace is not lit, the variable is 'isFireplaceLit = false;'. Fix the variable in JavaScript and light the fire</p>",
        expectedHtml: "isFireplaceLit = true;",
        isCompleted: false,
        hint1: "'Use the format 'isFireplaceLit = ****;'. The syntax of your input is case sensitive.",
        hint2: "The opposite of false is ****."
    },
    task3: {
        title: "<title>Task 3: Create a Garlic Button</title>",
        description: "<p>Add a button below the garlic labeled 'Remove Garlic' for you to remove it.</p>",
        expectedHtml: "<button>Remove Garlic</button>",
        hint1: "Use the `<button>` tag to create a button.",
        hint2: "Format your button like this: `<button>Button Text</button>`.",
        isCompleted: false
    },
    task4: {
        title: "<title>Task 4: Change bedsheets</title>",
        description: "<p>Use CSS to change the bedsheets to red</p>",
        expectedHtml: "bedsheets{color: red;}",
        hint1: "Try using the 'color' property.",
        hint2: "Use the format 'bedsheets{'*****': '***';}'",
        isCompleted: false
    }
};

function showNamePopup(callback) {
    const popupContainer = document.getElementById("name-popup-container");
    const nameInput = document.getElementById("name-popup-input");
    const submitButton = document.getElementById("name-popup-submit");
    const cancelButton = document.getElementById("name-popup-cancel");

    // Reset the input field
    nameInput.value = "";

    // Show the popup interface
    popupContainer.style.display = "block";

    // Handle submit
    submitButton.onclick = () => {
        const name = nameInput.value.trim();
        if (name) {
            playerName = name;
            saveProgress();
            popupContainer.style.display = "none"
            callback();
        } else {
            alert("Please enter your name.");
        }
    };

    // Handle cancel
    cancelButton.onclick = () => {
        popupContainer.style.display = "none"; // Hide the popup
        window.taskActive = false;
    };
}

// Check for interaction with the interaction map
function checkInteraction() {
    if (!interactionMapData) {
        return null;
    }

    if (!interactionMapImage.width || !interactionMapImage.height) {
        return null;
    }

    // Calculate the player's center position relative to the interaction map
    const centerX = Math.floor(window.canvas.width / 2 - window.map.x);
    const centerY = Math.floor(window.canvas.height / 2 - window.map.y);

    // Ensure the center pixel is within bounds
    if (centerX < 0 || centerY < 0 || centerX >= interactionMapImage.width || centerY >= interactionMapImage.height) {
        return null;
    }

    // Calculate the pixel index
    const index = (centerY * interactionMapImage.width + centerX) * 4;
    const r = interactionMapData[index];
    const g = interactionMapData[index + 1];
    const b = interactionMapData[index + 2];
    const a = interactionMapData[index + 3];

    if (a !== 0) {
        if (r === 136 && g === 0 && b === 21 && tasksDone < 3) {
            switch (dracula_interaction) {
                case 0:
                    return "interaction1"; // Dark red corresponds to Dracula interaction
                case 1:
                    return "interaction2";
                case 2:
                    return "interaction3"; // Dark red corresponds to Dracula interaction
                case 3:
                    return "interaction4";
            }
        } else if (r === 127 && g === 127 && b === 127 && tasksDone >= 3) {
            switch (dracula_interaction) {
                case 4:
                    return "interaction5"; // Dark red corresponds to Dracula interaction
                case 5:
                    return "interaction6";
                case 6:
                    return "interaction7";
            }
        } else if (r === 63 && g === 72 && b === 204 && interaction["interaction1"].isCompleted === true) {
            return "task1"; // Blue corresponds to Task 1 (restore book)
        } else if (r === 237 && g === 28 && b === 36 && interaction["interaction3"].isCompleted === true) {
            return "task2"; // Red corresponds to Task 2 (fireplace)
        } else if (r === 34 && g === 177 && b === 76 && interaction["interaction4"].isCompleted === true) {
            return "task3"; // Green corresponds to Task 3 (chest)
        } else if (r === 163 && g === 73 && b === 164 && interaction["interaction6"].isCompleted === true) {
            return "task4"; // Purple corresponds to Task 4
        } else if (r === 255 && g === 127 && b === 39) {
            return "changeSkin"; // Orange corresponds to changeSkin
        } else if (r === 63 && g === 72 && b === 204 && interaction["interaction1"].isCompleted === false) {
            handleUnavailableTask();
        } else if (r === 237 && g === 28 && b === 36 && interaction["interaction3"].isCompleted === false) {
            handleUnavailableTask();
        } else if (r === 34 && g === 177 && b === 76 && interaction["interaction4"].isCompleted === false) {
            handleUnavailableTask();
        } else if (r === 163 && g === 73 && b === 164 && interaction["interaction6"].isCompleted === false) {
            handleUnavailableTask();
        }
    }
    return null;
}

// Function to display a notification
function showNotification(message) {
    const notificationContainer = document.getElementById('notification-container');
    const notificationMessage = document.getElementById('notification-message');
    const notificationButton = document.getElementById('notification-button');

    // Set the message text
    notificationMessage.textContent = message;

    // Show the notification
    notificationContainer.style.display = 'block';
    window.taskActive = true;

    // Close the notification on button click
    notificationButton.onclick = () => {
        notificationContainer.style.display = 'none';
        window.taskActive = false;
    };
}


// Initialize the flag
window.showStartingNotification = true;

// Example function to handle tasks
function handleUnavailableTask() {
    showNotification("You should talk to Dracula");
}

// Call `handleUnavailableTask` wherever an unavailable task is triggered

window.changeSkinFunction = function (skin) {
    if (skin === "standard") {
        playerImage.src = '/img/Jean-Clér.png';
        player.skin = "standard";
    } else if (skin === "red") {
        playerImage.src = '/img/Jean-Clér-Red.png';
        player.skin = "red";
    } else if (skin === "crown") {
        playerImage.src = '/img/King.png';
        player.skin = "crown";
    } else {
        playerImage.src = '/img/Jean-Clér.png';
        player.skin = "standard";
    }
    cancelTask();
    saveProgress();
}

function changeSkinPopUp() {
    const changeSkinContainer = document.getElementById("changeSkin-container");
    changeSkinContainer.style.display = "flex";

    // Set up button click handlers
    document.getElementById("standard-button").onclick = () => {
        changeSkinFunction("standard");
        changeSkinContainer.style.display = "none"; // Hide the container
        window.taskActive = false; // Allow new tasks or interactions
    };

    const redButton = document.getElementById("red-button");
    if (window.tasksDone >= 3) {
        redButton.style.display = "block";
        redButton.onclick = () => {
            changeSkinFunction("red");
            changeSkinContainer.style.display = "none";
            window.taskActive = false;
        };
    } else {
        redButton.style.display = "none";
    }

    const crownButton = document.getElementById("crown-button");
    if (tasksDone >= 4) {
        crownButton.style.display = "block";
        crownButton.onclick = () => {
            changeSkinFunction("crown");
            changeSkinContainer.style.display = "none";
            window.taskActive = false;
        };
    } else {
        crownButton.style.display = "none";
    }
    window.taskActive = true;
}

// Trigger an interaction
function triggerInteraction(interactionId) {
    if (interactionId === "changeSkin") {
        changeSkinPopUp();
        return;
    }

    const interactionDetails = interaction[interactionId];
    if (!interactionDetails) {
        return;
    }

    window.taskActive = true;
    window.showExclamationMark = false;

    // Show Dracula's interaction UI
    const draculaContainer = document.getElementById("dracula-container");
    document.getElementById("dracula-title").textContent = interactionDetails.title;

    if (interactionId === "interaction3" && playerName) {
        interactionDetails.message = `<p>I'm sorry for my bad manners, ${playerName}... I don't get many visitors anymore... It seems I've gotten a bad reputation, would you be so kind as to light up the fireplace?</p>`;
    }
    if (interactionId === "interaction5") {
        dracula_interaction = 5;
        window.showExclamationMark = true;
    }
    if (interactionId === "interaction7" && playerName) {
        interactionDetails.message = `<p>So long, ${playerName}</p>`;
    }

    document.getElementById("dracula-message").textContent = interactionDetails.message;
    draculaContainer.style.display = "block";

    interaction[interactionId].isCompleted = true;

    document.getElementById("dracula-button").onclick = () => {
        draculaContainer.style.display = "none";
        if (interactionId === "interaction2" && !playerName) {
            showNamePopup(() => {
                dracula_interaction++;
                triggerInteraction("interaction3");
            });
            return;
        }
        window.taskActive = false;
    };
}


// Trigger a task
function triggerTask(taskId) {
    const task = tasks[taskId];
    if (!task || task.isCompleted) {
        return;
    }

    window.taskActive = true;

    taskTries = 0;
    document.getElementById("task-hint1").textContent = ""; // Clear previous tips
    document.getElementById("task-hint2").textContent = ""; // Clear previous tips
    // Show task UI
    const taskContainer = document.getElementById("task-container");
    document.getElementById("task-title").textContent = task.title;
    document.getElementById("task-description").textContent = task.description;
    document.getElementById("task-feedback").textContent = "";
    document.getElementById("task-input").value = "";
    taskContainer.style.display = "block";

    // Set up buttons
    document.getElementById("submit-task").onclick = () => checkTask(taskId);
    document.getElementById("cancel-task").onclick = cancelTask;

    window.movementKeys.up = false;
    window.movementKeys.down = false;
    window.movementKeys.left = false;
    window.movementKeys.right = false;
}

// Validate the task
function checkTask(taskId) {
    const task = tasks[taskId];
    const userHtml = document.getElementById("task-input").value.trim();
    const feedback = document.getElementById("task-feedback");

    if (userHtml === task.expectedHtml) {
        feedback.textContent = "Correct! Task completed!";
        feedback.className = "success";
        task.isCompleted = true;
        tasksDone++;
        dracula_interaction++;
        window.showExclamationMark = true;
        cancelTask();

        if (tasksDone >= 2) {
            updateMapImage('/img/html-mansion-fireplace.png');
        }
        if (tasksDone >= 3) {
            updateCollisionMapImage('/img/html-mansion1-collisions2.png', () => {
                window.draculaPosition = {x: -2450, y: -1570}; // New Dracula position
            });
        }
        if (tasksDone >= 4) {
            updateMapImage('/img/html-mansion-bedsheets.png');
        }

    } else {
        feedback.textContent = "Incorrect. Try again.";
        feedback.className = "error";
        taskTries += 1;

        if (taskTries === 1) {
            document.getElementById("task-hint1").textContent = task.hint1;
        } else if (taskTries === 2) {
            document.getElementById("task-hint2").textContent = task.hint2;
        }
    }
}

// Cancel task interaction
function cancelTask() {
    const taskContainer = document.getElementById("task-container");
    taskContainer.style.display = "none";
    window.taskActive = false;
}

// Key press listener for interactions
document.addEventListener("keydown", (event) => {

    if (window.taskActive) return;

    if (event.key.toLowerCase() === "e") {
        const interactionId = checkInteraction();
        if (interactionId?.startsWith("interaction")) {
            triggerInteraction(interactionId);
        } else if (interactionId?.startsWith("task")) {
            triggerTask(interactionId);
        } else if (interactionId?.startsWith("changeSkin")) {
            triggerInteraction(interactionId);
        }
    }
});

