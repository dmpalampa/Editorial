import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { RemoteHelper } from './RemoteHelper';
import { CookieService } from 'ng2-cookies';
import { JsonConvert, JsonObject, JsonProperty } from 'json2typescript';
import { AppComponent } from '../app/app.component';
import { NumberFormatStyle } from '@angular/common';

@Injectable()
export class CommonService {
  public user: BehaviorSubject<AppUser>;
  // public msg: BehaviorSubject<MessagesHelper>;
  public confirmationModal: BehaviorSubject<CustomConfirmationModal>;
  public messageModal: BehaviorSubject<CustomMessageModal>;
  // public messageModal: BehaviorSubject<CustomMessageModal>;
  // public promptModal: BehaviorSubject<CustomPromptModal>;
  appComponent: AppComponent;
  customModalMode: string;
  customModalData: any;


  cookies: Object;
  keys: Array<string>;
  cName: string;
  cValue: string;
  rName: string;
  checkName: string;
  private helper: RemoteHelper;


  constructor(helper: RemoteHelper,
    public cookieService: CookieService) {
    this.helper = helper;
    var appUser = new AppUser();

    this.user = new BehaviorSubject<AppUser>(appUser);
    // this.msg = new BehaviorSubject<MessagesHelper>(new MessagesHelper());
    this.confirmationModal = new BehaviorSubject<CustomConfirmationModal>(new CustomConfirmationModal());
    this.messageModal = new BehaviorSubject<CustomMessageModal>(new CustomMessageModal());
    //
    // this.promptModal = new BehaviorSubject<CustomPromptModal>(new CustomPromptModal());



    let converter = new JsonConvert();
    if (this.cookieService.check("loggedInUser")) {
      let loggedInUser = this.cookieService.get("loggedInUser");
      console.log("Going to laod from " + loggedInUser)
      // this.user.next(JsonConvert.deserializeString(loggedInUser, AppUser));
      let parsed = JSON.parse(loggedInUser);
      this.user.next(converter.deserializeObject(parsed, AppUser));
      //Evaluate permissions
      this.user.getValue().evaluatePermissions();
    }
  }

  // getMsg() {
  //   return this.msg;
  // }

  /**
   * Returns a pair of usernam and token to be included in subsequent server requests
   * @returns {any}
   */
  public getUserRequestCredentials() {
    var credentials: any = {};
    if (!this.user) {
      return credentials;
    }

    credentials.username = this.user.getValue().username;
    credentials.token = this.user.getValue().authenticationToken;
    // credentials.username = "david";
    // credentials.token = "8442207a8d8192f7ea78cb82bc1b3059";
    credentials.userData = this.user.getValue().userData
    return credentials;
  }

  public setLoginStatus(status) {
    this.user.getValue().setLoggedIn(status)
    if (!status) {
      //Logout should reset all values to nothing
      this.user.getValue().username = null
      this.user.getValue().password = ""
      this.user.getValue().permissions = []
      this.removeCookie("loggedInUser")
    } else {
      //Set user cookie
      this.addCookie("loggedInUser", JSON.stringify(this.user.getValue()))
      //Setup the menus
      // this.appComponent.setupMenus();
    }
  }

  public setUserAttributes(userObject) {
    this.user.getValue().authenticationToken = userObject.authenticationToken;
    this.user.getValue().fullname = userObject.fullname;
    this.user.getValue().mobileNumber = userObject.mobileNumber;
    this.user.getValue().permissions = userObject.permissions;
    this.user.getValue().userLevel = userObject.userLevel;
    this.user.getValue().username = userObject.username;
    this.user.getValue().password = "";

    this.user.getValue().evaluatePermissions();
  }

  isValidPhone(phone: string) {
    return /^(0|256)(7[178095]|39)\d{7}$/.test(phone);
  }

  numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  updateCookies() {
    this.cookies = this.cookieService.getAll();
    this.keys = Object.keys(this.cookies);
  }

  addCookie(cName: string, cValue: string) {
    this.helper.logDevMode('Adding: ' + cName + ' ' + cValue);
    this.cookieService.set(cName, cValue);
    this.updateCookies();
  }

  removeCookie(rName: string) {
    this.helper.logDevMode('Removing: ' + rName);
    this.cookieService.delete(rName);
    this.updateCookies();
  }

  removeAll() {
    this.helper.logDevMode('Removing all cookies');
    this.cookieService.deleteAll();
    this.updateCookies();
  }

  checkCookie() {
    this.helper.logDevMode('Checking: ' + this.checkName);
    console.log(this.cookieService.check(this.checkName));
    // window.alert('Check cookie ' + this.checkName + ' returned ' + this.cookieService.check(this.checkName));
  }

}

@JsonObject
export class AppUser {
  @JsonProperty("userId", Number, true)
  userId: string = undefined;

  @JsonProperty("username", String, true)
  username: string = undefined;

  @JsonProperty("password", String, true)
  password: string = undefined;

  @JsonProperty("loggedIn", Boolean, true)
  loggedIn: boolean = undefined;

  @JsonProperty("fullname", String, true)
  fullname: string = undefined;

  @JsonProperty("permissions", [], true)
  permissions: any = undefined;

  @JsonProperty("authenticationToken", String, true)
  authenticationToken: any = undefined;

  @JsonProperty("mobileNumber", String, true)
  mobileNumber: string = undefined;

