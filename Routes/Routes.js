/**
 * Created by rv2016 on 02/11/16.
 */


'use strict';

const suggestions = require('./Suggestions.js');
const users = require('./Users.js');
const associates = require('./Associates.js');
const commondata = require('./CommonData.js');
const education = require('./education');
const news = require('./News');
const board = require('./Board');
const calendar = require('./Calendar');
const prayer = require('./Prayer');
const activities = require('./Activities');
const community = require('./Community');
const likecommunity = require('./Likecommunity');
const supplication = require('./Supplication');
const hajjumrah = require('./HajjUmrah');
const khutba = require('./khutba');
const donationCategory = require('./DonationCategory');
const paypalPayment = require('./PaypalPayment');
const following = require('./Following');
const personnage = require('./Personnage');
const personnageUsers = require('./PersonnageUsers');
const juz = require('./Juz');
const quizCategory = require('./QuizCategory');
const quiz = require('./Quiz');
const quizRule = require('./QuizRule');
const notification = require('./Notification');
const message = require('./Message');
const prayername = require('./PrayerName');
const commanapiroute = require('./CommanApiRoute');
const termcondition = require('./Termcondition');
const transferpaymenttomosque = require('./TransferPaymentToMosque');
var allRoutes = [].concat(suggestions.register.attributes.routes)
    .concat(users.register.attributes.routes)
    .concat(associates.register.attributes.routes)
    .concat(commondata.register.attributes.routes)
    .concat(education.register.attributes.routes)
    .concat(news.register.attributes.routes)
    .concat(board.register.attributes.routes)
    .concat(calendar.register.attributes.routes)
    .concat(prayer.register.attributes.routes)
    .concat(activities.register.attributes.routes)
    .concat(community.register.attributes.routes)
    .concat(likecommunity.register.attributes.routes)
    .concat(supplication.register.attributes.routes)
    .concat(hajjumrah.register.attributes.routes)
    .concat(khutba.register.attributes.routes)
    .concat(donationCategory.register.attributes.routes)
    .concat(paypalPayment.register.attributes.routes)
    .concat(following.register.attributes.routes)
    .concat(personnage.register.attributes.routes)
    .concat(personnageUsers.register.attributes.routes)
    .concat(juz.register.attributes.routes)
    .concat(quizCategory.register.attributes.routes)
    .concat(quiz.register.attributes.routes)
    .concat(quizRule.register.attributes.routes)
    .concat(notification.register.attributes.routes)
    .concat(message.register.attributes.routes)
    .concat(prayername.register.attributes.routes)
    .concat(commanapiroute.register.attributes.routes)
    .concat(termcondition.register.attributes.routes)
    .concat(transferpaymenttomosque.register.attributes.routes)


module.exports = {

    suggestions,
    users,
    associates,
    commondata,
    education,
    news,
    board,
    calendar,
    prayer,
    activities,
    community,
    likecommunity,
    supplication,
    hajjumrah,
    khutba,
    donationCategory,
    paypalPayment,
    following,
    personnage,
    personnageUsers,
    juz,
    quizCategory,
    quiz,
    quizRule,
    notification,
    message,
    prayername,
    commanapiroute,
    termcondition,
    transferpaymenttomosque
}