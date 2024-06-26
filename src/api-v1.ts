/**
 * INBUCKET API V1
 * @see https://github.com/inbucket/inbucket/wiki/REST-API#api-v1
 * List Mailbox Contents: GET /api/v1/mailbox/{name}
 * Get Message: GET /api/v1/mailbox/{name}/{id}
 * Get Message Source: GET /api/v1/mailbox/{name}/{id}/source
 * Delete Message: DELETE /api/v1/mailbox/{name}/{id}
 * Purge Mailbox Contents: DELETE /api/v1/mailbox/{name}
 */
export type APIV1Config = {
  host: string;
  endpoint: string;
  protocol: string;
  port: number;
};
const defaultConfig = {
  host: "localhost",
  endpoint: "api/v1",
  port: 9000,
  protocol: 'http',
};
export class APIV1 {
  public url: string;
  public baseUrl: string;
  constructor(protected config: APIV1Config = defaultConfig) {
    const {
      host = defaultConfig.host,
      port = defaultConfig.port,
      protocol = defaultConfig.protocol,
      endpoint = defaultConfig.endpoint,
    } = config;
    this.url = `${host}:${port}/${endpoint}`;
    this.baseUrl = `${protocol}://${this.url}`;
  }

  async listMailboxContents(name: string): Promise<Array<MailboxContent>> {
    const response = await fetch(`${this.baseUrl}/mailbox/${name}`);
    return response.json();
  }

  async getMessage(name: string, id: string): Promise<Message> {
    const response = await fetch(`${this.baseUrl}/mailbox/${name}/${id}`);
    return response.json();
  }

  async getMessageSource(name: string, id: string): Promise<MessageSource> {
    const response = await fetch(
      `${this.baseUrl}/mailbox/${name}/${id}/source`
    );
    return response.text();
  }

  async deleteMessage(name: string, id: string) {
    const response = await fetch(`${this.baseUrl}/mailbox/${name}/${id}`, {
      method: "DELETE",
    });
    return (await response.text()) === "OK";
  }

  async purgeMailboxContents(name: string) {
    const response = await fetch(`${this.baseUrl}/mailbox/${name}`, {
      method: "DELETE",
    });
    return (await response.text()) === "OK";
  }

  async seenMessage(name: string, id: string) {
    const response = await fetch(`${this.baseUrl}/mailbox/${name}/${id}`, {
      method: "PATCH",
      body: "{seen:true}",
    });
    return (await response.text()) === "OK";
  }
}

export type MailboxContent = {
  mailbox: string;
  id: string;
  from: string;
  to: Array<string>;
  subject: string;
  date: string;
  "posix-millis": number;
  size: number;
  seen: boolean;
};
export type Message = {
  mailbox: string;
  id: string;
  from: string;
  to: string[];
  subject: string;
  date: string;
  "posix-millis": number;
  size: number;
  seen: boolean;
  text: string;
  attachments: any[];
  errors: any[];
  body: {
    text: string
  }
  header: {
    "Content-Type": string[];
    Date: string[];
    From: string[];
    "Message-Id": string[];
    "Mime-Version": string[];
    Received: string[];
    Subject: string[];
    To: string[];
  } & Record<string, string[]>;
};
export type MessageSource = string;
