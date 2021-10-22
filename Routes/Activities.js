/**
 * Created by rv2016 on 08/06/17.
 */
/**
 * Created by rv2016 on 05/06/17.
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
const Prayer = require('../Models/prayer').PrayerModel;
const appConfig = require('../ENV').prefs;
const baseValidationSchemas = require('./Responses/index').commonSchemas;




const handlers_activity = require('../Handlers/Activities').funcs_activity;
const handlers_cd = require('../Handlers/CommonData').funcs_cd;

//const home  = require('../Web/home.html');



var arrRoutes = [

    {
        method: 'GET',
        path: '/api/mosque/Activities/getAll/{mosque_id}',
        handler: handlers_activity.getActivitiesByMosqueId,
        config: {
            //auth:   'token',
            description: 'Mosque get all Activities by mosque id.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                params: Joi.object().keys({
                    mosque_id: Joi.string()
                })
            }
        }
    },

    {
        method: 'POST',
        path: '/api/web/Activities/getAll/{mosque_id}',
        handler: handlers_activity.getActivitiesByMosqueIdWeb,
        config: {
            auth: 'token',
            description: 'Mosque get all Activities by mosque id.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                payload: Joi.object().keys({
                    count: Joi.number(),
                    page: Joi.number()
                }).optional(),
                params: Joi.object().keys({
                    mosque_id: Joi.string()
                })
            }
        }
    },

    {
        method: 'GET',
        path: '/api/mosque/Activities/get/{_id}',
        handler: handlers_activity.getActivities,
        config: {
            //auth:   'token',
            description: 'Mosque get Activities.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                params: Joi.object().keys({
                    _id: Joi.string()
                })
            }
        }
    },

    {
        method: 'POST',
        path: '/api/mosque/Activities/add',
        handler: handlers_activity.addActivities,
        config: {
            //auth:   'token',
            description: 'Mosque add Activities.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
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
                payload: Joi.object().keys({
                    startDate: Joi.string(),
                    startTime: Joi.string(),
                    title: Joi.string(),
                    phone: Joi.string(),
                    textarea: Joi.string(),
                    mosque_id: Joi.string(),
                    image: Joi.any().meta({ swaggerType: 'file' }).description('Activity Image File')

                }).optional()
            }
        }
    },

    {
        method: 'POST',
        path: '/api/mosque/Activities/modify/{_id}',
        handler: handlers_activity.modifyActivities,
        config: {
            //auth:   'token',
            description: 'Mosque modify Activities.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                payload: Joi.object().keys({
                    startDate: Joi.string(),
                    startTime: Joi.string(),
                    title: Joi.string(),
                    phone: Joi.string(),
                    textarea: Joi.string()
                }),
                params: Joi.object().keys({
                    _id: Joi.string()
                })
            }
        }
    },

    {
        method: 'POST',
        path: '/api/mosque/Activities/updatePhoto/{_id}',
        handler: handlers_activity.updatePhoto,
        config: {
            //auth:   'token',
            description: 'Mosque add activities update photo.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
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
                payload: Joi.object().keys({
                    image: Joi.any().meta({ swaggerType: 'file' })
                        .description('board Image File')

                }).optional(),
                params: Joi.object().keys({
                    _id: Joi.string()
                })
            }
        }
    },

    {
        method: 'DELETE',
        path: '/api/mosque/Activities/delete/{_id}',
        handler: handlers_activity.deleteActivities,
        config: {
            //auth:   'token',
            description: 'Mosque delete Activities.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                params: Joi.object().keys({
                    _id: Joi.string()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/todaysFeed/getAll',
        handler: handlers_activity.getTodayFeed,
        config: {
            //auth:   'token',
            description: 'Mosque get all Activities by mosque id.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            /*validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   mosque_id    :  Joi.string()
                })
            }*/
        }
    },
    {
        method: 'POST',
        path: '/api/todaysFeed/LikeActivity/add',
        handler: handlers_activity.addLikeActivity,
        config: {
            //auth:   'token',
            description: 'user add LikeActivity.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'user'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                payload: Joi.object().keys({

                    activity_id: Joi.string(),
                    user_id: Joi.string(),
                    //description        :   Joi.string(),
                }).optional()
            }
        }
    },
];


exports.register = function(server, options, next) {

    const db = server.app.db;

    //PLACEHOLDER
    //--------------------------------------------------------------
    //Here the routes definitions will be inserted in the next steps...

    return next();
};

exports.register.attributes = {

    name: 'routes-activity',
    routes: arrRoutes
};