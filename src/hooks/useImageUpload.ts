import { useState, useRef } from 'react';
import { imageService } from '../services/imageService';

interface UploadedImage {
  filename: string;
  url: string;
}

export function useImageUpload() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    try {
      setIsLoading(true);
      const result = await imageService.uploadImage(file);
      setUploadedImage(result);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
  };

  return {
    uploadedImage,
    isLoading,
    fileInputRef,
    handleImageUpload,
    clearUploadedImage
  };
} 