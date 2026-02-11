
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, VolumeX, Sparkles, Star, RotateCcw, Headphones, Info, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Components ---

const FloatingHearts = () => {
  const hearts = Array.from({ length: 25 });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-200/40"
          initial={{
            x: Math.random() * 100 + '%',
            y: '110%',
            scale: Math.random() * 0.5 + 0.5,
            rotate: Math.random() * 360
          }}
          animate={{
            y: '-10%',
            rotate: Math.random() * 360 + 360
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        >
          <Heart fill="currentColor" size={Math.random() * 30 + 15} />
        </motion.div>
      ))}
    </div>
  );
};

const ImageCard = ({ src, delay, caption }: { src: string, delay: number, caption?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, rotate: Math.random() * 6 - 3 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
    className="bg-white p-3 pb-8 shadow-2xl border border-rose-100 rounded-sm transform transition-all duration-300 w-full max-w-sm"
  >
    <div className="overflow-hidden bg-rose-50 aspect-[3/4]">
      <img
        src={src}
        alt="Memory"
        className="w-full h-full object-cover transition-all duration-500"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://placehold.co/600x800/fff1f2/e11d48?text=Add+${src}+Here`;
        }}
      />
    </div>
    {caption && (
      <p className="font-signature text-rose-600 text-2xl text-center mt-4">{caption}</p>
    )}
  </motion.div>
);

