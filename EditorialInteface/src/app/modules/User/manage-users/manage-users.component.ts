import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonComponent } from 'src/Services/CommonComponent';
import { LoaderService } from 'src/Services/LoaderService';
import { CommonService } from 'src/Services/CommonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from './user';
import { RemoteHelper } from 'src/Services/RemoteHelper';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CookieService } from 'ng2-cookies';
import { resizeStart } from '@syncfusion/ej2-richtexteditor';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationService } from 'primeng/api';

interface Role {
  roleName: any;
  roleId: any;
}

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent extends CommonComponent {
  @ViewChild('fileInput') fileInput;

  valueOfTheForm: Subscription;
  displayDialog: boolean;
  userAccountantStatusDisplay: boolean;
  _user: { [s: string]: User; } = {};
  selectedUser: User;
  newUser: boolean;
  userList: any[];
  public selectedRole: {};
  cols: any[];
  changePassWordForm: any;
  userAccountStatusForm: any;
  userForm: any;
  submitted = false;
  roles: any[];
  user: any;
  userIdToEdit: any;
  userFullname: any;
  selectedStory: User;
  seletedRole: Role;
  userStatus: boolean;
  rolesList: any[] = [];
  AddUser: Boolean = false;
  totalRecords: number;
  menuItem: {};
  filteredRoles: any[];
  storyCategories: any[] = [];
  filteredCategories = [];
  displayChangeUserPass: boolean;
  clonedCars: { [s: string]: any; } = {};
  storyCategoryToEdit: any;
  isEditor: boolean = false;
  submitButonText: any = 'Submit';
  userModalHeader: any;
  userAccountStatus: boolean = true;

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
    this.userForm = this.formBuilder.group({
      userId: ['',],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      userRole: ['', [Validators.required]],
      storyCategory: ['',],
    });
    this.changePassWordForm = this.formBuilder.group({
      userId: ['',],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });

    // this.userAccountStatusForm = this.formBuilder.group({
    //   userId: ['',],
    //   status: ['',],
    // });

    this.getAllUsers();

    this.cols = [
      { field: 'firstName', header: 'Full Name' },
      { field: 'username', header: 'User name' },
      { field: 'role', header: 'role' },
    ];

    this.menuItem = [
      { label: 'User Details', icon: 'pi pi-check-circle', command: (event) => this.onRowEditInit(this.selectedUser) },
      { label: 'Reset Password', icon: 'pi pi-info-circle', command: (event) => this.prepareChangeUserPassword(this.selectedUser) },
      { label: 'User Account Lock status', icon: 'pi pi-check-circle', command: (event) => this.changeUserActivityStatus(this.selectedUser) },
    ];

    this.valueOfTheForm = this.userForm.valueChanges.subscribe(value => {
      const inputFields = this.el.nativeElement;
      inputFields.classList.toggle('ui-state-filled', value);
    });
  }

  ngOnDestroy() {
    this.valueOfTheForm.unsubscribe();
  }

  uploadFile() {
    let formData = new FormData();
    formData.append('file', this.fileInput.nativeElement.files[0]);
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "getStoryCategory",
      "requestData": null
    }
    controller.sendRequestToServer(
      "user_service/UploadExcel/",
      formData,
      true,
      function (response) {
        controller.completeGetStoryCategoryProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }


  onRoleSelected(event) {
    this.filteredCategories = [];
    this.storyCategories = [];
    this.userForm.controls['storyCategory'].setValue(this.filteredCategories[0]);
    if (event.roleName == 'editor') {
      this.getStoryCategories();
      this.isEditor = true;
    }
  }

  getStoryCategories() {
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "getStoryCategory",
      "requestData": null
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeGetStoryCategoryProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeGetStoryCategoryProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.filteredCategories = [];
    this.storyCategories = [];
    this.storyCategories = response.returnData;
    this.filteredCategories = response.returnData;
  }

  changeUserActivityStatus(user: any) {
    this.userAccountStatus =user.status
    this.userStatus = user.status;
    let state = user.status ? 'Active' : 'Locked Out';
    this.userFullname = user.lastName + ' ' + user.firstName + ' is currently ' + state;
    this.userAccountantStatusDisplay = true;
  }


  
  confirmChangeUserAccountStatus(user: any) {
    this.userAccountantStatusDisplay = false;
    this.confirmationService.confirm({
      message: 'Are you sure you want to '+ user.status ? 'Lock Out' : 'Un Lock' +this.selectedUser.firstName,
      header: 'Confim Change User Account Status',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this. onSubmitAccountStatusChange();
      },
    });
  }

  

  onSubmitAccountStatusChange() {
    let userId = this.selectedUser.userId;
    if (userId != null) {
      if (window.confirm("Are sure want to change Account status for user " + this.userFullname)) {
        let controller = this;
        let postData = {
          "service": "UsersRS",
          "requestType": "changeUserActivityStatus",
          "requestData": {status:  this.userAccountStatus,
            userId: this.selectedUser.userId
          }
        }
        controller.sendRequestToServer(
          "user_service/AllService/",
          JSON.stringify(postData),
          true,
          function (response) {
            controller.completeChangeUserAccountStatusServerProcess(response);
          },
          function (err) {
            controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
          }
        );
      }
      else {
        this.makeDialogDispalFalse();
      }
    }
    else {
      alert("Technical error detected, Please contact site admin for help");
      this.userAccountantStatusDisplay = true;
    }
  }


  completeChangeUserAccountStatusServerProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    this.displayDialog = false;
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
    if (response.returnData != null) {
      this.userList = []
      this.userList = response.returnData;
      this.totalRecords = this.userList.length;
    }
    this.makeDialogDispalFalse();
  }


 


  onSubmitPasswordChange() {
    let controller = this;
    let postData = {
      "service": "UsersRS",
      "requestType": "changePassword",
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
    this.displayDialog = false;
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
    this.makeDialogDispalFalse();
  }



  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    console.log(this.userForm.value);
    if (this.userForm.invalid) {
      alert("Errors detected in form. Please check and resubmit")
      return;
    } else {
      this.user = this.userForm.value;
      this.addUser(this.user);
      this.resetForm();
      this.displayDialog = false;
    }
  }


  onRowSelect(event) {
    this.newUser = false;
    this._user = this.cloneUser(event.data);
    this.onRowEditInit(this._user);
    this.isEditor = false;
  }

  onRowEditInit(user: any) {
    this.submitButonText = 'Update';
    this.userModalHeader = 'Update User Profiles'
    console.log(user);
    this.getRoles();
    if (user) {
      this.user = this.cloneUser(user);
      this.selectedRole = { label: user.role, value: user.roleId + "," + user.role };
      this.userForm.controls["userId"].setValue(this.user.userId);
      this.userForm.controls["firstName"].setValue(this.user.firstName);
      this.userForm.controls["lastName"].setValue(this.user.lastName);
      this.userForm.controls["userName"].setValue(this.user.username);
      this.filteredRoles = [];
      if (this.user.userRole) {
        this.filteredRoles.push(this.user.userRole);

        this.userForm.controls["userRole"].setValue(this.filteredRoles[0]);

        this.filteredCategories = [];
        if (this.user.editorOfCategoryEntity) {
          this.filteredCategories.push(this.user.editorOfCategoryEntity);
          console.log(this.filteredCategories);
        }
        this.userForm.controls["storyCategory"].setValue(this.filteredCategories[0]);
      }

      //this.openModal(content);
      this.displayDialog = true;
    } else {
      alert("Technical error!!: selected user cant be identified. please contact Administrator.")
    }
  }


  cloneUser(c: any): any {
    let user = {};
    for (let prop in c) {
      user[prop] = c[prop];
    }
    return user;
  }

  addNewUser() {
    this.resetForm();
    this.userIdToEdit = "";
    //this.openModal(content);
  }

  openModal(content) {
    this.modalService.open(content, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
  }

  makeDialogDispalFalse() {
    this.resetForm();
    this.userAccountantStatusDisplay = false;
    this.displayChangeUserPass = false;
    this.displayDialog = false;
  }

  addUser(user: any) {
    console.log(user);
    if (user.userName.indexOf('@ug.nationmedia.com') != -1) {
      user.username = user.username + '@ug.nationmedia.com';
    }
    let controller = this;
    let postData = {
      "service": "UsersRS",
      "requestType": "saveUser",
      "requestData": user
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeAddUserServerProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeAddUserServerProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    this.displayDialog = false;
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
    this.userList = response.returnData;
    this.totalRecords = this.userList.length;
    this.makeDialogDispalFalse();
  }

  refreshPage() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userList = [];
    let controller = this;
    let postData = {
      "service": "UsersRS",
      "requestType": "getAllUsers",
      "requestData": null
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeServerProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  getRoles() {
    let controller = this;
    let postData = {
      "service": "UsersRS",
      "requestType": "getUserRoles",
      "requestData": null
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeGetUserRolesProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }


  


  completeServerProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    this.displayDialog = false;
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    if (response.returnData != null) {
      this.userList = []
      this.userList = response.returnData;
      this.totalRecords = this.userList.length;
    }
    this.makeDialogDispalFalse();
  }




  completeGetUserRolesProcess(response) {
    // console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.rolesList = [];
    this.rolesList = response.returnData;
    this.roles = [];
    if (this.newUser)
      this.roles.push({ label: 'Select Gender', value: '' });

    for (let i of this.rolesList) {
      this.roles.push({ label: i.roleName.substring(3), value: i.roleId + "," + i.roleName });
    }
    console.log(this.rolesList);
  }


  filterCategories(event) {
    this.filteredCategories = [];
    for (let i = 0; i < this.storyCategories.length; i++) {
      let category = this.storyCategories[i];
      if (category.categoryName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredCategories.push(category);
      }
    }
  }


  filterRoles(event) {
    console.log(this.rolesList);
    this.filteredRoles = [];
    if (this.rolesList.length > 0) {
      for (let i = 0; i < this.rolesList.length; i++) {
        let role = this.rolesList[i];
        if (role.roleName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
          this.filteredRoles.push(role);
        }
      }
    }
  }


  showDialogToAdd() {
    this.resetForm();
    this.newUser = true;
    this.user = {};
    this.getRoles();
    this.displayDialog = true;
    this.submitButonText = 'Submit';
    this.userModalHeader = 'Create New User';
  }


  confirmChangePassword() {
    this.displayChangeUserPass = false;
    this.confirmationService.confirm({
      message: 'Are you sure you reset password for '+this.selectedUser.firstName,
      header: 'Confim Password Change',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onSubmitPasswordChange();
        this.changePassWordForm.reset();
      },
    });
  }

  prepareChangeUserPassword(user: any) {
    this.changePassWordForm.controls["userId"].setValue(user.userId);
    this.displayChangeUserPass = true;
  }

  resetForm() {
    this.userForm.reset();
  }

}

