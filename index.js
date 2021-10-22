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
const crypto = require('crypto');
const Agenda    =    require('agenda');

const path = require('path');
const hapiAuthJwt = require('hapi-auth-jwt2');
const Boom = require('boom');
const glob = require('glob');
const secret = require('./config');

const jsonwebtoken = require('jsonwebtoken');
const fileSystem = require('fs');
const WebSocket1 = require('ws').Server;



// Local file/Module Imports

const  UserModel  = require('./Models/user.js').UserModel;
const  AdminModel  = require('./Models/admin').AdminModel;
const routes = require('./Routes/Routes.js');
const app_config = require('./ENV').prefs;

var EventEmitter = require('events');

var notifier = new EventEmitter();

var moment = require('moment-timezone');

notifier.setMaxListeners(0);
const log_exec_time = false;

var JobQueue  =    null;

// process any command line args OR Script Flags any

var argsData = {};

//console.log("Wathcing for Commnd line args ", process.argv);
//process.argv.forEach(function (val, index, array) {
//    console.log(index + ': ' + val);
//});

//let actual_argsLength = ((process.argv.length/2) - 1);

let actual_argsLength = (process.argv.length -2)/2;

for(var i = 0; i < (actual_argsLength * 2);i++ ){

    //console.log(process.argv[i+2]);
    //
    //console.log(process.argv[i+2+actual_argsLength]);
    //
    //argsData[process.argv[i+2].toString()] = process.argv[i+2+actual_argsLength];
    //
    //console.log(argsData);



        //console.log(i);
        //console.log(process.argv[i+2]);
        //
        //console.log(process.argv[i+2+1]);

    /* */ // old code comments starts here
    /*
        argsData[process.argv[i+2]] = process.argv[i+2+1];

    */
    /* */ // old code comments ends here

       // console.log(argsData);


    //  New code starts here

    if(process.argv[i+2] === 'myenv'){

        argsData['env'] = process.argv[i+2+1];
    }else{

        argsData[process.argv[i+2]] = process.argv[i+2+1];
    }


    // New code ends here


        i++;
}

console.log(argsData);

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




//const hostname  = require('os').hostname() || 'localhost';
const hostname  = 'localhost';

var serverConfig = {
    host : hostname,
    address : "::",//"0.0.0.0", // MOST IMP line for production API access
    port: 4002,
    routes : {
        cors:    true,
        payload :{
            timeout : 110000//12000
        }
    },
 /*   tls : {

        //key : fileSystem.readFileSync(app_config._SSL_TLS.key),
        //cert : fileSystem.readFileSync(app_config._SSL_TLS.cert)

        key     : fileSystem.readFileSync(app_config._SSL_TLS.key),
        cert    : fileSystem.readFileSync(app_config._SSL_TLS.fullChain),
        ca      : fileSystem.readFileSync(app_config._SSL_TLS.chain)
    }*/
};

var dbName = "umahhdb";//"yummz-market";

//tls : {
//
//    key : fileSystem.readFileSync(app_config._SSL_TLS.key),
//        cert : fileSystem.readFileSync(app_config._SSL_TLS.cert)
//
//    // for localhost : DEV environment
//
//    //key : fileSystem.readFileSync(app_config._SSL_TLS.self_signed_key),
//    //cert : fileSystem.readFileSync(app_config._SSL_TLS.self_signed_cert),
//    //passphrase : 'rachit'
//}


if(argsData.hasOwnProperty('port') && argsData.port){

    serverConfig.port = parseInt(argsData.port,10);

    //console.log(serverConfig);
}


