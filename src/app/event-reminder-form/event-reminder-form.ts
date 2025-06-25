import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-reminder-form',
  imports: [],
  templateUrl: './event-reminder-form.html',
  styleUrl: './event-reminder-form.scss',
})
export class EventReminderForm implements OnInit {
  eventForm!: FormGroup;
  timeString!: string;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Set default time to current time + 1 hour
    const now = new Date();
    now.setHours(now.getHours() + 1);
    this.timeString = now.toTimeString().slice(0, 5);

    // Initialize form
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      time: [this.timeString, Validators.required],
      alarm: ['15min', Validators.required],
      description: [''],
    });
  }

  selectAlarmOption(value: string): void {
    this.eventForm.patchValue({ alarm: value });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    // Simulate form submission
    setTimeout(() => {
      alert('Event reminder created successfully!');
      this.resetForm();
      this.isSubmitting = false;
    }, 1000);
  }

  onCancel(): void {
    if (
      confirm(
        'Are you sure you want to cancel? Any unsaved changes will be lost.'
      )
    ) {
      this.resetForm();
      // Or navigate back
      // this.location.back();
    }
  }

  private resetForm(): void {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    this.timeString = now.toTimeString().slice(0, 5);

    this.eventForm.reset({
      date: new Date().toISOString().substring(0, 10),
      time: this.timeString,
      alarm: '15min',
      description: '',
    });
  }
}
