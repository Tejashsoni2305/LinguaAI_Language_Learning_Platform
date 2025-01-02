import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const GET = async () => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "user",
                    content: "Generate 8 vocabulary cards in English language in JSON format ONLY with the following fields: Word, Meaning, Pronunciation, ExampleSentence. Do not include any explanation or text outside the JSON array.",
                },
            ],
        });

        let aiResponse;
        try {
            const content = completion.choices[0].message.content;

            // Extract JSON array
            const jsonMatch = content.match(/\[.*\]/s); // Matches the JSON array
            if (!jsonMatch) {
                throw new Error("JSON array not found in OpenAI response.");
            }

            aiResponse = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
            console.error("Failed to parse JSON:", parseError);
            throw new Error("Invalid JSON format in OpenAI response.");
        }

        // Return the response
        return new Response(JSON.stringify(aiResponse), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate response" }),
            { status: 500 }
        );
    }
};
