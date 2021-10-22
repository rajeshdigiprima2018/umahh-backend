/**
 * Created by rv2016 on 05/06/17.
 */

"use strict";


const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const fs = require('fs');
const Wreck = require('wreck');
const async = require('async');
const rq = require('request');
const lupus = require('lupus');
const Path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;// require('./yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../Models/merchant').MerchantModel;
//var MenuItemModel = require('../Models/menuitem').menuItemModel;
var PersonnageUsersModel = require('../Models/personnageUsers').PersonnageUsersModel;

const Mailer = require('./Mailer').funcs_mail;

const appConfig = require('../ENV').prefs;


var execute = function (fn) {

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
}

var sendErrorReply = function (err, message, statusCode, reply) {

    return reply({

        success: false,
        error: err,
        message: message
    }).code(statusCode || 404);
}



module.exports.funcs_s = {

    getpersonnageUsers: function (request, reply) {

        const aFunc = async function () {

            try {

                //get mosque prayer details by id
                const getData = await PersonnageUsersModel.find({ "personnage_id": request.params.personnage_id, "deletedAt":null });

                return reply({
                    code: 200,
                    success: true,
                    data: getData,
                    message: "Personnage users fetched successfully."
                }).code(200);

            } catch (error) {
                // console.log(error);
                return reply({
                    success: false,
                    message: "Personnage user not fetched"
                }).code(500);
            }

        };
        execute(aFunc);

    },
    getpersonnageUserByPersonnageUserId: function (request, reply) {

        const aFunc = async function () {

            try {

                //get mosque prayer details by id

                const getData = await PersonnageUsersModel.findOne({"_id": request.params.personnageUser_id, "personnage_id": request.params.personnage_id, "deletedAt":null });

                return reply({
                    code: 200,
                    success: true,
                    data: getData,
                    message: "Personnage user fetched successfully."
                }).code(200);

            } catch (error) {
                // console.log(error);
                return reply({
                    success: false,
                    message: "Personnage user not fetched"
                }).code(500);
            }

        };
        execute(aFunc);

    },
}