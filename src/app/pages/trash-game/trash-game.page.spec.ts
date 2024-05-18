import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrashGamePage } from './trash-game.page';

describe('TrashGamePage', () => {
  let component: TrashGamePage;
  let fixture: ComponentFixture<TrashGamePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TrashGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
