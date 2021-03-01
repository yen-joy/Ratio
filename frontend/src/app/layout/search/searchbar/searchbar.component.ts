import { Component, OnInit } from '@angular/core';
import { ContentService, MediaService } from '../../../_services/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-searchbar',
    templateUrl: './searchbar.component.html',
    styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {

    f: FormGroup;
    searchText: string;    
    mediaTypes: any;
    selectedMediaType: string;    
    dropdownSettings;        

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private mediaService: MediaService,
        private contentService: ContentService) {
    }

    ngOnInit() {
        this.mediaTypes = [];

        this.f = this.formBuilder.group({
            searchText: [null, [
                Validators.required, 
                Validators.minLength(3)]],
            mediaType: [null, [Validators.required]]
        });

        this.dropdownSettings = {
            singleSelection: false,
            idField: 'media_type_id',
            textField: 'media_type_name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };

        this.mediaService.all().subscribe(
            (data) => {
                this.mediaTypes = data;
            });
    }

    search() {
        this.router.navigate(['/searchresults']);

        this.selectedMediaType = this.f.value.mediaType.map(i => 
            i.media_type_id).join(',');
        if (this.selectedMediaType.length > 0) {
            this.contentService.search(this.selectedMediaType, this.searchText)
                .subscribe();
        }
    }
}
