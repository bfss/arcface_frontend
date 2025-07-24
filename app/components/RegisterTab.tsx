"use client"
import React, { useState, useRef } from 'react';

const RegisterTab = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setMessage('');
    } else {
      setSelectedImage(null);
      setImagePreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setMessage('请先选择一张图片。');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('正在注册人脸...');

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://localhost:8080/api/face/register', {
        method: 'POST',
        body: formData,
      });

      const textResponse = await response.text();

      if (response.ok) {
        setMessage(`注册成功: ${textResponse}`);
        setIsSuccess(true);
        // setSelectedImage(null);
        // setImagePreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setMessage(`注册失败: ${textResponse}`);
        setIsSuccess(false);
      }
    } catch (error: any) {
      setMessage(`注册请求失败: ${error.message}`);
      setIsSuccess(false);
      console.error('注册请求错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">注册人脸</h2> {/* 标题居中 */}
      {/* 消息显示 */}

      {message && (
        <p className={`mt-6 p-3 rounded-md text-sm text-center  ${isSuccess ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
          {message}
        </p>
      )}

      {/* 文件选择按钮 */}
      <div className="mb-6 mt-4">
        <input
          type="file"
          id="search-image-input"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2.5 px-4 rounded-md font-semibold transition duration-300 text-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {selectedImage ? selectedImage.name : '选择图片...'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row mt-8 md:space-x-8 space-y-6 md:space-y-0 justify-center"> 
        <div className="md:w-1/2 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">待注册图片:</h3>
          <div className="w-64 h-64 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
            {imagePreviewUrl ? (
              <img src={imagePreviewUrl} alt="图片预览" className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-400 text-sm">图片预览</span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || !selectedImage}
        className={`w-full mt-4 py-2.5 px-4 rounded-md font-semibold transition duration-300 text-lg
          ${isLoading
            ? 'bg-blue-300 cursor-not-allowed text-white'
            : !selectedImage
              ? 'border border-gray-300 text-gray-400 bg-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
      >
        {isLoading ? '注册中...' : '注册'}
      </button>
    </div>
  );
};

export default RegisterTab;