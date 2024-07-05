import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApostaClienteRifaComponent } from './aposta-cliente-rifa.component';

describe('ApostaClienteRifaComponent', () => {
  let component: ApostaClienteRifaComponent;
  let fixture: ComponentFixture<ApostaClienteRifaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApostaClienteRifaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApostaClienteRifaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
