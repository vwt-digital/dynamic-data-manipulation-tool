import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DDMTPaginationComponent } from './ddmt-pagination.component';

describe('PaginationComponent', () => {
  let component: DDMTPaginationComponent;
  let fixture: ComponentFixture<DDMTPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DDMTPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DDMTPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
