
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
import { Pipe, PipeTransform} from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-e-rejected-stories',
  templateUrl: './e-rejected-stories.component.html',
  styleUrls: ['./e-rejected-stories.component.css']
})

@Pipe({ name: 'safe' })
export class ERejectedStoriesComponent extends CommonComponent  implements PipeTransform {
 

  displayDialog: boolean;
  storyApprovalStatusDisplay: boolean;
  editStoryContentDisplay: boolean = false;
  story: any = {};
  selectedStory: any;
  stories: any[] = [];
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
  _dateSelected: any;
  storyId = null;
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
    private sanitizer: DomSanitizer
  ) {
    super(commonService, remoteHelper, loaderService, parentRouter, modalService, cookieService);
    super.ngOnInit();
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      comment: ['',],
    });

    this.cols = [
      { field: 'storyTitle', header: 'storyTitle' },
      { field: 'storyCategory', header: 'storyCategory' },
      { field: 'dateSubmited', header: 'Submited On' }
    ];

    this.menuItem = [
      { label: 'Request For more Info', icon: 'pi pi-info-circle', command: (event) => alert(this.selectedStory) },
      { label: 'Comment on story', icon: 'pi pi-comment', command: (event) => alert(this.selectedStory) },
    ];

    this.dateSelected = new Date();
    let dates = [];
    dates.push(this.dateSelected);

    this.route.queryParams.subscribe(params => {
      let storyDate = params['date'];
      if (storyDate != null) {
        dates = [];
        this.datepipe.transform(new Date(), 'yyyy-MM-dd')
        dates.push(storyDate);
        this.getRejectedStoriesByCategoryAndDate(dates);
      } else {
        this.getRejectedStoriesByCategoryAndDate(dates);
      }
    });
  }

  selectStory(event, story: any, overlaypanel: OverlayPanel) {
    this.selectedStory = story;
    overlaypanel.toggle(event);
  }

  onRowSelect(event) {
    console.log(event);
    console.log( this.selectedStory);
    this.story = this.cloneStory(event.data);
    this.selectedStory = this.story;
    this.storyTitle = this.selectedStory.storyTitle;
    this.storyContent = this.selectedStory.storyContent;
    this.storyContent = this.story.storyContent;
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

  onSubmitEditedStory() {
    if (this.selectedStory) {
      if (this.storyContent != "") {
        this.selectedStory.storyContent = this.storyContent;
      } else {
        alert("No Story Save. Story field is blank.");
      }
      if (this.storyTitle != "") {
        this.selectedStory.storyTitle = this.storyTitle;
      } else {
        alert("No Story Title. You can't save without a tiltle.");
      }

      let storyReporterId = [];
      for (let storyReporter of this.selectedStory.storyReporters) {
        storyReporterId.push(storyReporter.userId);
      }
      this.selectedStory.storyReporters = [];
      this.selectedStory.storyReporters = storyReporterId;

      this.editStoryContentDisplay = false
      let controller = this;
      let postData = {
        "service": "ReportingRS",
        "requestType": "saveEdittedBySupervisorStory",
        "requestData": {
          userId: this.user.userId,
          fullName: this.user.fullname,
          edittedStory: this.selectedStory
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
    this.dateSelected = new Date();
    this.getRejectedStoriesByCategoryAndDate(this.dateSelected);
  }


  markStoryAsApproved(story: any) {
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "markStoryAsApproved",
      "requestData": { storyId: story.storyId }
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
    this.getRejectedStoriesByCategoryAndDate(this._dateSelected);
  }

  getRejectedStoriesByCategoryAndDate(dateSelected) {
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
      "requestType": "getRejectedStoriesByCategoryAndDate",
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
    this.selectedStory = false;
    for (let story of response.returnData) {
      this.stories.push(story);
    }
    console.log(this.stories);
  }

  confirmRecoverStory() {
    this.confirmationService.confirm({
      message: 'The story will be recovered',
      header: 'Confirm Story Recover',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.markStoryAsEditorialApproved(this.selectedStory);
        console.log(this.selectedStory);
      },
    });
  }


  showStoryCommentOnMouseEnter(event, story: any, overlaypanel: OverlayPanel) {
    this.comments = [];
    this.comments = story.comments;
    console.log(this.comments);
    overlaypanel.toggle(event);
  }

  hideRowData(rowData) {
  }


  markStoryAsEditorialApproved(storySelected) {

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
        user: this.user.userData,
        storyReporterEmailAddresses: storyReporterEmailAddresses,
        story: storySelected
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeMarkStoryAsEditorialApprovedProcess(response, storySelected.storyId);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeMarkStoryAsEditorialApprovedProcess(response, storyId) {
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
    this.navigateToEditorialRejectedStories(storyId);
  }

  navigateToEditorialRejectedStories(storyId: any) {
    this.parentRouter.navigate(['/e-reported-stories/'], {
      queryParams: { story: storyId }
    });
  }


  // onSubmitComment() {

  //   console.log(this.selectedStory);
  //   let storyReporterEmailAddresses = [];
  //   for (let u of this.selectedStory.storyReporters) {
  //     storyReporterEmailAddresses.push(u.user.username);
  //   }
  //   let form = this.commentForm.value;
  //   console.log(form);
  //   let controller = this;
  //   let postData = {
  //     "service": "ReportingRS",
  //     "requestType": "saveComment",
  //     "requestData": {
  //       storyId: this.selectedStory.storyId,
  //       userId: this.user.userId,
  //       username: this.user.username,
  //       storyReporterEmailAddresses: storyReporterEmailAddresses,
  //       comment: form.comment,
  //       //storyOwner: storyOwners
  //     }
  //   }
  //   controller.sendRequestToServer(
  //     "user_service/AllService/",
  //     JSON.stringify(postData),
  //     true,
  //     function (response) {
  //       controller.completeSubmitStoryCommentServerProcess(response);
  //     },
  //     function (err) {
  //       controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
  //     }
  //   );
  //   this.storyCommentDisplay = false;
  //   this.markStoryAsEditorialApproved(this.selectedStory);
  // }


  // completeSubmitStoryCommentServerProcess(response) {
  //   console.log('response from master\n\n ' + JSON.stringify(response));
  //   if (response.returnCode != 0) {
  //     let modalContent = {
  //       title: 'Error',
  //       message: response.returnMessage
  //     }
  //     this.showDialog(modalContent);
  //     return;
  //   }
  //   let modalContent = {
  //     title: 'Success',
  //     message: response.returnMessage
  //   }
  //   this.showDialog(modalContent);
  //   this.commentForm.reset();
  //   this.comments = this.story.comments;
  //   //this.getAllCommentsByStoryId(this.selectedStory.storyId)
  // }


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

  openFile(ob) {
    let newPdfWindow = window.open("", "_blank");
    //let content = encodeURIComponent(response.byteString);
    let iframeStart = "<\iframe width='100%' height='100%' src='";
    let iframeEnd = "'><\/iframe>";
    newPdfWindow.document.write(iframeStart + ob + iframeEnd);
  }
}