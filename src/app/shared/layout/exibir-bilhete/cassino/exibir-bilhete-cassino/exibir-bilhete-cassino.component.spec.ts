import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExibirBilheteCassinoComponent } from './exibir-bilhete-cassino.component';

describe('ExibirBilheteCassinoComponent', () => {
  let component: ExibirBilheteCassinoComponent;
  let fixture: ComponentFixture<ExibirBilheteCassinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExibirBilheteCassinoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExibirBilheteCassinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
