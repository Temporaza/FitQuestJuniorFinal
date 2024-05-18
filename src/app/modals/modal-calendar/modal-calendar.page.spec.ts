import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalCalendarPage } from './modal-calendar.page';

describe('ModalCalendarPage', () => {
  let component: ModalCalendarPage;
  let fixture: ComponentFixture<ModalCalendarPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModalCalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
