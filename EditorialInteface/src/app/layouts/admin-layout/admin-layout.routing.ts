import { Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { UserProfileComponent } from 'src/app/modules/User/user-profile/user-profile.component';
import { IconsComponent } from 'src/app/modules/icons/icons.component';
import { ManageUsersComponent } from 'src/app/modules/User/manage-users/manage-users.component';
import { ReportingStoriesComponent } from 'src/app/modules/Reporting/reporting-stories/reporting-stories.component';
import { ManageUserRolesComponent } from 'src/app/modules/User/manage-user-roles/manage-user-roles.component';
import { RReportedStoryComponent } from 'src/app/modules/Reporting/r-reported-story/r-reported-story.component';
import { StoryCategoryComponent } from 'src/app/story-category/story-category.component';
import { StoryCommentsComponent } from 'src/app/story-comments/story-comments.component';
import { EReportedStoriesComponent } from 'src/app/modules/Editing/e-reported-stories/e-reported-stories.component';
import { EEditedStoriesComponent } from 'src/app/modules/Editing/e-edited-stories/e-edited-stories.component';
import { EStoryEditingComponent } from 'src/app/modules/Editing/e-story-editing/e-story-editing.component';
import { ChiefSubViewStoriesComponent } from 'src/app/modules/sub-editing/chief-sub-view-stories/chief-sub-view-stories.component';
import { SbViewAssignedStoriesComponent } from 'src/app/modules/sub-editing/sb-view-assigned-stories/sb-view-assigned-stories.component';
import { EReportedStoriesGaurdService } from 'src/app/modules/Editing/e-reported-stories/e-reported-stories-gaurd-service';
import { UserDeniedAccessComponent } from 'src/app/modules/user-denied-access/user-denied-access.component';
import { ChiefSubViewAssignedStoriesComponent } from 'src/app/modules/sub-editing/chief-sub-view-assigned-stories/chief-sub-view-assigned-stories.component';
import { StoryReportingGaurdService } from 'src/app/modules/Reporting/story-reporting-gaurd-service';
import { StorySubeditingGaurdService } from 'src/app/modules/sub-editing/story-subediting-gaurd-service';
import { StoryChiefSubeditingGaurdService } from 'src/app/modules/sub-editing/story-chief-subediting-guard-service';
import { ERejectedStoriesComponent } from 'src/app/modules/Editing/e-rejected-stories/e-rejected-stories.component';
import { SbRejectedStoriesComponent } from 'src/app/modules/sub-editing/sb-rejected-stories/sb-rejected-stories.component';
import { ChiefSubViewSubStoryRejectRequestComponent } from 'src/app/modules/sub-editing/chief-sub-view-sub-story-reject-request/chief-sub-view-sub-story-reject-request.component';
import { EdViewStoryStatisticsComponent } from 'src/app/modules/editorial-admin/ed-view-story-statistics/ed-view-story-statistics.component';
import { EditorialAdminGaurdService } from 'src/app/modules/editorial-admin/editorial-admin-gaurd-service';
import { EdViewPaperStoriesComponent } from 'src/app/modules/editorial-admin/ed-view-paper-stories/ed-view-paper-stories.component';
import { EdViewReportersStoriesComponent } from 'src/app/modules/editorial-admin/ed-view-reporters-stories/ed-view-reporters-stories.component';
import { SystemAdminGaurdService } from 'src/app/modules/User/system-admin-gaurd-service';
import { SbFinishedPagesComponent } from 'src/app/modules/sub-editing/sb-finished-pages/sb-finished-pages.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'icons', component: IconsComponent },

    //system admin routes
    {
        path: 'users', component: ManageUsersComponent,
        canActivate: [SystemAdminGaurdService]
    },
    {
        path: 'story-category', component: StoryCategoryComponent,
        canActivate: [SystemAdminGaurdService]
    },
    {
        path: 'user-roles', component: ManageUserRolesComponent,
        canActivate: [SystemAdminGaurdService]
    },

    //repoter routes
    
    {
        path: 'report-stories', component: ReportingStoriesComponent,
        canActivate: [StoryReportingGaurdService]
    },
    {
        path: 'report-stories/:story', component: ReportingStoriesComponent,
        canActivate: [StoryReportingGaurdService]
    },

    {
        path: 'r-reported-stories', component: RReportedStoryComponent,
        canActivate: [StoryReportingGaurdService]
    },
    {
        path: 'r-reported-stories/:story', component: RReportedStoryComponent,
        canActivate: [StoryReportingGaurdService]
    },

    //editor routes
    {
        path: 'e-reported-stories', component: EReportedStoriesComponent,
        canActivate: [EReportedStoriesGaurdService]
    },
    {
        path: 'e-edited-stories', component: EEditedStoriesComponent,
        canActivate: [EReportedStoriesGaurdService]
    },
    {
        path: 'e-story-editing', component: EStoryEditingComponent,
        canActivate: [EReportedStoriesGaurdService]
    },
    {
        path: 'e-story-editing/:story', component: EStoryEditingComponent,
        canActivate: [EReportedStoriesGaurdService]
    },
    {
        path: 'e-rejected-stories', component: ERejectedStoriesComponent,
        canActivate: [EReportedStoriesGaurdService]
    },
    {
        path: 'e-rejected-stories/:date', component: ReportingStoriesComponent,
        canActivate: [StoryReportingGaurdService]
    },

    //chief subeditor routes
    {
        path: 'c-story-editing', component: ChiefSubViewStoriesComponent,
        canActivate: [StoryChiefSubeditingGaurdService]
    },
    {
        path: 'c-story-editing/:subEditor', component: ChiefSubViewStoriesComponent,
        canActivate: [StoryChiefSubeditingGaurdService]
    },
    {
        path: 'c-view-assignemts', component: ChiefSubViewAssignedStoriesComponent,
        canActivate: [StoryChiefSubeditingGaurdService]
    },
    {
        path: 'c-rejected-stories', component: SbRejectedStoriesComponent,
        canActivate: [StoryChiefSubeditingGaurdService]
    },
    {
        path: 'c-view-sb-story-reject-request', component: ChiefSubViewSubStoryRejectRequestComponent,
        canActivate: [StoryChiefSubeditingGaurdService]
    },

    // subeditor routes
    {
        path: 'sb-view_stories', component: SbViewAssignedStoriesComponent,
        canActivate: [StorySubeditingGaurdService]
    },
    {
        path: 'sb-finished-pages', component: SbFinishedPagesComponent,
        canActivate: [StorySubeditingGaurdService]
    },
    { path: 'not-found', component: UserDeniedAccessComponent },

    //Editorial Admin
    {
        path: 'e-admin-view_stories_statistics', component: EdViewStoryStatisticsComponent,
        canActivate: [EditorialAdminGaurdService]
    },
    {
        path: 'e-admin-view_reporter-stories', component: EdViewReportersStoriesComponent,
        canActivate: [EditorialAdminGaurdService]
    },

    {
        path: 'e-admin-view_paper-stories', component: EdViewPaperStoriesComponent,
        canActivate: [EditorialAdminGaurdService]
    },


];
