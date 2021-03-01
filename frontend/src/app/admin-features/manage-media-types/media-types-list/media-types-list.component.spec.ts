import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaTypesListComponent } from './media-types-list.component';

describe('MediaTypesListComponent', () => {
  let component: MediaTypesListComponent;
  let fixture: ComponentFixture<MediaTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaTypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
