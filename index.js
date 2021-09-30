const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const expressFileupload = require('express-fileupload');
const path = require('path');

dotenv.config({path : 'config.env'})
const PORT = process.env.PORT || 8080

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressFileupload())

app.set('view engine', 'ejs')

app.use('/css', express.static(path.resolve(__dirname, 'assets/css')))
app.use('/img', express.static(path.resolve(__dirname, 'assets/img')))
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')))

app.use('/', require('./server/routes/route'))

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})