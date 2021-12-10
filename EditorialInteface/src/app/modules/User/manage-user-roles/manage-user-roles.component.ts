import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonComponent } from 'src/Services/CommonComponent';
import { LoaderService } from 'src/Services/LoaderService';
import { CommonService } from 'src/Services/CommonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemoteHelper } from 'src/Services/RemoteHelper';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-manage-user-roles',
  templateUrl: './manage-user-roles.component.html',
  styleUrls: ['./manage-user-roles.component.css']
})
export class ManageUserRolesComponent extends CommonComponent {

  rolesForm: any;
  submitted = false;
  optionsSelect: Array<any>;
  rolesList: any[];
  cols: any[];
  rolePermissions = [];
  totalRecords: number;
  existingRoles: any[];
  existingRolePermissions: any[];
  roleId = null;
  refreshPage_ = false;
  displayRoleModal: boolean= false;

  constructor(
    private formBuilder: FormBuilder,
    loaderService: LoaderService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    parentRouter: Router,
    public remoteHelper: RemoteHelper,
    modalService: NgbModal,
    public cookieService: CookieService
  ) {
    super(commonService, remoteHelper, loaderService, parentRouter, modalService, cookieService);
    super.ngOnInit();
  }

  ngOnInit() {
    this.rolesForm = this.formBuilder.group({
      roleName: ['', [Validators.required]],
      description: ['',],
      permissionName: ['',],
      permissionName2: ['',],
    });

    this.getRoles();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.rolesForm.invalid) {
      alert("invlid");
      return;
    }
    let role = {
      roleId: this.roleId,
      role: this.rolesForm.value,
      rolePermissions: this.rolePermissions
    }
    console.log(this.rolePermissions);
    this.AddRoles(role);
    this.displayRoleModal = false;
  }

  AddRoles(role: any) {
    let controller = this;
    let postData = {
      "service": "UsersRS",
      "requestType": "saveUserRoles",
      "requestData": role
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


  AddRolePermissions() {
    if (this.rolesForm.controls["permissionName"].value) {
      let permission = {
        id: null,
        permissionName: this.rolesForm.value.permissionName
      };
      this.rolePermissions.push(permission);
      this.rolesForm.controls["permissionName"].setValue("");
    } else {
      alert("Empty string permission is not allowed")
    }
  }


  deletePermission(index: any, permission: any) {

    if (window.confirm("Do you want to delete: " + permission.permissionName)) {
      this.rolePermissions.splice(index, 1);
      alert(permission.id)
      if (permission.id) {
        let controller = this;
        let postData = {
          "service": "UsersRS",
          "requestType": "deleteRolePermissions",
          "requestData": { permissionId: permission.id }
        }
        controller.sendRequestToServer(
          "user_service/AllService/",
          JSON.stringify(postData),
          true,
          function (response) {
            controller.completePermissionDeleteProcess(response);
          },
          function (err) {
            controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
          }
        );
      }
    }
  }

  UpdateRolePermission(i: any, perm: any) {
    perm.permissionName = this.rolesForm.controls["permissionName2"].value;
    this.rolePermissions.splice(i, 1, perm);
    console.log(perm, perm.permissionName);
  }

  RemoveRolePermission(index: number, permissionName: any) {
    if (window.confirm("Do you want to delete: " + permissionName)) {
      this.rolePermissions.splice(index, 1);
    }
  }

  refreshPage() {
    this.getRoles();
    this.refreshPage_ = false;
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
        controller.completeServerProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeServerProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.rolesList =[];
    this.rolesList = response.returnData;
    this.totalRecords = this.rolesList.length;
    console.log(this.rolesList);
  }


  completePermissionDeleteProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    console.log(this.rolesList);
  }

  openRolesModal() {
    this.displayRoleModal = true;
    // this.modalService.open(content, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', keyboard: false });
  }

  setRoleForEdit(role: any) {
    this.rolePermissions = [];
    this.roleId = null;
    this.rolePermissions = role.permissionsList;
    this.rolesForm.controls["roleName"].setValue(role.roleName);
    this.roleId = role.roleId;

    console.log(this.rolePermissions, role.roleId);
    this.openRolesModal();
    this.refreshPage_ = true;
  }


}


