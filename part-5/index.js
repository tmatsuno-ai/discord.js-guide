const discord = require("discord.js");
const client = new discord.Client({
    intents: Object.values(discord.GatewayIntentBits)
});

const CATEGORY_ID = "1512456858294812713";


client.once(discord.Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const commands = [
        new discord.SlashCommandBuilder()
            .setName("ticket")
            .setDescription("チケットパネルを作成")
            .addStringOption(option => option
                .setName("タイトル")
                .setDescription("チケットのタイトル")
            )
            .addStringOption(option => option
                .setName("説明")
                .setDescription("チケットの説明")
            )
            .addStringOption(option => option
                .setName("ボタン")
                .setDescription("ボタンに表示するラベル")
            )
            .setDefaultMemberPermissions(
                discord.PermissionFlagsBits.Administrator
            )
    ];
    await client.application.commands.set(commands);
});

client.on(discord.Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand() && interaction.commandName === "ticket") {
        const title = interaction.options.getString("タイトル") ?? "🎫 チケット";
        const desc = interaction.options.getString("説明") ?? "ボタンを押してチケットを作成してください。";
        const label = interaction.options.getString("ボタン") ?? "チケットを作成";

        const embed = new discord.EmbedBuilder()
            .setColor(discord.Colors.Blue)
            .setTitle(title)
            .setDescription(desc);

        const row = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId("ticket-create")
                .setLabel(label)
                .setStyle(discord.ButtonStyle.Primary)
        );

        return interaction.reply({ embeds: [embed], components: [row] });
    }

    if (interaction.isButton() && interaction.customId.startsWith("ticket-create")) {
        const channel = await interaction.guild.channels.create({
            name: "ticket-" + interaction.user.username, parent: CATEGORY_ID, type: discord.ChannelType.GuildText, permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [
                        discord.PermissionFlagsBits.ViewChannel
                    ]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        discord.PermissionFlagsBits.ViewChannel, discord.PermissionFlagsBits.ReadMessageHistory, discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.AttachFiles
                    ]
                },
            ]
        });

        const embed = new discord.EmbedBuilder().setColor(discord.Colors.Blue).setTitle("サポート").setDescription("スタッフをお待ちください。");

        const row = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder().setCustomId("ticket-close").setLabel("チケットを削除").setStyle(discord.ButtonStyle.Danger)
        );

        await channel.send({ embeds: [embed], components: [row] });

        return interaction.reply({ content: `チケットを作成しました: ${channel}`, ephemeral: true });
    }

    if (interaction.isButton() && interaction.customId === "ticket-close") {
        const embed = new discord.EmbedBuilder().setColor(discord.Colors.Red).setTitle("🗑️ チケット削除").setDescription("5秒後にチケットを削除します。");

        await interaction.reply({ embeds: [embed] });

        setTimeout(() => interaction.channel.delete(), 5000);


    }
});

client.login("BOTトークン");
