import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskForm } from '../task-form/task-form';

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

}
