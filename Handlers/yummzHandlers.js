/**
 * Created by rv2016 on 08/11/16.
 */

"use strict";

var fs = require('fs'),
    request = require('request'),
    async = require('async'),
    bcrypt = require('bcryptjs');

let m = require('./index.js');
const { object } = require('joi');

var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
}

var sendErrorReply      =   function(err, message, statusCode, reply){

    return reply({

        success     :   false,
        error       :   err,
        message     :   message
    }).code(statusCode || 404);
}

var createSubDirectories    =   function(dir, callback){

    // This will create a dir given a path such as './folder/subfolder'
    const splitPath = dir.split('/');

    var counter  = 0;

    splitPath.reduce(function(path, subPath){

        let currentPath;

        if(subPath != '.'){

            currentPath = path + '/' + subPath;

            console.log("currentPath : - ", currentPath);

            YZHandlers.checkORCreateDirectory(currentPath, '0777', function(error){

                counter++;

                console.log("Callback inside createSubDirectories method : Error : ", error)

                if(error){

                    callback(error);
                }
                else{

                    console.log("splitpath length : ", splitPath.length, "Counter : ", counter);

                    if(counter == splitPath.length - 1){

                        callback(null);
                    }
                }


            });

        }
        else{
            currentPath = subPath;
            console.log("All subdirectories created successfully.");
        }
        return currentPath
    }, '')
}

var save =   function(modelObject,projection, options, logMessage ,reply, callback){

    console.log("model object :", modelObject);

    modelObject.save(function(err, savedDoc, numRowsAffected){

        console.error("err :", err);
        console.log("savedDoc :", savedDoc);
        console.log("numRowsAffected :", numRowsAffected);


        if(savedDoc && err == null && numRowsAffected  > 0){

            callback(null, savedDoc);
        }
        else if(err != null || numRowsAffected == 0){

            callback(err, null);

            return sendErrorReply(err != null ? err.message : "Error occurred saving Model Data",
                logMessage, 404,reply );

        }
        else{

            return sendErrorReply("Unknown Server Error occurred saving User Data",
                logMessage, 404,reply );
        }

    });
}

