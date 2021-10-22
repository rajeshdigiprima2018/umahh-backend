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
const paypal = require('paypal-rest-sdk');
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ASDNf4HK_wOKOMkbHyD9j6ks_cExSuh_zNGQGNAsxWGWTh8DcXZJRePbmhyBb4qSI19ib4g8ija3k47w',
    'client_secret': 'EAUEuK0YTTpg-ix1O9eNCCWLzJ0DiyHnB1ImEaTIADMIph6L3q2mOudA89cJMOSTWQLi1hGpvD9cTSUu'
});

var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers; // require('./yummzHandlers').funcs_g.YZHandlers;
var TransferPaymentToMosqueModel = require('../Models/transferPaymentToMosque').TransferPaymentToMosqueModel;
//var MenuItemModel = require('../Models/menuitem').menuItemModel;
var PrayerModel = require('../Models/prayer').PrayerModel;

var PaymentModel = require('../Models/payment').PaymentModel;

const Mailer = require('./Mailer').funcs_mail;

const appConfig = require('../ENV').prefs;


var execute = function(fn) {

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
}

var sendErrorReply = function(err, message, statusCode, reply) {

    return reply({

        success: false,
        error: err,
        message: message
    }).code(statusCode || 404);
}

var saveData = function(userObject, projection, options, logMessage, reply, callback) {

    userObject.save(function(err, savedDoc, numRowsAffected) {

        if (savedDoc && err == null && numRowsAffected > 0) {

            callback(null, savedDoc);
        } else if (err != null || numRowsAffected == 0) {

            callback(err, null);

            return sendErrorReply(err != null ? err.message : "Error occurred saving Model Data",
                logMessage, 404, reply);

        } else {

            return sendErrorReply("Unknown Server Error occurred saving Model Data",
                logMessage, 404, reply);
        }

    });
}


