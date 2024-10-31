(function() {  
    // Create console container  
    const consoleContainer = document.createElement('div');  
    consoleContainer.id = 'console';  
    document.body.appendChild(consoleContainer);  

    // Create output area  
    const output = document.createElement('div');  
    output.id = 'output';  
    consoleContainer.appendChild(output);  

    // Create input area  
    const input = document.createElement('input');  
    input.type = 'text';  
    input.id = 'input';  
    input.autofocus = true;  
    input.autocomplete = 'off';  
    consoleContainer.appendChild(input);  

    // Style the console using CSS  
    const style = document.createElement('style');  
    style.textContent = `  
        body {  
            background-color: #000;  
            color: #00ff00; /* Green text */  
            font-family: 'Courier New', Courier, monospace;  
            margin: 0;  
            height: 100vh;  
            overflow: hidden;  
        }  
        #console {  
            padding: 10px;  
            height: 100%;  
            overflow-y: auto;  
        }  
        #input {  
            width: 100%;  
            border: none;  
            background: transparent;  
            color: #00ff00;  
            outline: none;  
            font-size: 16px;  
        }  
    `;  
    document.head.appendChild(style);  

    // Handle input command  
    input.addEventListener('keydown', function(event) {  
        if (event.key === 'Enter') {  
            const command = input.value.trim();  
            executeCommand(command);  
            input.value = ''; // Clear the input  
        }  
    });  

    function executeCommand(command) {  
        const args = command.split(' '); // Split command into args  
        const cmd = args[0]; // First part is the command  
        const params = args.slice(1); // The rest are parameters  

        let response;  

        switch (cmd.toLowerCase()) {  
            case 'greet':  
                // Handle greet command with a name parameter  
                response = greetCommand(params);  
                break;  
            case 'add':  
                // Handle add command with two number parameters  
                response = addCommand(params);  
                break;  
            default:  
                response = `Unknown command: ${cmd}`;  
        }  

        output.innerHTML += `<div>> ${command}</div>`;  
        output.innerHTML += `<div>${response}</div>`;  
        output.scrollTop = output.scrollHeight; // Scroll to the bottom  
    }  

    function greetCommand(params) {  
        if (params.length === 0) {  
            return 'Hello, World!';  
        } else {  
            return `Hello, ${params.join(' ')}!`;  
        }  
    }  

    function addCommand(params) {  
        const numbers = params.map(Number);  
        const sum = numbers.reduce((acc, num) => acc + num, 0);  
        return `The sum is: ${sum}`;  
    }  
})();