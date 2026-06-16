import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  Milestone, 
  Lock, 
  Truck, 
  HeartHandshake, 
  Search, 
  Heart, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Moon, 
  Sun, 
  Send, 
  MessageSquare, 
  Menu, 
  X, 
  Star, 
  ArrowRight, 
  Sparkle, 
  Filter, 
  Check, 
  Wrench, 
  PenTool, 
  Flower2, 
  Laptop, 
  Info,
  CalendarCheck,
  ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  PRODUCTS, 
  COLLECTIONS, 
  WHY_CHOOSE_US, 
  SERVICES, 
  BLOGS, 
  TESTIMONIALS, 
  FAQS, 
  IMAGES 
} from "./data";
import { Product, RecommendationResponse } from "./types";
import { useAuth } from "./context/AuthContext";
import AuthModal from "./components/AuthModal";
import { doc, setDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";


export default function App() {
  const { user, profile, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPortalOpen, setIsPortalOpen] = useState<boolean>(false);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [loadingWishlist, setLoadingWishlist] = useState<boolean>(false);

  // Theme state
  const [isDark, setIsDark] = useState<boolean>(true);

  // Search, Filters & Selection states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeFaq, setActiveFaq] = useState<string | null>("faq-1");
  const [testimonialIndex, setTestimonialIndex] = useState<number>(0);

  // Core features states
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Bookings state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingFormData, setBookingFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Custom Jewelry Design",
    date: "",
    time: "11:00 AM",
    message: ""
  });
  const [isBookingConfirmed, setIsBookingConfirmed] = useState<boolean>(false);

  // Contact form state
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Consultation",
    message: ""
  });
  const [isContactSubmitted, setIsContactSubmitted] = useState<boolean>(false);

  // AI Recommendation Assistant states
  const [aiStep, setAiStep] = useState<number>(1);
  const [aiPayload, setAiPayload] = useState({
    category: "Rings",
    metalType: "18K Gold",
    occasion: "Bespoke Bridal",
    budgetRange: "Premium ($2,000 - $5,000)",
    preference: ""
  });
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<RecommendationResponse | null>(null);
  const [aiTipIndex, setAiTipIndex] = useState<number>(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);

  // Animated counters on mount
  const [countCustomers, setCountCustomers] = useState<number>(9200);
  const [countDesigns, setCountDesigns] = useState<number>(410);
  const [countYears, setCountYears] = useState<number>(0);
  const [countSatisfaction, setCountSatisfaction] = useState<number>(80);

  // WhatsApp chat bubble state
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);
  const [whatsAppText, setWhatsAppText] = useState<string>("Hi HAARA Concierge, I’d like to enquire about bespoke bridal collections...");

  // Load wishlist and bookings if user is signed in
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        // Fallback to local storage for guest wishlist
        const localWish = localStorage.getItem("haara_wishlist");
        if (localWish) {
          try {
            setWishlist(JSON.parse(localWish));
          } catch (e) {
            console.error("Error parsing local wishlist:", e);
          }
        } else {
          setWishlist([]);
        }
        setUserBookings([]);
        return;
      }

      setLoadingWishlist(true);
      setLoadingBookings(true);

      try {
        // Fetch wishlist items from Firestore subcollection /users/{uid}/wishlist
        const wishRef = collection(db, "users", user.uid, "wishlist");
        const wishSnap = await getDocs(wishRef);
        const fbWishlist: Product[] = [];
        wishSnap.forEach((docSnap) => {
          const data = docSnap.data();
          // Find matching design product from PRODUCTS array to retain consistency
          const matchedProduct = PRODUCTS.find((p) => p.id === data.productId);
          if (matchedProduct) {
            fbWishlist.push(matchedProduct);
          }
        });

        // Merge existing local guest wishlist to Firebase on login if any
        const localWish = localStorage.getItem("haara_wishlist");
        let finalWishlist = fbWishlist;
        if (localWish) {
          try {
            const guestItems: Product[] = JSON.parse(localWish);
            for (const item of guestItems) {
              if (!fbWishlist.some((fb) => fb.id === item.id)) {
                // Add to Firestore
                await setDoc(doc(db, "users", user.uid, "wishlist", item.id), {
                  productId: item.id,
                  name: item.name,
                  price: item.price,
                  imageUrl: item.imageUrl,
                  addedAt: new Date().toISOString()
                });
                finalWishlist.push(item);
              }
            }
            localStorage.removeItem("haara_wishlist");
          } catch (e) {
            console.error("Error merging guest wishlist:", e);
          }
        }

        setWishlist(finalWishlist);

        // Fetch bookings for logged-in user
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("userId", "==", user.uid));
        const bookingSnap = await getDocs(q);
        const bookingsList: any[] = [];
        bookingSnap.forEach((docSnap) => {
          bookingsList.push(docSnap.data());
        });
        // Sort bookings locally by newest first
        bookingsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setUserBookings(bookingsList);

      } catch (err) {
        console.error("Error fetching user data from Firestore:", err);
      } finally {
        setLoadingWishlist(false);
        setLoadingBookings(false);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    // Customers counter
    const customerInterval = setInterval(() => {
      setCountCustomers(prev => {
        if (prev >= 10000) {
          clearInterval(customerInterval);
          return 10000;
        }
        return prev + 40;
      });
    }, 10);

    // Designs counter
    const designInterval = setInterval(() => {
      setCountDesigns(prev => {
        if (prev >= 500) {
          clearInterval(designInterval);
          return 500;
        }
        return prev + 5;
      });
    }, 20);

    // Years counter
    const yearsInterval = setInterval(() => {
      setCountYears(prev => {
        if (prev >= 15) {
          clearInterval(yearsInterval);
          return 15;
        }
        return prev + 1;
      });
    }, 100);

    // Satisfaction counter
    const satisfactionInterval = setInterval(() => {
      setCountSatisfaction(prev => {
        if (prev >= 98) {
          clearInterval(satisfactionInterval);
          return 98;
        }
        return prev + 1;
      });
    }, 50);

    return () => {
      clearInterval(customerInterval);
      clearInterval(designInterval);
      clearInterval(yearsInterval);
      clearInterval(satisfactionInterval);
    };
  }, []);

  // AI Loading tips interval
  useEffect(() => {
    let interval: any;
    if (aiLoading) {
      interval = setInterval(() => {
        setAiTipIndex(prev => (prev + 1) % 4);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [aiLoading]);

  const conciergeTips = [
    "Did you know? 18 Karat Yellow Gold contains 75% pure gold, rendering it perfect for luxury everyday scintillation.",
    "Certified flawless diamonds must exhibit complete light-scintillation matching GIA strict proportions.",
    "Bespoke casting takes up to 4 weeks since our master craftsmen carve prototype models in custom organic wax.",
    "Silver coated with premium Rhodium blocks oxidation, securing a durable platinum-like mirror output."
  ];

  // Helper trigger to scroll to sections
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Wishlist handler
  const toggleWishlist = async (product: Product) => {
    const isAdded = wishlist.some(item => item.id === product.id);
    let updated: Product[];

    if (isAdded) {
      updated = wishlist.filter(item => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }

    setWishlist(updated);

    if (user) {
      try {
        const itemDoc = doc(db, "users", user.uid, "wishlist", product.id);
        if (isAdded) {
          await deleteDoc(itemDoc);
        } else {
          await setDoc(itemDoc, {
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            addedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error("Error syncing wishlist item to Firestore:", err);
      }
    } else {
      localStorage.setItem("haara_wishlist", JSON.stringify(updated));
    }
  };

  // Appointment Submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingConfirmed(true);

    const bookingId = "book_" + Math.random().toString(36).substring(2, 11);
    const newBooking = {
      bookingId,
      userId: user?.uid || "guest",
      name: bookingFormData.name,
      email: bookingFormData.email,
      phone: bookingFormData.phone,
      service: bookingFormData.service,
      date: bookingFormData.date,
      time: bookingFormData.time,
      message: bookingFormData.message,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "bookings", bookingId), newBooking);
      if (user) {
        setUserBookings(prev => [newBooking, ...prev]);
      }
    } catch (err) {
      console.error("Error saving booking appointment:", err);
    }

    setTimeout(() => {
      setIsBookingConfirmed(false);
      setIsBookingModalOpen(false);
      setBookingFormData({
        name: "",
        email: "",
        phone: "",
        service: "Custom Jewelry Design",
        date: "",
        time: "11:00 AM",
        message: ""
      });
    }, 4500);
  };

  // Contact Form Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSubmitted(true);

    const inquiryId = "inq_" + Math.random().toString(36).substring(2, 11);
    const newInquiry = {
      inquiryId,
      name: contactFormData.name,
      email: contactFormData.email,
      phone: contactFormData.phone,
      service: contactFormData.service,
      message: contactFormData.message,
      userId: user?.uid || "guest",
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "inquiries", inquiryId), newInquiry);
    } catch (err) {
      console.error("Error saving contact inquiry:", err);
    }

    setTimeout(() => {
      setIsContactSubmitted(false);
      setContactFormData({
        name: "",
        email: "",
        phone: "",
        service: "Consultation",
        message: ""
      });
    }, 4000);
  };

  // AI Recommendation submit
  const consultAIRecommendations = async () => {
    setAiLoading(true);
    setAiTipIndex(0);
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiPayload)
      });
      const data = await response.json();
      setAiResponse(data);
      setAiStep(3); // Result view
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // Filter products based on category and search text
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory || product.subCategory === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.metal.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.gems && product.gems.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen font-sans ${isDark ? "bg-[#0F0F0F] text-[#FAF9F6] selection:bg-[#D4AF37] selection:text-[#0F0F0F]" : "bg-[#FAF9F6] text-[#0F0F0F] selection:bg-[#E6C68A] selection:text-[#0F0F0F]"}`}>
      
      {/* 1. Header & Navigation */}
      <nav id="header-nav" className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${isDark ? "bg-[#0F0F0F]/90 border-[#D4AF37]/20" : "bg-[#FAF9F6]/90 border-[#D4AF37]/40"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-serif font-semibold tracking-widest text-[#D4AF37] relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                HAARA
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </div>

            {/* Main Desktop Links */}
            <div className="hidden md:flex items-center space-x-8 text-[11px] uppercase tracking-[0.2em] font-medium font-sans">
              <button onClick={() => scrollToSection("about")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">About Us</button>
              <button onClick={() => scrollToSection("collections")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Collections</button>
              <button onClick={() => scrollToSection("catalog")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Catalog</button>
              <button onClick={() => scrollToSection("services")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Services</button>
              <button onClick={() => scrollToSection("ai-curator")} className="flex items-center space-x-1 text-[#D4AF37] hover:text-[#FAF9F6] transition-colors cursor-pointer font-semibold">
                <Sparkles className="w-3.5 h-3.5 mr-0.5" />
                <span>AI Curator</span>
              </button>
              <button onClick={() => scrollToSection("blogs")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Atelier Journal</button>
              <button onClick={() => scrollToSection("faqs")} className="hover:text-[#D4AF37] transition-colors cursor-pointer">FAQs</button>
            </div>

            {/* Utility actions */}
            <div className="flex items-center space-x-3.5">
              
              {/* Search Bar in Header */}
              <div className="relative hidden lg:block">
                <input 
                  type="text" 
                  placeholder="Search collections..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value) {
                      setSelectedCategory("All");
                      scrollToSection("catalog");
                    }
                  }}
                  className={`w-32 xl:w-44 pl-8 pr-3 py-1.5 rounded-none text-xs transition-all tracking-wide focus:outline-none focus:w-52 focus:ring-1 ${isDark ? "bg-[#1A1A1A] border border-[#D4AF37]/20 text-[#FAF9F6] focus:ring-[#D4AF37]" : "bg-[#F3F2EE] border border-[#D4AF37]/30 text-[#0F0F0F] focus:ring-[#D4AF37]"}`}
                />
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle visual theme"
                className={`p-2 rounded-none border transition-all cursor-pointer ${isDark ? "border-[#D4AF37]/20 hover:bg-[#D4AF37]/10 text-[#D4AF37]" : "border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 text-[#D4AF37]"}`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Wishlist Icon */}
              <button 
                onClick={() => setIsWishlistOpen(true)}
                aria-label="Toggle Wishlist Drawer"
                className="relative p-2 rounded-none border border-[#D4AF37]/20 hover:bg-[#D4AF37]/10 text-neutral-400 hover:text-[#D4AF37] transition-all cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${wishlist.length > 0 ? "fill-[#D4AF37] text-[#D4AF37]" : ""}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0F0F0F] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Authentication Button & Dropdown */}
              {!user ? (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-2 rounded-none border border-[#D4AF37]/25 hover:bg-[#D4AF37]/10 text-neutral-400 hover:text-[#D4AF37] transition-all cursor-pointer flex items-center space-x-1"
                >
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-[10px] uppercase tracking-widest font-sans font-bold hidden sm:inline">Sign In</span>
                </button>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setIsPortalOpen(!isPortalOpen)}
                    className="p-2 rounded-none border border-[#D4AF37]/25 hover:bg-[#D4AF37]/10 text-[#D4AF37] transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[10px] uppercase tracking-wider font-sans font-bold hidden sm:inline max-w-[80px] truncate">
                      {profile?.displayName?.split(" ")[0] || "Atelier"}
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isPortalOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isPortalOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute right-0 mt-2.5 w-64 p-5 shadow-2xl border border-[#D4AF37]/35 rounded-none z-50 text-left ${
                          isDark ? "bg-[#111111] text-[#FAF9F6]" : "bg-white text-[#0F0F0F]"
                        }`}
                      >
                        <div className="border-b border-dashed border-[#D4AF37]/25 pb-3 mb-4">
                          <span className="uppercase text-[9px] tracking-widest text-[#D4AF37] font-semibold block">
                            Atelier Member Portal
                          </span>
                          <p className="text-sm font-semibold truncate mt-1">
                            {profile?.displayName || user.displayName || "Atelier Member"}
                          </p>
                          <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <span className="uppercase text-[9px] tracking-widest text-[#D4AF37] opacity-85 font-semibold block">
                            My Consultations ({userBookings.length})
                          </span>
                          {userBookings.length === 0 ? (
                            <p className="text-[10px] text-neutral-500 italic">
                              No bespoke appointments booked.
                            </p>
                          ) : (
                            <div className="max-h-24 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                              {userBookings.map((b, idx) => (
                                <div
                                  key={idx}
                                  className={`p-2 border text-[10px] space-y-0.5 ${
                                    isDark ? "bg-[#1A1A1A] border-[#D4AF37]/10" : "bg-[#F9F8F6] border-[#D4AF37]/20"
                                  }`}
                                >
                                  <div className="flex items-center justify-between font-serif font-semibold text-[#D4AF37]">
                                    <span className="truncate max-w-[120px]">{b.service}</span>
                                    <span className="text-[8px] uppercase tracking-wider text-green-500">Confirmed</span>
                                  </div>
                                  <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                                    <span>{b.date}</span>
                                    <span>{b.time}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="border-t border-neutral-800/10 pt-3 flex flex-col space-y-1">
                            <button
                              onClick={() => {
                                setIsWishlistOpen(true);
                                setIsPortalOpen(false);
                              }}
                              className="w-full text-left text-[10px] uppercase tracking-widest py-1.5 text-neutral-400 hover:text-[#D4AF37] transition-all font-semibold flex items-center space-x-1.5"
                            >
                              <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Bespoke Wishlist ({wishlist.length})</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                logout();
                                setIsPortalOpen(false);
                              }}
                              className="w-full text-left text-[10px] uppercase tracking-widest py-1.5 text-red-400 hover:text-red-300 transition-all font-bold border-t border-neutral-800/20 mt-2 pt-2 block"
                            >
                              Sign Out Atelier
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Consultation Booking CTA */}
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-[#D4AF37] hover:bg-[#FAF9F6]/10 text-[#0F0F0F] hover:text-[#D4AF37] px-6 py-2.5 border border-[#D4AF37] rounded-none text-[11px] uppercase tracking-[0.2em] font-sans font-bold transition-all duration-300 cursor-pointer hidden md:block"
              >
                Book Appointment
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section id="hero" className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
        
        {/* Background Image backdrop with luxury overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.heroBanner} 
            alt="HAARA luxury collection" 
            className="w-full h-full object-cover filter brightness-[0.25] md:scale-105 transition-transform duration-10000 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F]/90 via-transparent to-[#0F0F0F]/90 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F]/60 via-[#0F0F0F]/10 to-[#0F0F0F]/95 z-10" />
        </div>

        {/* Decorative thin gold lines */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent z-20" />
        <div className="absolute inset-y-0 left-12 w-[1px] bg-[#D4AF37]/5 latent md:block z-20" />
        <div className="absolute inset-y-0 right-12 w-[1px] bg-[#D4AF37]/5 latent md:block z-20" />

        <div className="relative max-w-5xl mx-auto px-4 z-20 text-center py-20 flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8 flex items-center space-x-4 justify-center"
          >
            <span className="w-12 h-[1px] bg-[#D4AF37]"></span>
            <span className="uppercase text-[11px] tracking-[0.4em] text-[#D4AF37] font-semibold">EST. 2009 • HAARA ATELIER</span>
            <span className="w-12 h-[1px] bg-[#D4AF37]"></span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-5xl sm:text-7xl md:text-8xl font-serif tracking-[0.05em] leading-[1.1] text-[#FAF9F6] mb-8 font-light"
          >
            Where <br className="sm:hidden" />
            <span className="italic font-light">designs speaks</span> <br />
            <span className="text-[#D4AF37] font-normal">Elegance</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-[#FAF9F6]/75 text-sm sm:text-base max-w-lg tracking-wide mb-12 font-sans font-light leading-relaxed"
          >
            Discover exquisite jewelry collections designed to celebrate life's most precious moments with certified diamonds and handcrafted gold.
          </motion.p>

          {/* CTA Group */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center"
          >
            <button 
              onClick={() => scrollToSection("catalog")}
              className="bg-[#D4AF37] text-[#0F0F0F] px-10 py-4.5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#E6C68A] transition-colors border border-[#D4AF37] rounded-none cursor-pointer"
            >
              Shop Collection
            </button>
            <button 
              onClick={() => scrollToSection("ai-curator")}
              className="border border-[#D4AF37] text-[#D4AF37] px-10 py-4.5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#D4AF37]/10 transition-colors rounded-none cursor-pointer"
            >
              Book Consultation
            </button>
          </motion.div>

        </div>

        {/* Scroll helper removed */}
      </section>

      {/* 3. Our Expertise Stats - Integrated Counters */}
      <section id="expertise-stats" className={`py-16 border-y ${isDark ? "bg-[#0A0A0A] border-[#D4AF37]/20" : "bg-[#FAF9F6] border-[#D4AF37]/35"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            
            <div>
              <div className="text-3xl sm:text-5xl font-serif text-[#D4AF37] font-light mb-2">
                {countCustomers.toLocaleString()}+
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 mt-1 font-sans">Happy Clients</div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-serif text-[#D4AF37] font-light mb-2">
                {countDesigns}+
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 mt-1 font-sans">Custom Designs</div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-serif text-[#D4AF37] font-light mb-2">
                {countYears}+
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 mt-1 font-sans">Years Mastery</div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-serif text-[#D4AF37] font-light mb-2">
                {countSatisfaction}%
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 mt-1 font-sans">Satisfaction Rate</div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. About HAARA */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Premium Image Display */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-2 rounded-none border border-[#D4AF37]/35 scale-95 pr-2 pb-2 group-hover:scale-100 transition-transform duration-500 z-0"></div>
              <img 
                src={IMAGES.artisanWorkshop}
                alt="HAARA custom artisan workspace" 
                className="relative z-10 w-full h-[450px] object-cover shadow-2xl filter brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#0F0F0F]/90 border border-[#D4AF37]/35 p-4 z-20">
                <p className="text-[10px] uppercase font-serif tracking-[0.2em] text-[#D4AF37]">Authentic Atelier</p>
                <p className="text-xs text-[#FAF9F6]/80 font-sans mt-1">A glimpse into our private workshop where precious high-karat sets are hammered and detailed individually.</p>
              </div>
            </div>

            {/* Right side: Story & Vision */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="mb-4">
                <span className="text-[#D4AF37] text-xs uppercase tracking-[0.25em] font-semibold font-sans font-sans">The Legacy of HAARA</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif font-light mb-8 tracking-tight">
                About Our <span className="font-serif italic text-[#D4AF37]">House of Crafts</span>
              </h2>

              <p className="text-[#FAF9F6]/75 text-sm sm:text-base leading-relaxed mb-6 font-light">
                HAARA was birthed out of a desire to reconcile traditional handcrafted jewelry heritage with sleek, cutting-edge contemporary geometries. Founded by fourth-generation goldsmiths, each creation in our atelier carries deep-rooted stories.
              </p>

              {/* Mission & Vision Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
                <div className={`p-6 border rounded-none ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/20" : "bg-[#FAF9F6] border-[#D4AF37]/35"}`}>
                  <h3 className="text-[#D4AF37] font-serif text-lg uppercase tracking-wider mb-2 flex items-center space-x-2">
                    <Sparkle className="w-3.5 h-3.5" />
                    <span>Our Mission</span>
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    To deliver uncompromised luxury jewelry that protects physical heritage value while ensuring absolute material authenticity, tailored strictly to our customers' milestones.
                  </p>
                </div>

                <div className={`p-6 border rounded-none ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/20" : "bg-[#FAF9F6] border-[#D4AF37]/35"}`}>
                  <h3 className="text-[#D4AF37] font-serif text-lg uppercase tracking-wider mb-2 flex items-center space-x-2">
                    <Sparkle className="w-3.5 h-3.5" />
                    <span>Our Vision</span>
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    To stand as the global benchmark for bespoke high-carat curation, merging digital AI convenience directly with world-class workbench gold craftsmanship.
                  </p>
                </div>
              </div>

              {/* Quality Commitment Counter */}
              <blockquote className="mt-8 border-l-2 border-[#D4AF37] pl-4 italic text-sm text-neutral-400 font-sans">
                "Fine jewelry is not merely ornamentation. It represents encapsulated memory, deep structural history, and a physical transfer of devotion across generations."
                <cite className="block text-xs uppercase tracking-widest text-[#D4AF37] font-serif mt-2 not-italic">— Varada Hemasree, Founder</cite>
              </blockquote>

            </div>

          </div>
        </div>
      </section>

      {/* 5. Featured Collections */}
      <section id="collections" className={`py-24 border-t ${isDark ? "bg-[#090909] border-[#D4AF37]/20" : "bg-[#FAF9F6]/50 border-[#D4AF37]/35"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#D4AF37] text-[11px] uppercase tracking-[0.25em] font-semibold block mb-2 font-sans">Curated Divisions</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight text-center">
              Featured <span className="font-serif italic text-[#D4AF37]">Collections</span>
            </h2>
            <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COLLECTIONS.map((col) => (
              <div 
                key={col.id} 
                className={`group relative overflow-hidden flex flex-col h-[400px] border transition-all duration-500 cursor-pointer ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5" : "bg-[#FBFBF9] border-[#D4AF37]/30 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5"}`}
                onClick={() => {
                  setSelectedCategory(col.tag);
                  scrollToSection("catalog");
                }}
              >
                {/* Image Container with zoom */}
                <div className="relative h-2/3 overflow-hidden">
                  <img 
                    src={col.imageUrl} 
                    alt={col.title} 
                    className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 right-4 bg-[#0F0F0F]/80 text-[#D4AF37] text-[10px] uppercase font-semibold tracking-widest px-3 py-1 border border-[#D4AF37]/35">
                    {col.tag} Collection
                  </span>
                </div>

                {/* Content info */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-serif text-xl group-hover:text-[#D4AF37] transition-colors">{col.title}</h3>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed font-sans">{col.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] uppercase tracking-widest text-[#D4AF37] mt-3 font-semibold hover:translate-x-1 transition-transform">
                    <span>View Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Portfolio/Gallery & Product Catalog (Merged client section) */}
      <section id="catalog" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[#D4AF37] text-xs uppercase tracking-[0.25em] font-semibold block mb-2 font-sans">The Exhibition Room</span>
              <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight">
                Our Elegant <span className="font-serif italic text-[#D4AF37]">Catalog</span>
              </h2>
            </div>

            {/* Category Filters on Desktop */}
            <div className="flex flex-wrap items-center mt-6 md:mt-0 gap-2 font-sans text-[11px] uppercase tracking-wider">
              {["All", "Rings", "Necklaces", "Earrings", "Bangles", "Bridal", "Diamond", "Gold", "Silver", "Sapphire", "Emerald", "Ruby"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 border transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? "bg-[#D4AF37] text-[#0F0F0F] border-[#D4AF37]" 
                      : isDark
                        ? "border-[#D4AF37]/15 text-neutral-400 hover:text-[#FAF9F6] hover:border-[#D4AF37]/45"
                        : "border-[#D4AF37]/25 text-neutral-600 hover:text-[#0F0F0F] hover:border-[#D4AF37]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Interactive Search */}
          <div className="mb-10 max-w-md">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Type keywords (e.g. emerald, rose gold, solitaire)..." 
                value={searchQuery}
                aria-label="Filter products by text search"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) {
                    setSelectedCategory("All");
                  }
                }}
                className={`w-full pl-10 pr-4 py-3 text-xs tracking-wide transition-all focus:outline-none rounded-none border ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/20 text-[#FAF9F6] focus:border-[#D4AF37]" : "bg-white border-[#D4AF37]/35 text-[#0F0F0F] focus:border-[#D4AF37]"}`}
              />
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3.5 text-neutral-400 hover:text-[#D4AF37]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {filteredProducts.length > 0 && (
              <p className="text-[10px] text-neutral-400 mt-2 font-sans">Showing {filteredProducts.length} masterpieces of fine craftsmanship.</p>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className={`p-12 text-center border font-serif ${isDark ? "border-[#D4AF37]/20 bg-[#1A1A1A]" : "border-[#D4AF37]/35 bg-white"}`}>
              <Info className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
              <p className="text-lg">No matching jewelry found.</p>
              <p className="text-xs text-neutral-400 mt-2 font-sans">Try clearing your filters or testing keywords like 'Emerald' or 'Gold'.</p>
              <button 
                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                className="mt-6 bg-[#D4AF37] text-black text-xs uppercase font-sans font-bold px-6 py-2 border border-[#D4AF37] cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => {
                const isInWishlist = wishlist.some(item => item.id === product.id);
                return (
                  <div 
                    key={product.id}
                    className={`group relative flex flex-col border overflow-hidden transition-all duration-300 ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5" : "bg-white border-[#D4AF37]/35 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5"}`}
                  >
                    
                    {/* Hover tools & Image frame */}
                    <div className="relative aspect-square overflow-hidden bg-neutral-900/10">
                      
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover filter brightness-[0.93] group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* Spark popular tag */}
                      {product.isPopular && (
                        <span className="absolute top-3 left-3 bg-[#D4AF37] text-black text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 font-sans">
                          Atelier Pick
                        </span>
                      )}

                      {/* Wishlist toggle */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-none border bg-black/50 hover:bg-black/80 transition-all text-white backdrop-blur-sm cursor-pointer z-10 ${isInWishlist ? "text-[#D4AF37]" : "hover:text-[#D4AF37]"}`}
                        aria-label={`Save ${product.name} to wishlist`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isInWishlist ? "fill-[#D4AF37]" : ""}`} />
                      </button>

                      {/* Overlay card details button */}
                      <div className="absolute inset-x-0 bottom-0 py-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="bg-[#D4AF37] text-[#0F0F0F] font-serif text-[10px] uppercase tracking-widest font-bold px-4 py-2 border border-[#D4AF37] hover:bg-transparent hover:text-white transition-all cursor-pointer"
                        >
                          Quick View Details
                        </button>
                      </div>

                    </div>

                    {/* Meta info */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        
                        <div className="flex items-center justify-between text-[10px] uppercase text-[#FAF9F6]/60 tracking-wider mb-1 font-sans">
                          <span>{product.metal}</span>
                          <span className="flex items-center text-[#D4AF37]">
                            <Star className="w-2.5 h-2.5 fill-[#D4AF37] mr-1" />
                            {product.rating}
                          </span>
                        </div>

                        <h3 className="font-serif text-base font-medium line-clamp-1 group-hover:text-[#D4AF37] transition-colors">{product.name}</h3>
                        {product.gems && (
                          <div className="text-[10px] text-[#b76e79] font-sans mt-0.5 font-medium">{product.gems}</div>
                        )}
                        <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed font-sans">{product.description}</p>
                      </div>

                      {/* Price Action link */}
                      <div className="mt-5 pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between">
                        <span className="font-serif font-light text-[#D4AF37] text-lg">
                          ${product.price.toLocaleString()}
                        </span>
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="text-[10px] uppercase font-serif tracking-widest text-[#D4AF37] hover:text-white flex items-center space-x-1"
                        >
                          <span>Inquire</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 7. Why Choose HAARA */}
      <section id="why-choose-us" className={`py-24 border-y ${isDark ? "bg-[#0A0A0A] border-[#D4AF37]/20" : "bg-[#FAF9F6] border-[#D4AF37]/35"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#D4AF37] text-xs uppercase tracking-[0.25em] font-semibold block mb-2 font-sans font-sans">Our Commitments</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight">
              Why Choose <span className="font-serif italic text-[#D4AF37]">HAARA House</span>
            </h2>
            <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_CHOOSE_US.map((item, idx) => {
              // Map icon string dynamically and fallback safely
              let IconComponent = ShieldCheck;
              if (idx === 1) IconComponent = Sparkles;
              if (idx === 2) IconComponent = Milestone;
              if (idx === 3) IconComponent = Lock;
              if (idx === 4) IconComponent = Truck;
              if (idx === 5) IconComponent = HeartHandshake;

              return (
                <div 
                  key={item.title}
                  className={`p-8 border hover:translate-y-[-4px] transition-all duration-300 ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/20 hover:border-[#D4AF37]/50" : "bg-white border-[#D4AF37]/30 hover:border-[#D4AF37]/50"}`}
                >
                  <div className="w-12 h-12 rounded-none flex items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37] mb-6 border border-[#D4AF37]/25">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-medium mb-3">{item.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans font-sans">{item.description}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. Services Section */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left intro details */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <span className="text-[#D4AF37] text-xs uppercase tracking-[0.25em] font-semibold block mb-2 font-sans font-sans">Showroom Concierge</span>
              <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight mb-6">
                Premium Atelier <span className="font-serif italic text-[#D4AF37]">Services</span>
              </h2>
              <p className="text-[#FAF9F6]/75 text-sm leading-relaxed mb-8 font-light">
                To guarantee absolute pleasure through generations, we boast an elite, bespoke concierge model that operates from deep design sketching down to microscopic gemstone sizing and cleaning.
              </p>
              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-[#D4AF37] text-[#0F0F0F] hover:bg-transparent hover:text-[#D4AF37] font-serif uppercase tracking-widest text-xs font-bold w-full py-4 border border-[#D4AF37] transition-all duration-300 cursor-pointer"
              >
                Schedule Free Service
              </button>
            </div>

            {/* Right card grids */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {SERVICES.map((srv, idx) => {
                let SrvIcon = PenTool;
                if (idx === 1) SrvIcon = Flower2;
                if (idx === 2) SrvIcon = Wrench;
                if (idx === 3) SrvIcon = Sparkles;
                if (idx === 4) SrvIcon = Search;

                return (
                  <div 
                    key={srv.id} 
                    className={`p-6 border flex flex-col justify-between ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/20" : "bg-[#FAF9F6] border-[#D4AF37]/35"}`}
                  >
                    <div>
                      <div className="text-[#D4AF37] mb-4">
                        <SrvIcon className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif text-lg font-medium mb-3">{srv.name}</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans font-sans font-sans">{srv.description}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setBookingFormData({ ...bookingFormData, service: srv.name });
                        setIsBookingModalOpen(true);
                      }}
                      className="text-[#D4AF37] hover:text-white uppercase font-sans text-[10px] tracking-widest text-left mt-6 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Book Service</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 9. AI RECOMMENDATION ASSISTANT SECTION (Server-side Gemini proxy) */}
      <section id="ai-curator" className={`py-24 border-t relative overflow-hidden ${isDark ? "bg-[#090909] border-[#D4AF37]/20" : "bg-white border-[#D4AF37]/35"}`}>
        
        {/* Background glowing gold orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1 rounded-none text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-3 animate-pulse font-sans">
              <Sparkles className="w-3 h-3" />
              <span>AI Jewelry Consultant</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight text-center">
              HAARA AI <span className="font-serif italic text-[#D4AF37]">Concierge</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-2 max-w-lg mx-auto font-sans">
              Answer 4 questions and describe your desires to let our artificial intelligence-driven curator formulate recommended cuts, gemstone pairings, and maintenance tips server-side.
            </p>
          </div>

          <div className={`border p-8 rounded-none ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/20" : "bg-white border-[#D4AF37]/35"}`}>
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 border-b border-[#D4AF37]/20 pb-4 text-xs font-serif uppercase tracking-widest">
              <span className={aiStep === 1 ? "text-[#D4AF37] font-semibold" : "text-neutral-500"}>1. Preferences</span>
              <span className="text-neutral-600">—</span>
              <span className={aiStep === 2 ? "text-[#D4AF37] font-semibold" : "text-neutral-500"}>2. Detail Notes</span>
              <span className="text-neutral-600">—</span>
              <span className={aiStep === 3 ? "text-[#D4AF37] font-semibold" : "text-neutral-500"}>3. Elite Recommendation</span>
            </div>

            {/* AI LOADING STATE */}
            {aiLoading ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="relative w-16 h-16 mb-6">
                  {/* Glowing custom spinner */}
                  <div className="absolute inset-0 rounded-none border-2 border-[#D4AF37]/25" />
                  <div className="absolute inset-0 rounded-none border-2 border-transparent border-t-[#D4AF37] animate-spin" />
                </div>
                <h3 className="font-serif text-lg text-[#D4AF37] uppercase tracking-widest mb-2">Analyzing Design Metrics</h3>
                
                {/* Dynamic Tips inside loading */}
                <p className="text-xs text-neutral-400 max-w-sm px-4 italic leading-relaxed animate-pulse font-sans">
                  "{conciergeTips[aiTipIndex]}"
                </p>
              </div>
            ) : (
              <>
                {/* Step 1: Base specs */}
                {aiStep === 1 && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-[#D4AF37] mb-2">Jewelry Category</label>
                        <select 
                          value={aiPayload.category}
                          onChange={(e) => setAiPayload({ ...aiPayload, category: e.target.value })}
                          className={`w-full p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] font-serif tracking-wide border ${isDark ? "bg-[#1C1C1C] border-gold-400/20 text-[#FAF9F6]" : "bg-[#F6F5F2] border-gold-600/20 text-[#0F0F0F]"}`}
                        >
                          <option>Rings</option>
                          <option>Necklaces</option>
                          <option>Earrings</option>
                          <option>Bangles</option>
                          <option>Bridal Sets</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-[#D4AF37] mb-2">Preferred Metal & Karat</label>
                        <select 
                          value={aiPayload.metalType}
                          onChange={(e) => setAiPayload({ ...aiPayload, metalType: e.target.value })}
                          className={`w-full p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] font-serif tracking-wide border ${isDark ? "bg-[#1C1C1C] border-gold-400/20 text-[#FAF9F6]" : "bg-[#F6F5F2] border-gold-600/20 text-[#0F0F0F]"}`}
                        >
                          <option>22K Yellow Gold (High Purity)</option>
                          <option>18K Rose Gold (Modern/Romantic)</option>
                          <option>18K White Gold (Contemporary)</option>
                          <option>Premium Platinum (Ultimate Luxury)</option>
                          <option>925 Sterling Silver with Rhodium Coating</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-[#D4AF37] mb-2">Occasion</label>
                        <select 
                          value={aiPayload.occasion}
                          onChange={(e) => setAiPayload({ ...aiPayload, occasion: e.target.value })}
                          className={`w-full p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] font-serif tracking-wide border ${isDark ? "bg-[#1C1C1C] border-gold-400/20 text-[#FAF9F6]" : "bg-[#F6F5F2] border-gold-600/20 text-[#0F0F0F]"}`}
                        >
                          <option>Bespoke Bridal / Marriage</option>
                          <option>Engagement / Anniversary</option>
                          <option>Grand Galas & Operas</option>
                          <option>Contemporary Daily Minimalist Wear</option>
                          <option>Heritage / Traditional Festivals</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-[#D4AF37] mb-2">Target Budget Selection</label>
                        <select 
                          value={aiPayload.budgetRange}
                          onChange={(e) => setAiPayload({ ...aiPayload, budgetRange: e.target.value })}
                          className={`w-full p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] font-serif tracking-wide border ${isDark ? "bg-[#1C1C1C] border-gold-400/20 text-[#FAF9F6]" : "bg-[#F6F5F2] border-gold-600/20 text-[#0F0F0F]"}`}
                        >
                          <option>Daily Luxury (Under $1,000)</option>
                          <option>Fine Jewelry Range ($1,000 - $3,000)</option>
                          <option>Premium Selection ($3,000 - $8,000)</option>
                          <option>Atelier High-Heritage (Above $8,000)</option>
                        </select>
                      </div>

                    </div>

                    <div className="flex justify-end mt-8">
                      <button 
                        onClick={() => setAiStep(2)}
                        className="bg-[#D4AF37] text-black text-xs uppercase font-serif tracking-widest font-bold px-6 py-3 border border-[#D4AF37] cursor-pointer"
                      >
                        Continue to Notes
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Custom text notes */}
                {aiStep === 2 && (
                  <div>
                    <div className="mb-6">
                      <label className="block text-[11px] uppercase tracking-widest text-[#D4AF37] mb-2">Describe Your Vision (Optional)</label>
                      <textarea 
                        rows={4}
                        placeholder="Add some notes about your wardrobe, favorite stones, desired geometric shapes (e.g., 'A modern asymmetric ring with sparkling sapphire and minimal band width')..."
                        value={aiPayload.preference}
                        onChange={(e) => setAiPayload({ ...aiPayload, preference: e.target.value })}
                        className={`w-full p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] font-sans tracking-wide border ${isDark ? "bg-[#1C1C1C] border-gold-400/20 text-[#FAF9F6] placeholder:text-neutral-600" : "bg-[#F6F5F2] border-gold-600/20 text-[#0F0F0F] placeholder:text-neutral-400"}`}
                      />
                    </div>

                    <div className="flex justify-between mt-8">
                      <button 
                        onClick={() => setAiStep(1)}
                        className="border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-widest px-6 py-3 cursor-pointer"
                      >
                        Back
                      </button>
                      <button 
                        onClick={consultAIRecommendations}
                        className="bg-[#D4AF37] text-black text-xs uppercase font-serif tracking-widest font-bold px-6 py-3 border border-[#D4AF37] cursor-pointer"
                      >
                        Consult HAARA AI Concierge (Generate)
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Response representation */}
                {aiStep === 3 && aiResponse && (
                  <div className="space-y-6">
                    
                    {/* Masterpiece analysis block */}
                    <div className="border-l-4 border-[#D4AF37] pl-4">
                      <h3 className="font-serif text-[#D4AF37] text-xl uppercase tracking-wider mb-2">Atelier Curation Analysis</h3>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">{aiResponse.analysis}</p>
                    </div>

                    {/* Styled Styles names list */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
                      {aiResponse.suggestedStyles.map((style, idx) => (
                        <div 
                          key={style}
                          className={`p-4 border border-gold-400/25 relative overflow-hidden flex flex-col justify-between ${isDark ? "bg-[#141414]" : "bg-[#FAFAF9]"}`}
                        >
                          <div className="absolute right-2 top-2 text-[10px] text-[#D4AF37] font-semibold">Curation #0{idx+1}</div>
                          <span className="font-serif text-sm block font-medium mt-3 text-neutral-200">{style}</span>
                          <button 
                            onClick={() => {
                              setContactFormData({
                                ...contactFormData,
                                service: "Custom Jewelry Design",
                                message: `I generated the style "${style}" through the HAARA AI Curator. I would like to get a quote and design details for it.`
                              });
                              scrollToSection("contact");
                            }}
                            className="text-[#D4AF37] text-[10px] hover:text-white uppercase font-semibold text-left tracking-widest mt-4 flex items-center space-x-1"
                          >
                            <span>Inquire style</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Curated gold care tips */}
                    <div className={`p-5 border border-[#b76e79]/20 ${isDark ? "bg-[#1B1617]" : "bg-[#FAF5F5]"}`}>
                      <h4 className="text-[10px] uppercase font-sans tracking-widest text-[#b76e79] font-bold mb-3">Atelier Custom Care Routine</h4>
                      <ul className="space-y-2 text-xs text-neutral-400">
                        {aiResponse.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-[#D4AF37] mr-2">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between border-t border-gold-400/10 pt-4 mt-8">
                      <button 
                        onClick={() => { setAiResponse(null); setAiStep(1); }}
                        className="border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs uppercase tracking-widest px-6 py-3 cursor-pointer"
                      >
                        New Analysis
                      </button>
                      <button 
                        onClick={() => {
                          setBookingFormData({
                            ...bookingFormData,
                            service: "Custom Jewelry Design",
                            message: `I analyzed my selection on the AI Curator (${aiPayload.category}, ${aiPayload.metalType}, ${aiPayload.occasion}). I would like to schedule a private showroom consultation.`
                          });
                          setIsBookingModalOpen(true);
                        }}
                        className="bg-[#D4AF37] text-black text-xs uppercase font-serif tracking-widest font-bold px-6 py-3 border border-[#D4AF37] cursor-pointer"
                      >
                        Book Live Consultation
                      </button>
                    </div>

                  </div>
                )}
              </>
            )}

          </div>

        </div>
      </section>

      {/* 10. Customer Testimonials */}
      <section id="testimonials" className="py-24 max-w-5xl mx-auto px-4 text-center">
        
        <span className="text-[#D4AF37] text-xs uppercase tracking-[0.25em] font-semibold block mb-2 font-sans font-sans">Our Clients Circle</span>
        <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight mb-12">
          Atelier <span className="font-serif italic text-[#D4AF37]">Testimonials</span>
        </h2>

        <div className={`border p-8 md:p-12 leading-relaxed relative ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/20" : "bg-white border-[#D4AF37]/35"}`}>
          
          <div className="flex justify-center text-[#D4AF37] space-x-1 mb-6">
            {[...Array(TESTIMONIALS[testimonialIndex].rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
            ))}
          </div>

          <p className="text-lg sm:text-xl font-serif text-neutral-300 italic mb-8 font-light">
            "{TESTIMONIALS[testimonialIndex].text}"
          </p>

          <div className="flex items-center justify-center space-x-4">
            <img 
              src={TESTIMONIALS[testimonialIndex].imageUrl} 
              alt={TESTIMONIALS[testimonialIndex].name} 
              className="w-12 h-12 rounded-none object-cover border border-[#D4AF37]/30"
              referrerPolicy="no-referrer"
            />
            <div className="text-left font-sans">
              <div className="text-sm font-semibold tracking-wide text-neutral-100">{TESTIMONIALS[testimonialIndex].name}</div>
              <div className="text-[10px] text-[#D4AF37] uppercase tracking-widest">{TESTIMONIALS[testimonialIndex].role}</div>
            </div>
          </div>

          {/* Controls indicators */}
          <div className="flex items-center justify-center space-x-2 mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                aria-label={`Show testimonial ${idx+1}`}
                className={`w-2.5 h-2.5 rounded-none transition-all cursor-pointer ${testimonialIndex === idx ? "bg-[#D4AF37] w-6" : "bg-neutral-600"}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 11. Blog Section / Editorial journal */}
      <section id="blogs" className={`py-24 border-t ${isDark ? "bg-[#090909] border-[#D4AF37]/20" : "bg-[#FAFBFB] border-[#D4AF37]/35"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#D4AF37] text-xs uppercase tracking-[0.25em] font-semibold block mb-2 font-sans font-sans">The Journal</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight">
              Atelier <span className="font-serif italic text-[#D4AF37]">Insights</span>
            </h2>
            <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BLOGS.map((blog) => (
              <div 
                key={blog.id}
                className={`group flex flex-col justify-between border h-full overflow-hidden transition-all duration-300 ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5" : "bg-white border-[#D4AF37]/35 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5"}`}
              >
                
                <div>
                  <div className="relative h-48 overflow-hidden bg-neutral-900/15">
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title} 
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-[#0F0F0F]/85 text-[#D4AF37] text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 border border-[#D4AF37]/25 font-sans">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-6 font-sans">
                    <div className="text-[10px] text-neutral-400 font-sans mb-2 font-medium">
                      {blog.date} • {blog.readTime}
                    </div>
                    <h3 className="font-serif text-lg group-hover:text-[#D4AF37] transition-colors leading-snug">{blog.title}</h3>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">{blog.description}</p>
                  </div>
                </div>

                <div className="p-6 border-t border-[#D4AF37]/15 flex items-center justify-between font-sans">
                  <span className="text-[10px] text-neutral-500 font-sans italic">By {blog.author}</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-serif group-hover:translate-x-1 transition-transform inline-flex items-center cursor-pointer">
                    <span>Read Journal</span>
                    <ArrowRight className="w-2.5 h-2.5 ml-1" />
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 12. FAQ Section */}
      <section id="faqs" className="py-24 max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-xs uppercase tracking-[0.25em] font-semibold block mb-2 font-sans">Common Enquiries</span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight">
            Frequently Asked <span className="font-serif italic text-[#D4AF37]">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = activeFaq === faq.id;
            return (
              <div 
                key={faq.id} 
                className={`border rounded-none overflow-hidden transition-all duration-300 ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/20" : "bg-white border-[#D4AF37]/35"}`}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-gold-400/5 transition-all"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg text-neutral-200 font-medium">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 border-t border-[#D4AF37]/15 text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-sans">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 13. Contact Section & Showroom Map Layout */}
      <section id="contact" className={`py-24 border-t ${isDark ? "bg-[#0A0A0A] border-[#D4AF37]/20" : "bg-[#FAF9F6] border-[#D4AF37]/35"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Box: Form */}
            <div className={`p-8 lg:col-span-7 border ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/20" : "bg-white border-[#D4AF37]/35"}`}>
              <h3 className="font-serif text-2xl sm:text-3xl font-light mb-6">
                Consult Our <span className="font-serif italic text-[#D4AF37]">Designers</span>
              </h3>

              {isContactSubmitted ? (
                <div className="text-center py-12 border border-dashed border-[#D4AF37]/30">
                  <div className="w-12 h-12 rounded-none bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] mx-auto mb-4">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl tracking-wider text-[#FAF9F6] mb-2">Message Sent Successfully</h4>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed px-4 font-sans">
                    Thank you. The head of HAARA's private client relations team will confirm your message guidelines via phone or mail within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-sans">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={contactFormData.name}
                        onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                        className={`w-full p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-none border ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-[#FAF9F6]" : "bg-[#FAF9F6] border-[#D4AF37]/35 text-[#0F0F0F]"}`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-sans">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={contactFormData.email}
                        onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                        className={`w-full p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-none border ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-[#FAF9F6]" : "bg-[#FAF9F6] border-[#D4AF37]/35 text-[#0F0F0F]"}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-sans">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={contactFormData.phone}
                        onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                        className={`w-full p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-none border ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-[#FAF9F6]" : "bg-[#FAF9F6] border-[#D4AF37]/35 text-[#0F0F0F]"}`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-sans">Service of Interest</label>
                      <select 
                        value={contactFormData.service}
                        onChange={(e) => setContactFormData({ ...contactFormData, service: e.target.value })}
                        className={`w-full p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-none border ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-[#FAF9F6]" : "bg-[#FAF9F6] border-[#D4AF37]/35 text-[#0F0F0F]"}`}
                      >
                        <option>Bespoke Consultation</option>
                        <option>Bridal Fitting consultation</option>
                        <option>Heirloom Restoration / Repair</option>
                        <option>Gemstone Acquisition inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-sans">Your Detailed inquiry Message</label>
                    <textarea 
                      rows={4}
                      required
                      placeholder="Add parameters, desired metals, or dates details..."
                      value={contactFormData.message}
                      onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                      className={`w-full p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-none border ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-[#FAF9F6] placeholder:text-neutral-600" : "bg-[#FAF9F6] border-[#D4AF37]/30 text-[#0F0F0F] placeholder:text-neutral-400"}`}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#D4AF37] hover:bg-[#111111] border border-[#D4AF37] text-black hover:text-[#D4AF37] font-serif uppercase tracking-widest text-xs font-bold py-3.5 transition-all cursor-pointer"
                  >
                    Submit Curation Request
                  </button>

                </form>
              )}

            </div>

            {/* Right Box: Info & Map mockup */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl font-light mb-6 tracking-tight">Showroom Details</h3>
                
                <div className="space-y-6 text-xs text-neutral-400 font-sans">
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-neutral-300 font-sans">Flagship Showroom Address</div>
                      <p className="mt-1 font-sans">Suite 12, Level 1, Gold & Diamond Bourse, Opera House District, Mumbai, India</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-neutral-300 font-sans">Secure Consultation Hotline</div>
                      <p className="mt-1 font-sans">+91 (22) 5849-HAARA (42272) • +44 207 495 1900</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-neutral-300 font-sans">Atelier Concierge Email</div>
                      <p className="mt-1 font-sans">concierge@haara-jewelry.com • bespoke@haara.in</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-neutral-300 font-sans">Showroom Curation Hours</div>
                      <p className="mt-1 font-sans">Tuesday – Sunday: 11:00 AM – 8:00 PM (Mondays strictly by pre-authorized invite only)</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Showroom Map Mockup */}
              <div className="mt-8 border border-[#D4AF37]/35 relative h-[220px] overflow-hidden group">
                <div className="absolute inset-0 bg-[#151515] flex flex-col justify-center items-center p-6 text-center z-10 transition-colors group-hover:bg-[#1A1A1A]">
                  <div className="w-12 h-12 rounded-none border border-[#D4AF37]/35 bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-3">
                    <MapPin className="w-5 h-5 animate-bounce" />
                  </div>
                  <h4 className="font-serif text-[#D4AF37] text-sm font-semibold uppercase tracking-widest mb-1">Flagship Opera House Showroom</h4>
                  <p className="text-[10px] text-neutral-400 italic font-sans">Interlocking Gold Bourse, Suite 12</p>
                  
                  {/* Visual Grid detailing simulated vector lines */}
                  <div className="w-full h-[1px] bg-[#D4AF37]/25 my-3 relative font-sans">
                    <div className="absolute left-1/3 -top-1 w-2.5 h-2.5 rounded-full bg-[#D4AF37] border-2 border-[#151515] animate-ping" />
                  </div>
                  <a 
                    href="https://maps.google.com/?q=Taj+Mahal+Palace+Mumbai" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[9px] uppercase tracking-widest text-[#D4AF37] hover:text-white font-sans"
                  >
                    Open G Maps Directions
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 14. Footer with Newsletter Subscription */}
      <footer className={`py-16 border-t ${isDark ? "bg-[#090909] border-[#D4AF37]/20 text-neutral-400" : "bg-[#FAF9F6] border-[#D4AF37]/30 text-neutral-600"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            
            {/* Logo and brief */}
            <div className="lg:col-span-2">
              <span className="text-3xl font-serif tracking-widest text-[#D4AF37] font-semibold block mb-4">HAARA</span>
              <p className="text-xs leading-relaxed max-w-sm font-light font-sans">
                Fine luxury jewelry designed to encapsulate memory, celebrate life milestones, and provide pristine inheritance investments through unmatched gold, silver, and GIA diamonds.
              </p>
              
              {/* Social Channels icons */}
              <div className="flex items-center space-x-3 mt-6 text-neutral-400">
                {["Instagram", "Facebook", "Pinterest", "YouTube"].map((platform) => (
                  <a
                    key={platform}
                    href={`https://${platform.toLowerCase()}.com`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit our official ${platform}`}
                    className="text-[10px] tracking-widest font-sans border border-[#D4AF37]/25 px-2.5 py-1 hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-all"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif text-[#D4AF37] text-xs uppercase tracking-widest mb-4 font-semibold">Atelier Matrix</h4>
              <ul className="space-y-2 text-xs font-sans">
                <li><button onClick={() => scrollToSection("about")} className="hover:text-[#D4AF37] cursor-pointer">About Us</button></li>
                <li><button onClick={() => scrollToSection("catalog")} className="hover:text-[#D4AF37] cursor-pointer font-serif">Main Catalog</button></li>
                <li><button onClick={() => scrollToSection("services")} className="hover:text-[#D4AF37] cursor-pointer">Bespoke Services</button></li>
                <li><button onClick={() => scrollToSection("ai-curator")} className="hover:text-[#D4AF37] cursor-pointer text-[#D4AF37]">HAARA AI Concierge</button></li>
                <li><button onClick={() => scrollToSection("blogs")} className="hover:text-[#D4AF37] cursor-pointer">Atelier Journal</button></li>
              </ul>
            </div>

            {/* Collections */}
            <div>
              <h4 className="font-serif text-[#D4AF37] text-xs uppercase tracking-widest mb-4 font-semibold">Fine Collections</h4>
              <ul className="space-y-2 text-xs font-sans">
                <li><button onClick={() => { setSelectedCategory("Bridal"); scrollToSection("catalog"); }} className="hover:text-[#D4AF37] cursor-pointer">Bridal Wear Suite</button></li>
                <li><button onClick={() => { setSelectedCategory("Diamond"); scrollToSection("catalog"); }} className="hover:text-[#D4AF37] cursor-pointer">Classic solitaires</button></li>
                <li><button onClick={() => { setSelectedCategory("Gold"); scrollToSection("catalog"); }} className="hover:text-[#D4AF37] cursor-pointer">High-Karat Carvings</button></li>
                <li><button onClick={() => { setSelectedCategory("Silver"); scrollToSection("catalog"); }} className="hover:text-[#D4AF37] cursor-pointer font-serif">Sterling Moderns</button></li>
                <li><button onClick={() => { setSelectedCategory("Heritage"); scrollToSection("catalog"); }} className="hover:text-[#D4AF37] cursor-pointer">Antique Legacies</button></li>
              </ul>
            </div>

            {/* Newsletter form box */}
            <div>
              <h4 className="font-serif text-[#D4AF37] text-xs uppercase tracking-widest mb-4 font-semibold">Atelier Newsletter</h4>
              <p className="text-[11px] leading-relaxed mb-4 font-light font-sans">Join the HAARA Circle for rare private event invitations and early previews.</p>

              {newsletterSubscribed ? (
                <div className="p-3 bg-gold-400/10 border border-[#D4AF37]/20 text-xs text-[#D4AF37] font-sans">
                  Email Joined Circle.
                </div>
              ) : (
                <form 
                  onSubmit={(e) => { e.preventDefault(); if (newsletterEmail) setIsBookingModalOpen(true); }}
                  className="flex flex-col space-y-2 font-sans"
                >
                  <input 
                    type="email" 
                    placeholder="E-mail coordinates..." 
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className={`p-2 py-2.5 text-xs focus:outline-none border rounded-none ${isDark ? "bg-[#141414] border-[#D4AF37]/20 text-[#FAF9F6] focus:border-[#D4AF37]" : "bg-neutral-100 border-[#D4AF37]/30 text-[#0F0F0F] focus:border-[#D4AF37]"}`}
                  />
                  <button 
                    type="submit"
                    onClick={() => {
                      if (newsletterEmail) {
                        setNewsletterSubscribed(true);
                      }
                    }}
                    className="bg-[#D4AF37] hover:bg-[#111111] border border-[#D4AF37] text-black hover:text-[#D4AF37] py-2 text-[10px] uppercase font-serif tracking-widest font-bold cursor-pointer transition-all"
                  >
                    Request Entry
                  </button>
                </form>
              )}
            </div>

          </div>

          <div className="border-t border-[#D4AF37]/15 pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-neutral-500 font-sans">
            <div>
              &copy; {new Date().getFullYear()} HAARA luxury House. All design rights secured globally under BIS hallmarks & GIA passports.
            </div>
            <div className="flex space-x-4 mt-4 sm:mt-0 uppercase tracking-widest font-serif">
              <a href="#header-nav" className="hover:text-[#D4AF37]">Privacy Policy</a>
              <a href="#header-nav" className="hover:text-[#D4AF37]">Terms & Conditions</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Interactive WhatsApp Concierge */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        
        <AnimatePresence>
          {isWhatsAppOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className={`p-5 rounded-none border shadow-2xl mb-3 w-72 leading-relaxed ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/25" : "bg-white border-[#D4AF37]/35"}`}
            >
              <div className="flex items-center space-x-2 border-b border-[#D4AF37]/20 pb-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                <span className="text-xs uppercase tracking-widest font-bold font-serif text-[#D4AF37]">Showroom Director Live</span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-4 font-sans">
                Greetings. Direct secure line to our luxury showroom. Send WhatsApp templates directly to request diamond prices.
              </p>
              <textarea 
                rows={2}
                value={whatsAppText}
                onChange={(e) => setWhatsAppText(e.target.value)}
                className={`w-full p-2 text-[11px] focus:outline-none border focus:border-[#D4AF37] ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-white" : "bg-neutral-50 border-[#D4AF37]/25 text-black"}`}
              />
              <a 
                href={`https://wa.me/9122584942272?text=${encodeURIComponent(whatsAppText)}`}
                target="_blank"
                rel="noreferrer"
                className="block mt-4 text-center bg-[#D4AF37] border border-[#D4AF37] text-[#0F0F0F] text-[10px] uppercase font-serif tracking-widest font-bold py-2 hover:bg-neutral-900 hover:text-[#D4AF37] transition-all"
              >
                Launch Secure WhatsApp
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
          aria-label="Contact live WhatsApp concierge"
          className="bg-[#D4AF37] text-black hover:bg-neutral-900 hover:text-[#D4AF37] p-4 rounded-full border border-[#D4AF37] shadow-xl hover:shadow-gold-400/20 shrink-0 transition-all cursor-pointer flex items-center justify-center"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      {/* DETAILED LIGHTBOX MODAL (Quick view) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative max-w-4xl w-full border grid grid-cols-1 md:grid-cols-2 overflow-hidden ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/35" : "bg-[#FAF9F6] border-[#D4AF37]/45"}`}
            >
              {/* Close */}
              <button 
                onClick={() => setSelectedProduct(null)}
                aria-label="Close Lightbox Modal"
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/95 text-white border border-[#D4AF37]/25 z-10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo */}
              <div className="relative h-64 md:h-full bg-neutral-950/20">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover animate-fade-in"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Info specifications */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  
                  <div className="flex items-center justify-between text-[10px] uppercase text-neutral-400 tracking-wider mb-2 font-semibold font-sans">
                    <span>{selectedProduct.metal}</span>
                    <span className="flex items-center text-[#D4AF37]">
                      <Star className="w-3 h-3 fill-[#D4AF37] mr-1 font-sans" />
                      {selectedProduct.rating} / 5.0 Rating
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-medium mb-1 text-white">{selectedProduct.name}</h3>
                  {selectedProduct.gems && (
                    <div className="text-xs uppercase tracking-widest text-[#b76e79] font-sans font-semibold mb-3">{selectedProduct.gems}</div>
                  )}

                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-light mb-6 font-sans">
                    {selectedProduct.description}
                  </p>

                  {/* Structural metadata */}
                  <div className={`p-4 border border-[#D4AF37]/20 mb-6 space-y-2 text-xs font-sans ${isDark ? "bg-[#141414] text-neutral-300" : "bg-neutral-50"}`}>
                    <div className="flex justify-between"><span className="text-neutral-500 font-sans">Gold Authenticity</span> <span className="font-serif text-neutral-200 uppercase font-semibold">{selectedProduct.metal}</span></div>
                    {selectedProduct.gems && (
                      <div className="flex justify-between"><span className="text-neutral-500 font-sans">Gemstones Standard</span> <span className="font-sans text-neutral-200 font-semibold">{selectedProduct.gems}</span></div>
                    )}
                    <div className="flex justify-between font-sans"><span className="text-neutral-500">Security Certificate</span> <span className="text-[#D4AF37] uppercase font-semibold tracking-widest text-[9px] border border-[#D4AF37]/30 px-1.5 py-0.5">BIS Hallmarked</span></div>
                    <div className="flex justify-between font-sans"><span className="text-neutral-500">Lifetime Clean Guard</span> <span className="text-neutral-200 font-semibold">Complimentary</span></div>
                  </div>

                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] uppercase text-neutral-500 block">Estimated price value</span>
                      <span className="font-serif font-bold text-2xl text-[#D4AF37]">${selectedProduct.price.toLocaleString()}</span>
                    </div>
                    {wishlist.some(item => item.id === selectedProduct.id) ? (
                      <span className="text-xs text-[#FAF9F6] bg-neutral-800 px-3 py-1 text-[10px] uppercase font-sans">Saved in Wishlist</span>
                    ) : (
                      <button 
                        onClick={() => toggleWishlist(selectedProduct)}
                        className="text-xs text-[#D4AF37] hover:text-white uppercase font-sans tracking-widest flex items-center space-x-1"
                      >
                        <Heart className="w-3.5 h-3.5 mr-1" />
                        <span>Add to wishlist</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => {
                        setBookingFormData({
                          ...bookingFormData,
                          service: "Custom Jewelry Design",
                          message: `I would like to consult with our showrooms about ordering the "${selectedProduct.name}" valued at $${selectedProduct.price.toLocaleString()}.`
                        });
                        setSelectedProduct(null);
                        setIsBookingModalOpen(true);
                      }}
                      className="bg-[#D4AF37] text-black hover:bg-neutral-950 hover:text-[#D4AF37] border border-[#D4AF37] text-center text-xs uppercase font-serif tracking-widest font-bold py-3 transition-all cursor-pointer"
                    >
                      Instant Quote Consult
                    </button>
                    <a
                      href={`https://wa.me/9122584942272?text=${encodeURIComponent(`Hi HAARA, I would like to inquire about purchasing: ${selectedProduct.name} ($${selectedProduct.price.toLocaleString()})`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-[#D4AF37]/45 text-[#D4AF37] hover:bg-[#D4AF37]/5 text-center text-xs uppercase font-serif tracking-widest font-bold py-3 transition-all"
                    >
                      Ask over WhatsApp
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* APPOINTMENT BOOKING MODAL */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative max-w-xl w-full border p-8 ${isDark ? "bg-[#1A1A1A] border-[#D4AF37]/35" : "bg-white border-[#D4AF37]/45"}`}
            >
              {/* Close */}
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                aria-label="Close booking modal"
                className="absolute top-4 right-4 p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-2xl sm:text-3xl font-light mb-2 flex items-center space-x-2">
                <CalendarCheck className="w-6 h-6 text-[#D4AF37]" />
                <span>Book Curation Session</span>
              </h3>
              <p className="text-xs text-neutral-400 mb-6 font-sans">
                Schedule a private, champagne-complemented design consultation. Select coordinates.
              </p>

              {isBookingConfirmed ? (
                <div className="text-center py-12 border border-dashed border-[#D4AF37]/40">
                  <div className="w-12 h-12 rounded-none bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] mx-auto mb-4">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl tracking-wider text-[#FAF9F6] mb-2">Appointment Scheduled</h4>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed px-4 font-sans">
                    Your luxury session is reserved. Our private showroom director will call you shortly at <span className="text-white font-semibold">{bookingFormData.phone}</span> to finalize transport access.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1.5 font-sans">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={bookingFormData.name}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                      className={`w-full p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-none border ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-[#FAF9F6]" : "bg-neutral-50 border-[#D4AF37]/30 text-[#0F0F0F]"}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1.5 font-sans font-sans">Email coordinate</label>
                      <input 
                        type="email" 
                        required
                        placeholder="eleanor@domain.com"
                        value={bookingFormData.email}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                        className={`w-full p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-none border ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-[#FAF9F6]" : "bg-neutral-50 border-[#D4AF37]/30 text-[#0F0F0F]"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1.5 font-sans">Phone security Number</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="+1 (555) 0192"
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                        className={`w-full p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-none border ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-[#FAF9F6]" : "bg-neutral-50 border-[#D4AF37]/30 text-[#0F0F0F]"}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    <div className="sm:col-span-1">
                      <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1.5 font-sans">Desired Service</label>
                      <select 
                        value={bookingFormData.service}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, service: e.target.value })}
                        className={`w-full p-2.5 text-[11px] focus:outline-none rounded-none border ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-[#FAF9F6]" : "bg-neutral-50 border-[#D4AF37]/30 text-[#0F0F0F]"}`}
                      >
                        <option>Custom Jewelry Design</option>
                        <option>Bridal Fitting session</option>
                        <option>Deep Heritage Cleaning</option>
                        <option>Laser Restoration Repair</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1.5 font-sans">Preferred Date</label>
                      <input 
                        type="date" 
                        required
                        value={bookingFormData.date}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, date: e.target.value })}
                        className={`w-full p-2 text-xs focus:outline-none rounded-none border ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-[#FAF9F6]" : "bg-neutral-50 border-[#D4AF37]/30 text-[#0F0F0F]"}`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1.5 font-sans">Preferred Time</label>
                      <select 
                        value={bookingFormData.time}
                        onChange={(e) => setBookingFormData({ ...bookingFormData, time: e.target.value })}
                        className={`w-full p-2.5 text-xs focus:outline-none rounded-none border ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-[#FAF9F6]" : "bg-neutral-50 border-[#D4AF37]/30 text-[#0F0F0F]"}`}
                      >
                        <option>11:00 AM</option>
                        <option>01:30 PM</option>
                        <option>03:00 PM</option>
                        <option>05:30 PM</option>
                        <option>07:00 PM</option>
                      </select>
                    </div>

                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1.5 font-sans">Wardrobe / Stone preferences notes</label>
                    <textarea 
                      rows={2}
                      placeholder="Add brief details for our designers..."
                      value={bookingFormData.message}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, message: e.target.value })}
                      className={`w-full p-2 text-xs focus:outline-none rounded-none border ${isDark ? "bg-[#151515] border-[#D4AF37]/20 text-[#FAF9F6] placeholder:text-neutral-600" : "bg-neutral-50 border-[#D4AF37]/30 text-[#0F0F0F] placeholder:text-neutral-400"}`}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#D4AF37] hover:bg-[#111111] border border-[#D4AF37] text-black hover:text-[#D4AF37] font-serif uppercase tracking-widest text-xs font-bold py-3 transition-colors cursor-pointer"
                  >
                    Confirm Showroom Booking
                  </button>

                </form>
              )}

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* WISHLIST SIDE DRAWER */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
            
            {/* Click backdrop to exit */}
            <div className="absolute inset-0 cursor-default" onClick={() => setIsWishlistOpen(false)} />

            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className={`relative max-w-md w-full h-full shadow-2xl p-8 flex flex-col justify-between z-10 ${isDark ? "bg-[#1A1A1A] border-l border-[#D4AF37]/35" : "bg-white border-l border-[#D4AF37]/45"}`}
            >
              
              {/* Top title */}
              <div>
                <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4 mb-6">
                  <h3 className="font-serif text-2xl font-light text-white flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                    <span>Your Saved Wishlist</span>
                  </h3>
                  <button 
                    onClick={() => setIsWishlistOpen(false)}
                    aria-label="Close Wishlist Side Drawer"
                    className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-16 space-y-4 font-sans">
                    <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
                    <p className="font-serif text-[#FAF9F6]/80 text-sm">Wishlist is empty</p>
                    <p className="text-xs text-neutral-500 font-sans leading-relaxed max-w-xs mx-auto">
                      Explore the HAARA catalog and hit the heart icon on any jewelry block to collect styles into your dream collection for consultations.
                    </p>
                    <button 
                      onClick={() => { setIsWishlistOpen(false); scrollToSection("catalog"); }}
                      className="border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors text-[10px] uppercase tracking-widest font-bold px-4 py-2 cursor-pointer"
                    >
                      Browse Ornaments
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 font-sans font-sans">
                    {wishlist.map((item) => (
                      <div 
                        key={item.id} 
                        className={`flex p-3 border items-center space-x-4 ${isDark ? "bg-[#141414] border-[#D4AF37]/25" : "bg-neutral-50 border-[#D4AF37]/35"}`}
                      >
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover border border-[#D4AF37]/15 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-grow min-w-0">
                          <h4 className="font-serif text-sm font-semibold truncate text-[#FAF9F6]">{item.name}</h4>
                          <span className="text-[10px] text-[#D4AF37] font-serif block">${item.price.toLocaleString()}</span>
                          <span className="text-[9px] text-neutral-500 truncate block font-sans uppercase">{item.metal}</span>
                        </div>
                        <button 
                          onClick={() => toggleWishlist(item)}
                          className="text-neutral-400 hover:text-[#b76e79] p-1.5 cursor-pointer text-xs"
                          aria-label={`Remove ${item.name} from wishlist`}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom request section if wishlist has items */}
              {wishlist.length > 0 && (
                <div className="border-t border-[#D4AF37]/30 pt-6 space-y-4 font-sans">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-400">Accrued Wishlist Worth:</span>
                    <span className="font-serif text-[#D4AF37] font-semibold text-lg">
                      ${wishlist.reduce((acc, curr) => acc + curr.price, 0).toLocaleString()}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const itemsList = wishlist.map(i => i.name).join(", ");
                      setBookingFormData({
                        ...bookingFormData,
                        service: "Bridal Fitting session",
                        message: `I have shortlisted the following items from the HAARA digital showroom catalog: ${itemsList}. I would like to schedule a personal show-glass fitting.`
                      });
                      setIsWishlistOpen(false);
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full bg-[#D4AF37] hover:bg-[#111111] border border-[#D4AF37] text-black hover:text-[#D4AF37] text-center text-xs uppercase font-serif tracking-widest font-bold py-3 transition-colors cursor-pointer"
                  >
                    Hold Session For Saved Ornaments
                  </button>
                </div>
              )}

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} isDark={isDark} />

    </div>
  );
}
