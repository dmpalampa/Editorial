import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonComponent } from "../../../Services/CommonComponent";
import { ADMIN_ROUTES, CHIEF_SUB_EDITOR_ROUTES, SUB_EDITOR_ROUTES, EDITOR_ROUTES, REPORTER_ROUTES, EDITORIAL_ADMIN_ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { AppUser, CommonService } from "../../../Services/CommonService";
import { RemoteHelper } from "../../../Services/RemoteHelper";
import { LoaderService } from "../../../Services/LoaderService";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder } from "@angular/forms";
import { CookieService } from 'ng2-cookies';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent extends CommonComponent {
    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    user: AppUser;
    private toggleButton: any;
    private sidebarVisible: boolean;
    reporterListTitles: any[];
    subEditorsListTitles: any[];
    cSubEditorListTitles: any[];
    adminsListTitles: any[];
    editorsListTitles: any[];
    editorialAdminListTitles: any[];
    hovered: boolean = false;
    displayAttachFellowUserDialog: boolean = false;
    displayChangePassword: boolean = false;

    constructor(location: Location,
        private element: ElementRef,
        private router: Router,
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

        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.reporterListTitles = REPORTER_ROUTES.filter(listTitle => listTitle);

        this.subEditorsListTitles = SUB_EDITOR_ROUTES.filter(listTitle => listTitle);

        this.adminsListTitles = ADMIN_ROUTES.filter(listTitle => listTitle);

        this.editorsListTitles = EDITOR_ROUTES.filter(listTitle => listTitle);

        this.cSubEditorListTitles = CHIEF_SUB_EDITOR_ROUTES.filter(listTitle => listTitle);

        this.editorialAdminListTitles = EDITORIAL_ADMIN_ROUTES.filter(listTitle => listTitle);


        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
    }

    onChangePassWordClicked(){
        this.displayChangePassword = true;
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {

        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        titlee = titlee.split('/').pop();

        if (this.user.isReporter) {
            this.listTitles = this.reporterListTitles[0].children;
        }
        if (this.user.isSubEditor) {
            this.listTitles = this.subEditorsListTitles[0].children;
        }
        if (this.user.isEditor) {
            this.listTitles = this.editorsListTitles[0].children;
        }
        if (this.user.isChiefSubEditor) {
            this.listTitles = this.cSubEditorListTitles[0].children;
        }
        if (this.user.isAdmin) {
            this.listTitles = this.adminsListTitles[0].children;
        }

        if (this.listTitles == undefined) {
            return 'Dashboard';
        }
        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path.split('/').pop() === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }
}