if(argsData.hasOwnProperty('env') && argsData.env){

    app_config.setEnv(argsData.env);

    console.log(app_config.getEnv().toString() === 'live');

    var  serverConfigSSLServer  =    null;

    if(argsData.env !== 'dev'){

        serverConfigSSLServer   =    {

            key     : fileSystem.readFileSync(app_config._SSL_TLS_SERVER.key),
            cert    : fileSystem.readFileSync(app_config._SSL_TLS_SERVER.fullChain),
            ca      : fileSystem.readFileSync(app_config._SSL_TLS_SERVER.chain)
        }

        serverConfig.tls    =    serverConfigSSLServer;
    }

    if(argsData.env === 'staging'){

        dbName = "umahhdb"; //"yummz-market-staging";
    }
    else if(argsData.env === 'dev'){

        console.log("current -env :",app_config.getEnv() === 'dev');

        dbName  =    "umahhdb";

        if(argsData.hasOwnProperty('ssl') && argsData.ssl) {

            let enableSSL = argsData.ssl === 'true';

            if(enableSSL == true){

                serverConfig.tls = {

                    key : fileSystem.readFileSync(app_config._SSL_TLS.self_signed_key),
                    cert : fileSystem.readFileSync(app_config._SSL_TLS.self_signed_cert),
                    passphrase : 'rachit'
                }
            }
            else if(enableSSL == false){

                console.log('enableSSL ', enableSSL);
                delete  serverConfig.tls;
                //console.log('serverConfig ', serverConfig);
            }

        }
        // for localhost : DEV environment

        //key : fileSystem.readFileSync(app_config._SSL_TLS.self_signed_key),
        //cert : fileSystem.readFileSync(app_config._SSL_TLS.self_signed_cert),
        //passphrase : 'rachit'
    }
}



server.connection(serverConfig);

mongoose.connect('mongodb://'+ 'localhost'+ ':'+ 27017  +'/'+ dbName ,function(err){

    console.log("connecting to database : ", dbName);

    if(err){

        console.error(err);

        mongoose.connect('mongodb://127.0.0.1:27017/'+ dbName, function(err2){

            if(err2){

                mongoose.createConnection('mongodb://127.0.0.1:27017/'+dbName);
            }
        });
    }

});

var mongoConnectionString = 'mongodb://'+ '127.0.0.1'+ ':'+ 27017  +'/'+ dbName;

JobQueue = new Agenda({db: {address: mongoConnectionString}});

JobQueue.on('ready', function(){

    //console.log("Job Queue [Agenda] is ready to start...");
    JobQueue.start();
    module.exports.jobqueue =    JobQueue;
});

JobQueue.on('error', function(error){

    JobQueue    =    null;
    console.error("Can't Create [Agenda] Job Queue : ", error);
});


//mongoose.connect( 'mongodb://localhost/yummz');




var privateKey =  'FqtP61rlNqGimIzUuWl44SYdRjACO4B6fyixwzhE0zgTnFvQrtYEYSJOiw1Gw0k6VKgJLlducbmf0wS9HnGo+nKvc6cvwlonjnIW7zre6ewyKhA/' +
    'CgpN+ERkyDX0VZBd2VyC2oWWX7xMQL/8J+c40Amsg8l8EcB4DvEKLZmypnldj+1/6VjenD5O410WYeZLXQtjOD0j87fFHq9YEVd1vUnX27IG0kImcIZHyjSbK0bO3s/' +
    'T7M9Gws2MICnyJi4XQCIEarKJj5csYddjTexVJ8E8tvP3ZQeOpK6C6AczGPLnZOMco75NtkG3oWCasKYpwD/V8bP2DfQSzNQxAajGOclA==';
    //crypto.randomBytes(256).toString('base64');///'hghj2g43324g2g4j2';


//var token = jwt.sign({ accountId: 123 }, privateKey, { algorithm: 'HS256'});

exports.generateToken = function(payload){

    console.log("generateToken payload : ", payload);

    var token = jsonwebtoken.sign(payload , privateKey, { algorithm: 'HS256', expiresIn : '720h'});

    //console.log(jsonwebtoken.decode(token));

    return token;

};
exports.notifyNewOrder = function(payload){ 
    notifier.emit('NewOrderNotifyAdmin',payload);  
};

exports.generateTokenSA = function(payload){

    console.log("generateToken Super Admin payload : ", payload);

    var token = jsonwebtoken.sign(payload , privateKey, { algorithm: 'HS256', expiresIn : '30m'});

    console.log(jsonwebtoken.decode(token));

    return token;

};//dewan generate order number
exports.generateOrderNumber = function(){ 
	var ctime = new Date().getTime();
	var month = moment().tz("Mexico/General").format('MM');
	var year = moment().tz("Mexico/General").format('YY');
	var finalNumID  = year+''+month+''+ (ctime.toString().substr(- 5));
	return finalNumID;
};


var currAuthenticatedUser = null;

exports.authUser = currAuthenticatedUser;

