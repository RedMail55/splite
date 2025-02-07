const Command = require('../Command.js');
const {MessageEmbed} = require('discord.js');
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

module.exports = class pickupCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pickup',
            usage: 'pickup',
            aliases: ['compliment'],
            description: 'Create a pickup line and send it to someone',
            type: client.types.FUN,
            examples: ['pickup @split'],
        });
    }

    async run(message, args) {
        const member =
            (await this.getGuildMember(message.guild, args.join(' '))) || message.author;
        try {
            const res = await fetch('http://www.pickuplinegen.com/');
            const pickup = await res.text();
            const dom = new JSDOM(pickup);
            let line = dom.window.document.getElementById('content').textContent;
            line = line.trim();

            const embed = new MessageEmbed()
                .setAuthor({
                    name: 'Pickup lines used at your own risk',
                    iconURL: this.getAvatarURL(member),
                })
                .setDescription(`<@${member.id}>,|| ${line} ||`)
                .setFooter({
                    text: message.member.displayName,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setTimestamp()
                .setColor(message.guild.me.displayHexColor);
            message.channel.send({embeds: [embed]});
        }
        catch (err) {
            message.client.logger.error(err.stack);
            this.sendErrorMessage(
                message,
                1,
                'Please try again in a few seconds',
                err.message
            );
        }
    }
};
