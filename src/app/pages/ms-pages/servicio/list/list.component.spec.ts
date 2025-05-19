import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServicioComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListServicioComponent;
  let fixture: ComponentFixture<ListServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListServicioComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
