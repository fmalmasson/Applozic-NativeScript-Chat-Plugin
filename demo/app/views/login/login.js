var nativescript_applozic_chat = require("nativescript-applozic-chat");
var observableModule = require("data/observable");

var page;
var applicationKey;
var userId;
var password;

exports.loaded = function(args) {
    page = args.object;
};

exports.login = function() {
    var applozicChat = new nativescript_applozic_chat.ApplozicChat();
    applicationKey = page.getViewById("applicationKey").text;
    userId = page.getViewById("userId").text;
    password = page.getViewById("password").text;

    var alUser = {
      'userId' : userId,   //Replace it with the userId of the logged in user
      'password' : password,  //Put password here
      'authenticationTypeId' : 1,
      'applicationId' :  applicationKey,  //replace "applozic-sample-app" with Application Key from Applozic Dashboard
      'deviceApnsType' : 0 ,   //Set 0 for Development and 1 for Distribution (Release)
      'enableEncryption' : false // Set true for encryption. Default is False
    };
    
    applozicChat.login(alUser, function(response) {
        console.log("onLoginSuccess: " + response);
        //applozicChat.showAllRegisteredUsers(true);
        applozicChat.registerForPushNotification(function(response){
          console.log("push success : " + response);
        }, function(response){
          console.log("pus failed : " + response);
        });
        applozicChat.launchChat();
        // applozicChat.isLoggedIn(function(response){
        //   if(response === 'true'){
        //     console.log("2 User is logged in");
        //   }else if(response === 'false'){
        //     console.log("2 User is not logged in");
        //   }
        // });
        
        // applozicChat.launchChatWithGroupId(5531687, function(response){
        //   console.log("group launch success : " + response);
        // }, function(response){
        //   console.log("group launch error : " + response);
        // });
        //that.applozicChat.launchChatWithGroupId(3930445);
      }, function(error) {
        console.log("onLoginFailure: " + error);
      });
};

exports.logout = function() {
    var applozicChat = new nativescript_applozic_chat.ApplozicChat();    
    applozicChat.logout(function(response) {
      console.log("logout success: " + response);
    }, function(error) {
      console.log("logout error: "+ error);
    });
}