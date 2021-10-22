/**
 * Created by rv2016 on 22/02/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const appConfig = require('../ENV').prefs;



var Schema = mongoose.Schema;

var PaymentSchema =   new  Schema({

    mosque_id :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', default : null},
    user_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', default : null},
    txn_id  :   {type : String, default : null},
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()},
    amount         :   {type : Number, default :   0.00},
    status         :   {type : Number, default :   0},  
    isDeleted      :   {type : Date, default   :   null}

    // Shipping details are delivery details and are captured in below field -Object
 

});


PaymentSchema.virtual('payment_id').get(function () {
    return this._id;
});


PaymentSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

PaymentSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.invite_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

PaymentSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

PaymentSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.payment_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find      =   function(criteria, projection, cb){

    PaymentModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}



const PaymentModel = mongoose.model('Payment', PaymentSchema, 'Payment');


module.exports = {

    PaymentModel

}