import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumbersPage } from './numbers.page';

describe('NumbersPage', () => {
  let component: NumbersPage;
  let fixture: ComponentFixture<NumbersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NumbersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
