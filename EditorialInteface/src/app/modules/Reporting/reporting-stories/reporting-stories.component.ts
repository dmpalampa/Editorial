import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ng2-cookies';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonComponent } from 'src/Services/CommonComponent';
import { LoaderService } from 'src/Services/LoaderService';
import { CommonService } from 'src/Services/CommonService';
import { RemoteHelper } from 'src/Services/RemoteHelper';

@Component({
  selector: 'app-reporting-stories',
  templateUrl: './reporting-stories.component.html',
  styleUrls: ['./reporting-stories.component.css'],
})
export class ReportingStoriesComponent extends CommonComponent {

  storyForm: any;
  submitted = false;
  story: any = null;

  storyCategories: any[];
  reportStory: string;
  fellowUsersList = [];
  fellowUsersListIds = [];
  _user: any;
  loggedInUser: any;
  uploadedFiles: any[] = [];
  storyFiles_ = [];
  uploaded: boolean;
  addFilesdisplay: boolean = false;
  tagFellowUserdisplay: boolean = false;
  reportersList = [];
  permanetArray = [];
  filteredReportersList = [];
  filteredCategories = [];
  reporters: any[];
  category: any;
  sub: any;
  file: any;

  storyIdToUpdate = null;

  constructor(
    private formBuilder: FormBuilder,
    loaderService: LoaderService,
    private route: ActivatedRoute,
    public commonService: CommonService,
    parentRouter: Router,
    public remoteHelper: RemoteHelper,
    modalService: NgbModal,
    public cookieService: CookieService,
    public confirmationService: ConfirmationService,

  ) {
    super(commonService, remoteHelper, loaderService, parentRouter, modalService, cookieService);
    super.ngOnInit();
  }

  ngOnInit() {
    this.storyForm = this.formBuilder.group({
      storyCategory: ['', [Validators.required]],
      storyTitle: ['', [Validators.required]],
      storyFiles: ['', []],
      username: ['',],
      _reporters: ['',],
    });
    this.uploaded = false;
    this.getStoryCategories();

    this.route.queryParams.subscribe(params => {
      this.storyIdToUpdate = params['story'];
      if (this.storyIdToUpdate != null) {
        this.getStoryById(this.storyIdToUpdate);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.storyForm.invalid) {
      alert("We have dected errors! Please review the data you are submitting");
      return;
    }
    let form = this.storyForm.value;
    this.storyForm.reset();
    this.fellowUsersListIds = [];
    this.fellowUsersListIds.push(this.user.userData);

    if (form._reporters) {
      if (form._reporters.length > 0) {
        for (let user of form._reporters) {
          this.fellowUsersListIds.push(user);
        }
      }
    }
    console.log(this.fellowUsersListIds);
    console.log(form._reporters);

    let storyCategoryEditors = form.storyCategory.categoryEditors
    console.log(form.storyCategory.categoryEditors);
    this.story = {
      storyId: this.storyIdToUpdate,
      storyContent: this.reportStory,
      storyTitle: form.storyTitle,
      storyReporters: this.fellowUsersListIds,
      storyCategory: form.storyCategory.categoryName,
      storyCategoryId: form.storyCategory.sCategoryId,
      storyCategoryEditors: storyCategoryEditors
    }
    console.log(this.story);
    this.addStory(this.story);
  }

  getUsersByRole() {
    if (this.permanetArray.length <= 0) {
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
          //controller.completeGetUsersByRoleProcess(response);
          if (response.returnCode != 0) {
            controller.serverErrorReturnMessage(response);
            return;
          }
          controller.tagFellowUserdisplay = true;
          controller.filteredReportersList = [];
          controller.permanetArray = [];

          if (response.returnData)
          controller.reportersList = response.returnData;
          console.log(controller.reportersList);
          for (let u of controller.reportersList) {
            if (controller.user.userId != u.userId) {
              controller.filteredReportersList.push(u);
            }
          }
          controller.reportersList = controller.filteredReportersList;
          controller.permanetArray = controller.reportersList;
        },
        function (err) {
          controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
        }
      );
    }
  }


  filterReportersMultiple(event) {
    this.filteredReportersList = [];
    let query = event.query;
    this.filteredReportersList = this.filterReporters(query, this.permanetArray);
  }

