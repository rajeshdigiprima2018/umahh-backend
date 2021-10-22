/**
 * Created by rv2016 on 05/04/18.
 */

"use strict";

/**
 * Created by rv2016 on 29/03/18.
 */


const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const fs = require('fs');
const Wreck = require('wreck');
const async = require('async');
const rq = require('request');
const lupus = require('lupus');
const Path = require('path');
const Faker  = require('faker/locale/en_US');
const Stripe    =   require('stripe');
const apn = require("apn");
const webpush = require('web-push');
const utils  =  require('util');
var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = global.Promise;

const conekta = require('conekta');

const OpenPay = require('./OpenPay/OpenPayLib');


var helpers_generic = require('./yummzHandlers').funcs_g.YZHandlers;
var helpers_user = require('./User').funcs_u;


var MerchantModel = require('../Models/merchant').MerchantModel;
var OrderModel = require('../Models/order').OrderModel;
var UserModel = require('../Models/user').UserModel;
var MenuItemModel = require('../Models/menuitem').menuItemModel;
var AdminModel = require('../Models/admin').AdminModel;

const Mailer = require('./Mailer').funcs_mail;

const appConfig = require('../ENV').prefs;



let k_ConektaAPIKeys    =   {

    TEST_PRIVATE_KEY    :   "key_XWtsXb1wZqCyWEbyFrCVew",
    PROD_PRIVATE_KEY    :   "key_wrCDdVyNLMXyYGeQxvEyDg"

}


const k_OpenPayAPIKeys    =   {

    TEST_PRIVATE_KEY    :   "sk_9407b0740fd34465ac23a6d1c9e056db",//"sk_4ab6865698a2432fb099ac998e7853fd",
    PROD_PRIVATE_KEY    :   "NA"
}

let k_StripeAPIKeys   =   {

    TEST_SECRET_KEY                 :   "sk_test_jhTfMefsSQH9ItAZy4JGNVnW",
    TEST_PUBLISHABLE_KEY            :   "pk_test_Rx7oZb8PPpJUQjewlgUEsO4p",
    LIVE_SECRET_KEY                 :   "sk_live_uQKV9pVG2SpGYelpZ9SDu5Hn",
    LIVE_PUBLISHABLE_KEY            :   "pk_live_MgHCkvzULhwQM52kE7JypJMt"
}


let k_Push_Certs_Path   =   {

    APNS_DEV_KEY_MARKET_APP        :   './Certs/Push/Apple/Dev/Market/aps-dev-yz-market_key.pem',
    APNS_DEV_CERT_MARKET_APP       :   './Certs/Push/Apple/Dev/Market/aps-dev-yz-market_cert.pem',
    APNS_PROD_KEY_MARKET_APP        :   './Certs/Push/Apple/Prod/Market/aps-prod-yz-market_key.pem',
    APNS_PROD_CERT_MARKET_APP       :   './Certs/Push/Apple/Prod/Market/aps-prod-yz-market_cert.pem',

}


let k_Order_Status =   {

    INITIALIZED                 :   "ORDER RECEIVED AND VALIDATED ON SERVER SIDE",
    PROCESSING_TRANSACTION      :   "PAYMENT TRANSACTION UNDER PROGRESS",
    TRANSACTION_SUCCESS         :   "PAYMENT TRANSACTION COMPLETED SUCCESSFULLY",
    TRANSACTION_FAILURE         :   "PAYMENT TRANSACTION FAILED",
    PREPARING_ITEMS             :   "ORDER ITEMS ARE BEING PREPARED",
    OUT_FOR_DELIVERY            :   "ORDER ITEMS ARE OUT FOR DELIVERY",
    DELIVERED                   :   "ORDER DELIVERED TO CUSTOMER SUCCESSFULLY",
    FINISHED                    :   "ORDER COMPLETED SUCCESSFULLY",
    CANCELLED                   :   "ORDER CANCELLED"
}


