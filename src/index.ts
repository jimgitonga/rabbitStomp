// Import stylesheets
import "../style.css";
import {
  Client as StompClient,
  //Message as StompMessage,
  StompConfig,
  StompHeaders,
  IMessage,
  IFrame
  //FrameImpl
  //IPublishParams
} from "@stomp/stompjs";

// https://www.rabbitmq.com/web-mqtt.html
// Check out this tutorial!!!

// STOMP WEBSOCKET
// https://www.npmjs.com/package/@stomp/stompjs
// https://github.com/stomp-js/stompjs
// https://stomp-js.github.io/guide/stompjs/2018/06/29/using-stompjs-v5.html
// Documentação do StompClient
// Header genérico em forma de chave/valor a ser passado na desconexão
// let disconnectHeaders = new StompHeaders();

console.log("oi");

let stompConfig = new StompConfig();
stompConfig.appendMissingNULLonIncoming = false;
stompConfig.beforeConnect = () =>
  console.log("This is the step before connection (or re-connection).");
stompConfig.onWebSocketError = () => console.log("Websocket error.");
stompConfig.onWebSocketClose = () => console.log("Websocket closed.");
let stompClient: StompClient;

let hostname: HTMLInputElement;
let port: HTMLInputElement;
let useTLS: HTMLInputElement;
let username: HTMLInputElement;
let password: HTMLInputElement;
let vhost: HTMLInputElement;
let connect = <HTMLButtonElement>document.querySelector("#webStompConnect");

function setConnection() {
  console.log("Construindo RabbitStompConnect");
  hostname = <HTMLInputElement>document.querySelector("#webStompHostname");
  port = <HTMLInputElement>document.querySelector("#webStompPort");
  useTLS = <HTMLInputElement>document.querySelector("#useTls");
  username = <HTMLInputElement>document.querySelector("#webStompUser");
  password = <HTMLInputElement>document.querySelector("#webStompPassword");
  vhost = <HTMLInputElement>document.querySelector("#vhost");
  connect = <HTMLButtonElement>document.querySelector("#webStompConnect");
}

function onClickConnect(): void {
  console.log("Attempting a connection to RabbitMQ via WebSTOMP...");
  setConnection();
  stompConfig.connectHeaders = {
    host: vhost.value,
    login: username.value,
    passcode: password.value
  };
  //stompConfig.debug = (debugMessage) => console.log(debugMessage);
  // stompConfig.forceBinaryWSFrames = false;
  // stompConfig.heartbeatIncoming = 10000;
  // stompConfig.heartbeatOutgoing = 10000;
  // stompConfig.logRawCommunication = true;
  // stompConfig.maxWebSocketChunkSize
  stompConfig.brokerURL = `ws${useTLS.checked ? "s" : ""}://${hostname.value}:${
    port.value
  }/ws`;

  stompConfig.onConnect = (frame: IFrame) => {
    console.log("Web Stomp connected!");
    console.log(frame);
  };
  stompConfig.onDisconnect = (frame: IFrame) => {
    console.log("Web Stomp disconnected!");
    console.log(frame);
  };
  stompConfig.onStompError = (iFrame: IFrame) => {
    console.log(`Web Stomp error!`);
    console.log(iFrame);
  };
  stompConfig.onUnhandledMessage = (iMessage: IMessage) => {
    console.log("Unhandled message.");
    console.log(iMessage);
  };
  stompConfig.onUnhandledReceipt = (frame: IFrame) => {
    console.log("Unhandled receipt.");
    console.log(frame);
  };
  stompConfig.onWebSocketClose = (evt: CloseEvent) => {
    console.log("Websocket about to close.");
    console.log(evt);
  };
  stompConfig.onWebSocketError = (evt: Event) => {
    console.log("Websocket error.");
    console.log(evt);
  };
  stompConfig.reconnectDelay = 5000;
  stompConfig.splitLargeFrames = false;
  // STOMP versions to attempt during STOMP handshake. By default versions 1.0, 1.1, and 1.2 are attempted. new Versions(['1.0', '1.1', '1.2'])
  // stompConfig.stompVersions = new Versions(['1.0', '1.1', '1.2']
  //stompConfig.webSocketFactory
  stompClient = new StompClient(stompConfig);
  stompClient.activate();
}

