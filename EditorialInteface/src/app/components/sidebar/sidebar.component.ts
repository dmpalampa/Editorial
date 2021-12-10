import { Component, OnInit } from '@angular/core';
import { CommonComponent } from "../../../Services/CommonComponent";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppUser, CommonService } from "../../../Services/CommonService";
import { RemoteHelper } from "../../../Services/RemoteHelper";
import { LoaderService } from "../../../Services/LoaderService";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CookieService } from 'ng2-cookies';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  children?: RouteInfo[];
}
export const ADMIN_ROUTES: RouteInfo[] = [

  {
    path: '#', title: 'Admin', icon: 'user', class: '',
    children: [
      { path: '/users', title: 'Users', icon: 'users', class: '' },
      { path: '/user-roles', title: 'User Roles', icon: 'cog', class: '' },
      { path: '/story-category', title: 'Story Categories', icon: 'list', class: '' },
    ]
  },
];

export const REPORTER_ROUTES: RouteInfo[] = [
  {
    path: '#', title: 'Reporter', icon: 'user', class: '',
    children: [
      { path: '/r-reported-stories', title: 'My Stories', icon: 'file', class: '' },
      { path: '/report-stories', title: 'New Story', icon: 'plus', class: '' },
    ]
  },
];

export const EDITOR_ROUTES: RouteInfo[] = [
  {
    path: '#', title: 'Editor', icon: 'user', class: '',
    children: [
      { path: '/e-reported-stories', title: 'Current Stories', icon: 'bars', class: '' },
      { path: '/e-edited-stories', title: 'My Edited Stories', icon: 'check', class: '' },
      { path: '/e-rejected-stories', title: 'Rejected Stories', icon: 'times', class: '' },
    ]
  },
  // { path: '/e-story-editing/:story', title: 'Edit Stories',  icon:'', class: ''},
  // { path: '/comments', title: 'comments',  icon:'', class: ''},
  //{ path: '/comments/:story', title: 'story-comments',  icon:'', class: ''},
];

export const CHIEF_SUB_EDITOR_ROUTES: RouteInfo[] = [
  {
    path: '#', title: 'Chief Sub Editor', icon: 'user', class: '',
    children: [
      { path: '/c-story-editing', title: 'Current Work', icon: 'bars', class: '' },
      { path: '/c-view-assignemts', title: 'Assigned Work', icon: 'send', class: '' },
      { path: '/c-rejected-stories', title: 'Stories I Rejected', icon: 'times', class: '' },
      { path: '/c-view-sb-story-reject-request', title: 'Sub Reject Requests', icon: 'spinner', class: '' },
    ]
  },
];

export const EDITORIAL_ADMIN_ROUTES: RouteInfo[] = [
  {
    path: '#', title: 'Editorial Admin', icon: 'user', class: '',
    children: [
      { path: '/e-admin-view_stories_statistics', title: 'Reporting Statics', icon: 'pie-chart', class: '' },
      { path: '/e-admin-view_reporter-stories', title: 'Reporter Stories', icon: 'hdd-o', class: '' },
      { path: '/e-admin-view_paper-stories', title: 'News Paper', icon: 'newspaper-o', class: '' },
    ]
  },
];

export const SUB_EDITOR_ROUTES: RouteInfo[] = [
  {
    path: '#', title: 'Sub Editor', icon: 'user', class: '',
    children: [
      { path: '/sb-view_stories', title: 'Assignments', icon: '', class: '' },
      { path: '/sb-finished-pages', title: 'Submissions', icon: '', class: '' },
    ]
  },

];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent extends CommonComponent {
  menuItems: any[];
  user: AppUser;

  events: string[] = [];
  opened: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public commonService: CommonService,
    public remoteHelper: RemoteHelper,
    public loaderService: LoaderService,
    protected parentRouter: Router,
    public modalService: NgbModal,
    public cookieService: CookieService,

  ) {
    super(commonService, remoteHelper, loaderService, parentRouter, modalService, cookieService);
    super.ngOnInit();

  }

  ngOnInit() {

    if (this.user.isReporter == true) {
      this.menuItems = REPORTER_ROUTES.filter(menuItem => menuItem);
    }
    if (this.user.isEditor == true) {
      this.menuItems = EDITOR_ROUTES.filter(menuItem => menuItem);
    }
    if (this.user.isSubEditor) {
      this.menuItems = SUB_EDITOR_ROUTES.filter(menuItem => menuItem);
    }
    if (this.user.isChiefSubEditor) {
      this.menuItems = CHIEF_SUB_EDITOR_ROUTES.filter(menuItem => menuItem);
    }
    if (this.user.isAdmin) {
      this.menuItems = ADMIN_ROUTES.filter(menuItem => menuItem);
    }
    if (this.user.isEditorialAdmin) {
      this.menuItems = EDITORIAL_ADMIN_ROUTES.filter(menuItem => menuItem);
    }
  }


  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  logout() {
    this.commonService.appComponent.logout();
  }
}
