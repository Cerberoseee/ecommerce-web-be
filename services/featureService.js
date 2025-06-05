const axios = require('axios');
const Features = require('../models/featuresModel');

const createFeature = async (payload) => {
    try {
        const result = await axios.post(
            `${process.env.AI_AGENT_URL}/recommendations/get-embedding`,
            {
                text: payload.name,
                description: payload.description,
                manufacturer: payload.manufacturer,
            },
        );
        if (result.status === 200) {
            const responseData = result.data;
            const keywordsWithEmbedding = responseData.response;
            for (const keyword of keywordsWithEmbedding) {
                const feature = await Features.findOne({ name: keyword.name });
                if (!feature) {
                    await Features.create({
                        name: keyword.name,
                        embedding_vector: keyword.embedding_vector
                    });
                }
            }
            return keywordsWithEmbedding.map(keyword => keyword.name);
        } else {
            throw new Error('Failed to create features due to AI agent response');
        }

    } catch (error) {
        console.error('Error creating feature:', error);
        throw error;
    }
};

FeatureService = {
    createFeature
};

module.exports = FeatureService;