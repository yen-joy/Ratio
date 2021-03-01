import { Component, OnInit, ViewChild } from '@angular/core';
import { SlidePanelComponent } from '../../../layout/slide-panel/slide-panel.component';
import { CategoryService, UtilityService } from '../../../_services';
import { Categories } from '../../../_models';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  @ViewChild('mngcategoyPanel') mngcategoyPanel: SlidePanelComponent;  

  brands = [];
  categories = {};  

  // edit
  isActive = false;  
  subscription: Subscription;
  public editCategory: Categories;  
  categoryIds = [];

  constructor(
    private categoryService: CategoryService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private utilityService: UtilityService) {

    this.subscription = categoryService.paneltoggle$.subscribe(val => {
      this.isActive = (val) ? true : false;
      if (this.isActive) {
        this.mngcategoyPanel.open();
      } else {
        this.mngcategoyPanel.close();
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.spinner.show();

    this.categories = {};
    
    this.brands = this.categoryService.getBrands(
      this.utilityService.getCurrentUser());

    let brandsLoaded = 0;
    let brandToLoad = this.brands.length;
    this.brands.forEach((brand, index) => {
      this.categoryService.getBybrand(brand.id).subscribe(
        (data) => {
          this.categories[brand.id] = data.category;

          $('#treeview' + index).hummingbird();

          brandsLoaded++;
          if (brandToLoad === brandsLoaded) {
            this.spinner.hide();
          }          
        }
      );
    });   
  }
    
  checked(id: number, isChecked: boolean) {
    this.categoryIds = [];
    this.categoryIds.push(id);
  }

  delete() {
    this.categoryService.deleteCategory(this.categoryIds).subscribe(
      (data) => {
        this.toastr.success('Category deleted', 'Completed');
        this.loadCategories();        
      });
  }  

  create() {
    this.editCategory = null;

    this.mngcategoyPanel.open();
  }

  edit(category: Categories) {
    this.editCategory = category;

    this.mngcategoyPanel.open();
  }

}
