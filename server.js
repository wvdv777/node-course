
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

// app.set lets us set a lot of express related configurations in this case
// it sets hbs as its view engine
app.set('view engine', 'hbs');


// middleware lets you configure how your express application works
// it allows you to add on the existing functionality that express offers
// in order to add some middleware we call app.use, it takes the middleware
// function you want to use

// making partials and giving the directory to them
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(__dirname + "/public"));

// If we do something async the middleware is not going to move on
// only when we call next()
// if we have middleware that doesn't call next our application will be stuck
app.use((req, res, next) =>{
  var now = new Date().toString();
  var log = (`${now}: ${req.method} ${req.url}`);

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) =>{
    if(err){
      console.log("Unable to append to server.log")
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs')
// });

hbs.registerHelper('getCurrentYear', () =>{
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) =>{
  return text.toUpperCase()
});

// sets the handler for an http get request
// get() has 2 arguments: URL, second is the function to run
// the function is going to be called with 2 arguments
// req >> strores info about the request coming in
// res >> has a bunch of methods available so you can respond to the HTTP request as you like
app.get('/', (req, res) =>{
  res.render('home.hbs',{
    pageTitle: 'Home page',
    welcomeMessage: "Welcome to my website"
  });
});



app.get('/about', (req, res) =>{
  // now renders the hbs file, the second argument is an object
  res.render('about.hbs', {
    pageTitle: 'About page'
  });
});

/// bad -send back json with error message

app.get('/bad',(req,res) =>{
  res.send({
    error: "This went bad af"
  });
})



// binds the application to a port on our machine
// second arg is a function which fires when server is running
app.listen(3000, () =>{
  console.log("server is up on port 3000")
});
