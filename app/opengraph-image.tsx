import { generateDefaultOgImage, OG_IMAGE_SIZE } from '@/components/seo/og-image';

export const runtime = 'edge';

export const alt = 'The Sunshine Effect - Glow from the heart';
export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return generateDefaultOgImage();
}
