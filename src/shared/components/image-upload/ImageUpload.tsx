import { Card, CardBody } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';

import { validateFile } from '../../utils/imageUploadUtils';

import ImageUploadHeader from './ImageUploadHeader';
import ImageUploadPreview from './ImageUploadPreview';
import ImageUploadDropArea from './ImageUploadDropArea';
import ImageUploadError from './ImageUploadError';

interface Props {
  currentImage: string;
  onImageChange: (file: File | null, previewUrl: string | null) => void;
}

export const ImageUpload: React.FC<Props> = ({
  currentImage,
  onImageChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentImage);
  }, [currentImage]);

  const handleFileSelect = (file: File) => {
    setError('');

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageChange(file, url);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setError('');
    onImageChange(null, null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const shouldShowImage = previewUrl !== null && previewUrl !== '';

  return (
    <div className="space-y-6">
      <ImageUploadHeader
        shouldShowImage={shouldShowImage}
        onRemoveImage={handleRemoveImage}
      />

      <Card className="border border-zinc-700/50 bg-zinc-800/30">
        <CardBody className="p-6">
          {shouldShowImage ? (
            <ImageUploadPreview
              previewUrl={previewUrl!}
              onChangeImage={handleButtonClick}
            />
          ) : (
            <ImageUploadDropArea
              isDragging={isDragging}
              error={error}
              onClick={handleButtonClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.gif"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardBody>
      </Card>

      <ImageUploadError error={error} />
    </div>
  );
};

export default ImageUpload;
