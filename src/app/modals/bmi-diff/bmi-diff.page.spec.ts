import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BmiDiffPage } from './bmi-diff.page';

describe('BmiDiffPage', () => {
  let component: BmiDiffPage;
  let fixture: ComponentFixture<BmiDiffPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BmiDiffPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
