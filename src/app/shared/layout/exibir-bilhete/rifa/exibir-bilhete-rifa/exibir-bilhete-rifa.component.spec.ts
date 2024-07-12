import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExibirBilheteRifaComponent } from './exibir-bilhete-rifa.component';

describe('ExibirBilheteRifaComponent', () => {
  let component: ExibirBilheteRifaComponent;
  let fixture: ComponentFixture<ExibirBilheteRifaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExibirBilheteRifaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExibirBilheteRifaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
