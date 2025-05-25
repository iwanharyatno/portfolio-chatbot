const chatBox = document.getElementById("chat-box");

function sendMessage() {
    const input = document.getElementById("user-input");
    const userText = input.value.trim();

    if (!userText) return;

    appendMessage("You", userText, "user-message");
    respondTo(userText);
    input.value = "";
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function appendMessage(sender, message, className) {
    const msgBox = document.createElement("div");
    msgBox.classList.add('message-container', className);
    const bubbleDiv = document.createElement("div");
    const from = document.createElement('p');
    from.classList.add('bubble-sender');
    from.innerHTML = `<strong>${sender}</strong>`;
    const reply = document.createElement('div');
    bubbleDiv.className = `message`;
    const htmlContent = marked.parse(message);
    reply.innerHTML = htmlContent;

    bubbleDiv.appendChild(from);
    bubbleDiv.appendChild(reply);

    msgBox.appendChild(bubbleDiv);
    chatBox.appendChild(msgBox);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function respondTo(text) {
    const userMessage = text.trim();
    if (!userMessage) return;

    const typingIndicator = showTypingIndicator();

    fetch("https://iwanbot.onrender.com/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function (data) {
            const botReply = data.reply || "Sorry, I couldn't generate a response.";

            hideTypingIndicator(typingIndicator);

            appendMessage("IwanBot", botReply, "bot-message");
        })
        .catch(function (error) {
            console.error("Error fetching response:", error);

            hideTypingIndicator(typingIndicator);

            appendMessage("IwanBot", "Oops! Something went wrong. Please try again.", "bot-message");
        });
}

function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-message";
    typingDiv.innerHTML = `<strong>IwanBot:</strong> 🤖 Typing...`;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

function hideTypingIndicator(element) {
    if (element && element.parentNode) {
        element.remove();
    }
}
