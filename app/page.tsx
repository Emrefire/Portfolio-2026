'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Space_Grotesk, Playfair_Display } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '700'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['600', '700'] });

// --- ÇEVİRİ VE VERİ MERKEZİ ---
const translations = {
  en: {
    hero: "EMRE DÖNMEZ",
    heroPrefix: "I am a",
    typewriterWords: ["Software Engineer", "Full-Stack Developer", "AI Specialist"],
    about: "Passionate about building scalable systems and integrating AI into real-world applications. I believe in clean code, robust architecture, and technology that makes a tangible impact.",
    projects: [
      { name: "Yoldaş", tag: "MOBILE AI", desc: "Location-based intelligence for modern life.", link: "https://github.com/Emrefire/Yoldas-App" },
      { name: "ODAK", tag: "COMPUTER VISION", desc: "TÜBİTAK 2209-A: Saving lives with facial recognition.", link: "https://github.com/Emrefire/ODAK-Driver-Drowsiness-Tracking" },
      { name: "NexTierAI", tag: "LLM & RAG", desc: "Your private local AI infrastructure.", link: "https://github.com/Emrefire/NextierAI" }
    ],
    experience: {
      title: "Experience",
      job: "Software Developer",
      date: "Present (İŞKUR Youth Program)",
      desc: "Actively contributing to the university's IT infrastructure, UI/UX optimization, and database management."
    },
    arsenal: "Tech Stack",
    contact: "START A PROJECT",
    btnEmail: "Say Hello",
    btnCv: "Download CV",
    rights: "ALL RIGHTS RESERVED"
  },
  tr: {
    hero: "EMRE DÖNMEZ",
    heroPrefix: "Ben bir",
    typewriterWords: ["Yazılım Mühendisi", "Full-Stack Geliştirici", "Yapay Zeka Uzmanı"],
    about: "Ölçeklenebilir sistemler kurma ve yapay zekayı gerçek dünya uygulamalarına entegre etme konusunda tutkuluyum. Temiz koda ve sağlam mimariye inanıyorum.",
    projects: [
      { name: "Yoldaş", tag: "MOBİL YZ", desc: "Modern yaşam için lokasyon bazlı zeka.", link: "https://github.com/Emrefire/Yoldas-App" },
      { name: "ODAK", tag: "GÖRÜNTÜ İŞLEME", desc: "TÜBİTAK 2209-B: Yüz tanıma ile hayat kurtaran sistem.", link: "https://github.com/Emrefire/ODAK-Driver-Drowsiness-Tracking" },
      { name: "NexTierAI", tag: "LLM & RAG", desc: "Kişisel yerel yapay zeka altyapınız.", link: "https://github.com/Emrefire/NextierAI" }
    ],
    experience: {
      title: "Deneyim",
      job: "Yazılım Geliştirici",
      date: "Güncel (İŞKUR Gençlik Programı)",
      desc: "Üniversitenin bilgi işlem departmanında aktif olarak görev alıyorum. Arayüz optimizasyonları ve veritabanı yönetimi süreçlerini yürütmekteyim."
    },
    arsenal: "Cephanelik",
    contact: "PROJE BAŞLAT",
    btnEmail: "Merhaba De",
    btnCv: "CV İndir",
    rights: "TÜM HAKLARI SAKLIDIR"
  }
};

// --- DAKTİLO EFEKTİ ---
function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const colorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let timeout = setTimeout(() => {
      const currentWord = words[index];
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));
        if (text === currentWord) setTimeout(() => setIsDeleting(true), 1500);
      } else {
        setText(currentWord.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, words]);

  useEffect(() => {
    let frameId: number;
    const update = () => {
      if (colorRef.current) {
        const hue = (Date.now() / 50) % 360;
        colorRef.current.style.color = `hsl(${hue}, 100%, 60%)`;
      }
      frameId = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return <span ref={colorRef} className="font-bold border-r-2 border-white pr-1 transition-all">{text}</span>;
}

// --- MORPHING 3D OBJESI ---
function MorphingScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();

  useFrame((state) => {
    if (!meshRef.current) return;
    const offset = scroll.offset;
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.005 + (offset * 0.05);
    meshRef.current.position.x = Math.sin(offset * Math.PI * 2) * 3;
    meshRef.current.scale.setScalar(1.2 + Math.sin(offset * Math.PI) * 0.4);
    
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial || meshRef.current.material instanceof THREE.MeshPhysicalMaterial) {
      const hue = (state.clock.elapsedTime * 0.05 + offset) % 1;
      meshRef.current.material.color.setHSL(hue, 0.7, 0.5);
    }
  });

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[2.5, 0.5, 256, 64]} />
        <MeshDistortMaterial speed={3} distort={0.5} radius={1} wireframe />
      </mesh>
    </Float>
  );
}

// --- PARLAYAN PROJE BİLEŞENİ ---
function GlowingProject({ project, index, total }: { project: any, index: number, total: number }) {
  const scroll = useScroll();
  const [active, setActive] = useState(false);
  const start = index / total;
  const end = (index + 0.8) / total;

  useFrame(() => {
    const offset = scroll.offset;
    setActive(offset > start - 0.05 && offset < end);
  });

  return (
    <div className={`h-screen flex flex-col items-center justify-center transition-all duration-1000 transform ${active ? 'scale-110 opacity-100 blur-0' : 'scale-75 opacity-10 blur-md'}`}>
      <span className="text-[#00f3ff] font-bold tracking-[0.5em] mb-4 drop-shadow-[0_0_15px_#00f3ff]">{project.tag}</span>
      <h2 className={`text-6xl md:text-[10vw] font-black text-center transition-all duration-500 ${active ? 'text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.7)]' : 'text-gray-900'}`}>
        {project.name}
      </h2>
      <p className="max-w-lg text-center text-gray-400 mt-6 text-xl font-light px-6">{project.desc}</p>
      <a href={project.link} target="_blank" className={`mt-10 px-12 py-4 border-2 border-white rounded-full font-bold tracking-widest transition-all ${active ? 'bg-white text-black translate-y-0' : 'translate-y-20 opacity-0'}`}>
        EXPLORE CODE
      </a>
    </div>
  );
}