module.exports.funcs_pay = {

    /*    getprayerByMosqueId    :   function(request, reply) {

            const aFunc = async function(){

                try {

                    //get all mosque prayer by mosque id

                    const getAllData = await PrayerModel.find({mosque_id: request.params.mosque_id});

                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getAllData,
                        message     :   "Mosque prayer all list successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success     :   false,
                        message     :   "Mosque prayer not updated"
                    }).code(500);
                }

            };
            execute(aFunc);

        },


        getprayer    :   function(request, reply) {

            const aFunc = async function(){

                try {

                    //get mosque prayer details by id
                    const getData = await PrayerModel.findById(request.params._id);

                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   getData,
                        message     :   "Mosque prayer list successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success     :   false,
                        message     :   "Mosque prayer not updated"
                    }).code(500);
                }

            };
            execute(aFunc);

        },*/

    addPayment: function(request, reply) {

        const aFunc = async function() {
            try {
                let authUser = helpers_generic.getCurrentAuthUser();

                if (authUser) {

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url": "http://localhost:4002/api/payment/success",
                            "cancel_url": "http://localhost:4002/api/payment/cancel"
                        },
                        "transactions": [{
                            "item_list": {
                                "items": [{
                                    "name": "red hot item",
                                    "sku": "001",
                                    "price": "25.00",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                            },
                            "amount": {
                                "currency": "USD",
                                "total": "25.00"
                            },
                            "description": "This is the payment description."
                        }]
                    };

                    paypal.payment.create(create_payment_json, function(error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            return reply({
                                code: 200,
                                success: true,
                                data: payment
                            }).code(200);
                        }
                    });
                    //add mosque prayer and mosque id
                    /*const prayer = new PrayerModel(request.payload);
                    const result = await prayer.save();
                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   result,
                        message     :   "Mosque prayer add successfully."
                    }).code(200);*/
                }

            } catch (error) {

                return reply({
                    success: false,
                    message: error
                }).code(500);
            }

        };

        execute(aFunc);

    },

    getPayment: function(req, reply) {

        const aFunc = async function() {
            try {


                const payerId = req.query.PayerID;
                const paymentId = req.query.paymentId;
                console.log(payerId, paymentId);

                const execute_payment_json = {
                    "payer_id": payerId,
                    "transactions": [{
                        "amount": {
                            "currency": "USD",
                            "total": "25.00"
                        }
                    }]
                };


                paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
                    if (error) {
                        console.log(error.response);
                        throw error;
                    } else {
                        return reply({
                            code: 200,
                            success: true,
                            data: payment
                        }).code(200);
                    }
                });

            } catch (error) {

                return reply({
                    success: false,
                    message: error
                }).code(500);
            }

        };

        execute(aFunc);

    },
    savePayment: function(request, reply) {

        const aFunc = async function() {
            try {
                let authUser = helpers_generic.getCurrentAuthUser();
                if (authUser) {

                    //add user payment and mosque id
                    const newAddd = {
                        "mosque_id": request.payload.mosque_id,
                        "user_id": authUser._id,
                        "txn_id": request.payload.txn_id,
                        "amount": (Math.round(request.payload.amount * 100) / 100).toFixed(2)
                    }
                    console.log('hii user testing', newAddd);

                    const paymentSave = new PaymentModel(newAddd);
                    const result = await paymentSave.save();
                    return reply({
                        code: 200,
                        success: true,
                        data: result,
                        message: "payment successfully."
                    }).code(200);
                } else {
                    return reply({
                        code: 400,
                        success: false,
                        message: "You are not Authonticate user."
                    }).code(400);
                }

            } catch (error) {

                return reply({
                    code: 500,
                    success: false,
                    message: error
                }).code(500);
            }

        };

        execute(aFunc);

    },
    getPaymentByMosque: function(request, reply) {

        const aFunc = async function() {
            try {
                let authUser = helpers_generic.getCurrentAuthUser();


                if (authUser) {
                    if (authUser.role == "admin") {

                        //add user payment and mosque id
                        let count = request.payload.count ? request.payload.count : 0;
                        let skip = request.payload.count * (request.payload.page - 1);
                        let sorting = { createdAt: -1 };
                        let totCount;
                        const getCount = await PaymentModel.find({ isDeleted: null }).count();
                        if (getCount) {
                            totCount = getCount;
                            if (!request.payload.count) {
                                count = totCount;
                            }

                            const getAllData = await PaymentModel.find({ isDeleted: null })
                                .populate('user_id', 'username email')
                                .populate('mosque_id', 'username email')
                                .limit(parseInt(count))
                                .skip(parseInt(skip))
                                .sort(sorting)
                                .lean();
                            return reply({
                                code: 200,
                                success: true,
                                data: getAllData,
                                totalCount: totCount,
                                message: "List payment successfully."
                            }).code(200);
                        } else {
                            return reply({
                                code: 200,
                                success: true,
                                data: [],
                                totalCount: 0,
                                message: "Donation not found."
                            });

                        }
                    } else {

                        //get user payment by mosque id
                        let count = request.payload.count ? request.payload.count : 0;
                        let skip = request.payload.count * (request.payload.page - 1);
                        let sorting = { createdAt: -1 };
                        let totCount;
                        const getCount = await TransferPaymentToMosqueModel.find({ $and: [{ mosqueId: authUser.user_id }, { isDeleted: null }] }).count();
                        console.log('getCount', getCount);
                        if (getCount) {
                            totCount = getCount;
                            if (!request.payload.count) {
                                count = totCount;
                            }
                            const getAllDatatrasaction = await TransferPaymentToMosqueModel.find({ $and: [{ mosqueId: authUser.user_id }, { isDeleted: null }] })
                                .populate('adminId', 'username email')
                                .limit(parseInt(count))
                                .skip(parseInt(skip))
                                .sort(sorting)
                                .lean();

                            return reply({
                                code: 200,
                                success: true,
                                data: getAllDatatrasaction,
                                totalCount: totCount,
                                message: "Get All payment list successfully."
                            }).code(200);
                        } else {
                            return reply({
                                code: 200,
                                success: true,
                                data: [],
                                totalCount: 0,
                                message: "Donation not found."
                            });

                        }

                    }
                } else {
                    return reply({
                        code: 400,
                        success: false,
                        message: "You are not Authonticate user."
                    }).code(400);
                }

            } catch (error) {

                return reply({
                    code: 500,
                    success: false,
                    message: error
                }).code(500);
            }

        };

        execute(aFunc);

    },
    getPaymentByUser: function(request, reply) {

        const aFunc = async function() {
            try {
                let authUser = helpers_generic.getCurrentAuthUser();


                if (authUser) {

                    //add user payment and mosque id
                    /*                 let count = request.payload.count ? request.payload.count : 0;
                                    let skip = request.payload.count * (request.payload.page - 1);
                                    let sorting = { createdAt: -1 };
                                    let totCount; */
                    let sorting = { createdAt: -1 };
                    const getAllData = await PaymentModel.find({ user_id: authUser._id, isDeleted: null })
                        .populate('user_id', 'username email')
                        .populate('mosque_id', 'username email')
                        .sort(sorting)
                        .lean();
                    if (getAllData) {
                        /*                     totCount = getCount;
                                            if (!request.payload.count) {
                                                count = totCount;
                                            } */

                        return reply({
                            code: 200,
                            success: true,
                            data: getAllData,
                            message: "List Donation successfully."
                        }).code(200);
                    } else {
                        return reply({
                            code: 401,
                            success: true,
                            data: [],
                            message: "Donation not found."
                        });

                    }
                } else {
                    return reply({
                        code: 400,
                        success: false,
                        message: "You are not Authonticate user."
                    }).code(400);
                }

            } catch (error) {

                return reply({
                    code: 500,
                    success: false,
                    message: error
                }).code(500);
            }

        };

        execute(aFunc);

    },

    /*    modifyprayer    :   function(request, reply) {

            const aFunc = async function(){

                try {

                    //update mosque prayer by prayer id


                    const modifyData = await PrayerModel.findByIdAndUpdate(request.params._id, request.payload, { new: true });

                    return reply({
                        code: 200,
                        success     :   true,
                        data        :   modifyData,
                        message     :   "Mosque prayer updated successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success     :   false,
                        message     :   "Mosque prayer not updated"
                    }).code(500);
                }

            };
            execute(aFunc);
        },

        deleteprayer    :   function(request, reply) {

            const aFunc = async function(){

                try {


                    //delete mosque prayer by prayer id
                    const deleteData = await PrayerModel.remove({_id:request.params._id});
                    return reply({
                        code:200,
                        success     :   true,
                        data        :   deleteData,
                        message     :   "Mosque prayer deleted successfully."
                    }).code(200);

                } catch (error) {
                    return reply({
                        success     :   false,
                        message     :   "Mosque prayer not updated"
                    }).code(500);
                }

            };
            execute(aFunc);
        },
    */
}