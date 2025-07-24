"use client"
import React, { useState } from 'react';
import Head from 'next/head';
import RegisterTab from './components/RegisterTab';
import SearchTab from './components/SearchTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('register'); // 'register' or 'search'

  return (
    // 整体白色背景
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Head>
        <title>人脸识别 Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Appbar - 白色背景，底部边框，轻微阴影 */}
      <nav className="bg-white p-4 shadow-sm border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-gray-800 text-2xl font-bold">人脸识别系统</h1>
          <a
            href="https://github.com/your-repo" // 可以替换为你的项目GitHub地址
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition duration-300"
          >
            GitHub
          </a>
        </div>
      </nav>

      <main className="container mx-auto p-4 mt-8 max-w-4xl">
        {/* Tabs - 简约按钮风格 */}
        <div className="flex justify-center mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-6 py-3 text-lg font-semibold transition-colors duration-300 focus:outline-none
              ${activeTab === 'register' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-500 hover:border-blue-300'}`}
          >
            注册图片
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-3 text-lg font-semibold transition-colors duration-300 focus:outline-none
              ${activeTab === 'search' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-500 hover:border-blue-300'}`}
          >
            搜索
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'register' && <RegisterTab />}
          {activeTab === 'search' && <SearchTab />}
        </div>
      </main>

      {/* Footer (可选) */}
      <footer className="w-full text-center p-4 mt-12 text-gray-500 text-sm">
        <p>&copy; 2023 人脸识别 Demo. All rights reserved.</p>
      </footer>
    </div>
  );
}