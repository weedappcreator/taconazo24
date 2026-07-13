import { NextResponse } from "next/server";

export async function GET() {
  const rating = process.env.NEXT_PUBLIC_GOOGLE_RATING
    ? parseFloat(process.env.NEXT_PUBLIC_GOOGLE_RATING)
    : 4.9;
  const reviews = process.env.NEXT_PUBLIC_GOOGLE_REVIEWS
    ? parseInt(process.env.NEXT_PUBLIC_GOOGLE_REVIEWS, 10)
    : 7319;

  const placeId = "0x8eaf8900504d99ab:0x7168af1f3235ed70";
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount&key=${apiKey}`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          rating: data.rating ?? rating,
          userRatingCount: data.userRatingCount ?? reviews,
        });
      }
    } catch {
      /* fall through to env defaults */
    }
  }

  return NextResponse.json({ rating, userRatingCount: reviews });
}
