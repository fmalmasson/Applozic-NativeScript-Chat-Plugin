import * as app from 'tns-core-modules/application/application';
import { Common } from './applozic-chat.common';

declare const com: any;

export class ApplozicChat extends Common {
  constructor() {
    super();
  }

  public login(alUser: any, successCallback: any, errorCallback: any) {
    const user = new com.applozic.mobicomkit.api.account.user.User();
    user.setUserId(alUser.userId);
    user.setPassword(alUser.password);
    user.setApplicationId(alUser.applicationId);
    user.setDisplayName(alUser.displayName);
    user.setContactNumber(alUser.contactNumber);
    user.setAuthenticationTypeId(new java.lang.Short(alUser.authenticationTypeId));
    user.setImageLink(alUser.imageLink);
    if (alUser.pushNotificationFormat > 0) {
      user.setPushNotificationFormat(new java.lang.Short(alUser.pushNotificationFormat));
    } else {
      user.setPushNotificationFormat(new java.lang.Short(0));
    }

    const User = com.applozic.mobicomkit.api.account.user.User;
    const RegistrationResponse = com.applozic.mobicomkit.api.account.register.RegistrationResponse;
    let arg: java.lang.Void;
    arg = null;

    const ctx = this._getAndroidContext();
    com.applozic.mobicomkit.Applozic.init(ctx, alUser.applicationId);

    const listener = new com.applozic.mobicomkit.api.account.user.UserLoginTask.TaskListener({
      onSuccess: (registrationResponse: any, context: any) => {
        successCallback(registrationResponse);
        return true;
      },

      onFailure: (response: any, exception: any) => {
        if (response === 'undefined') {
          errorCallback(exception);
        } else {
          errorCallback(response);
        }
        return true;
      }
    });

    const task = new com.applozic.mobicomkit.api.account.user.UserLoginTask(user, listener, ctx);
    task.execute(arg);
  }

  public registerForPushNotification(successCallback, errorCallback) {
    const ctx = this._getAndroidContext();
    const args = (java.lang.Void = null);

    const listener = new com.applozic.mobicomkit.api.account.user.PushNotificationTask.TaskListener({
      onSuccess: (response: any) => {
        successCallback(response);
      },

      onFailure: (response: any, exception: any) => {
        if (exception === 'undefined') {
          errorCallback(response);
        } else {
          errorCallback(exception);
        }
      }
    });

    const task = new com.applozic.mobicomkit.api.account.user.PushNotificationTask(
      com.applozic.mobicomkit.Applozic.getInstance(ctx).getDeviceRegistrationId(),
      listener,
      ctx
    );
    task.execute(args);
  }

  public launchChat() {
    const ctx = this._getAndroidContext();
    const intent = new android.content.Intent(
      ctx,
      com.applozic.mobicomkit.uiwidgets.conversation.activity.ConversationActivity.class
    );
    if (com.applozic.mobicomkit.ApplozicClient.getInstance(ctx).isContextBasedChat()) {
      intent.putExtra(com.applozic.mobicomkit.uiwidgets.conversation.ConversationUIService.CONTEXT_BASED_CHAT, true);
    }
    intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
    ctx.startActivity(intent);
  }

  public isLoggedIn(successCallback: any, errorCallback: any) {
    const ctx = this._getAndroidContext();

    if (com.applozic.mobicomkit.api.account.user.MobiComUserPreference.getInstance(ctx).isLoggedIn()) {
      successCallback('true');
    } else {
      successCallback('false');
    }
  }

  public launchChatWithUserId(userId: any) {
    const ctx = this._getAndroidContext();

    const intent = new android.content.Intent(
      ctx,
      com.applozic.mobicomkit.uiwidgets.conversation.activity.ConversationActivity.class
    );
    intent.putExtra('userId', userId);
    intent.putExtra('takeOrder', true);
    intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);

