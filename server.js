// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//var exphbs = require('express-handlebars');//handlebars
//var methodOverride = require('method-override');

// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server 
// ==============================================================================
var app = express();
//Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + '/public'));

var PORT = process.env.PORT || 8080; // Sets an initial port. We'll use this later in our listener
// override with POST having ?_method=DELETE
//app.use(methodOverride('_method'));

// ==============================================================================
//setup handlesbars templating engine
// ==============================================================================
//app.engine('handlebars', exphbs({
 //   defaultLayout: 'main'
//}));
//app.set('view engine', 'handlebars');

// BodyParser makes it easy for our server to interpret data sent to it.
// The code below is pretty standard.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs. 
// ================================================================================

require('./controllers/api-routes.js')(app); 
//require('./controllers/html-routes.js')(app);

app.listen(PORT, function() {
    console.log("Server listening on PORT: " + PORT);
});