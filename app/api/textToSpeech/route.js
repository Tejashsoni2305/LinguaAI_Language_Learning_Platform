import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your API key
});

export const POST = async (req) => {
  try {
    const { text } = await req.json(); // Get the text to convert to speech
    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
      });
    }

    const audioResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", 
      input: text,
    });

    const audioBuffer = await audioResponse.arrayBuffer(); // Convert to ArrayBuffer
    return new Response(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" }, // Return as MP3
      status: 200,
    });
  } catch (error) {
    console.error("Error with TTS API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate speech" }),
      { status: 500 }
    );
  }
};
