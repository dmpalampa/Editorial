import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdViewReportersStoriesComponent } from './ed-view-reporters-stories.component';

describe('EdViewReportersStoriesComponent', () => {
  let component: EdViewReportersStoriesComponent;
  let fixture: ComponentFixture<EdViewReportersStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdViewReportersStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdViewReportersStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