const  YZHandlers = {


    testFunction(){

        let rq = request;

        rq("http://www.google.co.in",function(res){
            console.log('Inside Res');
            console.log(res);

        },function(err){
            console.log('Error');
            console.log(err);

        }).on('response', function(resp){

            //console.log(arguments.length);
            for (var i = 0; i < arguments.length; i++) {
                //console.log(arguments[i]);
                //console.log(arguments);
            }
        });
    },
    accesstokenFunction   :   function(accesstoken, type,email, callback){
        if(type=='facebook'){
            const userFieldSet = 'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';
            var options = {
                method: 'GET',
                url: 'https://graph.facebook.com/me/',
                qs: {
                    access_token: accesstoken,
                    fields: userFieldSet
                },
            };
            //console.log(options);
            request(options, function (error, resp, body) {
                console.log('helloooooooooooooooooooooooooooooooooooooooooooofb',body);
                if (error) {
                    //  throw new Error(error);
                    //console.log(error);
                    callback(error, false);
                } 
                else {
                    if (JSON.parse(body).error || email != JSON.parse(body).email) {
                        callback(error, false);
                    } else {
                        callback(error, true);
                    }
                }
            });
        }
    },
//Google login check method
    accesstokenFunctiongoogle  :   function(accesstoken,type,email,callback){
        if(type=='google'){
            const userFieldSet = 'id, name, about, email, accounts, link, is_verified, significant_other, relationship_status, website, picture, photos, feed';
            var options = {
                method: 'GET',
                url: 'https://oauth2.googleapis.com/tokeninfo?id_token='+accesstoken
            };
            //console.log(options);
            request(options, function (error, body) {
                if (error) {
                    //  throw new Error(error);
                    //console.log(error);
                    callback(error, false);
                } 
                else {
                    if (email != JSON.parse(body.body).email) {
                        callback(error, false);
                    } else {
                        callback(error, true);
                    } 
                }
            });
        }
    },
     
    // Downloads Image from an external URL / URI
     downloadImage(uri,filename, callback){

         let options  = {

             url : uri,

             headers : {'Content-Type': 'image/*',
                            'Accept' : 'image/*'},
             method:'GET'
         };

            request(options, function(err, res, body){


                if(err != null && res == null){

                    return;
                }
                else{

                    console.log(err);
                }


                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);

                if(res.headers['content-type'] != 'image/png' || res.headers['content-type'] != 'image/jpg' || res.headers['content-type'] != 'image/jpeg'){

                    //image/png
                   // return callback('Invalid Content Type Recieved','Wrong Content Type Received. Aborting Operation.', null);

                }

                let path = 'Media/Images/Merchants/'+ filename;


                request(uri)
                    .pipe(fs.createWriteStream(path))
                    .on('error', (err) => {
                        //console.log('Error event called Up.');
                        //console.error(err);
                        return callback(err,'Error event called Up.', null);
                    })
                    .on('open', (err) => {
                        console.log('open event called Up.');
                        console.log('Started Reading incoming Stream Data');
                        //callback('Started Reading incoming Stream Data');
                        //callback(err,'Started Reading incoming Stream Data', null);
                    })
                    .on('end', (err) => {
                        console.log('end event called Up.');
                        var ret = {
                            filename: filename,
                            headers: res.headers
                        };
                        console.error(err);
                        console.log('Image received and parsed successfully.');
                        //callback('Image received and parsed successfully.');
                        return callback(err,'Image received and parsed successfully.', ret);


                    })
                    .on('close', (err) =>{

                        //console.log('Close event called Up.');
                        if(err != null){

                            console.error(err);
                            return callback(err,'Close event called Up.', null);
                        }
                        else{
                            var ret = err == null ? {
                                filename: filename,
                                //headers: res.headers
                            } : null;

                            return callback(null,'Close event called Up.', ret);
                        }

                    })


            })
                .on('response', function(response){

                    console.log('Response event occured');
                })
                .on('error', function(err) {
                    console.log('Request Framework error :'+ err);
                        return callback(err,
                            'request Framework Error Occured.', null);
                });

    },

     saveImageToPath(imageData, fileName, filePath,uri, callback){

         //var name = data.image.hapi.filename;
         //let filename = 'logo_' + name;
         //let path = 'Media/Images/Merchants/'+ filename;

         console.log(fileName + '\n' + filePath +'\n' + uri);

         let path = filePath;

         const options = { flags: 'w'}; // This option indicates that the file will be overwritten if operation made on the
                                        // URI has some file in it.

         var file = fs.createWriteStream(path, options);

         file.on('error', (err) => {
                 //console.log('Error event called Up.');
                 //console.error(err);
                 return callback(err,'Error event called Up.', null);
             })
             .on('open', (err) => {

                    imageData.pipe(file).on('error',(pipeError) =>{

                        if(pipeError){

                            return  callback(pipeError,'error', null);
                        }
                    });

                     console.log('open event called Up.');

                     console.log('Started Reading incoming Stream Data');


                 })
             .on('end', (err) => {
                     console.log('end event called Up.');
                     var ret = {
                         path: filePath,
                         url:   uri+fileName
                     };
                     console.error(err);

                     console.log('Image received and parsed successfully.');

                     return callback(err,'Image received and parsed successfully.', ret);

                 })
             .on('close', (err) =>{

                     if(err != null){

                         console.error(err);
                         return callback(err,'Close event called Up.', null);
                     }
                     else{
                         var ret = err == null ? {
                             path: filePath,
                             url:   uri+fileName
                         } : null;

                         return callback(null,'Close event called Up.', ret);
                     }

                 })

     },


    checkORCreateDirectory(path, mask, cb) {

        console.log("checkORCreateDirectory");
        console.log("path : -",path, "\n mask : - ",mask);

            if (typeof mask == 'function') { // allow the `mask` parameter to be optional
                cb = mask;
                mask = '0777';
            }
            fs.mkdir(path, mask, function(err) {

                // Possible Error codes can be found at : http://man7.org/linux/man-pages/man2/mkdir.2.html
                if (err) {
                    if (err.code == 'EEXIST') {
                        console.log("path : ", path,"already exists");
                        cb(null); // ignore the error if the folder already exists
                    }
                    else if(err.code == 'ENOENT') {

                        console.log("path : ", path,"has multiple Sub Dirs whihc are not existing yet. Creating them iteratively");

                        createSubDirectories(path, function(error){

                            console.log("Callback inside checkORCreateDirectory method : Error : ", error)

                            cb(error);
                        });
                    }
                    else{

                        cb(err); // something else went wrong
                    }
                }
                else{

                    console.log("Directory at path : ", path, " was created successfully");
                    cb(null); // successfully created folder
                }

            });

    },


    deleteFile(atPath, callback){

        console.log('path to del : '+ atPath);


        fs.stat(atPath,function(err, stat){ // check existence of file at path

            if(err){

                console.error(err);
                callback(err);
            }
            else{

                console.log(stat);

                fs.unlink(atPath, (err) => {    // remove the file at path confirmed above
                    if (err) {

                        console.error(err);
                        callback(err);
                        throw err;
                    }
                    else{
                        console.log('successfully deleted file : '+ atPath);
                        callback(null);
                    }
                });
            }
        });

    },

    renameFile(atPath, withNewPath, callback){

        console.log('Renaming File at path: ', atPath,' with new path : ', withNewPath);

        fs.rename(atPath, withNewPath, callback);
    },


    encryptPassword     :   function(plainText, strength , callback ){

            // Generate a salt at level 10 strength
        let level = strength || 10;


            bcrypt.genSalt(level, (err, salt) => {
                bcrypt.hash(plainText, salt, (err, hash) => {
                    return callback(err, hash);
                });
            });

    },

    matchPassword       :   function(plainText, cipherText, callback){

        bcrypt.compare(plainText, cipherText, (err, isValid) => {

            console.log("err ", err," is Valid :", isValid);

            callback(err, isValid);
        });
    },

    getCurrentAuthUser  :   function(){

       return require('../index').authUser || null;

    },

    saveData            :   save

}
module.exports.funcs_g = {YZHandlers};