export default function HyperPortfolio() {
  const [lang, setLang] = useState<'en' | 'tr'>('en');
  const t = translations[lang];
  const [mounted, setMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const handleMouse = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`h-screen w-full bg-[#020202] text-white overflow-hidden ${spaceGrotesk.className}`}>
      
      {/* CUSTOM MOUSE TRAIL */}
      <div 
        className="fixed w-8 h-8 border border-[#00f3ff] rounded-full pointer-events-none z-[100] transition-transform duration-100 mix-blend-difference hidden md:block"
        style={{ left: mouse.x, top: mouse.y, transform: `translate(-50%, -50%)` }}
      />

      <nav className="fixed top-0 w-full p-8 flex justify-between items-center z-50 mix-blend-difference">
        <div className="font-bold tracking-tighter text-2xl">E.D</div>
        <button onClick={() => setLang(lang === 'en' ? 'tr' : 'en')} className="px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">
          {lang === 'en' ? 'TR' : 'EN'}
        </button>
      </nav>

      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <fog attach="fog" args={['#020202', 12, 28]} />
        <ambientLight intensity={0.1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2.5} color="#00f3ff" />
        
        <ScrollControls pages={6} damping={0.25}>
          <MorphingScene />
          
          <Scroll html style={{ width: '100%' }}>
            
            {/* 1. HERO & TYPEWRITER */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-4">
              <h1 className={`text-[12vw] leading-none font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-700 ${playfair.className}`}>
                {t.hero}
              </h1>
              <div className="mt-6 text-2xl md:text-3xl font-light tracking-wide flex items-center gap-3">
                {t.heroPrefix} <Typewriter words={t.typewriterWords} />
              </div>
              <p className="max-w-2xl mt-12 text-gray-500 leading-relaxed text-lg border-t border-white/10 pt-8 italic">
                "{t.about}"
              </p>
            </section>

            {/* 2-3-4. PROJECTS */}
            {t.projects.map((proj, i) => (
              <GlowingProject key={i} project={proj} index={i + 1} total={5.5} />
            ))}

            {/* 5. EXPERIENCE & TECH */}
            <section className="h-screen flex items-center justify-center px-6">
               <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 backdrop-blur-md bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10">
                  <div>
                    <h3 className="text-[#00f3ff] text-sm tracking-[0.5em] font-bold mb-4 uppercase">{t.experience.title}</h3>
                    <h2 className="text-3xl md:text-5xl font-bold mb-2">{t.experience.job}</h2>
                    <p className="text-gray-500 text-sm mb-6">{t.experience.date}</p>
                    <p className="text-gray-300 leading-relaxed text-lg">{t.experience.desc}</p>
                  </div>
                  <div>
                    <h3 className="text-[#00f3ff] text-sm tracking-[0.5em] font-bold mb-8 uppercase">{t.arsenal}</h3>
                    <div className="flex flex-wrap gap-3">
                      {['.NET Core', 'React Native', 'Kotlin', 'Clean Architecture', 'LLM', 'RAG', 'Computer Vision', 'SQL Server'].map(skill => (
                        <span key={skill} className="px-4 py-2 border border-white/20 rounded-full text-sm hover:border-[#00f3ff] hover:text-[#00f3ff] transition-all bg-black/40">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
               </div>
            </section>

            {/* 6. CONTACT & BUTTONS */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-4">
               <div className="group cursor-pointer relative mb-12">
                  <h2 className="text-5xl md:text-9xl font-bold tracking-tighter transition-all duration-700 group-hover:italic">
                    {t.contact}
                  </h2>
                  <div className="absolute -inset-10 bg-[#00f3ff] blur-[120px] opacity-0 group-hover:opacity-20 transition-opacity" />
               </div>
               
               {/* NEW: ACTION BUTTONS (CV & EMAIL) */}
               <div className="flex flex-col sm:flex-row gap-6 mb-20 z-10">
                  <a href="mailto:eemredonmez41@gmail.com" 
                     className="px-10 py-4 bg-[#00f3ff] text-black font-bold rounded-full hover:shadow-[0_0_30px_#00f3ff] transition-all hover:-translate-y-1">
                    {t.btnEmail}
                  </a>
                  <a href="/Emre_DonmezCV.pdf" download 
                     className="px-10 py-4 border border-white/20 text-white font-bold rounded-full hover:border-[#00f3ff] hover:text-[#00f3ff] transition-all hover:-translate-y-1">
                    {t.btnCv}
                  </a>
               </div>
               
               <div className="flex gap-10 text-xs tracking-[0.5em] text-gray-500">
                  <a href="https://github.com/Emrefire" target="_blank" className="hover:text-white transition-colors">GITHUB</a>
                  <a href="https://linkedin.com/in/emredönmez41" target="_blank" className="hover:text-white transition-colors">LINKEDIN</a>
               </div>
               <p className="absolute bottom-10 text-[10px] tracking-[1em] text-gray-700 uppercase">© 2026 {t.rights}</p>
            </section>

          </Scroll>
        </ScrollControls>
      </Canvas>

      <style jsx global>{`
        ::-webkit-scrollbar { display: none; }
        body { background: #020202; cursor: crosshair; }
      `}</style>
    </div>
  );
}