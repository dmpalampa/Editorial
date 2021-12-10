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
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-ed-view-reporters-stories',
  templateUrl: './ed-view-reporters-stories.component.html',
  styleUrls: ['./ed-view-reporters-stories.component.css'],
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
export class EdViewReportersStoriesComponent extends CommonComponent {

  displayDialog: boolean;
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
      { label: 'Edited', icon: 'pi pi-comment', command: () => { this.commentOnStory(this.selectedStory) } },
      { label: 'Published', icon: 'pi pi-tag', command: () => { alert(this.selectedStory.storyTitle) } },
      { label: 'Rejected', icon: 'pi pi-pencil', command: () => { this.getStoryToEdit(this.selectedStory) } },
      { label: 'Edited and Not published', icon: 'pi pi-comment', command: () => { this.commentOnStory(this.selectedStory) } },
      { label: 'Seen and not Edited', icon: 'pi pi-tag', command: () => { alert(this.selectedStory.storyTitle) } }
    ];

    this.route.queryParams.subscribe(params => {
      this.storyId = params['story'];
      if (this.storyId != null) {
        this.getStoryById(this.storyId);
      } else {
        this.getReporterStoriesOfAllCategoryBetweenDateRanges(dates);
      }
    });
  }

  onNewDateSelected(value: String) {
    this.stories = [];
    console.log(this._dateSelected);
    this.getReporterStoriesOfAllCategoryBetweenDateRanges(this._dateSelected);
  }

  getReporterStoriesOfAllCategoryBetweenDateRanges(dateSelected) {
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
      "service": "EAdminRS",
      "requestType": "getReporterStoriesOfAllCategoryBetweenDateRanges",
      "requestData": { dateRangeValues: dateRangeValues, reporterId: this.user.userId }
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

  commentOnStory(selectedStory: any) {
    this.parentRouter.navigate(['/comments/'], {
      queryParams: { story: selectedStory.storyId }
    });
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
    this.reportedStory = [];
    this.reportedStory.push(this.storySelected);
    this.storyTitle = this.story.storyTitle;
    this.storyContent = this.story.storyContent;
    this.content = this.storyContent.replace(/<[^>]*>/gm, '');
    this.StoryNumberofWords = this.content.split(' ').length;
    this.storyCategory = this.story.storyCategory;
    this.dateSubmitted = this.story.dateSubmitted;
    let reporters = "";
    let storyReporters = this.story.storyReporters;
    console.log(this.story);
    console.log(this.story.storyReporters);

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

  cloneStory(c: any): any {
    let story = {};
    for (let prop in c) {
      story[prop] = c[prop];
    }
    return story;
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

    this.stories = response.returnData;
    this.storySelected = false;
    //// this.selectedStory = null;
    // for (let s of response.returnData){
    //   this.stories.push(s);
    // }
    console.log(this.stories)
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

  getUsersByRole() {
    if (this.reportersList.length == 0) {
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
          controller.completeGetUsersByRoleProcess(response);
        },
        function (err) {
          controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
        }
      );
    }
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
    this.tagFellowUserdisplay = true;
    this.filteredReportersList = [];
    if (response.returnData)
      this.reportersList = response.returnData;
    console.log(this.reportersList);
    for (let u of this.reportersList) {
      if (this.user.userId != u.userId) {
        this.filteredReportersList.push(u);
      }
    }
    this.reportersList = this.filteredReportersList;
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

}
