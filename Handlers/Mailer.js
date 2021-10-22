/**
 * Created by rv2016 on 04/04/17.
 */
'use strict';
const nodemailer = require('nodemailer');
const templater = require('nunjucks');


const k_templates = {

    USER_WELCOME: 'welcome.html',
    USER_ORDER_PLACEMENT: 'test-1.html',
    USER_FORGOT_PASSWORD: 'forgot-password.html',
    USER_ACTIVE_RESET_PASSWORD: 'active-reset-password.html'
}


var PATH_TO_TEMPLATES = './Web/Templates/Email/'; ///Welcome' ;
templater.configure(PATH_TO_TEMPLATES, {
    autoescape: true
});

/*var smtpConfig = {
    host: 'mail.yummzapp.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'root',
        pass: 'Global@77'
    },
    tls:{
        rejectUnauthorized: false
    }
};*/
/*var smtpConfig = {
    host: 'smtp.mailtrap.io',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'd6d59aa93ccb38',
        pass: 'f4d2b7cc6d28f1'
    },
    tls:{
        rejectUnauthorized: false
    }
};

let transporter = nodemailer.createTransport(smtpConfig);*/
let transporter = nodemailer.createTransport({
    host: "smtp.googlemail.com",
    port: 465,
    auth: {
        user: "rajeshdigiprima2018@gmail.com",
        pass: "cqfenhibdlhwsglq"
    }
});


var initializeMailer = function() {

    if (transporter) {

        console.log("Mail Transporter already available");
        return transporter;
    } else {

        console.log("Creating New Mail Transporter");

        let transporter = nodemailer.createTransport({
            service: 'aviationapp',
            auth: {
                user: 'root',
                pass: 'Global@77'
            }
        });

        return transporter;

    }
}

var sendEmail = function(emailType, mailData, callback) {


    var asyncFunc = function() {

        if (!mailData) {

            mailData = {

                // to  :   'rachit.vyas@globalsysinfo.com',
                subject: 'Welcome',
                text: 'Welcome Aboard !!',
                html: null
            }
        }
        let context = {

            data: mailData.data
        };

        let newHtml = templater.render(emailType, context, function(err, res) {

            if (!err && res != null) {

                // setup email data with unicode symbols
                var mailOptions = {
                    from: '"No-Reply Umahh" <rajeshdigiprima2018@gmail.com>', // sender address
                    to: mailData.to, // list of receivers
                    subject: mailData.subject ? mailData.subject : 'Welcome', // Subject line
                    text: mailData.text ? mailData.text : 'Hello User!', // plain text body
                    html: res ? res : '<b>Hello world ?</b>' // html body
                        //html: mailData.html ? mailData.html : '<b>Hello world ?</b>' // html body
                };

                if (mailData.hasOwnProperty("cc") == true) {

                    mailOptions.cc = mailData.cc;
                }

                // send mail with defined transport object

                let transporter = initializeMailer();

                if (transporter) {

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error(error);
                            return (callback(error, null));
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);

                        let resMessage = 'Message ID : ' + info.messageId + ' sent: ' + info.response;

                        return (callback(null, resMessage));
                    });
                } else {

                    console.error("Mail Transporter is NULL");

                    return callback("Mail Transporter is NULL", null);


                }
            } else {

                console.error(err);
                return callback(err, null);
            }
        });

    }

    setTimeout(asyncFunc, 10);

}

