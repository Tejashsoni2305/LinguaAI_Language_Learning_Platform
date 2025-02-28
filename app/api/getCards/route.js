import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req) => {
  try {
    const { primary, target, recentWords } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: `Generate 4 vocabulary cards for learning ${target} language in JSON format ONLY with the following fields: Word, Meaning, Pronunciation, ExampleUse, Translation, Explanation. Do not include any explanation or text outside the JSON array.
          The primary language is ${primary} so make sure to include meaning in ${primary}. The words should be always beginner and intermediate level and the ExampleUse should be in ${target} and Translation should be in ${primary}. For Explanation, provide translation of each word in ${primary} and show by a '+' sign how all the words formed the sentence.
          The latest last 15 or fewer words reviewed by user are ${recentWords} so any of the new cards should not be same or equal as these words.`,
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
