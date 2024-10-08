'use client'

import { useState } from "react";
import axios from 'axios';

export default function Home() {
  const [url, setUrl] = useState("");
  const [seoInfo, setSeoInfo] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSEOInfo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/seo', {
        params: { url: url } // URL을 인코딩하지 않고 그대로 전달
      });
      setSeoInfo(response.data);
    } catch (error) {
      console.error('SEO 정보 가져오기 오류:', error);
      setError('SEO 정보를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-xl">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL을 입력하세요"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={fetchSEOInfo}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? '로딩 중...' : 'SEO 정보 가져오기'}
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {Object.keys(seoInfo).length > 0 && (
        <div className="w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-4">SEO 정보</h2>
          {Object.entries(seoInfo).map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