connect.onclick = onClickConnect;

// Se for input é .value
// Se for checkbox é .checked
// Se for combobox é .selected ou selectedIndex

let subDestination: HTMLInputElement;
let subPersistent: HTMLSelectElement;
let exclusive: HTMLSelectElement;
let autoDelete: HTMLSelectElement;
let prefetchCount: HTMLInputElement;
let queueName: HTMLInputElement;
let queueType: HTMLSelectElement;
let deadLetterExchange: HTMLInputElement;
let deadLetterRoutingKey: HTMLInputElement;
let expires: HTMLInputElement;
let messageTtl: HTMLInputElement;
let maxLength: HTMLInputElement;
let maxLengthBytes: HTMLInputElement;
let overflow: HTMLInputElement;
let maxPriority: HTMLInputElement;
let subButton: HTMLButtonElement = <HTMLButtonElement>(
  document.querySelector("#subButton")
);

function setSubscription() {
  subDestination = <HTMLInputElement>document.querySelector("#subDestination");
  subPersistent = <HTMLSelectElement>document.querySelector("#subDurable");
  exclusive = <HTMLSelectElement>document.querySelector("#subExclusive");
  autoDelete = <HTMLSelectElement>document.querySelector("#subAutodelete");
  prefetchCount = <HTMLInputElement>document.querySelector("#prefetchCount");

  queueName = <HTMLInputElement>document.querySelector("#x-queue-name");
  queueType = <HTMLSelectElement>document.querySelector("#x-queue-type");
  deadLetterExchange = <HTMLInputElement>(
    document.querySelector("#x-dead-letter-exchange")
  );
  deadLetterRoutingKey = <HTMLInputElement>(
    document.querySelector("#x-dead-letter-routing-key")
  );
  expires = <HTMLInputElement>document.querySelector("#x-expires");
  messageTtl = <HTMLInputElement>document.querySelector("#x-message-ttl");
  maxLength = <HTMLInputElement>document.querySelector("#x-max-length");
  maxLengthBytes = <HTMLInputElement>(
    document.querySelector("#x-max-length-bytes")
  );
  overflow = <HTMLInputElement>document.querySelector("#x-overflow");
  maxPriority = <HTMLInputElement>document.querySelector("#x-max-priority");
}

function subscribe(): void {
  console.log("Subscribing...");
  setSubscription();
  let subscribeHeaders: StompHeaders = {};

  if (!(subPersistent.value == null || subPersistent.value === "")) {
    subscribeHeaders["persistent"] = subPersistent.value;
  }
  if (!(exclusive.value == null || exclusive.value === "")) {
    subscribeHeaders["exclusive"] = exclusive.value;
  }
  if (!(autoDelete.value == null || autoDelete.value === "")) {
    subscribeHeaders["auto-delete"] = autoDelete.value;
  }
  if (!(prefetchCount.value == null || prefetchCount.value === "")) {
    subscribeHeaders["prefetch-count"] = prefetchCount.value;
  }
  if (!(queueName.value == null || queueName.value === "")) {
    subscribeHeaders["x-queue-name"] = queueName.value;
  }
  if (!(queueType.value == null || queueType.value === "")) {
    subscribeHeaders["x-queue-type"] = queueType.value;
  }
  if (!(deadLetterExchange.value == null || deadLetterExchange.value === "")) {
    subscribeHeaders["x-dead-letter-exchange"] = deadLetterExchange.value;
  }
  if (
    !(deadLetterRoutingKey.value == null || deadLetterRoutingKey.value === "")
  ) {
    subscribeHeaders["x-dead-letter-routing-key"] = deadLetterRoutingKey.value;
  }
  if (!(expires.value == null || expires.value === "")) {
    subscribeHeaders["x-expires"] = expires.value;
  }
  if (!(messageTtl.value == null || messageTtl.value === "")) {
    subscribeHeaders["x-message-ttl"] = messageTtl.value;
  }
  if (!(maxLength.value == null || maxLength.value === "")) {
    subscribeHeaders["x-max-length"] = maxLength.value;
  }
  if (!(maxLengthBytes.value == null || maxLengthBytes.value === "")) {
    subscribeHeaders["x-max-length-bytes"] = maxLengthBytes.value;
  }
  if (!(overflow.value == null || overflow.value === "")) {
    subscribeHeaders["x-overflow"] = overflow.value;
  }
  if (!(maxPriority.value == null || maxPriority.value === "")) {
    subscribeHeaders["x-max-priority"] = maxPriority.value;
  }
  try {
    stompClient.subscribe(
      subDestination.value,
      (msg) => {
        console.log(`Message received! Message content is:`);
        console.log(msg);
      },
      subscribeHeaders
    );
  } catch (e) {
    console.log("Error on subscribe:");
    console.log(e);
  }
}

