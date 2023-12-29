const amqp = require('amqplib')

const sendEmail = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()
        const nameExchange = 'send_email'

        await channel.assertExchange(nameExchange, 'topic', {
            durable: false
        })
        const agrs = process.argv.slice(2);
        const msg = agrs[1] || "Fixed !!"
        const topic = agrs[0]
        console.log(`msg::: ${msg}----topic:::${topic}`);
        await channel.publish(nameExchange, topic, Buffer.from(msg))
        setTimeout(function () {
            connection.close()
            process.exit(0)
        }, 2000)
    } catch (error) {
        console.error(error)
    }
}
sendEmail()