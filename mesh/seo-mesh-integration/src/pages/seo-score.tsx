import { useRouter } from 'next/router';

export default function SeoScore() {
  const router = useRouter();

  const score = Number(router.query.score);

  const hue = score * 1.1;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 42 42">
        <circle cx="21" cy="21" r="16" fill="transparent" stroke="#eee" strokeWidth="3"></circle>

        <circle
          cx="21"
          cy="21"
          r="16"
          fill="transparent"
          stroke={`hsl(${hue}, 90%, 60%)`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${score} 100`}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        ></circle>
        <text fill="red" x="10" y="20" style={{ textAlign: 'center' }}></text>
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          textAlign: 'center',
          alignSelf: 'center',
          color: '#234',
          fontSize: 'clamp(16px, 33vh, 128px)',
        }}
      >
        {score}
      </div>
    </div>
  );
}
