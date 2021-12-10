import { Component, ElementRef, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonComponent } from 'src/Services/CommonComponent';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT, DatePipe } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { LoaderService } from 'src/Services/LoaderService';
import { CommonService } from 'src/Services/CommonService';
import { RemoteHelper } from 'src/Services/RemoteHelper';
import { CookieService } from 'ng2-cookies';
import { OverlayPanel } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-e-reported-stories',
  templateUrl: './e-reported-stories.component.html',
  styleUrls: ['./e-reported-stories.component.css']
})
export class EReportedStoriesComponent extends CommonComponent {

  displayDialog: boolean;
  storyApprovalStatusDisplay: boolean;
  editStoryContentDisplay: boolean = false;
  story: any = {};
  selectedStory: any;
  newStrory: boolean;
  stories: any[] = [];
  //storySelected: any;
  cols: any[];
  menuItem: any;
  menuItemForEdited: any;
  displayActionButtons: boolean;
  editStoryMode: boolean;
  storyEditForm: any;
  elem: any;
  storyTitle: any;
  storyContent: any;
  storyCategory: any;
  dateSubmitted: any;
  storyReporters: any;

  estorySelected: any = null;
  estoryTitle: any;
  estoryContent: any;
  estoryCategory: any;
  edateSubmitted: any;
  storyCommentDisplay: boolean = false;
  editorSeen: boolean;
  storyApprovalStatusForm: any;
  editedStoriesList = [];
  index: number = 0;
  status: boolean;
  storyFiles = [];
  dateSelected: Date;
  commentForm: any;
  comments = [];
  storyId = null;
  _dateSelected: any;
  StoryNumberofWords = 0;
  content: any;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private formBuilder: FormBuilder,
    loaderService: LoaderService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    parentRouter: Router,
    public remoteHelper: RemoteHelper,
    public datepipe: DatePipe,
    modalService: NgbModal,
    public cookieService: CookieService,
    public confirmationService: ConfirmationService,
  ) {
    super(commonService, remoteHelper, loaderService, parentRouter, modalService, cookieService);
    super.ngOnInit();
  }

  ngOnInit() {
    this.storyEditForm = this.formBuilder.group({
      userId: ['', []],
      storyId: ['', []],
      editedStory: ['', [Validators.required]],
    });

    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });

    this.editStoryMode = false;

    this.cols = [
      { field: 'storyTitle', header: 'storyTitle' },
      { field: 'storyCategory', header: 'storyCategory' },
      { field: 'dateSubmited', header: 'Submited On' },
    ];

    this.menuItem = [
      { label: 'Accept/Decline Story', icon: 'pi pi-star-o', command: (event) => this.prepareStoryForApprovalCheck(this.selectedStory) },
      { label: 'Request For more Info', icon: 'pi pi-info-circle', command: (event) => alert(this.selectedStory.storyName) },
      { label: 'Comment on story', icon: 'pi pi-comment', command: (event) => this.commentOnStory(this.selectedStory) },
      { label: 'Edit Story', icon: 'pi pi-pencil', command: (event) => this.prepareEditStory(this.selectedStory) }
    ];

    this.dateSelected = new Date();
    let dates = [];
    dates.push(this.dateSelected);

    this.route.queryParams.subscribe(params => {
      let storyId = params['story'];
      if (storyId != null) {
        this.getUnEditedStoryById(storyId);
      } else {
        this.getUnEditedStoriesByCategoryAndDate(dates);
      }
    });
  }


  selectStory(event, story: any, overlaypanel: OverlayPanel) {
    this.selectedStory = story;
    overlaypanel.toggle(event);
  }

  onRowSelect(event) {
    this.newStrory = false;
    this.storyTitle = "";
    this.storyContent = "";
    this.StoryNumberofWords = 0;
    this.storyCategory = "";
    this.story = this.cloneStory(event.data);

    if (!this.story.editorSeen) {
      this.markStoryAsSeen(this.story);
    }
    this.selectedStory = this.story;
    this.storyTitle = this.selectedStory.storyTitle;
    this.storyContent = this.selectedStory.storyContent;
    this.content = this.storyContent.replace(/<[^>]*>/gm, '');
    this.StoryNumberofWords = this.content.split(' ').length;
    if (this.storyContent != "") {
      this.displayActionButtons = true;
    } else {
      this.displayActionButtons = false;
    }
    this.storyCategory = this.selectedStory.storyCategory;
    this.dateSubmitted = this.selectedStory.dateSubmitted;
    let storyReporters = this.selectedStory.storyReporters
    let reporters = "";
    for (let i = 0; i < storyReporters.length; i++) {
      if (reporters != "") {
        reporters = storyReporters[i].user.firstName + " " + storyReporters[i].user.lastName + " and " + reporters;
      } else {
        reporters = storyReporters[i].user.firstName + " " + storyReporters[i].user.lastName;
      }
    }
    console.log(this.selectedStory);

    this.storyFiles = [];
    if (this.selectedStory.storyFiles) {
      if (this.selectedStory.storyFiles.length > 0) {
        this.storyFiles = this.selectedStory.storyFiles;
      }
    }
    this.storyReporters = "";
    this.storyReporters = "Story by " + reporters
    this.editorSeen = this.story.editorSeen;
  }

  prepareEditStory(selectedStory) {
    let storyId = null;
    this.selectedStory = selectedStory;
    if (this.selectedStory) {
      this.selectedStory = this.selectedStory;
      storyId = this.selectedStory.storyId;
      alert(storyId);
      this.parentRouter.navigate(['/e-story-editing/'], {
        queryParams: { story: storyId }
      });
    }
  }

  prepareStoryForApprovalCheck(selectedStory) {
    if (selectedStory) {
      this.storyApprovalStatusDisplay = true;
      this.status = this.selectedStory.approvalStatus;
      this.selectedStory = selectedStory;
      //this.storyApprovalStatusForm.controls["status"].setValue(this.storySelected.approvalStatus);
    }
  }

