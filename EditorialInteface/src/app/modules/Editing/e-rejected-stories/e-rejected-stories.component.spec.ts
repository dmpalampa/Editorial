import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ERejectedStoriesComponent } from './e-rejected-stories.component';

describe('ERejectedStoriesComponent', () => {
  let component: ERejectedStoriesComponent;
  let fixture: ComponentFixture<ERejectedStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ERejectedStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ERejectedStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
