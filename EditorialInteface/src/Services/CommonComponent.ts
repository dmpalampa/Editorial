import { AppUser, CommonService, MessagesHelper } from './CommonService';
import { OnInit } from '@angular/core';
import { RemoteHelper } from './RemoteHelper';
import { Router } from '@angular/router';
import { LoaderService } from './LoaderService';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomDialogComponent } from '../app/dialogs/custom-dialog/custom-dialog.component';
import {CookieService} from 'ng2-cookies';

export class CommonComponent implements OnInit {

  public messageHelper: MessagesHelper;
  public showLoader: boolean;
  public user: AppUser;
  public title;

  public paymentTypes: any;

  // public paymentTypesSettings: IMultiSelectSettings;

  constructor(public commonService: CommonService,
    public helper: RemoteHelper,
    public loaderService: LoaderService,
    protected parentRouter: Router,
    public modalService: NgbModal,
    public cookieService: CookieService
  ) {

  }

  /**
   * Subscribe to all shared services
   */
  ngOnInit() {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });

    this.commonService.user.subscribe((val: AppUser) => {
      this.user = val;
    });
  }


  public openInNewTab(url) {
    console.log('Openning ' + url)
    var win = window.open(url, '_blank');
    win.focus();
  }


  /**
   * Will check if a required permission exists on user
   * @param permission
   * @returns {boolean}
   */
  public checkRequiredPermission(permission) {
    console.log('Checking permission ' + permission + ' against ' + JSON.stringify(this.user.permissions))
    if (!this.user || !this.user.permissions) {
      //User or permissions are unset
      console.log('user or permisions isnt set')
      return false;
    }
    if (!this.user.permissions.includes(permission)) {
      // this.showError("Required permission for this action is missing")
      console.log('permission ' + permission + ' is missing in ' + JSON.stringify(this.user.permissions))
      return false;
    }

    console.log('permission ' + permission + ' exists in ' + JSON.stringify(this.user.permissions))
    return true;
  }

  protected sendRequestToServer(service: string, requestData: any, blockui: boolean, responseHandler: any, errorHandler: any) {
    if (blockui) {
      // this.clearMessages();
      this.showLoading();
    }

    let _requestData = JSON.parse(requestData);
   
    if (this.cookieService.check("loggedInUser")) {
      let loggedInUser =  this.cookieService.get("loggedInUser");
      let _loggedInUser=  JSON.parse(loggedInUser);
      _requestData['authenticationToken'] = _loggedInUser.authenticationToken;
    }

    console.log(_requestData);

    let requestOperation: Observable<any> = this.helper.sendPostToServer(service, JSON.stringify(_requestData));

    var controller = this;
    requestOperation.subscribe(
      response => {
        controller.hideLoading();
        if (responseHandler) responseHandler(response)
      },
      err => {
        // Log errors if any
        controller.hideLoading();
        if (!errorHandler) {
          this.showDialog({ title: "Connection Error", message: "failed to connect to server" })
        }
        else {
          errorHandler(err)
        }
      })
  }


  formatAmount(amount: string) {
    return (Number(amount)).toLocaleString('en')
  }


  /**
   * Show laoding spinner
   */
  showLoading() {
    // this.clearMessages(); //When showing, clear all errors
    this.loaderService.display(true);
  }

  /**
   * Hide loading spinner
   */
  hideLoading() {
    this.loaderService.display(false);
  }

  showError(e) {
    this.messageHelper.showError(e)
  }

  showMessage(e) {
    this.messageHelper.showMessage(e)
  }

  showWarning(e) {
    this.messageHelper.showWarning(e)
  }

  clearMessages() {
    this.messageHelper.clear();
  }

  goto(route) {
    this.parentRouter.navigateByUrl(route);
  }

  isEmpty(text) {
    if (text == null) return true;
    return text == '';
  }

  showDialog(data) {
    const modalRef = this.modalService.open(CustomDialogComponent);
    modalRef.componentInstance.data = data;
  }

  logDev(data) {
    console.log("ret: \n" + data)
  }
}
