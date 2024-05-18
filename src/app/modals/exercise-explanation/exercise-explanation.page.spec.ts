import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseExplanationPage } from './exercise-explanation.page';

describe('ExerciseExplanationPage', () => {
  let component: ExerciseExplanationPage;
  let fixture: ComponentFixture<ExerciseExplanationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExerciseExplanationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
