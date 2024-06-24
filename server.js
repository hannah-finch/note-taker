const express = require('express');
const PORT = 3001;
const app = express();
const path = require('path');
const db = require('./db/db.json')
// Static middleware for serving assets in the public folder - Do I really need this if I'm routing to /notes anyway? With it, /notes and /notes.html will go to the same place. I could change the starter code for button to direct to /notes.html instead of /notes and then I wouldn't need the route for /notes at all
app.use(express.static("public"));

// GET Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// GET Route for notes html page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET api json notes
app.get('/api/notes', (req, res) => {
  res.json(db);
});

// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {})

app.listen(PORT, () =>
  console.log(`Serving app at http://localhost:${PORT}`)
);