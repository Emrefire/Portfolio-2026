'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { Space_Grotesk, Playfair_Display } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '600', '700'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['600', '700'] });

// --- ÇEVİRİ SÖZLÜĞÜ (DICTIONARY) ---
const translations = {
  en: {
    heroPrefix: "I am a",
    typewriterWords: ["Software Engineer", "Full-Stack Developer", "AI Specialist"],
    about: "Passionate about building scalable systems and integrating AI into real-world applications. I believe in clean code, robust architecture, and technology that makes a tangible impact.",
    appTag: "01 — Mobile Application",
    appDesc: "A location-based mobile tracking application built with React Native. Features include real-time location calculations and a custom notification system.",
    btnSource: "View Source Code",
    aiTag: "02 — AI & Computer Vision",
    aiDesc: "A TÜBİTAK 2209-B supported driver drowsiness tracking system. Integrates facial expression recognition models across Web and Mobile platforms.",
    btnGithub: "Explore on GitHub",
    nextierTag: "03 — Artificial Intelligence",
    nextierDesc: "A modern, scalable next-generation AI desktop solution leveraging LLM and Retrieval-Augmented Generation (RAG) architectures.",
    btnProject: "View Project",
    careerTag: "04 — Career",
    careerTitle: "Experience",
    jobTitle: "Software Developer",
    jobDate: "Present (İŞKUR Youth Program)",
    jobDesc: "Actively contributing to the university's IT infrastructure. Responsibilities include frontend development, UI/UX optimization, and database management.",
    arsenalTag: "05 — Arsenal",
    techTitle: "Tech Stack",
    contactTag: "06 — Contact",
    contactTitle: "Let's Build Something\nAmazing Together.",
    contactDesc: "I'm currently looking for new opportunities. Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!",
    btnEmail: "Say Hello",
    btnCv: "Download Resume",
    rights: "Emre Dönmez. All Rights Reserved."
  },
  tr: {
    heroPrefix: "Ben bir",
    typewriterWords: ["Yazılım Mühendisi", "Full-Stack Geliştirici", "Yapay Zeka Uzmanı"],
    about: "Ölçeklenebilir sistemler kurma ve yapay zekayı gerçek dünya uygulamalarına entegre etme konusunda tutkuluyum. Temiz koda, sağlam mimariye ve somut etki yaratan teknolojiye inanıyorum.",
    appTag: "01 — Mobil Uygulama",
    appDesc: "React Native ile geliştirilmiş, lokasyon bazlı anlık takip ve özel bildirim sistemine sahip canlı mobil uygulama.",
    btnSource: "Kaynak Kodu İncele",
    aiTag: "02 — Yapay Zeka & Görüntü İşleme",
    aiDesc: "TÜBİTAK 2209-B destekli sürücü yorgunluk takip sistemi. Yüz ifadesi tanıma modellerinin Web ve Mobil platformlara entegrasyonu.",
    btnGithub: "GitHub'da İncele",
    nextierTag: "03 — Yapay Zeka",
    nextierDesc: "LLM ve RAG mimarileri kullanılarak geliştirilmiş, modern ve ölçeklenebilir yeni nesil yapay zeka çözümü.",
    btnProject: "Projeye Git",
    careerTag: "04 — Kariyer",
    careerTitle: "Deneyim",
    jobTitle: "Yazılım Geliştirici",
    jobDate: "Güncel (İŞKUR Gençlik Programı)",
    jobDesc: "Üniversitenin bilgi işlem departmanında aktif olarak görev alıyorum. Ağırlıklı olarak frontend geliştirme, arayüz optimizasyonları ve veritabanı yönetimi süreçlerini yürütmekteyim.",
    arsenalTag: "05 — Cephanelik",
    techTitle: "Teknolojiler",
    contactTag: "06 — İletişim",
    contactTitle: "Hadi Birlikte\nHarika Şeyler Yapalım.",
    contactDesc: "Yeni fırsatlara ve projelere her zaman açığım. İster bir proje fikrin olsun, ister takımına dahil etmek iste, mesaj atman yeterli!",
    btnEmail: "Bana E-posta Gönder",
    btnCv: "CV İndir",
    rights: "Emre Dönmez. Tüm Hakları Saklıdır."
  }
};

// --- Daktilo (Silinip Yazılma) Efekti Bileşeni ---
function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const colorRef = useRef<HTMLSpanElement>(null);

  // Dil değiştiğinde daktiloyu sıfırla
  useEffect(() => {
    setText('');
    setIndex(0);
    setIsDeleting(false);
  }, [words]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();

    const updateColor = () => {
      if (colorRef.current) {
        const elapsed = (Date.now() - startTime) / 1000;
        const hue = (elapsed * 36) % 360; 
        colorRef.current.style.color = `hsl(${hue}, 100%, 50%)`;
      }
      animationFrameId = requestAnimationFrame(updateColor);
    };

    updateColor();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const currentWord = words[index];
    if (!currentWord) return;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));
        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), 1500); 
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, mounted, words]);

  if (!mounted) return <span className="text-[#00f3ff]">{words[0]}<span className="animate-pulse">|</span></span>;

  return (
    <span ref={colorRef} style={{ color: '#00f3ff', transition: 'color 0.1s linear' }}>
      {text}
      <span className="animate-pulse font-bold text-white">|</span>
    </span>
  );
}

