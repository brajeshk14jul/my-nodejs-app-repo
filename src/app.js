const express = require('express');
const app = express();
const PORT = 3000;


// Home route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from My Node.js App!',
    status: 'running',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});


app.get('/message', (req, res) => {
  res.status(200).send("This message is send from Brajesh through node application");
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Sample API route
app.get('/api/users', (req, res) => {
  res.status(200).json([
    { id: 1, name: 'Brajesh', role: 'admin' },
    { id: 2, name: 'Rudra', role: 'user' },
  ]);
});

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// Only start server if not in test mode
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
