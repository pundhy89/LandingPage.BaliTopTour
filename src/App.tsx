import React, { useState, useEffect, useRef } from 'react';
import { Search, CheckCircle2, ShieldCheck, Ticket, Bell, Map as MapIcon, Star, Palmtree, ChevronRight, Settings, X, Loader2, Wallet, MousePointerClick, PiggyBank, Clock, User, Users, PartyPopper, Download } from 'lucide-react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const defaultTourPackages = [
  { id: 1, title: 'Ubud Tour', price: 'Rp 650K', image: 'https://images.unsplash.com/photo-1559628233-eb1b1a45564b?auto=format&fit=crop&w=300&q=80' },
  { id: 2, title: 'Lovina Tour', price: 'Rp 900K', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=300&q=80' },
  { id: 3, title: 'Uluwatu', price: 'Rp 600K', image: 'https://images.unsplash.com/photo-1537551080512-fb7c7abcb856?auto=format&fit=crop&w=300&q=80' },
  { id: 4, title: 'Nusa Penida', price: 'Rp 750K', image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=300&q=80' },
  { id: 5, title: 'Kintamani', price: 'Rp 550K', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=300&q=80' },
  { id: 6, title: 'Seminyak', price: 'Rp 450K', image: 'https://images.unsplash.com/photo-1574486518175-1049c693a778?auto=format&fit=crop&w=300&q=80' },
  { id: 7, title: 'Tanah Lot', price: 'Rp 500K', image: 'https://images.unsplash.com/photo-1512999494294-d2e8eb0cb0f5?auto=format&fit=crop&w=300&q=80' },
  { id: 8, title: 'Lempuyang', price: 'Rp 800K', image: 'https://images.unsplash.com/photo-1558862107-d49ef2a04d72?auto=format&fit=crop&w=300&q=80' },
  { id: 9, title: 'Waterfall', price: 'Rp 500K', image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=300&q=80' },
  { id: 10, title: 'Denpasar', price: 'Rp 400K', image: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=300&q=80' },
];

const defaultActivities = [
  { id: 1, title: 'Marine Safari Bali', location: 'KUTA', rating: 4.5, desc: 'GENERAL ADMISSION VALID: 01 APRIL 2026 - 31 MARCH 2027 AVAILABLE TUESDAY -...', price: 'Rp 0', image: 'https://images.unsplash.com/photo-1582293041079-7814c27124ff?auto=format&fit=crop&w=400&q=80' },
  { id: 2, title: 'Diving', location: 'TULAMBEN', rating: 4.5, desc: 'Experience the thrill of a variety of exciting water rides like Banana Boat, Jet Ski,...', price: 'Rp 0', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80' },
  { id: 3, title: 'Mount Batur Sunrise Trekking', location: 'GUNUNG BATUR', rating: 4.5, desc: 'Watch the sunrise from the summit of Mount Batur.', price: 'Rp 500.000', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80' },
  { id: 4, title: 'Waterboom Park', location: 'KUTA', rating: 4.5, desc: 'Enjoy endless fun at Waterboom Park.', price: 'Rp 100.000', image: 'https://images.unsplash.com/photo-1582293041079-7814c27124ff?auto=format&fit=crop&w=400&q=80' },
  { id: 5, title: 'ATV Adventure', location: 'UBUD', rating: 4.5, desc: 'Experience the thrill of exploring muddy trails on an ATV.', price: 'Rp 750.000', image: 'https://images.unsplash.com/photo-1596328546171-7a74c99c9689?auto=format&fit=crop&w=400&q=80' },
  { id: 6, title: 'Paragliding Bali', location: 'NUSA DUA DAN ULU WATU', rating: 4.5, desc: "Experience the thrill of flying over the panoramic views of Bali's coast.", price: 'Rp 1.100.000', image: 'https://images.unsplash.com/photo-1527555612663-8d6978500252?auto=format&fit=crop&w=400&q=80' },
  { id: 7, title: 'Horse Riding', location: 'BALI', rating: 4.5, desc: 'Enjoy a safe and enjoyable horseback riding experience.', price: 'Rp 600.000', image: 'https://images.unsplash.com/photo-1529126487198-7517c2a78f8c?auto=format&fit=crop&w=400&q=80' },
  { id: 8, title: 'Bali Bird Park & Reptile Park', location: 'UBUD', rating: 4.5, desc: 'Discover the wonders of the animal world with a collection of exotic birds.', price: 'Rp 100.000', image: 'https://images.unsplash.com/photo-1620078175782-5d9c2a382c78?auto=format&fit=crop&w=400&q=80' },
  { id: 9, title: 'Bali Safari Park', location: 'GIANYAR', rating: 4.5, desc: 'Experience an exciting safari adventure at Bali Safari Park. Valid from April 1, 2026 -...', price: 'Rp 100.000', image: 'https://images.unsplash.com/photo-1534567059665-cb530f25ce4c?auto=format&fit=crop&w=400&q=80' },
  { id: 10, title: 'Bali Zoo', location: 'UBUD', rating: 4.5, desc: 'Enjoy an exciting adventure with exotic animals at Bali Zoo.', price: 'Rp 100.000', image: 'https://images.unsplash.com/photo-1534567059665-cb530f25ce4c?auto=format&fit=crop&w=400&q=80' },
  { id: 11, title: 'Water Sport', location: 'NUSA DUA', rating: 4.5, desc: 'Experience the exciting sensation together at Wahana Laut.', price: 'Rp 100.000', image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=400&q=80' },
  { id: 12, title: 'Mount Batur Jeep Sunrise', location: 'GUNUNG BATUR', rating: 4.5, desc: 'Witness a spectacular sunrise from Mount Batur by jeep!', price: 'Rp 1.500.000', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=400&q=80' },
  { id: 13, title: 'Cycling Adventure', location: 'KINTAMANI', rating: 4.5, desc: 'Explore the natural beauty of Bali by bicycle.', price: 'Rp 600.000', image: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&w=400&q=80' },
  { id: 14, title: 'Rafting', location: 'UBUD DAN TELAGA WAJAH', rating: 4.5, desc: 'Conquer the rushing river currents amidst the tropical landscape.', price: 'Rp 600.000', image: 'https://images.unsplash.com/photo-1584988719273-df2676b8cb79?auto=format&fit=crop&w=400&q=80' },
  { id: 15, title: 'Elephant Ride', location: 'BALI SAFARI DAN BALI ZOO', rating: 4.5, desc: 'Enjoy a unique experience exploring Bali from atop an elephant.', price: 'Rp 100.000', image: 'https://images.unsplash.com/photo-1585078712316-09a633aeb69c?auto=format&fit=crop&w=400&q=80' },
  { id: 16, title: 'Bali Hai Cruise', location: 'BENUA', rating: 4.5, desc: 'Enjoy a luxury cruise while watching the Bali sunset.', price: 'Rp 100.000', image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=400&q=80' },
];

const SectionHeader = ({ title, count }: { title: string, count?: string }) => (
  <div className="flex justify-center items-center mb-6 mt-2 px-3">
    <div className="relative w-full max-w-[240px] mx-auto">
      {/* Wooden Board */}
      <div className="bg-[#8b5a2b] border-2 border-[#5c3a18] shadow-md px-4 py-2 rounded-xl w-full relative flex flex-col items-center justify-center z-10" style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent, transparent 8px, rgba(0,0,0,0.08) 8px, rgba(0,0,0,0.08) 9px, transparent 9px, transparent 12px, rgba(0,0,0,0.08) 12px, rgba(0,0,0,0.08) 13px)' }}>
         <h2 className="text-lg font-black text-white tracking-wider uppercase relative z-10 text-center" style={{ textShadow: '1px 2px 3px rgba(0,0,0,0.6)' }}>{title}</h2>
         {count && <span className="text-[9px] font-bold text-yellow-100 uppercase tracking-widest mt-0.5">{count}</span>}
      </div>
      
      {/* Flowers */}
      <div className="absolute -left-5 -top-4 text-[35px] transform -rotate-12 z-20 leading-none" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}>🌺</div>
      <div className="absolute -right-4 -bottom-3 text-[35px] transform rotate-12 z-20 leading-none" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}>🌺</div>
    </div>
  </div>
);

const SlideToDownload = ({ downloadUrl }: { downloadUrl?: string }) => {
  const [dragX, setDragX] = React.useState(0);
  const [isBooked, setIsBooked] = React.useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isBooked || !trackRef.current || e.buttons !== 1) return;
    const rect = trackRef.current.getBoundingClientRect();
    const maxDrag = rect.width - 56;
    let newX = e.clientX - rect.left - 28;
    newX = Math.max(0, Math.min(newX, maxDrag));
    setDragX(newX);
    if (newX >= maxDrag - 10) {
      setIsBooked(true);
      setDragX(maxDrag);
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
        setTimeout(() => {
          setIsBooked(false);
          setDragX(0);
        }, 3000);
      }
    }
  };

  return (
    <div 
      ref={trackRef}
      className={`relative w-full h-14 rounded-full flex items-center justify-center select-none overflow-hidden transition-colors ${isBooked ? 'bg-green-500' : 'bg-blue-600'}`}
      onPointerMove={handlePointerMove}
      onPointerUp={() => { if (!isBooked) setDragX(0); }}
      onPointerLeave={() => { if (!isBooked) setDragX(0); }}
      onPointerDown={(e) => {
        if (!isBooked) e.currentTarget.setPointerCapture(e.pointerId);
      }}
    >
      <div 
        className="absolute left-1 top-1 bottom-1 w-12 bg-white rounded-full flex items-center justify-center shadow-sm z-10"
        style={{ transform: `translateX(${dragX}px)`, transition: dragX === 0 ? 'transform 0.3s ease' : 'none', touchAction: 'none' }}
      >
        {isBooked ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <ChevronRight className="w-6 h-6 text-blue-600" />}
      </div>
      <span className="text-white font-bold text-sm z-0 relative ml-8 pointer-events-none">
        {isBooked ? 'Download Confirmed!' : 'Slide to Download Now'}
      </span>
    </div>
  );
};

const cardShadow = "shadow-[0_4px_15px_rgba(0,0,0,0.15)]";

const PromoCarousel = ({ banners }: { banners: { id: number, image: string, title: string }[] }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <section className="px-5 mb-8 mt-2">
      <div className={`relative w-full rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-[4px] border-white/80 bg-white h-[180px]`}>
        {banners.map((promo, idx) => (
          <div 
            key={promo.id} 
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: idx === currentIndex ? 1 : 0, zIndex: idx === currentIndex ? 10 : 0 }}
          >
             <img src={promo.image || 'https://via.placeholder.com/600x300?text=No+Image'} alt={promo.title} className="w-full h-full object-cover" />
             <div className="absolute bottom-4 left-6 right-6">
               <span className="bg-yellow-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider mb-1.5 inline-block shadow-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>PROMO</span>
               <h3 className="text-white font-black text-xl leading-tight" style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)' }}>{promo.title}</h3>
             </div>
          </div>
        ))}
        {banners.length > 1 && (
          <div className="absolute bottom-5 right-6 flex gap-1.5 z-20">
            {banners.map((_, idx) => (
              <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const [activeSettingsTab, setActiveSettingsTab] = useState<'main' | 'tours' | 'activities'>('main');
  const [canvasBg, setCanvasBg] = useState('bg-white');
  const [logoUrl, setLogoUrl] = useState('');
  const [appTitle, setAppTitle] = useState('Bali Top Tour');
  const [appSubtitle, setAppSubtitle] = useState('Tour & Travel');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [heroBannerUrl, setHeroBannerUrl] = useState('https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80');
  const [boatImgUrl, setBoatImgUrl] = useState('https://cdn-icons-png.flaticon.com/512/3004/3004543.png');
  const [mapImg, setMapImg] = useState('https://images.unsplash.com/photo-1582200236081-3bd4663df8e6?auto=format&fit=crop&w=400&q=80');
  const [promoBanners, setPromoBanners] = useState([
    { id: 1, image: 'https://images.unsplash.com/photo-1596436889106-be35e843f6a6?auto=format&fit=crop&w=600&q=80', title: 'Special Promo 20% Off' },
    { id: 2, image: 'https://images.unsplash.com/photo-1574486518175-1049c693a778?auto=format&fit=crop&w=600&q=80', title: 'Summer Sale Bali' }
  ]);

  const [tourPackages, setTourPackages] = useState([...defaultTourPackages]);
  const [activities, setActivities] = useState([...defaultActivities]);

  const [pins, setPins] = useState([
    { id: 1, top: 40, left: 30, color: 'bg-blue-600' },
    { id: 2, top: 60, left: 50, color: 'bg-orange-500' },
    { id: 3, top: 35, left: 70, color: 'bg-teal-500' },
  ]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragStartX(e.clientX);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging || dragStartX === null || !searchBarRef.current) return;
    
    let newOffset = e.clientX - dragStartX;
    if (newOffset > 0) newOffset = 0;
    
    const containerWidth = searchBarRef.current.clientWidth;
    const maxDrag = - (containerWidth - 90); 
    
    if (newOffset < maxDrag) newOffset = maxDrag;
    
    setDragOffset(newOffset);
    
    if (newOffset <= maxDrag + 10) {
      setSettingsOpen(true);
      setIsDragging(false);
      setDragOffset(0);
      setDragStartX(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
    setDragStartX(null);
    setDragOffset(0);
  };

  useEffect(() => {
    setLoading(true);
    let unsubscribes: (() => void)[] = [];

    const subscribeToDoc = (docId: string, callback: (data: any) => void) => {
      const unsub = onSnapshot(doc(db, 'appSettings', docId), (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data());
        }
      }, (error) => {
        console.error(`Firebase Error on ${docId}:`, error);
      });
      unsubscribes.push(unsub);
    };

    subscribeToDoc('default', (data) => {
      if (data.logoUrl !== undefined) setLogoUrl(data.logoUrl);
      if (data.appTitle) setAppTitle(data.appTitle);
      if (data.appSubtitle) setAppSubtitle(data.appSubtitle);
      if (data.downloadUrl !== undefined) setDownloadUrl(data.downloadUrl);
      if (data.pins) setPins(data.pins);
      setLoading(false);
    });

    subscribeToDoc('bg', (data) => {
      if (data.canvasBg) setCanvasBg(data.canvasBg);
    });

    subscribeToDoc('hero', (data) => {
      if (data.heroBannerUrl) setHeroBannerUrl(data.heroBannerUrl);
      if (data.boatImgUrl !== undefined) setBoatImgUrl(data.boatImgUrl);
    });

    subscribeToDoc('map', (data) => {
      if (data.mapImg) setMapImg(data.mapImg);
    });

    subscribeToDoc('promo', (data) => {
      if (data.promoBanners) setPromoBanners(data.promoBanners);
    });

    subscribeToDoc('tourPackages', (data) => {
      if (data.tourPackages) setTourPackages(data.tourPackages);
    });

    subscribeToDoc('activities', (data) => {
      if (data.activities) setActivities(data.activities);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, []);

  const compressDataUrl = (dataUrl: string, maxWidth = 800, quality = 0.6): Promise<string> => {
    return new Promise((resolve) => {
      if (!dataUrl.startsWith('data:image/')) {
        return resolve(dataUrl); // Skip non-data URLs
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        } else if (height > maxWidth) {
          width *= maxWidth / height;
          height = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // Compress large arrays
      const compressedTourPackages = await Promise.all(
        tourPackages.map(async (p) => ({ ...p, image: await compressDataUrl(p.image, 300, 0.4) }))
      );
      const compressedActivities = await Promise.all(
        activities.map(async (a) => ({ ...a, image: await compressDataUrl(a.image, 300, 0.4) }))
      );
      const compressedPromoBanners = await Promise.all(
        promoBanners.map(async (b) => ({ ...b, image: await compressDataUrl(b.image, 600, 0.5) }))
      );

      await Promise.all([
        setDoc(doc(db, 'appSettings', 'default'), {
          logoUrl: await compressDataUrl(logoUrl || '', 400),
          appTitle: appTitle || '',
          appSubtitle: appSubtitle || '',
          downloadUrl: downloadUrl || '',
          pins: pins || [],
        }, { merge: true }),
        setDoc(doc(db, 'appSettings', 'bg'), {
          canvasBg: canvasBg.startsWith('bg-') ? canvasBg : await compressDataUrl(canvasBg || '', 1600),
        }, { merge: true }),
        setDoc(doc(db, 'appSettings', 'hero'), {
          heroBannerUrl: await compressDataUrl(heroBannerUrl || '', 1600),
          boatImgUrl: await compressDataUrl(boatImgUrl || '', 800),
        }, { merge: true }),
        setDoc(doc(db, 'appSettings', 'map'), {
          mapImg: await compressDataUrl(mapImg || '', 800),
        }, { merge: true }),
        setDoc(doc(db, 'appSettings', 'promo'), {
          promoBanners: compressedPromoBanners || [],
        }, { merge: true }),
        setDoc(doc(db, 'appSettings', 'tourPackages'), {
          tourPackages: compressedTourPackages || [],
        }, { merge: true }),
        setDoc(doc(db, 'appSettings', 'activities'), {
          activities: compressedActivities || []
        }, { merge: true })
      ]);

      setSettingsOpen(false);
    } catch (error: any) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings: " + (error.message || error));
    } finally {
      setSaving(false);
    }
  };

  const mapRef = React.useRef<HTMLDivElement>(null);
  const [draggingPin, setDraggingPin] = useState<number | null>(null);

  const updatePin = (index: number, field: 'top' | 'left', value: number) => {
    const newPins = [...pins];
    newPins[index] = { ...newPins[index], [field]: value };
    setPins(newPins);
  };

  React.useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (draggingPin === null || !mapRef.current) return;
      const rect = mapRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      
      x = Math.max(0, Math.min(x, rect.width));
      y = Math.max(0, Math.min(y, rect.height));
      
      const left = Math.round((x / rect.width) * 100);
      const top = Math.round((y / rect.height) * 100);
      
      updatePin(draggingPin, 'left', left);
      updatePin(draggingPin, 'top', top);
    };

    const handlePointerUp = () => {
      setDraggingPin(null);
    };

    if (draggingPin !== null) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingPin, pins]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void, maxWidth = 800) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxWidth) {
                width *= maxWidth / height;
                height = maxWidth;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/webp', 0.6);
            setter(dataUrl);
          };
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const isVideoBanner = heroBannerUrl.match(/\.(mp4|webm|ogg)$/i) != null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center selection:bg-blue-100 font-sans">
      <div 
        className={`w-full max-w-[480px] ${canvasBg.startsWith('bg-') ? canvasBg : ''} relative overflow-x-hidden shadow-2xl transition-colors flex flex-col`}
      >
        {!canvasBg.startsWith('bg-') && (
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ 
              backgroundImage: `url(${canvasBg})`, 
              backgroundSize: '100% auto', 
              backgroundRepeat: 'repeat-y', 
              backgroundAttachment: 'scroll', 
              backgroundPosition: 'top center',
              filter: 'blur(3px)',
              transform: 'scale(1.05)' // slightly scale to hide blurred edges
            }}
          />
        )}
        {!canvasBg.startsWith('bg-') && (
          <div className="absolute inset-0 bg-white/40 z-0 pointer-events-none" />
        )}
        
        {/* SETTINGS OVERLAY */}
        {settingsOpen && (
          <div className="fixed inset-0 z-[100] bg-black/40 flex justify-end">
            <div className="w-[85%] max-w-sm bg-white h-full overflow-y-auto p-5 shadow-2xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                {activeSettingsTab === 'main' ? (
                  <h2 className="font-bold text-lg text-gray-900">Customization Settings</h2>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveSettingsTab('main')} className="p-2 -ml-2 bg-gray-100 rounded-full hover:bg-gray-200">
                      <ChevronRight className="w-5 h-5 text-gray-700 rotate-180" />
                    </button>
                    <h2 className="font-bold text-lg text-gray-900">{activeSettingsTab === 'tours' ? 'Tour Packages' : 'Activities'}</h2>
                  </div>
                )}
                <button onClick={() => { setSettingsOpen(false); setActiveSettingsTab('main'); }} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              
              {activeSettingsTab === 'main' && (
                <div className="space-y-6 flex-1">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Canvas Background Image / Color</label>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={canvasBg.startsWith('bg-') ? '' : canvasBg}
                        onChange={(e) => setCanvasBg(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                        placeholder="Image URL"
                      />
                      <label className="bg-blue-600 text-white px-3 py-2.5 rounded-lg cursor-pointer text-sm font-semibold flex items-center shrink-0">
                        Upload
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setCanvasBg)} />
                      </label>
                    </div>
                    <select 
                      value={canvasBg.startsWith('bg-') ? canvasBg : ''} 
                      onChange={(e) => setCanvasBg(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                    >
                      <option value="" disabled>-- Custom Image --</option>
                      <option value="bg-white">White</option>
                      <option value="bg-gray-50">Very Light Gray</option>
                      <option value="bg-blue-50/50">Soft Blue</option>
                      <option value="bg-slate-50">Slate</option>
                    </select>
                  </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">App Logo</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                      placeholder="URL or Upload"
                    />
                    <label className="bg-blue-600 text-white px-3 py-2.5 rounded-lg cursor-pointer text-sm font-semibold flex items-center shrink-0">
                      Upload
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setLogoUrl)} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">App Title</label>
                  <input 
                    type="text" 
                    value={appTitle}
                    onChange={(e) => setAppTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">App Subtitle</label>
                  <input 
                    type="text" 
                    value={appSubtitle}
                    onChange={(e) => setAppSubtitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Download App URL</label>
                  <input 
                    type="text" 
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                    placeholder="https://play.google.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image/Video</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={heroBannerUrl}
                      onChange={(e) => setHeroBannerUrl(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                      placeholder="URL (https://...)"
                    />
                    <label className="bg-blue-600 text-white px-3 py-2.5 rounded-lg cursor-pointer text-sm font-semibold flex items-center shrink-0">
                      Upload
                      <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => handleImageUpload(e, setHeroBannerUrl)} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Floating Boat Image</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={boatImgUrl}
                      onChange={(e) => setBoatImgUrl(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                      placeholder="URL (https://...)"
                    />
                    <label className="bg-blue-600 text-white px-3 py-2.5 rounded-lg cursor-pointer text-sm font-semibold flex items-center shrink-0">
                      Upload
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setBoatImgUrl)} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Map Image</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={mapImg}
                      onChange={(e) => setMapImg(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm"
                      placeholder="URL (https://...)"
                    />
                    <label className="bg-blue-600 text-white px-3 py-2.5 rounded-lg cursor-pointer text-sm font-semibold flex items-center shrink-0">
                      Upload
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setMapImg)} />
                    </label>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700">Promo Banners</label>
                    <button 
                      onClick={() => setPromoBanners([...promoBanners, { id: Date.now(), image: '', title: 'New Promo' }])}
                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-200"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {promoBanners.map((promo, idx) => (
                      <div key={promo.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500">Banner {idx + 1}</span>
                          <button onClick={() => setPromoBanners(promoBanners.filter(p => p.id !== promo.id))} className="text-red-500 text-xs font-bold hover:underline">Remove</button>
                        </div>
                        <input type="text" value={promo.title} onChange={e => {
                          const newBanners = [...promoBanners];
                          newBanners[idx].title = e.target.value;
                          setPromoBanners(newBanners);
                        }} className="w-full bg-white border border-gray-200 rounded p-2 text-xs" placeholder="Promo Title" />
                        
                        <div className="flex gap-2">
                          <input type="text" value={promo.image} onChange={e => {
                            const newBanners = [...promoBanners];
                            newBanners[idx].image = e.target.value;
                            setPromoBanners(newBanners);
                          }} className="flex-1 bg-white border border-gray-200 rounded p-2 text-xs" placeholder="Image URL" />
                          <label className="bg-gray-200 text-gray-700 px-2 py-1.5 rounded cursor-pointer text-[10px] font-bold flex items-center shrink-0 hover:bg-gray-300">
                            Upload
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                 const reader = new FileReader();
                                 reader.onload = (event) => {
                                   if (event.target?.result) {
                                     const newBanners = [...promoBanners];
                                     newBanners[idx].image = event.target.result as string;
                                     setPromoBanners(newBanners);
                                   }
                                 };
                                 reader.readAsDataURL(file);
                               }
                               e.target.value = '';
                            }} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Adjust Map Pins (Drag to Move)</label>
                  <div 
                    ref={mapRef}
                    className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 cursor-crosshair touch-none"
                  >
                    <img src={mapImg} alt="Map Preview" className="w-full h-full object-cover opacity-50" />
                    {pins.map((pin, i) => (
                      <div 
                        key={pin.id} 
                        onPointerDown={(e) => {
                          e.preventDefault();
                          setDraggingPin(i);
                        }}
                        className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold ${pin.color} transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing ${draggingPin === i ? 'scale-110 z-10' : ''}`} 
                        style={{ top: `${pin.top}%`, left: `${pin.left}%`, touchAction: 'none' }}
                      >
                        {pin.id}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 border-t border-gray-100 mt-4">
                  <button 
                    onClick={() => setActiveSettingsTab('tours')}
                    className="w-full bg-blue-50 text-blue-700 font-semibold py-3 px-4 rounded-xl shadow-sm hover:bg-blue-100 transition-colors flex justify-between items-center"
                  >
                    Manage Tour Packages
                    <ChevronRight className="w-5 h-5 text-blue-500" />
                  </button>
                  <button 
                    onClick={() => setActiveSettingsTab('activities')}
                    className="w-full bg-green-50 text-green-700 font-semibold py-3 px-4 rounded-xl shadow-sm hover:bg-green-100 transition-colors flex justify-between items-center"
                  >
                    Manage Activities
                    <ChevronRight className="w-5 h-5 text-green-500" />
                  </button>
                </div>
              </div>
              )}

              {activeSettingsTab === 'tours' && (
                <div className="space-y-6 flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700">Tour Packages</label>
                    <button 
                      onClick={() => setTourPackages([...tourPackages, { id: Date.now(), image: '', title: 'New Package', price: 'Rp 0' }])}
                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-200"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {tourPackages.map((tour, idx) => (
                      <div key={tour.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500">Package {idx + 1}</span>
                          <button onClick={() => setTourPackages(tourPackages.filter(p => p.id !== tour.id))} className="text-red-500 text-xs font-bold hover:underline">Remove</button>
                        </div>
                        <div className="flex gap-2">
                          <input type="text" value={tour.title} onChange={e => {
                            const newItems = [...tourPackages];
                            newItems[idx].title = e.target.value;
                            setTourPackages(newItems);
                          }} className="flex-1 bg-white border border-gray-200 rounded p-2 text-xs" placeholder="Title" />
                          <input type="text" value={tour.price} onChange={e => {
                            const newItems = [...tourPackages];
                            newItems[idx].price = e.target.value;
                            setTourPackages(newItems);
                          }} className="w-1/3 bg-white border border-gray-200 rounded p-2 text-xs" placeholder="Price" />
                        </div>
                        <div className="flex gap-2">
                          <input type="text" value={tour.image} onChange={e => {
                            const newItems = [...tourPackages];
                            newItems[idx].image = e.target.value;
                            setTourPackages(newItems);
                          }} className="flex-1 bg-white border border-gray-200 rounded p-2 text-xs" placeholder="Image URL" />
                          <label className="bg-gray-200 text-gray-700 px-2 py-1.5 rounded cursor-pointer text-[10px] font-bold flex items-center shrink-0 hover:bg-gray-300">
                            Upload
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                               handleImageUpload(e, (url) => {
                                 const newItems = [...tourPackages];
                                 newItems[idx].image = url;
                                 setTourPackages(newItems);
                               });
                            }} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSettingsTab === 'activities' && (
                <div className="space-y-6 flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700">Activities</label>
                    <button 
                      onClick={() => setActivities([...activities, { id: Date.now(), image: '', title: 'New Activity', location: 'Location', desc: 'Description', price: 'Rp 0', rating: 5.0 }])}
                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-200"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {activities.map((act, idx) => (
                      <div key={act.id} className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500">Activity {idx + 1}</span>
                          <button onClick={() => setActivities(activities.filter(p => p.id !== act.id))} className="text-red-500 text-xs font-bold hover:underline">Remove</button>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <input type="text" value={act.title} onChange={e => {
                              const newItems = [...activities];
                              newItems[idx].title = e.target.value;
                              setActivities(newItems);
                            }} className="flex-1 bg-white border border-gray-200 rounded p-2 text-xs" placeholder="Title" />
                            <input type="text" value={act.rating} onChange={e => {
                              const newItems = [...activities];
                              newItems[idx].rating = parseFloat(e.target.value) || 0;
                              setActivities(newItems);
                            }} className="w-1/4 bg-white border border-gray-200 rounded p-2 text-xs" placeholder="Rating" />
                          </div>
                          <div className="flex gap-2">
                            <input type="text" value={act.location} onChange={e => {
                              const newItems = [...activities];
                              newItems[idx].location = e.target.value;
                              setActivities(newItems);
                            }} className="flex-1 bg-white border border-gray-200 rounded p-2 text-xs" placeholder="Location" />
                            <input type="text" value={act.price} onChange={e => {
                              const newItems = [...activities];
                              newItems[idx].price = e.target.value;
                              setActivities(newItems);
                            }} className="w-1/3 bg-white border border-gray-200 rounded p-2 text-xs font-bold text-red-600" placeholder="Harga / Price" />
                          </div>
                          <textarea value={act.desc} onChange={e => {
                            const newItems = [...activities];
                            newItems[idx].desc = e.target.value;
                            setActivities(newItems);
                          }} className="w-full bg-white border border-gray-200 rounded p-2 text-xs" placeholder="Description" rows={2} />
                        </div>
                        <div className="flex gap-2">
                          <input type="text" value={act.image} onChange={e => {
                            const newItems = [...activities];
                            newItems[idx].image = e.target.value;
                            setActivities(newItems);
                          }} className="flex-1 bg-white border border-gray-200 rounded p-2 text-xs" placeholder="Image URL" />
                          <label className="bg-gray-200 text-gray-700 px-2 py-1.5 rounded cursor-pointer text-[10px] font-bold flex items-center shrink-0 hover:bg-gray-300">
                            Upload
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                               handleImageUpload(e, (url) => {
                                 const newItems = [...activities];
                                 newItems[idx].image = url;
                                 setActivities(newItems);
                               });
                            }} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-6 pt-4 border-t border-gray-100 shrink-0">
                <button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className={`w-full text-white font-bold py-3 rounded-xl shadow-md transition-colors ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {saving ? 'Compressing & Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HERO FULL SCREEN & HEADER */}
        <div className="relative w-full aspect-square mb-2">
          <div className="absolute top-0 inset-x-0 aspect-[1080/1429] pointer-events-none z-0" style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}>
            {isVideoBanner ? (
              <video src={heroBannerUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <img src={heroBannerUrl} alt="Hero Banner" className="absolute inset-0 w-full h-full object-cover" />
            )}
          </div>
          
          {boatImgUrl && (
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center pt-24 pr-16">
               <img src={boatImgUrl} alt="Boat" className="w-32 h-auto object-contain animate-boat-float drop-shadow-xl" />
            </div>
          )}

          <header className="absolute top-0 inset-x-0 z-40 px-5 py-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className={`w-11 h-11 rounded-xl object-cover shadow-[0_4px_10px_rgba(0,0,0,0.4)] bg-white border-2 border-white`} />
                ) : (
                  <div className={`w-11 h-11 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center bg-blue-600 border-2 border-white`}>
                    <Palmtree className="text-white w-6 h-6 drop-shadow-md" />
                  </div>
                )}
                <div>
                   <h1 className="text-2xl font-black text-white leading-none" style={{ textShadow: '0px 2px 5px rgba(0,0,0,0.5), -1px -1px 0 rgba(0,0,0,0.6), 1px -1px 0 rgba(0,0,0,0.6), -1px 1px 0 rgba(0,0,0,0.6), 1px 1px 0 rgba(0,0,0,0.6)' }}>{appTitle}</h1>
                   <p className="text-white text-xs font-bold mt-1 tracking-wide" style={{ textShadow: '0px 2px 5px rgba(0,0,0,0.5), -1px -1px 0 rgba(0,0,0,0.6), 1px -1px 0 rgba(0,0,0,0.6), -1px 1px 0 rgba(0,0,0,0.6), 1px 1px 0 rgba(0,0,0,0.6)' }}>{appSubtitle}</p>
                </div>
              </div>
            </div>
            <div className="relative flex items-center" ref={searchBarRef}>
              <Search className="absolute left-4 w-5 h-5 text-gray-500 z-10" />
              <input 
                type="text" 
                placeholder="Search tour packages, activities..." 
                className="w-full bg-white/95 backdrop-blur-md shadow-lg rounded-full py-3 pl-11 pr-24 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-shadow" 
                disabled
              />
              <button 
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{ transform: `translateX(${dragOffset}px)`, touchAction: 'none' }}
                className="absolute right-1.5 bg-indigo-600 border border-indigo-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm hover:bg-indigo-700 z-10 cursor-grab active:cursor-grabbing select-none"
              >
                Search
              </button>
            </div>
          </header>

          <div className="absolute bottom-0 left-6 right-6 z-10">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide mb-2 inline-block shadow-md">Discover</span>
            <h2 className="text-xl font-black text-white leading-tight mb-1 truncate" style={{ textShadow: '0px 2px 5px rgba(0,0,0,0.1), -1px -1px 0 rgba(0,0,0,0.5), 1px -1px 0 rgba(0,0,0,0.5), -1px 1px 0 rgba(0,0,0,0.5), 1px 1px 0 rgba(0,0,0,0.5)' }}>Your Paradise in Bali</h2>
            <p className="text-[11px] text-blue-400 font-medium truncate" style={{ textShadow: '0px 2px 5px rgba(0,0,0,0.1), -0.5px -0.5px 0 rgba(0,0,0,0.5), 0.5px -0.5px 0 rgba(0,0,0,0.5), -0.5px 0.5px 0 rgba(0,0,0,0.5), 0.5px 0.5px 0 rgba(0,0,0,0.5)' }}>Explore the best tour packages and exciting activities.</p>
          </div>
        </div>
        
        {/* BADGES */}
        <section className="relative z-10 px-5 mb-10">
          <div className="flex justify-between gap-3">
            {[
              { title: "Best Price", icon: Wallet, color: "bg-gradient-to-br from-[#ffbf3a] to-[#ff9800]", shadow: "shadow-orange-500/40" },
              { title: "Easy Book", icon: MousePointerClick, color: "bg-gradient-to-br from-[#33b5e5] to-[#0099cc]", shadow: "shadow-cyan-500/40" },
              { title: "Trusted", icon: ShieldCheck, color: "bg-gradient-to-br from-[#7c4dff] to-[#6200ea]", shadow: "shadow-indigo-500/40" }
            ].map((badge, i) => (
              <div key={i} className={`flex-1 flex flex-col items-center justify-center p-3 h-[120px] rounded-[32px] ${badge.color} shadow-lg ${badge.shadow} border-t-2 border-white/20 transform transition-transform hover:-translate-y-1`}>
                 <div className="mb-3 relative">
                    <badge.icon className="w-6 h-6 text-white" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.25))', strokeWidth: 2.5 }} />
                 </div>
                 <span className="text-[11px] font-black text-white text-center leading-tight drop-shadow-sm">{badge.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* TOUR PACKAGES */}
        <section className="px-5 mb-10">
          <SectionHeader title="Tour Packages" count="10 Available" />
          <div className="grid grid-cols-1 gap-6 px-1">
             {tourPackages.map((tour, idx) => (
               <div key={tour.id} className={`bg-white p-2.5 pb-5 flex flex-col relative transform ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'} shadow-md hover:shadow-lg transition-shadow`}>
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-4 bg-yellow-50/90 border border-yellow-100 shadow-sm rotate-[-3deg] z-10" />
                 <div className="relative aspect-[3/1.5] overflow-hidden mb-3 bg-gray-100">
                   <img src={tour.image} alt={tour.title} className="w-full h-full object-cover object-top" />
                 </div>
                 <div className="flex justify-between items-center px-1">
                   <h3 className="font-bold text-gray-800 text-sm leading-tight">{tour.title}</h3>
                   <p className="text-red-600 font-bold text-sm">{tour.price}</p>
                 </div>
               </div>
             ))}
          </div>
        </section>

        {/* ACTIVITIES */}
        <section className="px-5 mb-10">
          <SectionHeader title="Activities" count="16 Available" />
          <div className="grid grid-cols-2 gap-5 px-1">
             {activities.map((act, idx) => (
               <div key={act.id} className={`bg-white p-2.5 pb-5 flex flex-col h-full relative transform ${idx % 2 !== 0 ? 'rotate-2' : '-rotate-1'} shadow-md hover:shadow-lg transition-shadow`}>
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-yellow-50/90 border border-yellow-100 shadow-sm rotate-[2deg] z-10" />
                 <div className="relative h-28 overflow-hidden mb-3 bg-gray-100">
                   <img src={act.image} alt="act" className="w-full h-full object-cover" />
                   <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-2 py-1 flex items-center gap-1 shadow-sm">
                     <Star className="w-3 h-3 text-yellow-500 fill-current" /> {act.rating}
                   </div>
                 </div>
                 <h3 className="text-gray-900 text-xs font-bold leading-tight mb-2 px-1">{act.title}</h3>
                 <div className="mt-auto pt-1 px-1">
                   <p className="text-red-600 font-bold text-xs">{act.price}</p>
                 </div>
               </div>
             ))}
          </div>
        </section>

        {/* MAP & HIGHLIGHTS */}
        <section className="px-5 mb-10 space-y-6">
          <div className={`bg-white rounded-[32px] p-4 pt-7 relative ${cardShadow} border border-white/50 flex flex-col`}>
            <div className="absolute -top-3 left-4 bg-[#8b5a2b] border-2 border-[#5c3a18] shadow-md px-4 py-1.5 rounded-xl transform -rotate-2 z-10">
               <span className="text-white text-sm font-black tracking-wider shadow-sm flex items-center gap-2">
                 <span className="text-lg leading-none">🌸</span> TOURIST MAP
               </span>
            </div>
            <div className="flex justify-end items-center mb-3 px-1">
              <button className="bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors">
                 <MapIcon className="w-3 h-3" /> Explore Map
              </button>
            </div>
            <div className="relative h-[200px] rounded-2xl overflow-hidden border-4 border-[#e2e8f0] bg-gray-100 shadow-inner">
              <img src={mapImg} alt="Map" className="w-full h-full object-cover" />
              
              {pins.map(pin => (
                <div key={pin.id} className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold ${pin.color} transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300`} style={{ top: `${pin.top}%`, left: `${pin.left}%` }}>
                  {pin.id}
                </div>
              ))}
            </div>
          </div>

          <div className={`bg-white rounded-[32px] p-4 pt-6 pb-8 relative ${cardShadow} border border-white/50`}>
            <div className="absolute -top-3 left-4 bg-[#8b5a2b] border-2 border-[#5c3a18] shadow-md px-4 py-1.5 rounded-xl transform -rotate-2 z-10">
               <span className="text-white text-sm font-black tracking-wider shadow-sm flex items-center gap-2">
                 <span className="text-lg leading-none">🌸</span> WHY CHOOSE US?
               </span>
            </div>
            <div className="grid grid-cols-3 gap-x-2 gap-y-6 mt-6">
              {[
                { title: "Low Price", desc: "Get the best service at a low price more than others", icon: PiggyBank, color: "text-[#00b4d8]" },
                { title: "Good Service", desc: "Friendly and funny tour guide make you happy", icon: Star, color: "text-[#002B5B] fill-current" },
                { title: "Experience", desc: "More than 10 years of experience serving customers", icon: Clock, color: "text-[#002B5B]" },
                { title: "Professional", desc: "We have a professional team all over Bali", icon: User, color: "text-[#00b4d8]" },
                { title: "Support Team", desc: "Receive complaints by providing the best solution", icon: Users, color: "text-[#006d77]" },
                { title: "Fast Respond", desc: "Fast ordering process and easy payment", icon: PartyPopper, color: "text-[#006d77]" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5">
                   <div className="w-12 h-12 flex items-center justify-center shrink-0 animate-bounce" style={{ animationDelay: `${i * 0.15}s`, animationDuration: '2s' }}>
                     <item.icon className={`w-9 h-9 ${item.color}`} strokeWidth={1.5} />
                   </div>
                   <div>
                     <h4 className="text-[11px] font-black text-gray-900 leading-tight mb-1">{item.title}</h4>
                     <p className="text-[9px] text-gray-600 font-medium leading-tight px-0.5">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DOWNLOAD BUTTON APK */}
        <div className="fixed bottom-6 w-full max-w-[480px] px-5 z-50 left-1/2 -translate-x-1/2">
          <a 
            href="https://github.com/pundhy89/BaliTopTour.New/releases/download/v1.0.0/BaliTopTour.v3.apk"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all active:scale-95 border-b-4 border-blue-800 uppercase tracking-wider"
          >
            <Download className="w-5 h-5" /> Download App (APK)
          </a>
        </div>

        {/* PROMO BANNERS */}
        <PromoCarousel banners={promoBanners} />
        
        {/* BOTTOM SLIDE TO DOWNLOAD */}
        <div className="w-full bg-white/50 backdrop-blur-md p-4 border-t border-white/50 z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] pb-28 mt-4 flex flex-col items-center">
          <SlideToDownload downloadUrl={downloadUrl} />
          <div className="mt-3 flex items-center gap-1.5 text-gray-500 text-[10px] font-bold">
            Powered by: 
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Google_Play_2022_logo.svg" alt="Google Play" className="h-5" />
          </div>
        </div>

      </div>
    </div>
  );
}
