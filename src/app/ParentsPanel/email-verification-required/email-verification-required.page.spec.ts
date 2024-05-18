import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailVerificationRequiredPage } from './email-verification-required.page';

describe('EmailVerificationRequiredPage', () => {
  let component: EmailVerificationRequiredPage;
  let fixture: ComponentFixture<EmailVerificationRequiredPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmailVerificationRequiredPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