let pushConfig  =   {

    user    :   {
        cert: k_Push_Certs_Path.APNS_DEV_CERT_MARKET_APP,
        key: k_Push_Certs_Path.APNS_DEV_KEY_MARKET_APP,
        passphrase : 'Apple@123',
        production : false
    },

    admin   :   {

        cert: k_Push_Certs_Path.APNS_DEV_CERT_MARKET_APP,
        key: k_Push_Certs_Path.APNS_DEV_KEY_MARKET_APP,
        passphrase : 'Apple@123',
        production : false
    }
}


let pushService_user    =   new apn.Provider(pushConfig.user);
let pushService_admin    =   new apn.Provider(pushConfig.admin);

let pushConfig_live  =   {

    user    :   {
        cert: k_Push_Certs_Path.APNS_PROD_CERT_MARKET_APP,
        key: k_Push_Certs_Path.APNS_PROD_KEY_MARKET_APP,
        production: true
    },

    //admin   :   {
    //
    //    cert: k_Push_Certs_Path.APNS_DEV_CERT_MERCHANT_APP,
    //    key: k_Push_Certs_Path.APNS_DEV_KEY_MERCHANT_APP,
    //}
}


let pushService_user_live    =   new apn.Provider(pushConfig_live.user);
//let pushService_admin_live    =   new apn.Provider(pushConfig.admin);



conekta.api_key =   appConfig.getEnv() === 'live'   ?  k_ConektaAPIKeys.PROD_PRIVATE_KEY  : k_ConektaAPIKeys.TEST_PRIVATE_KEY;

console.log("ENV : ", appConfig.getEnv());
console.log("is live : ", appConfig.getEnv() === 'live');
console.log("conekta.api_key : ", conekta.api_key);


const opPK =  appConfig.getEnv() === 'live'   ?  k_OpenPayAPIKeys.PROD_PRIVATE_KEY  : k_OpenPayAPIKeys.TEST_PRIVATE_KEY;

//var openpay = new OpenPay('mguzemiewp4efhjuijjh',opPK, (appConfig.getEnv() === 'live' ) );
var openpay = new OpenPay('mifjm8v1pe8jfvu0jgun',opPK, (appConfig.getEnv() === 'live' ) );



var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};

var sendErrorReply      =   function(err, message, statusCode, reply){

    return reply({

        success     :   false,
        error       :   err,
        message     :   message
    }).code(statusCode || 404);
}



const ConektaCustomerModel = require('../Models/Conekta').cn_CustomerModel;


// Conekta Payment Code Stars here

var requestPayload = null;

var deliveryAddress = null;

var _fetchAddressFromZIpCode    =   function(zipcode){

    execute(function (zipcode) {

        Wreck.get('http://maps.googleapis.com/maps/api/geocode/json?address='+zipcode+'&sensor=true', (err, res, payload) => {
            /* do stuff */

            console.log("err :", err,"response :", res, "payload :", payload);

            if(res != {} && err == null){

                console.log("Address obtained as :", res);
            }
        });
    });
}

var _initiateOrder   =   function(req, reply,authUser,cb_main){


    //console.log("----LIVE CC  PAYMENT DEBUG -----\nENV : ", appConfig);
    console.log("is live : ", appConfig.getEnv() === 'live');

    if(appConfig.getEnv() === 'live'){

        conekta.api_key =    k_ConektaAPIKeys.PROD_PRIVATE_KEY;
    }
    else{

        conekta.api_key =    k_ConektaAPIKeys.TEST_PRIVATE_KEY;
    }


    //console.log("OpenPay Data: ", openpay);


    execute(function(){

        requestPayload  =   req.payload;

        console.log("OP request headers: ", req.headers);

        let languageHeader  =   "en"; //req.headers["language"] ? req.headers["language"]  : "en";

        if(languageHeader){

            conekta.locale  =   languageHeader;

            console.log("language header value : ", languageHeader);
        }

        checkConektaCustomer(req, reply, authUser, cb_main);

        // _fetchAddressFromZIpCode("382007");
    });
}

var checkUniqueCustomer = function(yz_user_id, conekta_customer_id ,callback){

    ConektaCustomerModel.findOne({user_id : yz_user_id, customer_id : conekta_customer_id}, function(err, res){

        if(res && err  == null){

            return callback(null, res);
        }
        else if(err){

            return callback(err, null);
        }
        else{

            return callback({message : "No Unique OpenPay Customer Found."}, null);
        }

    })
}

