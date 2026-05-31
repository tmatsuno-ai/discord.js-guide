const discord = require('discord.js');
const client = new discord.Client({
    intents: Object.values(discord.GatewayIntentBits)
});

const rolesMap = {
    role1: 'ロールID1', // VCメンションロール
    role2: 'ロールID2', // お知らせ通知ロール
    role3: 'ロールID3', // 成人済みロール
    role4: 'ロールID4', // 深夜勢ロール
}

client.on(discord.Events.ClientReady, async () => {
    console.log('Logged in as ' + client.user.tag);

    const commands = [
        new discord.SlashCommandBuilder()
            .setName('role')
            .setDescription('ロール取得パネルを表示')
    ];

    await client.application.commands.set(commands);
});

client.on(discord.Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'role') {

            const embed = new discord.EmbedBuilder()
                .setColor(discord.Colors.Green)
                .setTitle('ロール取得')
                .setDescription(
                    `1️⃣ <@&${rolesMap.role1}>\n` +
                    `2️⃣ <@&${rolesMap.role2}>\n` +
                    `3️⃣ <@&${rolesMap.role3}>\n` +
                    `4️⃣ <@&${rolesMap.role4}>`
                );

            const row = new discord.ActionRowBuilder().addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('role1')
                    .setStyle(discord.ButtonStyle.Primary)
                    .setEmoji('1️⃣'),

                new discord.ButtonBuilder()
                    .setCustomId('role2')
                    .setStyle(discord.ButtonStyle.Primary)
                    .setEmoji('2️⃣'),

                new discord.ButtonBuilder()
                    .setCustomId('role3')
                    .setStyle(discord.ButtonStyle.Primary)
                    .setEmoji('3️⃣'),

                new discord.ButtonBuilder()
                    .setCustomId('role4')
                    .setStyle(discord.ButtonStyle.Primary)
                    .setEmoji('4️⃣')
            );

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });
        }
    }

    // ボタン処理
    if (interaction.isButton()) {
        const member = interaction.member;

        const roleId = rolesMap[interaction.customId];

        const role = interaction.guild.roles.cache.get(roleId);

        if (!role) return;

        // ロールをすでに持っていたら削除、それ以外は付与する
        if (member.roles.cache.has(roleId)) {
            await member.roles.remove(role);
            await interaction.reply({ content: `<@&${roleId}> を外しました。`, ephemeral: true });
        } else {
            await member.roles.add(role);
            await interaction.reply({ content: `<@&${roleId}> を付与しました`, ephemeral: true });
        }
    }
});

client.login('BOTトークン');
