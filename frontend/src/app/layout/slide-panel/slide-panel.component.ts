import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../_services/index';
import { Subscription } from 'rxjs';
declare var $
@Component({
  selector: 'app-slide-panel',
  templateUrl: './slide-panel.component.html',
  styleUrls: ['./slide-panel.component.scss']
})
export class SlidePanelComponent implements OnInit {
  isActive = false;
  subscription: Subscription;

  constructor(private contentService: ContentService) {
    this.subscription = this.contentService.searchResultPaneltoggle$
      .subscribe(val => {
        this.isActive = (val) ? true : false;
      })
  }

  ngOnInit() { }

  open() {
    this.isActive = true;
  }

  close() {
    this.isActive = false;
    $('#downloadModalMedia').modal('hide');
    $('#deleteModalMedia').modal('hide');
  }

}

