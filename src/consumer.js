const amqp = require('amqp-connection-manager');

const EXCHANGE_NAME = 'amq.direct';
const QUEUE_NAME = 'demo.queue';

function onMessage(channel) {
  return function(data) {
    const message = JSON.parse(data.content.toString());
    console.log("Got message", message);
    channel.ack(data);
  }
}

function setup(channel) {
  return Promise.all([
    channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true, autoDelete: false, internal: false }),
    channel.prefetch(1),
    channel.consume(QUEUE_NAME, onMessage(channel), )
  ]);
}

async function process() {
  const conn = amqp.connect(['amqp://localhost:5672'], {
    heartbeatIntervalInSeconds: 10,
    reconnectTimeInSeconds: 5,
  });

  conn.on('connect', () => { console.log('Connected on broker.')});

  const channel = conn.createChannel({
    name: 'consumer-channel',
    confirm: true,
    json: true,
    setup,
  });

  await channel.waitForConnect();
}

process();
