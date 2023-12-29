const amqp = require('amqplib')

const orderConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()
        const queueName = 'order-queue-message'
        await channel.assertQueue(queueName, {
            durable: true
        })

        //Set prefetch to 1 to ensure only one ack at a time
        channel.prefetch(1)
        
        channel.consume(queueName, msg => {
            const message = msg.content.toString()
            setTimeout(() => {
                console.log(`process:`, message);
                channel.ack(msg)
            }, Math.random() * 1000)
        })

    } catch (error) {
        console.error(error);
    }
}

orderConsumer().then(result => console.log(result)).catch(console.error)