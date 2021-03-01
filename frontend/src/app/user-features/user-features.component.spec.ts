import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFeaturesComponent } from './user-features.component';

describe('UserFeaturesComponent', () => {
  let component: UserFeaturesComponent;
  let fixture: ComponentFixture<UserFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
