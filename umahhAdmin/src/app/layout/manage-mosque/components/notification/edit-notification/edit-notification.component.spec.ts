import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVideosComponent } from './edit-board.component';

describe('EditVideosComponent', () => {
  let component: EditBoardComponent;
  let fixture: ComponentFixture<EditVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
