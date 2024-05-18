import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUserModalPage } from './edit-user-modal.page';

describe('EditUserModalPage', () => {
  let component: EditUserModalPage;
  let fixture: ComponentFixture<EditUserModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditUserModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
