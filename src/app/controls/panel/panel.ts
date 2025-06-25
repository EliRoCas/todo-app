import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-panel',
  imports: [],
  templateUrl: './panel.html',
  styleUrl: './panel.scss'
})
export class Panel {

  title = input.required<string>();
  isExpandable = input(false);

  advancedOptions = signal(false);

  toggleOptions() {
    this.advancedOptions.update(value => !value);
  }
}
