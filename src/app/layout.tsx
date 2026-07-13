import type { Metadata } from "next";
import { Bangers, Nunito } from "next/font/google";
import "./globals.css";

const bangers = Bangers({
  variable: "--font-bangers",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Taconazo24 | Tacos Artesanales 24/7 en Santo Domingo",
  description:
    "Tortillas artesanales hechas al momento, sin gluten. Abierto 24 horas en Av. Tiradentes esq. Roberto Pastoriza #10, Santo Domingo. Los mejores tacos de la ciudad.",
  keywords: [
    "tacos", "taconazo", "taconazo24", "tacos artesanales", "sin gluten",
    "comida mexicana", "Santo Domingo", "24 horas", "tortillas artesanales",
    "tacos santo domingo", "comida callejera mexicana",
  ],
  openGraph: {
    title: "Taconazo24 | Tacos Artesanales 24/7",
    description:
      "Tortillas artesanales hechas al momento, sin gluten. Abierto 24 horas en Av. Tiradentes, Santo Domingo.",
    type: "website",
    locale: "es_DO",
    siteName: "Taconazo24",
    images: [{
      url: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taconazo24 | Tacos Artesanales 24/7",
    description:
      "Tortillas artesanales hechas al momento, sin gluten. Abierto 24 horas en Santo Domingo.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Taconazo24",
  description:
    "Tortillas artesanales hechas al momento, sin gluten. Abierto 24 horas en Santo Domingo.",
  url: "https://taconazo24.com",
  telephone: "+18091234567",
  servesCuisine: "Mexican",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Tiradentes esq. Roberto Pastoriza #10",
    addressLocality: "Santo Domingo",
    addressRegion: "Distrito Nacional",
    addressCountry: "DO",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 18.473,
    longitude: -69.932,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "7319",
    bestRating: "5",
  },
  servesDiet: ["GlutenFreeDiet"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${bangers.variable} ${nunito.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
