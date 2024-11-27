import axios from 'axios';
import 'dotenv/config';


export const requestOpenAI = async (userPrompt) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_OPENAI_URI}`,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response?.data || error.message);
    throw error;
  }
};
