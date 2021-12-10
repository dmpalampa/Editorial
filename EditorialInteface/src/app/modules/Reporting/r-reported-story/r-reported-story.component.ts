import { Component, ElementRef, Inject } from '@angular/core';
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

@Component({
  selector: 'app-r-reported-story',
  templateUrl: './r-reported-story.component.html',
  styleUrls: ['./r-reported-story.component.css']
})
export class RReportedStoryComponent extends CommonComponent {

  displayDialog: boolean;
  editStoryContentDisplay: boolean = false;
  story: any = {};
  selectedStory: any;
  newStrory: boolean;
  stories: any[] = [];
  storySelected: any;
  cols: any[];
  menuItem: any;
  storyTitle: any;
  storyContent: any;
  storyCategory: any;
  _storyCategory: any;
  dateSubmitted: any;
  storyReporters: any;
  editorSeen: boolean;
  lastEditedDate: any;
  storyEdited: boolean = false;
  storyFiles = [];
  file: any;
  dateSelected: Date;
  _dateSelected: any;
  noStoriesDate: any;
  uploadedFiles: any[] = [];
  storyFiles_ = [];
  tagFellowUserdisplay: boolean = false;
  reportersList = [];
  permanetArray = [];
  filteredReportersList = [];
  filteredCategories = [];
  reporters: any[];
  fellowUsersList = [];
  fellowUsersListIds = [];
  storyCategories: any[];
  _reporters: any[] = [];
  reportedStory = [];
  StoryNumberofWords = 0;
  content: any;
  storyId: any;
  comments = [];
  editorialApproval: any;
  storySubEditorialApproval: any
  dateOfEditorialApprovalStatus: any;
  dateSubEditorialApproval: any
  dateEditorSeen: any;
  dateApproved: any;

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
    this.dateSelected = new Date();
    let dates = [];
    dates.push(this.dateSelected);

    this.cols = [
      { field: 'storyTitle', header: 'storyTitle' },
      { field: 'storyCategory', header: 'storyCategory' },
      { field: 'dateSubmited', header: 'Submited On' }
    ];

    this.menuItem = [
      { label: 'Seen', icon: 'pi pi-pencil', command: () => { this.getStoryToEdit(this.selectedStory) } },
      { label: 'Edited', icon: 'pi pi-comment', command: () => { alert(this.selectedStory.storyTitle) } },
      { label: 'Published', icon: 'pi pi-tag', command: () => { alert(this.selectedStory.storyTitle) } },
      { label: 'Rejected', icon: 'pi pi-pencil', command: () => { this.getStoryToEdit(this.selectedStory) } },
      { label: 'Edited and Not published', icon: 'pi pi-comment', command: () => { alert(this.selectedStory.storyTitle) } },
      { label: 'Seen and not Edited', icon: 'pi pi-tag', command: () => { alert(this.selectedStory.storyTitle) } }
    ];

