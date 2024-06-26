const express = require('express');
const PORT = 3001;
const app = express();

const path = require('path');

const fs = require('fs');
const db = require('./db/db.json')
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
// Static middleware for serving assets in the public folder - Do I really need this if I'm routing to /notes anyway? With it, /notes and /notes.html will go to the same place. I could change the starter code for button to direct to /notes.html instead of /notes and then I wouldn't need the route for /notes at all
// I def don't need it, but I am bored, so here it is, it's just a bonus
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET Route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});;

// GET Route for notes html page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET api json notes
app.get('/api/notes', (req, res) => {
  res.json(db);
});

// * `POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  if (title) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    // obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.push(newNote);

        //Write updated reviews back to the file
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes),
      (writeErr) => writeErr
        ? console.error(writeErr)
        : console.info('Successfully updated notes'));
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note, must have a title');
  }
});

// For a bonus, make a delete thingy. 
// `DELETE /api/notes/:id` should receive a query parameter that contains the id of a note to delete. To delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.

app.listen(PORT, () =>
  console.log(`Serving app at http://localhost:${PORT}`)
);