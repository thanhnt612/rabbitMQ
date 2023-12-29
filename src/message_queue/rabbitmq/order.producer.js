const amqp = require('amqplib')

const orderProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()
        const queueName = 'order-queue-message'
        await channel.assertQueue(queueName, {
            durable: true
        })
        for (let i = 0; i < 10; i++) {
            const message = `order-queue-message::${i}`
            console.log(`message:${message}`);
            channel.sendToQueue(queueName, Buffer.from(message), {
                persistent: true
            })
        }
        setTimeout(() => {
            connection.close()
        }, 500)
    } catch (error) {
        console.error(error);
    }
}

orderProducer().then(result => console.log(result)).catch(console.error)