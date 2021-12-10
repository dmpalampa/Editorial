import { Component, OnInit } from '@angular/core';
import { CommonComponent } from 'src/Services/CommonComponent';
import { FormBuilder, Validators } from "@angular/forms";
import { LoaderService } from 'src/Services/LoaderService';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/Services/CommonService';
import { DatePipe } from '@angular/common';
import { RemoteHelper } from 'src/Services/RemoteHelper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ng2-cookies';
import { OverlayPanel } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/api';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-sb-rejected-stories',
  templateUrl: './sb-rejected-stories.component.html',
  styleUrls: ['./sb-rejected-stories.component.css'],
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class SbRejectedStoriesComponent extends CommonComponent {
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
  _dateSelected: any;
  dateForm: any;
  currentdate: Date;
  subEditorId = null;
  cols: any[];
  bookPages: any[];
  filteredPages: any[] = [];
  pageNumber: any;
  _cols: any[];
  storyFiles = [];
  StoryNumberofWords = 0;
  content: any;
  comments=[];


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
    dates[0] = this.dateSelected;
    dates[1] = null;
  

    this.route.queryParams.subscribe(params => {
      let editedStoryId = params['story'];
      if (editedStoryId != null) {
        this.getEditedStoryByIdForChiefSub(editedStoryId);
      } else {
        this.getRejectedEditedStoryByDateForChiefSub(dates);
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
  }

  onNewDateSelected(value: Date) {
    this.stories = [];
    this.dateSelected = value;
    console.log(value);
    this.getRejectedEditedStoryByDateForChiefSub(this._dateSelected);
  }


  showStoryCommentOnMouseEnter(event, story: any, overlaypanel: OverlayPanel) {
    this.comments =[];
    this.comments = story.originalStory.comments;
    overlaypanel.toggle(event);
  }

  hideRowData(event: any){
  }

  getEditedStoryByIdForChiefSub(editedStoryId) {
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "getEditedStoryById",
      "requestData": {
        eStoryId: editedStoryId
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


  getRejectedEditedStoryByDateForChiefSub(dateSelected) {
    let dateRangeValues = [];
    let date = dateSelected;
    console.log(dateSelected);
    for (let i = 0; i <= dateSelected.length; i++) {
      if (dateSelected[i] == null) {
        dateRangeValues.push(null);
      }
      else {
        this.dateSelected = dateSelected[i];
        console.log(dateSelected);
        date = this.datepipe.transform(this.dateSelected, 'yyyy-MM-dd');
        dateRangeValues.push(date);
      }
    }

    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "getRejectedEditedStoryByDateForChiefSub",
      "requestData": {
        dateRangeValues: dateRangeValues,
        storySubEditorialApproval: -1
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
    this.selectedStories = [];
    this.storySelected =false;
    if (response.returnData != null) {
      if (response.returnData.length > 0) {
        for (let story of response.returnData) {
          this.stories.push(story);
        }
      }
    }
    console.log(response.returnData);
  }

  //===============on story row clicked====================
  onRowSelect(event) {
    this.storySelected =false;
    this.storySelected = "";
    this.storySelected = this.cloneStory(event.data);
    console.log(this.storySelected);
    this.storyTitle = this.storySelected.storyName;
    this.storyContent = this.storySelected.storyContent;
    this.storyCategory = this.storySelected.storyCategory;
    this.dateSubmitted = this.storySelected.dateSubmitted;
    this.storyContent = this.storySelected.storyContent;
    this.content = this.storyContent.replace(/<[^>]*>/gm, '');
    this.StoryNumberofWords = this.content.split(' ').length;
    let reporters = "";
    this.storyReporters = this.storySelected.originalStory.storyReporters;
    for (let i = 0; i < this.storyReporters.length; i++) {
      if (reporters != "") {
        reporters = this.storyReporters[i].user.lastName + " " + this.storyReporters[i].user.firstName + " and " + reporters;
      } else {
        reporters = this.storyReporters[i].user.lastName + " " + this.storyReporters[i].user.firstName;
      }
    }
    this.storyReporters = "";
    this.storyReporters = "Story by " + reporters;


    this.storyFiles = [];
    if (this.storySelected.originalStory.storyFiles) {
      if (this.storySelected.originalStory.storyFiles.length > 0) {
        this.storyFiles = this.storySelected.originalStory.storyFiles;
      }
    }
  }


  selectStory(event, story: any, overlaypanel: OverlayPanel) {
    this.storySelected = story;
    overlaypanel.toggle(event);
  }

  confirmReviveStory() {
    this.confirmationService.confirm({
      message: 'Editor and reporter(s) of this story shall be notified automatically',
      header: 'Are you sure you want revive this story??',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.storySelected) {
          this.storySelected.storySubEditorialApproval = 1;
          console.log(this.storySelected);
          this.markStoryAsSubEditorialApproved(this.storySelected);
        }
      },
    });
  }


  //===========reject story===================
  markStoryAsSubEditorialApproved(storySelected) {
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
        controller.completeMarkStoryAsSubEditorialApprovedProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeMarkStoryAsSubEditorialApprovedProcess(response) {
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
   
    if(response.returnData!=null){
    this.navigateToChiefSubNewStories(response.returnData.eStoryId);
    }else{
       this.getRejectedEditedStoryByDateForChiefSub(this._dateSelected);
    }
  }

  navigateToChiefSubNewStories(storyId: any) {
    this.parentRouter.navigate(['/c-story-editing/'], {
      queryParams: { story: storyId }
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
