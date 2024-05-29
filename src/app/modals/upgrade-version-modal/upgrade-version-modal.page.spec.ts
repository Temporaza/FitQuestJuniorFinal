import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeVersionModalPage } from './upgrade-version-modal.page';

describe('UpgradeVersionModalPage', () => {
  let component: UpgradeVersionModalPage;
  let fixture: ComponentFixture<UpgradeVersionModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpgradeVersionModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
