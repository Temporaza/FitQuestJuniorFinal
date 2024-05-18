import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpenTaskDoneModalPage } from './open-task-done-modal.page';

describe('OpenTaskDoneModalPage', () => {
  let component: OpenTaskDoneModalPage;
  let fixture: ComponentFixture<OpenTaskDoneModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OpenTaskDoneModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
