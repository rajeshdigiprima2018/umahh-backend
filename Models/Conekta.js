/**
 * Created by rv2016 on 25/04/17.
 */

'use strict'

const mongoose = require('mongoose');
const appConfig = require('../ENV').prefs;
const base  =   require('./index');

var Schema = mongoose.Schema;

var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 10);

    console.log('Control reaches at the end of the Function');
}


var OrderSchema =   new  Schema({

    order_id    :  {type   :   Schema.ObjectId    , default   :   null}, // YummZ DB's order_id
    user_id    :  {type   :   Schema.ObjectId    , default   :   null}, // YummZ DB's user_id
    merchant_id    :  {type   :   Schema.ObjectId    , default   :   null}, // YummZ DB's merchant_id
    id  :   {type : String, default : null}, // This will be conekta's Order objects ID e.g. ord_abcdXX..
    jsonData    :   {type : Object, default : null} // JSON response from Conekta

//}, {_id : false});
});


var CustomerSchema =   new  Schema({

    user_id    :  {type   :   Schema.ObjectId    , default   :   null}, // YummZ DB's user_id
    customer_id  :   {type : String, default : null}, // This will be conekta's Order objects ID e.g. cus_abcdXX..
    jsonData    :   {type : Object, default : null} // Whole JSOn response from Conekta

//

});

// Customer Model methods

//  1.  Check Conekta Customer Exists against YummZ user

// callback  = function(err, result)
CustomerSchema.statics.checkCustomerExist =   function(yz_user_id, conekta_customer_id ,callback){

    execute(function(){

        console.log("inside func : checkCustomerExist : ", this);

        this.findOne({user_id : yz_user_id, customer_id : conekta_customer_id}, function(err, res){

            if(res && err  == null){

                return callback(null, res.jsonData);
            }
            else if(err){

                return callback(err, null);
            }
            else{

                return callback({message : "No Unique Conekta Customer Found."}, null);
            }

        })

    });
}


const ConektaOrderModel = mongoose.model('ConektaOrderModel', OrderSchema, 'ConektaOrderModel');
const ConektaCustomerModel = mongoose.model('ConektaCustomerModel', CustomerSchema, 'ConektaCustomerModel');





module.exports = {

    cn_OrderModel       :   ConektaOrderModel,
    cn_CustomerModel    :   ConektaCustomerModel
}