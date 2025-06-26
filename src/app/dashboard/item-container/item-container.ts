import { Component, computed, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TasksService, TaskInterface } from '../../services/tasks.service';
import { TaskForm } from '../../task-form/task-form';
import { FormsModule } from '@angular/forms';
import { Panel } from '../../controls/panel/panel';

@Component({
  selector: 'app-item-container',
  imports: [FormsModule, Panel],
  templateUrl: './item-container.html',
  styleUrl: './item-container.scss',
  encapsulation: ViewEncapsulation.None
})
export class ItemContainer {

  _tasksService = inject(TasksService);
  _matDialog = inject(MatDialog);

  task = input.required<TaskInterface>();
  subTasks = computed(() => this._tasksService.getSubTasks(this.task()))
  showSubTasks = signal(false);
  hasSubTasks = computed(() => this.subTasks().length > 0);

  delete() {
    this._tasksService.delete(this.task());
  }

  edit() {
    this._matDialog.open(TaskForm, { data: this.task() })
  }

  toggleSubTasks() {
    this.showSubTasks.update(value => !value);
  }

  toggleCompletation(task: TaskInterface) {
    this._tasksService.toggleCompletation(task);
  }

}
