"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface FileData {
  id: number;
  name: string;
  size: number;
  type: string;
  url: string;
}

export default function Detail() {
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  const diagnosisText = "综合风险评分为高。建议进行进一步的活检或 PET-CT 检查以确认恶性肿瘤。鉴于其中一个结节的恶性程度较高，建议立即会诊。";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const loadFiles = async () => {
      try {
        // 从 sessionStorage 获取文件数据
        const storedFiles = sessionStorage.getItem('uploadedFiles');
        if (!storedFiles) {
          console.log('没有找到文件信息');
          return;
        }
        
        const filesData = JSON.parse(storedFiles);
        
        // 将 base64 数据转换为 Blob URL
        const loadedFiles = filesData.map((fileData: any) => {
          // 将 base64 转换为 Blob
          const byteCharacters = atob(fileData.data.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: fileData.type });
          const url = URL.createObjectURL(blob);
          
          return {
            id: fileData.id,
            name: fileData.name,
            size: fileData.size,
            type: fileData.type,
            url: url
          };
        });
        
        setUploadedFiles(loadedFiles);
        
      } catch (error) {
        console.error('加载文件数据失败:', error);
      }
    };
    
    loadFiles();
    
    // 清理函数：在组件卸载时释放 blob URLs
    return () => {
      uploadedFiles.forEach(file => {
        if (file.url && file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [isClient]);

  const copyDiagnosis = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(diagnosisText);
        alert("诊断建议已复制到剪贴板");
      } else if (typeof document !== 'undefined') {
        // 降级方案：使用传统的复制方法
        const textArea = document.createElement('textarea');
        textArea.value = diagnosisText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert("诊断建议已复制到剪贴板");
      } else {
        alert("复制功能不可用");
      }
    } catch (err) {
      console.error("复制失败:", err);
      alert("复制失败，请手动复制");
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const nextImage = () => {
    if (uploadedFiles.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % uploadedFiles.length);
      handleResetView();
    }
  };

  const prevImage = () => {
    if (uploadedFiles.length > 0) {
      setCurrentImageIndex(prev => (prev - 1 + uploadedFiles.length) % uploadedFiles.length);
      handleResetView();
    }
  };

  const currentFile = uploadedFiles[currentImageIndex];
  
  // 在客户端加载完成前显示加载状态
  if (!isClient) {
    return (
      <div className="bg-[#f6f7f8] dark:bg-[#101a22] font-[Inter,sans-serif] text-[#111518] dark:text-[#e8eef3] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🫁</div>
          <p className="text-lg font-medium">加载中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101a22] font-[Inter,sans-serif] text-[#111518] dark:text-[#e8eef3]">
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-[#dbe1e6] dark:border-[#2d3e4e] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="size-8 text-[#138aec]">
              <svg className="h-full w-full" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C9.28 2 6.78 3.08 4.93 4.93C3.08 6.78 2 9.28 2 12C2 14.72 3.08 17.22 4.93 19.07C6.78 20.92 9.28 22 12 22C14.72 22 17.22 20.92 19.07 19.07C20.92 17.22 22 14.72 22 12C22 9.28 20.92 6.78 19.07 4.93C17.22 3.08 14.72 2 12 2ZM12 18C10.05 18 8.18 17.22 6.76 15.8C5.35 14.39 4.58 12.51 4.58 10.56C4.58 8.61 5.35 6.73 6.76 5.32C8.18 3.9 10.05 3.12 12 3.12C13.95 3.12 15.82 3.9 17.24 5.32C18.65 6.73 19.42 8.61 19.42 10.56C19.42 12.51 18.65 14.39 17.24 15.8C15.82 17.22 13.95 18 12 18Z" opacity="0.3"></path>
                <path d="M12 6C9.79 6 8 7.79 8 10C8 11.13 8.44 12.16 9.17 12.83L7 15H17L14.83 12.83C15.56 12.16 16 11.13 16 10C16 7.79 14.21 6 12 6ZM10 10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 11.1 13.1 12 12 12C10.9 12 10 11.1 10 10Z"></path>
                <path d="M12 17C13.66 17 15 15.66 15 14H9C9 15.66 10.34 17 12 17Z"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold">AI肺部结节辅助诊断</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a className="text-[#617789] dark:text-[#9fb3c5] hover:text-[#138aec] dark:hover:text-[#138aec] transition-colors cursor-pointer" href="#">技术说明</a>
              <a className="text-[#617789] dark:text-[#9fb3c5] hover:text-[#138aec] dark:hover:text-[#138aec] transition-colors cursor-pointer" href="#">联系我们</a>
            </nav>
          </div>
        </header>
        
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">AI 肺结节分析</h2>
              <Link href="/" className="cursor-pointer">
                <button className="flex items-center gap-2 px-4 py-2 rounded bg-[#f6f7f8] dark:bg-[#101a22] border border-[#dbe1e6] dark:border-[#2d3e4e] text-sm font-medium hover:bg-[#138aec]/10 dark:hover:bg-[#138aec]/20 transition-colors cursor-pointer">
                  <span className="text-base">←</span>
                  返回上传
                </button>
              </Link>
            </div>
            
            <div className="rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden relative h-[600px] flex items-center justify-center">
              {currentFile ? (
                <div className="w-full h-full relative overflow-hidden">
                  {currentFile.type.startsWith('image/') ? (
                    <img
                      src={currentFile.url}
                      alt={currentFile.name}
                      className="w-full h-full object-contain transition-transform duration-200"
                      style={{
                        transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                      }}
                      draggable={false}
                    />
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <div className="text-6xl mb-4">🏥</div>
                      <p className="text-lg font-medium">{currentFile.name}</p>
                      <p className="text-sm mt-2">DICOM 文件预览</p>
                      <p className="text-xs mt-1 text-gray-400">需要专业的 DICOM 查看器</p>
                    </div>
                  )}
                  
                  {/* 文件信息 */}
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {uploadedFiles.length} - {currentFile.name}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🫁</div>
                  <p className="text-lg font-medium">没有找到图片</p>
                  <p className="text-sm mt-2">请先上传图片文件</p>
                </div>
              )}
              
              {/* 缩放控制按钮 */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button 
                  onClick={handleZoomIn}
                  className="flex items-center justify-center size-10 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  title="放大"
                >
                  <span className="text-xl">🔍</span>
                </button>
                <button 
                  onClick={handleZoomOut}
                  className="flex items-center justify-center size-10 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  title="缩小"
                >
                  <span className="text-xl">🔍</span>
                </button>
                <button 
                  onClick={handleResetView}
                  className="flex items-center justify-center size-10 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  title="重置视图"
                >
                  <span className="text-xl">🖐</span>
                </button>
              </div>
              
              {/* 翻页按钮 */}
              {uploadedFiles.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center size-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                    title="上一张"
                  >
                    <span className="text-2xl">‹</span>
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center size-12 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
                    title="下一张"
                  >
                    <span className="text-2xl">›</span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          <aside className="flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4">分析摘要</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">上传文件数</p>
                  <p className="text-3xl font-bold text-[#138aec]">{uploadedFiles.length}</p>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">当前查看</p>
                  <p className="text-3xl font-bold">{uploadedFiles.length > 0 ? currentImageIndex + 1 : 0}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold">诊断建议</h3>
              <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-sm">综合风险评分为 <span className="font-bold text-red-600 dark:text-red-400">高</span>。建议进行进一步的活检或 PET-CT 检查以确认恶性肿瘤。鉴于其中一个结节的恶性程度较高，建议立即会诊。</p>
              </div>
              <button 
                onClick={copyDiagnosis}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#138aec] text-white text-sm font-medium hover:bg-[#138aec]/90 transition-colors cursor-pointer"
              >
                <span className="text-base">📋</span>
                复制建议
              </button>
            </div>
            
            <div className="flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-4">详细结节数据</h3>
              <div className="flex-1 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <table className="w-full text-sm text-left">
                  <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">大小</th>
                      <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">位置</th>
                      <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">类型</th>
                      <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">恶性程度</th>
                      <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">置信度</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">12mm</td>
                      <td className="px-4 py-3">右上叶</td>
                      <td className="px-4 py-3">实性</td>
                      <td className="px-4 py-3 font-medium">70%</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">高</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">8mm</td>
                      <td className="px-4 py-3">左下叶</td>
                      <td className="px-4 py-3">半实性</td>
                      <td className="px-4 py-3 font-medium">55%</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300">中</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">5mm</td>
                      <td className="px-4 py-3">右中叶</td>
                      <td className="px-4 py-3">非实性</td>
                      <td className="px-4 py-3 font-medium">20%</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">低</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
