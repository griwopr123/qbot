const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('message', (event, message) => {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML += `<p>${message}</p>`;
    });
});