  filterReporters(query, reportersList: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < reportersList.length; i++) {
      let reporter = reportersList[i];
      if ((reporter.firstName.toLowerCase().indexOf(query.toLowerCase()) == 0) || (reporter.lastName.toLowerCase().indexOf(query.toLowerCase()) == 0)) {
        console.log(reporter);
        filtered.push(reporter);
      }
    }
    return filtered;
  }

  addStory(story: any) {
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "saveStory",
      "requestData": {
        story: story,
        files: this.uploadedFiles,
        addedBy: this.user.username
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        // controller.completeServerProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response);
          return;
        }
        controller.serverSuccessReturnMessage(response);
        let savedStory = response.returnData[0];

        if (response.returnData != null) {
          if (confirm("Do you have file(s) to attch on this story")) {
            controller.storyIdToUpdate = savedStory.storyId;
            controller.addFilesdisplay = true;
          } else {
            controller.navigateToviewAddedstory(savedStory.storyId);
          }
        }
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
        controller.completeGetStoryProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeGetStoryProcess(response) {
    //console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }

    let storyData = response.returnData;
    this.story = response.returnData;
    this.fellowUsersList = [];
    for (let u of storyData.storyReporters) {
      if (u.userId != this.user.userId) {
        this.filteredReportersList.push(u.user);
      }
    }

    for (let f of storyData.storyFiles) {
      this.storyFiles_.push(f);
    }
    this.filteredCategories = [];
    this.storyCategories = [];
    if (storyData.storyCategoryEntity) {
      this.filteredCategories.push(storyData.storyCategoryEntity);
      this.storyForm.controls["storyCategory"].setValue(this.filteredCategories[0]);
    }
    this.reportStory = storyData.storyContent;
    this.getStoryCategories();
    this.storyForm.controls["_reporters"].setValue(this.filteredReportersList);
    this.storyForm.controls["storyTitle"].setValue(storyData.storyTitle);
  }


  uploadFiles(uploadedFiles: any) {
    if (this.storyIdToUpdate != null) {
      let controller = this;
      let postData = {
        "service": "ReportingRS",
        "requestType": "saveStoryFiles",
        "requestData": {
          storyId: this.storyIdToUpdate,
          storyFiles: uploadedFiles
        }
      }
      controller.sendRequestToServer(
        "user_service/AllService/",
        JSON.stringify(postData),
        true,
        function (response) {
          controller.completeUploadFilesServerProcess(response);
        },
        function (err) {
          controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
        }
      );
    } else {
      alert("can't add files to un known story");
    }
  }


  completeUploadFilesServerProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.storyFiles_ = [];
    this.storyIdToUpdate = null;
    this.storyFiles_ = response.returnData;
    if (this.storyFiles_) {
      this.uploaded = true;
    }
    this.navigateToviewAddedstory(this.storyIdToUpdate);
  }


  //navigate user to reported stories after submiting a new story
  navigateToviewAddedstory(storyId: any) {
    this.parentRouter.navigate(['/r-reported-stories/'], {
      queryParams: { story: storyId }
    });
  }


  //=======================get users by user name============
  getUserByUserName() {
    let username = this.storyForm.value.username;
    this.storyForm.controls["username"].setValue("");
    let controller = this;
    let postData = {
      "service": "UsersRS",
      "requestType": "getUserByUserName",
      "requestData": { username: username }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        //controller.completegetUserBYNameServerProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response);
          return;
        }
        controller.serverSuccessReturnMessage(response);
        controller._user = response.returnData;
        controller.fellowUsersList.push(controller._user);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }


  removeFellowUser(user: any) {
    let index = this.fellowUsersList.indexOf(user);
    this.fellowUsersList.splice(index, 1);
    this.unTagStoryOwners(user.userId)
    return this.fellowUsersList;
  }


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
        // controller.completeDeleteFileServerProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response);
          return;
        }
        controller.serverSuccessReturnMessage(response);
        let index = controller.storyFiles_.indexOf(controller.file);
        controller.storyFiles_.splice(index, 1);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }


  unTagStoryOwners(user: any) {
    let userId = user.userId;
    if (this.story != null) {
      for (let user of this.story.storyReporters) {
        if (userId == user.userId) {
          if (userId && this.storyIdToUpdate != null) {
            let controller = this;
            let postData = {
              "service": "ReportingRS",
              "requestType": "unTagStoryOwners",
              "requestData": { userId: userId, storyId: this.storyIdToUpdate }
            }
            controller.sendRequestToServer(
              "user_service/AllService/",
              JSON.stringify(postData),
              true,
              function (response) {
                // controller.completeUnTagUserServerProcess(response);
                if (response.returnCode != 0) {
                  controller.serverErrorReturnMessage(response);
                  return;
                }
                controller.serverSuccessReturnMessage(response)
                controller._user = response.returnData;
                controller.fellowUsersList = controller._user
              },
              function (err) {
                controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
              }
            );
          } else {
            alert("user or story not identified");
          }
        }
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
        //controller.completeGetStoryCategoryProcess(response);
        if (response.returnCode != 0) {
          controller.serverErrorReturnMessage(response);
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
      'Indent', 'Outdent', '|', 'CreateTable', '|', 'ClearFormat', '|', 'FullScreen']
  };

  onUpload(event, form) {
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
          this.uploadFiles(this.uploadedFiles);
          this.uploadedFiles = [];
        }
      };
      reader.readAsDataURL(f[i]);
    }
    this.addFilesdisplay = false;
    form.clear();


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


  openFile(ob) {
    let newPdfWindow = window.open("", "_blank");
    //let content = encodeURIComponent(response.byteString);
    let iframeStart = "<\iframe width='100%' height='100%' src='";
    let iframeEnd = "'><\/iframe>";
    newPdfWindow.document.write(iframeStart + ob + iframeEnd);
  }

  showDialogAddFiles() {
    this.addFilesdisplay = true;
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
}

