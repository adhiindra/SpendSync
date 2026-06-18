import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FlowSync',
    short_name: 'FlowSync',
    description: 'Track your spending seamlessly',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon?size=192x192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon?size=512x512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
