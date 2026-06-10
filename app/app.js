// [START app]
'use strict';

const express = require('express');
const app = express();
const path = require('path');
const nunjucks = require('nunjucks');
const helmet = require('helmet');

const templatesPath = path.join(__dirname, 'public', 'templates');
nunjucks.configure(templatesPath, { autoescape: true });

app.disable('x-powered-by');

app.use(helmet({
      frameguard: { action: 'deny' },
      referrerPolicy: { policy: 'no-referrer' },
      contentSecurityPolicy: {
      directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                  "'self'",
                  'https://cdnjs.cloudflare.com',
                  'https://code.jquery.com',
                  'https://maxcdn.bootstrapcdn.com'
            ],
            styleSrc: [
                  "'self'",
                  "'unsafe-inline'",
                  'https://cdnjs.cloudflare.com',
                  'https://maxcdn.bootstrapcdn.com',
                  'https://netdna.bootstrapcdn.com'
            ],
            imgSrc: ["'self'", 'data:'],
            fontSrc: ["'self'", 'https://netdna.bootstrapcdn.com'],
            frameSrc: ['https://www.openstreetmap.org'],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"]
      }
      },
      strictTransportSecurity: {
            maxAge: 31536000,
            includeSubDomains: true
      }
}));

// Utilize middleware for serving files from public dir via /static
app.use('/static', express.static(path.join(__dirname, 'public')));

// Serve Index
app.get('/', (req,res) => {
  var output = nunjucks.render('index.html', {
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output)
});

// Serve Our Story
app.get('/our-story', (req,res) => {
  var output = nunjucks.render('our_story.html', {
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output);
});

// The Big Day
app.get('/the-big-day', (req,res) => {
  var output = nunjucks.render('the_big_day.html', {
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output);
});

// Accomodation
app.get('/accomodation', (req,res) => {
  var output = nunjucks.render('accomodation.html', {
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output);
});

// Explore
app.get('/explore', (req,res) => {
  var output = nunjucks.render('explore.html', {
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output);
});

// Explore
app.get('/song-requests', (req,res) => {
  var output = nunjucks.render('songs.html', {
      title: 'Kristine + Gareth'
  });
  res.status(200).send(output);
});

// Registry
app.get('/registry', (req,res) => {
  var output = nunjucks.render('registry.html', {
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
