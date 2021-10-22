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

const   handlers_ed = require('../Handlers/Education').funcs_ed;
const   handlers_mail = require('../Handlers/Mailer').funcs_mail;
const   handlers_sms = require('../Handlers/SMS').funcs_sms;

//const   baseResponse  =   require('./Responses');

var arrRoutes = [

    {
        method: 'GET',
        path: '/api/mosque/education/getAll/{mosque_id}',
        handler: handlers_ed.getEducationByMosqueId,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all education by mosque id.',
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
        path: '/api/web/education/getAll/{mosque_id}',
        handler: handlers_ed.getEducationByMosqueIdWeb,
        config  :   {
            auth:   'token',
            description: 'Mosque get all education by mosque id.',
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
        path: '/api/mosque/education/get/{_id}',
        handler: handlers_ed.getEducation,
        config  :   {
            //auth:   'token',
            description: 'Mosque get education.',
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
        path: '/api/mosque/education/add',
        handler: handlers_ed.addEducation,
        config  :   {
            //auth:   'token',
            description: 'Mosque add education.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                //failAction  :   relish.failAction,
                payload :   Joi.object().keys({

                    title        :   Joi.string(),
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
                    address          :    Joi.string(),
                    mobile          :    Joi.string(),
                    mosque_id :   Joi.string(),

                    }).optional()
            }
        }
    },

    {
        method: 'POST',
        path: '/api/mosque/education/modify/{_id}',
        handler: handlers_ed.modifyEducation,
        config  :   {
            //auth:   'token',
            description: 'Mosque modify education.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
               // failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    title            :  Joi.string(),
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
                    mobile          :    Joi.string(),
                    address          :   Joi.string(),
                }),
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
                })
            }
        }
    },

   {
        method: 'DELETE',
        path: '/api/mosque/education/delete/{_id}',
        handler: handlers_ed.deleteEducation,
        config  :   {
            //auth:   'token',
            description: 'Mosque delete education.',
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
    name: 'routes-education',
    routes  :   arrRoutes
};
