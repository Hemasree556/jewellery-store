import { Product, Collection, Service, BlogPost, FAQ, Testimonial } from "./types";

// Import custom generated luxury images
import heroBanner from "./assets/images/hero_banner_jewelry_1781080087752.png";
import bridalShowcase from "./assets/images/bridal_jewelry_showcase_1781080106145.png";
import artisanWorkshop from "./assets/images/jewelry_artisan_workshop_1781080124218.png";

export const IMAGES = {
  heroBanner,
  bridalShowcase,
  artisanWorkshop,
};

export const COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    title: "Bridal Collection",
    description: "Opulent handcrafted masterpieces featuring majestic diamonds and gold settings, made for your unforgettable days.",
    imageUrl: bridalShowcase,
    tag: "Bridal"
  },
  {
    id: "col-2",
    title: "Diamond Collection",
    description: "Dazzling solitaire rings, custom cut ear studs, and glittering cuffs featuring certified flawless diamonds.",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    tag: "Diamond"
  },
  {
    id: "col-3",
    title: "Gold Collection",
    description: "Timeless 22K yellow and signature 18K rose gold creations combining ancient classical motifs with modern style.",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
    tag: "Gold"
  },
  {
    id: "col-4",
    title: "Silver Collection",
    description: "Sleek sterling silver ornaments finished with rhodium protection. Modern design meets minimalist daily wear.",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    tag: "Silver"
  },
  {
    id: "col-5",
    title: "Contemporary Collection",
    description: "Asymmetrical clean geometric designs, lightweight bands, and layered chains for the fashionable modern standard.",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    tag: "Contemporary"
  },
  {
    id: "col-6",
    title: "Heritage Collection",
    description: "Exceptional handcrafted antique jewelry celebrating decades of deep culture, intricate temple crafts, and legacy.",
    imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
    tag: "Heritage"
  },
  {
    id: "col-7",
    title: "pink stone Collection",
    description: "enchanting the elegance of pink stone with hold of gold.",
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
    tag: "Emerald"
  },
  {
    id: "col-8",
    title: "Royal Sapphire Collection",
    description: "Breathtaking selections of deep Ceylon blue sapphires set in custom platinum, representing loyalty, wisdom, and royalty.",
    imageUrl: "https://images.unsplash.com/photo-1605100803063-e200f1930014?q=80&w=800&auto=format&fit=crop",
    tag: "Sapphire"
  },
  {
    id: "col-9",
    title: "Blush Rose & Ruby Collection",
    description: "Flattering pink morganite, vivid red rubies, and delicate pink sapphires enveloped in 18K warm rose gold frames.",
    imageUrl: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop",
    tag: "Ruby"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "p-1",
    name: "Aura Solitaire Diamond Ring",
    description: "A breathtaking oval-cut solitaire diamond mounted in a polished 18K white gold four-prong setting, demonstrating spectacular clarity and light play.",
    price: 4950,
    category: "Rings",
    subCategory: "Diamond",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    metal: "18K White Gold",
    gems: "Flawless Oval Diamond",
    rating: 4.9,
    reviewsCount: 46,
    isPopular: true
  },
  {
    id: "p-2",
    name: "Isadora Royal Emerald Pendant Necklace",
    description: "A breathtaking statement necklace starring a pear-shaped Colombian emerald centerpiece suspended gracefully from a ribbon-chain of white gold.",
    price: 12400,
    category: "Necklaces",
    subCategory: "Emerald",
    imageUrl: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop",
    metal: "18K Yellow Gold",
    gems: "Colombian Emerald & Diamonds",
    rating: 5.0,
    reviewsCount: 32,
    isPopular: true
  },
  {
    id: "p-3",
    name: "Kalyani Antique Gold Bangles",
    description: "Intricately carved 22K yellow gold temple-style kadas featuring hand-engraved representations of traditional heritage patterns.",
    price: 3600,
    category: "Bangles",
    subCategory: "Gold",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
    metal: "22K Gold",
    gems: "Ruby Accent Insets",
    rating: 4.8,
    reviewsCount: 22,
    isPopular: false
  },
  {
    id: "p-4",
    name: "Celestia Diamond Hoop Earrings",
    description: "Timeless hoop earrings lined with continuous pavé-set round diamonds inside and out, maximizing brilliance from every orientation.",
    price: 2200,
    category: "Earrings",
    subCategory: "Diamond",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    metal: "Platinum",
    gems: "VVS1 Round Diamonds",
    rating: 4.9,
    reviewsCount: 54,
    isPopular: true
  },
  {
    id: "p-5",
    name: "Amara Rose Gold Emerald Ring",
    description: "A brilliant cushion-cut Colombian green emerald haloed by brilliant micro-diamonds, resting on a polished dual-band of 18K rose gold.",
    price: 3850,
    category: "Rings",
    subCategory: "Emerald",
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
    metal: "18K Rose Gold",
    gems: "Colombian Emerald",
    rating: 4.8,
    reviewsCount: 19,
    isPopular: false
  },
  {
    id: "p-6",
    name: "Varanasi Bridal Solitaire Choker",
    description: "A spectacular bridal masterpiece highlighting a tier of diamonds, teardrop emerald danglers, and master-crafted gold wire weaving.",
    price: 18500,
    category: "Bridal Sets",
    subCategory: "Bridal",
    imageUrl: bridalShowcase,
    metal: "22K Gold & Platinum",
    gems: "Perfect Hearts & Arrows Cut",
    rating: 5.0,
    reviewsCount: 15,
    isPopular: true
  },
  {
    id: "p-7",
    name: "Contemporary Linear Silver Drop Studs",
    description: "Deconstructivist linear silver earrings composed of interlocking clean lines, dangling with solid structural flow. Finished with Rhodium.",
    price: 320,
    category: "Earrings",
    subCategory: "Silver",
    imageUrl: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
    metal: "Sterling Silver",
    gems: "Moissanite Core",
    rating: 4.6,
    reviewsCount: 29,
    isPopular: false
  },
  {
    id: "p-8",
    name: "Sovereign Heritage Gold Band",
    description: "A solid wide luxury comfort-fit band showcasing traditional filigree patterns crafted meticulously by our fourth-generation gold artisans.",
    price: 1450,
    category: "Rings",
    subCategory: "Gold",
    imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
    metal: "22K Yellow Gold",
    gems: "None",
    rating: 4.8,
    reviewsCount: 41,
    isPopular: false
  },
  {
    id: "p-9",
    name: "Princess Royal Sapphire Ring",
    description: "A majestic, oval-cut, vivid blue Ceylon sapphire set on premium platinum, flanked by micro-pavé diamonds on the shoulders.",
    price: 6800,
    category: "Rings",
    subCategory: "Sapphire",
    imageUrl: "https://images.unsplash.com/photo-1605100803063-e200f1930014?q=80&w=800&auto=format&fit=crop",
    metal: "Platinum",
    gems: "Ceylon Blue Sapphire",
    rating: 4.9,
    reviewsCount: 38,
    isPopular: true
  },
  {
    id: "p-10",
    name: "Rosaline Blush Pink Morganite Ring",
    description: "A rare sweet-pink morganite cushion gemstone flanked by brilliant pink round-cut diamonds on an 18K rose gold braided band.",
    price: 3100,
    category: "Rings",
    subCategory: "Ruby",
    imageUrl: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop",
    metal: "18K Rose Gold",
    gems: "Blush Pink Morganite",
    rating: 4.8,
    reviewsCount: 25,
    isPopular: false
  },
  {
    id: "p-11",
    name: "Burmese Ruby Choker Necklace",
    description: "A glamorous statement piece featuring oval-cut Burmese red rubies aligned alternatingly with pristine pear-cut GIA diamonds.",
    price: 15400,
    category: "Necklaces",
    subCategory: "Ruby",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    metal: "18K White Gold",
    gems: "Burmese Red Rubies & Diamonds",
    rating: 4.9,
    reviewsCount: 14,
    isPopular: true
  },
  {
    id: "p-12",
    name: "Imperial Emerald Drop Earrings",
    description: "Vibrant pear-cut Colombian emeralds suspended gracefully from diamond-encrusted platinum stems, creating the ultimate aesthetic.",
    price: 5200,
    category: "Earrings",
    subCategory: "Emerald",
    imageUrl: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
    metal: "Platinum",
    gems: "Colombian Emerald Drops",
    rating: 4.9,
    reviewsCount: 18,
    isPopular: false
  },
  {
    id: "p-13",
    name: "Duchess Sapphire Chevron Necklace",
    description: "A magnificent chevron-style necklace dripping with a gradient of Royal Blue Ceylon sapphires alternating with fine-cut diamonds.",
    price: 13900,
    category: "Necklaces",
    subCategory: "Sapphire",
    imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&auto=format&fit=crop",
    metal: "18K White Gold",
    gems: "Ceylon Blue Sapphires",
    rating: 5.0,
    reviewsCount: 9,
    isPopular: true
  },
  {
    id: "p-14",
    name: "Elysian Pearl & Diamond Studs",
    description: "Flawless, perfectly spherical Japanese Akoya pearls set above single brilliant round diamonds, offering a quiet, understated statement dress code.",
    price: 1800,
    category: "Earrings",
    subCategory: "Silver",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    metal: "18K Yellow Gold",
    gems: "Natural Akoya Pearls & Diamonds",
    rating: 4.7,
    reviewsCount: 31,
    isPopular: false
  },
  {
    id: "p-15",
    name: "Empress Ruby Solitaire Bangle",
    description: "An opulent open-end luxury bangle featuring dual teardrop Burmese rubies on each terminal, supported by marquise-cut GIA diamonds.",
    price: 9800,
    category: "Bangles",
    subCategory: "Ruby",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
    metal: "18K Yellow Gold",
    gems: "Burmese Rubies & Marquise Diamonds",
    rating: 4.9,
    reviewsCount: 22,
    isPopular: true
  },
  {
    id: "p-16",
    name: "Minimalist Stackable Diamond Band",
    description: "An essential contemporary luxury piece. Extremely slender, hand-hammered stackable bands covered in conflict-free micro pavé diamonds.",
    price: 1250,
    category: "Rings",
    subCategory: "Contemporary",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    metal: "18K Gold",
    gems: "Micro-Pavé Conflict-Free Diamonds",
    rating: 4.5,
    reviewsCount: 16,
    isPopular: false
  }
];

