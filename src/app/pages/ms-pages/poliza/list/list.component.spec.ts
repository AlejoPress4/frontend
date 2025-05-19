import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPolicyComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListPolicyComponent
  let fixture: ComponentFixture<ListPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListPolicyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
