import { APIV1, Message } from "./api-v1";
import { Observable, Observer } from "./lib/observable";
import WebSocket from "ws";

export class MessageListener {
  public observable: Observable<Message>;
  private ws: WebSocket;
  constructor(protected api = new APIV1(), secure = false) {
    this.observable = new Observable<Message>();
    this.ws = new WebSocket(
      `${secure ? "wss" : "ws"}://${api.url}/monitor/messages`
    );
    this.ws.addEventListener("message", ({ data }) => {
      this.observable.notify(
        "message",
        JSON.parse(data.toString("utf-8")) as Message
      );

      this.ws.once("close", () => {
        this.observable.unsubscribe();
      });
    });
  }
  public listen(listener: Observer<Message>) {
    return this.observable.subscribe("message", listener);
  }
}
