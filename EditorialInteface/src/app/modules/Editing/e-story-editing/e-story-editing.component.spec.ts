import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EStoryEditingComponent } from './e-story-editing.component';

describe('EStoryEditingComponent', () => {
  let component: EStoryEditingComponent;
  let fixture: ComponentFixture<EStoryEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EStoryEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EStoryEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
