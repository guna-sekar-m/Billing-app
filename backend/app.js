const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const sequelize = require('./db/MysqlDB.js');
const { fileURLToPath }= require('url');
const { dirname } = require('path');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

//routes;
const apirouter = require("./Routes/api.route.js");
const expressApp = express();
const port = 4000;

dotenv.config();
sequelize.sync().then(() => { console.log("Database synced") }).catch((error) => { console.error("Error syncing database:", error) });

expressApp.use(cors({
  origin: ['http://localhost:4200','http://localhost:3000','http://192.168.0.122:4200','*'],
  credentials: true
}));

//var __filename = fileURLToPath(import.meta.url);
//var __dirname = dirname(__filename);

expressApp.use(compression());
expressApp.use(morgan('tiny'));
expressApp.use(bodyParser.json({ limit: '200mb', extended: true}));
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use('/',express.static(__dirname +'/public'));
expressApp.use(fileUpload({ useTempFiles : true,tempFileDir : '/tmp/'}));
expressApp.use('/images',express.static(__dirname + '/upload/images'));
// Endpoint to retrieve system information

expressApp.use('/api',apirouter);
const server=expressApp.listen(port, () => console.log(`Billing Software listening on port ${port}!`));
module.exports = server;
