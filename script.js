// script.js

document.addEventListener('DOMContentLoaded', function() {
    const socket = new WebSocket('ws://localhost:3000');
    const logsElement = document.getElementById('logs');

    socket.addEventListener('message', (event) => {
        const logData = event.data.split(',');
        const logEntry = `
            <p>
                <strong>Level:</strong> ${logData[0]}<br>
                <strong>Date and Time:</strong> ${logData[1]}<br>
                <strong>Source:</strong> ${logData[2]}<br>
                <strong>Event ID:</strong> ${logData[3]}<br>
                <strong>Task Category:</strong> ${logData[4]}
            </p>
        `;
        logsElement.innerHTML += logEntry;
    });
});
