import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorDetailsModalPage } from './doctor-details-modal.page';

describe('DoctorDetailsModalPage', () => {
  let component: DoctorDetailsModalPage;
  let fixture: ComponentFixture<DoctorDetailsModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DoctorDetailsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
