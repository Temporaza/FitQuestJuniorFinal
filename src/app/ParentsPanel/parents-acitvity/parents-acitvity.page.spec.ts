import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentsAcitvityPage } from './parents-acitvity.page';

describe('ParentsAcitvityPage', () => {
  let component: ParentsAcitvityPage;
  let fixture: ComponentFixture<ParentsAcitvityPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParentsAcitvityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
