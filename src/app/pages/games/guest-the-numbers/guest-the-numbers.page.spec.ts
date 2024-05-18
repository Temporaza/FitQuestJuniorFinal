import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuestTheNumbersPage } from './guest-the-numbers.page';

describe('GuestTheNumbersPage', () => {
  let component: GuestTheNumbersPage;
  let fixture: ComponentFixture<GuestTheNumbersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GuestTheNumbersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
