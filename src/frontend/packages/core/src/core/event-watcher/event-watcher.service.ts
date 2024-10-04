
import {fromEvent as observableFromEvent,  Observable } from 'rxjs';

import {map, debounceTime} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { WindowRef } from '../window-ref/window-ref.service';

export class ResizeEventData {
  innerWidth: number;
}

@Injectable()
export class EventWatcherService {
  constructor(private windowRef: WindowRef) { }

  resizeEvent$ = observableFromEvent(this.windowRef.nativeWindow, 'resize').pipe(debounceTime(250), map(() => {
    const { innerWidth } = this.windowRef.nativeWindow;
    return {
      innerWidth
    };
  }), );
}
