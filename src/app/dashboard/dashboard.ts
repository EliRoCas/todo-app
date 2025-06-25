import { Component, computed, inject } from '@angular/core';
import { Nav } from '../nav/nav';
import { ProgressBar } from './progress-bar/progress-bar';
import { isSameDay } from 'date-fns';
import { TasksService } from '../services/tasks.service';
import { ItemContainer } from './item-container/item-container';

@Component({
  selector: 'app-dashboard',
  imports: [Nav, ProgressBar, ItemContainer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  tasksService = inject(TasksService);

  today = computed(() => this.tasksService.tasks().filter(x => isSameDay(x.date, new Date())));
  otherDays = computed(() => this.tasksService.tasks().filter(x => !isSameDay(x.date, new Date())));

}
