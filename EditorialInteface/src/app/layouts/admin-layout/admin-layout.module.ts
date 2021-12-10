import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatExpansionModule,
} from '@angular/material';
import {IconsComponent} from "../../modules/icons/icons.component";
import { MatRadioModule } from '@angular/material/radio';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryCategoryComponent } from "../../story-category/story-category.component";
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {PasswordModule} from 'primeng/password';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {TabViewModule} from 'primeng/tabview';
import {ContextMenuModule} from 'primeng/contextmenu';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenuModule} from 'primeng/menu';
import {InputSwitchModule} from 'primeng/inputswitch';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {FileUploadModule} from 'primeng/fileupload';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { UserProfileComponent } from 'src/app/modules/User/user-profile/user-profile.component';
import { ManageUsersComponent } from 'src/app/modules/User/manage-users/manage-users.component';
import { ReportingStoriesComponent } from 'src/app/modules/Reporting/reporting-stories/reporting-stories.component';
import { ManageUserRolesComponent } from 'src/app/modules/User/manage-user-roles/manage-user-roles.component';
import { RReportedStoryComponent } from 'src/app/modules/Reporting/r-reported-story/r-reported-story.component';
import { StoryCommentsComponent } from 'src/app/story-comments/story-comments.component';
import { EEditedStoriesComponent } from 'src/app/modules/Editing/e-edited-stories/e-edited-stories.component';
import { EReportedStoriesComponent } from 'src/app/modules/Editing/e-reported-stories/e-reported-stories.component';
import { EStoryEditingComponent } from 'src/app/modules/Editing/e-story-editing/e-story-editing.component';
import { ChiefSubViewStoriesComponent } from 'src/app/modules/sub-editing/chief-sub-view-stories/chief-sub-view-stories.component';
import {CalendarModule} from 'primeng/calendar';
import { SbViewAssignedStoriesComponent } from 'src/app/modules/sub-editing/sb-view-assigned-stories/sb-view-assigned-stories.component';
import { UserDeniedAccessComponent } from 'src/app/modules/user-denied-access/user-denied-access.component';
import { ChiefSubViewAssignedStoriesComponent } from 'src/app/modules/sub-editing/chief-sub-view-assigned-stories/chief-sub-view-assigned-stories.component';
import {TreeModule} from 'primeng/tree';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {InputTextModule} from 'primeng/inputtext';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {AccordionModule} from 'primeng/accordion';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {CardModule} from 'primeng/card';
import {RadioButtonModule} from 'primeng/radiobutton';
import { ERejectedStoriesComponent } from 'src/app/modules/Editing/e-rejected-stories/e-rejected-stories.component';
import { ChartModule } from 'primeng/components/chart/chart';
import { SbRejectedStoriesComponent } from 'src/app/modules/sub-editing/sb-rejected-stories/sb-rejected-stories.component';
import { ChiefSubViewSubStoryRejectRequestComponent } from 'src/app/modules/sub-editing/chief-sub-view-sub-story-reject-request/chief-sub-view-sub-story-reject-request.component';
import { EdViewStoryStatisticsComponent } from 'src/app/modules/editorial-admin/ed-view-story-statistics/ed-view-story-statistics.component';
import { EdViewReportersStoriesComponent } from 'src/app/modules/editorial-admin/ed-view-reporters-stories/ed-view-reporters-stories.component';
import { EdViewPaperStoriesComponent } from 'src/app/modules/editorial-admin/ed-view-paper-stories/ed-view-paper-stories.component';
import { SbFinishedPagesComponent } from 'src/app/modules/sub-editing/sb-finished-pages/sb-finished-pages.component';
import { ChiefSubViewFinishedPagesComponent } from 'src/app/modules/sub-editing/chief-sub-view-finished-pages/chief-sub-view-finished-pages.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatExpansionModule,
    MatRadioModule,
    RichTextEditorAllModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    PasswordModule,
    DialogModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    ContextMenuModule,
    MenuModule,
    SplitButtonModule,
    InputSwitchModule,
    OverlayPanelModule,
    FileUploadModule,
    AutoCompleteModule,
    InputTextareaModule,
    TabViewModule,
    CalendarModule,
    TreeModule,
    ScrollPanelModule,
    InputTextModule,
    ConfirmDialogModule,
    AccordionModule,
    ToggleButtonModule,
    CardModule,
    RadioButtonModule,
    ChartModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    IconsComponent,
    ManageUsersComponent,
    ReportingStoriesComponent,
    ManageUserRolesComponent,
    StoryCategoryComponent,
    RReportedStoryComponent,
    EReportedStoriesComponent,
    StoryCommentsComponent,
    EEditedStoriesComponent,
    EStoryEditingComponent,
    ChiefSubViewStoriesComponent,
    SbViewAssignedStoriesComponent,
    UserDeniedAccessComponent,
    ChiefSubViewAssignedStoriesComponent,
    ERejectedStoriesComponent,
    SbRejectedStoriesComponent,
    ChiefSubViewSubStoryRejectRequestComponent,
    EdViewStoryStatisticsComponent,
    EdViewReportersStoriesComponent,
    EdViewPaperStoriesComponent,
    SbFinishedPagesComponent,
    ChiefSubViewFinishedPagesComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AdminLayoutModule {}
