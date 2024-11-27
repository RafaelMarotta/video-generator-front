import axios from 'axios';

export const requestGenerateVideo = async (requestData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_GENERATE_VIDEO_URI}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      });
  
      return response.data;
    } catch (error) {
      console.error('Error generating video:', error.response?.data || error.message);
      throw new Error('Erro ao gerar vídeo');
    }
  };
  