import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  name = signal('Angular with Signals');

  changeName() {
    this.name.set('Angular with Signals - Updated!');
  }
}

