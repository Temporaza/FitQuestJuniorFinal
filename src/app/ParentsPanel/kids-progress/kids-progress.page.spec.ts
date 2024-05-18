import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KidsProgressPage } from './kids-progress.page';

describe('KidsProgressPage', () => {
  let component: KidsProgressPage;
  let fixture: ComponentFixture<KidsProgressPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(KidsProgressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
