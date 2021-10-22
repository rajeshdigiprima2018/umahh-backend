import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmailTemplateComponent } from './list-email-template.component';

describe('ListEmailTemplateComponent', () => {
  let component: ListEmailTemplateComponent;
  let fixture: ComponentFixture<ListEmailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
