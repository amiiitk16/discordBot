import { Client } from "discord.js";
import { Events } from "discord.js";
import { GatewayIntentBits } from "discord.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'
// import config from './config.json' assert { type: 'json' };
// import token from "./config.json" assert { type: 'json' };

dotenv.config()

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_KEY
});


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

client.on("clientReady",() =>{
    console.log("Bot Online")
})

client.on("messageCreate",async(message) => {
    if (message.author.bot) return

        if(message.content.toLowerCase() === "astro")
            message.reply({
            content: "Hey, Astro here"
        })
    
        if(message.content.startsWith("!ask")) {
        const query = message.content.replace("!ask", "").trim()
    
        if(!query){
            message.reply({
                content: "You have not entered the question"
            })
            return}
    
        message.reply({
            content: `You have asked ${query}`
        })    
    
    
        try {
            await message.channel.sendTyping();
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{ type: "text", text: query }],
                systemInstruction: "You are a highly intelligent and helpful assistant. Keep the answers short under 2000 words and Simple."
            });
            
            const textRes = response.candidates[0].content.parts[0].text;
            
            
            await message.reply({
                content: textRes.slice(0, 2000) || "No response from model."
            });
            
            
        } 
        catch (error) {
            console.error("AI Error:", error);
            await message.reply("Something went wrong while generating a response.");
        }
    }
})
  
client.login(process.env.DISCORD_SECRET)