// Array to store chat messages
const messages = [
    "How can I help you?"
];

// Options for chat responses
const options = [
    [
        "Crime Map Overview in Brisbane",
        "How to Protect Myself?",
        "I feel not safe, and I need emergency help!",
        "No Thanks"
    ],
];

// Information related to specific suburbs and responses
const suburbInfo = {
    "I feel not safe, and I need emergency help!": {
        message: "Please choose an option:",
        options: ["Type", "Call 000"],
    },
    "Type": {
        message: "Please leave your contact information. We will help you call the police.",
        showInputPopup: true,
    },
    "Call 000": "Directly call 000.",
    "Hi! I'm new to Brisbane and concerned about safety.": {
        message: "Your safety is our priority. What type of information are you <br>looking for?",
        options: [
            "Crime Map Overview in Brisbane",
            "How to Protect Myself?"
        ]
    },
};

// Function to scroll chat to the bottom
function scrollToBottom() {
    const chatbotContainer = document.querySelector('.chatbot-body');
    chatbotContainer.scrollTop = chatbotContainer.scrollHeight;
}

// Counter to keep track of chat messages
let counter = 0;

function createMessageContainer(message, isRight = false) {
    const container = document.createElement('div');
    container.classList.add('message-container');

    if (isRight) {
        container.classList.add('message-container-right');
    }

    const icon = document.createElement('img');
    icon.classList.add('chatbot-icon');
    icon.setAttribute('alt', 'Chatbot Icon');
    icon.setAttribute('src', './img/chatbot_icon.svg');
    container.appendChild(icon);

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('content-wrapper');

    const pElement = document.createElement('p');
    pElement.innerHTML = message;
    contentWrapper.appendChild(pElement);

    container.appendChild(contentWrapper);

    return container;
}

// Function to create a button in the chat
function createButton(text, optionIndex) {
    const button = document.createElement('div');
    button.classList.add('button');
    button.innerText = text;

    button.addEventListener('click', function () {
        // Remove existing buttons
        const buttons = document.querySelectorAll('.button');
        buttons.forEach(btn => btn.remove());

        const chatbotContainer = document.querySelector('.chatbot-body');
        chatbotContainer.appendChild(createMessageContainer(button.innerText, true));

        // Handle different button clicks
        if (text === "Crime Map Overview in Brisbane") {
            // Open a new window for crime map
            window.open('crime_map.html', '_blank');
            setTimeout(() => {
                chatbotContainer.appendChild(createMessageContainer("Is there anything else I can help you?"));
                displayButtons(options[0]); // Adjusted index to 0
            }, 1000);
        } else if (text === "How to Protect Myself?") {
            // Redirect to a new page for self-protection information
            window.location.href = 'suburbdetail.html?LocationName=St%20Lucia';
        } else if (text === "No Thanks") {
            const chatbotContainer = document.querySelector('.chatbot-body');
            chatbotContainer.appendChild(createMessageContainer("Thank you for visiting us. See you next time!"));
        
            // Create a new start button
            const startNewButton = createStartNewButton();
            chatbotContainer.appendChild(startNewButton);
        }
        else if (suburbInfo.hasOwnProperty(text)) {
            const suburbData = suburbInfo[text];
            if (typeof suburbData === "object") {
                const suburbMessage = suburbData.message;
                chatbotContainer.appendChild(createMessageContainer(suburbMessage));

                if (suburbData.showInputPopup) {
                    showInputPopup();
                }

                if (suburbData.options) {
                    displayButtons(suburbData.options);
                }
            } else {
                chatbotContainer.appendChild(createMessageContainer(suburbData));
                scrollToBottom();
            } 
        
        }

        counter++;
        if (counter === 7) {
            chatbotContainer.appendChild(createButton("Crime Map Overview in Brisbane"));
        } else if (counter === 8) {
            setTimeout(() => {
                chatbotContainer.appendChild(createMessageContainer("Is there anything else I can help you?"));
                displayButtons(options[counter - 4]); // Adjusted index to counter - 4
            }, 1000);
        }
    });

    return button;
}

