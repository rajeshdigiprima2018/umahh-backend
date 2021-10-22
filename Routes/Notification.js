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

    stripQuotes: true,
    //messages    :{
    //    email   :   'Please provide valid email address.'
    //
    //}
});

const appConfig = require('../ENV').prefs;
const scopes = require('../ENV').prefs._SCOPES;


// Local file/Module Imports

const handlers_generic = require('../Handlers/yummzHandlers').funcs_g;

const handlers_notification = require('../Handlers/Notification').funcs_notification;

const baseResponse = require('./Responses');

var arrRoutes = [

    {
        method: 'GET',
        path: '/api/notification/getAll/{reciveUserId}',
        handler: handlers_notification.getNotiByReviceId,
        config: {
            // auth:   'token',
            description: 'Get All Notification by recive id.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                params: Joi.object().keys({
                    reciveUserId: Joi.string()
                })
            }
        }
    },
    /*    {
            method: 'POST',
            path: '/api/web/quiz/getAll',
            handler: handlers_notification.getQuizByCategryIdWeb,
            config  :   {
                //auth:   'token',
                description: 'get all Quiz.',
                notes: 'Test APi',
                tags: ['api','sa','mosque'], // ADD THIS TAG
                validate    :   {
                    failAction  :   relish.failAction,
                    payload :   Joi.object().keys({
                        count        :   Joi.number(),
                        page          :   Joi.number()
                    }).optional(),
                }
            }
        },*/
    {
        method: 'POST',
        path: '/api/web/notification/getAll/{send_id}',
        handler: handlers_notification.getNotificationByIdWeb,
        config: {
            //auth:   'token',
            description: 'Get All notification by mosque id.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                payload: Joi.object().keys({
                    count: Joi.number(),
                    page: Joi.number()
                }).optional(),
                params: Joi.object().keys({
                    send_id: Joi.string()
                })
            }
        }
    },

    {
        method: 'GET',
        path: '/api/notification/get/{_id}',
        handler: handlers_notification.getNotification,
        config: {
            //auth:   'token',
            description: 'get notification detail.',
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
        path: '/api/notification/add',
        handler: handlers_notification.addNotification,
        config: {
            //auth:   'token',
            description: 'Mosque add Quiz.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                payload: Joi.object().keys({
                    send_id: Joi.string(),
                    //recive_id     :   Joi.string(),
                    description: Joi.string()
                }).optional()
            }
        }
    },

    /*   {
           method: 'POST',
           path: '/api/quiz/modify/{_id}',
           handler: handlers_notification.modifyQuiz,
           config  :   {
               //auth:   'token',
               description: 'Quiz update.',
               notes: 'Test APi',
               tags: ['api','sa','mosque'], // ADD THIS TAG

               validate: {
                   payload :   Joi.object().keys({
                       question        :   Joi.string(),
                       option1 :   Joi.string(),
                       option2      :   Joi.string(),
                       option3 :   Joi.string(),
                       option4      :   Joi.string(),
                       answer    :   Joi.string(),
                       quiz_category_id :   Joi.string(),

                   }).optional(),
                   params  :   Joi.object().keys({
                      _id    :  Joi.string()
                   })
               }
           }
       },*/
    {
        method: 'POST',
        path: '/api/notification/sendNotification',
        handler: handlers_notification.sendNotification,
        config: {
            //auth:   'token',
            description: 'Notification delete.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction
            }
        }
    },
    {
        method: 'POST',
        path: '/api/notification/getAllMosqueLatLongAndUpdateTimeZone',
        handler: handlers_notification.getAllMosqueLatLongAndUpdateTimeZone,
        config: {
            //auth:   'token',
            description: 'Notification delete.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction
            }
        }
    },
    {
        method: 'POST',
        path: '/api/notification/sendNotificationCalender',
        handler: handlers_notification.sendNotificationCalender,
        config: {
            //auth:   'token',
            description: 'Notification delete.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction
            }
        }
    },

    {
        method: 'DELETE',
        path: '/api/notification/delete/{_id}',
        handler: handlers_notification.deleteNotification,
        config: {
            //auth:   'token',
            description: 'Notification delete.',
            notes: 'Test APi',
            tags: ['api', 'sa', 'mosque'], // ADD THIS TAG
            validate: {
                failAction: relish.failAction,
                params: Joi.object().keys({
                    _id: Joi.string()
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
    name: 'routes-notification',
    routes: arrRoutes
};