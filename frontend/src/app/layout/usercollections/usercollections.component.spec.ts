import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercollectionsComponent } from './usercollections.component';

describe('UsercollectionsComponent', () => {
  let component: UsercollectionsComponent;
  let fixture: ComponentFixture<UsercollectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsercollectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsercollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
