import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RReportedStoryComponent } from './r-reported-story.component';

describe('RReportedStoryComponent', () => {
  let component: RReportedStoryComponent;
  let fixture: ComponentFixture<RReportedStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RReportedStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RReportedStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
