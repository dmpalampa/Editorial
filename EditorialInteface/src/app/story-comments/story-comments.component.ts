import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { RemoteHelper } from "../../Services/RemoteHelper";
import { CommonComponent } from '../../Services/CommonComponent';
import { LoaderService } from '../../Services/LoaderService';
import { CommonService, AppUser } from '../../Services/CommonService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-story-comments',
  templateUrl: './story-comments.component.html',
  styleUrls: ['./story-comments.component.css']
})
export class StoryCommentsComponent extends CommonComponent {

  commentForm: any;
  comments = [];
  storyId = null;
  story: any;
  storyReporters =[];

  constructor(
    private formBuilder: FormBuilder,
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

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });

    this.route.queryParams.subscribe(params => {
      this.storyId = params['story'];
      if (this.storyId != null) {
        this.getAllCommentsByStoryId(this.storyId);
      }
    });
  }


  onSubmit() {
    if (this.commentForm.invalid) {
      alert("We have dected errors! Please review the data you are submitting");
      return;
    }
    let storyOwners = false;

    for(let u of this.storyReporters){
      if(this.user.userId == u.userId){
        storyOwners = true;
      }
    }
 
    let form = this.commentForm.value;

    console.log(form);
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "saveComment",
      "requestData": {
        storyId: this.storyId,
        userName: this.user.username,
        userId: this.user.userId,
        comment: form.comment,
        storyOwner: storyOwners
      }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeServerProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
      }
    );
  }

  getAllCommentsByStoryId(storyId) {
    let controller = this;
    let postData = {
      "service": "ReportingRS",
      "requestType": "getAllCommentsByStoryId",
      "requestData": { storyId: storyId }
    }
    controller.sendRequestToServer(
      "user_service/AllService/",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.completeServerProcess(response);
      },
      function (err) {
        controller.showDialog({ title: 'Connection Error', message: 'failed to connect to server' + err.message })
      }
    );
  }

  completeServerProcess(response) {
    console.log('response from master\n\n ' + JSON.stringify(response));
    if (response.returnCode != 0) {
      let modalContent = {
        title: 'Error',
        message: response.returnMessage
      }
      this.showDialog(modalContent);
      return;
    }
    this.story= response.returnData;
    console.log(response.returnData);

    this.storyReporters = this.story.storyReporters;

    this.comments = this.story.comments
    console.log(this.comments);
  }
}
