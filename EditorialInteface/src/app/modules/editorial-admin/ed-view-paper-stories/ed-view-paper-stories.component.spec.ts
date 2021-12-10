import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdViewPaperStoriesComponent } from './ed-view-paper-stories.component';

describe('EdViewPaperStoriesComponent', () => {
  let component: EdViewPaperStoriesComponent;
  let fixture: ComponentFixture<EdViewPaperStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdViewPaperStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdViewPaperStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