// Function to create a new start button
function createStartNewButton() {
    const button = document.createElement('div');
    button.classList.add('button'); 
    button.id = "start-new"; 
    button.innerText = "Start New Chat"; 

    button.addEventListener('click', function () {
        window.location.href = './chatbot.html'; 
    });

    return button;
}

// Function to display a set of buttons in the chat
function displayButtons(buttons) {
    const chatbotContainer = document.querySelector('.chatbot-body');
    let delay = 0;
    buttons.forEach(optionText => {
        setTimeout(() => {
            const button = createButton(optionText);
            chatbotContainer.appendChild(button);
        }, delay);
        delay += 750;
    });
}

// Function to display an input popup for emergency help
function showInputPopup() {
    setTimeout(() => {
        const popupContainer = document.createElement('div');
        popupContainer.classList.add('popup-container');

        const title = document.createElement('div');
        title.classList.add('popup-title');
        title.innerText = 'Emergency Help';

        const form = document.createElement('form');

        const locationGroup = createInputGroup('text', 'Your Location*');
        const nameGroup = createInputGroup('text', 'Name*');
        const phoneGroup = createInputGroup('tel', 'Your Phone Number*');
        const descriptionGroup = createInputGroup('textarea', 'Description');

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-group');

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('button-cancel');
        cancelButton.innerText = 'Cancel';
        cancelButton.addEventListener('click', function(event) {
            event.preventDefault();
            popupContainer.style.display = 'none';
        });

        const submitButton = document.createElement('button');
        submitButton.classList.add('button-submit');
        submitButton.innerText = 'Submit';
        submitButton.addEventListener('click', function(event) {
            event.preventDefault();

            // Input validation
            const isLocationValid = validateInput(locationGroup.querySelector('input'));
            const isNameValid = validateInput(nameGroup.querySelector('input'));
            const isPhoneValid = validateInput(phoneGroup.querySelector('input'));

            if (!isLocationValid || !isNameValid || !isPhoneValid) {
                alert('Please fill in all required fields.');
                return;
            }

            popupContainer.style.display = 'none';
            const chatbotContainer = document.querySelector('.chatbot-body');
            chatbotContainer.appendChild(createMessageContainer("Your help is on the way. Please wait for a few minutes..."));
        });

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);

        form.appendChild(locationGroup);
        form.appendChild(nameGroup);
        form.appendChild(phoneGroup);
        form.appendChild(descriptionGroup);
        form.appendChild(buttonContainer);

        popupContainer.appendChild(title);
        popupContainer.appendChild(form);

        document.body.appendChild(popupContainer);
    }, 1200);
}

// Function to validate input fields
function validateInput(inputElement) {
    return inputElement && inputElement.value.trim() !== '';
}

// Function to create an input group in the popup form
function createInputGroup(type, placeholder) {
    const group = document.createElement('div');
    group.classList.add('input-group');

    const label = document.createElement('label');
    label.classList.add('input-label');
    label.innerText = placeholder;

    group.appendChild(label);

    if (type === 'textarea') {
        const textarea = document.createElement('textarea');
        textarea.classList.add('input-textarea');
        group.appendChild(textarea);
    } else {
        const input = document.createElement('input');
        input.setAttribute('type', type);
        input.setAttribute('placeholder', placeholder);
        input.required = true;
        input.classList.add(`input-${type}`);
        group.appendChild(input);
    }

    return group;
}

// Function to display the next chat message
function displayNextMessage() {
    if (counter < messages.length) {
        const chatbotContainer = document.querySelector('.chatbot-body');
        chatbotContainer.appendChild(createMessageContainer(messages[counter]));
        scrollToBottom();

        if (counter === 0) { // Change the condition to 0
            setTimeout(() => displayButtons(options[counter]), 750);
            return;
        }

        counter++;
        setTimeout(displayNextMessage, 750);
    }
}

// Start the chat by displaying the first message
displayNextMessage();
