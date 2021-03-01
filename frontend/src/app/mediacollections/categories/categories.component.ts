import { Component,  OnInit, SimpleChanges } from '@angular/core';
import { SlideInOutAnimation } from 'src/app/_animations/animation';
import { ActivatedRoute } from '@angular/router';
import { CategoryService, UtilityService } from './../../_services/index';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  animations: [SlideInOutAnimation]
})
export class CategoriesComponent implements OnInit {
  filtersVisible = false;
  categories: any;
  brand_id: number;
  medialist: any;
  c_dow: any;
  currentUser = null;
  defaultUrlImage: any = UtilityService.DEFAULT_IMAGE;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private utilityService: UtilityService) {
  }

  ngOnInit() {
    this.currentUser = this.utilityService.getCurrentUser();

    this.spinner.show();

    this.route.params.subscribe(params => {
      this.brand_id = this.categoryService.getBrandByNavigationId(
        params.brand, this.currentUser);

      this.categoryService.getBybrand(this.brand_id).subscribe(
        (data) => {
          this.categories = data.category;

          for(var category of this.categories) {
            if (category.imageUrl !== null) {
              category.imageUrl = 
                this.utilityService.getAuthorizedUrl(category.imageUrl);
            }
          }

          this.spinner.hide();
          this.medialist = data.medialist;
        }
      );
    });
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  download(c_dow: any) {
    this.c_dow = c_dow;
  }

  preview(c_dow) {
    this.c_dow = c_dow;
  }

}