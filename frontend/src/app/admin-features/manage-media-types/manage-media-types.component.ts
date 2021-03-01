import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaService } from './../../_services/index';
import { MediaTypes } from './../../_models/mediatypes';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-manage-media-types',
  templateUrl: './manage-media-types.component.html',
  styleUrls: ['./manage-media-types.component.scss']
})
export class ManageMediaTypesComponent implements OnInit, OnChanges {

  @Input() mediaType: MediaTypes;

  // update flag
  isUpdate = false;

  f: FormGroup;
  public error;
  public success;
  mediaDetails: MediaTypes;
  duttondisable = false;

  mediTypeinfo: any;

  constructor(private formBuilder: FormBuilder,
    private mediaService: MediaService,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.f = this.formBuilder.group({
      media_type_name: [null, [Validators.required]],
      media_type_id: [null]
    });    
  }

  ngOnChanges(changes: SimpleChanges) {
    this.mediTypeinfo = this.mediaType;

    if (this.mediaType !== undefined && this.mediaType !== null) {
      this.isUpdate = true;
    } else {
      this.isUpdate = false;
    }
  }

  onSubmit() {
    this.duttondisable = true;
    this.mediaService.save(this.f.value).subscribe(
      (data) => {
        if (this.isUpdate === true) {
          this.toastr.success("Media type Updated Succesfully");
        } else {
          this.toastr.success("Media type Created Succesfully");
        }

        this.duttondisable = false;
      }
    );
  }

}
