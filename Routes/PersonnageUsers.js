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
const  personnageUsers  = require('../Models/personnageUsers').personnageUsersModel;
const appConfig =   require('../ENV').prefs;



const handlers_personnageUsers = require('../Handlers/PersonnageUsers').funcs_s;
const handlers_cd = require('../Handlers/CommonData').funcs_cd;

//const home  = require('../Web/home.html');



var arrRoutes = [

    {
        method: 'GET',
        path: '/api/mosque/getpersonnageUsers/{personnage_id}',
        handler: handlers_personnageUsers.getpersonnageUsers,
        config  :   {
            //auth:   'token',
            description: 'Mosque get all personnage users by personnage id.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                    personnage_id   :  Joi.string()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/api/mosque/getpersonnageUserByPersonnageUserId/{personnage_id}/{personnageUser_id}',
        handler: handlers_personnageUsers.getpersonnageUserByPersonnageUserId,
        config  :   {
            //auth:   'token',
            description: 'Mosque get personnage user by personnage user id.',
            notes: 'Test APi',
            tags: ['api','sa','mosque'], // ADD THIS TAG
            validate    :   {
                failAction  :   relish.failAction,
                params  :   Joi.object().keys({
                    personnage_id   :  Joi.string(),
                    personnageUser_id   :  Joi.string(),
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

    name    :   'routes-personnageUsers',
    routes  :   arrRoutes
};