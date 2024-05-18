import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaccinationPage } from './vaccination.page';

describe('VaccinationPage', () => {
  let component: VaccinationPage;
  let fixture: ComponentFixture<VaccinationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VaccinationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