    this.route.queryParams.subscribe(params => {
      this.storyId = params['story'];
      if (this.storyId != null) {
        this.getStoryById(this.storyId);
      } else {
        this.getReportedStoryByDateForReporter(dates);
      }
    });
  }

  //when new date selected
  onNewDateSelected(value: String) {
    this.stories = [];
    console.log(this._dateSelected);
    this.getReportedStoryByDateForReporter(this._dateSelected);
  }

  //get reported for date for one reporter
  getReportedStoryByDateForReporter(dateSelected) {
    let dateRangeValues = [];
    let date = dateSelected;
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
    this.noStoriesDate = date;
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "getReportedStoriesByDateAndReporterId",
      "requestData": { dateRangeValues: dateRangeValues, reporterId: this.user.userId }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
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

  getStoryById(storyId: any) {
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "getStoryById",
      "requestData": { storyId: storyId }
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

  getStoryToEdit(selectedStory) {
    console.log(selectedStory);
    if (selectedStory.approvalStatus == false || selectedStory.approvalStatus == null) {
      this.parentRouter.navigate(['/report-stories/'], {
        queryParams: { story: selectedStory.storyId }
      });
    } else {
      alert("Editing approved story is not allowed");
    }
  }

  onRowSelect(event) {
    this.storySelected = "";
    this.newStrory = false;
    this.story = this.cloneStory(event.data);
    this.storySelected = this.story;
    this.editorialApproval = this.story.editorialApproval;
    this.storySubEditorialApproval = this.story.storySubEditorialApproval;
    this.dateSubEditorialApproval = this.story.dateSubEditorialApproval;
    this.reportedStory = [];
    this.reportedStory.push(this.storySelected);
    this.storyTitle = this.story.storyTitle;
    this.storyContent = this.story.storyContent;
    this.content = this.storyContent.replace(/<[^>]*>/gm, '');
    this.StoryNumberofWords = this.content.split(' ').length;
    this.storyCategory = this.story.storyCategory;
    this.dateSubmitted = this.story.dateSubmitted;
    this.dateEditorSeen = this.story.dateEditorSeen;
    this.storyEdited = this.story.edited;
    this.lastEditedDate = this.story.lastEditedDate;
    this.editorSeen = this.story.editorSeen;
    this.dateOfEditorialApprovalStatus = this.story.dateOfEditorialApprovalStatus;
    this.dateApproved = this.story.dateSubmitted;
    let reporters = "";
    let storyReporters = this.storySelected.storyReporters;

    for (let i = 0; i < storyReporters.length; i++) {
      if (reporters != "") {
        reporters = storyReporters[i].user.firstName + " " + storyReporters[i].user.lastName + " and " + reporters;
      } else {
        reporters = storyReporters[i].user.firstName + " " + storyReporters[i].user.lastName;
      }
    }
    this.storyFiles = [];
    if (this.storySelected.storyFiles) {
      if (this.storySelected.storyFiles.length > 0) {
        this.storyFiles = this.storySelected.storyFiles;
      }
    }
    this.storyReporters = "";
    this.storyReporters = "Story by " + reporters
    this.editorSeen = this.story.editorSeen;
  }

  selectStory(event, story: any, overlaypanel: OverlayPanel) {
    this.selectedStory = story;
    overlaypanel.toggle(event);
    this.getUsersByRole();
  }

  getStoriesForOneReporter() {
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "getStoriesForOneReporter",
      "requestData": null
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
        controller.stories = [];
        controller.storySelected = false;
        if (response.returnData) {
          for (let s of response.returnData) {
            controller.stories.push(s);
          }
          console.log(controller.stories)
        }
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }


  //===========delete story file=============== 
  onRemoveFile(file: any) {
    this.file = file;
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "deleteStoryFile",
      "requestData": { fileId: file.fileId, createdBy: controller.user.userId }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
        controller.serverSuccessReturnMessage(response);
        let index = controller.storyFiles.indexOf(controller.file);
        controller.selectedStory.storyFiles.splice(index, 1);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }



  //=========upload story files method=========
  uploadFiles(uploadedFiles: any, storyId: any) {
    if (storyId != null) {
      let controller = this;
      let postData = {
        "service": "ReportingRS",
        "requestType": "saveStoryFiles",
        "requestData": {
          storyId: storyId,
          storyFiles: uploadedFiles
        }
      }
      controller.sendRequestToServer(
        "user_service/AllService/",
        JSON.stringify(postData),
        true,
        function (response) {
          // controller.completeUploadFilesServerProcess(response);
          if (response.returnCode != 0) {
            controller.serverErrorReturnMessage(response)
            return;
          }
          controller.serverSuccessReturnMessage(response);
          controller.storyFiles_ = [];
          controller.selectedStory.storyFiles = [];
          controller.storyFiles_ = response.returnData;
          controller.selectedStory.storyFiles = response.returnData;
          console.log(response.returnData);
        },
        function (err) {
          controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
        }
      );
    } else {
      alert("can't add files to un known story");
    }
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

  //=========save story changes===============
  saveStoryContentChanges() {
    this.editStoryContentDisplay = false;
    this.fellowUsersListIds = [];
    this.fellowUsersListIds.push(this.user.userData);
    console.log(this._reporters);
    if (this._reporters.length > 0) {
      for (let user of this._reporters) {
        if (user) {
          this.fellowUsersListIds.push(user);
        }
      }
    }
    this.selectedStory.storyReporters = this.fellowUsersListIds;
    if (this.selectedStory) {
      if (this.storyContent == "") {
        alert("No Story to Save. Story field is blank.");
        return;
      }
      this.selectedStory.storyContent = this.storyContent;

      if (this.storyTitle == "") {
        alert("No Story Title. You can't save without a tiltle.");
        return;
      }
      this.selectedStory.storyTitle = this.storyTitle;

      this.selectedStory.storyCategory = this._storyCategory.categoryName;
      this.selectedStory.storyCategoryId = this._storyCategory.sCategoryId;

      if (this._storyCategory.categoryEditors) {
        this.selectedStory.storyCategoryEditors = this._storyCategory.categoryEditors
      }

      console.log(this.selectedStory);
      let controller = this;
      let postData = {
        "service": "ReportingRS",
        "requestType": "saveStory",
        "requestData": {
          story: this.selectedStory,
          editedBy: this.user.username
          //    files: this.uploadedFiles
        }
      }
      controller.sendRequestToServer(
        "user_service/AllService/",
        JSON.stringify(postData),
        true,
        function (response) {
          if (response.returnCode != 0) {
            controller.serverErrorReturnMessage(response)
            return;
          }
          controller.serverSuccessReturnMessage(response);
          if (response.returnData != null) {
            let story = response.returnData;
            //this.getReportedStoryByDateForReporter(this._dateSelected);
            console.log(story[0].storyReporters);
            console.log(story[0].storyId);
            controller.getStoryById(story[0].storyId);
          }
        },
        function (err) {
          controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
        }
      );
    }
  }


  onStoryContentClicked() {
    if (this.selectedStory) {
      this.editStoryContentDisplay = true;
      this.getStoryCategories();
      this.filteredReportersList = [];
      this._reporters = [];
      if (this.selectedStory.storyReporters) {
        for (let u of this.selectedStory.storyReporters) {
          if (u.user.userId != this.user.userId) {
            this._reporters.push(u.user);
          }
        }
      }
      this.filteredReportersList = this._reporters;
      this.filteredCategories = this.selectedStory.storyCategoryEntity;
      this._storyCategory = this.filteredCategories;
    }
  }


  getUsersByRole() {
    if (this.reportersList.length <= 0) {
      let controller = this;
      let postData = {
        "service": "UsersRS",
        "requestType": "getUsersByRole",
        "requestData": { userRole: 'reporter' }
      }
      controller.sendRequestToServer(
        "user_service/AllService/",
        JSON.stringify(postData),
        true,
        function (response) {
          // controller.completeGetUsersByRoleProcess(response);
          if (response.returnCode != 0) {
            controller.serverErrorReturnMessage(response)
            return;
          }
          controller.reportersList = [];
          if (response.returnData != null) {

            //controller.reportersList = response.returnData;
            if (response.returnData.length > 0) {
              let reporters = [];
              for (let u of response.returnData) {
                if (controller.user.userId != u.userId) {
                  //controller.filteredReportersList.push(u);
                  reporters.push(u);
                }
              }
              console.log(reporters);
              controller.reportersList = reporters;
              controller.filteredReportersList = reporters;
            }
          }
        },
        function (err) {
          controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
        }
      );
    }
  }

  //=======get story categories=====
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
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response)
          return;
        }
        controller.filteredCategories = [];
        controller.storyCategories = [];
        controller.storyCategories = response.returnData;
        controller.filteredCategories = response.returnData;
        console.log(controller.storyCategories);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  showStoryCommentOnMouseEnter(event, story: any, overlaypanel: OverlayPanel) {
    if (story.comments) {
      if (story.editorialApproval == -1 || story.storySubEditorialApproval == -1) {
        this.comments = [];
        this.comments = story.comments;
        console.log(this.comments);
        overlaypanel.toggle(event);
      }
    }
  }

  hideRowData(event: any) {
  }


  confirmUnTagFellowReporter(user) {
    this.editStoryContentDisplay = false;
    this.confirmationService.confirm({
      message: 'This person will be removed from the list reportes who did tis story',
      header: 'Are you sure you want to untag ' + user.username,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.unTagStoryOwners(user);
        this.getReportedStoryByDateForReporter(this.dateSelected);
      },
    });
  }

  unTagStoryOwners(user: any) {
    let userId = user.userId;
    if (this.selectedStory != null) {
      for (let user of this.selectedStory.storyReporters) {
        if (userId == user.userId) {
          let controller = this;
          let postData = {
            "service": "ReportingRS",
            "requestType": "unTagStoryOwners",
            "requestData": { userId: userId, storyId: this.selectedStory.storyId }
          }
          controller.sendRequestToServer(
            "user_service/AllService/",
            JSON.stringify(postData),
            true,
            function (response) {
              // controller.completeUnTagUserServerProcess(response);
              if (response.returnCode != 0) {
                controller.serverErrorReturnMessage(response)
                return;
              }
              controller.serverSuccessReturnMessage(response);
              controller.filteredReportersList = response.returnData;
              console.log(response.returnData);
              controller.editStoryContentDisplay = true;
            },
            function (err) {
              controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
            }
          );
        }
      }
    }
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

  //open story file form new browser tab
  openFile(ob) {
    console.log(ob)
    let newPdfWindow = window.open("", "_blank");
    //let content = encodeURIComponent(response.byteString);
    let iframeStart = "<\iframe width='100%' height='100%' src='";
    let iframeEnd = "'><\/iframe>";
    newPdfWindow.document.write(iframeStart + ob + iframeEnd);
  }

  onUpload(event, form, storyId: any) {
    this.uploadedFiles = [];
    const f = event.files;
    for (let i = 0; i < f.length; i++) {
      let file = {
        fileContent: '',
        fileName: '',
        fileType: ''
      };
      file.fileName = f[i].name;
      file.fileType = f[i].type;
      const reader = new FileReader();
      reader.onload = (fileData) => {
        file.fileContent = reader.result + '';
        console.log(file);
        this.uploadedFiles.push(file);
        console.log(this.uploadedFiles);
        if (i + 1 == f.length) {
          this.uploadFiles(this.uploadedFiles, storyId);
          this.uploadedFiles = [];
        }
      };
      reader.readAsDataURL(f[i]);
    }
    form.clear();
  }

  filterReportersMultiple(event) {
    this.filteredReportersList = [];
    let query = event.query;
    this.filteredReportersList = this.filterReporters(query, this.reportersList);
  }

  filterReporters(query, reportersList: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < reportersList.length; i++) {
      let reporter = reportersList[i];
      if (reporter.username.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        console.log(reporter);
        filtered.push(reporter);
      }
    }
    return filtered;
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

  public tools: object = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateTable',
      '|', 'ClearFormat', 'Print', '|', 'FullScreen']
  };

  cloneStory(c: any): any {
    let story = {};
    for (let prop in c) {
      story[prop] = c[prop];
    }
    return story;
  }
}
