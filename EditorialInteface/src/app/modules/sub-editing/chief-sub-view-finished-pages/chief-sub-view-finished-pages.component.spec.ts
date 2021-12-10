import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiefSubViewFinishedPagesComponent } from './chief-sub-view-finished-pages.component';

describe('ChiefSubViewFinishedPagesComponent', () => {
  let component: ChiefSubViewFinishedPagesComponent;
  let fixture: ComponentFixture<ChiefSubViewFinishedPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChiefSubViewFinishedPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiefSubViewFinishedPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
