// preload.js
window.connectWebSocket = function() {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onmessage = function(event) {
        const botPosition = JSON.parse(event.data);
        document.getElementById('coords').textContent = `x: ${botPosition.x}, y: ${botPosition.y}, z: ${botPosition.z}`;
    };
};
