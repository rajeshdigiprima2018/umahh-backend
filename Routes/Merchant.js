/**
 * Created by rv2016 on 04/11/16.
 */


'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const fs = require('fs');
const Wreck = require('wreck');
const async = require('async');
const rq = require('request');
const Path = require('path');
const relish = require('relish')({

    stripQuotes:true,
    messages    :{
        email   :   'Please provide valid email address.'

    }
});

const scopes    =   require('../ENV').prefs._SCOPES;


//  Local Files and Modules Import

var Merchant = require('../Models/merchant.js');

let handler_Merchant = require('../Handlers/Merchant/merchant').funcs_m;
let handler_User = require('../Handlers/User').funcs_u;
let handler_Generic = require('../Handlers/yummzHandlers');
let handler_Admin = require('../Handlers/Admin').funcs_a;

let baseResponses   =   require('./Responses');
let commonValidations   =   baseResponses.commonSchemas;
let responseByCodes =   baseResponses.merchants;//require('./Responses').menuitems;   // Responses by HTTP Status Codes for all routes in this file

const appConfig =   require('../ENV').prefs;


const serverExports = null ;//require('../server');

var shouldPrefix = false;
var pathPrefix = '';

if(serverExports){

    if(serverExports.prefix != undefined && serverExports.prefix != null && serverExports.prefix.length > 0){
        shouldPrefix = true;
        pathPrefix = serverExports.prefix;
    }
    else{
        shouldPrefix = false;
        pathPrefix = '';
    }

}

console.log('common file path :', shouldPrefix == true ? pathPrefix + 'Media/Images/Merchants' : 'Media/Images/Merchants'+'--xxxxxxx');





//  props
// Routes and Handlers

