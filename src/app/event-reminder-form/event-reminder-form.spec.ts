import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventReminderForm } from './event-reminder-form';

describe('EventReminderForm', () => {
  let component: EventReminderForm;
  let fixture: ComponentFixture<EventReminderForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventReminderForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventReminderForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
