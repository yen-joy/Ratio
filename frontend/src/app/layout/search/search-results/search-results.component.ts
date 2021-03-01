import { Component, OnInit } from '@angular/core';
import { SlideInOutAnimation } from 'src/app/_animations/animation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService, MediaService, UtilityService } from './../../../_services/index';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  animations: [SlideInOutAnimation]
})
export class SearchResultsComponent implements OnInit {

  // data
  f: FormGroup;
  mediaTypes: any;
  mediaTypesAvailable: any;
  currentUser = null;
  defaultUrlImage: any = UtilityService.DEFAULT_IMAGE;
  results: any;

  // filters
  filtersVisible = false;
  allMediaTypes = false;
  checkedMediaTypes: any;
  filteredResults: any;

  // download
  downloadMediaId: any;

  // preview
  previewImageUrl: any;

  constructor(
    private contentService: ContentService,
    private formBuilder: FormBuilder,
    private meadiaService: MediaService,
    private utilityService: UtilityService) {
    this.contentService.searchResult$.subscribe(val => {
      this.results = val;

      this.updateMediaTypesAvailable();
      this.updateCheckedMediaTypes();
    })
  }

  ngOnInit() {
    this.currentUser = this.utilityService.getCurrentUser();

    this.results = [];
    this.f = this.formBuilder.group({
      download: ['', [Validators.required]]
    });

    this.meadiaService.all().subscribe(
      (data) => {
        this.mediaTypes = data;

        this.updateMediaTypesAvailable();
        this.updateCheckedMediaTypes();
      });
  }

  updateMediaTypesAvailable() {
    this.mediaTypesAvailable = [];

    if (this.mediaTypes !== undefined && this.mediaTypes !== null) {
      this.mediaTypes.filter(mediatype => {
        var keepGoing = true;
        if (this.results !== undefined && this.results !== null) {
          this.results.filter(item => {
            item.mediatype.forEach(element => {
              if (mediatype.media_type_id ==
                element.media_type_id && keepGoing) {
                this.mediaTypesAvailable.push(mediatype);
                keepGoing = false;
              }
            });
          });
        }
      });
    }
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  updateCheckedMediaTypes() {
    if (this.mediaTypes !== undefined && this.mediaTypes !== null) {
      this.checkedMediaTypes = this.mediaTypes.filter(
        item => { return item.checked; });
    } else {
      this.checkedMediaTypes = [];
    }
    
    this.updateFilteredResults();
  }

  updateFilteredResults() {
    this.filteredResults = [];

    if (this.checkedMediaTypes.length > 0) {
      this.results.filter(item => {
        var keepGoing = true;
        item.mediatype.forEach(element => {
          this.checkedMediaTypes.forEach(mediatype => {
            if (mediatype.media_type_id == element.media_type_id
              && keepGoing) {
              this.filteredResults.push(item);
              keepGoing = false;
            }
          });
        });
      });
    } else {
      this.filteredResults = this.results;
    }
  }  

  removeFilter(filterItem) {
    this.mediaTypes.forEach(item => {
      if (item = filterItem) {
        item.checked = false;
      }
    });

    this.updateCheckedMediaTypes();
  }

  getMediaCount(mediaTypeAvailable) {
    var mediaCount = 0;

    if (this.results !== undefined && this.results !== null) {
      this.results.filter(item => {
        item.mediatype.forEach(element => {
          if (mediaTypeAvailable.media_type_id == element.media_type_id) {
            mediaCount++;
          }
        });
      });
    }

    return mediaCount;
  }

  allMediaTypesFilterOnChange() {
    this.mediaTypesAvailable.forEach(item => {
      item.checked = this.allMediaTypes;
    });

    this.updateCheckedMediaTypes();
  }

  mediaTypesFilterOnChange() {
    this.updateCheckedMediaTypes();
  }

  download(downloadMediaId: any) {
    this.downloadMediaId = downloadMediaId;
  }

  sort() {
    if (this.results !== undefined && this.results !== null) {
      this.results = this.results.reverse();

      this.updateCheckedMediaTypes();
    }
  }

  downloadFile(content_id) {
    this.f.reset();
    this.contentService.download(content_id);
  }

  addToMycollection(content_id) {
    this.contentService.addToMyCollection(content_id).subscribe();
  }

  preview(previewImageUrl) {
    this.previewImageUrl = previewImageUrl;
  }

}
