import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFamilyComponent } from './single-family.component';

describe('SingleFamilyComponent', () => {
  let component: SingleFamilyComponent;
  let fixture: ComponentFixture<SingleFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleFamilyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
