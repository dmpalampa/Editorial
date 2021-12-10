import { Component, ElementRef, ViewChild } from '@angular/core';
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
import * as  fileSaver from 'file-saver';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

import html2canvas from 'html2canvas';

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-ed-view-story-statistics',
  templateUrl: './ed-view-story-statistics.component.html',
  styleUrls: ['./ed-view-story-statistics.component.css']
})


export class EdViewStoryStatisticsComponent extends CommonComponent {

  cols: any[];
  dateSelected: Date
  dateRangeSelected: any;
  monthSelected: Date;
  reporterStoryCount: any;
  exportColumns: any[];

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
    this.onNewMonthSelected(this.dateSelected);

    this.cols = [
      { field: 'firstName', header: 'Full Name' },
      { field: 'submittedStories', header: 'Submitted' },
      { field: 'editorialRejected', header: 'E-Rejected' },
      { field: 'subEditorialRejected', header: 'Sub-E Rejected' },
      { field: 'numberOftoriesSubEditorialIgnored', header: 'Sub-E Ignored' },
      { field: 'publishedStories', header: 'published' },
    ];

    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  onNewMonthSelected(value: Date) {
    //this.monthSeleted = value;
    let month = this.datepipe.transform(value, 'yyyy-MM')
    this.monthSelected = new Date(month);
    console.log(this.monthSelected);
    this.getReportersWithStoryCountForAMonth(month);
  }

  onNewDateRangeSelected(value: String) {
    console.log(value);
    this.getReportersWithStoryCountBetweenStoryDateRange(this.dateRangeSelected);
  }

  getReportersWithStoryCountBetweenStoryDateRange(dateSelected) {
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

    let controller = this;
    let postData = {
      "service": "EAdminRS",
      "requestType": "getReportersWithStoryCountBetweenStoryDateRange",
      "requestData": { dateRangeValues: dateSelected }
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

  getReportersWithStoryCountForAMonth(monthSelected) {
    let controller = this;
    let postData = {
      "service": "EAdminRS",
      "requestType": "getNumberOfStoriesSubmittedByReporterInAMonth",
      "requestData": { month: monthSelected }
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
    this.reporterStoryCount = response.returnData;
    console.log(response.returnData);
  }

  exportPdf() {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.autoTable(this.exportColumns, this.reporterStoryCount);
    //doc.save(this.getFileName('.pdf'));
    doc.save('Data Report'+this.datepipe.transform(this.dateSelected, 'yyyy-MM-dd')+'.pdf');
  }


  //==================test area==========================
  public captureScreen() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });
  }


  //======================test======================xxxxxxxxxxxxxxxx
  @ViewChild('TABLE') TABLE: ElementRef;  
  exportExcel() {
    const ws = XLSX.utils.json_to_sheet(this.reporterStoryCount);
    const workbook = { Sheets: { 'data': ws }, SheetNames: ['Editorial Performance report'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
     this.saveAsExcelFile(excelBuffer, "Data-Table");
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      fileSaver.saveAs(data, fileName + '_export_' + this.datepipe.transform(this.dateSelected, 'yyyy-MM-dd') + EXCEL_EXTENSION);
  }
}
