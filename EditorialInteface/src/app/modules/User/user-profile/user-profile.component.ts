import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonComponent } from 'src/Services/CommonComponent';
import { LoaderService } from 'src/Services/LoaderService';
import { CommonService } from 'src/Services/CommonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemoteHelper } from 'src/Services/RemoteHelper';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CookieService } from 'ng2-cookies';
import { resizeStart } from '@syncfusion/ej2-richtexteditor';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent extends CommonComponent {

  userName: any;
  userRole: any;
  fullName: any;
  changePassWordForm: any;
  displayChangeUserPass: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    loaderService: LoaderService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    parentRouter: Router,
    public helper: RemoteHelper,
    modalService: NgbModal,
    private http: HttpClient,
    private el: ElementRef,
    public cookieService: CookieService,
    public confirmationService: ConfirmationService,
  ) {
    super(commonService, helper, loaderService, parentRouter, modalService, cookieService);
    super.ngOnInit();
  }
  ngOnInit() {
    console.log(this.user);

    this.userName = this.user.userData.username;
    this.userRole = this.user.userData.role;
    this.fullName = this.user.userData.firstName + " " + this.user.userData.lastName;
    console.log(this.userName);

    this.changePassWordForm = this.formBuilder.group({
      userId: ['',],
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onContinueSelected() {
    if (this.user.isAdmin) {
      this.goto('users');
    }
    if (this.user.isEditor) {
      this.goto('e-reported-stories');
    }
    if (this.user.isReporter) {
      this.goto('report-stories');

    }
    if (this.user.isSupervisor) {

    }
  }

  promptChangeUserPassword() {
    this.changePassWordForm.controls["userId"].setValue(this.user.userId);
    this.displayChangeUserPass = true;
  }

  onSubmitPasswordChange() {
    console.log(this.changePassWordForm.value);
    let controller = this;
    let postData = {
      "service": "UsersRS",
      "requestType": "userChangeHisOwnPassword",
      "requestData": this.changePassWordForm.value
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeChangePasswordProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }


  completeChangePasswordProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));

    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    let modalContent = {
      title: 'Success',
      message: response.returnMessage
    }
    this.showDialog(modalContent);
    this.displayChangeUserPass = false;
  }

}
