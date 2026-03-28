import { FC } from 'react';

export const Loading: FC = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-start bg-white/80 backdrop-blur-[1px] z-10">
      <div className="mt-24 text-xs uppercase tracking-widest text-mono-400 animate-pulse">Loading</div>
    </div>
  );
};
