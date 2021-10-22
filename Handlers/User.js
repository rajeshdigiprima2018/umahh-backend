/**
 * Created by rv2016 on 14/11/16.
 */


"use strict";

var http = require('http');

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
const crypto = require("crypto");
const stripe = require("stripe")("sk_test_lQgpLfteJhFYbcRqpOPvQ6i4");
const geoTz = require('geo-tz');
var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers; // require('./yummzHandlers').funcs_g.YZHandlers;
var MerchantModel = require('../Models/merchant').MerchantModel;
var UserModel = require('../Models/user').UserModel;
var CategoryModel = require('../Models/category').CategoryModel;
var TrainingModel = require('../Models/traininguser').TrainingModel;
var PaymentModel = require('../Models/payment').PaymentModel;
var PackageModel = require('../Models/package').PackageModel;
var CountriesModel = require('../Models/countries').CountriesModel;
var StatesModel = require('../Models/states').StatesModel;
var CitiesModel = require('../Models/cities').CitiesModel;
var DonationCategoryModel = require('../Models/donationCategory').DonationCategoryModel;
var DonationCategoryStatusChangeModel = require('../Models/donationCategoryStatusChange').DonationCategoryStatusChangeModel;
var MessageModel = require('../Models/message').MessageModel;



const mongoose = require('mongoose');
var braintree = require('braintree');
const plivo = require('plivo');

let plivo_gateway = plivo.RestAPI({

    authId: 'MANWE1N2E5YJJKNZKWMW',
    authToken: 'MWI1MmY0YzliZjIyYWNjN2FmZGFkZmEwOWY3ODc0'
});

const Mailer = require('./Mailer').funcs_mail;

const appConfig = require('../ENV').prefs;
const QRGenrator = require('qrcode');
var environment, gateway;

//require('dotenv').load();
//var BT_ENVIRONMENT='Sandbox';
var BT_MERCHANT_ID = 'r964vjqbwfb3hctd';
var BT_PUBLIC_KEY = 'cjjg7crkr2wdf7xc';
var BT_PRIVATE_KEY = '3e1a7daceeaaf867b3066a897edb6d9f';
//environment = process.env.BT_ENVIRONMENT.charAt(0).toUpperCase() + process.env.BT_ENVIRONMENT.slice(1);*/

gateway = braintree.connect({
    environment: braintree.Environment['Sandbox'],
    merchantId: BT_MERCHANT_ID,
    publicKey: BT_PUBLIC_KEY,
    privateKey: BT_PRIVATE_KEY
});
var TRANSACTION_SUCCESS_STATUSES = [
    braintree.Transaction.Status.Authorizing,
    braintree.Transaction.Status.Authorized,
    braintree.Transaction.Status.Settled,
    braintree.Transaction.Status.Settling,
    braintree.Transaction.Status.SettlementConfirmed,
    braintree.Transaction.Status.SettlementPending,
    braintree.Transaction.Status.SubmittedForSettlement
];

var execute = function(fn) {

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};

var saveData = function(userObject, projection, options, logMessage, reply, callback) {

    userObject.save(function(err, savedDoc, numRowsAffected) {

        if (savedDoc && err == null && numRowsAffected > 0) {

            callback(null, savedDoc);
        } else if (err != null || numRowsAffected == 0) {

            callback(err, null);

            return sendErrorReply(err != null ? err.message : "Error occurred saving User Data",
                logMessage, 404, reply);

        } else {

            return sendErrorReply("Unknown Server Error occurred saving User Data",
                logMessage, 404, reply);
        }

    });
};