  @JsonProperty("userLevel", String, true)
  userLevel: string = undefined;

  @JsonProperty("userData", Object, true)
  userData: any = undefined;

  //Permission checkers
  @JsonProperty("canAddUser", Boolean, true)
  canAddUser: boolean = false;

  @JsonProperty("canDeleteUser", Boolean, true)
  canDeleteUser: boolean = false;

  @JsonProperty("canManageRoles", Boolean, true)
  canManageRoles: boolean = false;

  @JsonProperty("canSystemAdmin", Boolean, true)
  canSystemAdmin: boolean = false;

  @JsonProperty("canResetUserPassword", Boolean, true)
  canResetUserPassword

  @JsonProperty("isEditorialAdmin", Boolean, true)
  isEditorialAdmin: boolean = false;

  @JsonProperty("canViewReportingStatistics", Boolean, true)
  canViewReportingStatistics: boolean = false;

  @JsonProperty("isAdmin", Boolean, true)
  isAdmin: boolean = false;

  @JsonProperty("isSupervisor", Boolean, true)
  isSupervisor: boolean = false;

  @JsonProperty("isEditor", Boolean, true)
  isEditor: boolean = false;

  @JsonProperty("isSubEditor", Boolean, true)
  isSubEditor: boolean = false;

  @JsonProperty("isReporter", Boolean, true)
  isReporter: boolean = false;

  @JsonProperty("isChiefSubEditor", Boolean, true)
  isChiefSubEditor: boolean = false;

  @JsonProperty("canAddStory", Boolean, true)
  canAddStory: boolean = false;

  @JsonProperty("canEditStory", Boolean, true)
  canEditStory: boolean = false;

  @JsonProperty("canViewOwnStory", Boolean, true)
  canViewOwnStory: boolean = false;

  constructor() {
    this.username = '';
    this.password = "";
    this.loggedIn = false;
    this.permissions = []
  }

  setLoggedIn(status) {
    this.loggedIn = status;

    if (!status) {
      //Not logged in, clear fields
      this.username = null;
      this.fullname = null;
      this.password = "";
      this.permissions = [];
    }
    this.evaluatePermissions();


  }

  public evaluatePermissions() {
    //Permission evaluations
    //Admin
    this.isAdmin = this.checkRequiredPermission('is_admin');
    this.canResetUserPassword = this.checkRequiredPermission('reset_user_password');
    this.canAddUser = this.checkRequiredPermission('add_user');
    this.canDeleteUser = this.checkRequiredPermission('delete_user');
    this.canManageRoles = this.checkRequiredPermission('manage_roles');
    this.canSystemAdmin = this.checkRequiredPermission('admin_level');

    //Editorial Admin
    this.isEditorialAdmin = this.checkRequiredPermission('is_editorial_admin');
    this.canViewReportingStatistics = this.checkRequiredPermission('view_reporting_statistics');

    //Reporter
    this.isReporter = this.checkRequiredPermission('is_reporter');
    this.canAddStory = this.checkRequiredPermission('add_story');
    this.canViewOwnStory = this.checkRequiredPermission('view_own_story');

    //Editor
    this.canViewOwnStory = this.checkRequiredPermission('view_own_story');
    this.canEditStory = this.checkRequiredPermission('edit_story');

    this.isChiefSubEditor = this.checkRequiredPermission('is_cheifsubeditor');
    this.isEditor = this.checkRequiredPermission('is_editor');

    this.isSubEditor = this.checkRequiredPermission('is_subeditor');

    //Permission for pride approval of wave transactions
  }

  private checkRequiredPermission(permission) {
    if (this.permissions && this.permissions.indexOf(permission) < 0) {
      // this.showError("Required permission for this action is missing")
      return false;
    }
    return true;
  }
}

export class CustomConfirmationModal {
  title: string;
  confirmationText: string;
  onclose: any;
  onconfirm: any;

  //To be shared to display root modals :)
  appComponent: AppComponent;
  confirmButton: string;
  cancelButton: string;

  constructor() {
    this.title = "Are you sure?"
    this.confirmationText = "Please confirm action"
  }

  setCloseHandler(handler) {
    this.onclose = function () {
      //Close and run handler
      this.appComponent.customModal.close();
      if (handler) handler();
    }
  }

  setConfirmHandler(handler) {
    this.onconfirm = function () {
      //Close and run handler
      this.appComponent.customModal.close();
      if (handler) handler();
    }
  }

}

export class CustomMessageModal {
  title: string;
  text: string;
  onclose: any;
  hasError: boolean = false;

  //To be shared to display root modals :)
  appComponent: AppComponent;
  closeButton: string;

  constructor() {
    this.title = "Are you sure?"
    this.text = "Please confirm action"
  }

  setCloseHandler(handler) {
    this.onclose = function () {
      //Close and run handler
      this.appComponent.customModal.close();
      if (handler) handler();
    }
  }

}

export class MessagesHelper {
  error: string;
  message: string;
  warning: string;

  public clear() {
    this.error = null;
    this.message = null;
    this.warning = null;
  }

  public showError(error) {
    this.message = null;
    this.warning = null;
    this.error = error;
  }

  public showMessage(msg) {
    this.message = msg;
    this.warning = null;
    this.error = null;
  }

  public showWarning(warning) {
    this.message = null;
    this.warning = warning;
    this.error = null;
  }
}
