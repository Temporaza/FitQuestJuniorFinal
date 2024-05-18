import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentLoginPage } from './parent-login.page';

describe('ParentLoginPage', () => {
  let component: ParentLoginPage;
  let fixture: ComponentFixture<ParentLoginPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParentLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
