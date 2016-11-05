// [START app]
'use strict';

const express = require('express');
const app = express();
const path = require("path");
const swig  = require('swig');

// Utilize middleware for for serving files from public dir via /static
app.use('/static', express.static('public'));

// Serve Index
app.get('/', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/index.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.send(200, output);
});

// Serve Our Story
app.get('/our-story', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/our_story.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.send(200, output);
});

// The Big Day
app.get('/the-big-day', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/the_big_day.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.send(200, output);
});

// Accomodation
app.get('/accomodation', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/accomodation.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.send(200, output);
});

// Explore
app.get('/explore', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/explore.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.send(200, output);
});

// Explore
app.get('/song-requests', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/songs.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.send(200, output);
});

// Registry
app.get('/registry', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/registry.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.send(200, output);
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
