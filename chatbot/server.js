// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a route to handle chat messages
app.post('/api/chat', async (req, res) => {
    const { input } = req.body;

    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: 'You are EMSBOT, a friendly chatbot assistant...',
    });

    const chatSession = model.startChat({
        generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: 'text/plain',
        },
        history: [],
    });

    const result = await chatSession.sendMessage(input);
    res.json({ output: result.response.text() });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
