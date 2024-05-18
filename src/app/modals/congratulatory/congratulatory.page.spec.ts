import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CongratulatoryPage } from './congratulatory.page';

describe('CongratulatoryPage', () => {
  let component: CongratulatoryPage;
  let fixture: ComponentFixture<CongratulatoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CongratulatoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
