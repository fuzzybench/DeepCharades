const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/images', async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, 'public', 'images');
    const files = await fs.readdir(imagesDir);
    const imageUrls = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(file => `/images/${file}`);
    res.json(imageUrls);
  } catch (error) {
    console.error('Error reading image directory:', error);
    res.status(500).send('Error reading image directory');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