var checkConektaCustomer = function(req, reply, authUser, cb_main){

    //console.log(authUser.conekta," : ",authUser.conekta.customer_id);

    if(authUser.conekta && authUser.conekta.customer_id){

        checkUniqueCustomer(authUser._id, authUser.conekta.customer_id,function(err, res){

            if(res == null && err == null){

                //return sendErrorReply(err ? err : "Server Error occurred finding Conekta Customer for User","No Conekta Customer Exists for User",404,reply);

                return cb_main(err ? err : "Server Error occurred finding OpenPay Customer for User", null);
            }
            else if(res && res != {}){

                execute(function(){
                    console.log("checkUniqueCustomer -- checkConektaCustomer block , res : ", res);

                    // check if given customerID exists in OpenPay data, if exists then proceed else
                    //  -- set value of customer_id of UserModel.conekta  to Null. Create new OpenPay Customer which will automatically set the nulled value to correct Openpay customer id

                    openpay.customers.get(authUser.conekta.customer_id.toString(), function(err_cust, OPcustomer){

                        if(OPcustomer && !err_cust ){

                            cbConektaCustomerExist(res, cb_main);
                        }
                        else{

                            console.error("checkUniqueCustomer -- customer_id is not valid for OpenPay PG. Credating new OP customer.", err_cust);
                            cbConektaCustomerCreate(authUser, cb_main);
                        }
                    });

                    //cbConektaCustomerExist(res, cb_main);
                });

            }

        });
    }
    else{

        console.error("No OpenPay customer data found for current YummZ user. creating new OpenPay Customer");
        cbConektaCustomerCreate(authUser, cb_main);
    }

}

// old method for conekat
var cbConektaCustomerExistOld  =   function(customer, callback){

    console.log("OpenPay Customer already exists for given User : ", customer);

    let aCustomer = customer.jsonData;

    console.log("Customer Found with details : ", aCustomer);

    if(aCustomer.payment_sources){

        console.log("OpenPay Customer has payment Source already.");

        let cardData    =   {

            bin     :   requestPayload.card.bin,
            last4   :   requestPayload.card.last4
        };

        execute(function(){

            //cbConektaCustomerPaymentSourceExist(aCustomer, cardData,callback);

            cbConektaCustomerPaymentSourceExist(customer, cardData,callback);
        });

    }
    else{

        console.log("No pyament sources attached to Conekta Customer. Creating new one");

        execute(function(){

            let paymentInfo =  {
                type : 'card',
                token_id: String(requestPayload.stripe_token)
            };

            //cbConektaCustomerPaymentSourceCreate(customer, paymentInfo, callback);

            cbConektaCustomerPaymentSourceCreate(customer, paymentInfo, function(err, yz_customer){

                if(yz_customer){

                    cbConektaCustomerPaymentSourceExist(yz_customer, requestPayload.card, callback);
                }
                else{

                    return callback(err ? err : "Error addimng new credit card to Customers existing payment Source data");
                }
            });




        })
    }

    //console.log("Customer Found with payment_sources as : ", aCustomer.payment_sources);
}

// new method for OpenPay
var cbConektaCustomerExist  =   function(customer, callback){

    console.log("OpenPay Customer already exists for given User : ", customer);

    let aCustomer = customer.jsonData;

    console.log("OpenPay Customer Found with details : ", aCustomer);


    execute(function(){

        console.log("req payload :", requestPayload);
        console.log("Creating new OpenPay Order/charge request......");
        cbConektaCreateOrder(aCustomer,requestPayload.items,requestPayload.stripe_token,"",callback);
    });

    /*
     if(aCustomer.payment_sources){

     console.log("OpenPay Customer has payment Source already.");

     let cardData    =   {

     bin     :   requestPayload.card.bin,
     last4   :   requestPayload.card.last4
     };

     execute(function(){

     //cbConektaCustomerPaymentSourceExist(aCustomer, cardData,callback);

     cbConektaCustomerPaymentSourceExist(customer, cardData,callback);
     });

     }
     else{

     console.log("No pyament sources attached to Conekta Customer. Creating new one");

     execute(function(){

     let paymentInfo =  {
     type : 'card',
     token_id: String(requestPayload.stripe_token)
     };

     //cbConektaCustomerPaymentSourceCreate(customer, paymentInfo, callback);

     cbConektaCustomerPaymentSourceCreate(customer, paymentInfo, function(err, yz_customer){

     if(yz_customer){

     cbConektaCustomerPaymentSourceExist(yz_customer, requestPayload.card, callback);
     }
     else{

     return callback(err ? err : "Error addimng new credit card to Customers existing payment Source data");
     }
     });




     })
     }
     */
    //console.log("Customer Found with payment_sources as : ", aCustomer.payment_sources);
}

