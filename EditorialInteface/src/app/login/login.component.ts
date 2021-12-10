import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { CommonComponent } from '../../Services/CommonComponent';
import { CommonService, CustomConfirmationModal, AppUser } from '../../Services/CommonService';
import { LoaderService } from '../../Services/LoaderService';
import { RemoteHelper } from '../../Services/RemoteHelper';
import { MatDialog } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends CommonComponent {
  loginForm: FormGroup;
  loading = false;
  loginObject: any;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public commonService: CommonService,
    public helper: RemoteHelper,
    public loaderService: LoaderService,
    protected parentRouter: Router,
    public modalService: NgbModal,
    public cookieService: CookieService
  ) {
    super(commonService, helper, loaderService, parentRouter, modalService, cookieService);
    super.ngOnInit();
    this.title = 'Login'
  }

  ngOnInit() {
    super.ngOnInit()
    this.loginObject = {}//i think it receives the form object names/values
    this.loginForm = this.formBuilder.group({//this picks form info
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    
    let requestData = {
      username: this.loginObject['username'],
      password: this.loginObject['password']
    }

    let postData ={
      "service" : "AuthenticationRS",
      "requestType" : "loggin",
      "requestData" : requestData
    }
    let controller = this;
    this.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,//Block ui
      function (response) {
        controller.completeLoginProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }


  completeLoginProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    let respData = response.returnData;
    if(respData!=null){
    this.user.userId = respData.userId;
    this.user.username = respData.username;
    this.user.authenticationToken = respData.authenticationToken;
    this.user.fullname = respData.firstName + ' ' + respData.lastName;
    this.user.userData = respData;

    if(respData.permissionsList.length>0){
      for(let perm of respData.permissionsList){
        this.user.permissions.push(perm.permissionName);
      }
      this.commonService.setLoginStatus(true);
    }else{
      let modalContent = {
        title: 'Administrative notice',
        message: 'You have no permissions on this system, access denied'
      }
      this.showDialog(modalContent);
      return;
    }
    this.goto('user-profile');
  }
   
    let loginController = this;
    //Set idle state check to five minutes
    let duration = 300;
    // duration = 10;
    this.commonService.appComponent.setupIdleStateDetection(duration, function () {
      //Logout
      loginController.commonService.appComponent.logout();
    });
  }
}
