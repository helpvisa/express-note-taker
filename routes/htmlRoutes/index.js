// dependencies
const path = require("path"); // for concatenating file paths
const router = require("express").Router(); // for routing to app

// static pages
// serve homepage
router.get("/", (req, res) => { // default pathway, home page
    res.sendFile(path.join(__dirname, "../../public/index.html"));
});

// serve notes page
router.get("/notes", (req, res) => { // notes page
    res.sendFile(path.join(__dirname, "../../public/notes.html"));
});

// export routes
module.exports = router;