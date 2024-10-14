const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes.js');
const app = express();
const fileupload = require('express-fileupload'); 
const config = require('./config');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const userController     = require('./controllers/UserController');

cloudinary.config({
  cloud_name: 'dijoga0up',
  api_key: '941448999678395',
  api_secret: '1JWhmHBIrQDjbBdwtuH9m0GiBpQ',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Carpeta en Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Formatos permitidos
  },
});

const upload = multer({ storage });

app.post('/api/upload', upload.array('images', 10), userController.uploadResource);


// Configuracion para evitar errores de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use(fileupload({useTempFiles: true}))

console.log(config)

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// Put all API endpoints under '/api'
app.get('/api/status', (req, res) => {
  res.json({message: 'ok'})
});

app.use('/api', routes)

// Serve static files from the React app
const root = path.join(__dirname, 'client/build');
app.use(express.static(root));
app.get("*", (req, res) => {
  res.sendFile('index.html', { root });
});

try {
  mongoose.connect(config.mongo_uri)
    .then(() => console.log('Connected!'));
}catch (e) {
  console.log('Connection error!', JSON.stringify(e))
}

app.listen(process.env.PORT || 5000);

console.log('App running and listening on 5000');