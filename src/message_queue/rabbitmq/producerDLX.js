const amqp = require('amqplib')
const message = 'hello, RabbitMQ'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()
        const notificationEx = 'notificationEx' // NotificationEx direct
        const notificationQueue = 'notificationQueue' //assertQueue
        const notificationExDLX = 'notificationExDLX' //notificationEX direct when message process error
        const notificationRoutingKeyExDLX = 'notificationRoutingKeyExDLX' //asert

        //Create Exchange
        await channel.assertExchange(notificationEx, 'direct', {
            durable: true
        })

        //Create Queue
        const queueResult = await channel.assertQueue(notificationQueue, {
            exclusive: false, //Allow all connection to the same queue
            deadLetterExchange: notificationExDLX,
            deadLetterRoutingKey: notificationRoutingKeyExDLX
        })

        //Bind Queue
        await channel.bindQueue(queueResult.queue, notificationEx)

        //Send message
        const msg = 'New Product'
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })

        setTimeout(() => {
            connection.close()
            process.exit(0);
        }, 500)
    } catch (error) {
        console.error(error);
    }
}

runProducer().then(result => console.log(result)).catch(console.error)
