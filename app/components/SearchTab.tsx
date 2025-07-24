"use client"
import React, { useState, useRef } from 'react';

const BASE_IMAGE_URL = 'http://localhost:8080/uploads/';

interface SearchResultData {
  success: boolean;
  imagePath?: string;
}

const SearchTab = () => {
  const [selectedSearchImage, setSelectedSearchImage] = useState<File | null>(null);
  const [searchImagePreviewUrl, setSearchImagePreviewUrl] = useState<string | null>(null);
  const [matchedImageWebUrl, setMatchedImageWebUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResultData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearchImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedSearchImage(file);
      setSearchImagePreviewUrl(URL.createObjectURL(file));
      setMatchedImageWebUrl(null);
      setMessage('');
      setSearchResult(null);
    } else {
      setSelectedSearchImage(null);
      setSearchImagePreviewUrl(null);
    }
  };

  const handleSearch = async () => {
    if (!selectedSearchImage) {
      setMessage('请先选择一张图片进行搜索。');
      return;
    }

    setIsLoading(true);
    setMessage('正在搜索人脸...');

    const formData = new FormData();
    formData.append('image', selectedSearchImage);

    try {
      const response = await fetch('http://localhost:8080/api/face/search', {
        method: 'POST',
        body: formData,
      });

      const data: SearchResultData = await response.json();

      if (response.ok && data.success) {
        setSearchResult(data);
        setMessage(`搜索成功！`);

        if (data.imagePath) {
          const filename = data.imagePath.split('/').pop()?.split('\\').pop();
          if (filename) {
            setMatchedImageWebUrl(`${BASE_IMAGE_URL}${filename}`);
          } else {
            setMatchedImageWebUrl(null);
            setMessage('搜索成功但无法解析匹配图片的URL。');
          }
        } else {
          setMatchedImageWebUrl(null);
          setMessage('搜索成功但未返回匹配图片的路径。');
        }


      } else {
        setMessage(`搜索失败`);
        setMatchedImageWebUrl(null);
        setSearchResult(null);
      }
    } catch (error: any) {
      setMessage(`搜索请求失败: ${error.message}`);
      setMatchedImageWebUrl(null);
      setSearchResult(null);
      console.error('搜索请求错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">搜索人脸</h2> {/* 标题居中 */}

      {/* 消息显示 */}
      {message && (
        <p className={`mt-6 p-3 rounded-md text-sm text-center ${searchResult?.success ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
          {message}
        </p>
      )}

      {/* 文件选择按钮 */}
      <div className="mb-6 mt-4">
        <input
          type="file"
          id="search-image-input"
          accept="image/*"
          onChange={handleSearchImageChange}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2.5 px-4 rounded-md font-semibold transition duration-300 text-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          {selectedSearchImage ? selectedSearchImage.name : '选择图片进行搜索...'}
        </button>
      </div>

      {/* 左右图片排列，固定大小 (现在整个块都在按钮上方) */}
      <div className="flex flex-col md:flex-row mt-8 md:space-x-8 space-y-6 md:space-y-0 justify-center"> {/* justify-center 让整个图片行居中 */}
        {/* 左侧：待搜索图片 */}
        <div className="md:w-1/2 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">待搜索图片:</h3>
          <div className="w-64 h-64 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
            {searchImagePreviewUrl ? (
              <img src={searchImagePreviewUrl} alt="待搜索图片" className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-400 text-sm">选择图片预览</span>
            )}
          </div>
        </div>

        {/* 右侧：匹配结果图片 */}
        <div className="md:w-1/2 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">匹配结果图片:</h3>
          <div className="w-64 h-64 border border-blue-400 rounded-lg overflow-hidden flex items-center justify-center bg-blue-50">
            {matchedImageWebUrl ? (
              <img src={matchedImageWebUrl} alt="匹配结果图片" className="w-full h-full object-contain" />
            ) : (
              <span className="text-blue-300 text-sm">等待匹配结果</span>
            )}
          </div>
        </div>
      </div>

      {/* 搜索按钮 */}
      <button
        onClick={handleSearch}
        disabled={isLoading || !selectedSearchImage}
        className={`w-full mt-4 py-2.5 px-4 rounded-md font-semibold transition duration-300 text-lg
          ${isLoading
            ? 'bg-green-300 cursor-not-allowed text-white'
            : !selectedSearchImage
              ? 'border border-gray-300 text-gray-400 bg-white cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
      >
        {isLoading ? '搜索中...' : '搜索'}
      </button>
    </div>
  );
};

export default SearchTab;