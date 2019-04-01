const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true
});

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Create a scheme for items in the museum: a title and a path and a description to an image.
const challengeSchema = new mongoose.Schema({
  name: String,
  date: String,
  skillLevel: String,
});

// Create a model for items in the museum.
const Challenge = mongoose.model('Challenge', challengeSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/challenges', async (req, res) => {
  const challenge = new Challenge({
    name: req.body.name,
    date: req.body.date.toString(),
    skillLevel: req.body.skillLevel,
  });
  try {
    await challenge.save();
    res.send(challenge);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/challenges', async (req, res) => {
  try {
    let challenges = await Challenge.find();
    res.send(challenges);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Delete item from the database BACKEND
app.delete('/api/challenges/:id', async (req, res) => {
  try {
    await Challenge.deleteOne({
      _id: req.params.id,
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/challenges/:id', async (req, res) => {
  try {
    let challenge = await Challenge.findOne({
      _id: req.params.id,
    });
    challenge.name = req.body.name;
    challenge.date = req.body.date;
    challenge.skillLevel = req.body.skillLevel;
    await challenge.save();
    res.send(challenge);
    // res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
