import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export class CasinoPostMessageService {
  evolutionReady: boolean = false;
  evolutionSource = null;
  private eventBehaviorSubject = new BehaviorSubject<MessageEvent>(null);

  constructor() {
    const self = this;
    window.addEventListener("message", function (message) {
      self.postMessageListener(message);
    });
  }

  postMessageListener(event: MessageEvent) {
    if (!event.data || !event.data.event || !event.data.context || !event.source) {
      return;
    }

    console.log("PostMessage event received service: ", event);

    if ("EVO:APPLICATION_READY" === event.data.event) {
      this.evolutionReady = true;
      this.evolutionSource = event.source;

      (event.source as Window).postMessage({
        command: "EVO:EVENT_SUBSCRIBE",
        event: "EVO:GAME_LIFECYCLE"
      }, { targetOrigin: "*" });
      return;
    }

    this.eventBehaviorSubject.next(event);
    return;
  }

  sendPostMessage(data: object) {
    if (this.evolutionReady && this.evolutionSource) {
      return this.evolutionSource.postMessage(data, "*");
    }
    return window.postMessage(data, "*");
  }

  listenSpecificEvent(eventName: string): Observable<MessageEvent> {
    console.log("Setting up listener for specific event: ", eventName);

    return this.eventBehaviorSubject.asObservable().pipe(
      filter(event => !!event && !!event.data && event.data.event === eventName),
      map(event => {
        console.log(`Event ${eventName} triggered:`, event);
        return event;
      })
    );
  }

  destroy() {
    this.eventBehaviorSubject.complete();
    window.removeEventListener("message", this.postMessageListener.bind(this));
  }
}