    ctx.startActivity(intent);
  }

  public launchChatWithGroupId(groupId: number, successCallback, errorCallback) {
    const ctx = this._getAndroidContext();
    const args = (java.lang.Void = null);
    const listener = new com.applozic.mobicomkit.uiwidgets.async.AlGroupInformationAsyncTask.GroupMemberListener({
      onSuccess: (response: any, context: any) => {
        const intent = new android.content.Intent(
          context,
          com.applozic.mobicomkit.uiwidgets.conversation.activity.ConversationActivity.class
        );
        intent.putExtra('groupId', response.getKey().intValue());
        intent.putExtra('takeOrder', true);
        intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
        successCallback(response);
      },

      onFailure: (response: any, exception: any, context: any) => {
        if (response === 'undefined' || response === null) {
          errorCallback('Error in launching group');
        } else {
          errorCallback('Error in launching group');
        }
      }
    });

    const task = new com.applozic.mobicomkit.uiwidgets.async.AlGroupInformationAsyncTask(
      ctx,
      new java.lang.Integer(groupId),
      listener
    );
    task.execute(args);
  }

  public logout(successCallback: any, errorCallback: any) {
    const ctx = this._getAndroidContext();
    const args = (java.lang.Void = null);

    const listener = new com.applozic.mobicomkit.api.account.user.UserLogoutTask.TaskListener({
      onSuccess: (context: any) => {
        successCallback('Successfully logged out');
      },

      onFailure: (exception: any) => {
        errorCallback('Failed to logout');
      }
    });

    const task = new com.applozic.mobicomkit.api.account.user.UserLogoutTask(listener, ctx);
    task.execute(args);
  }

  public showAllRegisteredUsers(showAll: boolean) {
    if (showAll) {
      const ctx = this._getAndroidContext();
      com.applozic.mobicomkit.uiwidgets.ApplozicSetting.getInstance(ctx).enableRegisteredUsersContactCall();
    }
  }

  public createGroup(groupInfo: any, successCallback: any, errorCallback: any) {
    const ctx = this._getAndroidContext();
    const gsonUtils = com.applozic.mobicommons.json.GsonUtils;
    let channelInfo = com.applozic.mobicomkit.api.people.ChannelInfo;

    channelInfo = gsonUtils.getObjectFromJson(JSON.stringify(groupInfo), channelInfo.class); // this returns object, needs to convert to ChannelInfo object

    const group = com.applozic.mobicommons.people.channel.Channel;
    const listener = new com.applozic.mobicomkit.uiwidgets.async.AlChannelCreateAsyncTask.TaskListenerInterface({
      onSuccess: (channel, context) => {
        successCallback(JSON.parse(gsonUtils.getJsonFromObject(channel, group.class)));
      },

      onFailure: (response, context) => {
        errorCallback(gsonUtils.getJsonFromObject(response, com.applozic.mobicomkit.feed.ChannelFeedApiResponse.class));
      }
    });

    new com.applozic.mobicomkit.uiwidgets.async.AlChannelCreateAsyncTask(ctx, channelInfo, listener).execute(null);
  }

  public addContacts(contacts: any) {
    const ctx = this._getAndroidContext();

    const gsonUtils = com.applozic.mobicommons.json.GsonUtils;
    contacts.forEach(user => {
      new com.applozic.mobicomkit.contact.AppContactService(ctx).upsert(
        gsonUtils.getObjectFromJson(JSON.stringify(user), com.applozic.mobicommons.people.contact.Contact.class)
      );
    });
  }

  public showOnlyMyContacts() {
    const ctx = this._getAndroidContext();
    com.applozic.mobicomkit.ApplozicClient.getInstance(ctx).enableShowMyContacts();
  }

  /**
   * Helper method to ensure context usage.
   */
  private _getAndroidContext() {
    const ctx = app.android.context;
    if (ctx === null) {
      setTimeout(() => {
        this._getAndroidContext();
      }, 200);
      return;
    } else {
      return ctx;
    }
  }
}
