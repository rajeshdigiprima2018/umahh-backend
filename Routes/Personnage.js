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
const  personnage  = require('../Models/personnage').personnageModel;
const appConfig =   require('../ENV').prefs;



const handlers_personnage = require('../Handlers/Personnage').funcs_s;
const handlers_cd = require('../Handlers/CommonData').funcs_cd;

//const home  = require('../Web/home.html');



var arrRoutes = [

    {
        method: 'GET',
        path: '/api/mosque/getpersonnage',
        handler: handlers_personnage.getpersonnage,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all personnage.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
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

    name    :   'routes-personnage',
    routes  :   arrRoutes
};