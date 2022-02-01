const amqp = require('amqp-connection-manager');

const QUEUE_NAME = 'demo.queue';

function getId() {
  return Math.floor(
    Math.random() * (999 - 100) + 100
  )
}

function delay(timeout) {
  const defaulDelay = timeout || 1000;
  return new Promise((resolve, reject) => {
    const tm = setTimeout(() => {
      resolve(0);
    }, defaulDelay);
  });
}

function setup(channel) {
  return Promise.all([
    channel.assertQueue(QUEUE_NAME, { durable: true, autoDelete: false, exclusive: false }),
    channel.bindQueue(QUEUE_NAME, 'amq.direct')
  ]);
}

async function produce() {
  // rabbitmq-policy-stage1-phbroker.stag.bolttechbroker.net
  // localuser:localpass@rabbitmq-policy-rc-phbroker.stag.bolttechbroker.net:5672
  const conn = amqp.connect(['amqp://localhost:5672'], {
    heartbeatIntervalInSeconds: 10,
    reconnectTimeInSeconds: 5,
  });

  conn.on('connect', () => { console.log('Connected on broker.')});

  const channel = conn.createChannel({
    name: 'demo',
    confirm: true,
    json: true,
    setup,
  });

  await send(channel);

  channel.close();
  conn.close();
  process.exit(0);
}



async function send(channel) {
  for(let idx=0; idx < 5; idx++) {
    await channel.sendToQueue(QUEUE_NAME, { id: getId(), msg:'Hello Tau!', time: Date.now() });
    console.log('Message sent.');
    await delay();
  }
}

produce();
