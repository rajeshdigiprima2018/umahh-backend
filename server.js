/**
 * Created by rv2016 on 04/01/17.
 */

/**
 * Created by rv2016 on 02/12/16.
 */


/**
 * Created by rv2016 on 22/04/16.
 */


'use strict';

// NPM Module Import
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const Joi = require('joi');
const Path = require('path');
const mongojs = require('mongojs');
const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
const cors = require('hapi-cors');
const os = require('os');

const path = require('path');
const jwt = require('hapi-auth-jwt2');
const Boom = require('boom');
const glob = require('glob');
const secret = require('./config');


const jsonwebtoken = require('jsonwebtoken');



// Local file/Module Imports

const User = require('./Models/user.js');
const routes = require('./Routes/Routes.js');


// os WISE GLOBAL SETTINGS

var is_windows = false;

const log_exec_time = true;

const searchOSType = ['Win', 'WIN', 'win', 'Windows', 'WINDOWS', 'windows'];

const parentSearchScope = 'Win' + 'WIN' + 'win' + 'Windows' + 'WINDOWS' + 'windows';


const regex = new RegExp("^((win)|(windows))(?=$|([0-9-_])+)"); //"^((win)|(windows))(?=$|([0-9-_])+)";  // use THIS

const regex2 = "(^((win))|(^(WIN))|(^(Win))|(^(windows))|(^(Windows))|(^(WINDOWS)))(()$|(?:.*[0-9-_a-zA-Z])$)"
    // use this if previous one does not work

const matches = os.platform().toLowerCase().match(regex) || null;
const matches1 = os.type().toLowerCase().match(regex) || null;

if (matches != null || matches1 != null) {

    is_windows = true;

    console.log('OS platform is  :  WINDOWS');
} else {

    console.log('OS platform is -------- -- : ' + os.type() + '\n');

    is_windows = false;
}


const is_WIN_HOST = is_windows; // use to check Host env and making changes accordingly

const pathPrefix = is_WIN_HOST == true ? '/node/yb/app' : ''; // global path prefix for all endpoints

console.log('path prefix is :xxxxxx', pathPrefix);

if (is_WIN_HOST == true && pathPrefix.length > 0) {

    exports = {
        prefix: pathPrefix
    };
} else {

    console.log('No need to add path prefix and to Export it.');
}


//  create new hapi Server

const server = new Hapi.Server({

    connections: {
        routes: {
            files: {
                //TODO : change path from "'Media/Images/Merchants/'" to "'Media/Images/'" and make other changes accordingly
                //TODO : so that in future other entity based assets can be stored dynamically like '/Media/Images/Users'
                //relativeTo: Path.join(__dirname, 'Media/Images/Merchants/')
                relativeTo: Path.join(__dirname, pathPrefix + 'Media/Images/')
            }
        }
    }
});


//server.connection({host : 'localhost', port: 3001 });

server.connection({ host: process.env.IP, port: process.env.PORT || 3001, routes: { cors: true, payload: { timeout: 12000 } } });

//Connect to Mongo db
//server.app.db = mongojs('hapi-rest-mongo', ['yummz']);

//  connect to Mongo Db using Mongoose
// mongoose.connect('mongodb://localhost/yummz');   //   -- DEVELOPMENT SETTINGS


let connString = 'mongodb://' + process.env.IP + ':' + 27017 + '/yummz';

//console.log(connString);

//console.log(JSON.stringify(process.env));

//mongoose.connect('mongodb://'+ process.env.HOSTNAME + ':'+ 27017  +'/yummz'); //   -- PRODUCTION SETTINGS

mongoose.connect('mongodb://' + process.env.HOSTNAME + ':' + 27017 + '/yummz', function(err) {

    if (err) {

        mongoose.connect('mongodb://127.0.0.1:27017/yummz');
    }

});

var privateKey = 'YourApplicationsPrivateKey';


//var token = jwt.sign({ accountId: 123 }, privateKey, { algorithm: 'HS256'});

//let obj = {
//    "username" : "rv",
//    "pwd"	:	"1234@Appple"
//};

var token = null; //jsonwebtoken.sign(obj , privateKey, { algorithm: 'HS256'});

//console.log(jsonwebtoken.decode(token));


exports.generateToken = function(payload) {

    var token = jsonwebtoken.sign(payload, privateKey, { algorithm: 'HS256' });

    console.log(jsonwebtoken.decode(token));

    return token;

}



