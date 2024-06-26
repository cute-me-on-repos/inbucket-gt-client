import { APIV1 } from "./api-v1";
import {MessageListener} from "./message-listener";

export default class Client {
  constructor(public api = new APIV1()) {}
}
export { Client, MessageListener, APIV1 };
