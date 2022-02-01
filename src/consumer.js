const amqp = require('amqp-connection-manager');

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
    channel.assertQueue(QUEUE_NAME, { durable: true, autoDelete: false, exclusive: false }),
    channel.prefetch(1),
    channel.consume(QUEUE_NAME, onMessage(channel))
  ]);
}

function process() {
  const conn = amqp.connect(['amqp://localhost:5672'], {
    heartbeatIntervalInSeconds: 10,
    reconnectTimeInSeconds: 5,
  });

  conn.on('connect', () => { console.log('Connected on broker.')});

  conn.createChannel({
    name: 'demo-consumer',
    confirm: true,
    json: true,
    setup,
  });
}

process();
