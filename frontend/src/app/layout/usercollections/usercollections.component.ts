import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService, UtilityService } from './../../_services/index';
import { Subscription } from 'rxjs';

declare var $
@Component({
  selector: 'app-usercollections',
  templateUrl: './usercollections.component.html',
  styleUrls: ['./usercollections.component.scss']
})
export class UsercollectionsComponent implements OnInit {
  medialist: any;
  fm: FormGroup;
  media_id: any;
  c_conent_id: any;
  subscription: Subscription;
  currentUser = null;
  defaultUrlImage: any = UtilityService.DEFAULT_IMAGE;

  constructor(
    private formBuilder: FormBuilder,
    private contentService: ContentService,
    private utilityService: UtilityService) {
    this.subscription = this.contentService.myCollectionSubject$.subscribe(
      val => {
        this.medialist = val;
        var result = [];
        this.medialist.forEach(element => {
          result.push(element.content_id)
        });

        this.media_id = result.join(',');
      })
    this.contentService.getMyCollection().subscribe(
      (data) => {
        var result = [];
        this.medialist = data;

        this.medialist.forEach(element => {
          result.push(element.content_id)
        });

        this.media_id = result.join(',');
      }
    );
  }

  ngOnInit() {
    this.currentUser = this.utilityService.getCurrentUser();

    this.fm = this.formBuilder.group({
      downloadMedia: [null, [Validators.required]]
    });
  }

  deleteMedia(c_content_id: any) {
    this.c_conent_id = c_content_id;
  }

  doDelete() {
    var result = [];
    this.medialist.forEach(element => {
      if (element.content_id != this.c_conent_id)
        result.push(element)

    });
    this.medialist = result;
    this.contentService.removeFromMyCollection(this.c_conent_id).subscribe();
  }

  filedownload() {
    $('#downloadModalMedia').modal('hide');
    this.fm.reset();
    this.contentService.download(this.media_id);
  }

}