subButton.onclick = subscribe;

/*
class RabbitStompPublish {
  private destination: HTMLInputElement;
  private message: HTMLInputElement;
  private replyTo: HTMLInputElement;
  private durable: HTMLInputElement;
  private exclusive: HTMLInputElement;
  private autoDelete: HTMLInputElement;
  private persistent: HTMLInputElement;
  private contentType: HTMLInputElement;
  private contentEncoding: HTMLInputElement;
  private headers: HTMLInputElement;
  private deliveryMode: HTMLInputElement;
  private priority: HTMLInputElement;
  private correlationId: HTMLInputElement;
  private expiration: HTMLInputElement;
  private messageId: HTMLInputElement;
  private timestamp: HTMLInputElement;
  private type: HTMLInputElement;
  private userId: HTMLInputElement;
  private appId: HTMLInputElement;
  private publishMessage: HTMLButtonElement;

  constructor(
    destination: HTMLInputElement,
    message: HTMLInputElement,
    replyTo: HTMLInputElement,
    durable: HTMLInputElement,
    exclusive: HTMLInputElement,
    autoDelete: HTMLInputElement,
    persistent: HTMLInputElement,
    contentType: HTMLInputElement,
    contentEncoding: HTMLInputElement,
    headers: HTMLInputElement,
    deliveryMode: HTMLInputElement,
    priority: HTMLInputElement,
    correlationId: HTMLInputElement,
    expiration: HTMLInputElement,
    messageId: HTMLInputElement,
    timestamp: HTMLInputElement,
    type: HTMLInputElement,
    userId: HTMLInputElement,
    appId: HTMLInputElement,
    publishMessage: HTMLButtonElement
  ) {
    this.destination = destination;
    this.message = message;
    this.replyTo = replyTo;
    this.durable = durable;
    this.exclusive = exclusive;
    this.autoDelete = autoDelete;
    this.persistent = persistent;
    this.contentType = contentType;
    this.contentEncoding = contentEncoding;
    this.headers = headers;
    this.deliveryMode = deliveryMode;
    this.priority = priority;
    this.correlationId = correlationId;
    this.expiration = expiration;
    this.messageId = message;
    this.timestamp = timestamp;
    this.type = type;
    this.userId = userId;
    this.appId = appId;
    this.publishMessage = publishMessage;
    this.publishMessage.onclick = this.publish;
  }

  publish() {
    let publishMessagePayload = {
      // Como enviar mensagens para o Rabbit?
      // https://www.rabbitmq.com/stomp.html
      destination: this.destination.value,
      body: this.message.value
      // binaryBody:,
      // headers: {},
      // skipContentLengthHeader
    };
    stompClient.publish(publishMessagePayload);
  }
}
*/
