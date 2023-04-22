require('dotenv').config();
const functions = require('firebase-functions')
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const exampleQuizRoutes = require('./routes/exampleQuizRouter');

const multer = require('multer')
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

app.use('/api', exampleQuizRoutes)

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "file is too large",
            });
        }

        if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                message: "File limit reached",
            });
        }

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: "File must be an image",
            });
        }
    }
});

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`)
})

// module.exports = app
app.get('/api', (req, res) => {
    res.send({ 'status': 0});
  });
exports.api = functions.https.onRequest(app) 