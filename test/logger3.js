// logger.js

(function() {
    // Create and style the logger window
    const loggerWindow = document.createElement('div');
    const loggerHeader = document.createElement('div');
    const loggerContent = document.createElement('div');
    const minimizeButton = document.createElement('button');
    const clearButton = document.createElement('button'); // Moved clear button to the top
    const closeButton = document.createElement('button');
    const resizeHandle = document.createElement('div');

    // Apply styles to the logger window
    loggerWindow.style.position = 'absolute';
    loggerWindow.style.top = '20px';
    loggerWindow.style.right = '20px';
    loggerWindow.style.width = '300px';
    loggerWindow.style.height = '400px';
    loggerWindow.style.border = '2px solid #ccc';
    loggerWindow.style.borderRadius = '5px';
    loggerWindow.style.backgroundColor = 'white';
    loggerWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    loggerWindow.style.zIndex = '1000';
    loggerWindow.style.display = 'flex';
    loggerWindow.style.flexDirection = 'column';
    loggerWindow.style.fontFamily = 'Arial';

    // Header styles and content
    loggerHeader.style.backgroundColor = '#007bff';
    loggerHeader.style.color = 'white';
    loggerHeader.style.padding = '10px';
    loggerHeader.style.cursor = 'move';
    loggerHeader.style.display = 'flex';
    loggerHeader.style.justifyContent = 'space-between';
    loggerHeader.style.alignItems = 'center';

    // Center the title
    const title = document.createElement('span');
    title.textContent = 'Logger';
    title.style.flexGrow = '1';
    title.style.textAlign = 'center';

    minimizeButton.textContent = '-';
    closeButton.textContent = 'X';

    // Style buttons
    [minimizeButton, clearButton, closeButton].forEach(button => {
        button.style.background = 'none';
        button.style.border = '2px solid white';
        button.style.color = 'white';
        button.style.marginLeft = '5px';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '3px';
        button.style.padding = '2px 5px';
        button.style.width = '20px';
    });

    // Add trash can icon to clear button
    clearButton.innerHTML = '🗑️'; // Trash can icon
    clearButton.style.borderRadius = '50%'; // Round icon style

    // Append buttons to header
    loggerHeader.appendChild(title);
    loggerHeader.appendChild(minimizeButton);
    loggerHeader.appendChild(clearButton);
    loggerHeader.appendChild(closeButton);
    loggerWindow.appendChild(loggerHeader);

    // Logger content styles
    loggerContent.style.overflowY = 'auto';
    loggerContent.style.flex = '1';
    loggerContent.style.padding = '5px';
    loggerContent.style.display = 'block';
    loggerWindow.appendChild(loggerContent);

    // Create input field and execute button
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.padding = '5px';
    inputContainer.style.borderTop = '1px solid #ccc';

    const jsInput = document.createElement('input');
    jsInput.type = 'text';
    jsInput.placeholder = 'Enter JavaScript code';
    jsInput.style.flex = '1';
    jsInput.style.padding = '5px';
    jsInput.style.border = '1px solid #ccc';
    jsInput.style.borderRadius = '3px';
    jsInput.style.marginRight = '5px';

    const executeButton = document.createElement('button');
    executeButton.textContent = 'Run';
    executeButton.style.padding = '5px 10px';
    executeButton.style.border = 'none';
    executeButton.style.backgroundColor = '#007bff';
    executeButton.style.color = 'white';
    executeButton.style.borderRadius = '3px';
    executeButton.style.cursor = 'pointer';

    inputContainer.appendChild(jsInput);
    inputContainer.appendChild(executeButton);
    loggerWindow.appendChild(inputContainer);

    // Create resize handle
    resizeHandle.style.width = '10px';
    resizeHandle.style.height = '10px';
    resizeHandle.style.backgroundColor = '#007bff';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.bottom = '5px';
    resizeHandle.style.right = '5px';
    resizeHandle.style.cursor = 'nwse-resize';
    loggerWindow.appendChild(resizeHandle);

    // Append logger to body
    document.body.appendChild(loggerWindow);

    // Draggable functionality
    let isDragging = false;
    let offsetX, offsetY;
    let loggerWindowHeight = "auto";

    loggerHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - loggerWindow.getBoundingClientRect().left;
        offsetY = e.clientY - loggerWindow.getBoundingClientRect().top;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            loggerWindow.style.left = `${e.clientX - offsetX}px`;
            loggerWindow.style.top = `${e.clientY - offsetY}px`;
        }
    });

    // Minimize functionality
    minimizeButton.addEventListener('click', () => {
        if (loggerContent.style.display === 'none') {
            loggerContent.style.display = 'block';
            inputContainer.style.display = 'flex';
            resizeHandle.style.display = 'block';
            minimizeButton.textContent = '-';
            loggerWindow.style.height = loggerWindowHeight;
        } else {
            loggerContent.style.display = 'none';
            inputContainer.style.display = 'none';
            resizeHandle.style.display = 'none';
            loggerWindowHeight = loggerWindow.style.height;
            loggerWindow.style.height = "auto";
            minimizeButton.textContent = '+';
        }
    });

    // Close functionality
    closeButton.addEventListener('click', () => {
        loggerWindow.style.display = 'none';
    });

    // Log messages in the logger
    window.logger = {};
    logger.log = function(message) {
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        logEntry.style.padding = '5px';
        logEntry.style.borderRadius = '3px';
        loggerContent.appendChild(logEntry);
        loggerContent.scrollTop = loggerContent.scrollHeight;
    };

    // Clear log content
    clearButton.addEventListener('click', () => {
        loggerContent.innerHTML = '';
    });

    // Resize functionality
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(loggerWindow).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(loggerWindow).height, 10);
        e.preventDefault();
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            loggerWindow.style.width = `${startWidth + e.clientX - startX}px`;
            loggerWindow.style.height = `${startHeight + e.clientY - startY}px`;
        }
    });

    // Execute JavaScript from input
    function executeJS() {
        const code = jsInput.value;
        try {
            const result = eval(code);
            logger.log(`> ${code}\nResult: ${result}`);
        } catch (error) {
            logger.log(`> ${code}\nError: ${error}`);
        }
    }

    // Event listeners for execution and Enter key
    executeButton.addEventListener('click', executeJS);
    jsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeJS();
        }
    });
})();
