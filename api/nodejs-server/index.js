'use strict';

var app = require('connect')();
var http = require('http');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var fs = require('fs');
var serverPort = 80;


// swaggerRouter configuration
var options = {
  swaggerUi: '/swagger.json',
  controllers: './controllers',
  useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // custom error handler
  app.use(function(err, req, res, next) {
      if (typeof err !== 'object') {
        // If the object is not an Error, create a representation that appears to be
        err = {
          message: String(err) // Coerce to string
        };
      } else {
        // Ensure that err.message is enumerable (It is not by default)
        Object.defineProperty(err, 'message', { enumerable: true });
      }

      // Return a JSON representation of #/definitions/ErrorResponse
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 400;
      // let us extract out the error
      if (err.results) {
        let errlist=[];
        // console.log("** err", err)
        if (err.results.errors) {
          err.results.errors.map( (e) => {
            errlist.push({ message: e.message, code: e.code, field: e.path.join('.') })
          })
        }
        res.end(JSON.stringify({errors: errlist}), null, 2);
      } else {
        res.end(JSON.stringify(err));
      }



    });


  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());




  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });
});
