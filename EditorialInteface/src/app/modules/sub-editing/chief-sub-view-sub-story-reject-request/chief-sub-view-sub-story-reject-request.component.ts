import { Component, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonComponent } from 'src/Services/CommonComponent';
import { LoaderService } from 'src/Services/LoaderService';
import { CommonService } from 'src/Services/CommonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { RemoteHelper } from 'src/Services/RemoteHelper';
import { CookieService } from 'ng2-cookies';
import { OverlayPanel } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/api';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-chief-sub-view-sub-story-reject-request',
  templateUrl: './chief-sub-view-sub-story-reject-request.component.html',
  styleUrls: ['./chief-sub-view-sub-story-reject-request.component.css']
})
export class ChiefSubViewSubStoryRejectRequestComponent extends CommonComponent {

  stories: any[] = [];
  storySelected: any;
  story: any;
  storyTitle: any;
  storyContent: any;
  storyCategory: any;
  dateSubmitted: any;
  storyReporters: any;
  editorSeen: boolean;
  selectedStories: any[] = [];
  subEditorsList = [];
  selectedSubEditor: any = null;
  dateSelected: Date;
  dateForm: any;
  currentdate: Date;
  subEditorId = null;
  pageSubEditor: any;
  cols: any[];
  bookPages: any[];
  filteredPages: any[] = [];
  pageNumber: any = null;
  _cols: any[];
  storyFiles = [];
  storyCommentDisplay: boolean = false;
  commentForm: any;
  comments = [];
  storyId = null;
  storyNumberofWords: number = 0;
  content: any;

  constructor(
    loaderService: LoaderService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    parentRouter: Router,
    public remoteHelper: RemoteHelper,
    modalService: NgbModal,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,
    public cookieService: CookieService,
    public confirmationService: ConfirmationService,
  ) {
    super(commonService, remoteHelper, loaderService, parentRouter, modalService, cookieService);
    super.ngOnInit();
  }

