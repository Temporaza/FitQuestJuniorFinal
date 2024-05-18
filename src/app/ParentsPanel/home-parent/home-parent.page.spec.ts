import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeParentPage } from './home-parent.page';

describe('HomeParentPage', () => {
  let component: HomeParentPage;
  let fixture: ComponentFixture<HomeParentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeParentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
