import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbFinishedPagesComponent } from './sb-finished-pages.component';

describe('SbFinishedPagesComponent', () => {
  let component: SbFinishedPagesComponent;
  let fixture: ComponentFixture<SbFinishedPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbFinishedPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbFinishedPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
