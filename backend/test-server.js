const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json({ message: 'Test OK' });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});

