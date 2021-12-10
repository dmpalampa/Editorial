import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbViewAssignedStoriesComponent } from './sb-view-assigned-stories.component';

describe('SbViewAssignedStoriesComponent', () => {
  let component: SbViewAssignedStoriesComponent;
  let fixture: ComponentFixture<SbViewAssignedStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbViewAssignedStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbViewAssignedStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
