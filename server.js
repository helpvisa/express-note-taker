// server dependencies
const express = require("express"); // express.js node package
const path = require("path"); // path package for concatenating file paths
// routes
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

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

// use routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// wildcard route, comes last, redirects to home
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// run listen server
app.listen(PORT, () => {
    console.log(`Server now listening on port ${PORT}.`);
});
