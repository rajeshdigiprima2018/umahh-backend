import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserAdminComponent } from './add-user-admin.component';

describe('AddUserAdminComponent', () => {
  let component: AddUserAdminComponent;
  let fixture: ComponentFixture<AddUserAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
