import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryCategoryComponent } from './story-category.component';

describe('StoryCategoryComponent', () => {
  let component: StoryCategoryComponent;
  let fixture: ComponentFixture<StoryCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
