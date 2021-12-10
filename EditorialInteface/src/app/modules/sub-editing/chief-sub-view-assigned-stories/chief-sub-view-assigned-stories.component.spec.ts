import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiefSubViewAssignedStoriesComponent } from './chief-sub-view-assigned-stories.component';

describe('ChiefSubViewAssignedStoriesComponent', () => {
  let component: ChiefSubViewAssignedStoriesComponent;
  let fixture: ComponentFixture<ChiefSubViewAssignedStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChiefSubViewAssignedStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiefSubViewAssignedStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
