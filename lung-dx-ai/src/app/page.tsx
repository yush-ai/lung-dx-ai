"use client";

// import Link from "next/link"; // 注释掉 Next.js Link 组件以避免 SSR 问题
import { useState, useRef } from "react";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const newFiles = Array.from(selectedFiles).filter(file => {
      // 支持的文件格式
      const supportedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/dicom', '.dcm'];
      const fileExtension = file.name.toLowerCase().split('.').pop();
      
      return supportedTypes.includes(file.type) || 
             fileExtension === 'dcm' || 
             fileExtension === 'dicom';
    });
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101a22] font-[Inter,sans-serif] text-gray-800 dark:text-gray-200">
      <div className="relative flex h-screen flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-800 px-10 py-4">
          <div className="flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="h-8 w-8 relative">
              <svg className="absolute inset-0 h-full w-full text-[#138aec]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C9.28 2 6.78 3.08 4.93 4.93C3.08 6.78 2 9.28 2 12C2 14.72 3.08 17.22 4.93 19.07C6.78 20.92 9.28 22 12 22C14.72 22 17.22 20.92 19.07 19.07C20.92 17.22 22 14.72 22 12C22 9.28 20.92 6.78 19.07 4.93C17.22 3.08 14.72 2 12 2ZM12 18C10.05 18 8.18 17.22 6.76 15.8C5.35 14.39 4.58 12.51 4.58 10.56C4.58 8.61 5.35 6.73 6.76 5.32C8.18 3.9 10.05 3.12 12 3.12C13.95 3.12 15.82 3.9 17.24 5.32C18.65 6.73 19.42 8.61 19.42 10.56C19.42 12.51 18.65 14.39 17.24 15.8C15.82 17.22 13.95 18 12 18Z" opacity="0.3"></path>
                <path d="M12 6C9.79 6 8 7.79 8 10C8 11.13 8.44 12.16 9.17 12.83L7 15H17L14.83 12.83C15.56 12.16 16 11.13 16 10C16 7.79 14.21 6 12 6ZM10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10Z"></path>
                <path d="M12 17C13.66 17 15 15.66 15 14H9C9 15.66 10.34 17 12 17Z"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold">AI肺部结节辅助诊断</h1>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
            <a className="hover:text-[#138aec] transition-colors cursor-pointer" href="#">技术说明</a>
            <a className="hover:text-[#138aec] transition-colors cursor-pointer" href="#">联系我们</a>
          </nav>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-2xl space-y-6">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">人工智能驱动的肺结节分析</h2>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                上传您的医学影像以获得即时分析。支持 DICOM、PNG 和 JPG 格式。
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#101a22] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div 
                className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-[#138aec] bg-[#138aec]/5' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-[#138aec] dark:hover:border-[#138aec]'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
              >
                <div className="text-5xl text-gray-400 dark:text-gray-500 mb-3">📁</div>
                <p className="mt-3 font-semibold text-gray-800 dark:text-gray-200">将您的文件拖放到此处</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">或</p>
                <button className="mt-3 flex items-center justify-center rounded-md h-9 px-4 bg-[#138aec]/10 text-[#138aec] text-sm font-bold leading-normal transition-colors hover:bg-[#138aec]/20 cursor-pointer">
                  <span className="truncate">浏览文件</span>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">支持 DICOM (.dcm)、PNG、JPG 格式</p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".dcm,.dicom,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              
              {files.length > 0 && (
                <div className="mt-4 max-h-32 overflow-y-auto space-y-2 pr-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-base">
                          {file.name.toLowerCase().endsWith('.dcm') || file.name.toLowerCase().endsWith('.dicom') ? '🏥' : '📄'}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{file.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">已选择</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                        >
                          <span className="text-base">✕</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-6">
              <button 
                disabled={files.length === 0 || isAnalyzing}
                onClick={async () => {
                  if (files.length > 0) {
                    try {
                      // 检查是否在客户端环境
                      if (typeof window === 'undefined') return;
                      
                      setIsAnalyzing(true);
                      
                      // 将文件转换为 base64
                      const fileDataArray = await Promise.all(
                        files.map(async (file, index) => {
                          return new Promise<any>((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              resolve({
                                id: index,
                                name: file.name,
                                size: file.size,
                                type: file.type,
                                data: reader.result
                              });
                            };
                            reader.onerror = () => reject(reader.error);
                            reader.readAsDataURL(file);
                          });
                        })
                      );
                      
                      // 存储文件数据到 sessionStorage
                      sessionStorage.setItem('uploadedFiles', JSON.stringify(fileDataArray));
                      
                      // 只分析第一张图片（可以根据需要修改为批量分析）
                      const firstImageFile = fileDataArray.find(f => f.type.startsWith('image/'));
                      
                      if (firstImageFile) {
                        // 调用 AI 分析 API
                        const response = await fetch('/api/analyze', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            imageData: firstImageFile.data
                          })
                        });
                        
                        if (!response.ok) {
                          throw new Error('AI 分析失败');
                        }
                        
                        const result = await response.json();
                        
                        if (result.success) {
                          // 存储 AI 诊断结果
                          sessionStorage.setItem('aiDiagnosis', result.diagnosis);
                          
                          // 在控制台显示 AI 诊断结果
                          console.log('\n%c========== AI 诊断结果 ==========', 'color: #138aec; font-weight: bold; font-size: 14px;');
                          console.log('%c' + result.diagnosis, 'color: #2d3748; font-size: 13px; line-height: 1.6;');
                          console.log('%c================================', 'color: #138aec; font-weight: bold;');
                          
                          // 显示 token 使用情况
                          if (result.usage) {
                            console.log('\n%cToken 使用情况:', 'color: #48bb78; font-weight: bold;');
                            console.log(`提示词: ${result.usage.prompt_tokens} | 生成: ${result.usage.completion_tokens} | 总计: ${result.usage.total_tokens}`);
                          }
                          console.log('');
                        } else {
                          console.error('AI 分析失败:', result.error);
                          // 即使 AI 分析失败，也继续跳转，使用默认诊断文本
                        }
                      }
                      
                      // 跳转到详情页
                      window.location.href = '/detail';
                      
                    } catch (error) {
                      console.error('处理错误:', error);
                      alert('分析失败，请重试。如果问题持续，请检查 API 配置。');
                      setIsAnalyzing(false);
                    }
                  }
                }}
                className={`w-full max-w-xs flex items-center justify-center gap-2 rounded-lg h-12 px-6 text-base font-bold leading-normal transition-colors ${
                  files.length > 0 && !isAnalyzing
                    ? 'bg-[#138aec] text-white hover:bg-opacity-90 cursor-pointer' 
                    : 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="truncate">AI 分析中...</span>
                  </>
                ) : (
                  <span className="truncate">开始 AI 分析 {files.length > 0 ? `(${files.length} 个文件)` : ''}</span>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
