import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentsProfilePagePage } from './parents-profile-page.page';

describe('ParentsProfilePagePage', () => {
  let component: ParentsProfilePagePage;
  let fixture: ComponentFixture<ParentsProfilePagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParentsProfilePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
