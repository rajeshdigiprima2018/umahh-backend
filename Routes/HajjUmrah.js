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

    stripQuotes:true,
    //messages    :{
    //    email   :   'Please provide valid email address.'
    //
    //}
});


// Local file/Module Imports
const  Prayer  = require('../Models/prayer').PrayerModel;
const appConfig =   require('../ENV').prefs;
const baseValidationSchemas = require('./Responses/index').commonSchemas;




const handlers_hu = require('../Handlers/HajjUmrah').funcs_hu;
const handlers_cd = require('../Handlers/CommonData').funcs_cd;

//const home  = require('../Web/home.html');



var arrRoutes = [
    
   {
        method: 'GET',
        path: '/api/hajjumrah/getAll',
        handler: handlers_hu.getAll,
        config  :   {
            //auth:   'token',
            description: 'admin get all hajj and umrah category.',
            notes: 'Test APi',
            tags: ['api','sa','admin'], // ADD THIS TAG
        }
    },

   {
        method: 'POST',
        path: '/api/web/hajjumrah/getAll',
        handler: handlers_hu.getAllWeb,
        config  :   {
            //auth:   'token',
            description: 'admin get all hajj and umrah category.',
            notes: 'Test APi',
            tags: ['api','sa','admin'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    count        :   Joi.number(),
                    page          :   Joi.number()
                }).optional(),
               /* params  :   Joi.object().keys({
                   mosque_id    :  Joi.string()
                })*/
            }
        }
    },

    {
        method: 'GET',
        path: '/api/hajjumrah/getAllCategoryUmrah',
        handler: handlers_hu.getAllCategoryUmrah,
        config  :   {
            //auth:   'token',
            description: 'admin get all hajj and umrah category.',
            notes: 'Test APi',
            tags: ['api','sa','admin'], // ADD THIS TAG
        }
    }, 

    {
        method:'POST',
        path:'/api/hajjumrah/getByhajUmCategory',
        handler:handlers_hu.getByhajUmCategory,
        config: {
            description: 'Get hajj list by hajj amd umrah category id API',
            notes: 'Returns randomly generated hajj list by hajj amd umrah category id API.',
            tags: ['api','mobile', 'user'], // ADD THIS TAG
            validate: {
                failAction  :   relish.failAction, // For customized and readable JOI Error Message
                payload: Joi.object().keys({
                    hajjumrahCategory_id  :   Joi.string().required(),
                    
                })
            }
        }
    },

    {
        method: 'GET',
        path: '/api/hajjumrah/get/{_id}',
        handler: handlers_hu.gethajjumrahById,
        config  :   {
            //auth:   'token',
            description: 'get hajj and umrah details by _id.',
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

/*    {
        method: 'GET',
        path: '/api/mosque/Activities/getAll/{mosque_id}',
        handler: handlers_activity.getActivitiesByMosqueId,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all Activities by mosque id.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   mosque_id    :  Joi.string()
                })
            }
        }
    },

    {
        method: 'GET',
        path: '/api/mosque/Activities/get/{_id}',
        handler: handlers_activity.getActivities,
        config  :   {
            //auth:   'token',
            description: 'Mosque get Activities.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
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
        path: '/api/hajjumrah/category/add',
        handler: handlers_hu.addCategory,
        config  :   {
            //auth:   'token',
            description: 'admin add hajj and umrah category.',
            notes: 'admin add hajj and umrah category APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
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
        path: '/api/hajjumrah/add',
        handler: handlers_hu.addHajjUmrah,
        config  :   {
            //auth:   'token',
            description: 'admin add hajj and umrah.',
            notes: 'Hajj and umrah APi',
            tags: ['api','sa','admin'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({

                    hajjumrahCategory_id        :   Joi.string(),
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
        path: '/api/hajjumrah/modifyHajjAndUmrah/{_id}',
        handler: handlers_hu.modifyHajjAndUmrah,
        config  :   {
            //auth:   'token',
            description: 'Mosque modify hajj and umrah.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({

                    hajjumrahCategory_id        :   Joi.string(),
                    title          :   Joi.string(),
                    description        :   Joi.string(),
                    title_aro          :   Joi.string(),
                    description_aro :   Joi.string(),
                    }).optional(),
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
                })
            }
        }
    },

   {
        method: 'DELETE',
        path: '/api/hajjumrah/delete/{_id}',
        handler: handlers_hu.deleteHajjUmrah,
        config  :   {
            //auth:   'token',
            description: 'Admin delete hajj and umrah.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
                })
            }
        }
    },
   /* {
        method: 'GET',
        path: '/api/todaysFeed/getAll',
        handler: handlers_activity.getTodayFeed,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all Activities by mosque id.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   mosque_id    :  Joi.string()
                })
            }
        }
    },*/
];


exports.register = function(server, options, next) {

    const db = server.app.db;

    //PLACEHOLDER
    //--------------------------------------------------------------
    //Here the routes definitions will be inserted in the next steps...

    return next();
};

exports.register.attributes = {

    name    :   'routes-hajjumrah',
    routes  :   arrRoutes
};