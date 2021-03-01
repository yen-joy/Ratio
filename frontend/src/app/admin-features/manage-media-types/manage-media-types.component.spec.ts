import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMediaTypesComponent } from './manage-media-types.component';

describe('ManageMediaTypesComponent', () => {
  let component: ManageMediaTypesComponent;
  let fixture: ComponentFixture<ManageMediaTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMediaTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMediaTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
