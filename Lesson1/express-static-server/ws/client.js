const {WebSocket} = require('ws');
// const ws1 = new WebSocket('ws://localhost:8080');

// ws1.on('error', console.error);

// ws1.on('open', function open() {
//     console.log('connected')  
//     ws1.send('C1 Hello');
// });

// ws1.on('message', function message(data) {
//   console.log('C1 received: %s', data);
// });

// const ws2 = new WebSocket('ws://localhost:8080');

// ws2.on('error', console.error);

// ws2.on('open', function open() {
//     console.log('connected')  
//     ws2.send('C2 Hello');
// });

// ws2.on('message', function message(data) {
//   console.log('C2 received: %s', data);
// });

// const ws3 = new WebSocket('ws://localhost:8080');

// ws3.on('error', console.error);

// ws3.on('open', function open() {
//     console.log('connected')  
//     ws3.send('C3 Hello');
// });

// ws3.on('message', function message(data) {
//   console.log('C3 received: %s', data);
// });

const wsClientFactory = (id) => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.on('error', console.error);

    ws.on('open', function open() {
        console.log(`connected ${id} `)  
        ws.send(`${id} Hello`);
    });
    
    ws.on('message', function message(data) {
      console.log(`${id} received: %s`, data);
    });
    
}

const wsClient1 = wsClientFactory(1);
const wsClient2 = wsClientFactory(2);
const wsClient3 = wsClientFactory(3);