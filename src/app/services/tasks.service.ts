import { computed, Injectable, signal } from '@angular/core';
import { addDays } from 'date-fns';

export interface Entity {
  id: string;
}

function mergeById<T extends Entity>(baseArray: T[], newArray: T[]): T[] {
  const map = new Map(baseArray.map(obj => [obj.id, obj]));

  for (const obj of newArray) {
    map.set(obj.id, { ...map.get(obj.id), ...obj });
  }

  return Array.from(map.values());
}


export interface TaskInterface extends Entity {
  title: string;
  completed?: boolean;
  expired?: boolean;
  date: Date;
  priority?: string,
  parentId?: string
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  _allTasks = signal<TaskInterface[]>([
    {
      id: crypto.randomUUID(),
      title: 'Morning meeting preparation',
      completed: true,
      date: new Date()
    },
    {
      id: crypto.randomUUID(),
      title: 'Call dentist (expired)',
      expired: true,
      date: new Date()
    },
    {
      id: crypto.randomUUID(),
      title: 'Submit quarterly report (Due today)',
      date: new Date()
    },
    {
      id: 'asdasdasd',
      title: 'Complete project documentation',
      date: addDays(new Date(), 1),
    },
    { id: crypto.randomUUID(), title: 'Write introduction section', date: new Date(), parentId: 'asdasdasd' },
    { id: crypto.randomUUID(), title: 'Create diagrams and charts', completed: true, date: new Date(), parentId: 'asdasdasd' },
    {
      id: crypto.randomUUID(),
      title: 'Review team feedback',
      date: addDays(new Date(), 1)
    },
    {
      id: 'asdasdfsdsdasd',
      title: 'Plan next sprint goals',
      date: addDays(new Date(), 1)
    },
    { id: crypto.randomUUID(), title: 'sprint 1', date: addDays(new Date(), 1), parentId: 'asdasdfsdsdasd' },
    { id: crypto.randomUUID(), title: 'sprint 2', date: addDays(new Date(), 1), parentId: 'asdasdfsdsdasd' }
  ]);

  tasks = computed(() => this._allTasks().filter(x => !x.parentId));


  getSubTasks(task: TaskInterface) {
    return this._allTasks().filter(x => x.parentId === task.id) ?? [];
  }

  addOrUpdate(...tasks: TaskInterface[]) {
    this._allTasks.update(x => mergeById(x, tasks));
  }

  delete(task: TaskInterface) {
    this._allTasks.update(x => x.filter(y => y.id !== task.id));
  }

  toggleCompletation(task: TaskInterface) {
    let currentTask = this._allTasks().find(x => x.id === task.id);
    let completed = !currentTask?.completed;

    this._allTasks.update(value => value.map(taskItem =>
      (taskItem.id === task.id || taskItem.parentId === task.id)
        ? ({ ...taskItem, completed })
        : taskItem));

    if (currentTask?.parentId) {

      let children = this._allTasks().filter(x => x.parentId === currentTask.parentId);
      let allCompleted = children.length === 0 || children.every(x => x.completed)


      this._allTasks.update(value => value.map(taskItem =>
        (taskItem.id === currentTask.parentId)
          ? ({ ...taskItem, completed: allCompleted })
          : taskItem));
    }
  }
}