var cbConektaCustomerCreate  =   function(yz_user, _callback){

    console.log("username : ", yz_user.first_name+' ' + yz_user.last_name);

    const newOpenPayCustomer  =  {
        "external_id" :  yz_user._id,
        "name": yz_user.username ,
        "phone_number": yz_user.mobile,//"+5215555555555",
        "email": yz_user.email.replace(' ','').toLowerCase(),
        "last_name": yz_user.last_name,
        "address":{
            "city":     "Ciudad de Mexico",  // yz_user.city,
            "state":    "Distrito Federal", //yz_user.state,
            "line1":    "Mercado San Genaro", //yz_user.address_full,
            "line2":    "DIF",
            "postal_code":  "11320", //yz_user.postal_code ? yz_user.postal_code : "06100",
            "country_code": "MX", //yz_user.country
        }

    };

    openpay.customers.create(newOpenPayCustomer,  function(err, res) {

        if (err) {

            console.log("Error creating OpenPay Customer : ", err);
            return _callback(err , null);
        }
        else if(res) {

            let conektaCustomer = res;   //.toObject();

            console.log("Successfully created OpenPay Customer : ", conektaCustomer);

            let aNewConektaCustomer = ConektaCustomerModel();

            aNewConektaCustomer.user_id     =   yz_user._id;
            aNewConektaCustomer.customer_id  =   conektaCustomer.id;
            aNewConektaCustomer.jsonData    =   conektaCustomer;

            aNewConektaCustomer.save(function(err, savedDoc){

                if(savedDoc && err == null){

                    yz_user.conekta =   {

                        customer_id :   conektaCustomer.id
                    }

                    yz_user.save(function(err, savedDoc){

                        if(savedDoc && err == null){

                            execute(function(){

                                console.log("Updated YummZ Table data :", savedDoc);

                                //cbConektaCustomerExist(savedDoc. _callback);

                                let aUser = savedDoc;

                                checkUniqueCustomer(aUser._id, aUser.conekta.customer_id,function(err, res){

                                    if(res == null && err == null){

                                        //return sendErrorReply(err ? err : "Server Error occurred finding Conekta Customer for User","No Conekta Customer Exists for User",404,reply);

                                        return _callback(err ? err : "Server Error occurred finding OpenPay Customer for YummZ User", null);

                                    }
                                    else if(res != {}){
                                        execute(function(){
                                            console.log("checkUniqueCustomer block");
                                            cbConektaCustomerExist(res, _callback);
                                        });
                                    }
                                });
                            });
                        }
                        else{

                            console.error(err ? err : "Error saving OpenPay Customer info for User.");

                            return _callback(err ? err : "Error saving OpenPay Customer info for User.", null)
                        }
                    });
                }
                else{

                    console.error(err ? err : "Error saving OpenPay Customer info for User.");
                }
            });

        }
    });
}

var cbConektaCustomerPaymentSourceExist     =   function(customer, cardData, callback){

    let aCustomer = customer.jsonData;

    let paymentSources  =   aCustomer.payment_sources;//customer.payment_sources;

    function cardDataMatches(source){

        console.log("payment source :", source, "\n CardData : ", cardData);

        if(source && source.bin === String(cardData.bin) && source.last4 === String(cardData.last4)){

            return source;
        }
    };

    let filteredSources =   paymentSources.data.filter(cardDataMatches);

    console.log(filteredSources.length + " payment sources found to be matching with Card data provided in request");

    if(filteredSources.length == 0){

        cbConektaCustomerpaymentSourceCardCreate(customer, cardData, callback)
    }
    else if(filteredSources.length == 1){

        let paymentSource = filteredSources[0];

        cbConektaCreateOrder(customer.customer_id,requestPayload.items,paymentSource.id, paymentSource.type,callback);
    }
    else{

        return callback("Duplicate Card data exists", null);
    }

}

