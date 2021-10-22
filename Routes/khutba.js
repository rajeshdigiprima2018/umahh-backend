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

    stripQuotes:true,
    //messages    :{
    //    email   :   'Please provide valid email address.'
    //
    //}
});


// Local file/Module Imports

//const   FoodChoices  = require('../Models/commondata').foodChoicesModel;

const   handlers_khutba = require('../Handlers/Khutba').funcs_khutba;
const   handlers_mail = require('../Handlers/Mailer').funcs_mail;
const   handlers_sms = require('../Handlers/SMS').funcs_sms;

//const   baseResponse  =   require('./Responses');

var arrRoutes = [

    {
        method: 'GET',
        path: '/api/mosque/khutba/getAll/{mosque_id}',
        handler: handlers_khutba.getkhutbaByMosqueId,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all khutba by mosque id.',
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
        method: 'POST',
        path: '/api/web/khutba/getAll/{mosque_id}',
        handler: handlers_khutba.getkhutbaByMosqueIdWeb,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all khutba by mosque id.',
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
        path: '/api/mosque/khutba/get/{_id}',
        handler: handlers_khutba.getkhutba,
        config  :   {
            //auth:   'token',
            description: 'Mosque get khutba.',
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
        path: '/api/mosque/khutba/add',
        handler: handlers_khutba.addkhutba,
        config  :   {
            auth:   'token',
            description: 'Mosque add khutba.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({

                    startDate        :   Joi.string(),
                    startTime        :   Joi.string(),
                    title            :   Joi.string(),
                    speaker_name      :   Joi.string(),
                    }).optional()
            }
        }
    },

    {
        method: 'POST',
        path: '/api/mosque/khutba/modify/{_id}',
        handler: handlers_khutba.modifykhutba,
        config  :   {
            //auth:   'token',
            description: 'Mosque modify khutba.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    startDate        :   Joi.string(),
                    startTime        :   Joi.string(),
                    title            :   Joi.string(),
                    speaker_name     :   Joi.string(),
                }),
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
                })
            }
        }
    },

   {
        method: 'DELETE',
        path: '/api/mosque/khutba/delete/{_id}',
        handler: handlers_khutba.deletekhutba,
        config  :   {
            //auth:   'token',
            description: 'Mosque delete khutba.',
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
];

exports.register = function(server, options, next) {

    const db = server.app.db;

    return next();
};

exports.register.attributes = {
    name: 'routes-khutba',
    routes  :   arrRoutes
};
