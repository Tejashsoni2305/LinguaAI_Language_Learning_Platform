import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store your API key securely in environment variables
});

export const POST = async (req) => {
  try {
    // Parse the request body to extract the user's message
    const { conversation } = await req.json();

      if (!conversation || !Array.isArray(conversation)) {
        return new Response(
          JSON.stringify({ error: "Conversation array is required" }),
          { status: 400 }
        );
      }


    // Call the OpenAI API to generate a response
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // The model to use
      messages: conversation, // The conversation history
    });

    // Extract the response message
    const aiResponse = completion.choices[0].message.content;

    return new Response(
      JSON.stringify(aiResponse)
    )
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500 }
    );
  }
};
