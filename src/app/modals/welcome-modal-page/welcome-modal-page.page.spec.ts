import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeModalPagePage } from './welcome-modal-page.page';

describe('WelcomeModalPagePage', () => {
  let component: WelcomeModalPagePage;
  let fixture: ComponentFixture<WelcomeModalPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WelcomeModalPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