var webSocketConnection  = null;// new WebSocket.Server({server});

exports.wsconnection  = webSocketConnection;


// IMPORTANT: you must bring your own validation function

var validate = function (decodedToken, request, callback) {

   // let some = Date.now() - (decodedToken.iat * 1000);

  //  console.log(some);

    console.log('Inside JWT validate function # 1:\n', decodedToken);

    jsonwebtoken.verify(request.auth.token, privateKey,{maxAge : '720h'}, function (err, decoded) {

        if (err) {

            console.error("verify error : ",err);

            if(currAuthenticatedUser) currAuthenticatedUser = null;

            return callback(err, false, null);
        }

        console.log("verify decoded : ",decoded);

        //ToDo : Now Check for iat's age for expiration. then check for 'id' and 'email' matches in DB to authorize
        // ToDo: the token and user both

        var entityModel = null;

        if(decoded.role){

            entityModel =   decoded.role === "user" || decoded.role === "business" || decoded.role === "mosque" || decoded.role === "admin" ? UserModel : AdminModel

        }

        let modelName   =   decoded.role === "user" || decoded.role === "business" || decoded.role === "mosque" || decoded.role === "admin" ? "User" : "Admin";

        console.log("Authenticated User Type : ",modelName === "User" ? "Consumer" : "Admin");

        //UserModel.findOne({_id : decoded.id, email : decoded.email, access_token : request.auth.token},function(err, result){

        //entityModel.findOne({_id : decoded.id, email : decoded.email, access_token : request.auth.token},function(err, result){

        let id_to_search  = mongoose.Types.ObjectId(decoded.id.toString());


        let criteria_final_admin =  {_id : id_to_search, email : decoded.email, access_tokens :{$in : [request.auth.token]}};


        let critera_by_role = modelName === "User" ? {
            _id: id_to_search,
            username: decoded.username,
            email: decoded.email,
            sessions :{$in : [decoded.sessionID]}
           // access_token: request.auth.token
        }
            : criteria_final_admin;
           // : {_id: decoded.id, email: decoded.email, access_token: request.auth.token};



        console.log("Criteria :", critera_by_role);

        entityModel.findOne(critera_by_role, function (err, result) {

            console.log('inside DB checkup function entity model found as  ', result);
            console.error('inside DB checkup function error found as  ', err);

            var err2 = null;

            if(decoded.role  == 'user' || decoded.role  == 'business' || decoded.role  == 'mosque' || decoded.role  == 'admin' || decoded.role  === app_config._SCOPES.SUPER_ADMIN){//} && result && (!result.access_tokens  || result.access_tokens.indexOf(request.auth.token) == -1)){

                var hasError  =  false;

              /*  if( decoded.role  == 'admin' && (result && request.auth.token) ){

                    hasError  =  true;

                    //console.log("access_tokens : ", result.access_tokens);
                    //console.log("token to match : ", request.auth.token);

                    if(result.access_tokens){

                        if(result.access_tokens.length > 0){

                            if(result.access_tokens.indexOf(request.auth.token) != -1){

                                hasError =  false;
                            }
                        }
                    }
                }*/


                err2 = (hasError ==  true) ?  "No Matching access token for user model found. Invalid authorization." :  null;

                console.error(err2);
            }


            if(err || err2){

                console.error("JWT validate Function : Error \n",err);

                if(currAuthenticatedUser != null){

                    currAuthenticatedUser = null;
                }

                exports.authUser = currAuthenticatedUser;

                return callback(null, false, err);
            }
            else if(result && err2 == null){

                console.log(modelName+' is authenticated successfully and now authorized for this request.');

                currAuthenticatedUser = result;

                exports.authUser = currAuthenticatedUser;

                var credentials = request.auth.credentials || {};

                if(credentials){

                    console.log('------Credentials Found in Token ------- ', credentials);

                    //  id
                    //  email
                    //  iat :    timestamp  --- check for expiry.

                     credentials =   {

                        scope   :   decoded.role.toLowerCase(),
                        id      :   decoded.id,
                         member :   result
                     };

                    console.log('------Credentials Set manually : ------- ', credentials.scope , credentials.id);

                    return callback(null, true, credentials);
                }
                else{

                    console.error("No credentials found in token request");

                    return callback(null, true, decoded);
                }
            }
            else{

                console.error('No matching '+ modelName + ' found with provided access token. May be  '+ modelName + ' is logged out or inappropriate data exists.');

                if(currAuthenticatedUser){

                    currAuthenticatedUser = null;
                }

                exports.authUser = currAuthenticatedUser;

                return callback(null, false, err);
            }
        })

    });
};

