import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { ContentService, CategoryService, MediaService, UtilityService } from './../../_services/index';
import { Categories, User } from '../../_models'

@Component({
  selector: 'app-manage-media-categories',
  templateUrl: './manage-media-categories.component.html',
  styleUrls: ['./manage-media-categories.component.scss']
})
export class ManageMediaCategoriesComponent implements OnInit, OnChanges {

  @Input() category: Categories;
  parentId;

  currentUser: User = null;

  f: FormGroup;
  brands: any;
  public categories = [];
  public categoryInfo: Categories;
  childcat: any = [];
  imageFile: File = null;
  public urlImage: any = UtilityService.DEFAULT_IMAGE;

  public isEditing = false;

  constructor(
    private contentservice: ContentService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private utilityService: UtilityService) {
  }

  ngOnInit() {
    this.f = this.formBuilder.group({
      category_id: [null],
      category_name: [null, [Validators.required]],
      parent_id: [0],
      brand: [null, [Validators.required]],
      th_mime_type: [null,],
      th_name: [null,],
      th_size: [null,],
      imageFile: [null,],
    });

    this.currentUser = this.utilityService.getCurrentUser();
    this.brands = this.categoryService.getBrands(this.currentUser);
  }

  loadCategories(brandId: any) {
    this.contentservice.category(brandId).subscribe(
      (data) => {
        this.categories = data;
      }
    );
  }

  changeListener($event): void {
    if ($event.target.files && $event.target.files[0]) {
      let image = $event.target.files[0];

      // validate file size
      if (image.size > MediaService.MAX_IMAGE_FILE_SIZE) {
        this.f.controls['imageFile'].setValue(null);
        this.f.controls['imageFile'].setErrors(
          { 'invalid': true });
        this.imageFile = null;

        return;
      }

      this.setImage(image);
    }
  }

  onSelectedChange(items: any) {
    this.parentId = items;
  }

  brandChange(brandId) {
    this.loadCategories(brandId);
  }

  ngOnChanges(changes: SimpleChanges) {
    // reset file size validation
    if (this.f && this.f.controls['imageFile']) {
      this.f.controls['imageFile'].setValue(null);
      this.f.controls['imageFile'].setErrors(null);
      this.imageFile = null;
    }

    if (this.category !== undefined && this.category !== null) {
      this.isEditing = true;

      this.categoryInfo = this.category;
      this.categoryService.getChild(this.categoryInfo.category_id)
        .subscribe((data) => { this.childcat = data; });
      this.loadCategories(this.categoryInfo.brand);

      if (this.categoryInfo.imageUrl !== null) {
        this.urlImage = this.utilityService.getAuthorizedUrl(
          this.categoryInfo.imageUrl);
      } else {
        this.urlImage = UtilityService.DEFAULT_IMAGE;
      }
    } else {
      this.isEditing = false;

      this.categoryInfo = new Categories;
      this.categoryInfo.brand = 1;
      this.loadCategories(this.categoryInfo.brand);

      this.urlImage = UtilityService.DEFAULT_IMAGE;
    }
  }

  setImage(image) {
    if (image === null) {
      return;
    }

    this.imageFile = image;

    let reader = new FileReader();
    reader.onloadend = (e) => {
      this.urlImage = reader.result;
    }
    reader.readAsDataURL(this.imageFile);
  }

  submit() {
    let toastMessage = 'Please wait';
    if (this.imageFile != null) {
      toastMessage = 'Please wait for the upload to complete';
    }

    const toast = this.toastr.warning(toastMessage, 'Saving category', {
      disableTimeOut: true,
      tapToDismiss: false
    });

    this.spinner.show();

    this.categoryService.save(this.categoryInfo, this.parentId, 
      this.imageFile).pipe(finalize(() => {
        this.spinner.hide();
        this.toastr.remove(toast.toastId);
      }))
      .subscribe(
        (data) => {          
          this.toastr.success('Category saved', 'Completed');
        }
      );
  }

}
