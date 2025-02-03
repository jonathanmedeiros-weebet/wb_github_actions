import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartilharBilheteComponent } from './compartilhar-bilhete.component';

describe('CompartilharBilheteComponent', () => {
  let component: CompartilharBilheteComponent;
  let fixture: ComponentFixture<CompartilharBilheteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompartilharBilheteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompartilharBilheteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