var __DEPRECATED_validate2 = function (decodedToken, request,callback) {

    console.log("--- Inside JWT validate Function #2 -----");

    console.log(decodedToken);

    console.log("--- -----");

    //console.log(request);

    console.log("--- -----");

    console.log(request.auth.token);  // should be {accountId : 123}.

    //if (decodedToken) {
    //
    //    console.log(decodedToken.accountId.toString());
    //}
    //
    //var account = accounts[decodedToken.accountId];

    var account  = undefined;

    try {

        var decoded = jsonwebtoken.verify(request.auth.token, privateKey);

        console.log("decoded : " +  JSON.stringify(decoded));

        return callback(null, true, decoded);

    } catch (e) {

        console.error(e);

        return callback(null, false);
    }

};

var respFunc = function(err, response){

    console.log(err);
    console.log(response);
};

var errFunc = function(err){

    console.log(err);
};

exports.invalidateToken = function(token,callback){

    console.log('\ninside invalidateToken function :  \ntoken : ', token,'\n Token Type : ', typeof (token));

    let decoded = jsonwebtoken.decode(token);

    console.log('---decoded-----\n',decoded);

    var entityModel = null;


    if(decoded.role){

        entityModel =   (decoded.role === "user" || decoded.role === "mosque" || decoded.role === "business" || decoded.role === "admin") ? UserModel : AdminModel

    }

    console.log("entityModel -- ", entityModel);

    let modelName   =   (decoded.role === "user" || decoded.role === "mosque" || decoded.role === "business" || decoded.role === "admin") ? "User" : "Admin";

    console.log("Signing out Authenticated User Type : ",modelName === "User" ? "Consumer" : "Admin");

    //UserModel.findOne({_id : decoded.id, email : decoded.email, access_token : token},function(err, user){

    //entityModel.findOne({_id : decoded.id, email : decoded.email, access_token : token},function(err, user){

    let id_to_search  = mongoose.Types.ObjectId(decoded.id.toString());

    let _query  =  {_id: id_to_search, email: decoded.email, sessions :{$in : [ decoded.sessionID]}};//  {_id: id_to_search, email: decoded.username, access_token: token};

    let _criteria_final_admin = {_id : id_to_search, email : decoded.email, access_tokens :{$in : [ token]}};

    let query_final  = entityModel == UserModel ? _query : _criteria_final_admin;

    console.log("find query criteria :", query_final);

    //entityModel.findOne({_id: id_to_search, email: decoded.email, access_token: token}, function (err, user) {
    entityModel.findOne(query_final, function (err, user) {

        console.log(err,'---\n--', user);

        var err2 = null;

        let result  =  user;

        //if((decoded.role  == 'user' || decoded.role  == 'admin' || decoded.role === app_config._SCOPES.SUPER_ADMIN) && (result && !result.access_tokens  || result.access_tokens.indexOf(token) == -1)){

       /* if( decoded.role  == 'admin'  && (result && !result.access_tokens  || result.access_tokens.indexOf(token) == -1)){

            err2 = "No Matching access token for admin found. Invalid authorization.";
            console.error(err2);
        }*/


        if(err  || err2){

            return callback({
                success :    false,
                err     :   err ? err : err2,
                token   :   token,
                message :   'Could not Find '+ modelName +' with access token value :' +  token
            });


        }
        else if(user && (err2 == null)){


            let obj = user;

        /*    if(obj.role === 'admin'){

                if(obj.access_tokens && obj.access_tokens.length > 0 ){

                    let index = obj.access_tokens.indexOf(token);

                    if(index > -1){

                        obj.access_tokens.splice(index, 1);

                        //console.log("Access token array after signing out :", obj.access_tokens);

                        //console.log("Push Devices after signing out :", obj.pushDevices);

                        if(! obj.access_tokens || (obj.access_tokens.length == 0) ){

                            obj.isLoggedIn = false;
                            currAuthenticatedUser   =    null;

                            //console.log("User login status set to :", obj.isLoggedIn);
                        }


                        obj.access_token = null;
                        //obj.isLoggedIn = false;

                        // new experimental code
                        // below code removes all subscribers for web push notification on logging out

                        if(obj.pushSubscribers){

                            //console.log("web push subscriber count :", obj.pushSubscribers.length);

                            let subscribers = obj.pushSubscribers;

                            let filtered    =   subscribers.filter(function(element){

                                if(element.os === app_config._CLIENT_OS.WEB){

                                    if(element.devices.length > 0){

                                        element.devices.splice(0, element.devices.length);

                                        //console.log("After removing all push subscribers :", element);
                                    }
                                }

                                return element;
                            });

                            obj.pushSubscribers =   filtered;

                            //AdminModel.update({_id : decoded.id},{pushSubscribers :{os:web}})

                        }
                        else{
                            console.warn("No push Subscription object found for Admin");
                        }


                        // new experimental code ends here
                    }
                    else{

                        console.error("No Matching access token exists in list.");

                        return callback({

                            success :false,
                            err     : "No Matching access token exists in list.",
                            token   : token,
                            message :'Signing  Out Failed. Please Try Again',//'problem invalidating user\'s access token.'
                        });
                    }
                }
                else{

                    console.error("No single access token exists in list.");

                    return callback({

                        success :false,
                        err     : "No single access token exists in list.",
                        token   : token,
                        message :'Signing  Out Failed. Please Try Again',//'problem invalidating user\'s access token.'
                    });
                }
            }
            else*/ if(obj.role === 'user' || obj.role === 'mosque' || obj.role === 'business' || obj.role === 'admin'){
                

                obj.access_token = null;
                obj.isLoggedIn = false;
                //obj.orders.splice(0, obj.orders.length);

                if(obj.role === 'user'){

                    obj.deviceToken =   null;
                  //  obj.orders.splice(0, obj.orders.length);

                    let sessionID =  decoded.sessionID;
                    let index =  obj.sessions.indexOf(sessionID);
                    if(index != -1){

                        obj.sessions.splice(index,1);
                    }

                }
            }

            //obj.access_token = null;
            //obj.isLoggedIn = false;
            ////obj.orders.splice(0, obj.orders.length);
            //
            //if(obj.role === 'user'){
            //
            //    obj.deviceToken =   null;
            //    obj.orders.splice(0, obj.orders.length);
            //}

            //console.log('---modified user-----\n',user);

            obj.save(function(err, savedDoc, numRowsAffected){

                console.log('----inside SAVE model Func----', err);

                if(err){

                    return callback({

                        success :false,
                        err     : err,
                        token: token,
                        message :'Signing  Out Failed. Please Try Again',//'problem invalidating user\'s access token.'
                    });
                }
                else{

                    if(savedDoc.role == app_config._SCOPES.CONSUMER ){

                        //console.log("currAuthenticatedUser", currAuthenticatedUser);

                        if(currAuthenticatedUser &&  currAuthenticatedUser.access_tokens && currAuthenticatedUser.access_tokens.length == 0){

                            currAuthenticatedUser = null;
                        }
                    }
                    else{

                        currAuthenticatedUser = null;
                    }

                    let UserObject = {

                        //first_name: savedDoc.first_name,
                        //last_name: savedDoc.last_name,
                        username: savedDoc.username,
                        email: savedDoc.email,
                        _id: savedDoc._id,
                        pushDevices : savedDoc.role === app_config._SCOPES.CONSUMER ?  savedDoc.pushDevices :  savedDoc.pushSubscribers
                    }

                    //currAuthenticatedUser = null;

                    //console.log(modelName + " after signing out : ", savedDoc);

                    return callback({

                        success :true,
                        data    :   {
                            message :   modelName + ' Signed Out Successfully.',//'successfully invalidated user\'s access token.',
                            isLoggedIn : false,
                            entity : UserObject
                        }

                    });
                }
            });
        }
        else{
            return callback({

                success :   false,
                error   :   'Access Token does not belong to any existing  '+ modelName + '. Invalid Data.'

            });
        }
    });
};

