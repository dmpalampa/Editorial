import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiefSubViewStoriesComponent } from './chief-sub-view-stories.component';

describe('ChiefSubViewStoriesComponent', () => {
  let component: ChiefSubViewStoriesComponent;
  let fixture: ComponentFixture<ChiefSubViewStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChiefSubViewStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiefSubViewStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
