/**
 * Created by rv2016 on 17/02/17.
 */

'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const fs = require('fs');
const Wreck = require('wreck');
const async = require('async');
const rq = require('request');
const relish = require('relish')({

    stripQuotes: true,
    //messages    :{
    //    email   :   'Please provide valid email address.'
    //
    //}
});


// Local file/Module Imports

//const   FoodChoices  = require('../Models/commondata').foodChoicesModel;

const handlers_fw = require('../Handlers/Following').funcs_fw;
const handlers_mail = require('../Handlers/Mailer').funcs_mail;
const handlers_sms = require('../Handlers/SMS').funcs_sms;

//const   baseResponse  =   require('./Responses');

var arrRoutes = [

    /*    {
            method: 'GET',
            path: '/api/supplication/getAllCategory',
            handler: handlers_sp.getAllCategory,
            config  :   {
                //auth:   'token',
                description: 'admin get all supplication.',
                notes: 'Test APi',
                tags: ['api','sa','admin'], // ADD THIS TAG
            }
        },
        {
            method: 'POST',
            path: '/api/supplication/addCategory',
            handler: handlers_sp.addCategory,
            config  :   {
                //auth:   'token',
                description: 'admin add supplication category.',
                notes: 'Test APi',
                tags: ['api','sa','admin'], // ADD THIS TAG
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
                    timeout:    110000//12000
                },
                validate: {
                    payload :   Joi.object().keys({
                        name :   Joi.string(),
                        image: Joi.any().meta({ swaggerType: 'file'})
                            .description('Activity Image File')

                        }).optional()
                }
            }
        },
        {
            method: 'POST',
            path: '/api/supplication/modifyCategory',
            handler: handlers_sp.modifyCategory,
            config  :   {
                //auth:   'token',
                description: 'admin add supplication modify category.',
                notes: 'Test APi',
                tags: ['api','sa','admin'], // ADD THIS TAG
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
                    timeout:    110000//12000
                },
                validate: {
                    payload :   Joi.object().keys({
                        name :   Joi.string(),
                        _id :   Joi.string(),
                        image: Joi.any().meta({ swaggerType: 'file'})
                            .description('supplication Image File')

                        }).optional()
                }
            }
        },

        {
            method: 'GET',
            path: '/api/supplication/getAll',
            handler: handlers_sp.getsupplication,
            config  :   {
                //auth:   'token',
                description: 'admin get all supplication.',
                notes: 'Test APi',
                tags: ['api','sa','admin'], // ADD THIS TAG
            }
        },

       {
            method:'POST',
            path:'/api/supplication/getBySupCategory',
            handler:handlers_sp.getBySupCategory,
            config: {
                description: 'Get supplication list by sup category id API',
                notes: 'Returns randomly generated supplication list by sup category id API.',
                tags: ['api','mobile', 'user'], // ADD THIS TAG
                validate: {
                    failAction  :   relish.failAction, // For customized and readable JOI Error Message
                    payload: Joi.object().keys({
                        supCategory_id  :   Joi.string().required(),

                    })
                }
            }
        },


        {
            method: 'GET',
            path: '/api/supplication/get/{_id}',
            handler: handlers_sp.getsupplicationById,
            config  :   {
                //auth:   'token',
                description: 'get supplication details by _id.',
                notes: 'Test APi',
                tags: ['api','sa','admin'], // ADD THIS TAG
                validate    :   {
                    failAction  :   relish.failAction,
                    params  :   Joi.object().keys({
                       _id    :  Joi.string()
                    })
                }
            }
        },

        {
            method: 'POST',
            path: '/api/supplication/add',
            handler: handlers_sp.addsupplication,
            config  :   {
                //auth:   'token',
                description: 'admin add supplication.',
                notes: 'Test APi',
                tags: ['api','sa','admin'], // ADD THIS TAG
                validate    :   {
                    failAction  :   relish.failAction,
                    payload :   Joi.object().keys({

                        supCategory_id        :   Joi.string(),
                        title          :   Joi.string(),
                        description        :   Joi.string(),
                        title_aro          :   Joi.string(),
                        description_aro :   Joi.string(),
                        }).optional()
                }
            }
        },

        {
            method: 'POST',
            path: '/api/supplication/modify/{_id}',
            handler: handlers_sp.modifysupplication,
            config  :   {
                //auth:   'token',
                description: 'admin modify supplication.',
                notes: 'Test APi',
                tags: ['api','sa','admin'], // ADD THIS TAG
                validate    :   {
                    failAction  :   relish.failAction,
                    payload :   Joi.object().keys({
                        supCategory_id        :   Joi.string(),
                        title          :   Joi.string(),
                        description        :   Joi.string(),
                        title_aro          :   Joi.string(),
                        description_aro :   Joi.string(),
                    }),
                    params  :   Joi.object().keys({
                       _id    :  Joi.string()
                    })
                }
            }
        },

       {
            method: 'DELETE',
            path: '/api/supplication/delete/{_id}',
            handler: handlers_sp.deletesupplication,
            config  :   {
                //auth:   'token',
                description: 'admin delete supplication.',
                notes: 'Test APi',
                tags: ['api','sa','admin'], // ADD THIS TAG
                validate    :   {
                    failAction  :   relish.failAction,
                    params  :   Joi.object().keys({
                       _id    :  Joi.string()
                    })
                }
            }
        },*/
    {
        method: 'POST',
        path: '/api/user/addFollowing',
        handler: handlers_fw.addFollowing,
        config: {
            //auth:   'token',
            description: 'user add following mosque.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'user'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                payload: Joi.object().keys({

                    mosque_id: Joi.string(),
                    user_id: Joi.string(),
                    //description        :   Joi.string(),
                }).optional()
            }
        }
    },

    {
        method: 'POST',
        path: '/api/user/getFollowingList/{user_id}',
        handler: handlers_fw.getFollowingList,
        config: {
            //auth:   'token',
            description: 'user get Like Supplication.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'user'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                payload: Joi.object().keys({

                    // supplication_id    :   Joi.string(),
                    user_id: Joi.string(),
                    //description        :   Joi.string(),
                }).optional()
            }
        }
    },
];

exports.register = function(server, options, next) {

    const db = server.app.db;

    return next();
};

exports.register.attributes = {
    name: 'routes-following',
    routes: arrRoutes
};