// Submit edited story =========================
  onSubmitEditedStory() {
    if (this.selectedStory) {
      if (this.storyContent != "") {
        this.selectedStory.storyContent = this.storyContent;
      } else {
        alert("No Story to Save. Story field is blank.");
      }
      if (this.storyTitle != "") {
        this.selectedStory.storyTitle = this.storyTitle;
      } else {
        alert("No Story Title. You can't save without a tiltle.");
      }

      //get reporter mails
      let reportersEmails = [];
      let storyReporterId = [];

      if (this.selectedStory.storyReporters) {
        if (this.selectedStory.storyReporters.length > 0)
          for (let storyReporter of this.selectedStory.storyReporters) {
            storyReporterId.push(storyReporter.userId);
            reportersEmails.push(storyReporter.user.username);
          }
      }
      this.selectedStory.storyReporters = [];
      this.selectedStory.storyReporters = storyReporterId;
      this.editStoryContentDisplay = false
      let controller = this;
      let postData = {
        "service": "EditingRS",
        "requestType": "saveEdittedBySupervisorStory",
        "requestData": {
          edittedStory: this.selectedStory,
          storySelected: this.selectedStory,
          editor: this.user.userData,
          reportersEmails: reportersEmails
        }
      }
      controller.sendRequestToServer(
        "user_service/AllService/",
        JSON.stringify(postData),
        true,
        function (response) {
         // controller.completeEditStoryProcess(response);
         if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
        controller.serverSuccessReturnMessage(response);
        if (controller._dateSelected) {
          controller.getUnEditedStoriesByCategoryAndDate(controller._dateSelected);
        } else {
          controller.dateSelected = new Date();
          let dates = [];
          dates.push(controller.dateSelected);
          controller.getUnEditedStoriesByCategoryAndDate(dates);
        }
        },
        function (err) {
          controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
        }
      );
    }
  }

