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
  var template = swig.compileFile(path.join(__dirname+'/public/index.html'));
  var output = template({
      title: 'Kristine + Gareth',
      authors: ['Paul', 'Jim', 'Jane']
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
