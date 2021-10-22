/**
 * Created by rv2016 on 22/02/17.
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

const appConfig =   require('../ENV').prefs;
const scopes    =   require('../ENV').prefs._SCOPES;


// Local file/Module Imports

const   handlers_generic = require('../Handlers/yummzHandlers').funcs_g;

const   handlers_Calendar = require('../Handlers/Calendar').funcs_Calendar;

const   baseResponse  =   require('./Responses');

var arrRoutes = [

    {
        method: 'GET',
        path: '/api/mosque/Calendar/getAll/{mosque_id}',
        handler: handlers_Calendar.getCalendarByMosqueId,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all Calendar by mosque id.',
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
        path: '/api/web/Calendar/getAll/{mosque_id}',
        handler: handlers_Calendar.getCalendarByMosqueIdWeb,
        config  :   {
            auth:   'token',
            description: 'Mosque get all Calendar by mosque id.',
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
        path: '/api/mosque/Calendar/get/{_id}',
        handler: handlers_Calendar.getCalendar,
        config  :   {
            //auth:   'token',
            description: 'Mosque get Calendar.',
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
        path: '/api/mosque/Calendar/add',
        handler: handlers_Calendar.addCalendar,
        config  :   {
            //auth:   'token',
            description: 'Mosque add Calendar.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate: {
                payload :   Joi.object().keys({
                    calendarDate        :   Joi.string(),
                    title :   Joi.string(),
                    calendarTime      :   Joi.string(),
                    mosque_id :   Joi.string(),
              
                    }).optional()
            }
        }
    },

    {
        method: 'POST',
        path: '/api/mosque/Calendar/modify/{_id}',
        handler: handlers_Calendar.modifyCalendar,
        config  :   {
            //auth:   'token',
            description: 'Mosque modify Calendar.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    title        :   Joi.string(),
                    calendarTime :   Joi.string(),
                    calendarDate :   Joi.string(),
                }),
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
                })
            }
        }
    },

   {
        method: 'DELETE',
        path: '/api/mosque/Calendar/delete/{_id}',
        handler: handlers_Calendar.deleteCalendar,
        config  :   {
            //auth:   'token',
            description: 'Mosque delete Calendar.',
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

    //console.log(
    //    __dirname.split(Path.sep).pop());

    //console.log(__dirname.replace(__dirname.split(Path.sep).pop(), 'Media/Images/Merchants/'));

    const db = server.app.db;

    return next();
};

exports.register.attributes = {
    name: 'routes-calendar',
    routes  :   arrRoutes
};