var sendNonTemplateEmail = function(mailData, callback) {

    var asyncFunc = function() {

        // setup email data with unicode symbols
        var mailOptions = {
            from: '"No-Reply Umahh" <sotam1992@gmail.com>', // sender address
            to: mailData.to, // list of receivers
            subject: mailData.subject ? mailData.subject : 'Welcome', // Subject line
            text: mailData.text ? mailData.text : 'Hello User!', // plain text body
            html: mailData.html ? mailData.html : '<b>Hello world ?</b>' // html body

        };


        // send mail with defined transport object

        let transporter = initializeMailer();

        if (transporter) {

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return (callback(error, null));
                }
                console.log('Message %s sent: %s', info.messageId, info.response);

                let resMessage = 'Message ID : ' + info.messageId + ' sent: ' + info.response;

                return (callback(null, resMessage));
            });
        } else {

            console.error("Mail Transporter is NULL");

            return callback("Mail Transporter is NULL", null);

        }
    }

    setTimeout(asyncFunc, 5);
}
var sendNonTemplateEmailUser = function(emailType, mailData, callback) {

    var asyncFunc = function() {

        if (!mailData) {

            mailData = {
                // to  :   'rachit.vyas@globalsysinfo.com',
                subject: 'Welcome',
                text: 'Welcome Aboard !!',
                html: null
            }
        }
        let context = {

            data: mailData.data
        };

        let newHtml = templater.render(emailType, context, function(err, res) {

            if (!err && res != null) {

                // setup email data with unicode symbols
                var mailOptions = {
                    from: '"No-Reply Umahh" <rajeshdigiprima2018@gmail.com>', // sender address
                    to: mailData.to, // list of receivers
                    subject: mailData.subject ? mailData.subject : 'Welcome', // Subject line
                    text: mailData.text ? mailData.text : 'Hello User!', // plain text body
                    html: res ? res : '<b>Hello world ?</b>' // html body
                        //html: mailData.html ? mailData.html : '<b>Hello world ?</b>' // html body
                };

                if (mailData.hasOwnProperty("cc") == true) {

                    mailOptions.cc = mailData.cc;
                }

                // send mail with defined transport object

                let transporter = initializeMailer();

                if (transporter) {

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error(error);
                            return (callback(error, null));
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);

                        let resMessage = 'Message ID : ' + info.messageId + ' sent: ' + info.response;

                        return (callback(null, resMessage));
                    });
                } else {

                    console.error("Mail Transporter is NULL");

                    return callback("Mail Transporter is NULL", null);


                }
            } else {

                console.error(err);
                return callback(err, null);
            }
        });

    }

    setTimeout(asyncFunc, 10);
}
var emailActiveUserResetPassword = function(emailType, mailData, callback) {

    var asyncFunc = function() {

        if (!mailData) {

            mailData = {
                // to  :   'rachit.vyas@globalsysinfo.com',
                subject: 'Welcome',
                text: 'Welcome Aboard !!',
                html: null
            }
        }
        let context = {

            data: mailData.data
        };

        let newHtml = templater.render(emailType, context, function(err, res) {

            if (!err && res != null) {

                // setup email data with unicode symbols
                var mailOptions = {
                    from: '"No-Reply Umahh" <rajeshdigiprima2018@gmail.com>', // sender address
                    to: mailData.to, // list of receivers
                    subject: mailData.subject ? mailData.subject : 'Welcome', // Subject line
                    text: mailData.text ? mailData.text : 'Hello User!', // plain text body
                    html: res ? res : '<b>Hello world ?</b>' // html body
                        //html: mailData.html ? mailData.html : '<b>Hello world ?</b>' // html body
                };

                if (mailData.hasOwnProperty("cc") == true) {

                    mailOptions.cc = mailData.cc;
                }

                // send mail with defined transport object

                let transporter = initializeMailer();

                if (transporter) {

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error(error);
                            return (callback(error, null));
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);

                        let resMessage = 'Message ID : ' + info.messageId + ' sent: ' + info.response;

                        return (callback(null, resMessage));
                    });
                } else {

                    console.error("Mail Transporter is NULL");

                    return callback("Mail Transporter is NULL", null);


                }
            } else {

                console.error(err);
                return callback(err, null);
            }
        });

    }

    setTimeout(asyncFunc, 10);
}
module.exports.funcs_mail = {

    postEmail: function(req, reply) {

        var emailData = {

            to: req.payload.to
        };

        let cc = req.payload.hasOwnProperty("cc") == true ? req.payload.cc.join() : null;

        if (cc != null) {

            emailData.cc = cc;
        };

        var emailContextData = null;

        if (req.params.emailtype === k_templates.USER_ORDER_PLACEMENT) {

            //emailContextData = {
            //
            //    orders  : [
            //        {
            //            ordernumber : 12345,
            //            orderdate : Date.now,
            //            items : [
            //                {name : "product name #1 ", price : 99.99 , quantity : 2},
            //                {name : "product name #2 ", price : 199.99 , quantity : 1}
            //            ],
            //            cost    :   {orderTotal : 290.98, tax : 23.45, finalCost : 315.00},
            //            user    :   {
            //                firstname   :   "User FirstName ",
            //                lastname    :   "LastName",
            //                address     :   "123/2, Some Apartment, Some Road, Some Area, City",
            //                currency    :   "MX$ "
            //            },
            //            merchant:   {
            //
            //                name : "XYZ Restaurant"
            //            }
            //        },
            //        {
            //            ordernumber : 12345,
            //            orderdate : Date.now,
            //            items : [
            //                {name : "product name #1 ", price : 99.99 , quantity : 2},
            //                {name : "product name #2 ", price : 199.99 , quantity : 1}
            //            ],
            //            cost    :   {orderTotal : 290.98, tax : 23.45, finalCost : 315.00},
            //            user    :   {
            //                firstname   :   "User FirstName ",
            //                lastname    :   "LastName",
            //                address     :   "123/2, Some Apartment, Some Road, Some Area, City",
            //                currency    :   "MX$ "
            //            },
            //            merchant:   {
            //
            //                name : "XYZ Restaurant"
            //            }
            //        }
            //    ],
            //    ordernumber : 12345,
            //    orderdate : Date.now,
            //    user    :   {
            //        firstname   :   "User FirstName ",
            //        lastname    :   "LastName",
            //        address     :   "123/2, Some Apartment, Some Road, Some Area, City",
            //        currency    :   "MX$ "
            //    },
            //
            //};

            emailContextData = {
                ordernumber: 12345,
                orderdate: Date.now,
                items: [
                    { name: "product name #1 ", price: 99.99, quantity: 2 },
                    { name: "product name #2 ", price: 199.99, quantity: 1 }
                ],
                cost: { orderTotal: 290.98, tax: 23.45, finalCost: 315.00 },
                user: {
                    firstname: "User FirstName ",
                    lastname: "LastName",
                    address: "123/2, Some Apartment, Some Road, Some Area, City",
                    currency: "MX$ "
                },
                merchant: {

                    name: "XYZ Restaurant"
                }
            };
        } else {

            emailContextData = {

                username: "Mr. ABC"
            }
        }

        emailData.data = emailContextData;

        console.log("Email Data :", emailData);

        sendEmail(k_templates[req.params.emailtype], emailData, function(err, result) {

            if (result) {

                reply(result);
            } else {

                reply(err);
            }
        })
    },

    sendNewEmail: sendEmail,

    sendNonTemplateEmail: sendNonTemplateEmail,
    sendNonTemplateEmailUser: sendNonTemplateEmailUser,
    emailActiveUserResetPassword: emailActiveUserResetPassword,
    emailTypes: k_templates,
}