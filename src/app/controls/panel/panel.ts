import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.html',
  styleUrl: './panel.scss'
})
export class Panel {

  isExpandable = input(false);
  hasContent = input(true);
  isExpanded = model(false);

  toggleOptions() {
    this.isExpanded.update(value => !value);
  }
}
