"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
  useSpring,
} from "motion/react";

const C = {
  bg:       "oklch(0.96 0.01 80)",
  surface:  "oklch(0.94 0.012 75)",
  fg:       "oklch(0.25 0.02 70)",
  muted:    "oklch(0.55 0.02 70)",
  border:   "oklch(0.82 0.015 75)",
  accent:   "oklch(0.6 0.25 350)",
  dark:     "oklch(0.15 0.015 70)",
  green:    "oklch(0.45 0.12 145)",
};

const menu = {
  tacos: [
    { name: "Tacos al Pastor",      price: "295", desc: "Adobo-marinated pork, grilled pineapple, fresh cilantro & onion", badge: "Mas Pedido" },
    { name: "Tacos de Birria",      price: "395", desc: "Slow-cooked beef in aromatic chile broth, consome for dipping", badge: "Signature" },
    { name: "Tacos de Carne Asada", price: "350", desc: "Grilled flank steak, guacamole, pico de gallo" },
    { name: "Tacos de Pollo",       price: "250", desc: "Achiote chicken, pickled red onions, crema" },
    { name: "Tacos de Pescado",     price: "395", desc: "Beer-battered fish, cabbage slaw, chipotle crema" },
    { name: "Tacos Vegetarianos",   price: "225", desc: "Grilled vegetables, black beans, queso fresco" },
  ],
  burritos: [
    { name: "Burrito Supreme",      price: "450", desc: "Choice of meat, rice, beans, cheese, guacamole, crema" },
    { name: "Burrito de Carne",     price: "395", desc: "Seasoned beef, rice, beans, pico de gallo" },
    { name: "Burrito de Pollo",     price: "350", desc: "Grilled chicken, rice, black beans, salsa verde" },
    { name: "Burrito Vegetariano",  price: "295", desc: "Rice, beans, grilled vegetables, guacamole" },
  ],
  quesadillas: [
    { name: "Quesadilla de Queso",  price: "195", desc: "Oaxaca cheese, hand-pressed corn tortilla" },
    { name: "Quesadilla de Pollo",  price: "295", desc: "Shredded chicken, Oaxaca cheese, epazote" },
    { name: "Quesadilla de Carne",  price: "350", desc: "Picadillo, Oaxaca cheese, roasted rajas" },
    { name: "Quesadilla de Hongos", price: "275", desc: "Sautied mushrooms, Oaxaca cheese, truffle oil" },
  ],
  tostadas: [
    { name: "Tostada de Ceviche",   price: "350", desc: "Fresh shrimp ceviche, avocado, tomatillo salsa" },
    { name: "Tostada de Tinga",     price: "295", desc: "Shredded chicken in chipotle, crema, avocado" },
  ],
  drinks: [
    { name: "Horchata",     price: "150", desc: "Cinnamon rice milk, ice cold" },
    { name: "Jamaica",      price: "120", desc: "Chilled hibiscus flower tea" },
    { name: "Cerveza Fria", price: "175", desc: "Mexican lager, served icy" },
  ],
};

const testimonials = [
  { name: "Maria G.",  text: "Los mejores tacos de Santo Domingo. La birria es increible y las tortillas artesanales son otro nivel." },
  { name: "Carlos R.", text: "Abierto 24 horas con la misma calidad siempre. Perfecto para llegar despues de una noche larga." },
  { name: "Ana P.",    text: "Sin gluten y delicioso. Finalmente un lugar donde puedo comer tacos sin preocuparme." },
  { name: "Jose M.",   text: "El pastor esta espectacular. El sabor de la plancha es autentico, como en Mexico." },
];

