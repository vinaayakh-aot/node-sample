// initialize the entire app in this file.

// Node.js follows the commonJS module system The basic functionality of require is that it reads
// a JavaScript file, executes the file, and then proceeds to return the export object

// imports only work on ES modules

// External libraries
const express = require('express');  // library used to serve APIs or Pages
const bodyParser = require('body-parser'); // used to parse json

const path = require('path');
const cluster = require('cluster');

const emitter = require('./emitter');

// Controllers
const apiController = require('./controllers/api');
const routerController = require('./controllers/router');

let counter = 0;

// example of middleware
const middleware = (req, res, next) => {
    counter++
    req.body = `This page was called ${counter} times.`;
    if (cluster.isWorker) {

        console.log('Worker ' + process.pid + ' has started.');
        // Send message to master process.
        process.send({ msgFromWorker: counter })
      
    }

    next();
}

emitter.emitter.on("listener", (data)=> {
    console.log('data from event',data);
});


// setup the server
const app = express();
app.set('port', 8080);
app.set('views', path.join(__dirname, 'pages')); // look in the current directory for pages folder
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 


// APIs
// app.get('/', middleware, controller.healthCheck);
app.use('/', middleware, apiController);
app.use('/routes', routerController);

// Pages
app.get('/page',(req, res) => {
    res.render("home", { title: "Hey", message: "Hello there!", name: "user" });
})

// app.use(router);

// start the server
app.listen(app.get('port'), () => {
    console.log(`App is running on http://localhost:${app.get('port')} in ${app.get('env')} mode`);
    console.log('Press CTRL-C to stop');
});

// If worker setup a listener to recieve messages from master.
if (cluster.isWorker) {
    process.on('message', function(msg) {
        console.log('Worker received message from master.', msg);
        counter = msg.msgFromWorker;
    });
}