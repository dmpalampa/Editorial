import { Component, OnInit, ElementRef, Inject  } from '@angular/core';
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
  selector: 'app-chief-sub-view-assigned-stories',
  templateUrl: './chief-sub-view-assigned-stories.component.html',
  styleUrls: ['./chief-sub-view-assigned-stories.component.css'],
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
export class ChiefSubViewAssignedStoriesComponent extends CommonComponent {

  storyTitle: any;
  storyContent: any;
  storyCategory: any;
  dateSubmitted: any;
  storyReporters: any;
  sditorSeen: boolean;
  storyPageAssignmentList: any[] = [];
  dateSelected: Date;
  storySelected: any;
  story: any;
  subEditorsList = [];
  selectedSubEditor: any;
  cols: any[];
  _cols: any[];
  subEditor: any;
  subEditorSelected: any;
  menuItem = [];
  subEditorPagesAndStoriesToEdit = [];
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
  commentForm: any;
  comments = [];
  storyId = null;
  subeditedVersionsList: any[] = [];
  editedStoryNumberofWords = 0;
  originalStoryNumberofWords = 0;
  estoryTitle: any;
  eStoryContent: any;
  EditedStory: any[];
  subEditorId: any;

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
    this.dateSelected = new Date();
    this.route.queryParams.subscribe(params => {
     this.subEditorId = params['subEditor'];
      if (this.subEditorId != null) {
        this.getPagesAssignmentByDateAndSubEditorIdForChiefSub(this.subEditorId)
      } else {
        this.getPagesAssignmentByDateForChiefSub(this.dateSelected);
      }
    });

    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });

    this.cols = [
      { field: 'pageNumber', header: 'pageNumber' },
      { field: 'subEditor.username', header: 'subEditorUsername' },
      { field: 'subEditor.firstName', header: 'subEditorFirstName' },
      { field: 'subEditor.lastName', header: 'subEditorLastName' }
    ];

    this._cols = [
      { field: 'storyName', header: 'storyName' }
    ];

    this.menuItem = [
      { label: 'Request Clarification', icon: '', command: (event) => this.assignMoreStories(this.subEditorSelected) },
      { label: 'Move to another page', icon: '', command: (event) => this.prepareAssignStoryToAnotherPage() },
      { label: 'Divert to a colleague', icon: '', command: (event) => this.assignMoreStories(this.subEditorSelected) },
    ];
    this.getUsersByRole();

    this.getStoryCategories();
  }


  onSubmitEditedStory() {
    console.log(this.storySelected);
    if (this.storySelected) {
      this.editStoryContentDisplay = false;
      let controller = this;
      let postData = {
        "service": "EditingRS",
        "requestType": "saveSubEditorStoryVersion",
        "requestData": {
          subEditorUserId: this.user.userId,
          editedStoryId: this.storySelected.eStoryId,
          storyTitle: this.estoryTitle,
          storyContent: this.eStoryContent,
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
    this.getPagesAssignmentByDateForChiefSub(this.dateSelected);
  }

  prepareAssignStoryToAnotherPage() {
    this.filteredPages = [];
    this.getAllBookPages(this.dateSelected);
    this.changeStoryBookPageAssignmentDisplay = true;
  }

  assignMoreStories(subEditorSelected) {
    console.log(subEditorSelected);
    if (subEditorSelected.userId) {
      this.parentRouter.navigate(['/c-story-editing/'], {
        queryParams: { subEditor: subEditorSelected.userId }
      });
    }
  }

  //assign stories new papers pages
  changeStoryBookPageAssignment(selectedPage: any) {
    console.log(this.storySelected);
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
    let modalContent = {
      title: 'Success',
      message: response.returnMessage
    }
    this.showDialog(modalContent);
    this.getPagesAssignmentByDateForChiefSub(this.dateSelected);
    console.log(response.returnData);
  }


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
        controller.completeGetUsersByRoleProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
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
    this.subEditorsList = [];
    this.selectedSubEditor = {};
    if (response.returnData.length > 0) {
      for (let story of response.returnData) {
        this.subEditorsList.push(story);
      }
    } else {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    console.log(this.subEditorsList);
  }

  onNewDateSelected(value) {
    this.storyPageAssignmentList = [];
    this.dateSelected = value;
    this.getPagesAssignmentByDateForChiefSub(value);
  }

  getPagesAssignmentByDateAndSubEditorIdForChiefSub(subEditorUserId) {
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "getPagesAssignmentByDateForChiefSub",
      "requestData": {
        subEditorUserId: subEditorUserId
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

  getPagesAssignmentByDateForChiefSub(dateSelected) {
    let date = this.datepipe.transform(dateSelected, 'yyyy-MM-dd');
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "getPagesAssignmentByDateForChiefSub",
      "requestData": {
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
    console.log(response.returnData);
    this.storyPageAssignmentList = [];
   // this.storySelected = null;
    this.storyPageAssignmentList = response.returnData;
  }

  onSubEditorRowSelect(event) {
    this.comments = [];
    this.subEditor = this.cloneStory(event.data);
    this.storySelected = false;
    this.subEditorSelected = this.subEditor.username;
    // this.getPagesAssignmentByDateForChiefSub(this.subEditor.userId);
    this.story = this.cloneStory(event.data);
    console.log(  this.story)
    this.storySelected = this.story;
    this.EditedStory = [];
    this.EditedStory.push(this.storySelected);
    this.subeditedVersionsList = this.storySelected.subEditorStoryVersionsList;

    if (this.subeditedVersionsList.length > 0) {
      this.estoryTitle = this.subeditedVersionsList[0].storyTitle;
      let content = this.subeditedVersionsList[0].storyContent.replace(/<[^>]*>/gm, '');
      this.editedStoryNumberofWords = content.split(' ').length;
    }

    this.storyTitle = this.story.storyName;
    let content = this.story.storyContent.replace(/<[^>]*>/gm, '');
    this.storyContent = content.replace(/<[^>]*>/gm, '');

    this.originalStoryNumberofWords = this.storyContent.replace(/<[^>]*>/gm, '').split(' ').length;

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

  onStoryContentClicked() {
     if (this.subeditedVersionsList.length > 0) {
       this.estoryTitle = this.subeditedVersionsList[0].storyTitle;
       this.eStoryContent = this.subeditedVersionsList[0].storyContent.replace(/<[^>]*>/gm, '');
    }else{
      this.estoryTitle = this.storyTitle;
      this.eStoryContent = this.storyContent;
    }
    this.editStoryContentDisplay = true;
  }

  paginate(event) {
    this.estoryTitle = this.subeditedVersionsList[event.first].storyTitle;
    let content = this.subeditedVersionsList[event.first].storyContent.replace(/<[^>]*>/gm, '');
    this.editedStoryNumberofWords = content.split(' ').length;
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



  selectStory(event, story: any, overlaypanel: OverlayPanel) {
    this.storySelected = story;
    overlaypanel.toggle(event);
  }

  onPageNumberChanged(event) {
    console.log(event);
    this.selectedPage = event;
    this.confirmStoryBookPageChange(this.selectedPage);
  }

  confirmStoryBookPageChange(selectedPage) {
    this.changeStoryBookPageAssignmentDisplay = false;
    this.filteredPages = null;
    this.confirmationService.confirm({
      message: 'Story will be change from current page to page ' + selectedPage.pageNumber,
      header: 'Confirmation Story Page Changes',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.changeStoryBookPageAssignment(this.selectedPage);
      },
    });
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
    this.getPagesAssignmentByDateForChiefSub(this.dateSelected)
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

  confirmRejectStoryWithComment() {
    this.filteredPages = null;
    this.confirmationService.confirm({
      message: 'Editor and reporter(s) of this story shall be notified automatically',
      header: 'Are you sure you want reject this story??',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       this.onSubmitRejectStoryWithComment();
      },
    });
  }

  commentOnStory() {
  }

  onSubmitRejectStoryWithComment() {
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
        userId: this.user.userId,
        username: this.user.username,
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
    this.storyCommentDisplay = false;
    if (this.storySelected) {
      this.storySelected.storySubEditorialApproval = -1;
      this.markStoryAsSubEditorialRejected(this.storySelected);
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
      title: 'Error',
      message: response.returnMessage
    }
    this.showDialog(modalContent);
    this.commentForm.reset();
    this.comments = this.story.comments;
  }

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
        controller.completeGetCommentsServerProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
      }
    );
  }

  completeGetCommentsServerProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.comments = [];
    this.story = response.returnData;
    console.log(response.returnData);
    this.commentForm.reset();
    this.comments = this.story.comments;
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


  cloneStory(c: any): any {
    let story = {};
    for (let prop in c) {
      story[prop] = c[prop];
    }
    return story;
  }


  openFile(ob) {
    console.log(ob)
    let newPdfWindow = window.open("", "_blank");
    //let content = encodeURIComponent(response.byteString);
    let iframeStart = "<\iframe width='100%' height='100%' src='";
    let iframeEnd = "'><\/iframe>";
    newPdfWindow.document.write(iframeStart + ob + iframeEnd);
  }


  public tools: object = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
  };


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

    if (response.returnData != null) {
      this.navigateToSubEditorialRejectedStories(response.returnData.eStoryId);
    } else {

      if (this.subEditorId != null) {
        this.getPagesAssignmentByDateAndSubEditorIdForChiefSub(this.subEditorId)
      } else {
        this.getPagesAssignmentByDateForChiefSub(this.dateSelected);
      }
    }

  }

  navigateToSubEditorialRejectedStories(storyId: any) {
    this.parentRouter.navigate(['/c-rejected-stories/'], {
      queryParams: { story: storyId }
    });
  }

}
