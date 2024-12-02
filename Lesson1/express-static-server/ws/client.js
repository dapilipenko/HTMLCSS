const readline = require('node:readline');
const {ChatClient} = require('./client/ChatClient');

const sessionIdIndex = process.argv.indexOf('--sessionId');
const nameIndex = process.argv.indexOf('--name');
const keyIndex = process.argv.indexOf('--key');

if(sessionIdIndex === -1 && nameIndex === -1){
    console.error('Arguments sessionId or name is required');
    process.exit(1);
}

const sessionId = sessionIdIndex !== -1 ? process.argv[sessionIdIndex + 1] : null;
const name = nameIndex !== -1 ? process.argv[nameIndex + 1] : null;
const key = keyIndex !== -1 ? process.argv[keyIndex + 1] : null;

init(name, sessionId, key);

function init (name, sessionId, key){
    const client = new ChatClient ({
        url:'ws://localhost:8080', 
        username: name, 
        sessionId: sessionId, 
        key: key});
    client.init();

    const chatInput = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    chatInput.on('line', (input) => {
        if (input.trim().toLowerCase() === 'exit'){
                chatInput.close();
            } else {
                client.send(input);
            }
    });
}