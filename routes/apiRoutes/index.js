// dependencies
const {createNote, deleteNote, validateNote} = require("../../lib/note_functions"); // for note functions
const router = require("express").Router(); // for routing to app
const db = require("../../db/db"); // for writing to and reading from server database

// api routes
// fetch notes (with GET)
router.get("/notes", (req, res) => {
    // fetch notes from database
    let notes = db;

    // return json to user
    res.json(notes);
});

// save a note (with POST)
router.post("/notes", (req, res) => {
    // note is stored in req.body
    // create an id for this note
    req.body.id = db.length.toString(); // convert db note array length to string and tack to body

    // validate incoming note data
    if (!validateNote(req.body)) {
        // throw error 400 if anything is not formatted properly, or is missing
        res.status(400).send("Note not formatted properly!");
    } else {
        // if validation passes, create note and add to db
        createNote(req.body, db);
        // return this info to show user the JSON of their newly created note (if necessary)
        res.json(req.body);
    }
});

// delete a note by id (with DELETE)
router.delete("/notes/:id", (req, res) => {
    // call note delete function
    deleteNote(req.params.id, db);

    // return info to user
    res.send("Note with id of " + req.params.id + " has been successfully deleted.");
});

// export routes
module.exports = router;