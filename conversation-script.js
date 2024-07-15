// Function to display conversation history
function displayConversationHistory(history) {
    const messagesContainer = document.getElementById("messages-container");
    messagesContainer.innerHTML = ""; // Clear previous messages
    history.forEach(entry => {
        const messageElement = document.createElement("div");
        if (entry.hasOwnProperty("user_message")) {
            messageElement.className = "user-message";
            messageElement.textContent = entry.user_message;
        } else if (entry.hasOwnProperty("bot_response")) {
            messageElement.className = "bot-message";
            messageElement.textContent = entry.bot_response;
        }
        messagesContainer.appendChild(messageElement);
    });
}

// Function to scroll to the bottom of the message container
function scrollToBottom() {
    var messagesContainer = document.getElementById("messages-container");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('messageForm');
    var messagesContainer = document.getElementById('messages-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var userInput = document.getElementById('userInput').value;

        // Send user message to server
        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'message=' + encodeURIComponent(userInput)
        })
        .then(response => response.json())
        .then(data => {
            // Display user message
            var userMessageContainer = document.createElement('div');
            userMessageContainer.className = 'user-message-container';
            userMessageContainer.style.backgroundImage = "url('/static/user.jpg')";
            var userMessageText = document.createElement('div');
            userMessageText.className = 'user-message';
            userMessageText.textContent = userInput;
            userMessageContainer.appendChild(userMessageText);
            messagesContainer.appendChild(userMessageContainer);

            // Display bot response
            var botResponseContainer = document.createElement('div');
            botResponseContainer.className = 'bot-message-container';
            botResponseContainer.style.backgroundImage = "url('/static/logo.jpg')";
            var botResponseText = document.createElement('div');
            botResponseText.className = 'bot-message';
            botResponseText.textContent = data.bot_response; // Here
            botResponseContainer.appendChild(botResponseText);
            messagesContainer.appendChild(botResponseContainer);
            

            // Clear input field
            document.getElementById('userInput').value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Scroll to bottom after adding new messages
            scrollToBottom();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

// Function to clear input fields
function clearFields() {
    document.getElementById("userInput").value = "";
}

// Function to process user input
function processUserInput() {
    const userInputField = document.getElementById('userInput');
    const userMessage = userInputField.value.trim();

    if (userMessage !== '') {
        fetch('/process-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        })
        .then(response => response.json())
        .then(data => {
            const botResponse = data.botMessage;
            displayBotMessage(botResponse);
            if (data.clearAndFocus) {
                userInputField.value = ""; // Clear the input field after sending the message
                userInputField.style.height = 'auto'; // Reset input field height
                userInputField.focus(); // Focus on the input field after sending the message
            }
            scrollToBottom(); // Scroll to bottom after adding new message
        })
        .catch(error => {
            console.error('Error processing user message:', error);
        });
    }
}

// Dynamically adjust the top margin of the chat container
function adjustChatPosition() {
    const headerHeight = document.querySelector('header').offsetHeight;
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.style.marginTop = `${headerHeight + 20}px`; // Adjust the top margin
}

// Call the adjustChatPosition function when the page loads and when it resizes
window.addEventListener('DOMContentLoaded', adjustChatPosition);
window.addEventListener('resize', adjustChatPosition);



// Function to display user message in the chat container
function displayUserMessage(message) {
    const userMessagesContainer = document.getElementById("userMessages");
    const userMessageElement = document.createElement("div");
    userMessageElement.classList.add("user-message");
    userMessageElement.textContent = message;
    userMessagesContainer.insertBefore(userMessageElement, userMessagesContainer.firstChild);
    scrollToBottom(); // Scroll to bottom after adding new message
}

// Function to display bot response in the chat container
function displayBotMessage(message) {
    const botResponsesContainer = document.getElementById("botResponses");
    const botResponseElement = document.createElement("div");
    botResponseElement.classList.add("bot-message");
    botResponseElement.textContent = message;
    botResponsesContainer.insertBefore(botResponseElement, botResponsesContainer.firstChild);
    scrollToBottom(); // Scroll to bottom after adding new message
}

// Enable sending message on Enter key press
document.getElementById('userInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        processUserInput();
    }
});

// Auto-adjust input field height and width
const userInputField = document.getElementById('userInput');
userInputField.addEventListener('input', function() {
    this.style.height = 'auto'; // Reset height to auto
    this.style.height = this.scrollHeight + 'px'; // Set height to content size
    this.style.width = '100%'; // Set width to 100% to expand horizontally
});

// Fetch dataset from the API endpoint
fetch('/dataset')
.then(response => response.json())
.then(data => {
    // Display the dataset in a specific component
    const datasetContainer = document.getElementById('dataset-container');
    datasetContainer.innerHTML = JSON.stringify(data, null, 2); // Example: Display dataset as JSON string
})
.catch(error => {
    console.error('Error fetching dataset:', error);
});
