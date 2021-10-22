/**
 * Created by rv2016 on 02/03/17.
 */


'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const appConfig = require('../ENV').prefs;

const base  =   require('./index');


const  baseModel = base.TestModel;

var Schema = mongoose.Schema;


var adminSchema = new base.extendSchema({

    attr3     :   {type   :   String, default    :   "admin attr1"},
    attr4     :   {type   :   String, default    :   "admin attr2"},
    merchants :    {type : [Schema.Types.ObjectId], default : []},
    role      :   {type : String, default   :   "admin"},
    pushSubscribers :   {type : [ {

        os     :   {type : String, default : null,
            enum : [appConfig._CLIENT_OS.APPLE, appConfig._CLIENT_OS.ANDROID, appConfig._CLIENT_OS.WEB]},
        devices :   {type : [{type: String, default : null}], default : []}

    } ], default : null},
    access_tokens:  {type   :   [String], default    :   null},
    pushDevices :   {type :  {

        //os     :   {type : String, default : null,
        //    enum : [appConfig._CLIENT_OS.APPLE, appConfig._CLIENT_OS.ANDROID, appConfig._CLIENT_OS.WEB]},
        ios         :    {type : [{type: String, default : null}], default : []},
        android     :    {type : [{type: String, default : null}], default : []},
        web         :    {type : [{type: String, default : null}], default : []}
        //devices :   {type : [{type: String, default : null}], default : []}

    } , default : null}


});

adminSchema.set('toObject', { versionKey : false, retainKeyOrder : true});

adminSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    delete ret.password;
    ret.admin_id = ret._id;
    delete ret._id;

    //delete ret.createdAt;
    //delete ret.totalCancels;
    //delete ret.totalSpent;

    return ret;
}



const AdminModel = mongoose.model('Admin', adminSchema, 'Admin');


var testAdmin = baseModel.discriminator('admin',new Schema({

    attr3     :   {type   :   String, default    :   "admin attr1"},
    attr4     :   {type   :   String, default    :   "admin attr2"},
    merchants :    {type : [Schema.Types.ObjectId], default : []},
    //role      :   {type : String, default   :   "admin"}
    pushSubscribers :   {type : [ {

        os     :   {type : String, default : null,
                   enum : [appConfig._CLIENT_OS.APPLE, appConfig._CLIENT_OS.ANDROID, appConfig._CLIENT_OS.WEB]},
        devices :   {type : [{type: String, default : null}], default : []}

    } ], default : null}

},{ discriminatorKey: 'role' }));

//const TestAdminModel = mongoose.model('TestAdmin', testAdminSchema, 'TestAdmin');


var testUser = baseModel.discriminator('user',new Schema({

    attr3     :   {type   :   String, default    :   "admin attr1"},
    attr4     :   {type   :   String, default    :   "admin attr2"},
    username  :   {type   :   String, default    :   "user name"}
    //role      :   {type : String, default   :   "user"}

},{ discriminatorKey: 'role' }));

//const TestUserModel = mongoose.model('TestUser', testUserSchema, 'TestUser');



module.exports = {

    AdminModel,
    baseModel,
    testUser,
    testAdmin

}