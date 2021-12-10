import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'src/Services/LoaderService';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/Services/CommonService';
import { RemoteHelper } from 'src/Services/RemoteHelper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ng2-cookies';
import { CommonComponent } from 'src/Services/CommonComponent';

@Component({
  selector: 'app-e-story-editing',
  templateUrl: './e-story-editing.component.html',
  styleUrls: ['./e-story-editing.component.css']
})
export class EStoryEditingComponent extends CommonComponent {
  storySelected: any;
  storyEditForm: any;
  storyIdToUpdate: any;
  editedStory: any;
  storyContent: any;


  constructor(
    private formBuilder: FormBuilder,
    loaderService: LoaderService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    parentRouter: Router,
    public remoteHelper: RemoteHelper,
    modalService: NgbModal,
    public cookieService: CookieService,
  ) {
    super(commonService, remoteHelper, loaderService, parentRouter, modalService,cookieService);
    super.ngOnInit();
  }

  ngOnInit() {

    this.storyEditForm = this.formBuilder.group({
      storyId: ['', []],
      userId: ['', []],
      editedStory: ['', [Validators.required]],
    });

    this.route.queryParams.subscribe(params => {
      this.storyIdToUpdate = params['story'];
      if (this.storyIdToUpdate != null) {
        this.getStoryById(this.storyIdToUpdate);
      }
    });
  }

  getStoryById(storyId: any) {
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "getStoryById",
      "requestData": {
        storyId: storyId
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeUnEditStoryProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }


  getEditedStoryByStoryId(storyId: any) {
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "getEditedStoryByStoryId",
      "requestData": {
        storyId: storyId
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeEditStoryProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }


  onSubmitEditedStory() {
    this.storySelected.storyContent = this.storyEditForm.value.editedStory;
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "saveEdittedBySupervisorStory",
      "requestData": {
        userId: this.user.userId,
        fullName: this.user.fullname,
        edittedStory: this.storySelected
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeUnEditStoryProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeUnEditStoryProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.storyContent = "";
    this.storySelected = {};


    this.storySelected = response.returnData;
    console.log(this.storySelected);
    if (this.storySelected.edited == false) {
      this.storyContent = this.storySelected.storyContent;
    } else {
      alert(this.storySelected.edited)
      this.getEditedStoryByStoryId(this.storySelected.storyId);

    }
    // if(this.storySelected)
  }



  completeEditStoryProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.storyContent = "";
    this.storySelected = {};

    this.storySelected = response.returnData[0];
    console.log(this.storySelected);
    this.storyContent = this.storySelected.storyContent;
  }
}
