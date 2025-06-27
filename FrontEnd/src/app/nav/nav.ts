import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskForm } from '../task-form/task-form';
import { EventReminderForm } from '../event-reminder-form/event-reminder-form';

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.scss'
})
export class Nav {

  dialog = inject(MatDialog);

  addTask() {
    this.dialog.open(TaskForm);
  }

  addReminder() {
    this.dialog.open(EventReminderForm);
  }

}