// --- Renk Değiştiren 3D Objemiz ---
function ColorChangingKnot() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;

    const offset = scroll.offset;
    meshRef.current.position.y = -offset * 25; 
    meshRef.current.rotation.z = offset * Math.PI * 3; 

    if (materialRef.current) {
      const hue = (state.clock.elapsedTime * 0.1) % 1; 
      materialRef.current.color.setHSL(hue, 1, 0.5);
    }
  });

  return (
    <mesh ref={meshRef} position={[3, 0, -2]}>
      <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
      <meshStandardMaterial 
        ref={materialRef}
        wireframe={true} 
        transparent={true}
        opacity={0.6}
        color="#00f3ff" 
      />
    </mesh>
  );
}

export default function Portfolio() {
  // Dil state'ini oluşturuyoruz (Varsayılan: İngilizce)
  const [lang, setLang] = useState<'en' | 'tr'>('en');
  // Seçili dile göre içerikleri alıyoruz
  const t = translations[lang];

  return (
    <div className={`h-screen w-full bg-[#050505] text-white overflow-hidden ${spaceGrotesk.className}`}>
      
      {/* --- YENİ: DİL DEĞİŞTİRME BUTONU --- */}
      <button 
        onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}
        className="fixed top-6 right-6 md:top-10 md:right-10 z-50 px-4 py-2 border-2 border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black transition-all duration-300 rounded-full font-bold tracking-widest text-sm shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.8)] backdrop-blur-sm bg-black/30"
      >
        {lang === 'en' ? 'TR' : 'EN'}
      </button>

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />

        <ScrollControls pages={6} damping={0.1}>
          <ColorChangingKnot />
          
          <Scroll html style={{ width: '100%' }}>
            
            {/* Sayfa 1: Hero & About Section */}
            <div className="h-screen flex flex-col items-center justify-center px-4 text-center">
              <h1 className={`text-7xl md:text-8xl font-bold tracking-tight mb-2 ${playfair.className}`}>
                Emre Dönmez
              </h1>
              <p className="text-2xl md:text-3xl font-light tracking-wide h-10 mt-2 mb-8 flex items-center justify-center gap-2">
                {t.heroPrefix} <Typewriter words={t.typewriterWords} />
              </p>
              
              <div className="max-w-2xl mt-4">
                <p className="text-gray-400 font-light text-lg leading-relaxed border-t border-gray-800 pt-6">
                  {t.about}
                </p>
              </div>
            </div>

            {/* Sayfa 2: Yoldaş */}
            <div className="h-screen flex items-center justify-start pl-10 md:pl-32">
              <div className="max-w-lg">
                <p className="text-sm text-[#00f3ff] uppercase tracking-widest mb-2 font-semibold">{t.appTag}</p>
                <h2 className="text-5xl md:text-6xl font-bold mb-6">Yoldaş</h2>
                <p className="text-lg text-gray-300 font-light mb-8">
                  {t.appDesc}
                </p>
                <a href="https://github.com/Emrefire" target="_blank" rel="noopener noreferrer" 
                   className="inline-block px-8 py-3 border border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black transition-all duration-300 rounded-full font-medium tracking-wide shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.8)]">
                  {t.btnSource}
                </a>
              </div>
            </div>

            {/* Sayfa 3: ODAK */}
            <div className="h-screen flex items-center justify-end pr-10 md:pr-32">
              <div className="max-w-lg text-right">
                <p className="text-sm text-[#00f3ff] uppercase tracking-widest mb-2 font-semibold">{t.aiTag}</p>
                <h2 className="text-5xl md:text-6xl font-bold mb-6">ODAK</h2>
                <p className="text-lg text-gray-300 font-light mb-8">
                  {t.aiDesc}
                </p>
                <div className="flex justify-end">
                  <a href="https://github.com/Emrefire" target="_blank" rel="noopener noreferrer" 
                     className="inline-block px-8 py-3 border border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black transition-all duration-300 rounded-full font-medium tracking-wide shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.8)]">
                    {t.btnGithub}
                  </a>
                </div>
              </div>
            </div>

            {/* Sayfa 4: NextierAI */}
            <div className="h-screen flex items-center justify-start pl-10 md:pl-32">
              <div className="max-w-lg">
                <p className="text-sm text-[#00f3ff] uppercase tracking-widest mb-2 font-semibold">{t.nextierTag}</p>
                <h2 className="text-5xl md:text-6xl font-bold mb-6">NextierAI</h2>
                <p className="text-lg text-gray-300 font-light mb-8">
                  {t.nextierDesc}
                </p>
                <a href="https://github.com/Emrefire" target="_blank" rel="noopener noreferrer" 
                   className="inline-block px-8 py-3 border border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black transition-all duration-300 rounded-full font-medium tracking-wide shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.8)]">
                  {t.btnProject}
                </a>
              </div>
            </div>

            {/* Sayfa 5: Experience & Tech Stack */}
            <div className="h-screen flex items-center justify-center px-6 md:px-20">
              <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-16">
                
                <div>
                  <p className="text-sm text-[#00f3ff] uppercase tracking-widest mb-2 font-semibold">{t.careerTag}</p>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8">{t.careerTitle}</h2>
                  
                  <div className="border-l-2 border-[#00f3ff]/30 pl-6 relative">
                    <div className="absolute w-4 h-4 bg-[#050505] border-2 border-[#00f3ff] rounded-full -left-[9px] top-2 shadow-[0_0_10px_#00f3ff]"></div>
                    <h3 className="text-2xl font-bold text-white">{t.jobTitle}</h3>
                    <p className="text-[#00f3ff] font-medium mb-1 mt-1">EBYU IT Department</p>
                    <p className="text-gray-500 font-medium text-xs mb-4 uppercase tracking-wider">{t.jobDate}</p>
                    <p className="text-gray-300 font-light leading-relaxed">
                      {t.jobDesc}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#00f3ff] uppercase tracking-widest mb-2 font-semibold">{t.arsenalTag}</p>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8">{t.techTitle}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-gray-400 mb-3 uppercase tracking-wider text-xs font-semibold">Backend & Architecture</h4>
                      <div className="flex flex-wrap gap-2">
                        {['.NET Core', 'ASP.NET MVC/API', 'Clean Architecture', 'CQRS', 'MediatR', 'JWT'].map(tech => (
                          <span key={tech} className="px-4 py-1.5 text-sm border border-gray-700/50 rounded-full hover:border-[#00f3ff] hover:text-[#00f3ff] transition-all hover:shadow-[0_0_10px_rgba(0,243,255,0.2)] cursor-default bg-gray-900/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-gray-400 mb-3 uppercase tracking-wider text-xs font-semibold">Frontend & Mobile</h4>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'Next.js', 'React Native', 'Tailwind CSS'].map(tech => (
                          <span key={tech} className="px-4 py-1.5 text-sm border border-gray-700/50 rounded-full hover:border-[#00f3ff] hover:text-[#00f3ff] transition-all hover:shadow-[0_0_10px_rgba(0,243,255,0.2)] cursor-default bg-gray-900/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-gray-400 mb-3 uppercase tracking-wider text-xs font-semibold">Database & AI</h4>
                      <div className="flex flex-wrap gap-2">
                        {['SQL Server', 'Firebase', 'LLM', 'RAG', 'Computer Vision'].map(tech => (
                          <span key={tech} className="px-4 py-1.5 text-sm border border-gray-700/50 rounded-full hover:border-[#00f3ff] hover:text-[#00f3ff] transition-all hover:shadow-[0_0_10px_rgba(0,243,255,0.2)] cursor-default bg-gray-900/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Sayfa 6: Contact & Footer */}
            <div className="h-screen flex flex-col items-center justify-center relative">
              <div className="text-center max-w-2xl px-4">
                <p className="text-sm text-[#00f3ff] uppercase tracking-widest mb-4 font-semibold">{t.contactTag}</p>
                <h2 className="text-5xl md:text-7xl font-bold mb-6 whitespace-pre-line">{t.contactTitle}</h2>
                <p className="text-lg text-gray-400 font-light mb-12">
                  {t.contactDesc}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                  <a href="mailto:eemredonmez41@gmail.com" 
                     className="w-full sm:w-auto px-8 py-4 bg-[#00f3ff] text-black font-bold rounded-full hover:shadow-[0_0_30px_rgba(0,243,255,0.8)] transition-all hover:-translate-y-1">
                    {t.btnEmail}
                  </a>
                  <a href="/Emre_DonmezCV.pdf" download 
                     className="w-full sm:w-auto px-8 py-4 border border-gray-500 text-white font-bold rounded-full hover:border-[#00f3ff] hover:text-[#00f3ff] hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all hover:-translate-y-1">
                    {t.btnCv}
                  </a>
                </div>

                <div className="flex items-center justify-center gap-10">
                  <a href="https://linkedin.com/in/emredönmez41" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00f3ff] transition-colors text-lg font-medium tracking-wide">
                    LinkedIn
                  </a>
                  <a href="https://github.com/Emrefire" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00f3ff] transition-colors text-lg font-medium tracking-wide">
                    GitHub
                  </a>
                </div>
              </div>
              
              <div className="absolute bottom-8 text-center w-full text-xs text-gray-600 tracking-widest uppercase">
                © {new Date().getFullYear()} {t.rights}
              </div>
            </div>

          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}