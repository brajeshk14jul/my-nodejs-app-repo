const express = require('express');
const app = express();
var PORT = 3000;


// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Node.js!',
    status: 'running',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});


app.get('/message', (req, res) => {
  res.send("This message is send from Brajesh through node application");
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Sample API route
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Brajesh', role: 'admin' },
    { id: 2, name: 'Rudra', role: 'user' },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
