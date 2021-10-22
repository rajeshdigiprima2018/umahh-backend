/**
 * Created by rv2016 on 02/11/16.
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

    stripQuotes: true,
    //messages    :{
    //    email   :   'Please provide valid email address.'
    //
    //}
});
const scopes = require('../ENV').prefs._SCOPES;
let baseResponses = require('./Responses');
let commonValidations = baseResponses.commonSchemas;
let responseByCodes = baseResponses.users;
const appConfig = require('../ENV').prefs;

// Local file/Module Imports
const User = require('../Models/user.js');
const handlers_user = require('../Handlers/User').funcs_u;

const handlers_cd = require('../Handlers/CommonData').funcs_cd;
const funcs_smsend = require('../Handlers/SMS').funcs_sms;



const serverExports = null; //require('../server');

var shouldPrefix = false;
var pathPrefix = '';

if (serverExports) {

    if (serverExports.prefix != undefined && serverExports.prefix != null && serverExports.prefix.length > 0) {
        shouldPrefix = true;
        pathPrefix = serverExports.prefix;
    } else {
        shouldPrefix = false;
        pathPrefix = '';
    }

}

console.log('common file path :', shouldPrefix == true ? pathPrefix + 'Media/Images/Merchants' : 'Media/Images/Merchants' + '--xxxxxxx');



var arrRoutes = [



    {
        method: 'GET',
        path: '/',
        handler: function(request, reply) {

            reply.view('home.html');
        }
    },

    {
        method: 'GET',
        path: '/public/images/{param*}',
        handler: {

            directory: {
                path: __dirname.replace(__dirname.split(Path.sep).pop(), 'Media/Images/'),
                listing: true
            }

        }
    },

    {
        method: 'POST',
        path: '/api/user/getAllRoleUsers/{role}',
        handler: handlers_user.getAllRoleUsers,
        config: {
            // auth:   'token',
            description: 'gets all registered users.',
            notes: 'Returns all users registered with System. Both registered via Email and Facebook ',
            tags: ['api', 'sa'], // ADD THIS TAG
            validate: {
                payload: {

                    role: Joi.string().required(),

                }
            }
        }
    },

    {
        method: 'POST',
        path: '/api/web/user/getAllUserWeb',
        handler: handlers_user.getAllUserWeb,
        config: {
            // auth:   'token',
            description: 'gets all registered users.',
            notes: 'Returns all users registered with System. Both registered via Email and Facebook ',
            tags: ['api', 'sa'], // ADD THIS TAG
            validate: {
                payload: {
                    role: Joi.string().required(),
                    count: Joi.number(),
                    page: Joi.number()

                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/web/user/getAllUserWeblastSevenDay',
        handler: handlers_user.getAllUserWeblastSevenDay,
        config: {
            // auth:   'token',
            description: 'gets all registered users.',
            notes: 'Returns all users registered with System. Both registered via Email and Facebook ',
            tags: ['api', 'sa'], // ADD THIS TAG
            validate: {
                payload: {
                    count: Joi.number(),
                    page: Joi.number(),
                    user_id: Joi.string().required()
                }
            }
        }
    },

    {
        method: 'POST',
        path: '/api/user/getAllWebRoleUsers',
        handler: handlers_user.getAllWebRoleUsers,
        config: {
            // auth:   'token',
            description: 'gets all registered users.',
            notes: 'Returns all users registered with System. Both registered via Email and Facebook ',
            tags: ['api', 'sa'], // ADD THIS TAG
            validate: {
                payload: {

                    role: Joi.string().required(),

                }
            }
        }
    },

    {
        method: 'GET',
        path: '/api/user/generatToken',
        handler: handlers_user.generatToken,
        config: {
            // auth:   'token',
            description: 'gets all generatToken users.',
            notes: 'Returns all users generatToken with System',
            tags: ['api', 'sa'], // ADD THIS TAG
        }
    },

    {
        method: 'GET',
        path: '/api/user/getAllUser',
        handler: handlers_user.getAllUsers,
        config: {
            // auth:   'token',
            description: 'gets all registered users.',
            notes: 'Returns all users registered with System. Both registered via Email and Facebook ',
            tags: ['api', 'sa'], // ADD THIS TAG
        }
    },


    {

        method: 'GET',
        path: '/api/web/user/deleteUser/{_id}',
        handler: handlers_user.deleteUser,
        config: {
            description: 'Get all details of Specific User',
            notes: 'Returns specific User with all detail',
            tags: ['api', 'user', 'mobile'], // ADD THIS TAG
            // auth : 'token',
            //auth :  {strategy   :   'token', mode : 'optional',scope : [scopes.CONSUMER, scopes.ADMIN]},
            //auth :  {strategy   :   'token', mode : 'required',scope : [scopes.CONSUMER, scopes.ADMIN, scopes.teacher]},

            validate: {
                params: {
                    _id: Joi.string().alphanum().min(1).max(32).required(),
                }
            },
        }

    },
    {

        method: 'GET',
        path: '/api/user/getUserDetail/{userId}',
        handler: handlers_user.getDetails,
        config: {
            description: 'Get all details of Specific User',
            notes: 'Returns specific User with all detail',
            tags: ['api', 'user', 'mobile'], // ADD THIS TAG
            // auth : 'token',
            //auth :  {strategy   :   'token', mode : 'optional',scope : [scopes.CONSUMER, scopes.ADMIN]},
            //auth :  {strategy   :   'token', mode : 'required',scope : [scopes.CONSUMER, scopes.ADMIN, scopes.teacher]},

            validate: {
                params: {
                    userId: Joi.string().alphanum().min(1).max(32).required(),
                }
            },
        }

    },

    {
        method: 'POST',
        path: '/api/user/exists',
        handler: handlers_user.checkUniqueness,
        config: {
            //auth : 'false',
            description: 'Checks weather username/email is already taken or not.',
            notes: 'Checks if an existing User with supplied Username or Email exists or not.\n' +
                '\n At least one of the field from \'username\' and \'email\' is required. Both can also be supplied.\n' +
                '\nThis API will be in-particular useful at the time of Sign Up on Mobile End so as to check the UserName and Email Address provided\n' +
                '\nby user are available and not get duplicated.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                payload: Joi.object().keys({ //{
                        username: Joi.string().alphanum().min(5).max(30),
                        email: Joi.string().email(),
                        //mobile          :   Joi.string().allow(['+','-']).required()
                    }).or('username', 'email')
                    // }

            }
        }
    },

    {
        method: 'POST',
        path: '/api/user/register',
        handler: handlers_user.addNew,
        config: {
            //auth : 'false',
            description: 'Create new User - Sign Up API for Email + Pwd + role = user',
            notes: 'Returns New user created Or an Error Object.\n' +
                '\nNOTE : In case of error check fields -- \'success\' and \'error\'.\n' +
                '\nError object has a special field called \'message_readable\' which can be used to show alert or error to user directly.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: //Joi.object().keys(
                {

                    username: Joi.string().required(),
                    email: Joi.string().required(),
                    password: Joi.string(),
                    mobile: Joi.string().allow(['+', '-']).required(),
                    isFBUser: Joi.string().required(),
                    role: Joi.string().required(),
                    deviceToken: Joi.string().optional(),
                    deviceType: Joi.string().optional()
                }

            }
        }
    },
    {
        method: 'POST',
        path: '/api/mosqueAndbusiness/register',
        handler: handlers_user.addNew,
        config: {
            //auth : 'false',
            description: 'Create new User - Sign Up API for Email + role = mosque or business',
            notes: 'Returns New user created Or an Error Object.\n' +
                '\nNOTE : In case of error check fields -- \'success\' and \'error\'.\n' +
                '\nError object has a special field called \'message_readable\' which can be used to show alert or error to user directly.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: //Joi.object().keys(
                {
                    username: Joi.string().required(),
                    nameContactPerson: Joi.string(),
                    mobile: Joi.string().allow(['+', '-']).required(),
                    isFBUser: Joi.string().required(),
                    //businessType: Joi.string().optional(),
                    role: Joi.string().required(),
                    email: Joi.string().required(),
                    street_address: Joi.string(),
                    country: Joi.string(),
                    //category: Joi.string(),
                    state: Joi.string(),
                    city: Joi.string(),
                    zipCode: Joi.string(),
                    lat: Joi.number(),
                    lng: Joi.number(),
                    deviceToken: Joi.string().optional(),
                    deviceType: Joi.string().optional()
                }

            }
        }
    },

    {
        method: 'POST',
        path: '/api/user/login',
        handler: handlers_user.signIn,
        config: {
            description: 'User Login Authentication API',
            notes: 'Returns access token for successfull login attempt.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: {

                    // email: Joi.string().email().optional(),//.required(),
                    email: Joi.string().required(),
                    password: Joi.string().required(),
                    deviceToken: Joi.string().optional(),
                    deviceType: Joi.string().optional()
                        //deviceToken: Joi.string().alphanum().max(100).allow("").optional(),//.required()

                }

            }
        }
    },
    {
        method: 'POST',
        path: '/api/user/loginfb',
        handler: handlers_user.signInViaFb,
        config: {
            description: 'User Login Authentication API Provider facebook',
            notes: 'Returns access token for successfull login attempt.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: {
                    email: Joi.string().email().optional(), //.required(),
                    accesstoken: Joi.string().required(),
                    provider: Joi.string().max(11).required(),
                    deviceToken: Joi.string().required(),
                    deviceType: Joi.string().required()
                }

            }
        }
    },
    {
        method: 'POST',
        path: '/api/user/logingoogle',
        handler: handlers_user.signInViaGoogle,
        config: {
            description: 'User Login Authentication API Provider google',
            notes: 'Returns access token for successfull login attempt.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: {
                    email: Joi.string().email().optional(), //.required(),
                    accesstoken: Joi.string().required(),
                    provider: Joi.string().max(11).required(),
                    deviceToken: Joi.string().required(),
                    deviceType: Joi.string().required()
                }

            }
        }
    },
    {
        method: 'POST',
        path: '/api/user/password/forgot',
        handler: handlers_user.changePassword,
        config: {
            description: 'User forgot password API',
            notes: 'Returns randomly generated new password in Email.',
            tags: ['api', 'mobile', 'user'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    action: Joi.string().allow('forgot_password').optional(),
                    email: Joi.string().email().required(),
                    locale: Joi.string().max(2).allow([appConfig._LOCALE.ENGLISH, appConfig._LOCALE.SPANISH]).optional(),
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/user/password/reset',
        handler: handlers_user.changePassword,
        config: {
            description: 'User reset password API',
            notes: 'Modifies previous User password with newly provided one.',
            tags: ['api', 'mobile', 'user'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    action: Joi.string().allow('reset_password').optional(),
                    old_password: Joi.string().required(),
                    new_password: Joi.string().required(),
                    email: Joi.string().email().required(),
                    locale: Joi.string().max(2).allow([appConfig._LOCALE.ENGLISH, appConfig._LOCALE.SPANISH]).optional(),
                })

            }
        }
    },

    {
        method: 'POST',
        path: '/api/user/add/photo',
        handler: handlers_user.modifyProfilePic,
        config: {
            auth: 'token',
            description: 'Upload new User Photo',
            notes: 'Returns New user photo URL created',
            tags: ['api', 'mobile'], // ADD THIS TAG,
            //auth : 'false',
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
                timeout: 110000 //12000
            },
            validate: {
                //failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: { //Joi.object({
                    //age: Joi.number(),
                    //id: Joi.number(),
                    //name: Joi.string(),
                    //height: Joi.number(),
                    image: Joi.any().meta({ swaggerType: 'file' })
                        .description('Activity Image File')
                }
                // })
            }
        }
    },

    {
        method: 'POST',
        path: '/api/user/modify',
        handler: handlers_user.modify,
        config: {
            auth: 'token',
            description: 'Modifies users data',
            notes: 'Returns modified user data or error.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                // failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({

                    username: Joi.string().required(),
                    nameContactPerson: Joi.string().required(),
                    description_service: Joi.string(),
                    //mobile: Joi.string().allow(['+', '-']).required(),
                    mobile: Joi.string().required(),
                    email: Joi.string().required(),
                    street_address: Joi.string().required(),
                    country: Joi.string().required(),
                    state: Joi.string().required(),
                    city: Joi.string().required(),
                    zipCode: Joi.string().required(),
                    //lat: Joi.string(),
                    //lng: Joi.string(),
                })

            }
        }
    },

    {
        method: 'GET',
        path: '/api/user/logout',
        handler: handlers_user.signOut,
        config: {
            auth: 'token',
            description: 'Signs Out currently logged in user.',
            notes: 'Returns success  =  true | false.',
            tags: ['api', 'mobile'], // ADD THIS TAG
        }
    },

    {
        method: 'GET',
        path: '/api/user/foodchoices/{data_id}',
        handler: handlers_user.getMyFoodPreference,
        config: {
            auth: { strategy: 'token', scope: ['user'] },
            description: 'Retrieves user\'s food choices selected.',
            notes: 'Returns success  =  true | false.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                params: Joi.object().keys({
                    data_id: Joi.string().alphanum().min(10).max(32).required()
                })
            }
        }
    },


    {
        method: 'POST',
        path: '/api/tables',
        handler: handlers_user.addNewTable,
        config: {
            //auth : 'false',
            description: 'Create new Restaurant Table ',
            notes: 'Returns New table created Or an Error Object. Gives URL for newly created Table QR code\n' +
                '\nNOTE : In case of error check fields -- \'success\' and \'error\'.\n' +
                '\nError object has a special field called \'message_readable\' which can be used to show alert or error to user directly.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: //Joi.object().keys(
                {
                    tableName: Joi.string().min(5).max(30).required().allow('#'),
                    marketID: Joi.string().max(32).required(),
                    marketName: Joi.string().max(100).required(),
                    //password        :    Joi.string().regex(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=[^\t\r\n\s\f\v]).([a-zA-Z0-9_@]){8,26})$/).required(),

                }

            }
        }
    },

    {
        method: 'GET',
        path: '/api/user/getCountries',
        handler: handlers_user.getCountries,
        config: {
            //  auth :  {strategy   :   'token', scope : ['user' ]} ,
            description: 'Retrieves countries selected.',
            notes: 'Returns success  =  true | false.',
            tags: ['api', 'mobile'], // ADD THIS TAG
        }
    },

    {
        method: 'GET',
        path: '/api/user/getStates/{country_id}',
        handler: handlers_user.getStatesByCountry_id,
        config: {
            //  auth :  {strategy   :   'token', scope : ['user' ]} ,
            description: 'Retrieves countries selected.',
            notes: 'Returns success  =  true | false.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                params: Joi.object().keys({
                    country_id: Joi.string().alphanum().min(1).max(32).required()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/user/getCities/{state_id}',
        handler: handlers_user.getCitiesByState_id,
        config: {
            //  auth :  {strategy   :   'token', scope : ['user' ]} ,
            description: 'Retrieves countries selected.',
            notes: 'Returns success  =  true | false.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                params: Joi.object().keys({
                    state_id: Joi.string().alphanum().min(1).max(32).required()
                })
            }
        }
    },

    {
        method: 'GET',
        path: '/api/user/sendSmsById/{userId}',
        handler: handlers_user.sendSmsPhone,
        config: {
            //  auth :  {strategy   :   'token', scope : ['user' ]} ,
            description: 'Retrieves countries selected.',
            notes: 'Returns success  =  true | false.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                params: Joi.object().keys({
                    userId: Joi.string().alphanum().min(1).max(32).required()
                })
            }
        }
    },

    {
        method: 'GET',
        path: '/api/user/sendSmsOtpCheck/{Otp}',
        handler: handlers_user.checkSmsPhoneOtp,
        config: {
            //  auth :  {strategy   :   'token', scope : ['user' ]} ,
            description: 'Retrieves countries selected.',
            notes: 'Returns success  =  true | false.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                params: {
                    Otp: Joi.number().required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/user/active',
        handler: handlers_user.mosqueAndBusinessActive,
        config: {
            description: 'User active API',
            notes: 'Returns randomly generated new password in Email.',
            tags: ['api', 'mobile', 'user'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    _id: Joi.string().required(),
                    status: Joi.string().required(),

                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/mosque/firstSelected/statusChange',
        handler: handlers_user.mosqueIsSelected,
        config: {
            description: 'User active API',
            notes: 'Returns randomly generated new password in Email.',
            tags: ['api', 'mobile', 'user'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    user_id: Joi.string().required(),
                    isSelect: Joi.string().required(),
                    mosque_id: Joi.string().required(),

                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/business/getAllCategory',
        handler: handlers_user.getAllCategory,
        config: {
            // auth:   'token',
            description: 'gets all registered category.',
            notes: 'Returns all category',
            tags: ['api', 'sa'], // ADD THIS TAG
        }
    },

    {

        method: 'GET',
        path: '/api/mosque/nearby/{latitude}/{longitude}/{radius}',
        handler: handlers_user.searchNearBy,
        config: {
            description: 'Get All Near By Merchants within range',
            notes: 'Returns All Merchants within specified geo-range. Sorted in nearest to farthest manner.',
            tags: ['api', 'mobile'], // ADD THIS TAG
            validate: {
                params: {
                    latitude: Joi.number().min(-90.0000).max(90.0000).precision(4).required(),
                    longitude: Joi.number().min(-180.0000).max(180.0000).precision(4).required(),
                    radius: Joi.number().min(1).max(99999).integer().positive().required()
                        .description("Radius in Meters")

                }
            }
        }

    },
    {
        method: 'POST',
        path: '/api/mosque/searchMosque',
        handler: handlers_user.searchMosque,
        config: {
            description: 'User active API',
            notes: 'Returns randomly generated new password in Email.',
            tags: ['api', 'mobile', 'user'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    searchmosque: Joi.string().required(),

                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/business/searchBusiness',
        handler: handlers_user.searchBusiness,
        config: {
            description: 'Search business list by business name and zipcode',
            notes: 'Returns randomly generated new list.',
            tags: ['api', 'mobile', 'user'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    searchbusiness: Joi.string().required(),

                })
            }
        }
    },
    {
        method: 'POST',
        path: '/api/business/getByCategoryBusinessList',
        handler: handlers_user.getByCategoryBusinessList,
        config: {
            description: 'Get businessTye Organization and Business list API',
            notes: 'Returns randomly generated new business by category id list.',
            tags: ['api', 'mobile', 'user'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    category_id: Joi.string().required(),
                    businessType: Joi.string().required(),

                })
            }
        }
    },

    /*   {
           method:'POST',
           path:'/api/user/emailVerify',
           handler:handlers_user.emailVerify,
           config: {
               description: 'User active API',
               notes: 'Returns randomly generated new password in Email.',
               tags: ['api','mobile', 'user'], // ADD THIS TAG
               validate: {
                   failAction  :   relish.failAction, // For customized and readable JOI Error Message
                   payload: Joi.object().keys({
                       email           :   Joi.string().required(),
                       tokenCode           :   Joi.string().required()

                   })
               }
           }
       },*/

];


//  Routes and handlers




exports.register = function(server, options, next) {

    const db = server.app.db;

    //PLACEHOLDER
    //--------------------------------------------------------------
    //Here the routes definitions will be inserted in the next steps...

    return next();
};

exports.register.attributes = {

    name: 'routes-users',
    routes: arrRoutes
};