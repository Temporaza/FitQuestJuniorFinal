import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BabybookPage } from './babybook.page';

describe('BabybookPage', () => {
  let component: BabybookPage;
  let fixture: ComponentFixture<BabybookPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BabybookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
