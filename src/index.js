import app from './server';
import http from 'http';
import socket from './Socket'
// import  mongodb  from 'mongodb';
// import bodyParser from 'body-parser'

// const MongoClient = mongodb.MongoClient;
// const link = 'mongodb://ahmadyassin:ahmadyassin2524@ds021036.mlab.com:21036/users';

const server = http.createServer(app);
socket(server)

let currentApp = app;
// currentApp.use(bodyParser.urlencoded({extended: true}))

// MongoClient.connect(link, (err, client) => {
//     if (err) return console.log(err)
//     // let db = client.db('users') // whatever your database name is
    
//   })    
  
  server.listen(process.env.PORT || 3000, (error) => {
    if (error) {
      console.log(error)
    }
    console.log('🚀 started')
  });
  
if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    server.removeListener('request', currentApp);
    const newApp = require('./server').default;
    server.on('request', newApp);
    currentApp = newApp;
  });
}
