import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShapeMatchPage } from './shape-match.page';

describe('ShapeMatchPage', () => {
  let component: ShapeMatchPage;
  let fixture: ComponentFixture<ShapeMatchPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShapeMatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
