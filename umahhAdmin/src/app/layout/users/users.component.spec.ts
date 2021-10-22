import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { UsersComponent } from './users.component';
import { UsersModule } from './users.module';

describe('ChartsComponent', () => {
  let component: UsersComponent
  let fixture: ComponentFixture<UsersComponent>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          UsersModule,
          RouterTestingModule,
          BrowserAnimationsModule,
        ],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
