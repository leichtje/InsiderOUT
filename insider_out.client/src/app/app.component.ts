import { Component, effect, inject, input, signal, Signal, WritableSignal } from '@angular/core';
import { BreakpointService } from './services/breakpoint.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false,
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'insider_out.client';

private breakpointService = inject(BreakpointService);

  isMobileSidebarOpen: WritableSignal<boolean> = signal(false);

  constructor() {
    effect(() => {
      if (!this.breakpointService.isPhone()) {
        this.isMobileSidebarOpen.set(false);
      }
    });
  }
}
