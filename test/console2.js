// Enhanced JavaScript Console

// Create and style the console container
const consoleContainer = document.createElement('div');
consoleContainer.style.position = 'fixed';
consoleContainer.style.bottom = '0';
consoleContainer.style.left = '0';
consoleContainer.style.width = '100%';
consoleContainer.style.backgroundColor = '#282c34';
consoleContainer.style.color = '#abb2bf';
consoleContainer.style.padding = '10px';
consoleContainer.style.fontFamily = 'monospace';
consoleContainer.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.5)';
consoleContainer.style.zIndex = '10000';
document.body.appendChild(consoleContainer);

// Create the input field
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Enter JavaScript code here and press Enter';
input.style.width = '100%';
input.style.padding = '10px';
input.style.border = 'none';
input.style.outline = 'none';
input.style.fontSize = '14px';
input.style.color = '#333';
input.style.backgroundColor = '#fff';
consoleContainer.appendChild(input);

// Create the output display area
const output = document.createElement('div');
output.style.maxHeight = '200px';
output.style.overflowY = 'auto';
output.style.marginTop = '10px';
output.style.padding = '10px';
output.style.backgroundColor = '#1e2127';
output.style.color = '#abb2bf';
output.style.borderRadius = '4px';
output.style.fontSize = '13px';
consoleContainer.appendChild(output);

// Console history and index for navigating through it
let history = [];
let historyIndex = -1;

// Function to log results or errors to the output area
function displayMessage(message, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.padding = '5px';
    messageDiv.style.color = isError ? 'red' : '#0f0';
    output.appendChild(messageDiv);
    output.scrollTop = output.scrollHeight; // Auto-scroll to the bottom
}

// Add event listener for Enter key to evaluate JavaScript
input.addEventListener('keydown', function(event) {
    // Enter key to run code
    if (event.key === 'Enter') {
        const code = input.value;
        input.value = '';

        if (code) {
            history.push(code);  // Add code to history
            historyIndex = history.length;  // Reset history index
        }

        try {
            const result = eval(code);
            displayMessage(`> ${code}`);
            displayMessage(result);
        } catch (error) {
            displayMessage(`Error: ${error.message}`, true);
        }
    }
    // Arrow up and down for history navigation
    else if (event.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            input.value = history[historyIndex];
        }
        event.preventDefault();
    } else if (event.key === 'ArrowDown') {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            input.value = history[historyIndex];
        } else {
            historyIndex = history.length;
            input.value = '';
        }
        event.preventDefault();
    }
});

// Clear output button for convenience
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear';
clearButton.style.position = 'absolute';
clearButton.style.top = '10px';
clearButton.style.right = '10px';
clearButton.style.backgroundColor = '#e06c75';
clearButton.style.border = 'none';
clearButton.style.padding = '5px 10px';
clearButton.style.color = '#fff';
clearButton.style.cursor = 'pointer';
clearButton.style.borderRadius = '3px';
clearButton.style.fontSize = '12px';
consoleContainer.appendChild(clearButton);

// Clear output on button click
clearButton.addEventListener('click', () => {
    output.innerHTML = '';
});
