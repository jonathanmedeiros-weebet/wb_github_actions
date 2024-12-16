import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceMatchModalComponent } from './face-match-modal.component';

describe('FaceMatchModalComponent', () => {
  let component: FaceMatchModalComponent;
  let fixture: ComponentFixture<FaceMatchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceMatchModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceMatchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
