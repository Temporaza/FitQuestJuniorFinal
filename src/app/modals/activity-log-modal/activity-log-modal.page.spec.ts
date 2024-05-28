import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityLogModalPage } from './activity-log-modal.page';

describe('ActivityLogModalPage', () => {
  let component: ActivityLogModalPage;
  let fixture: ComponentFixture<ActivityLogModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ActivityLogModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
