import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentDetailsModalPage } from './parent-details-modal.page';

describe('ParentDetailsModalPage', () => {
  let component: ParentDetailsModalPage;
  let fixture: ComponentFixture<ParentDetailsModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParentDetailsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
