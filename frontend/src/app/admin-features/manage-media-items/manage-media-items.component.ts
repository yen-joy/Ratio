import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, of, concat } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators'
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MediaService, ContentService, CategoryService, UtilityService, UserService } from '../../_services';

declare var $: any;

@Component({
  selector: 'app-manage-media-items',
  templateUrl: './manage-media-items.component.html',
  styleUrls: ['./manage-media-items.component.scss']
})
export class ManageMediaItemsComponent implements OnInit {
  // data
  brands = [];
  categories = {};
  mediaTypes = [];
  imageFile: File = null;
  mediaFile: File = null;
  urlImage: any = UtilityService.DEFAULT_IMAGE;
  mediaFileName: string = 'Media Upload';
  isUpdate = false;
  contentId: number = null;

  // users filter
  userFilterList: Observable<any[]>;
  userFilterLoading = false;
  userFilterInput = new Subject<string>();
  userFilterSelected = <any>[];
  user_ids: Array<number> = [];

  // form
  contentForm: FormGroup;
  dropdownSettings;
  mediaTypeControlValue: any = [];
  selectedCategories: any = [];
  availabilityDateControlValue: any = null;
  expirationDateControlValue: any = null;
  contentNameControlValue: string = '';
  notesControlValue: string = '';
  copyrightControlValue: boolean = false;
  privateContentControlValue: string = '0';

