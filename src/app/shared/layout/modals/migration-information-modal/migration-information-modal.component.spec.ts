import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationInformationModalComponent } from './migration-information-modal.component';

describe('MigrationInformationModalComponent', () => {
  let component: MigrationInformationModalComponent;
  let fixture: ComponentFixture<MigrationInformationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrationInformationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigrationInformationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
