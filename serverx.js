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

const path = require('path');
const jwt = require('hapi-auth-jwt2');
const Boom = require('boom');
const glob = require('glob');
const secret = require('./config');

const jsonwebtoken = require('jsonwebtoken');



// Local file/Module Imports

const  User  = require('./Models/user.js');
const routes = require('./Routes/Routes.js');



//  create new hapi Server

const server = new Hapi.Server({

    connections: {
        routes: {
            files: {
                //TODO : change path from "'Media/Images/Merchants/'" to "'Media/Images/'" and make other changes accordingly
                //TODO : so that in future other entity based assets can be stored dynamically like '/Media/Images/Users'
                //relativeTo: Path.join(__dirname, 'Media/Images/Merchants/')
                relativeTo: Path.join(__dirname, 'Media/Images/')
            }
        }
    }
});


//server.connection({host : 'localhost', port: 3001 });

server.connection({host : process.env.IP , port: 3001 || process.env.PORT, routes : {cors:    true}  });

//Connect to Mongo db
//server.app.db = mongojs('hapi-rest-mongo', ['yummz']);

//  connect to Mongo Db using Mongoose
// mongoose.connect('mongodb://localhost/yummz');   //   -- DEVELOPMENT SETTINGS


let connString = 'mongodb://'+ process.env.IP + ':'+ 27017  +'/yummz';

console.log(connString);

console.log(JSON.stringify(process.env));

//mongoose.connect('mongodb://'+ process.env.HOSTNAME + ':'+ 27017  +'/yummz'); //   -- PRODUCTION SETTINGS

mongoose.connect('mongodb://'+ process.env.HOSTNAME + ':'+ 27017  +'/yummz' ,function(err){

    if(err){

        mongoose.connect('mongodb://127.0.0.1:27017/yummz');
    }

});

var privateKey = 'YourApplicationsPrivateKey';


//var token = jwt.sign({ accountId: 123 }, privateKey, { algorithm: 'HS256'});

//let obj = {
//    "username" : "rv",
//    "pwd"	:	"1234@Appple"
//};

var token = null;//jsonwebtoken.sign(obj , privateKey, { algorithm: 'HS256'});

//console.log(jsonwebtoken.decode(token));


exports.generateToken = function(payload){

    var token = jsonwebtoken.sign(payload , privateKey, { algorithm: 'HS256'});

    console.log(jsonwebtoken.decode(token));

    return token;

}



// IMPORTANT: you must bring your own validation function
var validate = function (token, request, callback) {

    var publicKey = 'someKey';

    console.log(request);

    jsonwebtoken.verify(token, publicKey, function (err, decoded) {

        if (err) {

            return callback(err)
        }
        var credentials = request.auth.credentials;
        // .. do some additional credentials checking
        return callback(null, true, decoded);
    });
};




//  Swagger App Level Configuration Starts Here
const options_Swagger = {
    info: {
        'title': 'YummZ  API Documentation',
        'version': Pack.version
    },
    basePath: '/api',
    pathPrefixSize: 2,
    securityDefinitions: {
        'token': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    },
    security: [{ 'token': [] }],
};

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
    routes.users,// --->  calling routes those needs to be exposed to Swagger UI
    routes.merchants,// --->  calling routes those needs to be exposed to Swagger UI
    {
        'register': HapiSwagger,
        'options': options_Swagger
    },
    // Registering 'jwt' Pack
    {
        'register' : jwt,
        'options'  :  {

        }
    }], (err) => {

    //------------ JWT -----------------//
    // We're giving the strategy both a name
    // and scheme of 'jwt'
    server.auth.strategy('token', 'jwt', {
        key: secret,
        verifyOptions: { algorithms: ['HS256'] },
        validateFunc : validate
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

    //console.log(routes.menuitem.register.attributes)
    server.route(routes.menuitem.register.attributes.routes);
    server.route(routes.merchants.register.attributes.routes);
    server.route(routes.users.register.attributes.routes);
    //------------ JWT Ends -----------------//


    if(err){

        console.log("error registering plugin - Swagger :" + err);
    }



    server.start( (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Server running at:', server.info.uri);
        }
    });
});



/*
 server.route({
 method: 'GET',
 path: '/',
 handler: function (request, reply) {
 //reply('Hello, world!');
 reply(JSON.stringify(new User().getUsers()));
 }
 });

 server.route({
 method: 'GET',
 path: '/{name}',
 handler: function (request, reply) {
 reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
 }
 });
 */


/*
 server.route({

 method:'POST',
 path:'/user/add/',
 config: {
 handler: function (request, reply) {
 //reply("Hello");
 console.log("request received is now pending");
 console.log(request.payload);
 reply(JSON.stringify(new User().getUsers()));
 //reply(JSON.stringify(new User().addNewUser()))
 },
 description: 'Create new User',
 notes: 'Returns New user created',
 tags: ['api'], // ADD THIS TAG
 //plugins: {
 //    'hapi-swagger': {
 //        payloadType: 'form'
 //    }
 //},
 //
 //validate: {
 //    params: {
 //        id : Joi.number()
 //            .required()
 //            .description('the id for the todo item'),
 //    }
 //}

 validate: {
 payload: {//Joi.object({
 age: Joi.number(),
 id: Joi.number(),
 name: Joi.string(),
 height: Joi.number()
 }
 // })
 }
 }

 })
 */


//server.route(Routes);


/*
 server.start((err) => {

 if (err) {
 console.log('error : ', err);
 throw err;
 }
 console.log('Server running at:', server.info.uri);
 });
 */