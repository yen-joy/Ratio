import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindUserNameComponent } from './remind-user-name.component';

describe('RemindUserNameComponent', () => {
  let component: RemindUserNameComponent;
  let fixture: ComponentFixture<RemindUserNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemindUserNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindUserNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