var cbConektaCustomerPaymentSourceCreate     =   function(someCustomer, paymentInfo, callback){

    console.log("Creating new payment Source for Customer :", someCustomer);

    var aCustomer = someCustomer;
    // get payment source id and type  
    conekta.Customer.find(aCustomer.customer_id, function(err, customer) {
        if (err) {
            console.error("Error Finding customer : ", err);

            return callback(err, null);
        }
        else {
            console.log("Customer Found with details : ", customer.toObject());
            //console.log("Customer Found with payment_sources as : ", customer.payment_sources.toObject());
            // get customer id  
            let customer_id = aCustomer.customer_id;//customer.toObject().id;
            customer.createPaymentSource({
                    type: paymentInfo.type,
                    token_id: paymentInfo.token_id,//"tok_test_visa_4242"
                    //name    : "MARIA OZAWA"
                },
                function (err, res) {
                    if (err) {
                        console.error("Error adding payment source to customer : ", err);

                        return callback(err, null);
                    }
                    else if (res) {
                        console.log("Successfully added payment Source to Customer :", res);
                        let payment_source_id = res.id;//res.payment_sources[0].id;
                        let payment_source_type = res.type//res.payment_sources[0].type;
                        console.log("Customer id : ", customer_id, "\n payment source id : ", payment_source_id,
                            "\n payment source type : ", payment_source_type);

                        //aCustomer.payment_sources   =   [];
                        //aCustomer.payment_sources.push(res);

                        syncCustomerPaymentSources(aCustomer, function(err, conekta_customer){

                            if(conekta_customer){

                                console.log("conekta_customer : ", conekta_customer.toObject());

                                //aCustomer.payment_sources   =   conekta_customer.payment_sources;

                                aCustomer.jsonData  =   conekta_customer.toObject();

                                aCustomer.save(function(err, savedDoc){

                                    if(savedDoc){

                                        console.log("Local Conekta Customer Data payment Sources :", savedDoc);

                                        callback(null, savedDoc);
                                    }
                                    else{

                                        if(err){

                                            console.error(err);

                                            return callback(err, null);
                                        }
                                        else{

                                            return callback("Error saving Conekta Customer with new payment Source unit", null);
                                        }
                                    }
                                });
                            }
                            else{

                                return callback(err ? err : "No Payment Sources found for Users Conekta Data");
                            }
                        });


                    }
                });
        }
    });
}

var syncCustomerPaymentSources  =   function(aCustomer, cb){

    conekta.Customer.find(aCustomer.customer_id, function(err, customer) {
        if (customer) {
            cb(null, customer);
        }
        else {
            console.error("Error Finding customer : ", err);
            return cb(err ? err : "Error Finding customer", null);
        }
    });
}

var cbConektaCustomerpaymentSourceCardExist     =   function(){

}

var cbConektaCustomerpaymentSourceCardCreate     =   function(customer, cardData, callback){

    let paymentInfo = {

        type : 'card',
        token_id    :   String(requestPayload.stripe_token)
    }

    cbConektaCustomerPaymentSourceCreate(customer, paymentInfo, function(err, yz_customer){

        if(yz_customer){

            cbConektaCustomerPaymentSourceExist(yz_customer, requestPayload.card, callback);
        }
        else{

            return callback(err ? err : "Error adding new credit card to Customers existing payment Source data");
        }
    });

}

