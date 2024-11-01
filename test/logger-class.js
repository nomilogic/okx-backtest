// Resizer.js
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
                break;
            case 'top-right':
                handle.style.top = '0';
                handle.style.right = '0';
                break;
            case 'bottom-left':
                handle.style.bottom = '0';
                handle.style.left = '0';
                break;
            case 'bottom-right':
                handle.style.bottom = '0';
                handle.style.right = '0';
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

// TreeNode.js
class TreeNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.element = this.createNode();
    }

    createNode() {
        const treeNode = document.createElement('div');
        treeNode.style.padding = '1px';
        treeNode.style.borderRadius = '3px';

        const toggleButton = document.createElement('span');
        toggleButton.textContent = '▶';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.marginRight = '5px';

        const keyValueContainer = document.createElement('span');
        keyValueContainer.textContent = `${this.key}: `;

        if (typeof this.value === 'object' && this.value !== null) {
            const childContainer = document.createElement('div');
            childContainer.style.paddingLeft = '20px';
            childContainer.style.display = 'none';

            toggleButton.addEventListener('click', () => {
                const isCollapsed = childContainer.style.display === 'none';
                childContainer.style.display = isCollapsed ? 'block' : 'none';
                toggleButton.textContent = isCollapsed ? '▼' : '▶';
            });

            for (const [childKey, childValue] of Object.entries(this.value)) {
                const childNode = new TreeNode(childKey, childValue);
                childContainer.appendChild(childNode.element);
            }

            treeNode.appendChild(toggleButton);
            treeNode.appendChild(keyValueContainer);
            treeNode.appendChild(childContainer);
        } else {
            keyValueContainer.textContent += this.value;
            treeNode.appendChild(keyValueContainer);
        }

        return treeNode;
    }
}

// Logger.js
class Logger {
    constructor() {
        this.createLoggerWindow();
    }

    createLoggerWindow() {
        this.loggerWindow = document.createElement('div');
        this.loggerHeader = document.createElement('div');
        this.loggerContent = document.createElement('div');
        this.clearButton = document.createElement('button');
        this.minimizeButton = document.createElement('button');
        this.closeButton = document.createElement('button');
        this.jsInput = document.createElement('input');
        this.executeButton = document.createElement('button');

        new Resizer(this.loggerWindow);
        this.setupStyles();
        this.setupEventListeners();
        this.appendElements();
    }

    setupStyles() {
        // Logger window styles
        this.loggerWindow.style.position = 'absolute';
        this.loggerWindow.style.top = '20px';
        this.loggerWindow.style.right = '20px';
        this.loggerWindow.style.width = '300px';
        this.loggerWindow.style.height = '400px';
        this.loggerWindow.style.border = '2px solid #ccc';
        this.loggerWindow.style.borderRadius = '5px';
        this.loggerWindow.style.backgroundColor = 'white';
        this.loggerWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        this.loggerWindow.style.zIndex = '1000';
        this.loggerWindow.style.display = 'flex';
        this.loggerWindow.style.flexDirection = 'column';
        this.loggerWindow.style.fontFamily = 'Arial';

        // Header styles
        this.loggerHeader.style.backgroundColor = '#007bff';
        this.loggerHeader.style.color = 'white';
        this.loggerHeader.style.padding = '10px';
        this.loggerHeader.style.display = 'flex';
        this.loggerHeader.style.justifyContent = 'space-between';

        // Content styles
        this.loggerContent.style.overflowY = 'auto';
        this.loggerContent.style.flexGrow = '1';
        this.loggerContent.style.padding = '10px';
        this.loggerContent.style.maxHeight = '300px'; // Adjust as needed
        this.loggerContent.style.border = '1px solid #ccc';
        this.loggerContent.style.borderRadius = '3px';

        // Input styles
        this.jsInput.style.width = 'calc(100% - 70px)';
        this.executeButton.textContent = 'Run';
        this.clearButton.textContent = 'Clear';
        this.minimizeButton.textContent = '−';
        this.closeButton.textContent = '×';
    }

    setupEventListeners() {
        this.clearButton.addEventListener('click', () => {
            this.loggerContent.innerHTML = ''; // Clear log messages
        });

        this.minimizeButton.addEventListener('click', () => {
            this.loggerContent.style.display = this.loggerContent.style.display === 'none' ? 'block' : 'none';
        });

        this.closeButton.addEventListener('click', () => {
            this.loggerWindow.style.display = 'none'; // Hide logger window
        });

        this.executeButton.addEventListener('click', () => {
            const code = this.jsInput.value;
            this.executeCode(code);
        });
    }

    appendElements() {
        // Append buttons to header
        this.loggerHeader.appendChild(this.clearButton);
        this.loggerHeader.appendChild(this.minimizeButton);
        this.loggerHeader.appendChild(this.closeButton);
        
        // Append header and content to logger window
        this.loggerWindow.appendChild(this.loggerHeader);
        this.loggerWindow.appendChild(this.loggerContent);
        
        // Create a row for JS execution
        const jsExecutionRow = document.createElement('div');
        jsExecutionRow.style.display = 'flex';
        jsExecutionRow.appendChild(this.jsInput);
        jsExecutionRow.appendChild(this.executeButton);
        this.loggerWindow.appendChild(jsExecutionRow);
        
        // Append logger window to body
        document.body.appendChild(this.loggerWindow);
    }

    executeCode(code) {
        try {
            const result = eval(code);
            this.log(`Executed: ${code}`, result);
        } catch (error) {
            this.log(`Error executing: ${code}`, error.message);
        }
        this.jsInput.value = ''; // Clear input after execution
    }

    log(message, data) {
        const messageElement = document.createElement('div');
        messageElement.style.border = '1px solid #ccc';
        messageElement.style.padding = '5px';
        messageElement.style.marginBottom = '5px';
        messageElement.style.borderRadius = '3px';
        
        if (typeof data === 'object') {
            const treeNode = new TreeNode(message, data);
            messageElement.appendChild(treeNode.element);
        } else {
            messageElement.textContent = message + (data ? `: ${data}` : '');
        }

        this.loggerContent.appendChild(messageElement);
        this.loggerContent.scrollTop = this.loggerContent.scrollHeight; // Auto-scroll to the bottom
    }
}

// Initialize Logger
const logger = new Logger();
logger.log('Logger initialized.');
logger.log('This is a test message', { example: 'data', moreData: [1, 2, 3] });

// Optional: Automatically log errors and warnings in the console

['log', 'warn', 'error'].forEach(level => {
    const original = console[level];
    console[level] = function(...args) {
       
        logger.log(...args);
        original.apply(console, args);
    };
});
