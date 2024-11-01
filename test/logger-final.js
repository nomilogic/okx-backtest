// logger.js
class Resizer {
    constructor(element) {
        this.element = element;
        this.createResizeHandles();
    }

    createResizeHandles() {
        const positions = [
            { name: 'top-left', cursor: 'nwse-resize' },
            { name: 'top-right', cursor: 'nesw-resize' },
            { name: 'bottom-left', cursor: 'nesw-resize' },
            { name: 'bottom-right', cursor: 'nwse-resize' },
            { name: 'top', cursor: 'ns-resize' },
            { name: 'bottom', cursor: 'ns-resize' },
            { name: 'left', cursor: 'ew-resize' },
            { name: 'right', cursor: 'ew-resize' },
        ];

        positions.forEach(pos => this.createResizeHandle(pos));
    }

    createResizeHandle(position) {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${position.name}`;
        handle.style.position = 'absolute';
        handle.style.width = '8px';
        handle.style.height = '8px';
        handle.style.backgroundColor = 'transparent';
        handle.style.cursor = position.cursor;

        switch (position.name) {
            case 'top-left':
                handle.style.top = '0';
                handle.style.left = '0';
                handle.style.zIndex= 1001;;

                break;
            case 'top-right':
                handle.style.top = '0';
                handle.style.right = '0';
                handle.style.zIndex= 1001;;
                break;
            case 'bottom-left':
                handle.style.bottom = '0';
                handle.style.left = '0';
                handle.style.zIndex= 1001;;
                break;
            case 'bottom-right':
                handle.style.bottom = '0';
                handle.style.right = '0';
                handle.style.zIndex= 1001;;
                break;
            case 'top':
                handle.style.top = '0';
                handle.style.left = '50%';
                handle.style.transform = 'translateX(-50%)';
                handle.style.width = '100%';
                break;
            case 'bottom':
                handle.style.bottom = '0';
                handle.style.left = '50%';
                handle.style.transform = 'translateX(-50%)';
                handle.style.width = '100%';
                break;
            case 'left':
                handle.style.left = '0';
                handle.style.top = '50%';
                handle.style.transform = 'translateY(-50%)';
                handle.style.height = '100%';
                break;
            case 'right':
                handle.style.right = '0';
                handle.style.top = '50%';
                handle.style.transform = 'translateY(-50%)';
                handle.style.height = '100%';
                break;
        }

        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startResizing(e, position);
        });

        this.element.appendChild(handle);
    }

    startResizing(e, position) {
        let isResizing = true;
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(getComputedStyle(this.element).width, 10);
        const startHeight = parseInt(getComputedStyle(this.element).height, 10);
        const startTop = parseInt(getComputedStyle(this.element).top, 10);
        const startLeft = parseInt(getComputedStyle(this.element).left, 10);

        const onMouseMove = (e) => {
            if (!isResizing) return;

            switch (position.name) {
                case 'bottom-right':
                    this.element.style.width = `${startWidth + e.clientX - startX}px`;
                    this.element.style.height = `${startHeight + e.clientY - startY}px`;
                    break;
                case 'bottom-left':
                    this.element.style.width = `${startWidth - (e.clientX - startX)}px`;
                    this.element.style.height = `${startHeight + e.clientY - startY}px`;
                    this.element.style.left = `${startLeft + (e.clientX - startX)}px`;
                    break;
                case 'top-right':
                    this.element.style.width = `${startWidth + e.clientX - startX}px`;
                    this.element.style.height = `${startHeight - (e.clientY - startY)}px`;
                    this.element.style.top = `${startTop + (e.clientY - startY)}px`;
                    break;
                case 'top-left':
                    this.element.style.width = `${startWidth - (e.clientX - startX)}px`;
                    this.element.style.height = `${startHeight - (e.clientY - startY)}px`;
                    this.element.style.left = `${startLeft + (e.clientX - startX)}px`;
                    this.element.style.top = `${startTop + (e.clientY - startY)}px`;
                    break;
                case 'top':
                    this.element.style.height = `${startHeight - (e.clientY - startY)}px`;
                    this.element.style.top = `${startTop + (e.clientY - startY)}px`;
                    break;
                case 'bottom':
                    this.element.style.height = `${startHeight + e.clientY - startY}px`;
                    break;
                case 'left':
                    this.element.style.width = `${startWidth - (e.clientX - startX)}px`;
                    this.element.style.left = `${startLeft + (e.clientX - startX)}px`;
                    break;
                case 'right':
                    this.element.style.width = `${startWidth + e.clientX - startX}px`;
                    break;
            }
        };

        const onMouseUp = () => {
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
}

(function() {
    // Create and style the logger window
    const loggerWindow = document.createElement('div');
    const loggerHeader = document.createElement('div');
    const loggerContent = document.createElement('div');
    const minimizeButton = document.createElement('button');
    const closeButton = document.createElement('button');
    const resizeHandle = document.createElement('div');
    const clearButton = document.createElement('button'); // Moved clear button to the top
    new Resizer(loggerWindow);


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
    title.style.textAlign = 'left';
    title.style.padding = '2px';

    minimizeButton.textContent = '-';
    closeButton.textContent = 'X';
    clearButton.innerHTML = '⊘'; // Trash can icon

    // Style buttons
    [minimizeButton, closeButton, clearButton].forEach(button => {
        button.style.background = 'none';
        button.style.border = '2px solid white';
        button.style.color = 'white';
        button.style.marginLeft = '5px';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '3px';
        button.style.width = '30px';
        button.style.height = '30px';
    });

    // Append buttons to header
    loggerHeader.appendChild(title);
    loggerHeader.appendChild(minimizeButton);
    loggerHeader.appendChild(closeButton);
    loggerHeader.appendChild(clearButton);
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

    clearButton.addEventListener('click', () => {
        loggerContent.innerHTML = '';
    });

    // Redirect console messages to logger
    ['log', 'warn', 'error'].forEach(level => {
        const original = console[level];
        console[level] = function(...args) {
           
            logger.log(...args);
            original.apply(console, args);
        };
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
        jsInput.value   ="";
    }

    // Event listeners for execution and Enter key
    executeButton.addEventListener('click', executeJS);
    const commandHistory = [];
    let historyIndex = -1;

    jsInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const code = jsInput.value;
            logger.log(`> ${code}`);
            commandHistory.push(code);
            historyIndex = commandHistory.length; // reset index after new entry

            try {
                const result = eval(code);
                logger.log(result);
            } catch (error) {
                logger.log(`Error: ${error.message}`);
            }

            jsInput.value = '';
        } else if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                jsInput.value = commandHistory[historyIndex] || '';
            }
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                jsInput.value = commandHistory[historyIndex] || '';
            } else {
                historyIndex = commandHistory.length; // reset index if at the end
                jsInput.value = '';
            }
        }
    }); 



    
})();