var arrRoutes = [

    /*{
        method: 'GET',
        path: '/api/merchants/external/',
        handler: function (request, reply) {

            let options = {

                //url : 'https://maps.googleapis.com/maps/api/place/search/json?name=pizza&keyword=pizza&location=19.672332,-99.42627&radius=33000&types=restaurant&sensor=true&key=AIzaSyDpayKkzK1RWDxjNN8dZ_tFFaZ1HPAczBY',

                url : 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=19.6723,-99.426&radius=33000&types=restaurant&sensor=true&key=AIzaSyDpayKkzK1RWDxjNN8dZ_tFFaZ1HPAczBY',
                headers : {'Content-Type' : 'application/json', 'Accept' : 'application/json'}
            }

            rq(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    let jsonBody = JSON.parse(body);

                    // console.log(jsonBody.results);

                    var results = jsonBody.results;

                    var arrMerchants = [];


                    for(var counter = 0; counter < results.length ; counter++){

                        console.log('iterating through result array');
                        let merchantObj = results[counter];

                        //console.log(merchantObj);

                        var merchant = new Merchant.MerchantModel(merchantObj);

                        merchant.save(
                            function (err) {

                                if(err){
                                    console.log('error saving Merchant model to DB' + err);
                                    reply({
                                        success : false
                                    })
                                }
                                else{

                                    arrMerchants.push(merchant);
                                    console.log('Successfully saved Merchant model to DB' + merchant);

                                }
                            }
                        )

                        //counter++;
                        //reply(body)
                    }
                    console.log('sending response to client');
                    reply({

                        success : true,
                        data:{
                            merchants:arrMerchants
                        }
                    })

                }
                else{
                    console.log(error);
                    console.log(response);
                    reply({'error' : error, 'response' : response});
                }
            });
        }
    },*/


    {

        method:'GET',
        path:'/api/merchants',
        handler: handler_Merchant.getAll,
        config : {
            description :   'Get All Merchants',
            notes: 'Returns All Merchants created',
            tags: ['api','admin','mobile'], // ADD THIS TAG
            validate : {}
        }

    },

    {

        method:'GET',
        path:'/api/merchants/nearby/{latitude}/{longitude}/{radius}',
        handler: handler_Merchant.searchNearBy,
        config : {
            description :   'Get All Near By Merchants within range',
            notes: 'Returns All Merchants within specified geo-range. Sorted in nearest to farthest manner.',
            tags: ['api','mobile'], // ADD THIS TAG
            validate : {
                params  :   {
                    latitude   :   Joi.number().min(-90.0000).max(90.0000).precision(4).required(),
                    longitude   :   Joi.number().min(-180.0000).max(180.0000).precision(4).required(),
                    radius      :   Joi.number().min(1).max(99999).integer().positive().required()
                        .description("Radius in KMs")

                }
            }
        }

    },

    {

        method:'GET',
        path:'/api/merchant/{merchant_id}',
        handler: handler_Merchant.getDetails,
        config : {
            description :   'Get all details of Specific Merchant',
            notes: 'Returns specific Merchant with all detail',
            tags: ['api','admin','mobile'], // ADD THIS TAG
            //auth : 'token',
            //auth :  {strategy   :   'token', mode : 'optional',scope : [scopes.CONSUMER, scopes.ADMIN]},
           /* auth :  {strategy   :   'token', mode : 'required',scope : [scopes.CONSUMER, scopes.ADMIN]},*/

            validate : {
                params  :   {
                    merchant_id :   baseResponses.commonSchemas.mongooseID.required()
                }
            },
            response   :   {
                modify :   true,
                status :   responseByCodes.getDetails,
                options: {
                    stripUnknown: true // removes all those keys from response object which are not mentioned in response schema
                }
            }
        }

    },


    {

        method:'GET',
        path:'/api/merchants/{merchant_id}/{scope}',
        handler: handler_Merchant.getDetails,
        config : {
            description :   'Get all details of Specific Merchant -- for User',
            notes: 'Returns specific Merchant with all detail to calling user',
            tags: ['api','mobile'], // ADD THIS TAG
            //auth :  {strategy   :   'token', mode : 'optional',scope : [scopes.CONSUMER, scopes.ADMIN]},
            auth :  {strategy   :   'token', mode : 'optional',scope : [scopes.CONSUMER, scopes.ADMIN]},

            validate : {
                params  :   {
                    merchant_id :   baseResponses.commonSchemas.mongooseID.required(),
                    scope : Joi.string().valid('admin','user','guest').required()
                }
            },
            response   :   {
                modify :   true,
                status :   responseByCodes.getDetails,
                options: {
                    stripUnknown: true // removes all those keys from response object which are not mentioned in response schema
                }
            }
        }

    },


    {

        method  :   'GET',
        path    :   '/api/merchants/fetch/images',
        handler :   handler_Merchant.fetchImages,
        config  :{
            description :   'Add Images to existing Merchants Data',
            notes       :   'Returns Merchant collection with images associated with each object',
            tags        :   ['api'],
            validate    :   {}
        }

    },


    {

        method  :   'POST',
        path    :   '/api/merchant',
        handler :   handler_Merchant.addNewR,
        config  :{
            description :   'Adds a new Merchant to existing Merchants Collection',
            notes       :   'Returns newly created Merchant object',
            tags        :   ['api','admin'],
            auth        :   'token',
            //plugins: {
            //    'hapi-swagger': {
            //        payloadType: 'form'
            //    }
            //},
            //payload: {
            //    output: 'stream',
            //    parse: true,
            //    allow: 'multipart/form-data',
            //    maxBytes: 10 * 1024 * 1024,
            //    'failAction' :  'error',
            //    timeout:    12000
            //},
            validate    :   {

                payload: {

                    name : Joi.string().required().min(3).max(200).trim(),
                    vicinity : Joi.string().required().min(3).trim(),
                    formatted_address : Joi.string().required().min(3).trim(),
                    formatted_phone_number :  Joi.string().required().min(3).max(15).trim(),   // e.g. "01 55 6078 7854"
                    international_phone_number :  Joi.string().required().min(3).max(15).trim(),   // e.g. "+52 55 6078 7854"
                    website :  Joi.string().uri(),  //
                    geometry : Joi.object({
                        location : Joi.object().keys({
                            lat : Joi.number().min(-90.00).max(90.00).required(),
                            lng : Joi.number().min(-180.00).max(180.00).required()
                        }).required()
                    }).required(), // While inserting this value from Swagger UI put the value like this
                    /*
                     {"location":{"lat":1.6454567,"lng":-3.2464747}}


                    image: Joi.any()
                        .meta({ swaggerType: 'file'})
                        .description('json file -- Merchant Logo')
                        */
                }

            }
        }

    },

    {
        method: 'PATCH',
        path: '/api/merchants/{merchant_id}/logo',//  /{merchant_id}',
        handler: handler_Merchant.changeLogo,
        config  : {
            description: 'Modifies logo/icon for a Merchant',
            notes: 'Replaces Old icon(if exists) with new one OR creates a new Icon based on image file supplied.\n' +
            '\nModifies the URL of logo/icon of existing merchant.\n' +
            '\nReturns modified url for merchant logo/icon ',
            tags: ['api','merchants','admin'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 1 * 1024 * 1024,
                'failAction' :  'error',
                timeout:    110000//12000
            },
            validate:{

                payload:    {
                    image_logo  :  Joi.any()
                        .meta({ swaggerType: 'file'})
                        .description('Merchant Logo File')
                },
                params  :   {

                    merchant_id :  baseResponses.commonSchemas.mongooseID.required(),
                }
            },
            response   :   {

                modify :   true,
                status :   responseByCodes.changeLogo,
                options: {
                    stripUnknown: true // removes all those keys from response object which are not mentioned in response schema
                }
            }
        }
    },


    {
        method: 'POST',
        path: '/api/merchants/{merchant_id}/gallery/image',//  /{merchant_id}',
        handler: handler_Merchant.upsertGalleryImage,
        config  : {
            description: 'INSERTs or UPDATEs image into a Merchant gallery',
            notes: 'Returns modified merchant object.\nWhen \"path"\ field is empty in payload, selected Image is inserted as new image inside Gallery.' +
            'Otherwise when \"path"\ field is provided in payload, the image at \"uri"\ inside \"path"\ field will be replaced by the image selected. \n' +
            '\nThe function now appends time stamp in milliseconds to file name. e.g. file name would be : \'logo_merchantID_timestamp.extension\' \n' +
            '\n-- Old icon file at path would be deleted now.\n' +
            '\n-- The API response will now return only inserted/modified single object inside \'paths\' array inside \'images_new\' inside \'data\' object in JSON Response.',
            tags: ['api','merchants','admin'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                maxBytes: 1 * 1024 * 1024,
                'failAction' :  'error',
                timeout:    110000//12000
            },
            validate:{

                payload:    {
                    path    :  Joi.object().keys({
                        id : Joi.number().required().greater(-1),
                        uri: baseResponses.commonSchemas.uri
                    }).optional(),
                    //merchant_id : Joi.string().required().alphanum().min(5).max(50),
                    image_gallery  :  Joi.any()
                        .meta({ swaggerType: 'file'})
                        .description('Merchant Image File')
                },

                params  :   {

                    merchant_id : baseResponses.commonSchemas.mongooseID.required()
                }
            },
            response   :   {

                modify :   true,
                status :   responseByCodes.modifyGalleyImage,
                options: {
                    stripUnknown: true // removes all those keys from response object which are not mentioned in response schema
                }
            }
        }
    },


    {
        method: 'DELETE',
        path: '/api/merchants/{merchant_id}/gallery/image',//  /{merchant_id}',
        handler: handler_Merchant.removeGalleryImage,
        config  : {
            description: 'Removes an image from a Merchant gallery.',
            notes: 'Deletes Image at URL specified in \"path\" object inside payload.\n' +
            '\nReturns "Success" or "Error" status based on delete operation outcome.',
            tags: ['api','merchants','admin'],
            validate:{

                payload:    {
                    path    :  Joi.object().keys({
                        id : Joi.number().required().greater(-1),
                        uri: Joi.string().required().min(3).allow(['/','.',':'])
                    }).required(),
                },
                params  :   {

                    merchant_id : baseResponses.commonSchemas.mongooseID.required()
                }
            },
            response   :   {

                modify :   true,
                status :   responseByCodes.removeGalleyImage,
                options: {
                    stripUnknown: true // removes all those keys from response object which are not mentioned in response schema
                }
            }
        }
    },


    {
        method: 'DELETE',
        path: '/api/merchants/delete',//  /{merchant_id}',
        handler: handler_Merchant.deleteMerchant,
        config  : {
            description: 'Deletes a Merchant',
            notes: 'Deletes a Merchant object specified by \"merchant_id\" field inside payload.\n' +
            '\nReturns "merchant_id" in case succes or "Error" status based on delete operation outcome. ',
            //response:{
            //    schema : {
            //        success : Joi.boolean(),
            //        data : Joi.object()/*.keys({
            //         merchant_id :   Joi.string()//.required().alphanum().min(5).max(50)
            //         })*/.optional(),
            //        error :  Joi.object().optional()
            //    }
            //},
            tags: ['api','merchants','admin'],
            validate:{
                failAction  :   relish.failAction,
                payload:    {
                    merchant_id : Joi.string().required().alphanum().min(5).max(50),
                }
            },
            response    :   {

                status :   {

                    200    :   Joi.object({

                        success : Joi.boolean(),
                        message : Joi.string(),
                        data    : Joi.object()
                    }),

                    400    :   Joi.object({

                        success : Joi.boolean().allow(false),
                        message : Joi.string(),
                        error   : Joi.object().optional()
                    })
                }
            }

        }
    },


    {
        method: 'DELETE',
        path: '/api/merchants/{merchant_id}/gallery',//  /{merchant_id}',
        handler: handler_Merchant.deleteGallery,
        config  : {
            description: 'Removes gallery of a Merchant',
            notes: 'Removes all image files (if exists any) from Merchant\'s gallery.\n' +
            '\nReturns empty gallery object',
            tags: ['api','merchants','admin'],
            validate:{
                failAction  :   relish.failAction,
                params  :   {
                    merchant_id :   baseResponses.commonSchemas.mongooseID.required()
                }
            },
            //response    :   {
            //
            //    status :   {
            //
            //        200    :   Joi.object({
            //
            //            success : Joi.boolean(),
            //            message : Joi.string(),
            //            data    : Joi.object()
            //        }),
            //
            //        400    :   Joi.object({
            //
            //            success : Joi.boolean().allow(false),
            //            message : Joi.string(),
            //            error   : Joi.object().optional()
            //        })
            //    }
            //}

        }
    },


    {
        method: 'PATCH',
        path: '/api/merchants/modify/{merchant_id}',
        handler: handler_Merchant.modifyMerchant,
        config  : {
            description: 'Modifies Merchant object as specified in fields (one or more) inside payload.',
            notes: 'Returns modified merchant object in case of "Success" or "Error" object based on update operation outcome. ',
            //response:{
            //    schema : {
            //        success : Joi.boolean(),
            //        data : Joi.object()/*.keys({
            //         merchant_id :   Joi.string()//.required().alphanum().min(5).max(50)
            //         })*/.optional(),
            //        error :  Joi.object().optional()
            //    }
            //},
            tags: ['api','merchants','admin'],
            validate:{
                payload: Joi.object().keys({

                    name : Joi.string().min(3).trim().label('name'),
                    vicinity : Joi.string().min(3).trim().label('vicinity'),
                    //icon : Joi.string().uri().trim().optional(),
                    formatted_address : Joi.string().min(3).trim().label('formatted address'),
                    formatted_phone_number :  Joi.string().min(3).max(15).trim().label('formatted phone number'),   // e.g. "01 55 6078 7854"
                    international_phone_number :  Joi.string().min(3).max(15).trim().label('formatted international phone number'),   // e.g. "+52 55 6078 7854"
                    website :  Joi.string().uri().trim(),  //
                    open_now : Joi.boolean().required(),
                    market_id : baseResponses.commonSchemas.objectID, // market ID
                    aboutUs :   Joi.string().min(10).max(250).trim().label('Restaurant About Us details').example('Description less than 250 characters'),
                    market_name :  Joi.string().min(5).max(100).trim().label('Market name').example('Some Market Name'),
                    locale          :   Joi.string().max(2).allow([appConfig._LOCALE.ENGLISH, appConfig._LOCALE.SPANISH]).optional(),

                    //opening_hours : Joi.object().keys({
                    //
                    //    open_now    :   Joi.boolean().required().label('Open Now'),
                    //    weekday_text:   Joi.array().required().label('Weekday Text Array')
                    //}),
                    geometry : Joi.object({
                        location : Joi.object().keys({
                            lat : Joi.number().required(),
                            lng : Joi.number().required()
                        })
                    }), // While inserting this value from Swagger UI put the value like this
                    /*
                     {"location":{"lat":1.6454567,"lng":-3.2464747}}

                     */


                }).or('name','vicinity','formatted_address','formatted_phone_number','international_phone_number',
                    'website','open_now','geometry','aboutUs'),

                /*
                 IMP NOTE WHILE USING '.or(string1, string2,....)'

                 never use .required() for any of the fields you want to put inside "OR" operation
                 i.e. string1, string2, ...stringN-- each of which should not have joi.requird() associated withy them
                 here string1...stringN are the names of the fields inside Payload and not the actual field value.

                 */


                params: {

                    merchant_id :   Joi.string().required().alphanum().min(5).max(50)
                }

            },

        }
    },

    {
        method:'POST',
        path:'/api/merchant/register',
        handler:handler_Admin.signUp,
        config: {
            //auth : 'token',
            description: 'Create new Admin - Sign Up API with Email + Pwd',
            notes: 'Returns New Admin created Or an Error Object.\n' +
            '\nNOTE : In case of error check fields -- \'success\' and \'error\'.\n'+
            '\nError object has a special field called \'message_readable\' which can be used to show alert or error to user directly.',
            tags: ['api','mobile','admin'], // ADD THIS TAG
            validate: {
                failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys(
                {
                    username        :    Joi.string().alphanum().min(5).max(30).required(),
                    password        :    Joi.string().regex(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=[^\t\r\n\s\f\v]).([a-zA-Z0-9_@]){8,26})$/).required(),
                    email           :   Joi.string().email().required(),
                    role            :   Joi.string().required()

                    //mobile          :   Joi.string().allow(['+','-']).required()//+91-9xxxxxxx or +91-xx-xxx-xxxxx

                })//).with('password','addressline_1')

            }
        }
    },

    {
        method:'POST',
        path:'/api/merchant/login',
        handler:handler_Admin.signIn,
        config: {
            description: 'Merchant Admin\'s Login Authentication API',
            notes: 'Returns access token for successful login attempt.',
            tags: ['api','admin'], // ADD THIS TAG
            validate: {
                failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: {
                    email           :   Joi.string().email().required(),
                    password        :   Joi.string().allow(['@','&','#']).required(),
                    deviceToken     :   Joi.string().max(200).allow(['','_','-']).optional(),
                    pushSubscription:   Joi.object().keys({
                        os          :   Joi.string().allow([appConfig._CLIENT_OS.IOS, appConfig._CLIENT_OS.ANDROID], appConfig._CLIENT_OS.WEB).optional(),
                        deviceToken :   Joi.string().max(200).allow(['','_','-']).optional(),
                    }).optional(),
                    locale          :   Joi.string().max(2).allow([appConfig._LOCALE.ENGLISH, appConfig._LOCALE.SPANISH]).optional(),

                }

            }
        }
    },


    /*{
        method:'POST',
        path:'/api/merchant/web/subscribe',
        handler:handler_Admin.registerWebPushSubscription,
        config: {
            description: 'Merchant Admin\'s Web Push Notification Subscription API',
            notes: 'Returns success or fail for Subscription registration effort' +
            '\n @os : any one values from  ios -- android -- web',
            tags: ['api','admin'], // ADD THIS TAG
            auth : 'token',
            validate: {
                failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({

                    os : Joi.string().required().description('ios OR android OR web'),
                    device : Joi.object().keys({

                        endpoint    :  Joi.string().uri().required() ,
                        keys        : Joi.object().keys({
                            auth    :    Joi.string().required(),//.token().
                            p256dh  :   Joi.string().required() //token().allow('-').

                        }).required()

                    }).required()
                }).required()
            }
        }
    },*/

    {
        method:'POST',
        path:'/api/merchant/password/forgot',
        handler:handler_Admin.forgotPassword,
        config: {
            description: 'Admin forgot password API',
            notes: 'Returns randomly generated new password in Email.',
            tags: ['api','mobile', 'admin'], // ADD THIS TAG
            validate: {
                failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    action          :   Joi.string().allow('forgot_password').optional(),
                    email           :   Joi.string().email().required(),
                    locale          :   Joi.string().max(2).allow([appConfig._LOCALE.ENGLISH, appConfig._LOCALE.SPANISH]).optional(),
                })
            }
        }
    },

    {
        method:'POST',
        path:'/api/merchant/password/reset',
        handler:handler_Admin.forgotPassword,
        config: {
            description: 'Admin reset password API',
            notes: 'Modifies previous Admin password with newly provided one.',
            tags: ['api','mobile','admin'], // ADD THIS TAG
            validate: {
                failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    action          :   Joi.string().allow('reset_password').optional(),
                    old_password    :   Joi.string().required(),
                    new_password    :   Joi.string().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,24}$/).required(),
                    email           :   Joi.string().email().required(),
                    locale          :   Joi.string().max(2).allow([appConfig._LOCALE.ENGLISH, appConfig._LOCALE.SPANISH]).optional(),
                })

            }
        }
    },


    {
        method:'POST',
        path:'/api/merchant/web/subscribe/v2',
        handler:handler_Admin.registerWebPushSubscription2,
        config: {
            description: 'Merchant Admin\'s Web Push Notification Subscription API',
            notes: 'Returns success or fail for Subscription registration effort' +
            '\n @os : any one values from  ios -- android -- web',
            tags: ['api','admin'], // ADD THIS TAG
            auth : 'token',
            validate: {
                failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    os : Joi.string().required().description('ios OR android OR web2'),
                    device : Joi.string().min(16).max(64).allow('-_').required()
                }).required()
            }
        }
    },


    {
        method:'GET',
        path:'/api/merchant/logout',
        handler:handler_Admin.signOut,
        config: {
            description: 'Merchant Admin\'s Logout  API',
            notes: 'Returns success = TRUE OR FALSE in response.',
            tags: ['api','admin'], // ADD THIS TAG
        }
    },

    // below API endpoint is for Merchant Mobile App only
    {
        method:'GET',
        path:'/api/merchant/logout/{os}/{deviceToken}',
        handler:handler_Admin.signOut,
        config: {
            auth :  {strategy   :   'token', mode : 'optional',scope : [appConfig._SCOPES.ADMIN]},
            description: 'Merchant Admin\'s Logout  API',
            notes: 'Returns success = TRUE OR FALSE in response.',
            tags: ['api','admin'], // ADD THIS TAG
            validate : {
                params  : Joi.object().keys({
                    os          :   Joi.string().allow([appConfig._CLIENT_OS.IOS, appConfig._CLIENT_OS.ANDROID]).optional(),
                    deviceToken :   Joi.string().max(200).allow(['','_','-']).optional(),
                })
            }
        }
    },


    {
        method: 'GET',
        path: '/api/externaldata/merchants/',
        handler: handler_Merchant.externalData_insert_merchants,
        config  : {
            description: 'Adds new Merchants from Google places API',
            notes: 'Returns newly created Merchant objects',
            tags: ['api','external data']
        }
    },


    {
        method:'GET',
        path:'/insert/image',
        handler: function(request, reply){
            handler_Generic.funcs_g.YZHandlers.downloadImage('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CoQBcwAAAGUVjA3fu40-zByRJk-4C5T5sg4Pna587z1MbHdg4oe04AHBgaAGQFgYzkzkYxj23Mj3IEfZxTXUeh7j3Mwa-P5Hg0hAkgQKZpGa6gcF5VrlS30NVVRARuGeAayg3egcXpukyPnGbxDJ7XE0kc3SWRlDQWmBI1jEILyW7GHIKWeTEhARZ-cA32WFbF0JuqyIcSJMGhQEki7KbzXTptRnZK-SVPdDRz6K7Q&key=AIzaSyDpayKkzK1RWDxjNN8dZ_tFFaZ1HPAczBY',
                'sample.png', function(err,message,data){
                    console.log('inside callback function');
                    console.log('message : ' + message);
                    console.log('error : ' + err);

                    console.log('sending Reply to client')
                    if(data != null){

                        console.log(data);
                        reply(data)

                    }
                    else if(err != null){
                        let responseX = ({
                            'message' : message,
                            'err' : err
                        });
                        console.log(responseX);
                        reply(responseX)
                    }
                })
        }

    },


    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                //path: shouldPrefix == true ? pathPrefix + 'Media/Images/Merchants' : '/Media/Images/Merchants',
                path: shouldPrefix == true ? pathPrefix + 'Media/Images' : '/Media/Images',
                    //'Media/Images/Merchants',
                listing : true
            }
        }
    },


    {
        method: 'GET',
        path: '/public/images/{param*}',
        handler: {

            directory: {
                //path: __dirname.replace(__dirname.split(Path.sep).pop(), 'Media/Images/Merchants/'),
                //Path.join(__dirname, 'Media/Images/Merchants/'),
                path: __dirname.replace(__dirname.split(Path.sep).pop(), 'Media/Images/'),
                listing : true
            }

        }
    },

    {
        method  :   'POST',
        path    :   '/api/merchants/{merchant_id}/statistics',
        //path    :   '/api/merchants/statistics',
        handler :   handler_Merchant.getStatistics,
        config: {
            description: 'Get Merchant\'s statistics for various time range',
            notes: 'Returns total number of Orders,Ratings and Revenue for given merchant within given time range in dates' +
            '\n @os : any one values from  ios -- android -- web',
            tags: ['api','admin'], // ADD THIS TAG
            auth :  {strategy   :   'token', mode : 'required',scope : [scopes.ADMIN, scopes.SUPER_ADMIN]},
            validate: {
                failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    time_range  :   Joi.object().keys({
                        from: Joi.date().iso().required(),
                        to: Joi.date().iso().min(Joi.ref('from')).required()
                    })
                }).required(),

                params: {
                    merchant_id :   Joi.string().required().alphanum().min(5).max(50)
                }
            }
        }


    }
];





//  Routes and handlers


exports.register = function(server, options, next) {

    //console.log(
    //    __dirname.split(Path.sep).pop());

    //console.log(__dirname.replace(__dirname.split(Path.sep).pop(), 'Media/Images/Merchants/'));

    const db = server.app.db;

    return next();
};

exports.register.attributes = {
    name: 'routes-merchant',
    routes  :   arrRoutes
};
