// server dependencies
const express = require("express"); // express.js node package
const path = require("path"); // path package for concatenating file paths
const fs = require("fs"); // write to file
const db = require("./db/db.json"); // notes database

// set port; use environment variable setting if available, otherwise use local port 3005
const PORT = process.env.PORT || 3005;

// instantiate server
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({extended: true}));
// parse incoming JSON data
app.use(express.json());
// error handling, if inputted JSON is incorrect
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) { // if syntax error in JSON input
        console.error(err); // log error
        return res.status(400).send({status: 400, message: err.message}); // bad input, error 400
    }
    next();
});

// set public path for static pages
app.use(express.static('public'));

// set up routes here
// static page routes
app.get("/", (req, res) => { // default pathway, home page
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/notes", (req, res) => { // notes page
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
// api routes
// fetch notes
app.get("/api/notes", (req, res) => {
    // fetch notes from database
    let notes = db;

    // return json to user
    res.json(notes);
});
// save a note (with POST)
app.post("/api/notes", (req, res) => {
    // note is stored in req.body
    // get an id for this note
    req.body.id = db.length.toString(); // convert db note array length to string and tack to body

    // validation function should go here
    //

    // if validation passes, create note and add to db
    createNote(req.body, db);
    // return this info to show user the JSON of their newly created note (if necessary)
    res.json(req.body);
});
app.delete("/api/notes/:id", (req, res) => {
    // call note delete function
    deleteNote(req.params.id, db);

    // return info to user
    res.send("Note with id of " + req.params.id + " has been successfully deleted.");
});
//-------------------

// wildcard route, comes last, redirects to home
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// run listen server
app.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}.`);
});

//-----------//
// functions //
//-----------//
// should move these into bespoke set of files at some point
// create note obj and return it
function createNote(data, base) { // data is note, base is local database
    // create new note object
    const newNote =  {
        title: data.title,
        text: data.text,
        id: data.id
    };
    // log to server console
    console.log("New note created: " + JSON.stringify(newNote));

    // add to database
    base.push(newNote);

    // convert database back to string format, preserve nice formatting for readability
    let textBase = JSON.stringify(base, null, 2);

    // now write to base
    fs.writeFile(path.join(__dirname, "./db/db.json"), textBase, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("New note successfully saved to server database.");
        }
    });
}

// delete note object by id, rewrite database with appropriate IDs
function deleteNote(id, base) { // id is note id, base is local database
    // remove this note in particular (id should correspond to where it is in array)
    base.splice(id, 1);

    // re-assign note IDs in for loop
    for (let i = 0; i < base.length; i++) {
        base[i].id = i.toString(); // reassign id
    }

    // convert base to string
    let textBase = JSON.stringify(base, null, 2);

    // no rewrite base to disk
    fs.writeFile(path.join(__dirname, "./db/db.json"), textBase, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Note with id of " + id + " successfully deleted.");
        }
    });
}