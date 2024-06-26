import { APIV1, Message } from "./api-v1";
import { Observable } from "./lib/observable";
import WebSocket from "ws";

export class MessageListener {
  public observable: Observable<Message>;
  private ws: WebSocket;
  constructor(protected api = new APIV1()) {
    this.observable = new Observable<Message>();
    this.ws = new WebSocket(`ws://${api.baseUrl}/monitor/messages`);
    this.ws.addEventListener("message", ({ data }) => {
      (data as unknown as Message[]).forEach((msg: Message) => {
        this.observable.notify(`message:${msg.id}`, msg);
      });
      this.ws.once('close',()=>{
        this.observable.unsubscribe()
      })
    });
  }
}
