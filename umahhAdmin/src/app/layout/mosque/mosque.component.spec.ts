import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportAdminComponent } from './support-admin.component';

describe('SupportAdminComponent', () => {
  let component: SupportAdminComponent;
  let fixture: ComponentFixture<SupportAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
