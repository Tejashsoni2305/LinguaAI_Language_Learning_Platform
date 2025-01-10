import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store your API key securely in environment variables
});


export const POST = async (req, res) => {
    const { history, lastFeedback, lastPercentage, primaryLanguage, language } = await req.json();
    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo", // The model to use
            messages: [{
                role: "user",
                content: `give a personal progress report for the user based on the conversation history, last feedback, and last percentage progress as you are the language tutor. The user's primary language is ${primaryLanguage} and learning language is ${language}.
                    the conversation history is ${history} and these are with timestamps to track user's time spent so you can provide better feedback, the last feedback you provided is ${lastFeedback}, and the last percentage progress you provided is ${lastPercentage}. the history, last feedback 
                    and last percent progress and can be short or empty is the user is new to service. Provide a exclusive, professional and personalized feedback, a new lastest-percentage with reference to the ${lastPercentage} from this data so that the user can improve 
                    and in feedback act like a tutor to give user positives user has and areas to improve and anything which a personalized tutor provides but it should be a little bit consise.
                    provide the response in ${primaryLanguage} language in this format only: latest-feedback: <feedback>, latest-percentage: <percentage>(just number no sign)`
            }] 
        });
        const aiResponse = completion.choices[0].message.content;
        console.log(aiResponse);
        return new Response(
            JSON.stringify({ aiResponse }),
            { headers: { "Content-Type": "application/json" } }
          );
    } catch (error) {
      console.error("Error with OpenAI API: in progress report", error);
      return new Response(
        JSON.stringify({ error: "Failed to generate response" }),
        { status: 500 }
      );
    }
    
}