/**
 * Created by rv2016 on 02/03/17.
 */

"use strict";


const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const fs = require('fs');
const Wreck = require('wreck');
const async = require('async');
const rq = require('request');
const lupus = require('lupus');
const Path = require('path');
const bcrypt     = require('bcryptjs');
const faker =   require('faker');
const Mailer = require('./Mailer').funcs_mail;

var helpers_generic =  require('./yummzHandlers').funcs_g.YZHandlers;// require('./yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../Models/merchant').MerchantModel;
var UserModel = require('../Models/user').UserModel;
var AdminModel = require('../Models/admin').AdminModel;
const WebPushService = require('./WebPushNotification');

const index = require('../index');

const appConfig  =  require('../ENV').prefs;


var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
}

var saveData =   function(userObject,projection, options, logMessage ,reply, callback){

    userObject.save(function(err, savedDoc, numRowsAffected){

        if(savedDoc && err == null && numRowsAffected  > 0){

            callback(null, savedDoc);
        }
        else if(err != null || numRowsAffected == 0){

            callback(err, null);

            return sendErrorReply(err != null ? err.message : "Error occurred saving User Data",
                logMessage, 404,reply );

        }
        else{

            return sendErrorReply("Unknown Server Error occurred saving User Data",
                logMessage, 404,reply );
        }

    });
}

var sendErrorReply      =   function(err, message, statusCode, reply){

    return reply({

        success     :   false,
        error       :   err,
        message     :   message
    }).code(statusCode || 404);
}



