const amqp = require('amqplib')

const receive = async () => {
    try {
        //Create Connect
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        //Create channel
        const channel = await connection.createChannel()
        //Create exchange
        const nameExchange = 'video'

        await channel.assertExchange(nameExchange, 'fanout', {
            durable: true
        })

        //Create queue
        const { queue } = await channel.assertQueue('', {
            exclusive: true
        })//Name Queue
        console.log(`NameQueue:::`, queue);
        //Binding 
        await channel.bindQueue(queue, nameExchange, '')
        await channel.consume(queue, msg => {
            console.log(`msg:::`, msg.content.toString());
        }, {
            noAck: true
        })
    } catch (error) {
        console.error(error)
    }
}
receive()