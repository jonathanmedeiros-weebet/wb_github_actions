import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacoesContatoComponent } from './informacoes-contato.component';

describe('InformacoesContatoComponent', () => {
  let component: InformacoesContatoComponent;
  let fixture: ComponentFixture<InformacoesContatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformacoesContatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacoesContatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