module.exports.funcs_a  =   {


    signUp : function(request, reply){

        var aFunc = function(){

            var payload = request.payload;

            AdminModel.checkUniqueness(payload.username, payload.email, function(err, admin){

                console.log(err);
                console.log(admin);

                if(err){

                    console.error('error checking uniqueness of Admin. Error' + err);

                    reply("OK");
                }
                else if (admin){

                    if(payload.username === admin.username){

                        console.error('Admin already exists with username ----:'+admin.username);
                    }
                    else if (payload.email === admin.email){

                        console.error('Admin already exists with email address ----: '+ admin.email);
                    }

                    return  reply({

                        error :   "Admin Already Exists",
                        message_readable  :   "Admin Already Exists with Email address provided.",
                        success   :   false
                    }).code(400);


                }
                else{

                    console.log("Good to Go insert new user.");

                    var obj = payload;

                    obj.createdAt = Date.now();

                    var hashedPwd    =   null;

                    var password =  null;

                    if(payload.hasOwnProperty("password")   ==   false){

                        var make_passwd = function(n, a) {
                            var index = (Math.random() * (a.length - 1)).toFixed(0);
                            return n > 0 ? a[index] + make_passwd(n - 1, a) : '';
                        };

                        var password = make_passwd(8, 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890');

                        payload.password    =   password;

                        console.log("password :", password);
                    }


                    if(payload.hasOwnProperty("password")){

                        helpers_generic.encryptPassword(payload.password,10, function(err, result){

                            if(err){

                                reply({

                                    success  :   false,
                                    error    :   err
                                })
                            }
                            else{

                                hashedPwd = result;

                                obj.password = hashedPwd;

                                console.log(obj);

                                var newAdmin = new AdminModel(obj);

                                console.log(newAdmin);

                                newAdmin.save(function(err, savedAdmin, rowsAffected){

                                    if(err || rowsAffected == 0){
                                        console.error(err || 'Error Saving Admin.');
                                        reply(err || 'Error Saving Admin.');
                                    }
                                    else{

                                        let rep = savedAdmin.toObject();
                                        rep.password = password;

                                        reply({

                                            success :   true,
                                            data    :   rep
                                        });

                                        console.log("New Admin saved successfully");
                                    }
                                });
                            }
                        });
                    }
                    else{

                        console.log('Payload does not have any password key.');

                        reply({

                            success  :   false,
                            error    :   'Missing password field.'
                        });
                    }
                }
            });
        }

        execute(aFunc);
    },

    signIn  :   function(request, reply){

        var aFunc = function(){

            let payload = request.payload;

            AdminModel.checkUniqueness(null, payload.email, function(err, admin) {

                //console.log(err);
                //console.log(admin);

                if (err) {

                    console.error('error checking uniqueness of Admin. Error' + err);

                    reply({

                        success :   false,
                        error   :   err || 'Problem saving Admin',
                        message_readable    :   request.i18n.__('Server Error occurred. Please try again')

                    }).code(500);
                }
                else if (admin) {

                    console.error('Admin already exists');

                    // Now comparing the hashed password

                    helpers_generic.matchPassword(payload.password,admin.password, function(err, isMatching){

                        console.log('err : '+ err + '\n is matching : '+  isMatching);

                        if(isMatching){

                            var obj = admin;

                            console.log("Admin object found :\n",obj);

                            let token  = require('../index').generateToken({id:admin._id, email: admin.email, role : admin.role});

                            obj.access_token= token;

                            obj.isLoggedIn = true;

                            /*
                            //  code to save device tokens for various as PushDevices field value

                            if(payload.hasOwnProperty("pushSubscription") == true){

                                //pushDevices
                                if(! obj.pushDevices){

                                    //console.log("Creating push devices object");

                                    obj.pushDevices =   {

                                        ios     :   [],
                                        android :   [],
                                        web     :   []
                                    }
                                }
                                else{

                                    //console.log("pushDevices : ", obj.pushDevices);
                                }

                                let os = payload.pushSubscription.os;
                                var devices = obj.pushDevices[os];

                                //console.log("OS :", os, " current devices :", devices);

                                if(payload.pushSubscription.deviceToken.length > 0){

                                    //devices.push(payload.pushSubscription.deviceToken);

                                    if(devices.length == 0){

                                        devices.push(payload.pushSubscription.deviceToken);
                                    }
                                    else if(devices.length > 0 && devices.indexOf(payload.pushSubscription.deviceToken) == -1){

                                        devices.push(payload.pushSubscription.deviceToken);
                                    }
                                    else{
                                        console.warn("Supplied device token for OS :",os," exists already in the list. Avoiding duplication");
                                    }
                                }
                                else{
                                    console.warn("Device token is either empty or of ZERO length");
                                }

                            }

                            // code for pushDevices ends here
                            */

                            // New code starts here

                            if(! obj.access_tokens){

                                obj.access_tokens   =   [];
                            }

                            if(obj.access_tokens.length == 0){

                                obj.access_tokens.push(token);
                            }
                            else if(obj.access_tokens.length > 10){

                                //obj.access_tokens[0]    =    token;

                                obj.access_tokens.push(token);

                                obj.access_tokens.shift();
                            }
                            else{

                                obj.access_tokens.push(token);
                            }



                            //console.log("updated access token list :", obj.access_tokens);

                            if(!obj.locale && (payload.hasOwnProperty("locale") == true)){

                                obj.locale  = payload.locale;

                                //obj.locale  = {
                                //
                                //    language : payload.locale
                                //}
                            }

                            //console.log("logging in user object :", obj.username, obj._id);

                            //console.log("Sign In payload :", payload);

                            if(payload.hasOwnProperty("pushSubscription") == true){

                                //pushDevices
                                if(! obj.pushDevices){

                                    //console.log("Creating push devices object");

                                    obj.pushDevices =   {

                                        ios     :   [],
                                        android :   [],
                                        web     :   []
                                    }
                                }
                                else{

                                    //console.log("pushDevices : ", obj.pushDevices);
                                }

                                let os = payload.pushSubscription.os;
                                var devices = obj.pushDevices[os];

                                //console.log("OS :", os, " current devices :", devices);

                                if(payload.pushSubscription.deviceToken.length > 0){

                                    //devices.push(payload.pushSubscription.deviceToken);

                                    if(devices.length == 0){

                                        devices.push(payload.pushSubscription.deviceToken);
                                    }
                                    else if(devices.length > 0 && devices.indexOf(payload.pushSubscription.deviceToken) == -1){

                                        devices.push(payload.pushSubscription.deviceToken);
                                    }
                                    else{
                                        console.warn("Supplied device token for OS :",os," exists already in the list. Avoiding duplication");
                                    }
                                }
                                else{
                                    console.warn("Device token is either empty or of ZERO length");
                                }

                            }

                            // New code ends here

                            var newAdmin = obj;//new UserModel(obj);

                            console.log(newAdmin);

                            newAdmin.save(function(err, savedAdmin, rowsAffected){

                                if(err || rowsAffected == 0){

                                    console.error(err || 'Problem saving Admin.');

                                    reply({

                                        success :   false,
                                        error   :   err || 'Problem saving Admin.',
                                        message_readable    :   request.i18n.__('Server Error occurred. Please try again')
                                    });
                                }
                                else{

                                    let arrMerchantIds  =   savedAdmin.merchants;

                                    var rep = savedAdmin.toObject();

                                    // New code starts here
                                    rep.access_token    =   token;
                                    delete rep.access_tokens;

                                    //console.log("updated Admin : ", rep);
                                    // New code ends here

                                    let webPushServerKeys = WebPushService.funcs.getServerKeys();

                                    console.log("WebPushService -- Server Keys -- :", webPushServerKeys);

                                    if(webPushServerKeys.publicKey){
                                        //console.log("WebPushService -- Server Keys -- :", webPushServerKeys);
                                        rep.webPushKey = webPushServerKeys.publicKey;
                                    }

                                    if(arrMerchantIds.length > 0){
                                        MerchantModel
                                            .find({_id : {$in : arrMerchantIds}})
                                            .select('_id name hasLoyaltyScheme formatted_address formatted_phone_number international_phone_number icon opening_hours icon geometry statistics locale website vicinity open_now')
                                            .exec(function (err2, merchants) {

                                                if(err2 == null && merchants){

                                                    rep.merchants   =   merchants;
                                                    reply({
                                                        success :   true,
                                                        data    :   rep,
                                                        message :   request.i18n.__("Admin authenticated successfully")
                                                    });

                                                    AdminModel.update({_id : savedAdmin._id},{pushDevices : newAdmin.pushDevices },{multi: false},function(err, updateResult){

                                                        console.error("Admin update error : ", err);

                                                        //console.log("Admin signing in.. updated Admin : ", updateResult);
                                                    });

                                                }
                                                else{

                                                    return sendErrorReply(err2!= null ? err2 : request.i18n.__('Admin does not have any merchant'),
                                                        request.i18n.__('Error occurred retrieving Admin details'), 400, reply);
                                                }

                                            });
                                    }
                                    else{

                                        reply({

                                            success :   true,
                                            data    :   rep,
                                            message :   request.i18n.__("Admin authenticated successfully")
                                        });

                                        console.log("Admin authenticated successfully");
                                    }

                                }
                            });

                        }
                        else{

                            reply({
                                success             :   false,
                                error               :   request.i18n.__('Admin with email address does not exists'),
                                message_readable    :   request.i18n.__('Invalid UserName and password'),
                                isMatching          :   false
                            }).code(302)

                        }

                    });

                }
                else{


                    reply({
                        success             :   false,
                        error               :   request.i18n.__('Admin with email address does not exists'),
                        message_readable    :   request.i18n.__('Invalid UserName and password'),
                        isMatching          :   false
                    }).code(302)

                }
            });

        }

        execute(aFunc);

    },

    signOut  :   function(request, reply){

        var aFunc = function(){

            console.log('Sign Out Requested by Admin');

            let req =  request;

            //console.log(request.auth.token);
            //
            //console.log(request.headers.authorization);

            var token  = null;

            if(request.auth.token && request.auth.token.length > 0){

                token  = request.auth.token;
            }
            else if(request.headers.authorization && request.headers.authorization.length > 0){

                token  = request.headers.authorization;
            }
            else{

                return reply({

                    success  :   false,
                    error    :   "No access token found",
                    message  :   request.i18n.__("Server can not find user requesting sign out")
                })
            }

            // let token  =  request.auth.token; //request.headers.authorization || request.auth.token;

            token = token.indexOf("Bearer ") != -1 ? token.replace("Bearer" ,"") : token;

            let tokenString =   String(token).trim();

            index.invalidateToken(tokenString,  function(res){

                //console.log(res);

                //  below code removes supplied device token of specific OS on signout

                if( (res.success  ==   true) && (req.params.os) && (req.params.deviceToken) ){

                    if(res.data){

                        if(res.data.entity){

                            AdminModel.findOne({_id : res.data.entity._id},function(err, admin){

                                if(admin && (!err)){

                                    var _allPushDevices     =    admin.pushDevices;
                                    var _pushDevices    =    admin.pushDevices[req.params.os];
                                    let deviceTokenToBeRemoved  =    req.params.deviceToken;

                                    //console.log("push devices before:", _allPushDevices);

                                    //var i = 0;
                                    for(var dToken in _pushDevices){

                                        //console.log("dToken :", dToken);
                                        //
                                        //console.log("deviceTokenToBeRemoved :", deviceTokenToBeRemoved);

                                        if(_pushDevices[dToken] === deviceTokenToBeRemoved){
                                            _pushDevices.splice(dToken,1);
                                            _allPushDevices[req.params.os]  =    _pushDevices;
                                            break;
                                        }
                                        // i++;
                                    }

                                    //console.log("revised push devices for os :", req.params.os);
                                    //console.log("revised push devices :", _allPushDevices);

                                    let shouldLogOut = true;

                                    let devices_ios =    _allPushDevices['ios'];
                                    let devices_android =    _allPushDevices['android'];
                                    let devices_web =    _allPushDevices['web'];

                                    //console.log("devices_ios : ", devices_ios);
                                    //console.log("devices_android : ", devices_android);

                                    //console.log("boolean check :", ((devices_ios &&  devices_ios.length > 0) || (devices_android &&  devices_android.length > 0)));

                                    if((devices_ios &&  devices_ios.length > 0) ||
                                        (devices_android &&  devices_android.length > 0) ||
                                        (devices_web &&  devices_web.length > 0)){

                                        shouldLogOut    =    false;
                                    }

                                    //console.log("!shouldLogOut : ", !shouldLogOut);

                                    admin.update({pushDevices : _allPushDevices, isLoggedIn : !shouldLogOut},{upsert : false, multi : false}, function(err, result){

                                        if(err){

                                            console.error("Error updating push devices on signing out : \n", err);
                                        }
                                        else{

                                            //console.log("Push devices updated :\n", result );

                                            //console.log("Updated Admin :\n", admin );

                                        }
                                    });

                                }
                            });
                        }
                    }
                }




                //  code to remove supplied device token ends here




                reply(res || 'ERROR');
            });

        };

        execute(aFunc);

    },

    registerWebPushSubscription  :   function(req, reply){

        let request  =  req;

        var aFunc   =   function(){


            let aPromise =     validateAdmin();
            aPromise.then(docs  => {
                // Use result1

                //console.log("result 1 obtained -- ", result1);
                //return asyncFunction2(result1); // (A)

                if(docs && docs.length == 1 && (docs[0] != null && docs[0] != undefined) ){

                    console.log("Valid Admins Array -- Unique Admin is : ", docs);

                    //return global.Promise.resolve(docs[0]);

                    return addSubscription(docs[0]);
                }
                else{

                    console.log("Invalid Admins data received : ", docs);

                    let output = docs && docs.length > 1 ? "ADMIN DATA AMBIGUITY AND DUPLICATION" : "No matching Admin user Found.";

                    return global.Promise.reject(output ? output : "Unknown server error occurred");
                }

                //return addReviewToOrder(docs[0]);
            })
                .then(result2 => { // (B)
                    // Use result2
                    console.log("result 2 obtained --", result2.pushSubscribers);

                    reply({

                        success     :    true,
                        message     :   request.i18n.__("Admin device was successfully subscribed"),
                        data        :   result2 ? result2.toObject() : null//result2.toObject()
                    });
                })
                .catch(error => {
                    // Handle errors of asyncFunc1() and asyncFunc2()
                    console.log("error caught -- ");
                    console.error(error);

                    return sendErrorReply(error ? error : "Unknown server error occurred",
                        error.message ? error.message : request.i18n.__("Error occurred subscribing admin device for Push Notification"),
                        error.message ? 400 : 404, reply);
                });

        };


        var addSubscription  =   function(admin){

            console.log("inside addSubscription -- ", admin);

            let anAdmin =   admin;

            if(anAdmin.pushSubscribers && anAdmin.pushSubscribers.length > 0){

                /*
                let newSubscribers = anAdmin.pushSubscribers.map(function(element, index){

                    if(element.os === request.payload.os){

                        if(element.devices.indexOf(request.payload.device) == -1){

                            element.devices.push(JSON.stringify(request.payload.device))
                        }

                        return element;
                    }
                    return element;
                });
                */

                anAdmin.pushSubscribers = [
                    {
                        os  :   request.payload.os,
                        devices : [JSON.stringify(request.payload.device)] //[request.payload.device]
                    }
                ];

                //console.log("newSubscribers : ", newSubscribers);
                console.log("old subscibers :", anAdmin.pushSubscribers);
            }
            else{

                anAdmin.pushSubscribers = [
                    {
                        os  :   request.payload.os,
                        devices : [JSON.stringify(request.payload.device)] //[request.payload.device]
                    }
                ];

                console.log("old subscibers :", anAdmin.pushSubscribers);
            }


            return anAdmin.save();

        };

        var validateAdmin   =   function(){

            console.log("inside register Web Push Subscription Function ");

            let authUser = req.auth.credentials ? req.auth.credentials.member : null;

            //console.log("PUBLISH REVIEW : Curr auth user from credentials : ", authUser);

            if (authUser.role === 'admin') {

                let criteria    =   {_id : authUser._id}; //, review : null

                return  AdminModel.find(criteria).exec();
            }
        }

        execute(aFunc);
    },

    registerWebPushSubscription2  :   function(req, reply){

        let request  =  req;

        var aFunc   =   function(){

            let aPromise =     validateAdmin();
            aPromise.then(docs  => {
                // Use result1

                //console.log("result 1 obtained -- ", result1);
                //return asyncFunction2(result1); // (A)

                if(docs && docs.length == 1 && (docs[0] != null && docs[0] != undefined) ){

                    //console.log("Valid Admins WebPushSubscription Array -- Unique Admin is : ", docs);

                    //return global.Promise.resolve(docs[0]);

                    return addSubscription(docs[0]);
                }
                else{

                    //console.log("Invalid Admins data received : ", docs);

                    let output = docs && docs.length > 1 ? "ADMIN DATA AMBIGUITY AND DUPLICATION" : "No matching Admin user Found.";

                    return global.Promise.reject(output ? output : "Unknown server error occurred");
                }

                //return addReviewToOrder(docs[0]);
            })
                .then(result2 => { // (B)
                    // Use result2
                    //console.log("result 2 obtained --", result2.pushSubscribers);

                    console.log("Admin Data after Subscription Operation --", result2);

                    reply({

                        success     :    true,
                        message     :   request.i18n.__("Admin device was successfully subscribed"),
                        data        :   result2 ? result2.toObject() : null//result2.toObject()
                    });
                })
                .catch(error => {
                    // Handle errors of asyncFunc1() and asyncFunc2()
                    //console.log("error caught -- ");
                    console.error(error);

                    return sendErrorReply(error ? error : "Unknown server error occurred",
                        error.message ? error.message : request.i18n.__("Error occurred subscribing admin device for Push Notification"),
                        error.message ? 400 : 404, reply);
                });

        };


        var addSubscription  =   function(admin){

            console.log("inside addSubscription -- ", admin);

            let anAdmin =   admin;


            if(anAdmin.pushSubscribers && anAdmin.pushSubscribers.length > 0){

                console.log("old subscibers :", anAdmin.pushSubscribers);

                anAdmin.pushSubscribers = [
                    {
                        os  :   request.payload.os,
                        devices : [request.payload.device] //[request.payload.device]
                    }
                ];

                //console.log("newSubscribers : ", anAdmin.pushSubscribers);

            }
            else{

                //console.log("old subscibers :", anAdmin.pushSubscribers);

                anAdmin.pushSubscribers = [
                    {
                        os  :   request.payload.os,
                        devices : [request.payload.device] //[request.payload.device]
                    }
                ];

                //console.log("newSubscribers : ", anAdmin.pushSubscribers);
            }

            if(!anAdmin.pushDevices){

                anAdmin.pushDevices =    {
                    ios     :    [],
                    android :       [],
                    web     :   []
                };
            }
            else{

            }

            let x   =       anAdmin.pushDevices.web.indexOf("-");
            let y   =       anAdmin.pushDevices.web.indexOf("_");

            if(x != -1) {

                anAdmin.pushDevices.web.splice(x, 1);

            }
            else if(y != -1) {

                anAdmin.pushDevices.web.splice(y, 1);
            }

            let searchIndex  = anAdmin.pushDevices[appConfig._CLIENT_OS.WEB].indexOf(request.payload.device);

            console.log("----------------------");

            console.log("---- Push Device Req payload ", request.payload);
            console.log("----------------------");

            if( searchIndex == -1){

                console.log("Non existing web push device ID. Adding to list.");
                anAdmin.pushDevices[appConfig._CLIENT_OS.WEB].push(request.payload.device)
            }
            else{

                console.log("web push device ID already exists.");

                //anAdmin.pushDevices[appConfig._CLIENT_OS.WEB2].splice(searchIndex, 1);
            }

            console.log("Admin Web Push devices list updated :", anAdmin.pushDevices);

            anAdmin.update({pushDevices : anAdmin.pushDevices },{upsert : false, multi : false}, function(err, result){

                if(err){

                    console.error("[Web push Subscription] error :", err);
                }
                else{

                    console.log("[Web push Subscription]  result : ", result);

                    //return anAdmin.save()
                }
            });

            return anAdmin.save()



        };

        var validateAdmin   =   function(){

            //console.log("inside register Web Push Subscription Function ");

            let authUser = req.auth.credentials ? req.auth.credentials.member : null;

            //console.log("PUBLISH REVIEW : Curr auth user from credentials : ", authUser);

            if (authUser.role === 'admin') {

                let criteria    =   {_id : authUser._id}; //, review : null

                return  AdminModel.find(criteria).exec();
            }
        }

        execute(aFunc);
    },

    forgotPassword  :   function(req, reply){

        var aFunc = function(){

            let request = req;

            let payload = req.payload;

            AdminModel.checkUniqueness(null, payload.email, function(err, user) {

                console.error(err);
                //console.log(user);

                if (err) {

                    console.error('error checking uniqueness of Admin. Error' + err);

                    reply({

                        success :   false,
                        error   :   err || 'Error checking Admin in database',
                        message_readable    :   request.i18n.__("Server error occurred while checking Admin in our records of registered Admins. ")

                    }).code(500);
                }
                else if (user) {

                    console.error('Admin already exists');

                    console.log("Removing all active access tokens of Admin to invalidate all current sessions.");

                    AdminModel.findOneAndUpdate({_id : user._id},{ $set: { access_tokens : []  } },null, function(erra, modAdmin){

                        if(erra == null && modAdmin){

                            console.log("All Active access token or sessions of Admin removed successfully");
                        }
                        else{

                            console.error("Removing Admin's all currents sessiosn or access tokens failed due to error : ", erra);
                        }
                    });





                    var saltPassword    =   function(plainPwd){

                        //console.log("password :", plainPwd);

                        if(plainPwd){

                            helpers_generic.encryptPassword(plainPwd,10, function(err, result){

                                if(err){

                                    reply({

                                        success  :   false,
                                        error    :   err,
                                        message  :   request.i18n.__("Admin password reset failed")
                                    }).code(302)
                                }
                                else{

                                    hashedPwd = result;

                                    obj.password = hashedPwd;

                                    //console.log(obj);

                                    AdminModel.findOneAndUpdate({email : req.payload.email},{$set : {password : hashedPwd, access_tokens : null}},{upsert : false, multi : false}, function(err, updatedUser){

                                        if(updatedUser && err == null){

                                            //console.log("Approaching mail sending operation");

                                            let rep = updatedUser.toObject();//savedUser.toPublic();


                                            let mailData = {

                                                to : rep.email,
                                                data : {
                                                    username : rep.username,
                                                },
                                                subject :   req.i18n.__("YummZ- Reset Password"),
                                                text    :   content_text,
                                                html    :   content_html

                                            };

                                            Mailer.sendNonTemplateEmail(mailData, function(err, result){

                                                //console.log(result ? result : err);

                                                var data  = {}

                                                if(result && err == null){

                                                    if(payload.action == 'forgot_password'){

                                                        data  = {

                                                            forgot_password :  true,
                                                            email_delivered :  true
                                                        }
                                                    }
                                                    else if(payload.action == 'reset_password'){

                                                        data  = {

                                                            reset_password :  true,
                                                            email_delivered :  true
                                                        }
                                                    }

                                                    reply({

                                                        success :   true,
                                                        data    :   data,
                                                        message : payload.action == 'reset_password' ? request.i18n.__("Admin password was reset successfully") :
                                                            request.i18n.__("Admin password was reset successfully and sent via Email to Admin.")
                                                    }).code(200);

                                                }
                                                else{

                                                    reply({

                                                        success :   true,
                                                        data    :   data,
                                                        message :   request.i18n.__("Admin password was reset successfully but  Email notification failed.Please reset the password again")
                                                    }).code(200);
                                                }

                                            });

                                            //console.log("Updated details on Admin saved successfully");
                                        }
                                        else{
                                            reply({
                                                success     :    false,
                                                error       :    err ?  err : request.i18n.__("Unknown server error occurred while updating Admin password"),
                                                message     :    request.i18n.__("Admin password reset failed")
                                            }).code(500);
                                        }
                                    });

                                }
                            });

                        }
                    }

                    var obj = user;

                    var hashedPwd    =   null;

                    var plainPwd  =   null;

                    var locale  =  payload.hasOwnProperty("locale") == true? payload.locale :  (req.headers["language"] ? req.headers["language"] : appConfig._LOCALE.ENGLISH);//appConfig._LOCALE.ENGLISH;

                    var content_text = "\n Hello "+ obj.first_name +", \n Please use below mentioned access code to set new password. Please do not share your code others due to security concerns." +
                        "\n\n Your access code  is : "+ plainPwd;

                    var content_html =  "Hello <b>"+ obj.first_name +"</b>,"+"<br> Please use below mentioned access code to set new password. Please do not share your password others due to security concerns.</b>" +
                        "<br>Your access code is : <b>"+ plainPwd +"</b></br>";

                    if(payload.action === 'forgot_password'){

                        var make_passwd = function(n, a) {
                            var index = (Math.random() * (a.length - 1)).toFixed(0);
                            return n > 0 ? a[index] + make_passwd(n - 1, a) : '';
                        };

                        var password = make_passwd(8, 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890');

                        payload.password    =   password;
                        plainPwd    =   password;

                        if(payload.hasOwnProperty("locale") == true &&  locale == appConfig._LOCALE.SPANISH){

                            content_text = "\n Hola" + (obj.first_name ? obj.first_name : obj.username) + ", \n Utilice el código de acceso mencionado a continuación para establecer una nueva contraseña. Por favor, no comparta su contraseña con otros debido a problemas de seguridad." +
                                "\n\n Su código de acceso es: " + plainPwd;

                            content_html = "Hola <b>"+ (obj.first_name ? obj.first_name : obj.username) +"</b>,"+"<br>Utilice el código de acceso mencionado a continuación para establecer una nueva contraseña. No comparta su contraseña con otros debido a problemas de seguridad.</b>" +
                                "<br>Su código de acceso es: <b>"+ plainPwd +"</b></br>"
                        }
                        else{

                            content_text = "\n Hello "+ (obj.first_name ? obj.first_name : obj.username) +", \n Please use below mentioned access code to set new password. Please do not share your code others due to security concerns." +
                                "\n\n Your access code  is : "+ plainPwd;

                            content_html =  "Hello <b>"+ (obj.first_name ? obj.first_name : obj.username) +"</b>,"+"<br> Please use below mentioned access code to set new password. Please do not share your password others due to security concerns.</b>" +
                                "<br>Your access code  is : <b>"+ plainPwd +"</b></br>";
                        }

                        saltPassword(plainPwd);
                    }
                    else if(payload.action === 'reset_password'){

                        // check against old passowrd
                        //console.log("Started checking against old pwd and new pwd for RESET PASSWORD");
                        helpers_generic.matchPassword(payload.old_password,obj.password, function(err, isMatching) {

                            //console.log('err : ' + err + '\n is matching : ' + isMatching);

                            if (isMatching ==  false  || err != null) {

                                //console.log("RESET PASSWORD operation failed");

                                return reply({

                                    success     :    false,
                                    error       :    err ? err : request.i18n.__("Access Code does not match."),
                                    message     :    request.i18n.__("Access Code does not match.")
                                }).code(302)
                            }
                            else if(isMatching == true){

                                plainPwd    =   payload.new_password;

                                if(payload.hasOwnProperty("locale") == true &&  locale == appConfig._LOCALE.SPANISH){

                                    content_text = "\n Hola" + (obj.first_name ? obj.first_name : obj.username) + ", \n Su contraseña se restablece correctamente. No comparta su contraseña con otras personas debido a problemas de seguridad.";

                                    content_html = "Hola <b>"+ (obj.first_name ? obj.first_name : obj.username) +"</b>,"+"<br>Su contraseña se restablece correctamente. No comparta su contraseña con otras personas debido a problemas de seguridad.</b>";
                                }
                                else{

                                    content_text = "\n Hello "+ (obj.first_name ? obj.first_name : obj.username) +", \n Your password is reset successfully. Please do not share your password with others due to security concerns.";

                                    content_html =  "Hello <b>"+ (obj.first_name ? obj.first_name : obj.username) +"</b>,"+"<br> Your password is reset successfully. Please do not share your password with others due to security concerns.</b>";
                                }

                                saltPassword(plainPwd);
                            }
                        })
                        // check ends here


                        //plainPwd    =   payload.new_password;
                        //
                        //if(payload.hasOwnProperty("locale") == true &&  locale == appConfig._LOCALE.SPANISH){
                        //
                        //    content_text = "\n Hola" + obj.first_name + ", \n Por favor, utilice la contraseña temporal que se menciona a continuación para iniciar sesión en la aplicación. Por favor, no comparta su contraseña con otros debido a problemas de seguridad.";
                        //
                        //    content_html = "Hola <b>"+ obj.first_name +"</b>,"+"<br>Utilice la contraseña temporal mencionada a continuación para iniciar sesión en la aplicación. No comparta su contraseña con otros debido a problemas de seguridad.</b>";
                        //}
                        //else{
                        //
                        //     content_text = "\n Hello "+ obj.first_name +", \n Your access code is reset successfully. Please do not share your access code others due to security concerns.";
                        //
                        //     content_html =  "Hello <b>"+ obj.first_name +"</b>,"+"<br> Your access code is reset successfully. Please do not share your access code others due to security concerns.</b>";
                        //}

                    }


                }
                else{

                    return  reply({
                        success             :   false,
                        error               :   request.i18n.__("Admin with email address not found"),
                        message_readable    :   request.i18n.__("Admin with email address does not exists"),//'Invalid UserName and password',
                        isMatching          :   false
                    }).code(302)

                }
            });

        }

        execute(aFunc);
    }

}



