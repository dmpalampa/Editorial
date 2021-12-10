import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeniedAccessComponent } from './user-denied-access.component';

describe('UserDeniedAccessComponent', () => {
  let component: UserDeniedAccessComponent;
  let fixture: ComponentFixture<UserDeniedAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeniedAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeniedAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
