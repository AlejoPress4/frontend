import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMachineryComponent } from './list.component';

describe('ListMachineryComponent', () => {
  let component: ListMachineryComponent;
  let fixture: ComponentFixture<ListMachineryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListMachineryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListMachineryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
