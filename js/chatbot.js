
//--Basic Chatbot in Javascripton on https://www.htmlgoodies.com/javascript/basic-chatbot-in-javascript/
// Array to store chat messages
const messages = [
    "<strong>Welcome to HATIHATI!</strong> We specialize in providing crime data <br>for international female students and first-time residents in <br>Brisbane. Chat with me to better understand your communities and raise safety awareness.",
    "How can I help you?",
];

// Options for chat responses
const options = [
    [
        "Hi! I'm new to Brisbane and concerned about safety.",
        "I feel not safe, and I need emergency help!"
    ],
    [
        "Crime Map Overview in Brisbane",
        "How to Protect Myself?",
        "No Thanks"
    ],
    [
        "Crime Map Overview in Brisbane",
        "How to Protect Myself?",
        "No Thanks"
    ]
];

// Information related to specific suburbs and responses
const suburbInfo = {
    "St. Lucia": "Great! I’ll bring you to Crime Map Overview in St.Lucia.",
    "Toowong": "Great! I’ll bring you to Crime Map Overview in Toowong.",
    "SouthBank": "Great! I’ll bring you to Crime Map Overview in SouthBank.",
    "Woollongabba": "Great! I’ll bring you to Crime Map Overview in Woollongabba.",
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

// Function to create a message container
function createMessageContainer(message, isRight = false) {
    // Create a container for the message
    const container = document.createElement('div');
    container.classList.add('message-container');

    // Add a chatbot icon to the container
    const icon = document.createElement('img');
    icon.classList.add('chatbot-icon');
    icon.setAttribute('alt', 'Chatbot Icon');
    icon.setAttribute('src', './img/chatbot_icon.svg');
    container.appendChild(icon);

    // Create a content wrapper for the message
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('content-wrapper');

    // Create a paragraph element for the message content
    const pElement = document.createElement('p');
    pElement.innerHTML = message;
    contentWrapper.appendChild(pElement);

    // Append the content wrapper to the container
    container.appendChild(contentWrapper);

    // Set the message container's alignment based on the 'isRight' parameter
    if (isRight) {
        container.classList.add('message-container-right');
    }

    return container;
}
// Chatbot answer/response time Code in js on https://stackoverflow.com/questions/39238341/chatbot-answer-response-time-code-in-js
// Function to create a button in the chat
function createButton(text, optionIndex) {
    // Create a button element
    const button = document.createElement('div');
    button.classList.add('button');
    button.innerText = text;

    // Add an event listener for button clicks
    button.addEventListener('click', function () {
        // Remove existing buttons
        const buttons = document.querySelectorAll('.button');
        buttons.forEach(btn => btn.remove());

        // Get the chatbot container
        const chatbotContainer = document.querySelector('.chatbot-body');
        chatbotContainer.appendChild(createMessageContainer(button.innerText, true));

        // Handle different button clicks based on text
        if (text === "Crime Map Overview in Brisbane") {
            // Open a new window for crime map
            window.open('crime_map.html', '_blank');
            setTimeout(() => {
                chatbotContainer.appendChild(createMessageContainer("Is there anything else I can help you?"));
                displayButtons(options[3]);
            }, 1000);
        } else if (text === "How to Protect Myself?") {
            // Redirect to a new page for self-protection information
            window.location.href = 'suburbdetail.html?LocationName=St%20Lucia';
        } else if (suburbInfo.hasOwnProperty(text)) {
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
                displayButtons(options[counter - 4]);
            }, 1000);
        }
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
        // Create a popup container
        const popupContainer = document.createElement('div');
        popupContainer.classList.add('popup-container');

        // Create a title for the popup
        const title = document.createElement('div');
        title.classList.add('popup-title');
        title.innerText = 'Emergency Help';

        // Create a form element
        const form = document.createElement('form');

        // Create input groups for various fields
        const locationGroup = createInputGroup('text', 'Your Location*');
        const nameGroup = createInputGroup('text', 'Name*');
        const phoneGroup = createInputGroup('tel', 'Your Phone Number*');
        const descriptionGroup = createInputGroup('textarea', 'Description');

        // Create a container for buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-group');

        // Create a cancel button
        const cancelButton = document.createElement('button');
        cancelButton.classList.add('button-cancel');
        cancelButton.innerText = 'Cancel';

        // Add an event listener for the cancel button
        cancelButton.addEventListener('click', function(event) {
            event.preventDefault();
            popupContainer.style.display = 'none';
        });

        // Create a submit button
        const submitButton = document.createElement('button');
        submitButton.classList.add('button-submit');
        submitButton.innerText = 'Submit';

        // Add an event listener for the submit button
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

        // Append buttons to the button container
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);

        // Append input groups and button container to the form
        form.appendChild(locationGroup);
        form.appendChild(nameGroup);
        form.appendChild(phoneGroup);
        form.appendChild(descriptionGroup);
        form.appendChild(buttonContainer);

        // Append title and form to the popup container
        popupContainer.appendChild(title);
        popupContainer.appendChild(form);

        // Append the popup container to the body
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

        if (counter === 1 || counter === 2) {
            setTimeout(() => displayButtons(options[counter - 1]), 750);
            return;
        }

        counter++;
        setTimeout(displayNextMessage, 750);
    }
}

// Start the chat by displaying the first message
displayNextMessage();
