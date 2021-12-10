import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RemoteHelper } from "../../Services/RemoteHelper";
import { CommonComponent } from 'src/Services/CommonComponent';
import { LoaderService } from 'src/Services/LoaderService';
import { CommonService } from 'src/Services/CommonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-story-category',
  templateUrl: './story-category.component.html',
  styleUrls: ['./story-category.component.css']
})

export class StoryCategoryComponent extends CommonComponent {

  storyCategoryForm: any;
  submitted = false;
  cols: any[];
  storyCategories = [];
  totalRecords: number;
  existingStoryCategories: any[];
  category: any;
  supervisorsList = [];
  filteredSupervisors: any[];
  permanetArray: any[];
  supervisor: any;
  displayStoryCategoryModal: boolean = false;
  selectedCat: any;
  menuItem: any;
  addNewCategory: boolean;
  submitButonText: String='';


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
  }

  ngOnInit() {
    this.storyCategoryForm = this.formBuilder.group({
      categoryName: ['',],
      description: ['',],
      categoryName1: ['',],
      supervisor: ['',],
      supervisor1: ['',],
      description1: ['',],
    });

    this.getStoryCategories();

    this.getUsersByRole();

    this.cols = [
      { field: 'categoryName', header: 'Category' },
      { field: 'supervisorInCharge', header: 'Supervisor' },
      { field: 'description', header: 'Description' },
    ];
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.storyCategoryForm.invalid) {
      alert("your submission has got errors. please check and try again.")
      return;
    } else {
      this.category = this.storyCategories;
      this.AddStoryCategories(this.category);
      this.category=[];
      this.storyCategories =[];
      this.displayStoryCategoryModal = false;
    }
  }

  refreshPage() {
    this.category=[];
    this.storyCategories =[];
    this.getStoryCategories();
    this.getUsersByRole();
  }


  onRowSelect(event) {
    this.submitButonText ='Update';
    this.storyCategories = [];
    this.addNewCategory = false;
    this.storyCategoryForm.reset();
    this.selectedCat = "";
    this.category = this.cloneCategory(event.data);
    console.log(this.category);
    this.storyCategories = [];
    //this.supervisorsList = [];
    //this.filteredSupervisors.push(this.category.supervisorInCharge);
    this.storyCategoryForm.controls["supervisor1"].setValue(this.category.supervisorInCharge);
    this.storyCategories.push(this.category);
    this.displayStoryCategoryModal = true;
  }


  AddStoryCategories(category: any) {
    console.log(category);
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "saveOrUpdateStoryCategory",
      "requestData": { category }
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


  BuildStoryCategoryArray() {
    let categoryName = this.storyCategoryForm.controls["categoryName"].value;
    let description = this.storyCategoryForm.controls["description"].value;
    let supervisor = this.storyCategoryForm.controls["supervisor"].value;
    this.storyCategoryForm.controls["description"].setValue('');
    this.storyCategoryForm.controls["categoryName"].setValue('');

    if (categoryName && description) {
      let cat = {
        categoryId: null,
        categoryName: categoryName,
        description: description,
        supervisorId: supervisor.userId
      };

      this.storyCategories.push(cat);
      categoryName.setValue("");
      description.setValue("");
    } else {
      alert("Empty string category Name is not allowed")
    }
  }

  RemoveCategory(index: number, categoryName: any) {
    if (window.confirm("Do you want to delete: " + categoryName)) {
      this.storyCategories.splice(index, 1);
    }
  }

  UpdateCatgery(index: number, category: any) {
    console.log(category);
    if(this.storyCategoryForm.controls['categoryName1'].value!=null){
    category.categoryName = this.storyCategoryForm.controls['categoryName1'].value;
    }
    if(this.storyCategoryForm.controls['description1'].value!=null){
    category.description = this.storyCategoryForm.controls['description1'].value;
    }
    if(this.storyCategoryForm.controls['supervisor1'].value!=null){
    category.supervisorId = this.storyCategoryForm.controls['supervisor1'].value.userId;
    }
    this.storyCategories.splice(index, 1, category);
    console.log(this.storyCategoryForm.controls['categoryName1'].value);
    console.log(category);
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
    this.existingStoryCategories = [];
    this.existingStoryCategories = response.returnData;
    this.totalRecords = this.existingStoryCategories.length;
    console.log(this.existingStoryCategories);
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
    this.existingStoryCategories = response.returnData;
    console.log(this.existingStoryCategories);
  }

  openModal() {
    this.storyCategories = [];
    this.storyCategoryForm.reset();
    this.displayStoryCategoryModal = true;
  }

  createNewStoryCategory() {
    this.submitButonText ='Submit'
    this.addNewCategory = true;
    this.openModal();
  }


  getUsersByRole() {
    let controller = this;
    let postData = {
      "service": "UsersRS",
      "requestType": "getUsersByRole",
      "requestData": { userRole: 'editor' }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeGetUsersByRoleProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeGetUsersByRoleProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.supervisorsList = [];
    this.permanetArray = [];
    this.supervisorsList = response.returnData;
    this.permanetArray = this.supervisorsList;
    this.filteredSupervisors = this.supervisorsList;
    console.log(this.supervisorsList);
  }


  _filteredSupervisors(event) {
    this.filteredSupervisors = [];
    let query = event.query;
    this.filteredSupervisors = this.filterSupervisor(query, this.permanetArray);
    console.log(this.filteredSupervisors);
    console.log("ng model =" + this.supervisorsList);
  }

  filterSupervisor(query, supervisorsList: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < supervisorsList.length; i++) {
      let supervisor = supervisorsList[i];
      if ((supervisor.firstName.toLowerCase().indexOf(query.toLowerCase()) == 0) || (supervisor.lastName.toLowerCase().indexOf(query.toLowerCase()) == 0)) {
      //if (supervisor.username.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        console.log(supervisor);
        filtered.push(supervisor);
      }
    }
    return filtered;
  }

  cloneCategory(c: any): any {
    let cat = {};
    for (let prop in c) {
      cat[prop] = c[prop];
    }
    return cat;
  }

}


