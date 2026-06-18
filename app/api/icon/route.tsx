import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sizeParam = searchParams.get('size');
  
  let width = 512;
  let height = 512;

  if (sizeParam === '192x192') {
    width = 192;
    height = 192;
  } else if (sizeParam === '512x512') {
    width = 512;
    height = 512;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          padding: '10%',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          fill="none"
          stroke="#c2a77d"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M25,35 L25,85 L42,73" strokeWidth="10" />
          <polygon points="25,10 8,35 42,35" strokeWidth="8" />
          <path d="M75,65 L75,15 L58,27" strokeWidth="10" />
          <polygon points="75,90 58,65 92,65" strokeWidth="8" />
          <path d="M50,33 L50,67" strokeWidth="6" />
          <path 
            d="M58,42 C58,36 53,37 50,37 C47,37 42,36 42,42 C42,48 58,48 58,54 C58,60 53,61 50,61 C47,61 42,60 42,54" 
            strokeWidth="6" 
          />
        </svg>
      </div>
    ),
    {
      width,
      height,
    }
  );
}