const CaptchaVerification = ({ onVerified }: { onVerified: () => void }) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState(false);

  // In a real scenario, the user would provide 6 images of themselves (val1-val6) 
  // and we'd have 3 decoy images. For now, placeholders represent the "Valentine".
  const images = [
    { id: 1, src: '/images/val1.jpeg', isValentine: true },
    { id: 2, src: '/images/val2.jpeg', isValentine: true },
    { id: 3, src: '/images/decoy1.jpg', isValentine: false },
    { id: 4, src: '/images/val3.jpeg', isValentine: true },
    { id: 5, src: '/images/val4.jpeg', isValentine: true },
    { id: 6, src: '/images/decoy2.jpg', isValentine: false },
    { id: 7, src: '/images/val5.jpeg', isValentine: true },
    { id: 8, src: '/images/decoy3.jpg', isValentine: false },
    { id: 9, src: '/images/val6.jpeg', isValentine: true },
  ];

  const toggleSelect = (id: number) => {
    setError(false);
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleVerify = () => {
    const valIds = images.filter(img => img.isValentine).map(img => img.id);
    const isCorrect =
      selected.length === valIds.length &&
      selected.every(id => valIds.includes(id));

    if (isCorrect) {
      onVerified();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border-2 border-[#E11D48] shadow-2xl w-[95%] max-w-[400px] overflow-hidden rounded-sm"
    >
      <div className="bg-[#E11D48] p-6 text-white text-left">
        <p className="text-sm opacity-90 mb-1">Select all images with</p>
        <h3 className="text-3xl font-bold leading-tight">your valentine</h3>
        <p className="text-xs mt-1 font-medium">Click verify once there are none left.</p>
      </div>

      <div className="p-1 grid grid-cols-3 gap-1">
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => toggleSelect(img.id)}
            className="relative aspect-square cursor-pointer group overflow-hidden bg-gray-100"
          >
            <img
              src={img.src}
              className={`w-full h-full object-cover transition-transform duration-300 ${selected.includes(img.id) ? 'scale-90' : 'group-hover:scale-105'}`}
              onError={(e) => {
                const text = img.isValentine ? `Me ${img.id}` : "Not Me";
                (e.target as HTMLImageElement).src = `https://placehold.co/200x200/fff1f2/e11d48?text=${text}`;
              }}
            />
            {selected.includes(img.id) && (
              <div className="absolute inset-0 bg-white/20 flex items-start justify-start p-1">
                <div className="bg-blue-500 rounded-full p-0.5 shadow-md">
                  <Check className="text-white" size={12} strokeWidth={4} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={`flex items-center justify-between p-3 border-t ${error ? 'bg-red-50' : ''} transition-colors`}>
        <div className="flex gap-4 text-gray-400">
          <RotateCcw size={20} className="hover:text-gray-600 cursor-pointer" />
          <Headphones size={20} className="hover:text-gray-600 cursor-pointer" />
          <Info size={20} className="hover:text-gray-600 cursor-pointer" />
        </div>
        <button
          onClick={handleVerify}
          className="bg-[#E11D48] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded-sm hover:bg-rose-700 transition-colors shadow-sm active:scale-95"
        >
          Verify
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-[10px] text-center pb-2 uppercase tracking-tighter">Please try again. That's not me!</p>
      )}
    </motion.div>
  );
};

// --- Main Application ---

type AppState = 'loading' | 'gate' | 'captcha' | 'main';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [isMuted, setIsMuted] = useState(true);
  const [yesSize, setYesSize] = useState(1);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [proposalAccepted, setProposalAccepted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAppState('gate'), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleUnlock = () => {
    setAppState('captcha');
  };

  const handleVerified = () => {
    setAppState('main');
    setIsMuted(false);
  };

  const handleNoInteraction = () => {
    const newX = (Math.random() - 0.5) * 400;
    const newY = (Math.random() - 0.5) * 400;
    setNoPosition({ x: newX, y: newY });
    setYesSize(prev => Math.min(prev + 0.5, 12));
  };

  const handleYes = () => {
    setProposalAccepted(true);
    confetti({
      particleCount: 250,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#E11D48', '#FB7185', '#FFF1F2', '#FACC15']
    });
  };

  if (appState === 'loading') {
    return (
      <div className="h-screen w-full bg-rose-50 flex flex-col items-center justify-center space-y-6">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-rose-600"
        >
          <Heart fill="currentColor" size={80} />
        </motion.div>
        <p className="font-signature text-3xl text-rose-800 animate-pulse italic">Thinking of you...</p>
      </div>
    );
  }

  if (appState === 'gate') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          className="h-screen w-full bg-rose-50 flex flex-col items-center justify-center relative overflow-hidden p-6 text-center"
        >
          <FloatingHearts />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="z-10 space-y-12"
          >
            <div className="space-y-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="inline-block text-rose-600 mb-4"
              >
                <Heart size={64} fill="currentColor" />
              </motion.div>
              <h1 className="text-7xl md:text-9xl font-bold text-rose-800 tracking-tighter">My Love</h1>
              <p className="text-xl md:text-3xl text-rose-700/60 font-light italic">I made this for you</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleUnlock}
              className="px-16 py-6 bg-rose-600 text-white rounded-full text-2xl font-bold shadow-[0_20px_60px_-15px_rgba(225,29,72,0.4)] hover:bg-rose-700 transition-all flex items-center gap-4 mx-auto"
            >
              Tap to Open <Sparkles size={24} />
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (appState === 'captcha') {
    return (
      <div className="h-screen w-full bg-rose-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <FloatingHearts />
        <div className="z-10 w-full flex flex-col items-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 mb-4"
          >
            <h2 className="text-2xl font-bold text-rose-800 uppercase tracking-widest">Security Check</h2>
            <p className="text-rose-600 font-medium">Verify you're actually my valentine</p>
          </motion.div>

          <CaptchaVerification onVerified={handleVerified} />

          <p className="text-rose-300 text-xs italic">Hint: Select the 6 most handsome faces!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF1F2] flex flex-col items-center relative overflow-x-hidden pb-32">
      <FloatingHearts />

      {/* Music Toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-8 right-8 z-50 p-5 bg-white/90 backdrop-blur-md rounded-full shadow-2xl text-rose-600 hover:bg-rose-100 transition-all border border-rose-100"
      >
        {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} className="animate-pulse" />}
      </button>

      {/* Main Content */}
      <div className="w-full max-w-6xl px-6 pt-32 pb-12 text-center space-y-32 z-10">

        {/* Heartfelt Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="space-y-8"
        >
          <h2 className="text-6xl md:text-[10rem] font-bold text-rose-900 leading-none tracking-tight">
            I love you <br /> so much
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="font-signature text-3xl md:text-5xl text-rose-700 italic max-w-2xl mx-auto"
          >
            "You are the most beautiful person I know, inside and out."
          </motion.p>
        </motion.div>

        {/* The Pictures Grid (The 3 Images of HER you uploaded) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4 justify-items-center">
          <ImageCard
            src="/images/image1.png"
            delay={0.2}
            caption="Simply stunning"
          />
          <ImageCard
            src="/images/image2.jpg"
            delay={0.4}
            caption="My favorite smile"
          />
          <ImageCard
            src="/images/image3.jpg"
            delay={0.6}
            caption="Always beautiful"
          />
        </div>

        {/* The Special Question */}
        <section className="py-32 relative min-h-[600px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!proposalAccepted ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                className="text-center space-y-20 w-full"
              >
                <div className="relative inline-block">
                  <h2 className="text-6xl md:text-9xl font-bold text-rose-950 leading-tight relative z-10 drop-shadow-sm">
                    Will you be my Valentine?
                  </h2>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="absolute -top-16 -right-16 text-rose-300 -z-0 opacity-40"
                  >
                    <Heart size={160} fill="currentColor" />
                  </motion.div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-16">
                  <motion.button
                    style={{ scale: yesSize }}
                    whileHover={{ scale: yesSize * 1.05 }}
                    whileTap={{ scale: yesSize * 0.95 }}
                    onClick={handleYes}
                    className="px-24 py-10 bg-rose-600 text-white rounded-full text-5xl font-black shadow-[0_25px_60px_rgba(225,29,72,0.4)] hover:bg-rose-700 z-50 border-b-8 border-rose-800 transition-all active:translate-y-2 active:border-b-0"
                  >
                    YES!
                  </motion.button>

                  <motion.button
                    animate={{ x: noPosition.x, y: noPosition.y }}
                    onMouseEnter={handleNoInteraction}
                    onTouchStart={handleNoInteraction}
                    className="px-12 py-6 bg-white text-rose-600 border-2 border-rose-200 rounded-full text-2xl font-semibold shadow-xl hover:border-rose-400 transition-colors"
                  >
                    No
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="accepted"
                initial={{ opacity: 0, y: 100, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 100 }}
                className="text-center space-y-12"
              >
                <div className="flex justify-center mb-10">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="text-yellow-400 fill-yellow-400 drop-shadow-2xl" size={150} />
                  </motion.div>
                </div>
                <h2 className="text-8xl md:text-[14rem] font-black text-rose-900 tracking-tighter leading-none">
                  YES! ❤️
                </h2>
                <div className="space-y-6">
                  <p className="text-4xl md:text-6xl text-rose-700 italic font-signature">I'm the luckiest person alive.</p>
                  <p className="text-2xl text-rose-400 font-light tracking-[0.6em] uppercase">Forever & Always</p>
                </div>
                <div className="flex justify-center gap-8 pt-10">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                      className="text-rose-600"
                    >
                      <Heart fill="currentColor" size={48} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Final Footer */}
      <footer className="w-full text-center py-20 text-rose-300 opacity-80">
        <div className="h-[1px] w-48 bg-rose-200 mx-auto mb-10" />
        <p className="text-xl font-signature text-rose-400 mb-4 italic">I love you more than words can say.</p>
        <p className="text-xs font-light uppercase tracking-[0.5em]">Project Amore • 2024</p>
      </footer>
    </div>
  );
}
