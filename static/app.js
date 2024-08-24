class Chatbox {
    constructor() {
        this.args = {
            chatBox: document.querySelector('.chatbox'),
            sendButton: document.querySelector('.send__button')
        };

        this.messages = [];
        this.state = {
            company: null,
            year: null,
            step: 1
        };
        this.initializeMessages();
    }

    initializeMessages() {
        // Add the first bot message to the messages array
        this.messages.push({
            name: "Sam",
            message: "Hi there 👋."
        });
    
        // Add the second bot message to the messages array
        this.messages.push({
            name: "Sam",
            message: "Please enter the name of one of the following companies to inquire about its financials: Microsoft, Apple, or Tesla."
        });
    
        this.updateChatText(this.args.chatBox);
    }

    display() {
        const { chatBox, sendButton } = this.args;

        // Handle the send button click event
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        // Handle the Enter key event in the input field
        const input = chatBox.querySelector('input');
        input.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    onSendButton(chatbox) {
        const textField = chatbox.querySelector('input');
        const text = textField.value.trim().toLowerCase(); // Convert to lowercase
    
        // Return if the text field is empty
        if (text === "") {
            return;
        }
    
        // Add the user's message to the messages array
        this.messages.push({ name: "User", message: text });
    
        // Determine the current step
        if (this.state.step === 1) {
            const validCompanies = ['microsoft', 'apple', 'tesla'];
            if (validCompanies.includes(text)) {
                this.state.company = text.charAt(0).toUpperCase() + text.slice(1); // Capitalize the first letter
                this.state.step = 2;
                this.messages.push({ name: "Sam", message: "Got it! Now, please enter the fiscal year: 2021, 2022, or 2023." });
            } else {
                this.messages.push({ name: "Sam", message: "Please enter a valid company name: Microsoft, Apple, or Tesla." });
            }
        } else if (this.state.step === 2) {
            const validYears = ['2021', '2022', '2023'];
            if (validYears.includes(text)) {
                this.state.year = text;
                this.state.step = 3;
                this.messages.push({ name: "Sam", message: "Great! Now, please enter your question." });
            } else {
                this.messages.push({ name: "Sam", message: "Please enter a valid fiscal year: 2021, 2022, or 2023." });
            }
        } else if (this.state.step === 3) {
            const company = this.state.company;
            const year = this.state.year;
            const query = text;
    
            fetch('/ask', {
                method: 'POST',
                body: JSON.stringify({ company, year, query }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                this.messages.push({ name: "Sam", message: data.response });
                this.messages.push({
                    name: "Sam",
                    message: "Would you like to ask about another company? Please enter 'yes' or 'no'."
                });
                this.updateChatText(chatbox);
    
                // Clear the text field
                textField.value = '';
    
                // Set state to handle follow-up responses
                this.state.step = 4;
            })
            .catch(error => {
                console.error('Error:', error);
    
                // Display an error message in case of failure
                this.messages.push({ name: "Sam", message: "An error occurred. Please try again." });
                this.updateChatText(chatbox);
    
                // Clear the text field
                textField.value = '';
            });
            return;
        } else if (this.state.step === 4) {
            if (text === 'yes') {
                this.messages.push({
                    name: "Sam",
                    message: "Please choose from the following: Microsoft, Apple, Tesla."
                });
                this.state.step = 1; // Restart the flow
            } else if (text === 'no') {
                this.messages.push({
                    name: "Sam",
                    message: "Thank you for using the chatbot. Goodbye! 👋"
                });
                this.state.step = 5; // End the chat
            } else {
                this.messages.push({
                    name: "Sam",
                    message: "Please respond with 'yes' or 'no'."
                });
            }
        }
    
        // Update chat UI
        this.updateChatText(chatbox);
    
        // Clear the text field
        textField.value = '';
    }
    
     
    updateChatText(chatbox) {
        const chatMessages = chatbox.querySelector('.chatbox__body');

        // Create chat message HTML and apply the respective CSS class based on the sender (User or Bot)
        chatMessages.innerHTML = this.messages.map(item => `
            <div class="message ${item.name === 'Sam' ? 'bot-message' : 'user-message'}">
                <div class="avatar">
                    ${item.name === 'Sam' ? '<img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png" alt="bot">' : ''}
                </div>
                <div class="text">
                    ${item.message}
                </div>
            </div>
        `).join('');

        // Auto-scroll to the bottom of the chatbox after updating
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Initialize the chatbox and display it
const chatbox = new Chatbox();
chatbox.display();
