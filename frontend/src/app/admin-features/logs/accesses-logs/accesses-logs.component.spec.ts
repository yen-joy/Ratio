import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessesLogsComponent } from './accesses-logs.component';

describe('AccessesLogsComponent', () => {
  let component: AccessesLogsComponent;
  let fixture: ComponentFixture<AccessesLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessesLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessesLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
