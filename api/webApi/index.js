require('dotenv').config();
var express = require('express');
var mongoose = require('mongoose');
var mongoString = process.env.DATABASE_URL;
var exampleQuizRoutes = require('./routes/exampleQuizRouter')

var multer = require('multer');
mongoose.connect(mongoString);
var database = mongoose.connection;
database.on('error', function (error) {
    console.log(error);
});

var app = express();
app.use(express.json());
var cors = require('cors');
app.use(cors({
    origin: '*'
}));

app.use('/api', exampleQuizRoutes);

app.use(function (error, req, res, next) {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "file is too large"
            });
        }
        if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                message: "File limit reached"
            });
        }
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: "File must be an image"
            });
        }
    }
});
var PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`)
})
// module.exports = app
//exports.api = functions.https.onRequest(app);