import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BirthdayModalPage } from './birthday-modal.page';

describe('BirthdayModalPage', () => {
  let component: BirthdayModalPage;
  let fixture: ComponentFixture<BirthdayModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BirthdayModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
