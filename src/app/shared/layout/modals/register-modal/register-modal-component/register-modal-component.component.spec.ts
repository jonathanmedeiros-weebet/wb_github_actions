import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterModalComponentComponent } from './register-modal-component.component';

describe('RegisterModalComponentComponent', () => {
  let component: RegisterModalComponentComponent;
  let fixture: ComponentFixture<RegisterModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterModalComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
