export interface MenuItem {
  id: string;
  name: string;
  price: number;
  desc: string;
  badge?: "Mas Pedido" | "Signature";
  category: MenuCategory;
  dietary: Dietary[];
}

export type MenuCategory = "tacos" | "burritos" | "quesadillas" | "tostadas" | "bebidas";
export type Dietary = "gluten-free" | "vegetarian" | "spicy";

export const menuData: MenuItem[] = [
  { id: "t1", name: "Tacos al Pastor",      price: 295, desc: "Adobo-marinated pork, grilled pineapple, fresh cilantro & onion", badge: "Mas Pedido", category: "tacos", dietary: ["gluten-free"] },
  { id: "t2", name: "Tacos de Birria",      price: 395, desc: "Slow-cooked beef in aromatic chile broth, consome for dipping", badge: "Signature", category: "tacos", dietary: ["gluten-free"] },
  { id: "t3", name: "Tacos de Carne Asada", price: 350, desc: "Grilled flank steak, guacamole, pico de gallo", category: "tacos", dietary: ["gluten-free"] },
  { id: "t4", name: "Tacos de Pollo",       price: 250, desc: "Achiote chicken, pickled red onions, crema", category: "tacos", dietary: ["gluten-free"] },
  { id: "t5", name: "Tacos de Pescado",     price: 395, desc: "Beer-battered fish, cabbage slaw, chipotle crema", category: "tacos", dietary: ["gluten-free"] },
  { id: "t6", name: "Tacos Vegetarianos",   price: 225, desc: "Grilled vegetables, black beans, queso fresco", category: "tacos", dietary: ["gluten-free", "vegetarian"] },
  { id: "b1", name: "Burrito Supreme",      price: 450, desc: "Choice of meat, rice, beans, cheese, guacamole, crema", category: "burritos", dietary: [] },
  { id: "b2", name: "Burrito de Carne",     price: 395, desc: "Seasoned beef, rice, beans, pico de gallo", category: "burritos", dietary: [] },
  { id: "b3", name: "Burrito de Pollo",     price: 350, desc: "Grilled chicken, rice, black beans, salsa verde", category: "burritos", dietary: [] },
  { id: "b4", name: "Burrito Vegetariano",  price: 295, desc: "Rice, beans, grilled vegetables, guacamole", category: "burritos", dietary: ["vegetarian"] },
  { id: "q1", name: "Quesadilla de Queso",  price: 195, desc: "Oaxaca cheese, hand-pressed corn tortilla", category: "quesadillas", dietary: ["vegetarian"] },
  { id: "q2", name: "Quesadilla de Pollo",  price: 295, desc: "Shredded chicken, Oaxaca cheese, epazote", category: "quesadillas", dietary: ["gluten-free"] },
  { id: "q3", name: "Quesadilla de Carne",  price: 350, desc: "Picadillo, Oaxaca cheese, roasted rajas", category: "quesadillas", dietary: [] },
  { id: "q4", name: "Quesadilla de Hongos", price: 275, desc: "Sauteed mushrooms, Oaxaca cheese, truffle oil", category: "quesadillas", dietary: ["vegetarian"] },
  { id: "to1", name: "Tostada de Ceviche",  price: 350, desc: "Fresh shrimp ceviche, avocado, tomatillo salsa", category: "tostadas", dietary: ["gluten-free"] },
  { id: "to2", name: "Tostada de Tinga",    price: 295, desc: "Shredded chicken in chipotle, crema, avocado", category: "tostadas", dietary: ["gluten-free"] },
  { id: "d1", name: "Horchata",             price: 150, desc: "Cinnamon rice milk, ice cold", category: "bebidas", dietary: ["vegetarian"] },
  { id: "d2", name: "Jamaica",              price: 120, desc: "Chilled hibiscus flower tea", category: "bebidas", dietary: ["vegetarian"] },
  { id: "d3", name: "Cerveza Fria",         price: 175, desc: "Mexican lager, served icy", category: "bebidas", dietary: [] },
];

export const categoryLabels: Record<MenuCategory, string> = {
  tacos: "Tacos",
  burritos: "Burritos",
  quesadillas: "Quesadillas",
  tostadas: "Tostadas",
  bebidas: "Bebidas",
};

export const testimonials = [
  { name: "Maria G.", text: "Los mejores tacos de Santo Domingo. La birria es increible y las tortillas artesanales son otro nivel.", rating: 5 },
  { name: "Carlos R.", text: "Abierto 24 horas con la misma calidad siempre. Perfecto para llegar despues de una noche larga.", rating: 5 },
  { name: "Ana P.", text: "Sin gluten y delicioso. Finalmente un lugar donde puedo comer tacos sin preocuparme.", rating: 5 },
  { name: "Jose M.", text: "El pastor esta espectacular. El sabor de la plancha es autentico, como en Mexico.", rating: 5 },
  { name: "Laura S.", text: "Las quesadillas de hongos con trufa son una locura. No esperaba ese nivel en Santo Domingo.", rating: 5 },
  { name: "Pedro R.", text: "A las 3am con antojo de tacos y este lugar me salvo la noche. Siempre fresco, siempre bueno.", rating: 5 },
];

export const galleryImgs = [
  { src: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=85", alt: "Tacos al pastor on a griddle" },
  { src: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=85", alt: "Handmade tortillas being prepared" },
  { src: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=800&q=85", alt: "Colorful taco platter" },
  { src: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=85", alt: "Birria tacos with consome" },
  { src: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=800&q=85", alt: "Fresh guacamole" },
  { src: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=800&q=85", alt: "Classic margarita cocktail" },
  { src: "https://images.unsplash.com/photo-1566741103436-2f1b0b5b1b1b?auto=format&fit=crop&w=800&q=85", alt: "Mexican street food setup" },
  { src: "https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=800&q=85", alt: "Close up of tacos" },
];