module.exports.funcs_u = {

    getAllUsers: function getAllUsers(request, reply) {

        var aFunc = function() {

            UserModel.find({}, UserModel.whiteListFields, function(err, arrUsers) {

                if (err) {

                    reply({

                        success: false,
                        error: err
                    });
                } else {

                    reply({
                        code: 200,
                        success: true,
                        data: arrUsers
                    });
                }

            })

        };

        execute(aFunc);

    },

    getAllRoleUsers: function getAllRoleUsers(request, reply) {
        var payload = request.payload;
        var aFunc = function() {
            let role = payload.role;
            if (!role == 'all') {
                UserModel.find({ $and: [{ role: payload.role }] }, UserModel.whiteListFields, function(err, arrUsers) {

                    if (err) {

                        reply({

                            success: false,
                            error: err
                        });
                    } else {

                        reply({
                            code: 200,
                            success: true,
                            data: arrUsers
                        });
                    }

                })
            } else {

                UserModel.find({ $and: [{ role: role }, { isUpdated: '1' }] }, UserModel.whiteListFields, function(err, arrUserData) {

                    if (err) {

                        reply({

                            success: false,
                            error: err
                        });
                    } else {

                        reply({
                            code: 200,
                            success: true,
                            data: arrUserData
                        });
                    }

                });

            }

        };

        execute(aFunc);

    },
    getAllWebRoleUsers: function getAllWebRoleUsers(request, reply) {
        var payload = request.payload;
        var aFunc = function() {
            let role = payload.role;
            UserModel.find({ $and: [{ role: payload.role }] }, UserModel.whiteListFields)
                .populate('associates_id', 'associate_user')
                .exec(function(err, arrUsers) {

                    if (err) {

                        reply({

                            success: false,
                            error: err
                        });
                    } else {

                        reply({
                            code: 200,
                            success: true,
                            data: arrUsers
                        });
                    }

                })
        };

        execute(aFunc);

    },
    getAllUserWeb: function getAllUserWeb(request, reply) {
        const aFunc = async function() {
            try {

                //get all admin supplication by admin id

                let count = request.payload.count ? request.payload.count : 0;
                let skip = request.payload.count * (request.payload.page - 1);
                let sorting = { createdAt: -1 };
                let totCount;
                const getCount = await await UserModel.find({ role: request.payload.role }).populate('associates_id', 'associate_user').count();
                totCount = getCount;
                if (!request.payload.count) {
                    count = totCount;
                }

                const getAllData = await await await UserModel.find({ role: request.payload.role }).populate('associates_id', 'associate_user')
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();

                return reply({
                    code: 200,
                    success: true,
                    data: getAllData,
                    totalCount: totCount,
                    message: "admin user all list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "admin user not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },
    getAllUserWeblastSevenDay: function getAllUserWeb(request, reply) {
        const aFunc = async function() {
            try {

                //get all admin supplication by admin id
                var d = new Date();
                d.setDate(d.getDate() - 7);

                let count = request.payload.count ? request.payload.count : 0;
                let skip = request.payload.count * (request.payload.page - 1);
                let sorting = { createdAt: -1 };
                let userId = request.payload.user_id
                    /* GET ALL USER LAST 7 DAYS  START*/

                let totCountuser;
                const getCountuser = await UserModel.find({ $and: [{ role: "user" }, { "createdAt": { $gt: d } }] }).populate('associates_id', 'associate_user').count();
                totCountuser = getCountuser;
                if (!request.payload.count) {
                    count = totCountuser;
                }

                // const getAllUser = await UserModel.find({ $and: [{ role: "user" }, { "createdAt": { $gt: d } }] }).populate('associates_id', 'associate_user')
                //     .limit(parseInt(count))
                //     .skip(parseInt(skip))
                //     .sort(sorting)
                //     .lean();

                const getAllUser = await UserModel.find({ $and: [{ role: "user" }] }).populate('associates_id', 'associate_user')
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();
                /* GET ALL USER LAST 7 DAYS  END*/

                /* GET ALL MOSQUE LAST 7 DAYS  START*/

                let totCountmosque;
                const getCountmosque = await UserModel.find({ $and: [{ role: "mosque" }, { "createdAt": { $gt: d } }] }).populate('associates_id', 'associate_user').count();
                totCountmosque = getCountmosque;
                if (!request.payload.count) {
                    count = totCountmosque;
                }

                // const getAllMosque = await UserModel.find({ $and: [{ role: "mosque" }, { "createdAt": { $gt: d } }] }).populate('associates_id', 'associate_user')
                //     .limit(parseInt(count))
                //     .skip(parseInt(skip))
                //     .sort(sorting)
                //     .lean();
                const getAllMosque = await UserModel.find({ $and: [{ role: "mosque" }] }).populate('associates_id', 'associate_user')
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();

                /* GET ALL MOSQUE LAST 7 DAYS  END*/

                /* GET ALL MESSAGES LAST 7 DAYS  START*/
                let totCountmessage;
                // const getCountmessage = await MessageModel.find({ "createdAt": { $gt: d } }).count();
                const getCountmessage = await MessageModel.find({ $or: [{ send_id: userId }, { recive_id: userId }] }).count();
                totCountmessage = getCountmessage;
                if (!request.payload.count) {
                    count = totCountmessage;
                }

                // const getAllMessage = await MessageModel.find({ "createdAt": { $gt: d } })
                //     .populate('send_id', 'username avtar')
                //     .populate('recive_id', 'username avtar')
                //     .limit(parseInt(count))
                //     .skip(parseInt(skip))
                //     .sort(sorting)
                //     .lean();
                // getAllMessage = await MessageModel.find()
                const getAllMessage = await MessageModel.find({ $or: [{ send_id: userId }, { recive_id: userId }] })
                    .populate('send_id', 'username avtar')
                    .populate('recive_id', 'username avtar')
                    .limit(parseInt(count))
                    .skip(parseInt(skip))
                    .sort(sorting)
                    .lean();

                /* GET ALL MESSAGES LAST 7 DAYS  END*/

                return reply({
                    code: 200,
                    success: true,
                    userdata: getAllUser,
                    totalCountuser: totCountuser,
                    mosquedata: getAllMosque,
                    totalCountmosque: totCountmosque,
                    messagedata: getAllMessage,
                    totalCountmessage: totCountmessage,
                    message: "All users and mosque list successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "admin user not found"
                }).code(500);
            }

        };
        execute(aFunc);

    },

    generatToken: function generatToken(request, reply) {
        var payload = request.payload;
        var aFunc = function() {
            gateway.clientToken.generate({}, function(err, generatarr) {

                if (err) {
                    reply({

                        success: false,
                        error: err
                    });
                } else {
                    reply({

                        success: false,
                        data: generatarr
                    });

                }
            })
        };

        execute(aFunc);
    },

    payment: function payment(request, reply) {
        var payload = request.payload;
        var aFunc = function() {
            console.log(payload);
            UserModel.findOne({ _id: payload.user_id }, UserModel.whiteListFields, function(err, arrUsers) {

                if (err) {
                    reply({

                        success: false,
                        error: err
                    });
                } else {
                    PackageModel.findOne({ _id: payload.package_id }, function(err, packagedata) {
                        if (arrUsers) {
                            var today = new Date();
                            if (arrUsers.expireDate == null || Date.parse(today) >= Date.parse(arrUsers.expireDate)) {
                                var targetDate = new Date();
                                targetDate.setDate(today.getDate() + packagedata.days);
                                targetDate.setHours(0);
                                targetDate.setMinutes(0);
                                targetDate.setSeconds(0);
                                let email = arrUsers.email;
                                let _id = mongoose.Types.ObjectId(arrUsers._id);
                                let paymentUser = {
                                    user_id: _id,
                                    email: email,
                                    token: payload.token,
                                    amount: packagedata.amount,
                                }
                                var newUser = new PaymentModel(paymentUser);
                                newUser.save(function(err, savedUser, rowsAffected) {
                                    if (err) {

                                        reply({
                                            success: true,
                                            error: err
                                        });

                                    } else {
                                        UserModel.findOneAndUpdate({ _id: _id }, { $set: { expireDate: targetDate } }, null, function(erra, modAdmin) {

                                            if (erra == null && modAdmin) {
                                                gateway.transaction.sale({
                                                    amount: packagedata.amount,
                                                    paymentMethodNonce: payload.token,
                                                    options: {
                                                        submitForSettlement: true
                                                    }
                                                }, function(err, result) {
                                                    if (result) {
                                                        console.log('payment done successfully', result);
                                                    } else {
                                                        console.log('payment not done');
                                                    }
                                                });

                                                reply({
                                                    success: true,
                                                    payment: savedUser,
                                                    message: "New Plan Updated successfully",
                                                });
                                            } else {

                                                reply({

                                                    success: true,
                                                    message: 'server problem',
                                                });
                                            }
                                        });

                                    }


                                });
                            } else {

                                var expireDate = arrUsers.expireDate;
                                var targetOldDate = new Date(expireDate);
                                targetOldDate.setDate(expireDate.getDate() + packagedata.days);
                                targetOldDate.setHours(0);
                                targetOldDate.setMinutes(0);
                                targetOldDate.setSeconds(0);
                                let email = arrUsers.email;
                                let _id = mongoose.Types.ObjectId(arrUsers._id);
                                let paymentUser = {
                                    user_id: _id,
                                    email: email,
                                    token: payload.token,
                                    amount: packagedata.amount,
                                }
                                var newUser = new PaymentModel(paymentUser);

                                newUser.save(function(err, savedUser, rowsAffected) {
                                    if (err) {

                                        reply({
                                            success: true,
                                            error: err
                                        });

                                    } else {

                                        UserModel.findOneAndUpdate({ _id: _id }, { $set: { expireDate: targetOldDate } }, null, function(erra, dateUpdate) {

                                            if (erra == null && dateUpdate) {
                                                gateway.transaction.sale({
                                                    amount: packagedata.amount,
                                                    paymentMethodNonce: payload.token,
                                                    options: {
                                                        submitForSettlement: true
                                                    }
                                                }, function(err, result) {
                                                    if (result) {
                                                        console.log('payment done successfully', result);
                                                    } else {
                                                        console.log('payment not done');
                                                    }
                                                });

                                                reply({
                                                    success: true,
                                                    payment: savedUser,
                                                    message: "Old Plan Updated successfully",
                                                });
                                            } else {
                                                reply({

                                                    success: true,
                                                    message: 'server problem data',
                                                });
                                            }
                                        });
                                    }

                                });
                            }

                        } else {

                            reply({

                                success: true,
                                users: arrUsers
                            });
                        }
                    });
                }
            })
        };

        execute(aFunc);
    },

    addNew: function(request, reply) {
        var aFunc = async function() {
            let emailLowerCase = request.payload.email;
            let email = emailLowerCase.toLowerCase();
            let payload = request.payload;
            payload.email = email;
            UserModel.checkUniquenessUser(email, async function(err, user) {
                if (err) {
                    console.error('error checking uniqueness of user. Error' + err);
                    reply("OK");
                } else if (user) {
                    if (payload.username === user.username) {
                        console.error('user already exists with username ----:' + user.username);
                    } else if (payload.email === user.email) {
                        console.error('user already exists with email address ----: ' + user.email);
                    }
                    return reply({
                        error: "User Already Exists",
                        message: "User Already Exists with Email address provided.",
                        success: false
                    });
                } else {
                    var obj = payload;
                    obj.createdAt = Date.now();
                    var hashedPwd = null;
                    if (obj.role == 'user' || obj.role == 'admin') {
                        if (payload.hasOwnProperty("password")) {
                            helpers_generic.encryptPassword(payload.password, 10, function(err, result) {
                                if (err) {
                                    reply({
                                        success: false,
                                        error: err
                                    })
                                } else {
                                    hashedPwd = result;
                                    obj.password = hashedPwd;
                                    obj.randomToken = Math.floor(1000 + Math.random() * 9000);
                                    var newUser = new UserModel(obj);
                                    newUser.save(function(err, savedUser, rowsAffected) {

                                        if (err || rowsAffected == 0) {
                                            console.error(err || 'Error Saving User.');
                                            reply(err || 'Error Saving User.');
                                        } else {
                                            let rep = savedUser.toObject();
                                            let mailData = {
                                                to: rep.email,
                                                data: {
                                                    username: rep.email,
                                                    randomToken: rep.randomToken,
                                                },
                                                subject: "Welcome to Umahh",
                                                text: "\n Invite You ",
                                                html: "<b> \n training.</b>"
                                            };
                                            Mailer.sendNewEmail(Mailer.emailTypes.USER_WELCOME, mailData, function(err, result) {
                                                console.log('hello send mail', result);
                                            });
                                            /*    const randomToken = rep.randomToken;
                                            //const phoneCode = rep.country.phoneCode;
                                            const mobile = rep.mobile;
                                            const otp = `Hi, welcome umahh ${randomToken}`;
                                            // const userDataSet =  UserModel.update({_id:rep._id},{$set:{"randomToken":randomToken}});

                                            var params  =   {

                                                'src': 'YUMMZ', // Sender's phone number with country code
                                                'dst' : mobile,//req.params.destination, // Receiver's phone Number with country code
                                                'text' : otp,// Your SMS Text Message - English
                                                //'url' : "https://yummzapp.com:4001",
                                                'method' : 'GET'
                                            }

                                            plivo_gateway.send_message(params, function(status, response){

                                                var _success     =   false;

                                                if(status >= 200 && status < 300){

                                                    console.log("SMS sent successfully");

                                                    _success = true;
                                                }

                                            });*/
                                            reply({
                                                success: true,
                                                data: savedUser,
                                                status: 200,
                                                message: 'Signup is completed, you can login now!'
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            reply({
                                success: false,
                                error: 'Missing password field.'
                            });
                        }
                    } else {

                        const timezone = await geoTz(obj.lat, obj.lng);
                        obj.timezone = timezone[0];
                        obj.locSearch = [obj.lng, obj.lat];
                        obj.geometry = {
                            "location": {
                                "lat": obj.lat,
                                "lng": obj.lng
                            }
                        }
                        obj.randomToken = Math.floor(1000 + Math.random() * 9000);
                        var newUser = new UserModel(obj);
                        newUser.save(async function(err, savedUser, rowsAffected) {

                            if (err || rowsAffected == 0) {
                                console.error(err || 'Error Saving User.');
                                reply(err || 'Error Saving User.');
                            } else {

                                let rep = savedUser.toObject();

                                let mailData = {
                                    to: rep.email,
                                    data: {
                                        username: rep.email,
                                        randomToken: rep.randomToken,
                                    },
                                    subject: "Welcome to Umahh!!",
                                    text: "\n Invite You ",
                                    html: "<b> \n training.</b>"
                                };

                                Mailer.sendNewEmail(Mailer.emailTypes.USER_WELCOME, mailData, function(err, result) {

                                });
                                /*  const randomToken = rep.randomToken;
                                    // const phoneCode = rep.country.phoneCode;
                                    const mobile = rep.mobile;
                                    const otp = `Hi, welcome umahh ${randomToken}`;
                                    // const userDataSet = UserModel.update({_id:rep._id},{$set:{"randomToken":randomToken}});

                                    var params  =   {

                                        'src': 'YUMMZ', // Sender's phone number with country code
                                        'dst' : mobile,//req.params.destination, // Receiver's phone Number with country code
                                        'text' : otp,// Your SMS Text Message - English
                                        //'url' : "https://yummzapp.com:4001",
                                        'method' : 'GET'
                                    }

                                    plivo_gateway.send_message(params, function(status, response){

                                        var _success     =   false;

                                        if(status >= 200 && status < 300){

                                            console.log("SMS sent successfully");

                                            _success = true;
                                        }

                                    });*/
                                if (rep.role == 'mosque') {

                                    let categoryData = await DonationCategoryModel.find();
                                    console.log('category find', categoryData);
                                    let addCategory = {
                                        "mosque_id": rep._id,
                                        "category": categoryData
                                    }
                                    let saveDataCategory = new DonationCategoryStatusChangeModel(addCategory);
                                    await saveDataCategory.save();
                                }
                                reply({
                                    success: true,
                                    data: savedUser,
                                    message: 'Signup is completed, you can login now!'
                                });
                            }
                        });
                    }
                }
            });
        };
        execute(aFunc);
    },

    checkUniqueness: function(request, reply) {

        var aFunc = function() {

            let payload = request.payload;

            UserModel.checkUniqueness(payload.username, payload.email, function(err, user) {

                console.log(err);
                console.log(user);

                if (err) {

                    console.error('error checking uniqueness of user. Error' + err);

                    reply({

                        sucess: false,
                        message: "Error checking user data.",
                        error: err
                    });
                } else if (user) {

                    if (payload.username === user.username) {

                        console.error('user already exists with username :' + user.username);

                        reply({

                            sucess: true,
                            message: 'user already exists with username :' + user.username,
                            userExists: true
                        });

                    } else if (payload.email === user.email) {

                        console.error('user already exists with email address : ' + user.email);

                        reply({
                            sucess: true,
                            message: 'user already exists with email address : ' + user.email,
                            userExists: true
                        });
                    }


                } else {

                    reply({
                        sucess: true,
                        message: 'username and email address are available',
                        userExists: false
                    });
                }

            });
        };

        execute(aFunc);
    },

    signIn: function(request, reply) {

        var aFunc = function() {

            let payload = request.payload;
            UserModel.checkUniquenessUser(payload.email, function(err, user) {
                if (err) {
                    reply({
                        success: false,
                        error: err || 'Problem saving User',
                        message: 'Server Error occurred. Please try again'
                    }).code(500);
                } else if (user) {
                    console.error('user already exists');

                    helpers_generic.matchPassword(payload.password, user.password, function(err, isMatching) {

                        console.log('err : ' + err + '\n is matching : ' + isMatching);

                        if (isMatching) {

                            var obj = user;
                            var newSessionID = null;

                            let session_guid = crypto.randomBytes(16).toString("hex");

                            newSessionID = session_guid;

                            obj.sessions.push(newSessionID);

                            let token = require('../index').generateToken({
                                id: user._id,
                                username: user.username,
                                sessionID: newSessionID,
                                email: user.email,
                                role: user.role //,

                            });
                            console.log('asDDDdDDADddadddadaddddad', token);
                            obj.access_token = token;

                            obj.isLoggedIn = true;

                            obj.deviceToken = payload.deviceToken;
                            obj.deviceType = payload.deviceType;

                            var newUser = obj; //new UserModel(obj);

                            console.log('asDDDdDDADddadddadaddddad', newUser);

                            newUser.save(function(err, savedUser, rowsAffected) {

                                if (err || rowsAffected == 0) {

                                    console.error(err || 'Problem saving User.');

                                    reply({

                                        success: false,
                                        error: err || 'Problem saving User.',
                                        message: 'Server Error occured. Please try again'
                                    });
                                } else {

                                    let rep = savedUser.toObject();

                                    rep.sessions = [newSessionID];

                                    reply({

                                        success: true,
                                        code: 200,
                                        message: "user authenticated successfully",
                                        data: rep
                                    });

                                    console.log("user authenticated successfully");
                                }
                            });

                        } else {

                            reply({
                                success: false,
                                code: 401,
                                error: 'User with email address does not exists',
                                message: 'Invalid password',
                                isMatching: false
                            });
                        }
                    });
                } else {

                    reply({
                        success: false,
                        code: 401,
                        error: 'User with email address does not exists',
                        message: 'Invalid Email and password',
                        isMatching: false
                    });

                }
            });

        };

        execute(aFunc);

    },

    signInViaFb: function(request, reply) {
        var aFunc = function() {
            let payload = request.payload;
            UserModel.checkUniquenessUser(payload.email, function(err, user) {
                if (err) {
                    console.log('err', payload);
                    console.error('error checking uniqueness of user. Error' + err);
                    reply("OK");
                } else if (user) {
                    console.log('else if', payload);
                    helpers_generic.accesstokenFunction(payload.accesstoken, payload.provider, payload.email, function(err, isMatching) {
                        console.log('err : ' + err + '\n is matching : ' + isMatching);
                        if (isMatching) {
                            var obj = user;
                            var newSessionID = null;
                            //if (obj.access_token && obj.isLoggedIn == true){
                            let session_guid = crypto.randomBytes(16).toString("hex");
                            newSessionID = session_guid;
                            obj.sessions.push(newSessionID);
                            let token = require('../index').generateToken({
                                id: user._id,
                                username: user.username,
                                sessionID: newSessionID,
                                email: user.email,
                                role: user.role //,
                            });
                            obj.access_token = token;
                            obj.isLoggedIn = true;
                            obj.deviceToken = payload.deviceToken;
                            obj.deviceType = payload.deviceType;
                            var newUser = obj; //new UserModel(obj);
                            console.log(newUser);
                            newUser.save(function(err, savedUser, rowsAffected) {
                                if (err || rowsAffected == 0) {
                                    console.error(err || 'Problem saving User.');
                                    reply({
                                        success: false,
                                        error: err || 'Problem saving User.',
                                        message: 'Server Error occured. Please try again'
                                    });
                                } else {
                                    let rep = savedUser.toObject(); //savedUser.toPublic();
                                    rep.sessions = [newSessionID];
                                    reply({
                                        code: 200,
                                        success: true,
                                        data: rep
                                    });
                                }
                            });
                        } else {
                            console.error('error checking access token of user. Error');
                            reply({
                                code: 404,
                                success: false,
                                error: 'Invalid Access Token',
                                message: 'Invalid Access Token or email',
                                isMatching: false
                            });
                        }
                    });
                } else {
                    helpers_generic.accesstokenFunction(payload.accesstoken, payload.provider, payload.email, function(err, isMatching) {
                        if (isMatching) {
                            var obj = payload;
                            obj.createdAt = Date.now();
                            var hashedPwd = null;
                            //hashedPwd = result;
                            obj.password = hashedPwd;
                            obj.address = {
                                line1: payload.addressline_1,
                                line2: payload.addressline_2,
                                zip: payload.zipcode,
                                landmark: payload.landmark
                            };
                            console.log(obj);
                            var newUser = new UserModel(obj);
                            console.log(newUser);

                            newUser.save(function(err, savedUser, rowsAffected) {
                                if (err || rowsAffected == 0) {
                                    console.error(err || 'Error Saving User.');
                                    reply(err || 'Error Saving User.');
                                } else {
                                    var obj = savedUser;
                                    var newSessionID = null;
                                    let session_guid = crypto.randomBytes(16).toString("hex");
                                    newSessionID = session_guid;
                                    obj.sessions.push(newSessionID);
                                    let token = require('../index').generateToken({
                                        id: savedUser._id,
                                        username: savedUser.username,
                                        sessionID: newSessionID,
                                        email: savedUser.email,
                                        role: savedUser.role //,
                                            //guid : crypto.randomBytes(16).toString("hex")
                                    });
                                    obj.access_token = token;
                                    obj.isLoggedIn = true;
                                    obj.deviceToken = payload.deviceToken;
                                    obj.deviceType = payload.deviceType;
                                    var newUser = obj; //new UserModel(obj);
                                    console.log(newUser);
                                    newUser.save(function(err, savedUser, rowsAffected) {
                                        if (err || rowsAffected == 0) {
                                            console.error(err || 'Problem saving User.');
                                            reply({
                                                success: false,
                                                error: err || 'Problem saving User.',
                                                message: 'Server Error occured. Please try again'
                                            });
                                        } else {
                                            let rep = savedUser.toObject(); //savedUser.toPublic();
                                            rep.sessions = [newSessionID];
                                            reply({
                                                code: 200,
                                                success: true,
                                                data: rep
                                            });
                                            console.log("user authenticated successfully");
                                        }
                                    });
                                }
                            });
                        } else {
                            reply({
                                code: 404,
                                success: false,
                                error: 'Invalid Access Token',
                                message: 'Invalid Access Token or email',
                                isMatching: false
                            });
                        }
                    });
                }
            });
        }
        execute(aFunc);
    },

    signInViaGoogle: function(request, reply) {
        var aFunc = function() {
            let payload = request.payload;
            UserModel.checkUniquenessUser(payload.email, function(err, user) {
                /*    console.log(err);
                   console.log(user); */
                if (err) {
                    console.error('error checking uniqueness of user. Error' + err);
                    reply("OK");
                } else if (user) {

                    helpers_generic.accesstokenFunctiongoogle(payload.accesstoken, payload.provider, payload.email, function(err, isMatching) {

                        console.log('err : ' + err + '\n is matching : ' + isMatching);
                        if (isMatching) {
                            var obj = user;
                            var newSessionID = null;
                            //if (obj.access_token && obj.isLoggedIn == true){
                            let session_guid = crypto.randomBytes(16).toString("hex");
                            newSessionID = session_guid;
                            obj.sessions.push(newSessionID);
                            let token = require('../index').generateToken({
                                id: user._id,
                                username: user.username,
                                sessionID: newSessionID,
                                email: user.email,
                                role: user.role //,
                            });
                            obj.access_token = token;
                            obj.isLoggedIn = true;
                            obj.deviceToken = payload.deviceToken;
                            obj.deviceType = payload.deviceType;
                            var newUser = obj; //new UserModel(obj);
                            console.log(newUser);
                            newUser.save(function(err, savedUser, rowsAffected) {
                                if (err || rowsAffected == 0) {
                                    console.error(err || 'Problem saving User.');
                                    reply({
                                        success: false,
                                        error: err || 'Problem saving User.',
                                        message_readable: 'Server Error occured. Please try again'
                                    });
                                } else {
                                    let rep = savedUser.toObject(); //savedUser.toPublic();
                                    rep.sessions = [newSessionID];
                                    reply({
                                        code: 200,
                                        success: true,
                                        data: rep
                                    });
                                    console.log("user authenticated successfully");
                                }
                            });
                        } else {
                            console.error('error checking access token of user. Error');
                            reply({
                                code: 200,
                                success: false,
                                error: 'Invalid Access Token',
                                message: 'Invalid Access Token or email',
                                isMatching: false
                            });
                        }
                    });
                } else {
                    helpers_generic.accesstokenFunctiongoogle(payload.accesstoken, payload.provider, payload.email, function(err, isMatching) {
                        if (isMatching) {
                            var obj = payload;
                            obj.createdAt = Date.now();
                            var hashedPwd = null;
                            //hashedPwd = result;
                            obj.password = hashedPwd;
                            obj.address = {
                                line1: payload.addressline_1,
                                line2: payload.addressline_2,
                                zip: payload.zipcode,
                                landmark: payload.landmark
                            };
                            console.log(obj);
                            var newUser = new UserModel(obj);
                            console.log(newUser);
                            newUser.save(function(err, savedUser, rowsAffected) {
                                if (err || rowsAffected == 0) {
                                    console.error(err || 'Error Saving User.');
                                    reply(err || 'Error Saving User.');
                                } else {
                                    var obj = savedUser;
                                    var newSessionID = null;
                                    let session_guid = crypto.randomBytes(16).toString("hex");
                                    newSessionID = session_guid;
                                    obj.sessions.push(newSessionID);
                                    let token = require('../index').generateToken({
                                        id: savedUser._id,
                                        username: savedUser.username,
                                        sessionID: newSessionID,
                                        email: savedUser.email,
                                        role: savedUser.role //,
                                            //guid : crypto.randomBytes(16).toString("hex")
                                    });
                                    obj.access_token = token;
                                    obj.isLoggedIn = true;
                                    obj.deviceToken = payload.deviceToken;
                                    obj.deviceType = payload.deviceType;
                                    var newUser = obj; //new UserModel(obj);
                                    console.log(newUser);
                                    newUser.save(function(err, savedUser, rowsAffected) {
                                        if (err || rowsAffected == 0) {
                                            console.error(err || 'Problem saving User.');
                                            reply({
                                                success: false,
                                                error: err || 'Problem saving User.',
                                                message_readable: 'Server Error occured. Please try again'
                                            });
                                        } else {
                                            let rep = savedUser.toObject(); //savedUser.toPublic();
                                            //console.log('---- Trimmed User-----\n',rep );
                                            rep.sessions = [newSessionID];
                                            reply({
                                                code: 200,
                                                success: true,
                                                data: rep
                                            });
                                            console.log("user authenticated successfully");
                                        }
                                    });
                                }
                            });
                        } else {
                            console.error('error checking access token of user. Error');
                            reply({
                                code: 200,
                                success: false,
                                error: 'Invalid Access Token',
                                message: 'Invalid Access Token or email',
                                isMatching: false
                            });
                        }
                    });
                }
            });
        }
        execute(aFunc);
    },

    signOut: function(request, reply) {
        console.log('Sign Out Requested');

        var aFunc = function() {

            console.log('Sign Out Requested');

            console.log(request.auth.token);

            console.log(request.headers.authorization);

            let token = request.auth.token; //request.headers.authorization || request.auth.token;

            require('../index').invalidateToken(token, function(res) {

                console.log(res);

                reply(res || 'ERROR');
            });

        };

        execute(aFunc);

    },


    getMyFoodPreference: function(request, reply) {

        var aFunc = function() {

            reply({

                status: "Authentication verified and successful."
            })
        };

        execute(aFunc);
    },

    modifyMyFoodPreference: function(request, reply) {

        var aFunc = function() {

        };
        execute(aFunc);
    },

    changePassword: function(req, reply) {

        var aFunc = function() {

            let request = req;

            let payload = req.payload;
            UserModel.checkUniqueness(null, payload.email, function(err, user) {

                // console.error(err);
                //console.log(user);

                if (err) {

                    console.error('error checking uniqueness of User. Error' + err);

                    reply({

                        success: false,
                        error: err || 'Error checking User in database',
                        message_readable: request.i18n.__("Server error occurred while checking User in our records of registered Users. ")

                    }).code(500);
                } else if (user) {

                    //console.error('Admin already exists');

                    // console.log("Removing all active access tokens of User to invalidate all current sessions.");

                    UserModel.findOneAndUpdate({ _id: user._id }, { $set: { access_tokens: [] } }, null, function(erra, modAdmin) {

                        if (erra == null && modAdmin) {

                            console.log("All Active access token or sessions of Admin removed successfully");
                        } else {

                            console.error("Removing User's all currents sessiosn or access tokens failed due to error : ", erra);
                        }
                    });
                    var saltPassword = function(plainPwd) {
                        //console.log("password :", plainPwd);
                        if (plainPwd) {
                            helpers_generic.encryptPassword(plainPwd, 10, function(err, result) {

                                if (err) {

                                    reply({

                                            success: false,
                                            error: err,
                                            message: request.i18n.__("User password reset failed")
                                        }) //.code(302)
                                } else {

                                    hashedPwd = result;

                                    obj.password = hashedPwd;

                                    // console.log( obj);
                                    let forgotPassword = req.payload.action == 'forgot_password' ? true : false;
                                    UserModel.findOneAndUpdate({ email: req.payload.email }, { $set: { password: hashedPwd, access_tokens: null, forgotPassword: forgotPassword } }, { upsert: false, multi: false }, function(err, updatedUser) {

                                        if (updatedUser && err == null) {

                                            //console.log("Approaching mail sending operation");

                                            let rep = updatedUser.toObject(); //savedUser.toPublic();


                                            let mailData = {

                                                to: rep.email,
                                                data: {
                                                    username: rep.username,
                                                    plainPwd: plainPwd
                                                },
                                                //subject: req.i18n.__("Umahh- Reset Password"),
                                                subject: subject,
                                                text: content_text,
                                                html: content_html

                                            };

                                            Mailer.sendNonTemplateEmailUser(Mailer.emailTypes.USER_FORGOT_PASSWORD, mailData, function(err, result) {

                                                console.log(result ? result : err);

                                                var data = {}

                                                if (result && err == null) {

                                                    if (payload.action == 'forgot_password') {

                                                        data = {

                                                            forgot_password: true,
                                                            email_delivered: true
                                                        }
                                                    } else if (payload.action == 'reset_password') {

                                                        data = {

                                                            reset_password: true,
                                                            email_delivered: true
                                                        }
                                                    }

                                                    reply({

                                                        success: true,
                                                        data: data,
                                                        message: payload.action == 'reset_password' ? request.i18n.__("User password was reset successfully") : request.i18n.__("User password was reset successfully and sent via Email to User.")
                                                    }).code(200);

                                                } else {

                                                    reply({

                                                        success: true,
                                                        data: data,
                                                        message: request.i18n.__("User password was reset successfully but  Email notification failed.Please reset the password again")
                                                    }).code(200);
                                                }

                                            });

                                            //console.log("Updated details on Admin saved successfully");
                                        } else {
                                            reply({
                                                success: false,
                                                error: err ? err : request.i18n.__("Unknown server error occurred while updating User password"),
                                                message: request.i18n.__("User password reset failed")
                                            }).code(500);
                                        }
                                    });

                                }
                            });

                        }
                    }

                    var obj = user;

                    var hashedPwd = null;

                    var plainPwd = null;
                    var subject;
                    var locale = payload.hasOwnProperty("locale") == true ? payload.locale : (req.headers["language"] ? req.headers["language"] : appConfig._LOCALE.ENGLISH); //appConfig._LOCALE.ENGLISH;

                    var content_text = "\n Hello " + obj.first_name + ", \n Please use below mentioned access code to set new password. Please do not share your code others due to security concerns." +
                        "\n\n Your access code  is : " + plainPwd;

                    var content_html = "Hello <b>" + obj.first_name + "</b>," + "<br> Please use below mentioned password to access your account.</b>" +
                        "<br> Password : <b>" + plainPwd + "</b></br></br></br></br>" + " <a href='http://167.172.131.53/#/'> Click here to login </a>";

                    if (payload.action === 'forgot_password') {

                        var make_passwd = function(n, a) {
                            var index = (Math.random() * (a.length - 1)).toFixed(0);
                            return n > 0 ? a[index] + make_passwd(n - 1, a) : '';
                        };

                        var password = make_passwd(8, 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890');

                        payload.password = password;
                        plainPwd = password;

                        if (payload.hasOwnProperty("locale") == true && locale == appConfig._LOCALE.SPANISH) {
                            content_text = "\n Hola" + (obj.first_name ? obj.first_name : obj.username) + ", \n Utilice el código de acceso mencionado a continuación para establecer una nueva contraseña. Por favor, no comparta su contraseña con otros debido a problemas de seguridad." +
                                "\n\n Su código de acceso es: " + plainPwd;

                            content_html = "Hola <b>" + (obj.first_name ? obj.first_name : obj.username) + "</b>," + "<br>Utilice el código de acceso mencionado a continuación para establecer una nueva contraseña. No comparta su contraseña con otros debido a problemas de seguridad.</b>" +
                                "<br>Su código de acceso es: <b>" + plainPwd + "</b></br>"
                        } else {
                            subject = "Umahh- Forgot Password";
                            content_text = "\n Hello " + (obj.first_name ? obj.first_name : obj.username) + ", \n Please use below mentioned password to access your account." +
                                "\n\n Password : " + plainPwd;

                            content_html = "Hello <b>" + (obj.first_name ? obj.first_name : obj.username) + "</b>," + "<br><br> Please use below mentioned password to access your account.</b>" +
                                "<br> Password : <b>" + plainPwd + "</b><br><br><br>" + " <a href='http://167.172.131.53/#/'> Click here to login </a>";
                        }

                        saltPassword(plainPwd);
                    } else if (payload.action === 'reset_password') {

                        // check against old passowrd
                        //console.log("Started checking against old pwd and new pwd for RESET PASSWORD");
                        helpers_generic.matchPassword(payload.old_password, obj.password, function(err, isMatching) {

                            //console.log('err : ' + err + '\n is matching : ' + isMatching);

                            if (isMatching == false || err != null) {

                                //console.log("RESET PASSWORD operation failed");

                                return reply({

                                        success: false,
                                        error: err ? err : request.i18n.__("Access Code does not match."),
                                        message: request.i18n.__("Access Code does not match.")
                                    }) //.code(302)
                            } else if (isMatching == true) {

                                plainPwd = payload.new_password;

                                if (payload.hasOwnProperty("locale") == true && locale == appConfig._LOCALE.SPANISH) {

                                    content_text = "\n Hola" + (obj.first_name ? obj.first_name : obj.username) + ", \n Su contraseña se restablece correctamente. No comparta su contraseña con otras personas debido a problemas de seguridad.";

                                    content_html = "Hola <b>" + (obj.first_name ? obj.first_name : obj.username) + "</b>," + "<br>Su contraseña se restablece correctamente. No comparta su contraseña con otras personas debido a problemas de seguridad.</b>";
                                } else {
                                    subject = "Umahh- Reset Password";
                                    content_text = "\n Hello " + (obj.first_name ? obj.first_name : obj.username) + ", \n Your password is reset successfully. Please do not share your password with others due to security concerns.";

                                    content_html = "Hello <b>" + (obj.first_name ? obj.first_name : obj.username) + "</b>," + "<br><br> Your password is reset successfully. Please do not share your password with others due to security concerns.</b>";
                                }

                                saltPassword(plainPwd);
                            }
                        })
                    }
                } else {

                    return reply({
                            success: false,
                            error: request.i18n.__("User with email address not found"),
                            message_readable: request.i18n.__("User with email address does not exists"),
                            isMatching: false
                        }) //.code(302)

                }
            });

        }

        execute(aFunc);
    },
    getDetails: function getDetailsOfUser(request, reply) {

        setTimeout(function() {

                UserModel.findOne({ _id: request.params.userId }).populate('following_id')
                    /*                     .findOne({ _id: request.params.userId }).populate('country').populate('state').populate('city').populate('following_id') */
                    //.select('-__v -images -promotions -types -place_id -reference')
                    // .select('_id username first_name last_name mobile email money_spent hours role mobile address_full address landmark isFBUser dob expireDate admin')
                    .exec(function(err, user) {

                        console.log('inside mongoose operation.');

                        if (err) {

                            console.error(err);

                            reply({
                                success: false,
                                error: err,
                                message: "Error occurred getting details of user"
                            });
                        } else {

                            //console.log(merchant);

                            reply({
                                code: 200,
                                success: user != null ? true : false,
                                data: user != null ? user.toObject() : null,
                                message: 'User details retrieved successfully'
                            });


                        }

                    });
            },
            1);

        console.log('Execution reached out of block');
    },

    modify: function(request, reply) {

        var aFunc = function() {

            // console.log('modify user func :\n', request.payload);

            let authUser = helpers_generic.getCurrentAuthUser(); // Gets Authenticated user obtained through Validate fun() on root index.js
            // file via JWT auth validation


            if (authUser) {

                let options = {

                    new: true, // returns new modified object
                    setDefaultsOnInsert: true, // sets defaults values on insert
                    upsert: true
                };

                const objModify = request.payload;

                // objModify.locSearch = [objModify.lng, objModify.lat];
                // objModify.geometry = {
                //     "location": {
                //         "lat": objModify.lat,
                //         "lng": objModify.lng
                //     }
                // }
                objModify.isUpdated = 1;
                for (var key in objModify) {


                    authUser[key] = objModify[key];
                }

                authUser.save(function(err, modUser, numAffected) {

                    console.log(err, '\n', numAffected);

                    if (err && numAffected == 0) {

                        reply({
                            code: 401,
                            success: false,
                            message: err || 'Error updating User'
                        });
                    } else if (modUser) {

                        reply({
                            code: 200,
                            success: true,
                            message: "Profile updated successfully",
                            data: modUser

                        });
                    }
                });

            }

        };

        execute(aFunc);
    },

    trainingCheckStatus: function(request, reply) {
        var aFunc = function() {
            let authUser = helpers_generic.getCurrentAuthUser();
            if (authUser) {
                console.log('this is play load', request.payload);
                let options = {
                    new: true,
                    setDefaultsOnInsert: true,
                    upsert: true
                };
                if (request.payload.items == "checklist") {
                    TrainingModel
                        .findOne({
                            user_id: authUser._id,
                            _id: request.payload.trainingId
                        })
                        .select('total_spent_money logData checklist')
                        .exec(function(err, trainingstatus) {
                            for (var i = 0; i < trainingstatus.checklist.length; i++) {
                                if (trainingstatus.checklist[i]._id == request.payload._id) {
                                    trainingstatus.checklist[i].status = request.payload.status;
                                }
                            }
                            trainingstatus.save(function(err, checkUpdate, numAffected) {
                                if (err && numAffected == 0) {
                                    reply({
                                        success: false,
                                        error: err || 'Error updating User'
                                    });
                                } else if (checkUpdate) {
                                    reply({

                                        success: true,
                                        data: checkUpdate,
                                        message: 'Check list Updated successfully'
                                    });
                                }
                            });
                        });
                } else {
                    TrainingModel
                        .findOne({
                            user_id: authUser._id,
                            _id: request.payload.trainingId
                        })
                        .select('total_spent_money logData groundSchool')
                        .exec(function(err, trainingstatus) {
                            for (var i = 0; i < trainingstatus.groundSchool.length; i++) {
                                if (trainingstatus.groundSchool[i]._id == request.payload._id) {
                                    trainingstatus.groundSchool[i].status = request.payload.status;
                                }
                            }
                            trainingstatus.save(function(err, groundSchoolUpdate, numAffected) {
                                if (err && numAffected == 0) {
                                    reply({
                                        success: false,
                                        error: err || 'Error updating User'
                                    });
                                } else if (groundSchoolUpdate) {
                                    reply({

                                        success: true,
                                        data: groundSchoolUpdate,
                                        message: 'Ground Updated successfully'
                                    });
                                }
                            });
                        });
                }
            }
        };
        execute(aFunc);
    },

    modifyProfilePic: function(request, reply) {

        var aFunc = function() {

            var data = request.payload;

            if (data.image && data.image.size !== 0) {

                let authUser = helpers_generic.getCurrentAuthUser(); // Gets Authenticated user obtained through Validate fun() on root index.js
                // file via JWT auth validation
                console.log('current auth user :\n', authUser);

                var name = data.image.hapi.filename;
                var newExtension = Path.extname(data.image.hapi.filename);
                let filename = 'user_dp_' + authUser._id + newExtension;
                let path = 'Media/Images/Users/' + filename;

                console.log(name, '\n', filename, '\n', path);

                let deletePath = null;

                if (data.hasOwnProperty("path") == true) {

                    deletePath = data.path.replace("/public/images/", "./Media/Images/");
                }


                helpers_generic.saveImageToPath(data.image, filename, path, '/public/images/Users/', function(err, message, result) {

                    console.log('inside [saveImageToPath] callback function');
                    console.log('message : ' + message);
                    console.log('error : ' + err);

                    console.log('sending Reply to client');

                    if (result != null) {

                        console.log(result);

                        console.log(authUser._id);

                        ////

                        let options = {

                            new: true, // returns new modified object
                            setDefaultsOnInsert: true // sets defaults values on insert

                        };

                        UserModel.findOneAndUpdate({ _id: authUser._id }, { avtar: result.url }, options, function(err, user) {

                            if (err) {

                                console.error(err);

                                reply({

                                    success: false,
                                    error: err
                                });

                            } else {

                                console.log('Merchant logo modified successfully');

                                reply({
                                    success: user == null ? false : true,
                                    data: user == null ? {} : user.toObject(),
                                });

                                if (data.hasOwnProperty("path") == false) {

                                    return;
                                }

                                setTimeout(function() {

                                    helpers_generic.deleteFile(deletePath, function(err) {

                                        if (err) {

                                            console.log('problem deleting file at path' + data.path + '\n Error : ' + err);
                                        } else {

                                            console.log('successfully deleted file at path' + data.path);
                                        }
                                    });

                                }, 1);
                            }
                        });

                        ////

                        console.log('Image received and updated successfully.');

                    }


                });
            } else {
                reply({
                    success: false,
                    error: 'No Image Data received.'
                }).code(400);
            }
        };

        execute(aFunc)
    },

    addNewTable: function(request, reply) {

        var aFunc = function() {

            var _payload = request.payload;

            _payload.password = _payload.tableName + '#' + _payload.marketID;
            _payload.email = _payload.tableName + '@' + _payload.marketID + '.yz';
            _payload.username = _payload.tableName;

            console.log("Payload string", JSON.stringify(_payload));

            let payload = _payload; //request.payload;

            const plainTextPwd = _payload.password;

            UserModel.checkUniqueness(payload.username, payload.email, function(err, user) {

                console.log(err);
                console.log(user);

                if (err) {

                    console.error('error checking uniqueness of Table. Error' + err);

                    reply("OK");
                } else if (user) {

                    if (payload.username === user.username) {

                        console.error('Table already exists with username ----:' + user.username);
                    } else if (payload.email === user.email) {

                        console.error('Table already exists with email address ----: ' + user.email);
                    }

                    return reply({

                        error: "Table Already Exists",
                        message: "Table Already Exists with details provided.",
                        success: false
                    }).code(400);

                    //console.error('user already exists with '+username +'and/or'+ emailaddress);

                } else {

                    console.log("Good to Go insert new Table.");

                    var obj = payload;

                    //let token  = require('../index').generateToken({pwd:payload.username, email: payload.email});

                    //obj.access_token= token;

                    obj.createdAt = Date.now();

                    var hashedPwd = null;

                    if (payload.hasOwnProperty("password")) {

                        helpers_generic.encryptPassword(payload.password, 10, function(err, result) {

                            if (err) {

                                reply({

                                    success: false,
                                    error: err
                                })
                            } else {

                                hashedPwd = result;

                                obj.password = hashedPwd;

                                obj.address = {

                                    line1: payload.addressline_1,
                                    line2: payload.addressline_2,
                                    zip: payload.zipcode,
                                    landmark: payload.landmark
                                };

                                console.log(obj);

                                var newUser = new UserModel(obj);

                                console.log(newUser);

                                newUser.save(function(err, savedUser, rowsAffected) {

                                    if (err || rowsAffected == 0) {
                                        console.error(err || 'Error Saving User.');
                                        reply(err || 'Error Saving User.');
                                    } else {

                                        let rep = savedUser.toObject(); //savedUser.toPublic();

                                        let table_id = savedUser._id;

                                        _payload.tableID = table_id;

                                        let QRCode_filePath = 'Media/Images/QRCodes/' + table_id + '.png';

                                        let QRCode_filePath_public = '/public/images/QRCodes/' + table_id + '.png';

                                        let obj = {
                                            username: _payload.tableName,
                                            password: plainTextPwd,
                                            marketName: _payload.marketName,
                                            marketID: _payload.marketID
                                        };

                                        QRGenrator.toFile(QRCode_filePath, JSON.stringify(obj), {
                                            //color: {
                                            //    dark: '#00F',  // Blue dots
                                            //    light: '#0000' // Transparent background
                                            //},
                                            version: 10
                                        }, function(err) {
                                            if (err) {

                                                reply({
                                                    error: err,
                                                    success: false,
                                                    message: 'Problem generating QR code'
                                                });
                                            } else {

                                                console.log('done');
                                                reply({

                                                    success: true,
                                                    data: rep,
                                                    qrcode: QRCode_filePath_public
                                                });

                                                console.log("New Table saved successfully");
                                            }

                                            //reply({
                                            //    path : QRCode_filePath
                                            //});
                                        });

                                        //reply({
                                        //
                                        //    success :   true,
                                        //    data    :   rep,
                                        //    qrcode  :   QRCode_filePath
                                        //});
                                        //
                                        //console.log("New Table saved successfully");
                                    }
                                });
                            }
                        });
                    } else {

                        console.log('Payload does not have any password key.');

                        reply({

                            success: false,
                            error: 'Missing password field.'
                        });
                    }
                }
            });

        };

        execute(aFunc);

    },
    getCountries: function getCountries(request, reply) {

        var aFunc = async function() {

            const countryData = await CountriesModel.find();

            if (!countryData) {
                reply({
                    success: false,
                    error: err
                });
            } else {
                reply({
                    code: 200,
                    success: true,
                    countries: countryData
                });
            }

        };

        execute(aFunc);

    },
    getStatesByCountry_id: function getStatesByCountry_id(request, reply) {

        var aFunc = async function() {

            const statesData = await StatesModel.find({ "country_id": request.params.country_id });
            console.log('hello', request.params.country_id);
            if (!statesData) {
                reply({
                    success: false,
                    error: err
                });
            } else {
                reply({
                    code: 200,
                    success: true,
                    states: statesData
                });
            }

        };

        execute(aFunc);

    },

    getCitiesByState_id: function getCitiesByState_id(request, reply) {

        var aFunc = async function() {

            const citiesData = await CitiesModel.find({ "state_id": request.params.state_id });

            if (!citiesData) {
                reply({
                    success: false,
                    error: err
                });
            } else {
                reply({
                    code: 200,
                    success: true,
                    states: citiesData
                });
            }

        };

        execute(aFunc);

    },
    sendSmsPhone: function sendSmsPhone(req, reply) {

        var aFunc = async function() {
            const userData = await UserModel.findOne({ _id: req.params.userId }).populate('country');
            if (!userData) {
                reply({

                    success: false,
                    status: 200,
                    data: 'User detail not found'
                });

            } else {
                const randomToken = Math.floor(1000 + Math.random() * 9000);
                // const phoneCode = userData.country.phoneCode;
                const mobile = userData.mobile;
                const otp = `Hi, welcome umahh ${randomToken}`;
                const userDataSet = await UserModel.update({ _id: req.params.userId }, { $set: { "randomToken": randomToken } });

                var params = {

                    'src': 'YUMMZ', // Sender's phone number with country code
                    'dst': mobile, //req.params.destination, // Receiver's phone Number with country code
                    'text': otp, // Your SMS Text Message - English
                    //'url' : "https://yummzapp.com:4001",
                    'method': 'GET'
                }

                plivo_gateway.send_message(params, function(status, response) {

                    var _success = false;

                    if (status >= 200 && status < 300) {

                        console.log("SMS sent successfully");

                        _success = true;
                    }
                    reply({

                        success: _success,
                        status: status,
                        data: response
                    });
                });
            }

        };

        execute(aFunc);

    },

    checkSmsPhoneOtp: function checkSmsPhoneOtp(req, reply) {

        var aFunc = async function() {
            const userDataSet = await UserModel.findOneAndUpdate({ "randomToken": req.params.Otp }, { $set: { "phoneVerification": 1 } }, { new: true });
            if (!userDataSet) {
                reply({

                    success: false,
                    status: 200,
                    data: 'User detail not found'
                });

            } else {

                reply({
                    message: 'Your email is verified',
                    success: true,
                    status: 200,
                    data: userDataSet
                });


            }

        };

        execute(aFunc);

    },

    mosqueAndBusinessActive: function(req, reply) {

        var aFunc = function() {

            let request = req;

            let payload = req.payload;

            UserModel.findOne({ "_id": payload._id }, function(err, user) {

                console.error(err);
                if (err) {

                    console.error('error checking uniqueness of User. Error' + err);

                    reply({

                        success: false,
                        error: err || 'Error checking User in database',
                        message: request.i18n.__("Server error occurred while checking User in our records of registered Users. ")

                    }).code(500);
                } else if (user) {

                    //console.error('Admin already exists');

                    // console.log("Removing all active access tokens of User to invalidate all current sessions.");

                    UserModel.findOneAndUpdate({ _id: user._id }, { $set: { access_tokens: [] } }, null, function(erra, modAdmin) {

                        if (erra == null && modAdmin) {

                            console.log("All Active access token or sessions of Admin removed successfully");
                        } else {

                            console.error("Removing User's all currents sessiosn or access tokens failed due to error : ", erra);
                        }
                    });

                    var saltPassword = function(plainPwd) {

                        //console.log("password :", plainPwd);

                        if (plainPwd) {

                            helpers_generic.encryptPassword(plainPwd, 10, function(err, result) {

                                if (err) {

                                    reply({

                                            success: false,
                                            error: err,
                                            message: request.i18n.__("User password reset failed")
                                        }) //.code(302)
                                } else {

                                    hashedPwd = result;

                                    obj.password = hashedPwd;

                                    //console.log(obj);

                                    UserModel.findOneAndUpdate({ _id: req.payload._id }, { $set: { password: hashedPwd, access_tokens: null, vefication: req.payload.status } }, { upsert: false, multi: false }, function(err, updatedUser) {

                                        if (updatedUser && err == null) {
                                            let rep = updatedUser.toObject(); //savedUser.toPublic();
                                            //console.log("Approaching mail sending operation", rep.email);
                                            if (rep.vefication == 0) {

                                                let mailData = {

                                                    to: rep.email,
                                                    data: {
                                                        username: rep.email,
                                                        plainPwd: plainPwd,
                                                    },
                                                    subject: req.i18n.__("Umahh- Reset Password"),
                                                    text: content_text,
                                                    html: content_html

                                                };

                                                Mailer.emailActiveUserResetPassword(Mailer.emailTypes.USER_ACTIVE_RESET_PASSWORD, mailData, function(err, result) {

                                                    console.log(result ? result : err);

                                                    var data = {}

                                                    if (result && err == null) {

                                                        data = {

                                                            password: true,
                                                            email_delivered: true
                                                        }

                                                        reply({
                                                            code: 200,
                                                            success: true,
                                                            data: data,
                                                            message: request.i18n.__("Activation successfully and sent via Email to User.")
                                                        });

                                                    } else {

                                                        reply({

                                                            success: true,
                                                            data: data,
                                                            message: request.i18n.__("Activation successfully but Email notification failed.Please activation again")
                                                        }).code(200);
                                                    }

                                                });

                                            } else {

                                                reply({

                                                    success: true,
                                                    data: 'data',
                                                    message: request.i18n.__("Deactivation successfully.")
                                                }).code(200);


                                            }

                                            //console.log("Updated details on Admin saved successfully");
                                        } else {
                                            reply({
                                                success: false,
                                                error: err ? err : request.i18n.__("Unknown server error occurred while updating User password"),
                                                message: request.i18n.__("Activation reset failed")
                                            }).code(500);
                                        }
                                    });

                                }
                            });

                        }
                    }

                    var obj = user;

                    var hashedPwd = null;

                    var plainPwd = null;

                    var locale = payload.hasOwnProperty("locale") == true ? payload.locale : (req.headers["language"] ? req.headers["language"] : appConfig._LOCALE.ENGLISH); //appConfig._LOCALE.ENGLISH;

                    var content_text = "\n Hello " + obj.username + ", \n Please use below mentioned access code to set new password. Please do not share your code others due to security concerns." +
                        "\n\n Your access code  is : " + plainPwd;

                    var content_html = "Hello <b>" + obj.username + "</b>," + "<br> Please use below mentioned access code to set new password. Please do not share your password others due to security concerns.</b>" +
                        "<br>Your access code is : <b>" + plainPwd + "</b></br>";

                    var make_passwd = function(n, a) {
                        var index = (Math.random() * (a.length - 1)).toFixed(0);
                        return n > 0 ? a[index] + make_passwd(n - 1, a) : '';
                    };

                    var password = make_passwd(8, 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890');

                    payload.password = password;
                    plainPwd = password;

                    if (payload.hasOwnProperty("locale") == true && locale == appConfig._LOCALE.SPANISH) {

                        content_text = "\n Hola" + (obj.first_name ? obj.first_name : obj.username) + ", \n Utilice el código de acceso mencionado a continuación para establecer una nueva contraseña. Por favor, no comparta su contraseña con otros debido a problemas de seguridad." +
                            "\n\n Su código de acceso es: " + plainPwd;

                        content_html = "Hola <b>" + (obj.first_name ? obj.first_name : obj.username) + "</b>," + "<br>Utilice el código de acceso mencionado a continuación para establecer una nueva contraseña. No comparta su contraseña con otros debido a problemas de seguridad.</b>" +
                            "<br>Su código de acceso es: <b>" + plainPwd + "</b></br>"
                    } else {

                        content_text = "\n Hello " + (obj.email ? obj.email : obj.username) + ", \n Please use below mentioned access code to set new password. Please do not share your code others due to security concerns." +
                            "\n\n Password : " + plainPwd;

                        content_html = "Hello <b>" + (obj.email ? obj.email : obj.username) + "</b>,<br><br> Congratulation, your mosque is ready to go. <a href='http://167.172.131.53/#/'> Click here to login and set up the Mosque. </a><br> Please use email ID and password to access your account.</b><br><br> Password : <b>" + plainPwd + "</b></br>";
                    }

                    saltPassword(plainPwd);


                } else {

                    return reply({
                            success: false,
                            error: request.i18n.__("User with email address not found"),
                            message: request.i18n.__("User with email address does not exists"),
                            isMatching: false
                        }) //.code(302)

                }
            });

        }

        execute(aFunc);
    },

    mosqueIsSelected: function(req, reply) {

        var aFunc = async function() {

            let request = req;

            let payload = req.payload;
            // console.log('hdjhasdhfwqhfohofhoewfhowhfohfohfohfow',req.payload.user_id);

            let userdata = await UserModel.findOne({ _id: req.payload.user_id });
            let newObject = userdata;
            newObject.mosque_id = req.payload.mosque_id;
            newObject.save();
            if (userdata) {

                let mosquedata = await UserModel.findOneAndUpdate({ _id: req.payload.mosque_id }, { $set: { isSelect: req.payload.isSelect } }, { new: true });
                if (mosquedata) {
                    reply({

                        success: true,
                        data: mosquedata,
                        message: "Mosque selected successfully"
                    }).code(200);
                } else {
                    reply({

                        success: true,
                        data: 'data',
                        message: "mosque not found"
                    }).code(401);
                }
            } else {

                reply({

                    success: true,
                    data: 'data',
                    message: "user not found"
                }).code(401);
            }

        }

        execute(aFunc);
    },

    getAllCategory: function getAllCategory(request, reply) {

        var aFunc = function() {

            CategoryModel.find({}, function(err, arrCategory) {

                if (err) {

                    reply({
                        code: 401,
                        success: false,
                        error: err
                    });
                } else {

                    reply({
                        code: 200,
                        success: true,
                        data: arrCategory
                    });
                }

            })

        };

        execute(aFunc);

    },

    searchNearBy: function(request, reply) {

        var aFunc = function() {

            var limit = request.params.limit || 10;

            // get the max distance or set it to 8 kilometers
            var maxDistance = request.params.radius || 8;

            /*            UserModel.geoNear([request.params.longitude, request.params.latitude],
                            { maxDistance : maxDistance/6373, spherical : true, distanceMultiplier : 6373 },
                            function(err, docs, statistics){

                                console.log( statistics);

                                if(docs && docs.length > 0){

                                    let output  =   docs.map(function(element){

                                        return {

                                            // merchant    :   {
                                            merchant_id     :   element.obj._id,
                                            name            :   element.obj.name,
                                            vicinity        :   element.obj.vicinity,
                                            formatted_address:  element.obj.formatted_address,
                                            rating          :   element.obj.rating,
                                            icon            :   element.obj.icon,
                                            website         :   element.obj.website,
                                            geo         :   {
                                                distance    :   parseFloat(element.dis.toPrecision(5)),
                                                location    :   element.obj.geometry.location
                                            },
                                            open_now        :   element.obj.open_now

                                            // }
                                        }
                                    });

                                    // console.log(output);

                                    reply({

                                        success     :   true,
                                        data        :   output,//docs,
                                        message     :   'Successfully retrieved nearby merchants'
                                    });
                                }
                                else if (err) {

                                    console.error(err);
                                    return sendErrorReply(err, 'Error occurred getting nearby merchants', 400,reply);
                                }
                                else if(!docs || docs.length == 0){

                                    //return sendErrorReply('Error occurred getting nearby merchants', 'No Merchant found around.',404,reply);

                                    reply({

                                        success     :   true,
                                        data        :   [],//docs,
                                        message     :   'No Merchant found around.'
                                    });
                                }

                            });*/
            /*             var limit = request.params.limit || 10;

                        // get the max distance or set it to 8 kilometers
                        var maxDistance = request.params.radius || 8
                        // we need to convert the distance to radians
                        // the raduis of Earth is approximately 6371 kilometers
                       // maxDistance /= 6371;

                        console.log("max distance radians :", maxDistance);

                       // get coordinates [ <longitude> , <latitude> ]
                        var coords = [];
                        coords[0] = request.params.longitude;
                        coords[1] = request.params.latitude;
                        // find a location
                        UserModel.find({
                            role: 'mosque',
                            isUpdated:'1',
                            locSearch: {
                                $near: coords,
                                $maxDistance:maxDistance,
                                //$spherical: true
                            },
                       }).populate('country').populate('state').populate('city')
                              .limit(limit).exec(function(err, docs) {

                              if(docs && docs.length > 0){

                                  return reply({

                                      success     :   true,
                                      data        :   docs,
                                      message     :   'Successfully retrieved nearby mosque'
                                  });
                              }
                              else if (err) {

                                  return reply({
                                    error: err,
                                    message:'Error occurred getting nearby mosque',
                                    code: 400
                                  });
                              }
                              else{

                                  return reply({
                                    message:'No mosque found around.',
                                    code: 404
                                  });
                              }


                          }); */
            /*             UserModel.aggregate([
                            { $geoNear: {
                                near: { type: "Point", coordinates: [ 75.89564 , 22.750741 ] },
                                distanceField: "dist.calculated",
                                maxDistance: 1000 ,
                                query: { role: "mosque" },
                                distanceField : "distance",
                                spherical: true
                             }}
                         ], function(err, result, option) {
                            console.log('err', err);
                            console.log('heloooo', result);
                      }); */

            // var coords = [];
            // coords[0] = request.params.longitude;
            // coords[1] = request.params.latitude;
            // UserModel.aggregate([{
            //     $geoNear: {
            //         near: {
            //             type: "Point",
            //             coordinates: coords
            //         },
            //         spherical: true,
            //         distanceField: 'distance',
            //         maxDistance: maxDistance,
            //         distanceMultiplier: 1 / 1000,
            //         "query": { role: "mosque", isUpdated: 1 },
            //     }
            // }], function(err, result) {
            //     if (result && result.length > 0) {
            //         const distanceArray = [];
            //         result.forEach(element => {
            //             const newDistance = element.distance;
            //             var ObjectData = {
            //                 "_id": element._id,
            //                 "email": element.email,
            //                 "role": element.role,
            //                 "username": element.username,
            //                 "locSearch": element.locSearch,
            //                 "prayer_translate": element.prayer_translate,
            //                 "quaran_translate": element.quaran_translate,
            //                 "aap_language": element.aap_language,
            //                 "notification": element.notification,
            //                 "geometry": element.geometry,
            //                 "isEmailVerify": element.isEmailVerify,
            //                 "randomToken": element.randomToken,
            //                 "updatedAt": element.updatedAt,
            //                 "deletedAt": element.deletedAt,
            //                 "createdAt": element.createdAt,
            //                 "sessions": element.sessions,
            //                 "phoneVerification": element.phoneVerification,
            //                 "vefication": element.vefication,
            //                 "zipCode": element.zipCode,
            //                 "mosque_id": element.mosque_id,
            //                 "category": element.category,
            //                 "city": element.city,
            //                 "state": element.state,
            //                 "country": element.country,
            //                 "street_address": element.street_address,
            //                 "lng": element.lng,
            //                 "lat": element.lat,
            //                 "avtar": element.avtar,
            //                 "businessType": element.businessType,
            //                 "isSelect": element.isSelect,
            //                 "isFBUser": element.isFBUser,
            //                 "nameContactPerson": element.nameContactPerson,
            //                 "access_token": element.access_token,
            //                 "isLoggedIn": element.isLoggedIn,
            //                 "mobile": element.mobile,
            //                 "password": element.password,
            //                 "__v": element.__v,
            //                 "first_name": element.first_name,
            //                 "description_service": element.description_service,
            //                 "isUpdated": element.isUpdated,
            //                 "associates_id": element.associates_id,
            //                 "following_id": element.following_id,
            //                 "timezone": element.timezone,
            //                 "distance": element.distance.toFixed(2)
            //             }
            //             distanceArray.push(ObjectData);
            //         });
            //         return reply({
            //             code: 200,
            //             success: true,
            //             data: distanceArray,
            //             message: 'Successfully retrieved nearby mosque'
            //         });
            //     } else if (err) {
            //         return reply({
            //             data: [],
            //             error: err,
            //             message: 'Error occurred getting nearby mosque',
            //             code: 400
            //         });
            //     } else {
            //         return reply({
            //             data: [],
            //             message: 'No mosque found around.',
            //             code: 404
            //         });
            //     }
            // });
            UserModel.find({ role: 'mosque', isUpdated: '1' }).exec(function(err, distanceArray) {
                if (err) {
                    reply({
                        data: [],
                        error: err,
                        message: 'Error occurred getting nearby mosque',
                        code: 400
                    });
                } else {
                    reply({
                        code: 200,
                        success: true,
                        data: distanceArray,
                        message: 'Successfully retrieved nearby mosque'
                    });
                }
            });
        }

        execute(aFunc);


    },
    searchMosque: function searchMosque(request, reply) {
        var payload = request.payload;
        var aFunc = async function() {
            /* UserModel.find({username : {$regex: new RegExp('^' + payload.searchmosque.toLowerCase(), 'i')},username : {$regex: new RegExp('^' + payload.searchmosque.toUpperCase(), 'i')},role:'mosque'}, function(err, arrMosque){

                 if(err){

                     reply({

                         success :   false,
                         error   :   err
                     });
                 }
                 else{

                     reply({
                         code:200,
                         success :   true,
                         data   :   arrMosque
                     });
                 }

             });*/

            UserModel.find({ $or: [{ 'username': { $regex: payload.searchmosque, $options: 'i' }, username: { $regex: new RegExp('^' + payload.searchmosque.toUpperCase(), 'i') } }, { 'zipCode': payload.searchmosque }, { 'city': { $regex: payload.searchmosque, $options: 'i' }, city: { $regex: new RegExp('^' + payload.searchmosque.toUpperCase(), 'i') } }, { 'state': { $regex: payload.searchmosque, $options: 'i' }, state: { $regex: new RegExp('^' + payload.searchmosque.toUpperCase(), 'i') } }], $and: [{ 'role': 'mosque' }, { "isUpdated": '1' }] }).exec(function(err, arrMosque) {

                if (err) {

                    reply({

                        success: false,
                        error: err
                    });
                } else {

                    reply({
                        code: 200,
                        success: true,
                        data: arrMosque
                    });
                }

            });


            /* let  getNewObjectData = await UserModel.find({role:'mosque'}).populate('city').populate('state').populate('country');

               if(getNewObjectData){

                   getNewObjectData.find({username : {$regex: new RegExp('^' + payload.searchmosque.toLowerCase(), 'i')},username : {$regex: new RegExp('^' + payload.searchmosque.toUpperCase(), 'i')},role:'mosque'}, function(err, arrMosque){

                   if(err){

                       reply({

                           success :   false,
                           error   :   err
                       });
                   }
                   else{

                       reply({
                           code:200,
                           success :   true,
                           data   :   arrMosque
                       });
                   }

               });
                   }*/

        };

        execute(aFunc);

    },
    searchBusiness: function searchBusiness(request, reply) {
        var payload = request.payload;
        var aFunc = async function() {

            UserModel.find({ $or: [{ 'username': { $regex: payload.searchbusiness, $options: 'i' }, username: { $regex: new RegExp('^' + payload.searchbusiness.toUpperCase(), 'i') } }, { 'zipCode': payload.searchbusiness }], $and: [{ 'role': 'business' }, { "isUpdated": '1' }] })
                .populate("city").populate("state").populate("country")
                .exec(function(err, arrBusiness) {

                    if (err) {

                        reply({

                            success: false,
                            error: err
                        });
                    } else {

                        reply({
                            code: 200,
                            success: true,
                            data: arrBusiness
                        });
                    }

                });

        };

        execute(aFunc);

    },
    emailVerify: function emailVerify(request, reply) {
        var payload = request.payload;
        var aFunc = async function() {
            UserModel.findOne({ email: payload.email }, function(err, arrMosque) {

                if (err) {

                    reply({

                        success: false,
                        error: err
                    });
                } else {

                    reply({
                        code: 200,
                        success: true,
                        data: arrMosque
                    });
                }

            });

        };

        execute(aFunc);

    },
    getByCategoryBusinessList: function getByCategoryBusinessList(request, reply) {
        var payload = request.payload;
        var aFunc = async function() {
            // find({$and:[{"category":ObjectId("5ca4b2a953d69f32b25a54e5")},{"businessType":"Organization"}]})
            UserModel.find({ $and: [{ "category_id": payload.category_id }, { "businessType": payload.businessType }, { "isUpdated": '1' }] })
                .populate("city").populate("state").populate("country").populate("category")
                .exec(function(err, arrBusiness) {

                    if (err) {

                        reply({

                            success: false,
                            error: err
                        });
                    } else {

                        reply({
                            code: 200,
                            success: true,
                            data: arrBusiness
                        });
                    }

                });

        };

        execute(aFunc);

    },
    deleteUser: function(request, reply) {

        const aFunc = async function() {

            try {

                //delete mosque News by News id
                const deleteData = await UserModel.remove({ _id: request.params._id });

                return reply({
                    code: 200,
                    success: true,
                    data: deleteData,
                    message: "Admin use deleted successfully."
                }).code(200);

            } catch (error) {
                return reply({
                    success: false,
                    message: "admin user not deleted"
                }).code(500);
            }

        };
        execute(aFunc);
    },

    saveData: saveData

};