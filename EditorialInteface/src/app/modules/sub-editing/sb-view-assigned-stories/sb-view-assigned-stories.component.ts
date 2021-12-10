import { Component, OnInit } from '@angular/core';
import { CommonComponent } from 'src/Services/CommonComponent';
import { FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'src/Services/LoaderService';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/Services/CommonService';
import { RemoteHelper } from 'src/Services/RemoteHelper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ng2-cookies';
import { OverlayPanel } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/api';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-sb-view-assigned-stories',
  templateUrl: './sb-view-assigned-stories.component.html',
  styleUrls: ['./sb-view-assigned-stories.component.css']
})
export class SbViewAssignedStoriesComponent extends CommonComponent {
  cols: any[];
  _cols: any[];
  storyTitle: any;
  storyContent: any;
  storyCategory: any;
  dateSubmitted: any;
  storyReporters: any;
  sditorSeen: boolean;
  editedStoriesList = [];
  dateSelected: Date;
  storySelected: any;
  story: any;
  storyFiles = [];
  editStoryContentDisplay: boolean = false;
  changeStoryBookPageAssignmentDisplay: boolean = false;
  storyCommentDisplay: boolean = false;
  pageNumber: any;
  selectedPage: any;
  pages: any[];
  item: string;
  filteredPages: any[];
  filteredCategories = [];
  storyCategories: any[];
  menuItem = [];
  storyPageAssignmentList = [];
  selectedpageNumber: any = null;
  commentForm: any;
  comments = [];
  storyId = null;
  EditedStory: any[];
  originalStoryNumberofWords = 0;
  editedStoryNumberofWords = 0;
  estoryTitle: any;
  subeditedVersionsList = [];
  estorySelected: any;
  estoryContent: any;

