const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const upload = multer({
    dest: 'public/uploads/',
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only JPG and PNG files are allowed!'));
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('page1');
});

app.post('/upload', upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'frames', maxCount: 2 },
]), (req, res) => {
    const images = req.files['images'] || [];
    const frames = req.files['frames'] || [];
    if (images.length === 0 || frames.length < 2) {
        return res.status(400).send('Please upload images and at least 2 frames!');
    }
    res.render('page2', { images, frames });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
