const fs = require('fs');
const express = require('express');
const path = require('path');
const { notes } = require('./db/db.json');
const { Z_NO_COMPRESSION } = require('zlib');

const PORT = process.env.PORT || 3001;
const app = express();
const notesArray = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}

function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray}, null, 2)
    );
    return note;
}

app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
        results = (req.query, results);
    }
    res.json(results);
});

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
    }
    else {
        res.send(404);
    }
})

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
    const note = createNewNote(req.body, notes);
    return res.json(note);
})

app.delete('/api/notes/:id', (req, res) => {
    notes.filter((note) => note.id !== req.params.id);
    let newNote = notes.filter((note) => note.id !== req.params.id);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: newNote}, null, 2)
    );
    return res.json(note);
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
