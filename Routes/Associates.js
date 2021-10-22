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

const   handlers_associates = require('../Handlers/Associates').funcs_associates;

const   baseResponse  =   require('./Responses');

var arrRoutes = [

    {
        method: 'GET',
        path: '/api/mosque/Associates/getAll/{mosque_id}',
        handler: handlers_associates.getAssociatesByMosqueId,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all Associates by mosque id.',
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
        path: '/api/web/Associates/getAll/{mosque_id}',
        handler: handlers_associates.getAssociatesByMosqueIdWeb,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all Associates by mosque id.',
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

/*    {
        method: 'GET',
        path: '/api/mosque/Associates/get/{_id}',
        handler: handlers_associates.getAssociates,
        config  :   {
            //auth:   'token',
            description: 'Mosque get Associates.',
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
        path: '/api/mosque/Associates/add',
        handler: handlers_associates.addAssociates,
        config  :   {
            //auth:   'token',
            description: 'Mosque add Associates.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    mosque_id :   Joi.string(),
                    associate_user     : Joi.string(),
                }).optional()
            }
        }
    },

/*    {
        method: 'POST',
        path: '/api/mosque/Associates/modify/{_id}',
        handler: handlers_associates.modifyAssociates,
        config  :   {
            //auth:   'token',
            description: 'Mosque modify Associates.',
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
        method: 'POST',
        path: '/api/mosque/Associates/delete',
        handler: handlers_associates.deleteAssociates,
        config  :   {
            //auth:   'token',
            description: 'Mosque delete Associates.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    mosque_id :   Joi.string(),
                    associate_id     : Joi.string(),
                }).optional()
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
    name: 'routes-associates',
    routes  :   arrRoutes
};
