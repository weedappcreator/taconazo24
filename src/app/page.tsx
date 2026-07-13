"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useInView, useSpring, AnimatePresence } from "motion/react";
import { CartProvider, useCart } from "@/components/CartProvider";
import { OrderModal } from "@/components/OrderModal";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { menuData, categoryLabels, testimonials, galleryImgs, type MenuCategory, type Dietary, type MenuItem } from "@/data/menu";

type PlaceData = { rating: number; userRatingCount: number; error?: string };

function useNavScroll() {
  const { scrollY } = useScroll();
  return { opacity: useTransform(scrollY, [0, 120], [0, 1]) };
}

function usePlaceData() {
  const [data, setData] = useState<PlaceData | null>(null);
  useEffect(() => {
    fetch("/api/places")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ rating: 4.9, userRatingCount: 7319 }));
  }, []);
  return data;
}

function ImgReveal({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const r = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end 0.85"] });
  const clip = r ? "inset(0%)" : useTransform(scrollYProgress, [0, 1], ["inset(0 0 100% 0)", "inset(0)"]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ clipPath: clip }}>
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </motion.div>
    </div>
  );
}

function Counter({ n, suffix = "" }: { n: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const v = useInView(ref, { once: true });
  const [c, setC] = useState(0);
  const r = useReducedMotion();
  useEffect(() => {
    if (!v || r) { setC(n); return; }
    const t0 = Date.now(), dur = 2000;
    let raf: number;
    const fn = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      setC(Math.floor((1 - (1 - p) ** 4) * n));
      if (p < 1) raf = requestAnimationFrame(fn);
    };
    raf = requestAnimationFrame(fn);
    return () => cancelAnimationFrame(raf);
  }, [v, n, r]);
  return <span ref={ref}>{c}{suffix}</span>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={i < rating ? "var(--color-salsa)" : "none"} stroke="var(--color-salsa)" strokeWidth="1"><path d="M7 1l1.5 4.6h5L9.3 7.8l1.5 4.6L7 9.8l-3.8 2.6 1.5-4.6L.5 5.6h5L7 1z"/></svg>
      ))}
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left bg-neon"
      style={{ scaleX: useSpring(scrollYProgress, { stiffness: 100, damping: 30 }) }}
    />
  );
}

const dietaryIcons: Record<Dietary, { label: string; icon: string }> = {
  "gluten-free": { label: "Sin Gluten", icon: "GF" },
  vegetarian: { label: "Vegetariano", icon: "V" },
  spicy: { label: "Picante", icon: "🌶" },
};

function SectionHeading({ title, subtitle, accent = "var(--color-neon)", align = "left", light }: { title: string; subtitle?: string; accent?: string; align?: "left" | "center"; light?: boolean }) {
  return (
    <div className={`mb-14 ${align === "center" ? "text-center" : ""}`}>
      <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] text-balance" style={{ color: light ? "#fff" : "var(--color-soil)" }}>{title}</h2>
      <div className={`mt-4 h-1 w-12 rounded-full ${align === "center" ? "mx-auto" : ""}`} style={{ backgroundColor: accent }} />
      {subtitle && <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: light ? "rgba(255,255,255,0.55)" : "var(--color-stone)" }}>{subtitle}</p>}
    </div>
  );
}

const categoryIcons: Record<MenuCategory, string> = {
  tacos: "🌮",
  burritos: "🌯",
  quesadillas: "🧀",
  tostadas: "🫓",
  bebidas: "🥤",
};

const allCategories: MenuCategory[] = ["tacos", "burritos", "quesadillas", "tostadas", "bebidas"];
const allDietary: Dietary[] = ["gluten-free", "vegetarian"];

