const amqp = require('amqplib')

const post = async ({ msg }) => {
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
        await channel.publish(nameExchange, '', Buffer.from(msg))
        setTimeout(function () {
            connection.close()
            process.exit(0)
        }, 2000)
    } catch (error) {
        console.error(error)
    }
}
const msg = process.argv.slice(2).join(' ') || 'Hello Exchange'
post({ msg })