export const WHY_CHOOSE_US = [
  {
    title: "Authentic Materials",
    description: "Every item ships with GIA, IGI, or BIS certifications guaranteeing 100% metal purity and premium gemstone grade.",
    icon: "ShieldCheck"
  },
  {
    title: "Handcrafted Excellence",
    description: "Meticulously shaped in our atelier by certified master artisans with centuries of collective heirloom design experience.",
    icon: "Sparkles"
  },
  {
    title: "Custom Designs",
    description: "Participate in 1-on-1 collaborative workshops directly with jewelry designers to sketch and print your dream piece.",
    icon: "Milestone"
  },
  {
    title: "Secure Shopping",
    description: "Insured end-to-end checkout with secure SSL payment systems and global high-value transit carrier insurance.",
    icon: "Lock"
  },
  {
    title: "Nationwide Delivery",
    description: "Discreet luxury packaging delivered via express armoured shipment direct to your door with real-time tracking.",
    icon: "Truck"
  },
  {
    title: "Lifetime Support",
    description: "Complementary annual cleaning, gemstone tightening inspection, and resizing, protecting your investment for generations.",
    icon: "HeartHandshake"
  }
];

export const SERVICES: Service[] = [
  {
    id: "s-1",
    name: "Custom Jewelry Design",
    description: "Watch your unique vision come alive under our sketch pads. Custom gems choice, 3D wax prototyping, and bespoke casting tailored precisely to your personal story.",
    iconName: "PenTool"
  },
  {
    id: "s-2",
    name: "Bridal Jewelry Consultation",
    description: "Schedule private champagne sessions in our showrooms. Let our luxury bridal stylists harmonize crowns, necklaces, and rings with your wedding attire.",
    iconName: "Flower2"
  },
  {
    id: "s-3",
    name: "Jewelry Repair",
    description: "Scientific restoration of ancient heirlooms, professional prong replacement, intricate laser welding, and high-precision diamond resetting.",
    iconName: "Wrench"
  },
  {
    id: "s-4",
    name: "Jewelry Cleaning",
    description: "Complimentary deep chemical cleaning, ultrasonic wave soil extraction, and premium rhodium bathing to reinstate the initial showroom mirror gloss.",
    iconName: "Sparkling"
  },
  {
    id: "s-5",
    name: "Gemstone Consultation",
    description: "Examine internal inclusions and fire characteristics under microscope with our GIA-certified gemologists. Buy and source premium investment stones.",
    iconName: "Search"
  }
];

