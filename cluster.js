// Cluster module
const cluster = require('cluster');
const os = require("os");

const totalCPUs = os.cpus().length;

// Check if worker or master
if (cluster.isWorker) {
  console.log('I am a worker');
  require('./index');
} else {
    
    // Loop over all CPUS available and create forks for all cpus
    for (let i = 0; i < 2; i++) {
        const worker = cluster.fork();
        worker.on('message', (msg) => {
            console.log('Master ' + process.pid + ' received message from worker ' + msg.msgFromWorker );
            sendMessageToWorker(msg);
        });
    }
     
    // listen for exut event on the current worker cluster and fork a new cluster.
    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`, worker, code, signal);
        console.log("Forking another worker!");
        cluster.fork();
    });
}

const sendMessageToWorker = (message) => {
    const workers = Object.values(cluster.workers); 
    console.log('Number of workers', workers.length);
    workers.forEach( eachWorker => {
        eachWorker.send(message);
    });
}


// Clusters will run on the same node
// Data will not be shared between clusters
// Data can be sent between clusters using