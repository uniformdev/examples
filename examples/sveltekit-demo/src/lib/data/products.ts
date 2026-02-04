export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  tagline: string;
  shortDescription: string;
  description: string;
  image: string;
  price: number;
  specs: {
    label: string;
    value: string;
  }[];
  features: string[];
  color?: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  tagline: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    name: "Neural",
    slug: "neural",
    description: "Brain-computer interfaces that expand human potential",
    tagline: "Think different. Literally.",
    productCount: 2
  },
  {
    name: "Vision",
    slug: "vision",
    description: "AR and holographic displays that reshape reality",
    tagline: "See what's possible.",
    productCount: 2
  },
  {
    name: "Ambient",
    slug: "ambient",
    description: "Invisible computing that surrounds you",
    tagline: "Technology that disappears.",
    productCount: 2
  }
];

export const products: Product[] = [
  {
    id: "neural-band-pro",
    name: "Neural Band Pro",
    category: "Neural",
    categorySlug: "neural",
    tagline: "Your thoughts, amplified.",
    shortDescription: "Non-invasive neural interface with thought-to-action capabilities",
    description: "Neural Band Pro represents the next evolution in human-computer interaction. Using advanced bio-sensing technology, it reads neural patterns with unprecedented accuracy, allowing you to control devices, communicate, and create using only your thoughts. Zero latency. Zero friction. Pure intention.",
    image: "/images/product-neural-band.png",
    price: 1299,
    specs: [
      { label: "Neural Resolution", value: "256 channels" },
      { label: "Latency", value: "< 5ms" },
      { label: "Battery Life", value: "18 hours" },
      { label: "Weight", value: "42g" },
      { label: "Connectivity", value: "Neural Mesh 3.0" },
      { label: "Materials", value: "Titanium, Bio-silk" }
    ],
    features: [
      "Thought-to-text at 120 WPM",
      "Gesture-free device control",
      "Dream recording capability",
      "Meditation enhancement mode",
      "Universal app compatibility"
    ],
    color: "Moonlight"
  },
  {
    id: "haptic-ring",
    name: "Haptic Ring",
    category: "Neural",
    categorySlug: "neural",
    tagline: "Feel the digital world.",
    shortDescription: "Precision haptic feedback ring for immersive interaction",
    description: "The Haptic Ring brings touch to the touchless. With 360-degree haptic feedback and sub-millimeter gesture tracking, it lets you feel textures, resistance, and boundaries in virtual spaces. Stack multiple rings for full-hand immersion.",
    image: "/images/product-haptic-ring.png",
    price: 449,
    specs: [
      { label: "Haptic Points", value: "128 actuators" },
      { label: "Gesture Accuracy", value: "0.1mm" },
      { label: "Battery Life", value: "72 hours" },
      { label: "Weight", value: "8g" },
      { label: "Sizes", value: "5-14 (auto-adjust)" },
      { label: "Water Resistance", value: "IPX8" }
    ],
    features: [
      "Texture simulation",
      "Force feedback up to 2N",
      "Air-writing recognition",
      "Stackable multi-ring mode",
      "Health monitoring sensors"
    ],
    color: "Titanium"
  },
  {
    id: "aura-glasses",
    name: "Aura Glasses",
    category: "Vision",
    categorySlug: "vision",
    tagline: "Reality, reimagined.",
    shortDescription: "Weightless AR glasses with all-day style",
    description: "Aura Glasses blur the line between digital and physical. With edge-to-edge AR display, spatial audio, and frames lighter than your sunglasses, they're the first AR device you'll actually want to wear. All day. Every day.",
    image: "/images/product-aura-glasses.png",
    price: 1799,
    specs: [
      { label: "Display", value: "4K per eye, 120° FOV" },
      { label: "Transparency", value: "95% clear mode" },
      { label: "Battery Life", value: "14 hours" },
      { label: "Weight", value: "38g" },
      { label: "Audio", value: "Spatial Whisper Array" },
      { label: "Prescription", value: "Auto-adjusting lenses" }
    ],
    features: [
      "Real-time translation overlay",
      "Navigation arrows in vision",
      "Face recognition with context",
      "Seamless video calls",
      "Privacy mode with one tap"
    ],
    color: "Clear"
  },
  {
    id: "holo-projector",
    name: "Holo Projector",
    category: "Vision",
    categorySlug: "vision",
    tagline: "Your space, transformed.",
    shortDescription: "Portable holographic display for any surface",
    description: "The Holo Projector turns any room into a canvas for the impossible. Project interactive 3D holograms that you can walk around, manipulate, and share. No headset required. Just pure, floating light.",
    image: "/images/product-holo-projector.png",
    price: 2499,
    specs: [
      { label: "Projection Volume", value: "2m³" },
      { label: "Resolution", value: "8K equivalent" },
      { label: "Viewing Angles", value: "360° walk-around" },
      { label: "Brightness", value: "5,000 nits" },
      { label: "Multi-user", value: "Up to 12 viewers" },
      { label: "Setup Time", value: "Instant" }
    ],
    features: [
      "Hand gesture interaction",
      "Multi-projector sync",
      "Record and playback moments",
      "3D video calling",
      "Ambient lighting mode"
    ],
    color: "Silver"
  },
  {
    id: "ambient-sphere",
    name: "Ambient Sphere",
    category: "Ambient",
    categorySlug: "ambient",
    tagline: "Sound without boundaries.",
    shortDescription: "Levitating speaker with room-filling spatial audio",
    description: "The Ambient Sphere defies gravity and expectations. Magnetically suspended and acoustically perfect, it fills your space with sound that seems to come from everywhere and nowhere. It's not a speaker. It's an atmosphere.",
    image: "/images/product-ambient-sphere.png",
    price: 899,
    specs: [
      { label: "Audio", value: "360° Spatial, 120dB" },
      { label: "Drivers", value: "12 directional units" },
      { label: "Levitation Height", value: "15mm" },
      { label: "Battery", value: "24 hours (sphere)" },
      { label: "Room Calibration", value: "AI-adaptive" },
      { label: "Connectivity", value: "WiFi 7, BT 6.0" }
    ],
    features: [
      "Magnetic levitation base",
      "Mood-responsive lighting",
      "Voice isolation for calls",
      "Multi-room orchestration",
      "Lossless hi-res audio"
    ],
    color: "Pearl"
  },
  {
    id: "quantum-hub",
    name: "Quantum Hub",
    category: "Ambient",
    categorySlug: "ambient",
    tagline: "Intelligence, distributed.",
    shortDescription: "Home quantum computing node with edge AI",
    description: "The Quantum Hub brings quantum-accelerated computing to your home. It processes AI tasks locally, ensures unhackable encryption, and connects all your Cherry devices with zero-latency mesh networking. The brain your smart home deserves.",
    image: "/images/product-quantum-hub.png",
    price: 3499,
    specs: [
      { label: "Qubits", value: "128 logical" },
      { label: "AI Cores", value: "Neural Engine X" },
      { label: "Local Storage", value: "64TB holographic" },
      { label: "Encryption", value: "Quantum-safe" },
      { label: "Device Limit", value: "Unlimited" },
      { label: "Power", value: "45W typical" }
    ],
    features: [
      "Quantum-encrypted backups",
      "On-device AI processing",
      "Predictive home automation",
      "Family privacy zones",
      "Self-healing network mesh"
    ],
    color: "Obsidian"
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p => p.categorySlug === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}
