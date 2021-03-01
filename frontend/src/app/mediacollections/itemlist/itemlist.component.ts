import { Component, OnInit } from '@angular/core';
import { SlideInOutAnimation } from 'src/app/_animations/animation';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaService } from '../../_services';
import { CategoryService } from '../../_services';
import { ContentService } from '../../_services';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilityService } from '../../_services/utility.service';

declare var $

@Component({
  selector: 'app-itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.scss'],
  animations: [SlideInOutAnimation]
})
export class ItemlistComponent implements OnInit {
  filtersVisible = false;
  category: any;
  category_ids: string;
  medialist: any;
  MediaType: any;
  mediaprivatelist: any;
  parentcategory: any = null;
  parent: any;
  title: any = '';
  allfill = false;
  c_dow: any;
  c_dow_img: any;
  f: FormGroup;
  defaultUrlImage: any = UtilityService.DEFAULT_IMAGE;
  currentUser = null;

  constructor(
    private formBuilder: FormBuilder,
    private meadiaService: MediaService,
    private contentService: ContentService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private utilityService: UtilityService) {
  }

  ngOnInit() {
    this.currentUser = this.utilityService.getCurrentUser();

    this.spinner.show();
    
    this.f = this.formBuilder.group({
      download: ['', [Validators.required]]
    });

    //getMediaType
    this.meadiaService.all().subscribe(
      (data) => {
        this.MediaType = data;

        this.route.params.subscribe(params => {          
          if (params.category) {            
            this.categoryService.details(params.category).subscribe(
              (data) => {
                this.category = data.category;
                this.parentcategory = data.parentcategory;
                this.parent = data.parent;
                this.medialist = data.medialist;
                this.spinner.hide();
              }
            );
          } else {
            this.title = 'Shared with me';
            this.contentService.getMyCollection().subscribe(
              (data) => {
                this.mediaprivatelist = data;
                this.spinner.hide();
              });
          }
        });
      });
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  checked() {
    return this.MediaType.filter(item => { return item.checked; });
  }

  removefilter(filterItem) {
    return this.MediaType.forEach(item => {
      if (item = filterItem) {
        item.checked = false;
      }
    });
  }

  mediaresult(medialist) {
    if (this.checked().length > 0) {
      let val = [];
      medialist.filter(item => {
        var keepGoing = true;
        item.content.mediatype.forEach(element => {
          this.checked().forEach(mediatype => {
            if (mediatype.media_type_id == element.media_type_id && keepGoing) {
              val.push(item);
              keepGoing = false;
            }
          });
        });
      });
      return val;
    } else {
      return medialist;
    }
  }

  mediacount(mediatype) {
    var val = 0;

    if (this.medialist) {
      this.medialist.filter(item => {
        item.content.mediatype.forEach(element => {
          if (mediatype.media_type_id == element.media_type_id) {
            val++;
          }
        });
      });
    } else if (this.mediaprivatelist) {
      this.mediaprivatelist.filter(item => {
        item.content.mediatype.forEach(element => {
          if (mediatype.media_type_id == element.media_type_id) {
            val++;
          }
        });
      });

    }

    return val;
  }

  allFilters() {
    return this.MediaTypeAvilable().forEach(item => {
      item.checked = this.allfill;

    });
  }

  MediaTypeAvilable() {
    let val = [];

    if (this.MediaType === undefined || this.MediaType === null) {
      return val;
    }

    this.MediaType.filter(mediatype => {
      var keepGoing = true;
      if (this.medialist) {
        this.medialist.filter(item => {
          item.content.mediatype.forEach(element => {
            if (mediatype.media_type_id == element.media_type_id && keepGoing) {
              val.push(mediatype);
              keepGoing = false;
            }
          });
        });
      } else if (this.mediaprivatelist) {
        this.mediaprivatelist.filter(item => {
          item.content.mediatype.forEach(element => {
            if (mediatype.media_type_id == element.media_type_id && keepGoing) {
              val.push(mediatype);
              keepGoing = false;
            }
          });
        });
      }
    });

    return val;
  }

  download(c_dow: any) {
    this.c_dow = c_dow;
  }

  sort() {
    if (this.medialist) {
      this.medialist = this.medialist.reverse();
    }
    if (this.mediaprivatelist) {
      this.mediaprivatelist = this.mediaprivatelist.reverse();
    }
  }

  filedownload(content_id) {
    $('#downloadModal').modal('hide');
    this.f.reset();
    this.contentService.download(content_id);

    return false;
  }

  addtoCollection(content_id) {
    this.contentService.addToMyCollection(content_id).subscribe();
  }

  preview(c_dow_img) {
    this.c_dow_img = c_dow_img;
  }

}
