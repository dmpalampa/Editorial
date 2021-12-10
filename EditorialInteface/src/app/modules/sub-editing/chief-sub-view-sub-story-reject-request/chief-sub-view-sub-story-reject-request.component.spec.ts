import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiefSubViewSubStoryRejectRequestComponent } from './chief-sub-view-sub-story-reject-request.component';

describe('ChiefSubViewSubStoryRejectRequestComponent', () => {
  let component: ChiefSubViewSubStoryRejectRequestComponent;
  let fixture: ComponentFixture<ChiefSubViewSubStoryRejectRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChiefSubViewSubStoryRejectRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiefSubViewSubStoryRejectRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