function InteractiveMenu() {
  const [activeCat, setActiveCat] = useState<MenuCategory | "todas">("todas");
  const [dietFilter, setDietFilter] = useState<Dietary | null>(null);
  const [search, setSearch] = useState("");
  const { addItem } = useCart();

  const filtered = useMemo(() => {
    return menuData.filter((item) => {
      if (activeCat !== "todas" && item.category !== activeCat) return false;
      if (dietFilter && !item.dietary.includes(dietFilter)) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [activeCat, dietFilter, search]);

  const grouped = useMemo(() => {
    const map = new Map<MenuCategory, MenuItem[]>();
    filtered.forEach((item) => {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category)!.push(item);
    });
    return map;
  }, [filtered]);

  const activeCount = menuData.length;

  return (
    <section id="menu" className="py-28 md:py-36" style={{ backgroundColor: "var(--color-charcoal)", color: "#fff" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading title="La Carta" subtitle="Todo hecho al momento con ingredientes frescos. Tortillas artesanales sin gluten." light />

        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setActiveCat("todas")} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeCat === "todas" ? "bg-neon text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>Todas</button>
          {allCategories.map((cat) => (
            <button key={cat} onClick={() => setActiveCat(cat)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeCat === cat ? "bg-neon text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
              {categoryIcons[cat]} {categoryLabels[cat]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-10">
          <input
            type="text"
            placeholder="Buscar en el menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] max-w-xs px-4 py-2.5 rounded-full text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-neon/50"
          />
          {allDietary.map((d) => (
            <button key={d} onClick={() => setDietFilter(dietFilter === d ? null : d)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${dietFilter === d ? "bg-agave text-white" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
              {dietaryIcons[d].icon} {dietaryIcons[d].label}
            </button>
          ))}
          {filtered.length < activeCount && (
            <span className="text-xs text-white/30 ml-auto">{filtered.length} de {activeCount}</span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-white/40 text-lg">No encontramos nada con esos filtros</p>
            <button onClick={() => { setActiveCat("todas"); setDietFilter(null); setSearch(""); }} className="mt-4 text-sm text-neon hover:underline">Limpiar filtros</button>
          </div>
        ) : (
          Array.from(grouped.entries()).map(([cat, items]) => (
            <div key={cat} className="mb-16 last:mb-0">
              <h3 className="mb-6 text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: "var(--color-neon)" }}>
                {categoryIcons[cat]} {categoryLabels[cat]}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item) => (
                  <div key={item.id} className={`group relative rounded-sm p-5 transition-all duration-300 ${item.badge ? "" : "border"}`} style={{ borderColor: item.badge ? "transparent" : "rgba(255,255,255,0.08)", backgroundColor: item.badge ? "var(--color-neon)" : "rgba(255,255,255,0.02)" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                          {item.dietary.map((d) => (
                            <span key={d} className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ backgroundColor: item.badge ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                              {dietaryIcons[d].icon}
                            </span>
                          ))}
                        </div>
                        {item.badge && (
                          <span className="mt-1.5 inline-block px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white rounded" style={{ backgroundColor: item.badge === "Mas Pedido" ? "rgba(255,255,255,0.2)" : "var(--color-agave)" }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="whitespace-nowrap text-sm font-bold" style={{ color: item.badge ? "rgba(255,255,255,0.85)" : "var(--color-neon)" }}>
                        ${item.price}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: item.badge ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)" }}>
                      {item.desc}
                    </p>
                    <button
                      onClick={(e) => { e.preventDefault(); addItem(item); }}
                      className="mt-3 w-full rounded-full py-2 text-[11px] font-bold uppercase tracking-wider transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                      style={{ backgroundColor: item.badge ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)", color: "#fff" }}
                      aria-label={`Agregar ${item.name} a la orden`}
                    >
                      Agregar a la Orden
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openLightbox = (i: number) => setLightboxIndex(i);

  return (
    <section className="py-28 md:py-36" style={{ backgroundColor: "var(--color-cream)" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading title="Galeria" subtitle="Un vistazo a lo que te espera." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {galleryImgs.map((img, i) => {
            const span = i === 0 ? "md:col-span-2 md:row-span-2" : "";
            return (
              <button key={i} onClick={() => openLightbox(i)} className={`group relative overflow-hidden rounded-sm ${span}`}>
                <div className="aspect-square md:aspect-auto md:h-full w-full">
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                </div>
                <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/40 flex items-center justify-center">
                  <svg className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition duration-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <GalleryLightbox
            images={galleryImgs}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((lightboxIndex - 1 + galleryImgs.length) % galleryImgs.length)}
            onNext={() => setLightboxIndex((lightboxIndex + 1) % galleryImgs.length)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const featured = testimonials.slice(0, 3);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [featured.length]);

  return (
    <section className="py-28 md:py-36" style={{ backgroundColor: "var(--color-cream-dark)" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading title="Lo que dicen" subtitle="La gente habla, nosotros cocinamos." />

        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((t, i) => (
            <motion.div
              key={i}
              className="rounded-sm p-8 relative overflow-hidden"
              style={{ backgroundColor: "var(--color-cream)", border: "1px solid var(--color-clay)" }}
              initial={false}
              animate={{ opacity: index === i ? 1 : 0.6, scale: index === i ? 1 : 0.97 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: "var(--color-neon)", opacity: index === i ? 1 : 0 }} />
              <StarRating rating={t.rating} />
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-stone)" }}>{t.text}</p>
              <p className="mt-5 text-xs font-bold tracking-wider uppercase" style={{ color: "var(--color-neon)" }}>{t.name}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-neon" : "w-2 bg-clay"}`}
              aria-label={`Testimonio ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const place = usePlaceData();
  const reviewsK = place?.userRatingCount ? Math.round(place.userRatingCount / 1000) : 7;
  const ratingStr = place?.rating?.toFixed(1) ?? "4.9";
  const [whole, dec] = ratingStr.split(".");

  return (
    <div className="border-y" style={{ borderColor: "var(--color-clay)", backgroundColor: "var(--color-cream)" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-6 py-10">
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl leading-none text-neon">24<span className="text-xl">/7</span></p>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-stone">Abierto</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl leading-none text-neon">365</p>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-stone">Dias al ano</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl leading-none text-neon"><Counter n={50} suffix="K+" /></p>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-stone">Clientes Felices</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl leading-none text-neon">{whole}.<Counter n={Number(dec)} /></p>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-stone">Calificacion</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl leading-none text-neon"><Counter n={reviewsK} suffix="K+" /></p>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-stone">Reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LocationSection() {
  const place = usePlaceData();
  const ratingStr = place?.rating?.toFixed(1) ?? "4.9";
  const [whole, dec] = ratingStr.split(".");
  const reviewCount = place?.userRatingCount ?? 7319;
  const reviewK = Math.floor(reviewCount / 1000);
  const reviewRem = reviewCount % 1000;

  return (
    <section id="location" className="py-28 md:py-36" style={{ backgroundColor: "var(--color-cream-dark)" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionHeading title="Ven a Visitarnos" subtitle="Estamos abiertos 24 horas, los 365 dias del ano. No hay excusas." />

            <div className="space-y-4">
              {[
                { icon: "📍", label: "Direccion", value: "Av. Tiradentes esq. Roberto Pastoriza #10, Ensanche Naco, Santo Domingo" },
                { icon: "🕐", label: "Horario", value: "Lunes a Domingo, 24 horas, todos los dias del ano" },
                { icon: "📞", label: "Contacto", value: "+1 (809) 123-4567" },
              ].map((info, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-4 rounded-sm border" style={{ borderColor: "var(--color-clay)", backgroundColor: "var(--color-cream)" }}>
                  <span className="text-lg mt-0.5">{info.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-soil">{info.label}</p>
                    <p className="mt-0.5 text-sm text-stone">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-sm shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d946.3306634883805!2d-69.932028!3d18.473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf8900504d99ab%3A0x7168af1f3235ed70!2sTACONAZO!5e0!3m2!1sen!2sdo!4v1"
                width="100%" height="360" style={{ border: 0 }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Taconazo24 location on Google Maps"
              />
            </div>
            <div className="rounded-sm px-6 py-5 text-white flex items-center justify-between" style={{ backgroundColor: "var(--color-agave)" }}>
              <div>
                <p className="font-display text-2xl leading-none text-white">{whole}.<Counter n={Number(dec)} /></p>
                <p className="mt-1 text-xs font-semibold text-white/70">Google Rating</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl leading-none text-white"><Counter n={reviewK} suffix="," /><Counter n={reviewRem} /></p>
                <p className="mt-1 text-xs font-semibold text-white/70">Reviews</p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} width="18" height="18" viewBox="0 0 14 14" fill="white"><path d="M7 1l1.5 4.6h5L9.3 7.8l1.5 4.6L7 9.8l-3.8 2.6 1.5-4.6L.5 5.6h5L7 1z"/></svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const WA_NUMBER = "18091234567";

function ContactForm() {
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const people = fd.get("people") as string;
    const date = fd.get("date") as string;
    const notes = fd.get("notes") as string;
    const msg = `Hola! Quiero reservar para ${people} el ${date} a las ${fd.get("time") || "por definir"}.\nNombre: ${name}\nNotas: ${notes}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
    formRef.current?.reset();
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section className="py-28 md:py-36" style={{ backgroundColor: "var(--color-cream)" }}>
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
        <SectionHeading title="Reservaciones" subtitle="Grupos grandes, eventos privados, o simplemente quieres asegurar tu mesa." align="center" />
        <form ref={formRef} onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4 text-left">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-stone">Nombre</label>
              <input name="name" type="text" required className="w-full px-4 py-3 rounded-sm border text-sm" style={{ borderColor: "var(--color-clay)", backgroundColor: "var(--color-cream)", color: "var(--color-soil)" }} placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-stone">Personas</label>
              <select name="people" required className="w-full px-4 py-3 rounded-sm border text-sm" style={{ borderColor: "var(--color-clay)", backgroundColor: "var(--color-cream)", color: "var(--color-soil)" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n}>{n} persona{n > 1 ? "s" : ""}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-stone">Fecha</label>
              <input name="date" type="date" required className="w-full px-4 py-3 rounded-sm border text-sm" style={{ borderColor: "var(--color-clay)", backgroundColor: "var(--color-cream)", color: "var(--color-soil)" }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-stone">Hora</label>
              <input name="time" type="time" className="w-full px-4 py-3 rounded-sm border text-sm" style={{ borderColor: "var(--color-clay)", backgroundColor: "var(--color-cream)", color: "var(--color-soil)" }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-stone">Notas</label>
            <textarea name="notes" rows={3} className="w-full px-4 py-3 rounded-sm border text-sm resize-none" style={{ borderColor: "var(--color-clay)", backgroundColor: "var(--color-cream)", color: "var(--color-soil)" }} placeholder="Alergias, ocasion especial, etc." />
          </div>
          <button
            type="submit"
            className="w-full rounded-full py-3.5 text-sm font-bold text-white transition-all"
            style={{ backgroundColor: sent ? "var(--color-agave)" : "var(--color-neon)" }}
          >
            {sent ? "Enviado a WhatsApp!" : "Solicitar por WhatsApp"}
          </button>
        </form>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-32 md:py-40 text-center overflow-hidden" style={{ backgroundColor: "var(--color-neon)" }}>
      <div className="absolute inset-0 opacity-15" style={{ background: "radial-gradient(ellipse at 30% 50%, white, transparent 60%), radial-gradient(ellipse at 70% 50%, white, transparent 60%)" }} />
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        animate={{ backgroundPosition: ["0 0", "40px 40px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <div className="mx-auto max-w-3xl px-6 relative z-10">
        <h2 className="font-display text-[clamp(3rem,8vw,5rem)] leading-[0.9] text-white text-balance">
          El mejor taco te espera
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base text-white/70">
          Abierto 24/7. Tortillas artesanales, sin gluten. Siempre listos.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#menu"
            className="inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-bold transition-all hover:scale-105"
            style={{ color: "var(--color-neon)" }}
          >
            Ver Menu Completo
          </a>
          <a
            href="https://instagram.com/taconazo24"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.3)" }}
          >
            Siguenos en Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(""); }
  };

  return (
    <footer className="py-16" style={{ backgroundColor: "var(--color-charcoal)", color: "#fff" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h4 className="font-display text-3xl tracking-tight text-white">
              Taconazo<span style={{ color: "var(--color-neon)" }}>24</span>
            </h4>
            <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Tortillas artesanales hechas al momento, sin gluten. Abierto 24 horas, todos los dias.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--color-neon)" }}>Horario</p>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              <p>Lunes a Domingo</p>
              <p className="font-bold text-white">24 horas</p>
              <p className="mt-2">365 dias del ano</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--color-neon)" }}>Direccion</p>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              <p>Av. Tiradentes esq.</p>
              <p>Roberto Pastoriza #10</p>
              <p>Santo Domingo</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--color-neon)" }}>Promos</p>
            {subscribed ? (
              <p className="text-sm text-agave">Gracias por suscribirte!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="flex-1 min-w-0 px-3 py-2 rounded-sm text-xs text-white bg-white/5 border border-white/10 placeholder:text-white/20 focus:outline-none focus:border-neon/50"
                />
                <button type="submit" className="shrink-0 px-4 py-2 rounded-sm text-xs font-bold bg-neon text-white hover:opacity-90 transition-opacity">
                  OK
                </button>
              </form>
            )}
            <div className="flex gap-3 mt-5">
              <a href="https://instagram.com/taconazo24" target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2.5 text-[11px] font-bold text-white transition-all hover:bg-white/20" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>Instagram</a>
              <a href="https://www.tiktok.com/@taconazo247" target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2.5 text-[11px] font-bold text-white transition-all hover:bg-white/20" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>TikTok</a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 text-center text-xs" style={{ color: "rgba(255,255,255,0.2)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p>2026 Taconazo24. Hecho con amor en Santo Domingo.</p>
        </div>
      </div>
    </footer>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: hp } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const r = useReducedMotion();

  return (
    <section ref={heroRef} className="relative min-h-dvh flex items-end overflow-hidden">
      <motion.div className="absolute inset-0" style={r ? {} : { scale: useTransform(hp, [0, 1], [1, 1.15]) }}>
        <img
          src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1920&q=85"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--color-charcoal) 0%, var(--color-charcoal) 30%, transparent 100%)" }} />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-40 lg:px-8 lg:pb-32">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "var(--color-neon)", backdropFilter: "blur(8px)" }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-agave)" }} />
            Abierto 24/7 — 365 dias
          </span>

          <h1 className="font-display text-[clamp(4rem,16vw,10rem)] leading-[0.78] tracking-tight text-white text-balance">
            Taconazo
            <span className="block" style={{ color: "var(--color-neon)" }}>24</span>
          </h1>

          <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/50 lg:text-lg">
            Tortillas artesanales hechas al momento, sin gluten.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#menu"
              className="group inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-bold text-white transition-all hover:scale-105"
              style={{ backgroundColor: "var(--color-neon)" }}
            >
              Ver Menu
              <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            <a
              href="https://maps.app.goo.gl/Yne1W6MfG4gPqSnw6"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border px-8 py-4 text-sm font-bold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              Como Llegar
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            <span>Av. Tiradentes esq. Roberto Pastoriza #10, Santo Domingo</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-28 md:py-36" style={{ backgroundColor: "var(--color-cream)" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div className="relative">
            <ImgReveal
              src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=85"
              alt="Artisan tortilla making"
              className="aspect-[4/5] rounded-sm shadow-xl"
            />
            <motion.div
              className="absolute -bottom-4 -right-4 px-6 py-5 text-white shadow-lg rounded-sm"
              style={{ backgroundColor: "var(--color-neon)" }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.3 }}
            >
              <p className="font-display text-xl leading-none">@taconazo24</p>
              <p className="mt-1 text-xs font-semibold text-white/70">Instagram</p>
            </motion.div>
          </div>
          <div>
            <SectionHeading title="Tortillas que cuentan una historia" subtitle="Nacimos en Santo Domingo con una mision simple: traer el alma de Mexico a cada bocado." />

            <div className="space-y-4">
              {[
                { step: "01", title: "Maiz Nixtamalizado", desc: "Cocinamos el maiz con cal para liberar sus nutrientes y lograr la masa perfecta." },
                { step: "02", title: "Hechas al Momento", desc: "Cada tortilla se prensa y se cocina cuando la ordenas. No hay tortillas prefabricadas." },
                { step: "03", title: "Sin Gluten, Con Amor", desc: "Nuestra masa es 100% maiz. Ideal para celiacos y amantes de la comida autentica." },
              ].map((s, i) => (
                <div key={i} className="flex gap-5 px-5 py-4 rounded-sm border" style={{ borderColor: "var(--color-clay)", backgroundColor: "var(--color-cream)" }}>
                  <span className="font-display text-2xl leading-none shrink-0" style={{ color: "var(--color-neon)" }}>{s.step}</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--color-soil)" }}>{s.title}</p>
                    <p className="mt-0.5 text-sm" style={{ color: "var(--color-stone)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full px-4 py-2 text-xs font-bold text-white" style={{ backgroundColor: "var(--color-agave)" }}>100% Sin Gluten</span>
              <span className="rounded-full px-4 py-2 text-xs font-bold text-white" style={{ backgroundColor: "var(--color-neon)" }}>Maiz Nixtamalizado</span>
              <span className="rounded-full px-4 py-2 text-xs font-bold text-white" style={{ backgroundColor: "var(--color-charcoal)" }}>Hecho a Mano</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarqueeBar() {
  const items = ["Tortillas al momento", "Sin gluten", "24 horas", "Hechas a mano", "Maiz nixtamalizado", "Abierto 365 dias"];
  return (
    <div className="border-y overflow-hidden" style={{ borderColor: "var(--color-clay)", backgroundColor: "var(--color-cream-dark)" }}>
      <div className="py-4">
        <motion.div
          className="flex gap-12 whitespace-nowrap text-xs font-semibold tracking-wider uppercase"
          style={{ color: "var(--color-stone)" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].flatMap((_, outer) =>
            items.map((item, i) => (
              <span key={`${outer}-${i}`} className="flex items-center gap-12">
                <span className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full" style={{ backgroundColor: "var(--color-neon)" }} />
                  {item}
                </span>
              </span>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}

function SocialSection() {
  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: "var(--color-cream)" }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <SectionHeading title="Siguenos" subtitle="Miranos en accion todos los dias." align="center" />
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {galleryImgs.slice(0, 4).map((img, i) => (
            <a key={i} href="https://instagram.com/taconazo24" target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden rounded-sm">
              <img src={img.src} alt={img.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/40 rounded-sm flex items-center justify-center">
                <svg className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition duration-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-10">
          <a
            href="https://instagram.com/taconazo24"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold text-white tracking-wider uppercase transition-all hover:scale-105"
            style={{ backgroundColor: "var(--color-neon)" }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-3a2.25 2.25 0 00-2.25 2.25V18" /></svg>
            @taconazo24
          </a>
        </div>
      </div>
    </section>
  );
}

function CartFloatingButton() {
  const { count, setOpen } = useCart();
  if (count === 0) return null;
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-2xl"
      style={{ backgroundColor: "var(--color-neon)" }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
      {count} item{count > 1 ? "s" : ""} — Ver Orden
    </motion.button>
  );
}

export default function Home() {
  const navOpacity = useNavScroll().opacity;
  return (
    <CartProvider>
      <div className="min-h-screen">
        <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
        <ScrollProgress />

        <header className="fixed top-0 left-0 right-0 z-50">
          <motion.div
            className="absolute inset-0 backdrop-blur-md"
            style={{ opacity: navOpacity, backgroundColor: "color-mix(in oklch, var(--color-cream), transparent 30%)" }}
          />
          <nav aria-label="Navegacion principal" className="relative flex items-center justify-between px-6 py-5 md:px-12">
            <a href="/" className="font-display text-2xl tracking-tight" style={{ color: "var(--color-soil)" }}>
              Taconazo<span style={{ color: "var(--color-neon)" }}>24</span>
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#menu" className="text-sm font-semibold transition-colors hover:text-soil" style={{ color: "var(--color-stone)" }}>Menu</a>
              <a href="#location" className="text-sm font-semibold transition-colors hover:text-soil" style={{ color: "var(--color-stone)" }}>Ubicacion</a>
              <a
                href="#menu"
                className="rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "var(--color-neon)" }}
              >
                Ordena Ya
              </a>
            </div>
          </nav>
        </header>

        <main id="main-content">
          <HeroSection />
          <MarqueeBar />
          <AboutSection />
          <StatsBar />
          <InteractiveMenu />
          <GallerySection />
          <TestimonialsSection />
          <SocialSection />
          <LocationSection />
          <ContactForm />
          <CTASection />
        </main>

        <Footer />
        <CartFloatingButton />
        <OrderModal />
      </div>
    </CartProvider>
  );
}
