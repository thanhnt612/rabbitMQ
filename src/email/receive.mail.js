const amqp = require('amqplib')

const receiveEmail = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()
        const nameExchange = 'send_email'

        await channel.assertExchange(nameExchange, 'topic', {
            durable: false
        })

        const { queue } = await channel.assertQueue('', {
            exclusive: true
        })

        const agrs = process.argv.slice(2);
        if (!agrs.length) {
            process.exit(0)
        }
        console.log(`queue ${queue}----topic:::${agrs}`);

        /**
             * - matches any character 
             # - matches any one or more words
         */
        agrs.forEach(async key => {
            await channel.bindQueue(queue, nameExchange, key)
        })
        await channel.consume(queue, msg => {
            console.log(`Routing key: ${msg.fields.routingKey}:::msg:::${msg.content.toString()}`);
        })

    } catch (error) {
        console.error(error)
    }
}
receiveEmail()