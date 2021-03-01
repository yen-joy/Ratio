import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMediaCategoriesComponent } from './manage-media-categories.component';

describe('ManageMediaCategoriesComponent', () => {
  let component: ManageMediaCategoriesComponent;
  let fixture: ComponentFixture<ManageMediaCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMediaCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMediaCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