  constructor(private contentservice: ContentService,
    private mediaService: MediaService,
    private categoryService: CategoryService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private utilityService: UtilityService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.createForm();
    this.loadCategories();
    this.loadMediaTypes();

    this.userFilterList = concat(
      of([]),
      this.userFilterInput.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.userFilterLoading = true),
        switchMap(filterValue => this.userFilterLoad(filterValue).pipe(
          catchError(() => of([])),
          tap(() => this.userFilterLoading = false)
        ))
      )
    );

    this.loadContent();
  }

  createForm() {
    this.contentForm = this._fb.group({
      contentNameControlName: ['', Validators.required],
      notesControlName: [''],
      mediaTypeControlName: ['', Validators.required],
      availabilityDateControlName: [''],
      expirationDateControlName: [''],
      copyrightControlName: [''],
      privateContentControlName: ['0'],
      imageFileControlName: [null],
    });
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

          $('#contentsTreeView' + index).hummingbird();
          this.selectedCategories.forEach(item => {
            $("input:checkbox[name=categoriesChheckboxControlName][value="
              + item + "]").attr('checked', 'checked');
          });

          brandsLoaded++;
          if (brandToLoad === brandsLoaded) {
            this.spinner.hide();
          }
        }
      );
    });
  }

  loadMediaTypes() {
    this.mediaService.all().subscribe(
      (data) => {
        this.mediaTypes = data;
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
  }

  loadContent() {
    this.route.params.subscribe(params => {
      this.isUpdate = true;
      this.contentId = Number.parseInt(params['paramKey']);

      this.contentservice.details(this.contentId).subscribe(
        (data) => {
          if (data.content) {
            // users
            if (data.user) {
              for (let user of data.user) {
                user.name = user.first_name + ' ' + user.last_name;
                user.id = user.user_id;
              }

              this.userFilterSelected = data.user;
              this.userFilterOnChange(this.userFilterSelected);
            }

            // content data
            this.copyrightControlValue = (data.content.copyright === 0 ?
              false : true);
            this.contentNameControlValue = data.content.content_name;
            this.privateContentControlValue =
              data.content.private_content.toString();
            this.notesControlValue = data.content.notes;
            this.mediaFileName = data.content.file_name;
            if (data.content.availability_date) {
              this.availabilityDateControlValue =
                this.utilityService.getDateForNgbDatepicker(
                  data.content.availability_date);
            }
            if (data.content.expiration_date) {
              this.expirationDateControlValue =
                this.utilityService.getDateForNgbDatepicker(
                  data.content.expiration_date);
            }

            // image
            if (!data.content.imageUrl) {
              this.urlImage = UtilityService.DEFAULT_IMAGE;
            } else {
              this.urlImage = data.content.imageUrl;
            }

            // media types
            this.mediaTypeControlValue = data.media_types;

            // categories
            let categories = [];
            if (data.category) {
              data.category.forEach(item => {
                categories.push(item.category_id);
              });
            }
            this.selectedCategories = categories;
          }
        }
      );
    });
  }

  userFilterLoad(filterValue: string = null): Observable<any[]> {
    if (filterValue !== null && filterValue.length >= 3) {
      return this.userService.filter(filterValue);
    }

    return of([]);
  }

  userFilterOnSearch($event) {
    // trick for update selected items
    this.utilityService.delay(1).then(any => {
      let items = [];
      for (let user of this.userFilterSelected) {
        items.push(user);
      }

      this.userFilterSelected = items;
    });
  }

  userFilterOnChange($event) {
    if ($event !== null && $event.length > 0) {
      this.user_ids = [];
      for (let user of $event) {
        this.user_ids.push(user.id);
      }
    } else {
      this.user_ids = [];
    }
  }

  privateContentChange() {
    this.selectedCategories = [];
    this.userFilterSelected = [];
    this.user_ids = [];
  }

  currentSelectedCategories() {
    return $.map(
      $('input:checkbox[name=categoriesChheckboxControlName]:checked'),
      function (n, i) {
        return n.value;
      }).join(',')
  }

  onSelectImageFile(event) {
    if (event.target.files && event.target.files[0]) {
      let image = event.target.files[0];

      // validate file size
      if (image.size > MediaService.MAX_IMAGE_FILE_SIZE) {
        this.contentForm.controls['imageFileControlName'].setValue(null);
        this.contentForm.controls['imageFileControlName'].setErrors(
          { 'invalid': true });
        this.imageFile = null;
        return;
      }

      this.setImage(image);
    }
  }

  setImage(image) {
    if (image === null) {
      return;
    }

    this.imageFile = image;

    let reader = new FileReader();
    reader.onload = () => {
      this.urlImage = reader.result;
    };
    reader.readAsDataURL(image);
  }

  onSelectMediaFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.mediaFile = event.target.files[0];

      let reader = new FileReader();
      reader.readAsDataURL(this.mediaFile);
    }
  }

  onAvailabilityDateSelect($event) {
    if (this.contentForm.controls['expirationDateControlName'].valid
      === true && this.expirationDateControlValue !== null) {
      var expirationDateSelected =
        new Date(this.expirationDateControlValue.year,
          this.expirationDateControlValue.month - 1,
          this.expirationDateControlValue.day);
      var availabilitDateSelected =
        new Date($event.year, $event.month - 1, $event.day);

      if (availabilitDateSelected > expirationDateSelected) {
        this.contentForm.controls['expirationDateControlName'].setValue(null);
      }
    }
  }

  onExpirationDateSelect($event) {
    if (this.contentForm.controls['availabilityDateControlName'].valid
      === true && this.availabilityDateControlValue !== null) {
      var expirationDateSelected =
        new Date($event.year, $event.month - 1, $event.day);
      var availabilitDateSelected =
        new Date(this.availabilityDateControlValue.year,
          this.availabilityDateControlValue.month - 1,
          this.availabilityDateControlValue.day);

      if (expirationDateSelected < availabilitDateSelected) {
        this.contentForm.controls['availabilityDateControlName']
          .setValue(null);
      }
    }
  }

  submitForm(val) {
    const formData = new FormData();

    formData.append('content_name', val.contentNameControlName);
    formData.append('copyright', ((val.copyrightControlName === false) ?
      0 : 1).toString());

    if (val.availabilityDateControlName) {
      formData.append('availability_date',
        val.availabilityDateControlName.year + '-'
        + val.availabilityDateControlName.month + '-'
        + val.availabilityDateControlName.day);
    }

    if (val.expirationDateControlName) {
      formData.append('expiration_date',
        val.expirationDateControlName.year + '-'
        + val.expirationDateControlName.month + '-'
        + val.expirationDateControlName.day);
    }

    formData.append('private_content', val.privateContentControlName);

    if (val.notesControlName) {
      formData.append('notes', val.notesControlName);
    }

    formData.append('mediaType', JSON.stringify(val.mediaTypeControlName));

    if (this.user_ids.length > 0) {
      formData.append('privateUser', this.user_ids.join(","));
    }

    let selectedCategories = this.currentSelectedCategories();
    if (selectedCategories !== null && selectedCategories !== '') {
      formData.append('selectCategory', selectedCategories);
    }

    // checks if image selected
    if (this.imageFile) {
      formData.append('th_image', this.imageFile,
        (this.imageFile.name ? this.imageFile.name : 'default'));
    }

    if (this.isUpdate === true) {
      formData.append('content_id', this.contentId.toString());
    }
    // checks if image selected
    if (this.mediaFile && this.mediaFile.name) {
      formData.append('media_file', this.mediaFile, this.mediaFile.name);
    }

    let toastMessage = 'Please wait';
    if (this.mediaFile) {
      toastMessage = 'Please wait for the upload to complete';
    }

    const toast = this.toastr.warning(toastMessage, 'Saving content', {
      disableTimeOut: true,
      tapToDismiss: false
    });

    this.spinner.show();
    this.contentservice.save(formData)
      .pipe(finalize(() => {
        this.spinner.hide();
        this.toastr.remove(toast.toastId);
      }))
      .subscribe(
        event => {
          this.toastr.success('Content saved', 'Completed');
          this.router.navigate(['/mng-item-list']);
        },
        () => {
          this.toastr.error('The content could not be saved, please try again'
            , 'Error', {
              closeButton: true,
              disableTimeOut: true
            });
        });
  }
}
