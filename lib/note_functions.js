// dependencies
const fs = require("fs"); // for writing files
const path = require("path"); // for concatenating file paths

//-----------//
// functions //
//-----------//
// validate note obj and return true/false
function validateNote(data) {
    if (!data.title || typeof data.title !== "string") {
        return false;
    }
    if (!data.text || typeof data.text !== "string") {
        return false;
    } if (!data.id || typeof data.id !== "string") {
        return false;
    }
    // else
    return true;
}

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
    fs.writeFile(path.join(__dirname, "../db/db.json"), textBase, (err) => {
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
    fs.writeFile(path.join(__dirname, "../db/db.json"), textBase, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Note with id of " + id + " successfully deleted.");
        }
    });
}

module.exports = {createNote, deleteNote, validateNote};