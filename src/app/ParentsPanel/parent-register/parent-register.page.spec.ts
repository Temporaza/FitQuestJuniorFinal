import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentRegisterPage } from './parent-register.page';

describe('ParentRegisterPage', () => {
  let component: ParentRegisterPage;
  let fixture: ComponentFixture<ParentRegisterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParentRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
