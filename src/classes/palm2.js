const { GooglePaLM } = require("langchain/llms/googlepalm");

const loadModel = async () => {
    const model = new GooglePaLM({
        apiKey: process.env["GOOGLE_PALM_API_KEY"], // or set it in environment variable as `GOOGLE_PALM_API_KEY`
        // other params
        temperature: 1, // OPTIONAL
        modelName: "models/text-bison-001", // OPTIONAL
        maxOutputTokens: 1024, // OPTIONAL
        topK: 40, // OPTIONAL
        topP: 1, // OPTIONAL
        safetySettings: [
            // OPTIONAL
            {
                category: "HARM_CATEGORY_DANGEROUS",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
        ],
        stopSequences: ["stop"], // OPTIONAL
    });

    return model;
}

const runModel = async (question) => {
    const model = new GooglePaLM({
        apiKey: process.env["GOOGLE_PAL2_API_KEY"], // or set it in environment variable as `GOOGLE_PALM_API_KEY`
        // other params
        temperature: 1, // OPTIONAL
        modelName: "models/text-bison-001", // OPTIONAL
        maxOutputTokens: 1024, // OPTIONAL
        topK: 40, // OPTIONAL
        topP: 1, // OPTIONAL
        safetySettings: [
            // OPTIONAL
            {
                category: "HARM_CATEGORY_DANGEROUS",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
        ],
        stopSequences: ["stop"], // OPTIONAL
    });

    const res = await model.call(
        question
    );

    return { res };
};

module.exports = {
    runModel,
    loadModel,
}