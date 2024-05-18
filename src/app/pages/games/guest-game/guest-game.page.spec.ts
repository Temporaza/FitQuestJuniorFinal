import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuestGamePage } from './guest-game.page';

describe('GuestGamePage', () => {
  let component: GuestGamePage;
  let fixture: ComponentFixture<GuestGamePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GuestGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
