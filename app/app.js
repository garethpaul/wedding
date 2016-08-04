// [START app]
'use strict';

const express = require('express');
const app = express();
const path = require("path");

// Utilize middleware for for serving files from public dir via /static
app.use('/static', express.static('public'));

// Serve Index
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