//=======submite story approval status=========
  onSubmitStoryApprovalStatusChange() {
    if (this.selectedStory) {
      this.markStoryAsApproved(this.selectedStory);
    }
  }

  //============mark story as approved================
  markStoryAsApproved(story: any) {
    let storyReporterEmailAddresses = [];
    if (this.selectedStory.storyReporters) {
      for (let u of this.selectedStory.storyReporters) {
        storyReporterEmailAddresses.push(u.user.username);
      }
    }
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "markStoryAsEditorialApproved",
      "requestData": {
        story: story,
        user: this.user.userData,
        storyReporterEmailAddresses: storyReporterEmailAddresses,
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        //controller.completeAsMarkStoryApprovedProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
        controller.serverSuccessReturnMessage(response);
        controller.stories = [];
        controller.selectedStory = false;
        for (let story of response.returnData) {
          controller.stories.push(story);
        }
        if (controller._dateSelected) {
          controller.getUnEditedStoriesByCategoryAndDate(controller._dateSelected);
        }
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  markStoryAsSeen(storySelected: any) {
    //get reporter mails
    let reportersEmails = [];
    if (storySelected.storyReporters) {
      if (storySelected.storyReporters.length > 0) {
        for (let i = 0; i < storySelected.storyReporters.length; i++) {
          reportersEmails.push(storySelected.storyReporters[i].user.username);
        }
      }
    }
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "markStoryAsSeen",
      "requestData": {
        storySelected: storySelected,
        editor: this.user.userData,
        reportersEmails: reportersEmails
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        //controller.completeMarkStoryAsSeenSeverProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
        controller.selectedStory.editorSeen = true;
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }


  cloneStory(c: any): any {
    let story = {};
    for (let prop in c) {
      story[prop] = c[prop];
    }
    return story;
  }

  onNewDateSelected(value: Date) {
    this.stories = [];
    this.dateSelected = value;
    if (this._dateSelected) {
      this.getUnEditedStoriesByCategoryAndDate(this._dateSelected);
    }
  }

  getUnEditedStoryById(storyId: any) {
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "getStoryById",
      "requestData": {
        storyId: storyId,
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        //controller.completeGetStoryProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
        controller.serverSuccessReturnMessage(response);
        controller.stories = [];
        controller.selectedStory = false;
        for (let story of response.returnData) {
          controller.stories.push(story);
        }
        console.log(controller.stories);

      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  getUnEditedStoriesByCategoryAndDate(dateSelected) {
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
      "requestType": "getUnEditedStoriesByCategoryAndDate",
      "requestData": {
        storyCategoryId: this.user.userData.editorOfCategory,
        dateRangeValues: dateRangeValues,
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        //controller.completeGetStoryProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
        //controller.serverSuccessReturnMessage(response);
        controller.stories = [];
        controller.selectedStory = false;
        for (let story of response.returnData) {
          controller.stories.push(story);
        }
        console.log(controller.stories);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  confirmRejectStory() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reject this story?',
      header: 'Once this story is rejected, reporter(s) will be notified.',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.commentOnStory(this.selectedStory);
      },
    });
  }

  commentOnStory(selectedStory) {
    console.log(selectedStory.storyId);
    this.getAllCommentsByStoryId(selectedStory.storyId);
    this.storyCommentDisplay = true;
    this.comments = [];
  }

  confirmEditStory() {
    this.editStoryContentDisplay = false;
    this.confirmationService.confirm({
      message: 'Changes will be save this story and it will be marked as approved to proceed to next in editorial',
      header: 'Confirmation Story Changes Action',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onSubmitEditedStory();
      },
      reject: () => {
        this.confirmRejectStory();
      }
    });
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
        // controller.completeGetCommentsServerProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
        controller.serverSuccessReturnMessage(response);
        controller.story = response.returnData;
        console.log(response.returnData);
        controller.commentForm.reset();
        controller.comments = controller.story.comments;
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
      }
    );
  }


  // building equirements to rejecte story
  buildCommentOnStory() {
    let storyOwners = false;
    console.log(this.selectedStory);
    let storyReporterEmailAddresses = [];
    for (let u of this.selectedStory.storyReporters) {
      storyReporterEmailAddresses.push(u.user.username);
    }
    let form = this.commentForm.value;
    return {
      story: this.selectedStory,
      userId: this.user.userId,
      user: this.user.userData,
      storyReporterEmailAddresses: storyReporterEmailAddresses,
      comment: form.comment,
      storyOwner: storyOwners
    }
  }

  onSubmitComment() {
    this.markReportedStoryAsEditorialRejected();
    this.storyCommentDisplay = false;
  }

  markReportedStoryAsEditorialRejected() {
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "markStoryAsEditorialRejected",
      "requestData": this.buildCommentOnStory()
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        // controller.completemarkReportedStoryAsEditorialRejectedServerProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
        controller.serverSuccessReturnMessage(response);
        if (response.returnData != null) {
          controller.navigateToEditorialRejectedStories();
        }
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
      }
    );
  }

  navigateToEditorialRejectedStories() {
    this.parentRouter.navigate(['/e-rejected-stories/'], {
      queryParams: { date: this.datepipe.transform(new Date(), 'yyyy-MM-dd') }
    });
  }


  clearStoryDetails() {
    this.storyTitle = "";
    this.storyContent = "";
    this.storyCategory = "";
    this.dateSubmitted = "";
    this.storyReporters = "";
  }

  public tools: object = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable'
      //'Image'
      , '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen'
    ]
  };

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

  openFile(ob) {
    console.log(ob)
    let newPdfWindow = window.open("", "_blank");
    //let content = encodeURIComponent(response.byteString);
    let iframeStart = "<\iframe width='100%' height='100%' src='";
    let iframeEnd = "'><\/iframe>";
    newPdfWindow.document.write(iframeStart + ob + iframeEnd);
  }


  onStoryContentClicked() {
    if (this.selectedStory) {
      // if (this.selectedStory.editorSeen == false) {
      this.editStoryContentDisplay = true;
      // }
    }

  }
}
