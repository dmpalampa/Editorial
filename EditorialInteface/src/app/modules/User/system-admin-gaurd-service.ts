import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonComponent } from 'src/Services/CommonComponent';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ng2-cookies';
import { Injectable } from '@angular/core';
import { LoaderService } from 'src/Services/LoaderService';
import { CommonService } from 'src/Services/CommonService';
import { RemoteHelper } from 'src/Services/RemoteHelper';
import { ActivatedRoute, Router } from "@angular/router";

@Injectable()
export class SystemAdminGaurdService extends CommonComponent implements CanActivate {

    constructor(
        loaderService: LoaderService,
        private route: ActivatedRoute,
        public commonService: CommonService,
        parentRouter: Router,
        public remoteHelper: RemoteHelper,
        modalService: NgbModal,
        public cookieService: CookieService,

  ) {
    super(commonService, remoteHelper, loaderService, parentRouter, modalService,cookieService);
        super.ngOnInit();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const user = this.user;
        if (user.isAdmin) {
            return true;
        } else {
            this.parentRouter.navigate(['/not-found'])
            return false;
        }
    }


}