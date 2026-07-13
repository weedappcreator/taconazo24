import { NextResponse } from "next/server";

export async function GET() {
  const placeId = "0x8eaf8900504d99ab:0x7168af1f3235ed70";
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { rating: 4.9, userRatingCount: 7319, error: "No API key configured" },
      { status: 200 }
    );
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount,reviews&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`Google API: ${res.status}`);

    const data = await res.json();
    return NextResponse.json({
      rating: data.rating ?? 4.9,
      userRatingCount: data.userRatingCount ?? 7319,
      reviews: data.reviews ?? [],
    });
  } catch {
    return NextResponse.json(
      { rating: 4.9, userRatingCount: 7319, error: "Failed to fetch" },
      { status: 200 }
    );
  }
}
