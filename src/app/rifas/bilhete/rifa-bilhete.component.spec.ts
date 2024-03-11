import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RifaBilheteComponent } from './rifa-bilhete.component';

describe('BilheteComponent', () => {
  let component: RifaBilheteComponent;
  let fixture: ComponentFixture<RifaBilheteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RifaBilheteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RifaBilheteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
