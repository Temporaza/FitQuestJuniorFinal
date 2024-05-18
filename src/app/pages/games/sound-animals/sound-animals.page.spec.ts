import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoundAnimalsPage } from './sound-animals.page';

describe('SoundAnimalsPage', () => {
  let component: SoundAnimalsPage;
  let fixture: ComponentFixture<SoundAnimalsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SoundAnimalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
