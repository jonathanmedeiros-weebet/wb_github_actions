import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilheteRifaComponent } from './bilhete-rifa.component';

describe('BilheteComponent', () => {
  let component: BilheteRifaComponent;
  let fixture: ComponentFixture<BilheteRifaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BilheteRifaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BilheteRifaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
