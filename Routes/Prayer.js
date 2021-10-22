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



const handlers_prayer = require('../Handlers/Prayer').funcs_s;
const handlers_cd = require('../Handlers/CommonData').funcs_cd;

//const home  = require('../Web/home.html');



var arrRoutes = [

    {
        method: 'GET',
        path: '/api/mosque/prayer/getAll/{mosque_id}',
        handler: handlers_prayer.getprayerByMosqueId,
        config: {
            //auth:   'token',
            description: 'Mosque get all prayer by mosque id.',
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
        path: '/api/web/prayer/getAll/{mosque_id}',
        handler: handlers_prayer.getprayerByMosqueIdWeb,
        config: {
            auth: 'token',
            description: 'Mosque get all prayer by mosque id.',
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
        path: '/api/mosque/prayer/get/{_id}',
        handler: handlers_prayer.getprayer,
        config: {
            //auth:   'token',
            description: 'Mosque get prayer.',
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
        path: '/api/mosque/prayer/add',
        handler: handlers_prayer.addprayer,
        config: {
            //auth:   'token',
            description: 'Mosque add prayer.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                payload: Joi.object().keys({

                    prayercategoryId: Joi.string().required(),
                    time: Joi.string().required(),
                    sort: Joi.number().required(),
                    staticTime: Joi.string().required(),
                    offset: Joi.string().required(),
                    mosque_id: Joi.string().required(),
                    timezone: Joi.string().required(),
                    checkPrayerString: Joi.string().required()

                }).optional()
            }
        }
    },

    {
        method: 'POST',
        path: '/api/mosque/prayer/modify/{_id}',
        handler: handlers_prayer.modifyprayer,
        config: {
            //auth:   'token',
            description: 'Mosque modify prayer.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                payload: Joi.object().keys({
                    prayercategoryId: Joi.string().required(),
                    time: Joi.string().required(),
                    sort: Joi.number().required(),
                    staticTime: Joi.string().required(),
                    offset: Joi.string().required(),
                    timezone: Joi.string().required(),
                    checkPrayerString: Joi.string().required()
                }),
                params: Joi.object().keys({
                    _id: Joi.string()
                })
            }
        }
    },

    {
        method: 'DELETE',
        path: '/api/mosque/prayer/delete/{_id}',
        handler: handlers_prayer.deleteprayer,
        config: {
            //auth:   'token',
            description: 'Mosque delete prayer.',
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
];


exports.register = function(server, options, next) {

    const db = server.app.db;

    //PLACEHOLDER
    //--------------------------------------------------------------
    //Here the routes definitions will be inserted in the next steps...

    return next();
};

exports.register.attributes = {

    name: 'routes-prayer',
    routes: arrRoutes
};