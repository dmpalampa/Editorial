import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonComponent } from '../Services/CommonComponent';
import { CommonService } from '../Services/CommonService';
import { RemoteHelper } from '../Services/RemoteHelper';
import { LoaderService } from '../Services/LoaderService';
import { windowTime } from 'rxjs/operators';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends CommonComponent {

  protected idleState = 'Not started.';
  protected timedOut = false;
  protected lastPing?: Date = null;
  // protected items: MenuItem[];
  currentPathList: any = []
  menuItems: MenuItem[];

  constructor(public commonService: CommonService,
    public remoteHelper: RemoteHelper,
    public loaderService: LoaderService,
    protected parentRouter: Router,
    public modalService: NgbModal,
    protected idle: Idle, protected keepalive: Keepalive,
    public cookieService: CookieService,
  ) {
    super(commonService, remoteHelper, loaderService, parentRouter, modalService, cookieService);

    this.currentPathList.push({ pathText: 'Item 1' }, { pathText: 'Item 2' })
  }

  public setupIdleStateDetection(duration: number, ontimeout: any) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    this.idle.setIdle(duration);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(duration);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log('Timed out')
      ontimeout()
    });
    this.idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    this.idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);
    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.resetIdleStateDetection();
  }


  public resetIdleStateDetection() {
    console.log('Started idle state detection')
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }


  ngOnInit() {
    super.ngOnInit();
    this.title = 'Daily Monitor'
    let context = this;

    // window.addEventListener("beforeunload", function (e) {

    // context.serverLogout(); 

    //   });

    //Set the myself to the helper service
    // this.customConfirmationModal.appComponent = this;
    // this.customMessageModal.appComponent = this;
    // this.customPromptModal.appComponent = this;

    //Set the app component to the common service so that it can be shared
    this.commonService.appComponent = this;
    //this.prepareMenuItems()
    // this.setupMenus();


    //Set path list
    if (this.commonService.appComponent) {
      this.commonService.appComponent.currentPathList = [
        { 'pathText': this.title }
      ]
    }
  }


  public logout() {
    if (confirm("Sure you want leave E-Editorial??")) {
      this.serverLogout();
    }
  }


  public serverLogout() {
    this.showLoading();
    if (this.user.userData) {
      this.onSubmit();
    }
    this.commonService.removeAll();
    this.commonService.setLoginStatus(false);
    this.hideLoading();

  }

  onSubmit() {
    let requestData = {
      username: this.user.username,
      userId: this.user.userData.userId,
      authToken: this.user.authenticationToken
    }

    let postData = {
      "service": "AuthenticationRS",
      "requestType": "logOutSessions",
      "requestData": requestData
    }

    let controller = this;
    this.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeLogOutProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })//Error handler
      }
    );
  }


  completeLogOutProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
  }


}
