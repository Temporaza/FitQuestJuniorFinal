import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaccineDetailsModalPage } from './vaccine-details-modal.page';

describe('VaccineDetailsModalPage', () => {
  let component: VaccineDetailsModalPage;
  let fixture: ComponentFixture<VaccineDetailsModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VaccineDetailsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
