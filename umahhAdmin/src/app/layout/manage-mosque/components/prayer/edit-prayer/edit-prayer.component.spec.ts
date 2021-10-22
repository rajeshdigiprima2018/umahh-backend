import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTopicsComponent } from './edit-topics.component';

describe('EditTopicsComponent', () => {
  let component: EditTopicsComponent;
  let fixture: ComponentFixture<EditTopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
