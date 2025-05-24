import config from "../config";

class ImageService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  async uploadImage(file: File): Promise<{ filename: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      filename: data.filename,
      url: `${this.baseUrl}/image/${data.filename}`,
    };
  }

  getImageUrl(filename: string): string {
    return `${this.baseUrl}/image/${filename}`;
  }
}

export const imageService = new ImageService(); 