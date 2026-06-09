// [START app]
'use strict';

const express = require('express');
const app = express();
const path = require("path");
const swig  = require('swig');
const helmet = require('helmet')

app.disable('x-powered-by');

app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(helmet.xssFilter());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(helmet.contentSecurityPolicy({
      directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                  "'self'",
                  "'unsafe-inline'",
                  'https://cdnjs.cloudflare.com',
                  'https://code.jquery.com',
                  'https://maxcdn.bootstrapcdn.com',
                  'https://www.google-analytics.com',
                  'https://widget.zola.com'
            ],
            styleSrc: [
                  "'self'",
                  "'unsafe-inline'",
                  'https://cdnjs.cloudflare.com',
                  'https://maxcdn.bootstrapcdn.com',
                  'https://netdna.bootstrapcdn.com'
            ],
            imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com'],
            fontSrc: ["'self'", 'https://netdna.bootstrapcdn.com'],
            frameSrc: ['https://www.openstreetmap.org'],
            connectSrc: ["'self'", 'https://www.google-analytics.com'],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"]
      }
}));
app.use(helmet.hsts({
      maxAge: 31536000000,
      includeSubdomains: true,
      force: true
}));

// Utilize middleware for serving files from public dir via /static
app.use('/static', express.static(path.join(__dirname, 'public')));

// Serve Index
app.get('/', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/index.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output)
});

// Serve Our Story
app.get('/our-story', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/our_story.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output);
});

// The Big Day
app.get('/the-big-day', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/the_big_day.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output);
});

// Accomodation
app.get('/accomodation', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/accomodation.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output);
});

// Explore
app.get('/explore', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/explore.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output);
});

// Explore
app.get('/song-requests', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/songs.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output);
});

// Registry
app.get('/registry', (req,res) => {
  var template = swig.compileFile(path.join(__dirname+'/public/templates/registry.html'));
  var output = template({
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output);
});

if (require.main === module) {
  // Start the server
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
}

module.exports = app;
// [END app]