export const BLOGS: BlogPost[] = [
  {
    id: "b-1",
    title: "Jewelry Care Tips: Securing the Polish",
    description: "Dust, cosmetics, and seasonal conditions can gradually dull precious gold. Learn our professional tips to naturally preserve high-karat brightness at home.",
    category: "Maintenance",
    date: "Jun 02, 2026",
    readTime: "4 Min Read",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    author: "Elena Haara, Senior Restorer"
  },
  {
    title: "The Ultimate Diamond Buying Guide: Deciphering Fire",
    id: "b-2",
    description: "Beyond the elementary 4Cs, a diamond's intrinsic soul lies in cut proportions and scintillation. Discover how to identify a fire-focused stone.",
    category: "Guides",
    date: "May 25, 2026",
    readTime: "7 Min Read",
    imageUrl: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop",
    author: "Marcus Vance, Master Gemologist"
  },
  {
    title: "Bridal Jewelry Trends: From Heavy Traditional to Hybrid Luxe",
    id: "b-3",
    description: "Modern brides are moving towards versatile, detachable bridal jewelry that pairs seamlessly with traditional necklines and modern gowns.",
    category: "Trends",
    date: "Apr 18, 2026",
    readTime: "5 Min Read",
    imageUrl: bridalShowcase,
    author: "Sonia Chawla, Styling Lead"
  },
  {
    title: "Gold Investment Insights: Market Purity & Appreciation",
    id: "b-4",
    description: "Analyzing the historical security of precious metals. Why high-karat yellow gold remains one of the world's premier hedges against modern inflation.",
    category: "Investment",
    date: "Mar 10, 2026",
    readTime: "6 Min Read",
    imageUrl: "https://images.unsplash.com/photo-1610349372132-7ded6b55db52?q=80&w=800&auto=format&fit=crop",
    author: "Varada Hemasree, Founder"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "Charlotte & Arthur Evans",
    text: "HAARA created the perfect engagement ring. The interactive custom drawing process let us tweak the side halo under microscope. Absolute craftsmanship that exceeded our wild expectations.",
    rating: 5,
    role: "Bespoke Clients",
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "t-2",
    name: "Rohan & Devika Singhania",
    text: "The Varanasi heritage bridal collection was an absolute dream. Elegant, weight-distributed perfectly, and shone with incredible intensity during the evening stage lights.",
    rating: 5,
    role: "Bridal Clients",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "t-3",
    name: "Dr. Alistair Sterling",
    text: "We sourced custom diamond studs here as an inheritance gift. Their certified documentation exceeds the standards of top European boutiques. Exceptional hospitality and attention to precision.",
    rating: 5,
    role: "Collectors Circle",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
  }
];

