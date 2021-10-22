/**
 * Created by rv2016 on 05/06/17.
 */


'use strict'

const mongoose = require('mongoose');
//mongoose.promise = require('bluebird');

var TransferPaymentToMosqueSchema = new mongoose.Schema({

    adminId     :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', default : null},
    mosqueId    :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', default : null},
    amount      :   {type : Number, default : null},
    textId      :   {type : String, default : null},
    isDeleted   :   {type : Date, default   :   null},
    status      :   {type :   Number,  default : 0},
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});

TransferPaymentToMosqueSchema.virtual('transferId').get(function () {
    return this._id;
});


TransferPaymentToMosqueSchema.set('toObject', { versionKey : false, retainKeyOrder : true, virtuals : true});

TransferPaymentToMosqueSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

TransferPaymentToMosqueSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.transferId = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}

TransferPaymentToMosqueSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.transferId = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}

//     Instance Methods

TransferPaymentToMosqueSchema.methods.getFullName  =   function(){

    let currStaffMember  = this.model('Prayer');

    return currStaffMember.full_name;
}


TransferPaymentToMosqueSchema.statics.findUnique  =  function(criteria, callback){

    TransferPaymentToMosqueModel.findOne(criteria, callback);
}

TransferPaymentToMosqueSchema.statics.getAllForRestaurant  =  function(_merchant_id, callback){


    StaffModel.find({merchant_id : _merchant_id},{__v : 0},null, callback);
}

TransferPaymentToMosqueSchema.statics.findAndUpdate   =   function(find_criteria, updationInfo, callback){

    this.findUnique(find_criteria, function(err, staff_member){

        if(staff_member){

        }
        else{

            callback(err ? err : "Error finding requested staff member", null);
        }
    })
}

const TransferPaymentToMosqueModel = mongoose.model('Transferpaymenttomosque', TransferPaymentToMosqueSchema, 'Transferpaymenttomosque');

module.exports = {

    TransferPaymentToMosqueModel
}