  ngOnInit() {
    this.dateSelected = new Date();
    let dates = [];
    dates.push(this.dateSelected);

    this.route.queryParams.subscribe(params => {
      let editedStoryId = params['story'];
      if (editedStoryId != null) {
        this.getEditedStoryByDateForChiefSub(editedStoryId);
      } else {
        this.getEditedStoryByDateForChiefSub(dates);
      }
    });

    this.cols = [
      { field: 'username', header: 'username' },
      { field: 'firstName', header: 'firstName' },
      { field: 'lastName', header: 'lastName' },
    ];

    this._cols = [
      { field: 'storyName', header: 'storyName' },
    ];

    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });
  }


  //===================get editted stories by date/ date-range =================
  getEditedStoryByDateForChiefSub(dateSelected) {
    let dateRangeValues = [];
    let date = this.datepipe.transform(dateSelected, 'yyyy-MM-dd');
    dateRangeValues[0] = date;
    dateRangeValues[1] = null;
    console.log("form is submited! " + date);
    let controller = this;
    let postData = {
      "service": "SubEditingRS",
      "requestType": "getSubEditorStoryRejectionRequestForchiefSub",
      "requestData": {
        dateRangeValues: dateRangeValues
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeGetStoryProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }


  completeGetStoryProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.stories = [];
    this.storySelected = false;
    this.selectedStories = [];
    if (response.returnData != null) {
      if (response.returnData.length > 0) {
        for (let story of response.returnData) {
          this.stories.push(story);
        }
      }
    }
    console.log(response.returnData);
  }


  onRowSelect(event) {
    this.storySelected = "";
    this.storySelected = this.cloneStory(event.data);
    this.storyTitle = this.storySelected.storyName;
    this.storyContent = this.storySelected.storyContent;
    this.storyCategory = this.storySelected.storyCategory;
    this.dateSubmitted = this.storySelected.dateSubmitted;
    let reporters = "";
    this.storyReporters = this.storySelected.originalStory.storyReporters;
    for (let i = 0; i < this.storyReporters.length; i++) {
      if (reporters != "") {
        reporters = this.storyReporters[i].user.firstName + " " + this.storyReporters[i].user.lastName; + " and " + reporters;
      } else {
        reporters = this.storyReporters[i].user.firstName + " " + this.storyReporters[i].user.lastName;
      }
    }

    this.storyContent = this.storySelected.storyContent;
    this.content = this.storyContent.replace(/<[^>]*>/gm, '');
    this.storyNumberofWords = this.content.split(' ').length;

    this.storyReporters = "";
    this.storyReporters = "Story by " + reporters;
    console.log(this.storySelected);
    this.storyFiles = [];
    if (this.storySelected.originalStory.storyFiles) {
      if (this.storySelected.originalStory.storyFiles.length > 0) {
        this.storyFiles = this.storySelected.originalStory.storyFiles;
      }
    }
    this.comments = this.storySelected.originalStory.comments;
    console.log(this.comments);
    this.getAllCommentsByStoryId(this.storySelected);
  }


  onNewDateSelected(value: Date) {
    this.stories = [];
    this.dateSelected = value;
    this.getEditedStoryByDateForChiefSub(this.dateSelected);
  }


  //=================Confirm Reject request====================
  confirmApproveRejectStoryWithComment(rowData) {

    console.log(rowData);
    this.filteredPages = null;
    this.confirmationService.confirm({
      message: 'Editor and reporter(s) of this story shall be notified automatically',
      header: 'Are you want you want this story rejected??',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.storySelected) {
          this.storySelected.storySubEditorialApproval = -1;
          this.storySelected.subEditorApproval = -1;
          this.getAllCommentsByStoryId(this.storySelected);
        }

      },
    });
  }

  //=============Decline Reject request=============================
  confirmStoryDeclineRejectRequestWithComment(rowData) {

    this.confirmationService.confirm({
      message: 'Editor and reporter(s) of this story shall be notified automatically',
      header: 'Are you want you want to decline sub-editors story rejected request??',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.storySelected) {
          this.storySelected.storySubEditorialApproval = 1;
          this.storySelected.subEditorApproval = 1;
          this.getAllCommentsByStoryId(this.storySelected);
        }

      },
    });
  }

  //============get story comments by ===================
  getAllCommentsByStoryId(storySelected) {
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "getAllCommentsByStoryId",
      "requestData": { storyId: storySelected.reportedStoryId }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeGetAllCommentsByStoryIdServerProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
      }
    );
  }

  completeGetAllCommentsByStoryIdServerProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.story = response.returnData;
    this.commentForm.reset();
    this.comments = this.story.comments;
    console.log(this.comments);
    this.storyCommentDisplay = true;
  }
  //============get story comments by id===================

  //===========when submit comment button clicked ===================
  onSubmitRejectStoryWithComment() {
    let storyOwners = false;
    let storyReporterEmailAddresses = [];

    if (this.storySelected.originalStory.storyReporters) {
      for (let u of this.storySelected.originalStory.storyReporters) {
        storyReporterEmailAddresses.push(u.user.username);
      }
    }
    let form = this.commentForm.value;
    console.log(form);
    let controller = this;
    let postData = {
      "service": "SubEditingRS",
      "requestType": "saveSubEditorialComments",
      "requestData": {
        storyId: this.storySelected.reportedStoryId,
        user: this.user.userData,
        storyReporterEmailAddresses: storyReporterEmailAddresses,
        comment: form.comment,
        storyOwner: storyOwners
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeSubmitStoryCommentServerProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
      }
    );
  }

  completeSubmitStoryCommentServerProcess(response) {
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
    this.commentForm.reset();
    this.comments = this.story.comments;

    this.storyCommentDisplay = false;
    if (this.storySelected) {
      this.markStoryAsSubEditorialRejected(this.storySelected);
    }
  }
  //===========when submit comment button clicked ===================


  //===========reject story===================
  markStoryAsSubEditorialRejected(storySelected) {
    console.log(storySelected);
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "markStoryAsSubEditorialRejected",
      "requestData": storySelected
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeMarkStoryAsSubEditorialRejectedProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeMarkStoryAsSubEditorialRejectedProcess(response) {
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
    this.getEditedStoryByDateForChiefSub(this.dateSelected);
  }


  selectStory(event, story: any, overlaypanel: OverlayPanel) {
    this.storySelected = story;
    overlaypanel.toggle(event);
  }

  openFile(ob) {
    console.log(ob)
    let newPdfWindow = window.open("", "_blank");
    //let content = encodeURIComponent(response.byteString);
    let iframeStart = "<\iframe width='100%' height='100%' src='";
    let iframeEnd = "'><\/iframe>";
    newPdfWindow.document.write(iframeStart + ob + iframeEnd);
  }

  navigateToChiefViewStories(eStoryId: any) {
    this.parentRouter.navigate(['/c-story-editing/'], {
      queryParams: { story: eStoryId }
    });
  }
  //===========reject story===================

  cloneStory(c: any): any {
    let story = {};
    for (let prop in c) {
      story[prop] = c[prop];
    }
    return story;
  }
}
