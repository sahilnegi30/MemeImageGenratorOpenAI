import express from 'express';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const router = express.Router();

const configuration = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAI(configuration);

router.route('/').get((req, res) => {
    res.send('Hello from DALL-E');
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log(prompt)
        const aiResponse = await openai.images.generate({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        });
        console.log('AI Response:', aiResponse);

        const image = aiResponse.data[0].b64_json;
        res.status(200).json({ photo: image });

    } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
            res.status(500).send(error.response.data.error.message);
        } else {
            res.status(500).send('Something went wrong');
        }
    }
});

export default router; 