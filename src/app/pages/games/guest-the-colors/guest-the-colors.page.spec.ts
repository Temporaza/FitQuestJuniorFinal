import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuestTheColorsPage } from './guest-the-colors.page';

describe('GuestTheColorsPage', () => {
  let component: GuestTheColorsPage;
  let fixture: ComponentFixture<GuestTheColorsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GuestTheColorsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
