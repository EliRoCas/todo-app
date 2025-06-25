import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
  animations: [
    trigger('fadeOut', [
      state('void', style({ opacity: 0, transform: 'translateX(-100%)' })),
      transition(':leave', [
        animate(
          '0.3s ease',
          style({ opacity: 0, transform: 'translateX(-100%)' })
        ),
      ]),
    ]),
  ],
})
export class TaskForm {
  progress = 0;
  tasks: Task[] = [];
  newTaskText = '';

  ngOnInit(): void {
    // Initialize with some sample tasks if needed
    this.tasks = [
      {
        id: 'todo1',
        text: 'Sample Task 1',
        completed: false,
        subtasks: [
          { id: 'sub1', text: 'Subtask 1', completed: false },
          { id: 'sub2', text: 'Subtask 2', completed: false },
        ],
        expanded: false,
      },
    ];
    this.updateProgress();
  }

  ngAfterViewInit(): void {
    this.updateProgress();
  }

  updateProgress(): void {
    const allCheckboxes = this.getAllCheckboxes();
    const checkedCheckboxes = this.getCheckedCheckboxes();
    this.progress =
      allCheckboxes.length > 0
        ? Math.round((checkedCheckboxes.length / allCheckboxes.length) * 100)
        : 0;
  }

  onCheckboxChange(task: Task, subtask?: Subtask): void {
    if (subtask) {
      subtask.completed = !subtask.completed;
    } else {
      task.completed = !task.completed;
    }
    this.updateProgress();
  }

  toggleSubtasks(task: Task): void {
    task.expanded = !task.expanded;
  }

  deleteItem(task: Task): void {
    const index = this.tasks.indexOf(task);
    if (index > -1) {
      this.tasks.splice(index, 1);
      this.updateProgress();
    }
  }

  editItem(task: Task, subtask?: Subtask): void {
    const currentText = subtask ? subtask.text : task.text;
    const newText = prompt('Edit task:', currentText);
    if (newText && newText !== currentText) {
      if (subtask) {
        subtask.text = newText;
      } else {
        task.text = newText;
      }
    }
  }

  addTask(): void {
    if (this.newTaskText.trim()) {
      const newTask: Task = {
        id: 'todo' + Date.now(),
        text: this.newTaskText.trim(),
        completed: false,
        subtasks: [],
        expanded: false,
      };
      this.tasks.push(newTask);
      this.newTaskText = '';
      this.updateProgress();
    }
  }

  addSubtask(task: Task): void {
    const subtaskText = prompt('Enter new subtask:');
    if (subtaskText?.trim()) {
      task.subtasks.push({
        id: 'sub' + Date.now(),
        text: subtaskText.trim(),
        completed: false,
      });
      this.updateProgress();
    }
  }

  private getAllCheckboxes(): number {
    return this.tasks.reduce((count, task) => {
      return count + 1 + task.subtasks.length;
    }, 0);
  }

  private getCheckedCheckboxes(): number {
    return this.tasks.reduce((count, task) => {
      const taskCount = task.completed ? 1 : 0;
      const subtaskCount = task.subtasks.filter((sub) => sub.completed).length;
      return count + taskCount + subtaskCount;
    }, 0);
  }
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  subtasks: Subtask[];
  expanded: boolean;
}

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}
