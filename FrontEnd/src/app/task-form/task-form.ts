import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskInterface, TasksService } from '../services/tasks.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Panel } from '../controls/panel/panel';
import { Input } from '../controls/input/input';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, Panel, Input],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm {

  readonly _fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef);
  readonly tasksService = inject(TasksService);
  readonly data = inject<TaskInterface>(MAT_DIALOG_DATA, { optional: true });

  advancedOptions = signal(false);

  taskForm = this._fb.group({
    id: this._fb.control(crypto.randomUUID().toString(), { nonNullable: true }),
    title: this._fb.control('', { nonNullable: true, validators: [Validators.required] }),
    priority: this._fb.control('medium', { nonNullable: true, validators: [Validators.required] }),
    date: this._fb.control(new Date(), { nonNullable: true, validators: [Validators.required] }),
  });

  subTasksForm = this._fb.array([]);

  constructor() {
    if (this.data) {
      this.taskForm.patchValue(this.data);

      let subTasks = this.tasksService.getSubTasks(this.data);
      subTasks.forEach(s => {
        this.subTasksForm.push(this._fb.group({
          id: this._fb.control(s.id, { nonNullable: true }),
          title: this._fb.control(s.title, { nonNullable: true, validators: [Validators.required] }),
          date: this._fb.control(s.date, { nonNullable: true, validators: [Validators.required] }),
          parentId: this._fb.control(s.parentId, { nonNullable: true, validators: [Validators.required] }),
          priority: this._fb.control(s.priority, { nonNullable: true, validators: [Validators.required] }),
        }) as any);
      });
    }
  }

  save(event: MouseEvent) {
    event.preventDefault();

    let task: TaskInterface = this.taskForm.getRawValue();
    let subTasks = this.subTasksForm.value as TaskInterface[];

    this.tasksService.addOrUpdate(task);
    this.tasksService.addOrUpdate(...subTasks);
    this.dialogRef.close();
  }

  toGroup(control: FormControl) {
    return control as unknown as FormGroup;
  }

  addSubTask() {
    this.subTasksForm.push(this._fb.group({
      id: this._fb.control(crypto.randomUUID().toString(), { nonNullable: true }),
      title: this._fb.control('', { nonNullable: true, validators: [Validators.required] }),
      date: this._fb.control(new Date(), { nonNullable: true, validators: [Validators.required] }),
      parentId: this._fb.control(this.taskForm.value.id, { nonNullable: true, validators: [Validators.required] }),
    }) as any);
  }

  toggleOptions() {
    this.advancedOptions.update(value => !value);
  }

}
