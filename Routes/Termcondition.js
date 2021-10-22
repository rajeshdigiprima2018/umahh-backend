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

const   handlers_termc = require('../Handlers/Termcondition').funcs_termc;

const   baseResponse  =   require('./Responses');

var arrRoutes = [

    {
        method: 'GET',
        path: '/api/termcondition/getAll',
        handler: handlers_termc.getTermByAdmin,
        config  :   {
            //auth:   'token',
            description: 'Get All Termcondition by admin.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            /*validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   reciveUserId    :  Joi.string()
                })
            }*/
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
        path: '/api/web/termcondition/getAll',
        handler: handlers_termc.getTermconditionByIdWeb,
        config  :   {
            //auth:   'token',
            description: 'Get All termcondition by admin.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    count        :   Joi.number(),
                    page          :   Joi.number()
                }).optional()
            }    
        }
    },
    {
        method: 'GET',
        path: '/api/termcondition/get/{_id}',
        handler: handlers_termc.getTermcondition,
        config  :   {
            //auth:   'token',
            description: 'get tern and conditon detail.',
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
        path: '/api/termcondition/add',
        handler: handlers_termc.addTermcondition,
        config  :   {
            auth:   'token',
            description: 'Admin add tern and conditon.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate: {
                payload :   Joi.object().keys({
                    description   :   Joi.string()
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
        method: 'DELETE',
        path: '/api/termcondition/delete/{_id}',
        handler: handlers_termc.deleteNotification,
        config  :   {
            //auth:   'token',
            description: 'Notification delete.',
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
    name: 'routes-termcondition',
    routes  :   arrRoutes
};
