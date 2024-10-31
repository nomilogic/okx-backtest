// logger.js

(function() {
    // Create and style the logger window
    const loggerWindow = document.createElement('div');
    const loggerHeader = document.createElement('div');
    const loggerContent = document.createElement('div');
    const minimizeButton = document.createElement('button');
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
    [minimizeButton, closeButton].forEach(button => {
        button.style.background = 'none';
        button.style.border = '2px solid white';
        button.style.color = 'white';
        button.style.marginLeft = '5px';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '3px';
        button.style.padding = '2px 5px';
        button.style.width = '20px';
    });

    // Append buttons to header
    loggerHeader.appendChild(title);
    loggerHeader.appendChild(minimizeButton);
    loggerHeader.appendChild(closeButton);
    loggerWindow.appendChild(loggerHeader);

    // Logger content styles
    loggerContent.style.overflowY = 'auto';
    loggerContent.style.flex = '1';
    loggerContent.style.padding = '5px';
    loggerContent.style.display = 'block';
    loggerWindow.appendChild(loggerContent);

    // Create input field and button for executing JavaScript
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

    // Create a tree node to display structured data
    function createTreeNode(key, value) {
        const treeNode = document.createElement('div');
        treeNode.style.padding = '1px';
        treeNode.style.borderRadius = '3px';

        const toggleButton = document.createElement('span');
        toggleButton.textContent = '▶';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.marginRight = '5px';

        const keyValueContainer = document.createElement('span');
        keyValueContainer.textContent = `${key}: `;

        if (typeof value === 'object' && value !== null) {
            const childContainer = document.createElement('div');
            childContainer.style.paddingLeft = '20px';
            childContainer.style.display = 'none';

            toggleButton.addEventListener('click', () => {
                const isCollapsed = childContainer.style.display === 'none';
                childContainer.style.display = isCollapsed ? 'block' : 'none';
                toggleButton.textContent = isCollapsed ? '▼' : '▶';
            });

            for (const [childKey, childValue] of Object.entries(value)) {
                const childNode = createTreeNode(childKey, childValue);
                childContainer.appendChild(childNode);
            }

            treeNode.appendChild(toggleButton);
            treeNode.appendChild(keyValueContainer);
            treeNode.appendChild(childContainer);
        } else {
            keyValueContainer.textContent += value;
            treeNode.appendChild(keyValueContainer);
        }

        return treeNode;
    }

    // Log messages in the logger
    window.logger = {};
    logger.log = function(message) {
        const logEntry = document.createElement('div');
        if (typeof message === 'object' && message !== null) {
            const rootNode = createTreeNode('Object', message);
            logEntry.appendChild(rootNode);
        } else {
            logEntry.textContent = message;
        }
        logEntry.style.padding = '5px';
        logEntry.style.borderRadius = '3px';
        loggerContent.appendChild(logEntry);
        loggerContent.scrollTop = loggerContent.scrollHeight;
    };

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

    // Redirect console messages to logger
    ['log', 'warn', 'error'].forEach(level => {
        const original = console[level];
        console[level] = function(...args) {
            logger.log(args.join(' '));
            original.apply(console, args);
        };
    });

    // Execute JavaScript from input
    executeButton.addEventListener('click', () => {
        const code = jsInput.value;
        try {
            const result = eval(code);
            logger.log(`> ${code}\nResult: ${result}`);
        } catch (error) {
            logger.log(`> ${code}\nError: ${error}`);
        }
    });
})();
