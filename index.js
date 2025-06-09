const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'https://fe-e7v373qzc-chiranjivi-poudels-projects.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
