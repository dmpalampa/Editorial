import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'ng2-cookies';
import { AccordionModule, CalendarModule, DataTableModule, DropdownModule, MegaMenuModule, SelectButtonModule, DialogModule } from 'primeng/primeng';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsModalModule } from 'ng2-bs3-modal';
import { TableModule } from 'primeng/table';
import {
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule
} from '@angular/material';
import { SpinnerModule } from 'angular2-spinner/dist';
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CustomDialogComponent } from './dialogs/custom-dialog/custom-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonService } from '../Services/CommonService';
import { LoaderService } from '../Services/LoaderService';
import { RemoteHelper } from '../Services/RemoteHelper';
import { ComponentsModule } from "./components/components.module";
import { RouterModule } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { EReportedStoriesGaurdService } from './modules/Editing/e-reported-stories/e-reported-stories-gaurd-service';
import { StoryReportingGaurdService } from './modules/Reporting/story-reporting-gaurd-service';
import { StorySubeditingGaurdService } from './modules/sub-editing/story-subediting-gaurd-service';
import { StoryChiefSubeditingGaurdService } from './modules/sub-editing/story-chief-subediting-guard-service';
import {SidebarModule} from 'primeng/sidebar';
import {ConfirmationService} from 'primeng/api';
import { SbRejectedStoriesComponent } from './modules/sub-editing/sb-rejected-stories/sb-rejected-stories.component';
import { ChiefSubViewSubStoryRejectRequestComponent } from './modules/sub-editing/chief-sub-view-sub-story-reject-request/chief-sub-view-sub-story-reject-request.component';
import { EdViewStoryStatisticsComponent } from './modules/editorial-admin/ed-view-story-statistics/ed-view-story-statistics.component';
import { EditorialAdminGaurdService } from './modules/editorial-admin/editorial-admin-gaurd-service';
import { EdViewReportersStoriesComponent } from './modules/editorial-admin/ed-view-reporters-stories/ed-view-reporters-stories.component';
import { EdViewPaperStoriesComponent } from './modules/editorial-admin/ed-view-paper-stories/ed-view-paper-stories.component';
import { SystemAdminGaurdService } from './modules/User/system-admin-gaurd-service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CustomDialogComponent,
    AdminLayoutComponent,
  ],
  entryComponents: [CustomDialogComponent],
  imports: [
    ComponentsModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule, AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    SpinnerModule,
    CalendarModule,
    MatProgressSpinnerModule,
    BsModalModule,
    NgbModule,
    NgIdleKeepaliveModule.forRoot(),
    MegaMenuModule,
    TableModule,
    DialogModule,
    SidebarModule,
  ],
  providers: [CommonService, CookieService, DatePipe, LoaderService,
    RemoteHelper, EReportedStoriesGaurdService, StoryReportingGaurdService, 
    StorySubeditingGaurdService, ConfirmationService,
     StoryChiefSubeditingGaurdService, EditorialAdminGaurdService,SystemAdminGaurdService],
  bootstrap: [AppComponent],
})
export class AppModule { }
