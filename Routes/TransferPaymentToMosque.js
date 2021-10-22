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
//const  Prayername  = require('../Models/Prayername').PrayerNameModel;
const appConfig =   require('../ENV').prefs;



const transfer_tomosque = require('../Handlers/TransferPaymentToMosque').funcs_transfer;
const handlers_cd = require('../Handlers/CommonData').funcs_cd;

//const home  = require('../Web/home.html');



var arrRoutes = [

    {
        method: 'GET',
        path: '/api/web/transferpaymenttomosque/getAll',
        handler: transfer_tomosque.getprayerByMosqueId,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all prayer name by admin id.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
/*            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                   mosque_id    :  Joi.string()
                })
            }*/
        }
    },
    {
        method: 'POST',
        path: '/api/web/getTrasactionByMosqueIdWeb/getAll',
        handler: transfer_tomosque.getTrasactionByMosqueIdWeb,
        config  :   {
            auth:   'token',
            description: 'Get all transfer data by mosque',
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
        path: '/api/web/transferpaymenttomosque/get/{_id}',
        handler: transfer_tomosque.getprayername,
        config  :   {
            //auth:   'token',
            description: 'Admin get prayer name.',
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
        path: '/api/web/transferpaymenttomosque/add',
        handler: transfer_tomosque.addPaymentAdminToMosque,
        config  :   {
            auth:   'token',
            description: 'Admin transfer payment to mosque.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({
                    mosqueId    :   Joi.string().required(),
                    amount      :   Joi.number().required(),
                    textId      :   Joi.string().required(),
                })
            }
        }
    },

    {
        method: 'POST',
        path: '/api/web/transferpaymenttomosque/modify/{_id}',
        handler: transfer_tomosque.modifyprayer,
        config  :   {
            //auth:   'token',
            description: 'Admin modify prayer name.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                payload :   Joi.object().keys({

                    name       :   Joi.string().min(3).max(25).required(),
                    arabic_name:   Joi.string().min(3).max(25).required()

                    }).optional(),
                params  :   Joi.object().keys({
                   _id    :  Joi.string()
                })
            }
        }
    },

   {
        method: 'DELETE',
        path: '/api/web/transferpaymenttomosque/delete/{_id}',
        handler: transfer_tomosque.deleteprayer,
        config  :   {
            //auth:   'token',
            description: 'Admin delete prayer name.',
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

    //PLACEHOLDER
    //--------------------------------------------------------------
    //Here the routes definitions will be inserted in the next steps...

    return next();
};

exports.register.attributes = {

    name    :   'routes-transfer-to-mosque',
    routes  :   arrRoutes
};