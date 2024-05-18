import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCountingPage } from './game-counting.page';

describe('GameCountingPage', () => {
  let component: GameCountingPage;
  let fixture: ComponentFixture<GameCountingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GameCountingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
