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
  selector: 'app-chief-sub-view-stories',
  templateUrl: './chief-sub-view-stories.component.html',
  styleUrls: ['./chief-sub-view-stories.component.css'],

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
export class ChiefSubViewStoriesComponent extends CommonComponent {

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
  filteredSubEditors: any[];

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
      this.subEditorId = params['subEditor'];
      if (this.subEditorId != null) {
        alert
        this.getUserById(this.subEditorId);
      } else {
        this.getUsersByRole();
      }
    });

    this.route.queryParams.subscribe(params => {
      let editedStoryId = params['story'];
      if (editedStoryId != null) {
        this.getEditedStoryByIdForChiefSub(editedStoryId);
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

    this.getAllBookPages(this.dateSelected);

    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });
  }

  getUserById(subEditorId) {
    let controller = this;
    let postData = {
      "service": "UsersRS",
      "requestType": "getUserById",
      "requestData": {
        userId: subEditorId,
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        //  controller.completeGetUsersByRoleProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  onNewDateSelected(value: Date) {
    this.stories = [];
    this.dateSelected = value;
    this.getEditedStoryByDateForChiefSub(this.dateSelected);
  }

  //===================get editted story by id =================
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
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response);
          return;
        }
        controller.stories = [];
        controller.selectedStories = [];
        if (response.returnData != null) {
          if (response.returnData.length > 0) {
            for (let story of response.returnData) {
              controller.stories.push(story);
            }
          }
        }
        console.log(response.returnData);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
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
      "service": "EditingRS",
      "requestType": "getEditedStoryByDateForChiefSub",
      "requestData": {
        dateRangeValues: dateRangeValues
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        //controller.completeGetStoryProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response);
          return;
        }
        controller.stories = [];
        controller.selectedStories = [];
        if (response.returnData != null) {
          if (response.returnData.length > 0) {
            for (let story of response.returnData) {
              controller.stories.push(story);
            }
          }
        }
        console.log(response.returnData);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  //get pages list for selection
  getAllBookPages(dateSelected) {
    let date = this.datepipe.transform(dateSelected, 'yyyy-MM-dd');
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "getAllBookPages",
      "requestData": {
        date: date
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        //controller.completeGetAllBookPagesyProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response);
          return;
        }
        controller.bookPages = [];
        controller.bookPages = response.returnData;
        controller.filteredPages = response.returnData;
        console.log(controller.bookPages);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  //assign stories new papers pages
  onSubmitStoryAssignment() {
    let controller = this;
    let postData = {
      "service": "SubEditingRS",
      "requestType": "assignStoriesPageAndPageToSubEditor",
      "requestData": {
        subEditorUserId: this.selectedSubEditor.userId,
        storiesArray: this.selectedStories,
        cSubEditorUserId: this.user.userData.userId,
        pageNumberId: this.pageNumber.id
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        //controller.completeSubmitStoryProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response);
          return;
        }
        controller.serverSuccessReturnMessage
        controller.stories = [];
        controller.selectedStories = [];
        if (response.returnData.length > 0) {
          for (let story of response.returnData) {
            controller.stories.push(story);
          }
        }
        if (response.returnData != null) {
          controller.navigateToStoryPageAssignmentRejStories(controller.selectedSubEditor.userId);
        } else {
          controller.getEditedStoryByDateForChiefSub(controller.dateSelected);
        }
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  //=======on row cliked===================
  onRowSelect(event) {
    this.storySelected = "";
    this.storySelected = this.cloneStory(event.data);
    console.log(this.storySelected);
    this.storyTitle = this.storySelected.storyTitle;
    this.storyContent = this.storySelected.storyContent.replace(/<[^>]*>/gm, '');;
    this.storyCategory = this.storySelected.storyCategory;
    this.dateSubmitted = this.storySelected.dateSubmitted;

    let originalStory = this.storySelected.originalStory;

    let reporters = "";
    for (let i = 0; i < originalStory.storyReporters.length; i++) {
      if (reporters != "") {
        reporters = originalStory.storyReporters[i].user.firstName + " " + originalStory.storyReporters[i].user.lastName + " and " + reporters;
      } else {
        reporters = originalStory.storyReporters[i].user.firstName + " " + originalStory.storyReporters[i].user.lastName;
      }
    }
    ///this.storyContent = this.story.storyContent;
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
  }

  RemoveCategory(index: number, categoryName: any) {
    if (window.confirm("Do you want to delete: " + categoryName)) {

    }
  }

  //=============get users by role==========
  getUsersByRole() {
    let controller = this;
    let postData = {
      "service": "UsersRS",
      "requestType": "getUsersByRole",
      "requestData": { userRole: 'subeditor' }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        //controller.completeGetUsersByRoleProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response);
          return;
        }
        controller.subEditorsList = [];
        // this.selectedSubEditor = null;
        if (response.returnData.length > 0) {
          for (let story of response.returnData) {
            controller.subEditorsList.push(story);
            if (controller.subEditorId != null) {
              controller.selectedSubEditor = controller.subEditorsList[0];
              console.log(controller.subEditorsList);
            }
          }
          controller.filteredSubEditors = controller.subEditorsList;
        }
        console.log(controller.subEditorsList);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
      }
    );
  }

  confirmRejectStoryWithComment(rowData) {
    this.storySelected = rowData;
    console.log(rowData);
    this.filteredPages = null;
    this.confirmationService.confirm({
      message: 'Editor and reporter(s) of this story shall be notified automatically',
      header: 'Are you sure you want reject this story??',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.getAllCommentsByStoryId(this.storySelected.reportedStoryId);

      },
    });
  }

  //============get story comments by ===================
  getAllCommentsByStoryId(storyId) {
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "getAllCommentsByStoryId",
      "requestData": { storyId: storyId }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        // controller.completeGetAllCommentsByStoryIdServerProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
        controller.story = response.returnData;
        controller.commentForm.reset();
        controller.comments = controller.story.comments;
        console.log(controller.comments);
        controller.storyCommentDisplay = true;
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
      }
    );
  }

  //===========when submit comment button clicked ===================
  onSubmitRejectStoryWithComment() {
    let storyReporterEmailAddresses = [];
    if (this.storySelected.originalStory.storyReporters) {
      if (this.storySelected.originalStory.storyReporters.length) {
        for (let u of this.storySelected.originalStory.storyReporters) {
          storyReporterEmailAddresses.push(u.user.username);
        }
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
        userId: this.user.userId,
        user: this.user.userData,
        storyReporterEmailAddresses: storyReporterEmailAddresses,
        comment: form.comment,
        storyOwner: false
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        // controller.completeSubmitStoryCommentServerProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response);
          return;
        }
        controller.serverSuccessReturnMessage(response);
        controller.commentForm.reset();
        controller.comments = controller.story.comments;
        controller.storyCommentDisplay = false;
        if (controller.storySelected) {
          controller.storySelected.storySubEditorialApproval = -1;
          console.log(controller.storySelected);
          controller.markStoryAsSubEditorialRejected(controller.storySelected);
        }
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
      }
    );
  }

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
        // controller.completeMarkStoryAsSubEditorialRejectedProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response);
          return;
        }
        controller.serverSuccessReturnMessage(response);
        if (response.returnData != null) {
          controller.navigateToSubEditorialRejectedStories(response.returnData.eStoryId);
        } else {
          controller.getEditedStoryByDateForChiefSub(controller.dateSelected);
        }
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  //====displays server return messages======
  serverErrorReturnMessage(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    let modalContent = {
      title: 'Error',
      message: response.returnMessage
    }
    this.showDialog(modalContent);
  }

  //====displays server return messages======
  serverSuccessReturnMessage(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    let modalContent = {
      title: 'Success',
      message: response.returnMessage
    }
    this.showDialog(modalContent);
  }

  navigateToSubEditorialRejectedStories(storyId: any) {
    this.parentRouter.navigate(['/c-rejected-stories/'], {
      queryParams: { story: storyId }
    });
  }

  navigateToStoryPageAssignmentRejStories(subEditor: any) {
    this.parentRouter.navigate(['/c-view-assignemts/'], {
      queryParams: { subEditor: subEditor }
    });
  }

  //=============get users by role==========
  filterSubEditors(event) {
    this.filteredSubEditors = [];
    for (let i = 0; i < this.subEditorsList.length; i++) {
      let subEditor = this.subEditorsList[i];
      if (subEditor.username.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredSubEditors.push(subEditor);
      }
    }
  }

  //=============filter pages==========
  filterPages(event) {
    this.filteredPages = [];
    for (let i = 0; i < this.bookPages.length; i++) {
      let page = this.bookPages[i];
      if (page.pageNumber.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredPages.push(page);
      }
    }
  }

  //=============display story files on mouseover==========
  selectStory(event, story: any, overlaypanel: OverlayPanel) {
    this.storySelected = story;
    overlaypanel.toggle(event);
  }

  //when page number is selected
  onPageNumberSelected(event) {
    console.log(this.pageNumber);
    if (this.pageNumber.pageAssignment) {
      if (this.pageNumber.pageAssignment.subEditor) {
        this.selectedSubEditor = this.pageNumber.pageAssignment.subEditor;
      }
    }
  }

   //=====================
   onSubEditorSelected($event) {
    console.log(this.selectedSubEditor);
  }

  storyChosen($event) {
    console.log($event);
  }

  cloneStory(c: any): any {
    let story = {};
    for (let prop in c) {
      story[prop] = c[prop];
    }
    return story;
  }

}