//  Swagger App Level Configuration Starts Here

/*
    NOTE : The API categorisation is differentiated by tags and can be accessed as below

            For Mobile APIs             :    http://localhost:3001/documentation?tags=mobile
            For Admin APIs              :   http://localhost:3001/documentation?tags=admin
            For <tag name>type APIs     :   http://localhost:3001/documentation?tags=<tag name>

*/

const options_Swagger = {
    info: {
        'title': 'Umahh  API Documentation',
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
    //tags    :   ['api','admin','mobile','sa','menu','user'],
    //jsonEditor  :   true,
    security: [{ 'token': [] }],
};

const options_cors = {
    origins: [''],
    allowCredentials: 'true',
    exposeHeaders: ['content-type', 'content-length'],
    maxAge: 600,
    methods: ['POST, GET, OPTIONS, PATCH, PUT, DELETE, HEAD'],
    headers: ['Accept', 'Content-Type', 'Authorization','language']
};

let cors_plugin = {

    register: cors,
    options: {
        origins: options_cors
    }
};

//  Registering Swagger UI Plugin
server.register([
    Inert,
    Vision,
    routes.suggestions, // --->  calling routes those needs to be exposed to Swagger UI
    routes.users,// --->  calling routes those needs to be exposed to Swagger UI
    routes.associates,// --->  calling routes those needs to be exposed to Swagger UI
    routes.commondata,
    routes.education,
    routes.news,
    routes.board,
    routes.calendar,
    routes.prayer,
    routes.activities,
    routes.community,
    routes.likecommunity,
    routes.supplication,
    routes.hajjumrah,
    routes.khutba,
    routes.donationCategory,
    routes.paypalPayment,
    routes.following,
    routes.personnage,
    routes.personnageUsers,
    routes.juz,
    routes.quizCategory,
    routes.quiz,
    routes.quizRule,
    routes.notification,
    routes.message,
    routes.prayername,
    routes.commanapiroute,
    routes.termcondition,
    routes.transferpaymenttomosque,
    {
        'register': HapiSwagger,
        'options': options_Swagger
    },
     //Registering 'jwt' Pack
    {
        'register' : hapiAuthJwt,
        'options'  :  {

        }
    },
    {
        register: require('lout'),
        options: {
            filterRoutes: function (route) {

                // Route's Paths contained in below array would not be exposed to 'lout' documentation
                let excludedRoutePaths = ["/documentation","/swagger.json", "/", "/{param*}", "/swaggerui/{path*}",
                    "/swaggerui/extend.js", "/public/images/{param*}", "/insert/image", "/api/externaldata/merchants/"];

                return excludedRoutePaths.indexOf(route.path.toString()) == -1;
            }
        }
    },
    {
        register: require( "hapi-i18n" ),
        options: {
            locales: [app_config._LOCALE.ENGLISH, app_config._LOCALE.SPANISH],
            directory: __dirname + "/locales",
            languageHeaderField: "language",
            defaultLocale: app_config._LOCALE.ENGLISH,
        }
    }
    ], (err) => {

    //------------ JWT -----------------//
    // We're giving the strategy both a name
    // and scheme of 'jwt'
    server.auth.strategy('token', 'jwt', {
        key: privateKey,
        verifyOptions: {
            algorithms: ['HS256'],
            ignoreExpiration: false,
            maxAge: '720h' // use 's' for Seconds, 'm'-> minutes, 'h'-> hours etc...
        },
        validateFunc: validate,
        //responseFunc : respFunc,
        //errorFunc   :   errFunc

    });


     server.route(routes.suggestions.register.attributes.routes);
     server.route(routes.associates.register.attributes.routes);
     server.route(routes.users.register.attributes.routes);
     server.route(routes.commondata.register.attributes.routes);
     server.route(routes.education.register.attributes.routes);
     server.route(routes.news.register.attributes.routes);
     server.route(routes.board.register.attributes.routes);
     server.route(routes.calendar.register.attributes.routes);
     server.route(routes.prayer.register.attributes.routes); 
     server.route(routes.activities.register.attributes.routes);
     server.route(routes.community.register.attributes.routes);
     server.route(routes.likecommunity.register.attributes.routes);
     server.route(routes.supplication.register.attributes.routes);
     server.route(routes.hajjumrah.register.attributes.routes);
     server.route(routes.khutba.register.attributes.routes);
     server.route(routes.donationCategory.register.attributes.routes);
     server.route(routes.paypalPayment.register.attributes.routes);
     server.route(routes.following.register.attributes.routes);
     server.route(routes.personnage.register.attributes.routes);
     server.route(routes.personnageUsers.register.attributes.routes);
     server.route(routes.juz.register.attributes.routes);
     server.route(routes.quizCategory.register.attributes.routes);
     server.route(routes.quiz.register.attributes.routes);
     server.route(routes.quizRule.register.attributes.routes);
     server.route(routes.notification.register.attributes.routes);
     server.route(routes.message.register.attributes.routes);
     server.route(routes.prayername.register.attributes.routes);
     server.route(routes.commanapiroute.register.attributes.routes);
     server.route(routes.termcondition.register.attributes.routes);
     server.route(routes.transferpaymenttomosque.register.attributes.routes);
     
    //------------ JWT Ends -----------------//


    if (err) {

        console.log("error registering plugin - Swagger :" + err);
    }

    console.log("counting paths : ", typeof (routes.allRoutes));

    for(var counter in routes.allRoutes){

            console.log(routes.allRoutes[counter]);
    }

        var reqStarted;

        if(log_exec_time == true){

            reqStarted = false;

            console.log('Setting Request Start Flag');

            server.ext("onRequest",function( request,reply){

                if(request.path.includes('/api/')){

                    console.log("onRequest\n", request.method,"\n"+ request.path);

                    var hrstart = process.hrtime();
                    var hrend = process.hrtime(hrstart);

                    request.on("peek", () => {
                        if(reqStarted === false){
                            console.log("peek -- reqStarted :", reqStarted === false);
                        }
                        reqStarted = true;
                    });

                    request.on("finish", () => {
                        console.log("finish");
                        reqStarted = false;
                        console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
                    });

                    request.on("disconnect", () => {
                        console.log("disconnect");
                        reqStarted = false;

                    });

                }

                return reply.continue();

            });
        }


        server.views({
            engines: {
                html: require('handlebars')
            },
            relativeTo: __dirname + '/',
            path: 'Web'
        });
	var clients = [];
	//io start
	    const io = require('socket.io')(server.listener);

		io.on('connection', function (socket) {
		   //socket.emit('NotificationCountAdmin');  
		    notifier.on('action', function (action) {
			//console.log('event action');
			socket.emit('action', action);
		    });
		    notifier.on('NewOrderNotifyAdmin', function (playload) { 
			//console.log('event NotificationCountAdmin');
			 socket.emit('NotificationCountAdmin',playload) 
			 //socket.to(playload.email).emit('NotificationCountAdmin') 
		    });
		    
		    socket.on('join',function(data){  
				var  email   = data.email; 
				if(clients.indexOf("'"+email+"'")==-1)
				{
					clients.push("'"+email+"'");
					//socket.user_uniqe_id = email;
					socket.join(email);
				}
				/*if(socket.rooms.indexOf(user_uniqe_id)!==-1)
				{
					// Already joined  
				}
				else
				{
					socket.join(user_uniqe_id);
				}*/
				//io.to(user_uniqe_id).emit('RecieveReminder', {data:data});
			});
  
		   // notifier.emit('action', { time: Date.now() });
		   //notifier.emit('NotificationCountAdmin'); 
 
	    });
	  
	    //io end

    server.start( (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Server running at:', server.info.uri);
            //server.route(routes.allRoutes);

            /*
           webSocketConnection  =  new WebSocket1({host : 'localhost', port : 4199, path :'/'});


            //webSocketConnection  =  new WebSocket({noServer : true});
            console.log("server info :", typeof(server.info.uri));

            console.log("webSocketConnection :", webSocketConnection);

            exports.wsconnection  = webSocketConnection;

            webSocketConnection.on('connection', function connection(one){

                console.log('web socket onConnection event first arg :', one);
                //console.error('web socket onConnection event second arg :', two);

                one.on('message', function incoming(message) {
                    console.log('received: %s', message);
                });
            });

            const WebSocket = require('ws');

            const ws = new WebSocket('ws://localhost:4199/', {
                origin: 'http://localhost:4100'
            });

            ws.on('open', function open() {
                console.log('connected');
                ws.send(Date.now());
            });*/

        }
    });
  
    }
);