import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbRejectedStoriesComponent } from './sb-rejected-stories.component';

describe('SbRejectedStoriesComponent', () => {
  let component: SbRejectedStoriesComponent;
  let fixture: ComponentFixture<SbRejectedStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbRejectedStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbRejectedStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
