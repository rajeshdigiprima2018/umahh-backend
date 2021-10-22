/**
 * Created by rr2018 on 02/03/19.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');

const appConfig = require('../ENV').prefs;
var Schema = mongoose.Schema;
const testSchema = new mongoose.Schema({

    fieldx :   {type : String, default : "Base Model Field 1"},
    fieldy :   {type : String, default : "Base Model Field 2"},
    role :   {type : String, default : "SA", enum :["admin","user","SA"]}

},{ discriminatorKey: 'role' });

var getMemberSchema =   function(){

    return memberSchema;
}
var extendSchema    =   function(paths){

    var memberSchema = new mongoose.Schema({

        first_name :   String,
        last_name  :   String,
        email      :   String, // Optional for FB users & Required for Email based registered users
        username   :   String, // this will be computed field from smallcap.nospace applied to first_name+last_name  OR a Facebook                      // provided user name
        password   :   {type   :   String, default    :   null},  // Salt-hashed Pwd string --  Optional for FB users
        mobile     :   {type   :   String, default    :   null},
        isLoggedIn :   {type   :   Boolean, default    :   false},
        access_token:  {type   :   String, default    :   null},
        role   :   {
            type   :   String,
            enum   :   ['admin', 'user', 'SA','mosque','business'] // SA -- Super Admin // Admin  = Merchant as Admin of his Own account
        }

    });


    memberSchema.add(paths);

    memberSchema.methods.someMethod =   function(someData){

        console.log("someMethod called on Base model with data :", someData);
    }

    memberSchema.methods.logOut = function(role){

        execute(function(){

            var currUser = role === "user" ?  this.model('User') : this.model('Admin')

            currUser.isLoggedIn = false;
            currUser.access_token = null;

            currUser.save(function(err){

                if(err){

                    return (err);
                }
                else{

                    return (currUser.role.toUpperCase() +  " Logged out Successfully.");
                }
            });

        });

    }

    memberSchema.statics.checkUniqueness = function(username, emailaddress, cb){

        console.log(username);

        console.log(emailaddress);

        let criteria   =   username != null ? {$or: [{ email: emailaddress },{ username: username }]}   :   {email : emailaddress};

        return this.findOne(criteria, cb);

    }

    //let MemberModel = mongoose.model('Member', memberSchema, 'Member');

    return memberSchema;
}

const TestModel = mongoose.model('Test', testSchema, 'Test');

module.exports = {

    TestModel,
    extendSchema
}