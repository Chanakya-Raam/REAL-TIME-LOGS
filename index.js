const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Route to serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Read the CSV file and send logs over WebSocket
function sendLogsToClients() {
  fs.createReadStream('C:/Users/chana/real-time-logs/syslogs.csv')
    .pipe(csv())
    .on('data', (row) => {
      const logEntry = `${row['Level']},${row['Date and Time']},${row['Source']},${row['Event ID']},${row['Task Category']}`;
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(logEntry);
        }
      });
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    })
    .on('error', (error) => {
      console.error(`Error reading CSV file: ${error}`);
    });
}

// Start sending logs to clients
sendLogsToClients();

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
