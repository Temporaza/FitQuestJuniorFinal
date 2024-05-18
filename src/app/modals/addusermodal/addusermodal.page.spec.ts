import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddusermodalPage } from './addusermodal.page';

describe('AddusermodalPage', () => {
  let component: AddusermodalPage;
  let fixture: ComponentFixture<AddusermodalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddusermodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
