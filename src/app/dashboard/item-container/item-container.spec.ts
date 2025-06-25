import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemContainer } from './item-container';

describe('ItemContainer', () => {
  let component: ItemContainer;
  let fixture: ComponentFixture<ItemContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