  constructor(private formBuilder: FormBuilder,
    loaderService: LoaderService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    parentRouter: Router,
    public datepipe: DatePipe,
    public remoteHelper: RemoteHelper,
    modalService: NgbModal,
    public cookieService: CookieService,
    public confirmationService: ConfirmationService,
  ) {
    super(commonService, remoteHelper, loaderService, parentRouter, modalService, cookieService);
    super.ngOnInit();
  }

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });

    this.dateSelected = new Date();
    this.getPagesAssignmentBySubEditorIdAndDate(this.dateSelected);

    this.cols = [
      { field: 'pageNumber', header: 'pageNumber' },
    ];

    this._cols = [
      { field: 'storyName', header: 'storyName' }
    ];

    this.menuItem = [
      { label: 'Request Clarification', icon: '', command: (event) => alert("yets") },
      { label: 'Move to another page', icon: '', command: (event) => this.prepareAssignStoryToAnotherPage() },
    ];
    this.getStoryCategories();

    this.dateSelected = new Date();
    let dates = [];
    dates.push(this.dateSelected);

    this.GetAllPages(this.dateSelected);
  }

  //===========submit sub-edited story version=========
  onSubmitEditedStory() {
    if (this.storySelected) {
      this.editStoryContentDisplay = false;
      let controller = this;
      let postData = {
        "service": "EditingRS",
        "requestType": "saveSubEditorStoryVersion",
        "requestData": {
          subEditorUserId: this.user.userId,
          editedStoryId: this.storySelected.eStoryId,
          storyTitle: this.storyTitle,
          storyContent: this.storyContent,
          originalStoryId: this.storySelected.reportedStoryId
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
    } else {
      alert("no selected");
    }
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
    let modalContent = {
      title: 'Success',
      message: response.returnMessage
    }
    this.showDialog(modalContent);
    console.log(response.returnData);
    this.getPagesAssignmentBySubEditorIdAndDate(this.dateSelected);
  }



  prepareAssignStoryToAnotherPage() {
    this.changeStoryBookPageAssignmentDisplay = true;
    this.GetAllPages(this.dateSelected);
  }


  //==========assign stories new papers pages===================
  changeStoryBookPageAssignment(selectedPage: any) {
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "changeStoryBookPageAssignment",
      "requestData": {
        eStoryId: this.storySelected.eStoryId,
        pageNumberId: selectedPage.id
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeSubmitStoryProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeSubmitStoryProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.getPagesAssignmentBySubEditorIdAndDate(this.dateSelected);
    console.log(response.returnData);
  }

  //=======when date selected from date picker============
  onNewDateSelected(value) {
    this.storyPageAssignmentList = [];
    this.dateSelected = value;
    this.getPagesAssignmentBySubEditorIdAndDate(value);
  }

  //======get page assignment by date ===============
  getPagesAssignmentBySubEditorIdAndDate(dateSelected) {
    let date = this.datepipe.transform(dateSelected, 'yyyy-MM-dd');
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "getPagesAssignmentBySubEditorIdAndDate",
      "requestData": {
        subEditorUserId: this.user.userId,
        date: date
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
    this.storyPageAssignmentList = [];
    this.storyPageAssignmentList = response.returnData;
    this.storySelected = false;
    console.log(this.storyPageAssignmentList);
  }

  onSubEditorRowSelect(event) {
    this.storySelected = false;
    // this.getPagesAssignmentByDateForChiefSub(this.subEditor.userId);
    this.storySelected = "";
    this.story = this.cloneStory(event.data);
    this.EditedStory = [];
    this.EditedStory.push(this.story);
    this.storySelected = this.story;
    console.log(this.storySelected);
    this.storyTitle = this.story.storyName;
    this.storyContent = this.story.storyContent;
    this.subeditedVersionsList = this.storySelected.subEditorStoryVersionsList;

    if (this.subeditedVersionsList.length > 0) {
      this.estoryTitle = this.subeditedVersionsList[0].storyTitle;
      this.estorySelected = this.subeditedVersionsList[0];
      this.estoryContent = this.subeditedVersionsList[0].storyContent;

      let econtent = this.estoryContent.replace(/<[^>]*>/gm, '');
      this.editedStoryNumberofWords = econtent.split(' ').length;
    }

    let content = this.storyContent.replace(/<[^>]*>/gm, '');
    this.originalStoryNumberofWords = content.split(' ').length;


    this.storyCategory = this.story.storyCategory;
    this.dateSubmitted = this.story.dateSubmitted;
    this.pageNumber = "page-number-" + this.story.pageNumber;
    let reporters = "";
    let storyReporters = this.story.storyReporters;
    for (let i = 0; i < storyReporters.length; i++) {
      if (reporters != "") {
        reporters = storyReporters[i].user.firstName + " " + storyReporters[i].user.lastName + " and " + reporters;
      } else {
        reporters = storyReporters[i].user.firstName + " " + storyReporters[i].user.lastName;
      }
    }
    this.storyFiles = [];
    if (this.story.storyFiles) {
      if (this.storySelected.storyFiles.length > 0) {
        this.storyFiles = this.storySelected.storyFiles;
      }
    }
    this.storyReporters = "";
    this.storyReporters = "Story by " + reporters
  }

  withdrawStoryAssignment(story: any) {
    let date = this.datepipe.transform(this.dateSelected, 'yyyy-MM-dd');
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "withdrawStoryFromSubEditing",
      "requestData": {
        eStoryId: story.eStoryId
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

  onStoryContentClicked() {
    this.editStoryContentDisplay = true;
  }

  selectStory(event, story: any, overlaypanel: OverlayPanel) {
    this.storySelected = story;
    overlaypanel.toggle(event);
  }

  paginate(event) {
    this.estoryTitle = this.subeditedVersionsList[event.first].storyTitle;
    let content = this.subeditedVersionsList[event.first].storyContent.replace(/<[^>]*>/gm, '');
    this.editedStoryNumberofWords = content.split(' ').length;
  }


  onPageNumberChanged(event) {
    console.log(event);
    this.selectedPage = event;
    this.confirmStoryBookPageChange(this.selectedPage);
  }

  confirmEditStory() {
    this.editStoryContentDisplay = false;
    this.filteredPages = null;
    this.confirmationService.confirm({
      message: 'You are about to save new version of this story',
      header: 'Confirmation Story Page Changes',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onSubmitEditedStory();
      },
    });
  }

  confirmStoryBookPageChange(selectedPage) {
    this.changeStoryBookPageAssignmentDisplay = false;
    this.filteredPages = [];
    this.confirmationService.confirm({
      message: 'Story will be change from current page to page ' + selectedPage.pageNumber,
      header: 'Confirmation Story Page Changes',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.changeStoryBookPageAssignment(this.selectedPage);
      },
    });
  }



  GetAllPages(dateSelected) {
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "getAllBookPages",
      "requestData": {date: dateSelected}
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeGetAllPagesProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeGetAllPagesProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.pages = [];
    this.filteredPages = [];
    this.pages = response.returnData;
    this.filteredPages = response.returnData;
    // this.getEditedStoryByDateForChiefSub(this.dateSelected);
    console.log(this.pages);
  }

  filterPages(event) {
    this.filteredPages = [];
    for (let i = 0; i < this.pages.length; i++) {
      let page = this.pages[i];
      if (page.pageNumber.indexOf(event.query) == 0) {
        this.filteredPages.push(page);
      }
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
    this.storyCategories = [];
    this.storyCategories.push({});
    for (let cat of response.returnData) {
      this.storyCategories.push(cat);
    }
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

  //======confirm reject story on REJECT STORY BUTTON CLICKED=============
  confirmRejectStory() {
    console.log(this.filteredPages);
    this.filteredPages = [];
    this.confirmationService.confirm({
      message: 'Editor and reporter(s) of this story shall be notified automatically',
      header: 'Are you sure you want reject this story??',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.getAllCommentsByStoryId(this.storySelected.reportedStoryId);
      },
    });
  }

  //
  onSubmitComment() {
    if (this.commentForm.invalid) {
      alert("We have dected errors! Please review the data you are submitting");
      return;
    }
    let storyOwners = false;
    console.log(this.storySelected);
    let storyReporterEmailAddresses = [];
    for (let u of this.storySelected.storyReporters) {
      if (this.user.userId == u.userId) {
        storyOwners = true;
      }
      storyReporterEmailAddresses.push(u.user.username);
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
        chiefSubEditorUserId: this.storyPageAssignmentList[0].pageAssignment.chiefSubEditorUserId,
        comment:  form.comment,
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

    if (this.storySelected) {
      this.storySelected.subEditorApproval = -1;
      this.markStorySubEditorApprovalStatus(this.storySelected);
    }
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
    //this.getAllCommentsByStoryId(this.storySelected.reportedStoryId)
  }

  //============get comment for a selected story================
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
        controller.completegetAllStoryCommentByIdServerProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
      }
    );
  }

  completegetAllStoryCommentByIdServerProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    console.log(response.returnData);
    this.commentForm.reset();
    this.comments = response.returnData.comments;
    this.storyCommentDisplay = true;
  }
  //=====END=======get comment for a selected story================


  openFile(ob) {
    console.log(ob)
    let newPdfWindow = window.open("", "_blank");
    //let content = encodeURIComponent(response.byteString);
    let iframeStart = "<\iframe width='100%' height='100%' src='";
    let iframeEnd = "'><\/iframe>";
    newPdfWindow.document.write(iframeStart + ob + iframeEnd);
  }


  cloneStory(c: any): any {
    let story = {};
    for (let prop in c) {
      story[prop] = c[prop];
    }
    return story;
  }

  public tools: object = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      '|', 'ClearFormat', 'Print', '|', 'FullScreen']
  };

  onPageRowExpanded(data: any) {
    this.selectedpageNumber = "";
    this.selectedpageNumber = "On Page Number " + data;
  }

  markStorySubEditorApprovalStatus(storySelected) {
    let controller = this;
    let postData = {
      "service": "SubEditingRS",
      "requestType": "markStorySubEditorApprovalStatus",
      "requestData": {
        storySelected
        // eStoryId: storySelected.eStoryId,
        // reportedStoryId: storySelected.reportedStoryId
      }
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

    this.getPagesAssignmentBySubEditorIdAndDate(this.dateSelected);
  }
 

}
