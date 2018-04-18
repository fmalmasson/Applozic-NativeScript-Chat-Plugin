# Applozic NativeScript Chat Plugin


## Installation

```javascript
tns plugin add nativescript-applozic-chat
```
Goto src folder and run 
```
npm run demo.ios
```

## Usage 

#### Login/Register User
```js
    var alUser = {
            'userId' : userId,   //Replace it with the userId of the logged in user
            'password' : password,  //Put password here
            'authenticationTypeId' : 1,
            'applicationId' : 'applozic-sample-app',  //replace "applozic-sample-app" with Application Key from Applozic Dashboard
            'deviceApnsType' : 0    //Set 0 for Development and 1 for Distribution (Release)
        };
	
    applozicChat.login(alUser, function(response) {
        applozicChat.launchChat(); //launch chat
      }, function(error) {
        console.log("onLoginFailure: " + error);
      });
```


#### Launch Chat


##### Main Chat screen

```
        applozicChat.launchChat();
```

##### Launch Chat with a specific User

```
        applozicChat.launchChatWithUserId(userId);
```

##### Launch Chat with specific Group 

```
        applozicChat.launchChatWithGroupId(groupId, function(response){
	  console.log("Success : " + response);
	}, function(response){
	  console.log("Error : " + response);
	});
```


#### Logout

```
applozicChat.logout(function(response) {
      console.log("logout success: " + response);
    }, function(error) {
      console.log("logout error: "+ error);
    });
```
#### Push Notification Setup instruction
##### Android

Prerequisites:
1) Download these files <https://github.com/reytum/Applozic-Push-Notification-FIles>
2) Register you application in firebase console and download the ```google-services.json``` file.
3) Get the FCM server key from firebase console.(There is a sender ID and a server key, make sure you get the server key).
4) Go to applozic dashboard https://dashboard.applozic.com/, and put the GCM/FCM server key under *Action -> Edit -> Push Notification -> Android -> GCM/FCM Server Key*.

Steps to follow:
1) Copy the ```pushnotification``` folder from the above downloaded files and paste it in path ```<your project>/platforms/android/src/main/java/com/tns/```
2) Add these lines in file ```<your project>/platforms/android/src/main/AndroidManifest.xml``` inside ```<application>``` tag

          <service android:name="com.tns.pushnotification.FcmListenerService">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>
        <service
            android:name="com.tns.pushnotification.FcmInstanceIDListenerService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.INSTANCE_ID_EVENT" />
            </intent-filter>
        </service>
3) Add the same lines from step 2 in ```<your project>/app/App_Resources/Android/AndroidManifest.xml``` file inside ```<application>``` tag
4) Paste the```google-services.json``` file in ```<your project>/platforms/android/``` folder
5) Open ```<your project>/platforms/android/build.gradle``` :
   add this inside dependency mentioned in top of the file (below ```classpath "com.android.tools.build:gradle:2.2.3"```) :
      ```classpath "com.google.gms:google-services:3.1.1"```
   add this below ```apply plugin: "com.android.application"``` :
      ```apply plugin: "com.google.gms.google-services"```
7)  Call PushNotificationTask in onSuccess of applozic login as below:
       ```
          applozicChat.registerForPushNotification(function(response){
          console.log("push success : " + response);
        }, function(response){
          console.log("push failed : " + response);
        });
       ```
       
  Note : Everytime you remove and add android platform you need to follow steps 1,2,4 and 5.
