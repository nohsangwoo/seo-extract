'use client'

import { useState } from "react";
import axios from 'axios';
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect } from "react";
import DisplayLudgi from "./components/DisplayLudgi";

export default function Home() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

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
    <div className="relative min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 text-white overflow-hidden">
      {init && (
        <Particles
          id="tsparticles"
          options={{
            fullScreen: { enable: true },
            particles: {
              number: { value: 80 },
              color: { value: "#ffffff" },
              shape: { type: "circle" },
              opacity: { value: 0.5 },
              size: { value: 3 },
              move: { enable: true, speed: 1 },
            },
          }}
        />
      )}
      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-8 text-center"
        >
          SEO Analyzer
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg"
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to analyze"
            className="w-full p-3 border border-purple-300 rounded-lg bg-white/5 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchSEOInfo}
            disabled={isLoading}
            className="mt-4 w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-purple-300 transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            {isLoading ? 'Analyzing...' : 'Analyze SEO'}
          </motion.button>
        </motion.div>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-red-300 bg-red-900/50 px-4 py-2 rounded-lg"
          >
            {error}
          </motion.div>
        )}
        {Object.keys(seoInfo).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl mt-12 bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">SEO Analysis Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(seoInfo).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  <p className="text-purple-200 break-words">{value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        <DisplayLudgi />
      </div>
    </div>
  );
}
