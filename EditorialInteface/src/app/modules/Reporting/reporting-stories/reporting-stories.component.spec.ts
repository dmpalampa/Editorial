import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingStoriesComponent } from './reporting-stories.component';

describe('ReportingStoriesComponent', () => {
  let component: ReportingStoriesComponent;
  let fixture: ComponentFixture<ReportingStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
