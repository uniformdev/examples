"use client";

import { useUniformContext } from "@uniformdev/canvas-next-rsc-v2/component";
import { useEffect, useState } from "react";

export const QuirkButton = () => {
  const { context } = useUniformContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isCanada, setIsCanada] = useState(false);

  useEffect(() => {
    if (context?.quirks !== undefined) {
      setIsCanada(context.quirks?.country === 'Canada');
      setIsLoading(false);
    }
  }, [context?.quirks]);

  return (
    <div className="p-16">
      <button
        disabled={isLoading || isCanada}
        onClick={async () => {
          if (isCanada) return;
          setIsLoading(true);
          try {
            await context?.update({
              quirks: {
                country: "Canada",
              },
            });
            setIsCanada(true);
          } finally {
            setIsLoading(false);
          }
        }}
        className={`relative group px-8 py-4 text-xl font-bold text-white rounded-lg
        transform transition-all duration-200 overflow-hidden min-w-[280px]
        ${isLoading 
          ? 'bg-gray-500 cursor-wait'
          : isCanada 
            ? 'bg-gray-400 cursor-not-allowed opacity-70'
            : 'bg-red-600 hover:scale-105 cursor-pointer hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] shadow-[0_0_20px_rgba(239,68,68,0.5)]'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="text-4xl">{isLoading ? '⌛' : '🍁'}</div>
        </div>
        <div className="relative flex items-center justify-center gap-2">
          <span>
            {isLoading 
              ? '🛂 Checking your visa...' 
              : isCanada 
                ? 'Already in Canada' 
                : 'Immigrate to Canada'}
          </span>
          <span className="text-2xl">
            {isLoading 
              ? <span className="inline-block animate-spin">🔄</span>
              : '🍁'}
          </span>
        </div>
        <div className={`absolute inset-0 bg-gradient-to-r 
          ${isLoading
            ? 'from-gray-600 to-gray-500 opacity-10'
            : isCanada 
              ? 'from-gray-500 to-gray-400 opacity-10'
              : 'from-red-700 to-red-500 opacity-0 group-hover:opacity-20'
          } transition-opacity duration-200`} />
      </button>
    </div>
  );
};
