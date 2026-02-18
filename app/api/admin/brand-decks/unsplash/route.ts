import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('query');
    if (!query) {
      return NextResponse.json({ error: 'query parameter is required' }, { status: 400 });
    }

    const page = searchParams.get('page') ?? '1';
    const perPage = searchParams.get('per_page') ?? '20';

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.error('UNSPLASH_ACCESS_KEY is not configured');
      return NextResponse.json({ error: 'Image search is not configured' }, { status: 500 });
    }

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

    const unsplashRes = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (!unsplashRes.ok) {
      console.error('Unsplash API error:', unsplashRes.status, unsplashRes.statusText);
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: unsplashRes.status });
    }

    const data = await unsplashRes.json();

    return NextResponse.json({
      images: data.results.map((img: UnsplashPhoto) => ({
        id: img.id,
        urls: {
          small: img.urls.small,
          regular: img.urls.regular,
          full: img.urls.full,
        },
        alt: img.alt_description || '',
        photographer: img.user.name,
        photographerUrl: img.user.links.html,
      })),
      totalPages: data.total_pages,
    });
  } catch (error) {
    console.error('Unsplash search failed:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

interface UnsplashPhoto {
  id: string;
  alt_description: string | null;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}