export const FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "How do I customize jewelry with HAARA?",
    answer: "You can initiate customization by hitting the 'Design Consultation' or using our live AI assistant below. We provide an initial virtual sketching, build a highly precise 3D CAD visualization, create a detailed wax mockup, and proceed with custom melting, casting, and hand-setting precious metals."
  },
  {
    id: "faq-2",
    question: "Are your diamonds certified?",
    answer: "Absolutely. All diamonds above 0.3 carats come complete with independent certifying passports from prestigious laboratories like the Gemological Institute of America (GIA), International Gemological Institute (IGI) or native BIS Hallmark guarantees."
  },
  {
    id: "faq-3",
    question: "Do you offer professional resizing and repairs?",
    answer: "Yes, we possess a high-end in-house repair and laser welding shop. Our lifetime support includes complementary sizing checks, loose diamond prong tightening, custom structural repairs, and jewelry polishing."
  },
  {
    id: "faq-4",
    question: "What is your standard delivery timeline?",
    answer: "For in-stock catalog articles, standard fully insured luxury shipments arrive within 3 to 5 business days. Bespoke personalized or custom-casted jewelry generally requires 3 to 5 weeks to ensure rigorous quality controls."
  },
  {
    id: "faq-5",
    question: "Do you provide warranty coverage?",
    answer: "Yes, HAARA products carry a comprehensive Lifetime Authenticity and Manufacturing Defects Warranty. This safeguards any metal carving integrity, stone placement settings, and certified clasp durability."
  }
];
