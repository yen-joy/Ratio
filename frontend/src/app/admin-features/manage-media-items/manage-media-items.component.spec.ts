import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMediaItemsComponent } from './manage-media-items.component';

describe('ManageMediaItemsComponent', () => {
  let component: ManageMediaItemsComponent;
  let fixture: ComponentFixture<ManageMediaItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMediaItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMediaItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
