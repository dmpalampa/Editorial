import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EEditedStoriesComponent } from './e-edited-stories.component';

describe('EEditedStoriesComponent', () => {
  let component: EEditedStoriesComponent;
  let fixture: ComponentFixture<EEditedStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EEditedStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EEditedStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