const galleryImgs = [
  { src: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80", alt: "Tacos al pastor on a griddle" },
  { src: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80", alt: "Handmade tortillas being prepared" },
  { src: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=600&q=80", alt: "Colorful taco platter" },
  { src: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80", alt: "Birria tacos with consome" },
  { src: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=600&q=80", alt: "Fresh guacamole" },
  { src: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=600&q=80", alt: "Classic margarita cocktail" },
];

function useNavScroll() {
  const { scrollY } = useScroll();
  const o = useTransform(scrollY, [0, 120], [0, 1]);
  return { opacity: o };
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
  const v = useInView(ref, { once: true, margin: "-100px" });
  const [c, setC] = useState(0);
  const r = useReducedMotion();
  useEffect(() => {
    if (!v || r) { setC(n); return; }
    const start = Date.now(), dur = 2000;
    let raf: number;
    const fn = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setC(Math.floor((1 - (1 - p) ** 4) * n));
      if (p < 1) raf = requestAnimationFrame(fn);
    };
    raf = requestAnimationFrame(fn);
    return () => cancelAnimationFrame(raf);
  }, [v, n, r]);
  return <span ref={ref}>{c}{suffix}</span>;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left"
      style={{ scaleX: useSpring(scrollYProgress, { stiffness: 100, damping: 30 }), backgroundColor: C.accent }}
    />
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-sm font-semibold transition-colors hover:text-[var(--fg)]" style={{ color: C.muted } as React.CSSProperties}>
      {children}
    </a>
  );
}

function MenuCard({ item }: { item: { name: string; price: string; desc: string; badge?: string } }) {
  const featured = !!item.badge;
  return (
    <div
      className="rounded-sm p-6"
      style={{
        backgroundColor: featured ? C.accent : "transparent",
        border: featured ? "none" : `1px solid ${C.border}`,
        color: featured ? "#fff" : C.fg,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-bold" style={{ color: featured ? "#fff" : C.fg }}>{item.name}</h4>
          {item.badge && (
            <span
              className="mt-2 inline-block px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: item.badge === "Mas Pedido" ? "rgba(255,255,255,0.2)" : C.green,
                color: "#fff",
              }}
            >
              {item.badge}
            </span>
          )}
        </div>
        <span className="whitespace-nowrap font-bold text-sm" style={{ color: featured ? "rgba(255,255,255,0.8)" : C.accent }}>
          ${item.price}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: featured ? "rgba(255,255,255,0.75)" : C.muted }}>
        {item.desc}
      </p>
    </div>
  );
}

export default function TaconazoPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { opacity: navOpacity } = useNavScroll();
  const { scrollYProgress: hp } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: C.fg }}>
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <ScrollProgress />

      <header className="fixed top-0 left-0 right-0 z-50">
        <motion.div className="absolute inset-0 backdrop-blur-sm" style={{ opacity: navOpacity, backgroundColor: `color-mix(in oklch, ${C.bg}, transparent 30%)` }} />
        <nav aria-label="Navegacion principal" className="relative flex items-center justify-between px-6 py-5 md:px-12">
          <span className="font-[var(--font-bangers)] text-2xl tracking-tight" style={{ color: C.fg }}>
            Taconazo<span style={{ color: C.accent }}>24</span>
          </span>
          <div className="flex items-center gap-8">
            <NavLink href="#menu">Menu</NavLink>
            <NavLink href="#location">Ubicacion</NavLink>
            <a
              href="#menu"
              className="rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: C.accent }}
            >
              Ordena Ya
            </a>
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section ref={heroRef} className="relative min-h-dvh flex items-end overflow-hidden">
          <motion.div className="absolute inset-0" style={{ scale: useTransform(hp, [0, 1], [1, 1.15]) }}>
            <img
              src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1920&q=85"
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--hero-overlay)] via-[var(--hero-overlay)] to-[var(--hero-overlay)]/10" style={{ "--hero-overlay": C.dark } as React.CSSProperties} />
          </motion.div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-40 lg:px-8 lg:pb-28">
            <div className="max-w-3xl">
              <p className="mb-6 text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: C.accent }}>
                Abierto 24/7, 365 dias
              </p>
              <h1 className="font-[var(--font-bangers)] text-[clamp(4rem,16vw,10rem)] leading-[0.78] tracking-tight text-white text-balance">
                Taconazo
                <span className="block" style={{ color: C.accent }}>24</span>
              </h1>
              <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/60 lg:text-lg">
                Tortillas artesanales hechas al momento, sin gluten.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#menu"
                  className="inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: C.accent }}
                >
                  Ver Menu
                </a>
                <a
                  href="https://maps.app.goo.gl/Yne1W6MfG4gPqSnw6"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border px-8 py-4 text-sm font-bold text-white/80 transition-colors hover:text-white"
                  style={{ borderColor: "rgba(255,255,255,0.25)" }}
                >
                  Como Llegar
                </a>
              </div>
              <p className="mt-8 text-xs text-white/40">
                Av. Tiradentes esq. Roberto Pastoriza #10, Santo Domingo
              </p>
            </div>
          </div>
        </section>

        <div className="border-y overflow-hidden" style={{ borderColor: C.border, backgroundColor: C.surface }}>
          <div className="py-4">
            <motion.div
              className="flex gap-10 whitespace-nowrap text-xs font-semibold tracking-wider uppercase"
              style={{ color: C.muted }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(2)].flatMap(() => [
                "Tortillas al momento", "Sin gluten", "24 horas",
                "Hechas a mano", "Maiz nixtamalizado", "Abierto 365 dias",
              ]).map((item, i) => (
                <span key={i} className="flex items-center gap-10">
                  {item}
                  <span className="opacity-40" style={{ color: C.accent }}>/</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        <section className="py-28 md:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:items-center">
              <div className="relative">
                <ImgReveal
                  src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=85"
                  alt="Artisan tortilla making"
                  className="aspect-[4/5] rounded-sm shadow-xl"
                />
                <div
                  className="absolute -bottom-4 -right-4 px-5 py-4 text-white shadow-lg"
                  style={{ backgroundColor: C.accent }}
                >
                  <p className="font-[var(--font-bangers)] text-3xl leading-none">
                    <Counter n={414} suffix="K" />
                  </p>
                  <p className="mt-1 text-xs font-semibold text-white/70">Instagram</p>
                </div>
              </div>
              <div>
                <h2 className="font-[var(--font-bangers)] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] text-balance" style={{ color: C.fg }}>
                  Tortillas que cuentan una historia
                </h2>
                <div className="mt-4 h-1 w-12 rounded-full" style={{ backgroundColor: C.accent }} />
                <p className="mt-8 text-base leading-relaxed max-w-prose" style={{ color: C.muted }}>
                  En Taconazo24, cada tortilla se hace a mano en el momento. Nuestra masa de maiz nixtamalizado se prensa y se cocina a la orden porque creemos que el sabor verdadero nace de lo artesanal. Sin gluten, sin atajos, solo maiz, amor y tradicion.
                </p>
                <p className="mt-4 text-base leading-relaxed max-w-prose" style={{ color: C.muted }}>
                  Nacimos en Santo Domingo con una mision simple: traer el alma de Mexico a cada bocado.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full px-4 py-2 text-xs font-bold text-white" style={{ backgroundColor: C.green }}>100% Sin Gluten</span>
                  <span className="rounded-full px-4 py-2 text-xs font-bold text-white" style={{ backgroundColor: C.accent }}>Maiz Nixtamalizado</span>
                  <span className="rounded-full px-4 py-2 text-xs font-bold text-white" style={{ backgroundColor: C.dark }}>Hecho a Mano</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="menu" className="py-28 md:py-36" style={{ backgroundColor: C.dark, color: "#fff" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="font-[var(--font-bangers)] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] text-balance text-white">La Carta</h2>
              <div className="mt-4 h-1 w-12 rounded-full" style={{ backgroundColor: C.accent }} />
              <p className="mt-6 max-w-xl text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
                Todo hecho al momento con ingredientes frescos. Tortillas artesanales sin gluten.
              </p>
            </div>

            <div className="mb-20">
              <h3 className="mb-8 text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: C.accent }}>Tacos</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menu.tacos.map((item) => <MenuCard key={item.name} item={item} />)}
              </div>
            </div>

            <div className="grid gap-14 lg:grid-cols-2 mb-16">
              <div>
                <h3 className="mb-6 text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: C.accent }}>Burritos</h3>
                <div className="space-y-3">
                  {menu.burritos.map((item) => (
                    <div key={item.name} className="flex items-start justify-between gap-4 px-5 py-4 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
                      </div>
                      <span className="whitespace-nowrap text-sm font-bold" style={{ color: C.accent }}>${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-6 text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: C.accent }}>Quesadillas</h3>
                <div className="space-y-3">
                  {menu.quesadillas.map((item) => (
                    <div key={item.name} className="flex items-start justify-between gap-4 px-5 py-4 rounded-sm border" style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
                      </div>
                      <span className="whitespace-nowrap text-sm font-bold" style={{ color: C.accent }}>${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-14 lg:grid-cols-2">
              <div>
                <h3 className="mb-6 text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: C.green }}>Tostadas</h3>
                <div className="flex flex-wrap gap-3">
                  {menu.tostadas.map((item) => (
                    <div key={item.name} className="flex-1 min-w-[200px] px-5 py-4 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
                      <span className="mt-2 inline-block text-sm font-bold" style={{ color: C.green }}>${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-6 text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: C.accent }}>Bebidas</h3>
                <div className="space-y-1">
                  {menu.drinks.map((item) => (
                    <div key={item.name} className="flex items-center justify-between px-5 py-4 rounded-sm transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <div className="flex items-center gap-4">
                        <span className="block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: C.accent }} />
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                          <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
                        </div>
                      </div>
                      <span className="whitespace-nowrap text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-28 md:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="font-[var(--font-bangers)] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] text-balance" style={{ color: C.fg }}>Galeria</h2>
              <div className="mt-4 h-1 w-12 rounded-full" style={{ backgroundColor: C.accent }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryImgs.map((img, i) => {
                const span = i === 0 ? "md:row-span-2" : i === 3 ? "md:col-span-2" : "";
                return <ImgReveal key={i} src={img.src} alt={img.alt} className={`rounded-sm shadow-lg ${span}`} />;
              })}
            </div>
          </div>
        </section>

        <section className="py-28 md:py-36" style={{ backgroundColor: C.surface }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-14">
              <h2 className="font-[var(--font-bangers)] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] text-balance" style={{ color: C.fg }}>Lo que dicen</h2>
              <div className="mt-4 h-1 w-12 rounded-full" style={{ backgroundColor: C.accent }} />
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {testimonials.map((t, i) => (
                <div key={i} className="rounded-sm px-6 py-8" style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}>
                  <p className="text-4xl font-light leading-none" style={{ color: C.accent }}>&ldquo;</p>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>{t.text}</p>
                  <p className="mt-5 text-xs font-semibold tracking-wider uppercase" style={{ color: C.accent }}>{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-[var(--font-bangers)] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] text-balance" style={{ color: C.fg }}>Siguenos</h2>
              <div className="mt-4 h-1 w-12 mx-auto rounded-full" style={{ backgroundColor: C.accent }} />
            </div>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
              {galleryImgs.slice(0, 4).map((img, i) => (
                <a key={i} href="https://instagram.com/taconazo24" target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden rounded-sm">
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/30 rounded-sm" />
                </a>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a
                href="https://instagram.com/taconazo24"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold text-white tracking-wider uppercase transition-all hover:opacity-90"
                style={{ backgroundColor: C.accent }}
              >
                @taconazo24
              </a>
            </div>
          </div>
        </section>

        <section id="location" className="py-28 md:py-36" style={{ backgroundColor: C.surface }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <h2 className="font-[var(--font-bangers)] text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] text-balance" style={{ color: C.fg }}>Ven a Visitarnos</h2>
                <div className="mt-4 h-1 w-12 rounded-full" style={{ backgroundColor: C.accent }} />
                <p className="mt-8 text-base leading-relaxed max-w-prose" style={{ color: C.muted }}>
                  Estamos abiertos 24 horas, los 365 dias del ano. No hay excusas para no probar nuestros tacos artesanales.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-4 px-5 py-4 rounded-sm border" style={{ borderColor: C.border }}>
                    <svg className="mt-0.5 h-5 w-5 shrink-0" style={{ color: C.accent }} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-bold" style={{ color: C.fg }}>Direccion</p>
                      <p className="mt-0.5 text-sm" style={{ color: C.muted }}>Av. Tiradentes casi esq. Roberto Pastoriza #10, Ensanche Naco, Santo Domingo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 px-5 py-4 rounded-sm border" style={{ borderColor: C.border }}>
                    <svg className="mt-0.5 h-5 w-5 shrink-0" style={{ color: C.accent }} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-bold" style={{ color: C.fg }}>Horario</p>
                      <p className="mt-0.5 text-sm" style={{ color: C.muted }}>Lunes a Domingo 24 horas, todos los dias del ano</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-sm shadow-xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d946.3306634883805!2d-69.932028!3d18.473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf8900504d99ab%3A0x7168af1f3235ed70!2sTACONAZO!5e0!3m2!1sen!2sdo!4v1"
                    width="100%" height="320" style={{ border: 0 }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    title="Taconazo24 location on Google Maps"
                  />
                </div>
                <div className="rounded-sm px-5 py-4 text-white" style={{ backgroundColor: C.green }}>
                  <p className="font-[var(--font-bangers)] text-2xl leading-none">4.<Counter n={9} /></p>
                  <p className="mt-1 text-xs font-semibold text-white/70">7,<Counter n={319} /> reviews</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 md:py-40 text-center relative overflow-hidden" style={{ backgroundColor: C.accent }}>
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at center, white, transparent 70%)" }} />
          <div className="mx-auto max-w-3xl px-6 relative z-10">
            <h2 className="font-[var(--font-bangers)] text-[clamp(3rem,8vw,5rem)] leading-[0.9] text-white text-balance">
              El mejor taco te espera
            </h2>
            <p className="mx-auto mt-6 max-w-md text-base text-white/70">
              Abierto 24/7. Tortillas artesanales, sin gluten.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#menu"
                className="inline-flex items-center rounded-full bg-white px-8 py-4 text-sm font-bold transition-all hover:opacity-90"
                style={{ color: C.accent }}
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
      </main>

      <footer className="py-16" style={{ backgroundColor: C.dark, color: "#fff" }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h4 className="font-[var(--font-bangers)] text-3xl tracking-tight text-white">
                Taconazo<span style={{ color: C.accent }}>24</span>
              </h4>
              <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                Tortillas artesanales hechas al momento, sin gluten. Abierto 24 horas, todos los dias.
              </p>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold tracking-wider uppercase" style={{ color: C.accent }}>Horario y Direccion</p>
              <div className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                <p className="flex items-center gap-2">
                  <svg className="h-4 w-4 shrink-0" style={{ color: C.accent }} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>24 horas, 7 dias a la semana</span>
                </p>
                <p className="flex items-start gap-2">
                  <svg className="h-4 w-4 shrink-0 mt-0.5" style={{ color: C.accent }} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span>Av. Tiradentes esq. Roberto Pastoriza #10, Santo Domingo</span>
                </p>
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold tracking-wider uppercase" style={{ color: C.accent }}>Redes</p>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/taconazo24"
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-full px-5 py-3 text-xs font-bold text-white transition-all hover:opacity-80"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@taconazo247"
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-full px-5 py-3 text-xs font-bold text-white transition-all hover:opacity-80"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 text-center text-xs" style={{ color: "rgba(255,255,255,0.3)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p>2026 Taconazo24. Hecho con amor en Santo Domingo.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
