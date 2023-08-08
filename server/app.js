const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3016;
require('dotenv').config();

const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '..//build')));
// Use routes
app.use(require('./routes'));

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument),
  );

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });
  
// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});