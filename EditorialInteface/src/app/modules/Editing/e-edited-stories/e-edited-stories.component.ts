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
import { toDate } from '@angular/common/src/i18n/format_date';

@Component({
  selector: 'app-e-edited-stories',
  templateUrl: './e-edited-stories.component.html',
  styleUrls: ['./e-edited-stories.component.css']
})
export class EEditedStoriesComponent extends CommonComponent {

  stories: any[] = [];
  storySelected: any;
  cols: any[];
  menuItem: any;
  selectedStory: any;
  story: any = {};
  storyTitle: any;
  storyContent: any;
  storyCategory: any;
  dateSubmitted: any;
  storyReporters: any;
  displayActionButtons: boolean;
  estorySelected: any = {};
  estoryTitle: any;
  estoryContent: any;
  estoryCategory: any;
  edateSubmitted: any;
  dateSelected: Date;
  editStoryContentDisplay: boolean = false;
  storyCommentDisplay: boolean = false;
  storyFiles = [];
  commentForm: any;
  comments = [];
  storyId = null;
  editedVersionsList: any[] = [];
  originalStory: any[] = [];
  originalStoryNumberofWords = 0;
  editedStoryNumberofWords = 0;
  _dateSelected: any;
  content: any;
  eContent: any;
  storySubEditorialApproval: any;
  file: any;

  constructor(
    private formBuilder: FormBuilder,
    loaderService: LoaderService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    parentRouter: Router,
    public remoteHelper: RemoteHelper,
    modalService: NgbModal,
    public cookieService: CookieService,
    public datepipe: DatePipe,
    public confirmationService: ConfirmationService,
  ) {
    super(commonService, remoteHelper, loaderService, parentRouter, modalService, cookieService);
    super.ngOnInit();
  }


  ngOnInit() {
    this.cols = [
      { field: 'storyTitle', header: 'storyTitle' },
      { field: 'storyCategory', header: 'storyCategory' },
      { field: 'dateSubmited', header: 'Submited On' },
      { field: 'reporterStringList', header: 'reporterStringList' }
    ];

    this.menuItem = [
      { label: 'Decline Story', icon: 'pi pi-star-o', command: (event) => alert(this.selectedStory) },
      { label: 'Comment on story', icon: 'pi pi-comment', command: (event) => alert(this.selectedStory) },
      { label: 'Edit Story', icon: 'pi pi-pencil', command: (event) => alert(this.storySubEditorialApproval) }
    ];
    this.dateSelected = new Date();
    let dates = [];
    dates.push(this.dateSelected);
    this.getEditedStoriesByEditorIdAndDate(dates);
  }

  prepareEditStory(storySelected) {
    let storyId = null;
    this.storySelected = storySelected;
    if (this.storySelected) {
      this.storySelected = this.storySelected;
      storyId = this.storySelected.eStoryId;
      alert(storyId);
      this.parentRouter.navigate(['/e-story-editing/'], {
        queryParams: { story: storyId }
      });
    }
  }

  onEditedRowSelected(event) {
    this.editedVersionsList = [];
    this.story = {};
    this.story = this.cloneStory(event.data);
    this.storySelected = this.story;
    this.estoryContent = "";
    this.editedVersionsList = this.story.listEditVersion;

    this.storySubEditorialApproval = this.story.storySubEditorialApproval;

    if (this.editedVersionsList.length > 0) {
      this.estoryTitle = this.editedVersionsList[0].storyName;
      this.estorySelected = this.editedVersionsList[0];
      this.estoryContent = this.editedVersionsList[0].storyContent;

      this.eContent = this.estoryContent.replace(/<[^>]*>/gm, '');
      this.editedStoryNumberofWords = this.eContent.split(' ').length;
    }else{
      this.estoryTitle = this.story.storyTitle;
      this.estoryContent = this.story.storyContent;
      this.estoryContent = this.estoryContent.replace(/<[^>]*>/gm, '');
    }

    this.storyTitle = this.story.storyTitle;
    this.storyContent = this.story.storyContent;
    this.content = this.storyContent.replace(/<[^>]*>/gm, '');
    this.originalStoryNumberofWords = this.content.split(' ').length;

    this.originalStory = [];
    this.originalStory.push(this.storyContent)

    this.storyCategory = this.story.storyCategory;

    if (this.storyContent != "") {
      this.displayActionButtons = true;
    } else {
      this.displayActionButtons = false;
    }

    this.storyFiles = [];
    if (this.storySelected.storyFiles) {
      if (this.storySelected.storyFiles.length > 0) {
        this.storyFiles = this.storySelected.storyFiles;
      }
    }

    let reporters = "";

    this.storyReporters = [];
    this.storyReporters = this.story.storyReporters;
    if (this.storyReporters.length > 0) {
      for (let i = 0; i < this.storyReporters.length; i++) {
        if (reporters != "") {
          reporters = this.storyReporters[i].user.firstName + " " + this.storyReporters[i].user.lastName + " and " + reporters;
        } else {
          reporters = this.storyReporters[i].user.firstName + " " + this.storyReporters[i].user.lastName;
        }
      }
      this.storyReporters = "";
      this.storyReporters = "Story by " + reporters;
    }
  }