// old method for conekta
/*
 var cbConektaCreateOrderOld    =   function(customer_id, orderItems, paymentSourceID, paymentSourceType, callback) {


 // creating line items array  
 let lineItems = orderItems.map(function (element, index) {

 //let priceStr = String(element.price);
 //var newstr = priceStr.replace('.', '');
 //let priceInt = parseInt(newstr);

 let fixedPrice = (element.price * 100).toFixed();

 // console.log("priceStr :", priceStr," new Str : ",newstr ," priceInt = ", priceInt, "fixedPrice :", fixedPrice);

 console.log("line Item price = ", fixedPrice);
 var modItem = {
 name: element.name,
 description: (element.description && element.description.length > 0 ) ? element.description : "No Description",
 unit_price: fixedPrice,//priceInt,//parseInt(element.price * 100),
 quantity: element.quantity,
 tags: ["food", "mexican food"],
 type: "physical"
 }
 return modItem;
 });


 //calculating Tax value for tax_lines

 let taxFloat = requestPayload.cost.orderTotal * (requestPayload.cost.tax / 100);

 let taxValue = (taxFloat.toFixed(2) * 100).toFixed();//(taxFloat* 100).toFixed(2); //parseInt(taxFloat * 100);

 console.log("taxFloat : ", taxFloat, "tax value :", taxValue);


 // New code starts here


 var orderInfo = {
 "currency": "MXN",
 "line_items": lineItems,
 "customer_info": {
 "customer_id": customer_id
 },
 "charges": [{
 "payment_method": {
 "payment_source_id": paymentSourceID,
 "type": paymentSourceType
 }
 }],
 "shipping_lines": [{
 "amount": 0,
 "carrier": "N.A."
 }],
 "shipping_contact": {
 "phone": requestPayload.delivery.customer.mobile,//"+521"+requestPayload.delivery.customer.mobile,                //"+5215555555555",
 "receiver": requestPayload.delivery.customer.firstname + ' ' + requestPayload.delivery.customer.lastname,//"Bruce Wayne",
 "address": {
 "street1": requestPayload.delivery.customer.deliveryaddress,//"Calle 123 int 2 Col. Chida",
 "city": requestPayload.delivery.customer.city ? requestPayload.delivery.customer.city : "Cuahutemoc",
 "state": requestPayload.delivery.customer.state ? requestPayload.delivery.customer.state : "Ciudad de Mexico",
 "country": "MX",
 "postal_code": requestPayload.delivery.customer.postal_code ? requestPayload.delivery.customer.postal_code : "06100",
 "residential": true
 }
 }
 };

 if (requestPayload.cost.tax >= 0.1) {

 orderInfo.tax_lines = [{
 "description": "Tax",
 "amount": taxValue,
 "metadata": {"param1": "value1", "paramX": "valueX"}
 }];
 }

 if (requestPayload.cost.discount >= 0.1) {

 let discountAmount = requestPayload.cost.discount * 100;
 orderInfo.discount_lines = [{
 "code": "discount -  generic",
 "type": "campaign",
 "amount": discountAmount
 }];
 }

 console.log("Conekta Order Info :", orderInfo);


 conekta.Order.create(orderInfo, function (err, res) {

 if (res && res != {}) {

 let conekta_order = res.toObject();
 console.log("New Conekta Order created successfully with response :\n", conekta_order);
 return callback(null, conekta_order);
 }
 else {
 console.error("Error creating  a Conekta order : ");
 return callback(err ? err : "Unknown server error occured while placing order with Conekta", null);
 }

 });

 // New code ends here


 }
 */

// new method for OpenPay

