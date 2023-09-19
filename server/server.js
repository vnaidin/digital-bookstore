const express = require("express");
const cors = require("cors");
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

require('dotenv').config();
const HOST = process.env.APP_HOST;

const corsOptions = {
  origin: process.env.APP_MODE === 'development' ? 'http://localhost:3015' : `http://localhost`
};

const app = express();
const secureApp = express();

const httpServer = http.createServer(app);
httpServer.listen(80, () => {
  console.log(
    `Server started at ${new Date()
    } \nListening on HTTP `,
  );
});
app.get('*', function (req, res) {
  // redirect to HTTPS
  res.redirect('https://' + req.hostname + req.path);
});

const key = fs.readFileSync(process.env.SSL_KEY_PATH);//pem
const cert = fs.readFileSync(process.env.SSL_CERT_CHAIN_PATH);//crt

const httpsServer = https.createServer({ key, cert }, secureApp);
httpsServer.listen(443, () => {
  console.log(
    `Server started at ${new Date()
    } \nListening on HTTPS `,
  );
});

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Digital Bookstore CRUD",
      description: "Digital Bookstore Application API",
      license: {
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
      },
      version: "1.0.11"
    },
    servers: [
      {
        url: `${HOST}/api/`,
      },
    ],
    // schemes: ["http"],
    components: {
      securitySchemes: {
        bearer: {
          type: "http",
          scheme: "bearer",
          in: 'header',
          bearerFormat: 'bearer'
        },
      },
    },
  },
  apis: ["./app/routes/*.js"],
};

const specs = swaggerJsdoc(options);
secureApp.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
secureApp.use(cors(corsOptions));

// parse requests of content-type - application/json
secureApp.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
secureApp.use(express.urlencoded({ extended: true }));

// Have Node serve the files for our built React app
secureApp.use(express.static(path.resolve(__dirname, '..//build')));
// folder for media
secureApp.use(express.static(`${process.env.TOKEN_FILES_PATH}`, { maxAge: 43200 }));// caching for 12h

// database
const db = require("./app/models");

//db.sequelize.sync();
// force: true will drop the table if it already exists
const { initialDBFill } = require('./initDB')
db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Database with { force: true }');
  initialDBFill();
});

// routes
require('./app/routes/auth.route')(secureApp);
require('./app/routes/user.route')(secureApp);
require('./app/routes/item.route')(secureApp);
require('./app/routes/order.route')(secureApp);

// Handles any requests that don't match the ones above
secureApp.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, `..//build/index.html`));
});

// set port, listen for requests
/* app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
}); */
