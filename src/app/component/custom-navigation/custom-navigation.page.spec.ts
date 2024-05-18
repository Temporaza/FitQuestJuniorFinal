import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomNavigationPage } from './custom-navigation.page';

describe('CustomNavigationPage', () => {
  let component: CustomNavigationPage;
  let fixture: ComponentFixture<CustomNavigationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CustomNavigationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