var cbConektaCreateOrder    =   function(_customer, orderItems, paymentSourceID, paymentSourceType, callback) {

    const customer  =  {

        name: _customer.name,
        last_name: _customer.last_name,
        email: _customer.email,
        phone_number: _customer.phone_number,
        status:_customer.status,
        balance: _customer.balance,
        address: _customer.address,
        creation_date: _customer.creation_date,
        //external_id: _customer.external_id,
        clabe: _customer.clabe
    };

    // creating line items array  
    let lineItems = orderItems.map(function (element, index) {

        //let priceStr = String(element.price);
        //var newstr = priceStr.replace('.', '');
        //let priceInt = parseInt(newstr);

        let fixedPrice = (element.price * 100).toFixed();

        // console.log("priceStr :", priceStr," new Str : ",newstr ," priceInt = ", priceInt, "fixedPrice :", fixedPrice);

        console.log("line Item price = ", fixedPrice);
        var modItem = {
            name: element.name,
            description: (element.description && element.description.length > 0 ) ? element.description : "No Description Available",
            unit_price: fixedPrice,//priceInt,//parseInt(element.price * 100),
            quantity: element.quantity,
            tags: ["food", "mexican food"],
            type: "physical"
        }
        return modItem;
    });


    //calculating Tax value for tax_lines

    let taxFloat = requestPayload.cost.orderTotal * (requestPayload.cost.tax / 100);

    let taxValue = (taxFloat.toFixed(2) * 100).toFixed();//(taxFloat* 100).toFixed(2); //parseInt(taxFloat * 100);

    console.log("taxFloat : ", taxFloat, "tax value :", taxValue);


    // New code starts here

    var newOPOrderChargeReuest  =   {
        'source_id' : paymentSourceID,  //  requestPayload.payment.mode.meta.stripe_token
        'method' : 'card',
        'amount' : requestPayload.cost.finalCost,
        'description' : utils.format('Order placed from YummZ delivery app by customer : %s -  to be delivered to recipient : %s',
            customer.name+ '' + customer.last_name, requestPayload.delivery.customer.firstname + ' ' +   requestPayload.delivery.customer.lastname),
        //'order_id' : 'oid-00051',
        'device_session_id' : requestPayload.device_session_id,//requestPayload.payment.mode.meta.device_session_id,
        //'customer' : customer//,
        /*'metadata'  :   {

         "line_items": lineItems,
         "shipping_contact": {
         "phone": requestPayload.delivery.customer.mobile,//"+521"+requestPayload.delivery.customer.mobile,                //"+5215555555555",
         "receiver": requestPayload.delivery.customer.firstname + ' ' + requestPayload.delivery.customer.lastname,//"Bruce Wayne",
         "address": {
         "street1": requestPayload.delivery.customer.deliveryaddress,//"Calle 123 int 2 Col. Chida",
         "city": requestPayload.delivery.customer.city ? requestPayload.delivery.customer.city : "Cuahutemoc",
         "state": requestPayload.delivery.customer.state ? requestPayload.delivery.customer.state : "Ciudad de Mexico",
         "country": "MX",
         "postal_code": requestPayload.delivery.customer.postal_code ? requestPayload.delivery.customer.postal_code : "06100",
         "residential": true
         }
         }
         }*/
    }



    if (requestPayload.cost.tax >= 0.1) {

        newOPOrderChargeReuest.metadata.tax_lines = [{
            "description": "Tax",
            "amount": taxValue,
            "metadata": {"param1": "value1", "paramX": "valueX"}
        }];
    }

    if (requestPayload.cost.discount >= 0.1) {

        let discountAmount = requestPayload.cost.discount * 100;
        newOPOrderChargeReuest.metadata.discount_lines = [{
            "code": "discount -  generic",
            "type": "campaign",
            "amount": discountAmount
        }];
    }

    console.log("OpenPay New Order Info :", newOPOrderChargeReuest);

    openpay.customers.charges.create(_customer.id, newOPOrderChargeReuest,function(err, res){

        //openpay.charges.create(newOPOrderChargeReuest, function(err, res){

        console.log("OpenPay Charge Creation response : err : ", err);
        console.log("response : ", res);

        if (res && res != {} && (!err) ) {

            let conekta_order = res//.toObject();
            console.log("New OpenPay Order created successfully with response :\n", conekta_order);
            return callback(null, conekta_order);
        }
        else {


            var err_message  = "Unknown payment gateway error occurred while placing order with OpenPay";

            if(err){

                if(err.category && err.description && (err.http_code != 200 || err.http_code != 201) ){

                    err_message = err.category + "\n" + err.description;
                }
            }

            console.error("Error creating  a OPENPAY order : \n", err);
            //return callback(err ? err : "Unknown server error occured while placing order with Conekta", null);
            return callback(err_message, null);

        }

    });

    // New code ends here


}


module.exports  =   {

    initiateOrder   :  _initiateOrder

}