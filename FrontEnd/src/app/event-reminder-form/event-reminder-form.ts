import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Panel } from '../controls/panel/panel';
import { Input } from '../controls/input/input';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-reminder-form',
  imports: [Panel, Input, ReactiveFormsModule],
  templateUrl: './event-reminder-form.html',
  styleUrl: './event-reminder-form.scss',
})
export class EventReminderForm {

  _fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef);

  form = this._fb.group({
    title: '',
    description: '',
    date: new Date(),
    reminder: this._fb.control(['30min', '1hour'])
  });

  constructor() {
    this.form.valueChanges.subscribe(x => {
      console.log(x)
    })
  }

  add() {
    this.dialogRef.close();
  }

}
