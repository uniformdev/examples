import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UniformToolbarComponent } from '@uniformdev/toolbar-angular';

import { ContextToolbarComponent } from './context-toolbar/context-toolbar.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ContextToolbarComponent,
    UniformToolbarComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
