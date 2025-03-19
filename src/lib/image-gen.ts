import axios from 'axios';

interface ImageGenerationOptions {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numImages?: number;
  model?: string;
}

interface ImageGenerationResponse {
  images: string[];
  metadata: {
    model: string;
    prompt: string;
    negativePrompt?: string;
    width: number;
    height: number;
    timestamp: string;
  };
}

class ImageGenerator {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private defaultModel = 'stabilityai/stable-diffusion-xl-base-1.0';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate images from text prompt using specified model
   */
  async generateImages(options: ImageGenerationOptions): Promise<ImageGenerationResponse> {
    const {
      prompt,
      negativePrompt = '',
      width = 1024,
      height = 1024,
      numImages = 1,
      model = this.defaultModel
    } = options;

    try {
      const response = await axios.post(
        `${this.baseUrl}/images/generations`,
        {
          model,
          prompt,
          negative_prompt: negativePrompt,
          width,
          height,
          n: numImages,
          response_format: 'b64_json'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/yourusername/your-repo', // Replace with your repo
            'X-Title': 'One52Bar Image Generator' // Replace with your app name
          }
        }
      );

      return {
        images: response.data.data.map((item: any) => item.b64_json),
        metadata: {
          model,
          prompt,
          negativePrompt,
          width,
          height,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error generating images:', error);
      throw error;
    }
  }

  /**
   * Get list of available text-to-image models
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/models`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data
        .filter((model: any) => model.object === 'model' && model.capabilities?.includes('text-to-image'))
        .map((model: any) => model.id);
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }

  /**
   * Save generated images to local filesystem
   */
  async saveImages(images: string[], outputDir: string): Promise<string[]> {
    const fs = require('fs');
    const path = require('path');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const savedPaths = await Promise.all(
      images.map(async (base64Image, index) => {
        const buffer = Buffer.from(base64Image, 'base64');
        const filename = `generated_${Date.now()}_${index}.png`;
        const filepath = path.join(outputDir, filename);
        
        await fs.promises.writeFile(filepath, buffer);
        return filepath;
      })
    );

    return savedPaths;
  }
}

// Example usage:
/*
const generator = new ImageGenerator('your-openrouter-api-key');

// Generate images
const result = await generator.generateImages({
  prompt: 'A cozy Irish pub interior with warm lighting and wooden decor',
  negativePrompt: 'modern, bright, neon',
  width: 1024,
  height: 1024,
  numImages: 1
});

// Save images
const savedPaths = await generator.saveImages(result.images, './output');
console.log('Saved images to:', savedPaths);
*/

export default ImageGenerator; 