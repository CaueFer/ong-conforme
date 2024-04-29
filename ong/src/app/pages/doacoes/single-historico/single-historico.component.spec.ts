import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleHistoricoComponent } from './single-historico.component';

describe('SingleHistoricoComponent', () => {
  let component: SingleHistoricoComponent;
  let fixture: ComponentFixture<SingleHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleHistoricoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
