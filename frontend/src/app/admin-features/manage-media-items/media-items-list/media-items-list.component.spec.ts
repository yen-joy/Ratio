import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaItemsListComponent } from './media-items-list.component';

describe('MediaItemsListComponent', () => {
  let component: MediaItemsListComponent;
  let fixture: ComponentFixture<MediaItemsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaItemsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