// IMPORTANT: you must bring your own validation function
var validate = function(token, request, callback) {

    var publicKey = 'someKey';

    console.log(request);

    jsonwebtoken.verify(token, publicKey, function(err, decoded) {

        if (err) {

            return callback(err)
        }
        var credentials = request.auth.credentials;
        // .. do some additional credentials checking
        return callback(null, true, decoded);
    });
};


console.log('path prefix :000000', is_WIN_HOST == true ? pathPrefix + '/api' : '/api' + '--END---');


var register_options = {};

if (is_WIN_HOST == true && pathPrefix.length > 0) {

    register_options = {
        routes: {
            prefix: '/node/yb/app'
        }
    }
}


//  Swagger App Level Configuration Starts Here
const options_Swagger = {
    info: {
        'title': 'YummZ  API Documentation',
        'version': Pack.version
    },
    basePath: '/api', // is_WIN_HOST == true ?  pathPrefix+'/api' : '/api',
    pathPrefixSize: 2, // is_WIN_HOST == true ?  5 : 2,
    securityDefinitions: {
        'token': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    },
    security: [{ 'token': [] }],
};

console.log('Swagger Options : \n', options_Swagger);

const options_cors = {
    origins: [''],
    allowCredentials: 'true',
    exposeHeaders: ['content-type', 'content-length'],
    maxAge: 600,
    methods: ['POST, GET, OPTIONS, PATCH, PUT, DELETE, HEAD'],
    headers: ['Accept', 'Content-Type', 'Authorization']
};

let cors_plugin = {

    register: cors,
    options: {
        origins: options_cors
    }
}

//  Registering Swagger UI Plugin



server.register([
        Inert,
        Vision,
        //require('./Routes/MenuItem.js'),
        routes.menuitem, // --->  calling routes those needs to be exposed to Swagger UI
        routes.users, // --->  calling routes those needs to be exposed to Swagger UI
        routes.merchants, // --->  calling routes those needs to be exposed to Swagger UI
        {
            'register': HapiSwagger,
            'options': options_Swagger
        },
        // Registering 'jwt' Pack
        {
            'register': jwt,
            'options': {

            }
        }
    ],
    register_options, (err) => {

        //------------ JWT -----------------//
        // We're giving the strategy both a name
        // and scheme of 'jwt'
        server.auth.strategy('token', 'jwt', {
            key: secret,
            verifyOptions: { algorithms: ['HS256'] },
            validateFunc: validate
        });

        // Look through the routes in
        // all the subdirectories of API
        // and create a new route for each

        /*
         glob.sync('Routes/*.js', {
         root: __dirname
         }).forEach(file => {

         console.log(file);
         const filePath = require(path.join(__dirname, file));
         let routes = filePath.register.attributes.routes
         console.log(routes);
         server.route(routes);
         });
         */

        if (pathPrefix.length > 0 && is_WIN_HOST == true) {
            console.log('Setting Global Path Prefix to :', pathPrefix);
            server.realm.modifiers.route.prefix = pathPrefix; // '/node/yb/app';
        } else {
            console.log('No Need to Set Global Path Prefix');
        }


        //console.log(routes.menuitem.register.attributes)
        server.route(routes.menuitem.register.attributes.routes);
        server.route(routes.merchants.register.attributes.routes);
        server.route(routes.users.register.attributes.routes);
        server.route({
            method: 'GET',
            path: '/api/info',
            handler: function(request, reply) {


                var output = {
                    info: server.info,
                    os: {
                        hostname: os.hostname(),
                        platform: os.platform(),
                        cpus: os.cpus(),
                        arch: os.arch(),
                        type: os.type()
                    }
                };

                reply(output);

            }

        });
        //------------ JWT Ends -----------------//


        if (err) {

            console.error("error registering plugin - Swagger :" + err);
        } else {
            console.log("Swagger Registered Successfully");
        }

        var reqStarted;

        if (log_exec_time == true) {

            reqStarted = false;

            console.log('Setting Request Start Flag');

            server.ext("onRequest", function(request, reply) {

                if (request.path.includes('/api/')) {

                    console.log("onRequest\n", request.method, "\n" + request.path);

                    var hrstart = process.hrtime();
                    var hrend = process.hrtime(hrstart);

                    request.on("peek", () => {
                        if (reqStarted === false) {
                            console.log("peek -- reqStarted :", reqStarted === false);
                        }
                        reqStarted = true;
                    });

                    request.on("finish", () => {
                        console.log("finish");
                        reqStarted = false;
                        console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);
                    });

                    request.on("disconnect", () => {
                        console.log("disconnect");
                        reqStarted = false;

                    });

                }

                return reply.continue();

            });
        }



        server.start((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Server running at:', server.info.uri);

                //server.route(routes.allRoutes);

            }
        });
    });