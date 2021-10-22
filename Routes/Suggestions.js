/**
 * Created by rv2016 on 28/10/16.
 */


'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const jwt = require('hapi-auth-jwt2');
const relish = require('relish')({

    stripQuotes:true,
    messages    :{
        email   :   'Please provide valid email address.'

    }
});


//  Local Files and Modules Import

var merchantModel  = require('../Models/merchant').MerchantModel;

let handler_Merchant = require('../Handlers/Merchant/merchant').funcs_m;
let handler_User = require('../Handlers/User').funcs_u;
let handler_Generic = require('../Handlers/yummzHandlers');
let handler_Suggestions    =   require('../Handlers/Suggestions').funcs_suggestion;

let baseResponses   =   require('./Responses');
let commonValidations   =   baseResponses.commonSchemas;
let responseByCodes =   baseResponses.menuitems;//require('./Responses').menuitems;   // Responses by HTTP Status Codes for all routes in this file

//  props

//  Routes and handlers
var arrRoutes= [

    {
        method: 'POST',
        path: '/api/mosque/Suggestions/getAll/{mosque_id}',
        handler: handler_Suggestions.getSuggestionsByMosqueId,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all Suggestions by mosque id.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    count        :   Joi.number(),
                    page          :   Joi.number()
                    }).optional(),
                params  :   Joi.object().keys({
                   mosque_id    :  Joi.string()
                })
            }
        }
    },

    {
        method: 'POST',
        path: '/api/web/Suggestions/getAll/{mosque_id}',
        handler: handler_Suggestions.getSuggestionsByMosqueIdWeb,
        config  :   {
            auth:   'token',
            description: 'Mosque get all Suggestions by mosque id.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    count        :   Joi.number(),
                    page          :   Joi.number()
                    }).optional(),
                params  :   Joi.object().keys({
                   mosque_id    :  Joi.string()
                })
            }
        }
    },

    {
        method: 'GET',
        path: '/api/mosque/Suggestions/get/{_id}',
        handler: handler_Suggestions.getSuggestions,
        config  :   {
            //auth:   'token',
            description: 'Mosque get Suggestions.',
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

    {
        method: 'POST',
        path: '/api/mosque/Suggestions/add',
        handler: handler_Suggestions.addSuggestions,
        config  :   {
            //auth:   'token',
            description: 'Mosque add Suggestions.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({



                    user_id        :   Joi.string(),
                    mosque_id          :   Joi.string(),
                    text_suggestion        :   Joi.string(),
                    }).optional()
            }
        }
    },

/*    {
        method: 'POST',
        path: '/api/mosque/Suggestions/modify/{_id}',
        handler: handler_Suggestions.modifySuggestions,
        config  :   {
            //auth:   'token',
            description: 'Mosque modify Suggestions.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    startDate        :   Joi.string(),
                    endDate          :   Joi.string(),
                    startTime        :   Joi.string(),
                    endTime          :   Joi.string(),
                    course_objective :   Joi.string(),
                    methodology      :   Joi.string(),
                    duration         :   Joi.string(),
                    registration_fee :   Joi.string(),
                    pre_requisites   :   Joi.string(),
                    about_instructor :   Joi.string(),
                }),
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
                })
            }
        }
    },*/

   {
        method: 'DELETE',
        path: '/api/mosque/Suggestions/delete/{_id}',
        handler: handler_Suggestions.deleteSuggestions,
        config  :   {
            //auth:   'token',
            description: 'Mosque delete Suggestions.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
                })
            }
        }
    }
];





exports.register = function(server, options, next) {

    const db = server.app.db;

    return next();
};

exports.register.attributes = {
    name: 'routes-menuitems',
    routes: arrRoutes
};
