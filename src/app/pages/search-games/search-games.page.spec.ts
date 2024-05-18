import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchGamesPage } from './search-games.page';

describe('SearchGamesPage', () => {
  let component: SearchGamesPage;
  let fixture: ComponentFixture<SearchGamesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SearchGamesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
