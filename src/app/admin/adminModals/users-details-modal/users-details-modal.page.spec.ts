import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersDetailsModalPage } from './users-details-modal.page';

describe('UsersDetailsModalPage', () => {
  let component: UsersDetailsModalPage;
  let fixture: ComponentFixture<UsersDetailsModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UsersDetailsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
