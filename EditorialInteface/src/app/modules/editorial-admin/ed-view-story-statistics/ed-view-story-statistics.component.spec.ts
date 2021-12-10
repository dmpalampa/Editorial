import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdViewStoryStatisticsComponent } from './ed-view-story-statistics.component';

describe('EdViewStoryStatisticsComponent', () => {
  let component: EdViewStoryStatisticsComponent;
  let fixture: ComponentFixture<EdViewStoryStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdViewStoryStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdViewStoryStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
