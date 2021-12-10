import { Component, OnInit, ElementRef, Inject } from '@angular/core';
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
  selector: 'app-sb-finished-pages',
  templateUrl: './sb-finished-pages.component.html',
  styleUrls: ['./sb-finished-pages.component.css']
})
export class SbFinishedPagesComponent extends CommonComponent {
  uploadedFiles: any[] = [];
  pageFiles: any[] = [];
  dateSelected: Date;
  subEditedPagesList = [];
  addFilesdisplay: boolean = false;
  selectedPage = null;
  pagesAssigned: any[];
  pageFile: any;
  cols: any[];
  fileContent: any;
  content: any;

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
    let dates = [];
    dates.push(this.dateSelected);
    this.getSubEditedpagesBySubEditorIdAndDate(dates)
 
    this.cols = [
      { field: 'fileName', header: 'fileName' },
    ];
 
  }

  openAddFilesDialog(){
    this.addFilesdisplay=true;
    let dates = [];
    dates.push(this.dateSelected);
    this.getBookPagesExistingForADay(dates);
  
  }

  onNewDateSelected(dateSelected){
    let dates = [];
    dates.push(dateSelected);
    this.getBookPagesExistingForADay(dates);
    this.getSubEditedpagesBySubEditorIdAndDate(dates);
  }


  getSubEditedpagesBySubEditorIdAndDate(dateSelected){

    let dateRangeValues =[];
    for(let date of dateSelected){
      let d = this.datepipe.transform(dateSelected, 'yyyy-MM-dd');
      dateRangeValues.push(d);
    }
    let controller = this;
    let postData = {
      "service": "SubEditingRS",
      "requestType": "getSubEditedpagesBySubEditorIdAndDate",
      "requestData": {
        subEditor: this.user.userData,
         dateRangeValues: dateRangeValues,
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
  }


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


  uploadFiles(uploadedFiles: any) {
    let controller = this;
    let postData = {
      "service": "SubEditingRS",
      "requestType": "subEditorSavedSubEditedPages",
      "requestData": {
        subEditor: this.user.userData,
        pageFiles: uploadedFiles,
        bookPage: this.selectedPage,
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
    console.log(response.returnData);
    this.subEditedPagesList =[];
    this.subEditedPagesList = response.returnData;
    if (this.pageFiles) {
      // this.uploaded = true;
    }
  }


  getBookPagesExistingForADay(dateSelected: any) {
    let dateRangeValues =[];
    for(let date of dateSelected){
      let d = this.datepipe.transform(dateSelected, 'yyyy-MM-dd');
      dateRangeValues.push(d);
    }

    let controller = this;
    let postData = {
      "service": "SubEditingRS",
      "requestType": "getBookPagesExistingForADay",
      "requestData": {
        subEditorId: this.user.userId,
        dateRangeValues: dateRangeValues,
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeGetBookPagesExistingForADayServerProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }

  completeGetBookPagesExistingForADayServerProcess(response) {
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
    this.pagesAssigned=[];
    if (response.returnData != null) {
      this.pagesAssigned.push({ label: 'Select page', value: ''});
      for (let page of response.returnData) {
        this.pagesAssigned.push({ label: page.page.pageNumber, value: page.page });
      }
    }

    // this.pageFiles = response.returnData;
    if (this.pageFiles) {
      // this.uploaded = true;
    }
  }

  onRowSelect(event) {
    this.selectedPage = this.cloneStory(event.data);
   this.fileContent = this.selectedPage.fileContent;
  this.openFile(this.fileContent);
}

openFile(ob) {
  let newPdfWindow = window.open("", "_blank");
  //let content = encodeURIComponent(response.byteString);
  let iframeStart = "<\iframe width='100%' height='100%' src='";
  let iframeEnd = "'><\/iframe>";
  this.content = iframeStart + ob + iframeEnd;
  newPdfWindow.document.write(iframeStart + ob + iframeEnd);
}

cloneStory(c: any): any {
  let story = {};
  for (let prop in c) {
    story[prop] = c[prop];
  }
  return story;
}

}