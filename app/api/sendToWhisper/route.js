import OpenAI from "openai";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's body parsing
  },
};

const pipelineAsync = promisify(pipeline);

export async function POST(req) {
  try {
    // Ensure the tmp directory exists
    const tmpDir = "./tmp";
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    // Define the temporary file path
    const filePath = `${tmpDir}/uploaded-audio.wav`;

    // Write the incoming stream to the temporary file
    await pipelineAsync(req.body, fs.createWriteStream(filePath));

    // Send the file to OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      response_format: "text",
    });

    // Clean up the temporary file
    fs.unlinkSync(filePath);

    return new Response(JSON.stringify({ transcription }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing audio:", error);

    return new Response(
      JSON.stringify({ error: "Failed to process the audio" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
