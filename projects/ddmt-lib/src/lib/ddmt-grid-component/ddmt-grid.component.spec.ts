import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DDMTGridComponent } from './ddmt-grid.component';

describe('DDMTGridComponent', () => {
  let component: DDMTGridComponent;
  let fixture: ComponentFixture<DDMTGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DDMTGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DDMTGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