  showStoryCommentOnMouseEnter(event, story: any, overlaypanel: OverlayPanel) {
    if (story.storySubEditorialApproval == -1) {
      this.comments = [];
      this.comments = story.comments;
      overlaypanel.toggle(event);
    }
  }

  hideRowData(event: any) {
  }

  paginate(event) {
    this.estoryTitle = this.editedVersionsList[event.first].storyName;
    this.eContent = this.editedVersionsList[event.first].storyContent.replace(/<[^>]*>/gm, '');
    this.editedStoryNumberofWords = this.eContent.split(' ').length;
  }

  onNewDateSelected(value: Date) {
    this.stories = [];
    this.dateSelected = value;
    this.getEditedStoriesByEditorIdAndDate(this._dateSelected);
  }

  getEditedStoriesByEditorIdAndDate(dateSelected) {
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
      "service": "ReportingRS",
      "requestType": "getEditedStoriesByCategoryIdEditorIdAndDate",
      "requestData": {
        userId: this.user.userId,
        storyCategoryId: this.user.userData.editorOfCategory,
        dateRangeValues: dateRangeValues
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        //controller.completeGetStoryProcess(response);

        controller.storySelected = false;
        controller.stories = [];
        for (let story of response.returnData) {
          controller.stories.push(story);
        }
        console.log(response.returnData);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }
 

  onStoryClicked(storySubEditorialApproval) {
    //if (storySubEditorialApproval == 0 || storySubEditorialApproval == -1) {
    this.editStoryContentDisplay = true;
    //}
    // if (storySubEditorialApproval == 1) {
    //  alert("Story was already approved by chief sub-editor. Can't be edited.")
    // }
  }

  onSubmitEditedStory() {
    if (this.estoryContent != "") {
      this.estorySelected.storyContent = this.estoryContent;
    } else {
      alert("No Story Save. Story field is blank.");
    }
    if (this.estoryTitle != "") {
      this.estorySelected.storyTitle = this.estoryTitle;
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

    this.estorySelected.storyId = this.storySelected.storyId
    console.log(this.estorySelected);
    console.log(this.storySelected.storyId);
    this.editStoryContentDisplay = false;
    let controller = this;
    let postData = {
      "service": "EditingRS",
      "requestType": "saveEdittedBySupervisorStory",
      "requestData": {
        userId: this.user.userId,
        fullName: this.user.fullname,
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
        controller.completeEditStoryProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
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
    console.log(response.returnData[0].originalStory);
    //console.log(response.returnData[0].originalStory.lastEditedDate | Date);
    let date = [];
    date.push((this.datepipe.transform(response.returnData[0].originalStory.lastEditedDate, 'yyyy-MM-dd')))
    this.getEditedStoriesByEditorIdAndDate(date);
  }

  selectStory(event, story: any, overlaypanel: OverlayPanel) {
    this.storySelected = story;
    overlaypanel.toggle(event);
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
    });
  }


  cloneStory(s: any): any {
    let story = {};
    for (let prop in s) {
      story[prop] = s[prop];
    }
    return story;
  }

  //open story file form new browser tab
  openFile(ob) {
    console.log(ob)
    let newPdfWindow = window.open("", "_blank");
    //let content = encodeURIComponent(response.byteString);
    let iframeStart = "<\iframe width='100%' height='100%' src='";
    let iframeEnd = "'><\/iframe>";
    newPdfWindow.document.write(iframeStart + ob + iframeEnd);
  }

  confirmRemoveFile(file) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onRemoveFile(file);
      },
    });
  }

  //===========delete story file=============== 
  onRemoveFile(file: any) {
    this.file = file;
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "deleteStoryFile",
      "requestData": { fileId: file.fileId, createdBy: this.user.userId }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeDeleteFileServerProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeDeleteFileServerProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    let index = this.storyFiles.indexOf(this.file);
    this.selectedStory.storyFiles.splice(index, 1);
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

}
