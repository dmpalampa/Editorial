import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EReportedStoriesComponent } from './e-reported-stories.component';

describe('EReportedStoriesComponent', () => {
  let component: EReportedStoriesComponent;
  let fixture: ComponentFixture<EReportedStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EReportedStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EReportedStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
