'use client';

import { motion, Variants } from 'framer-motion';
import GoogleAuthButton from '@/components/GoogleAuthButton';

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3 
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100 overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 md:px-8 py-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">
            CV<span className="text-blue-600">GENERATOR.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <GoogleAuthButton 
            text="Sign In" 
            className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors"
          />
        </motion.div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-10 md:pt-16 pb-20 md:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Left Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 md:space-y-10 text-center lg:text-left"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">New: AI Layout Optimization</span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl lg:text-[100px] font-black leading-[0.9] tracking-tighter uppercase">
            Create your <br />
            <span className="text-blue-600 italic">Professional</span> <br />
            Resume.
          </motion.h2>

          <motion.p variants={itemVariants} className="text-gray-500 text-base md:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
            Build an ATS-ready CV with minimalist designs. Focus on your expertise, and let us handle the aesthetics for you.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <GoogleAuthButton 
              text="Get Started — It's Free" 
              className="bg-gray-900 text-white px-8 md:px-12 py-5 md:py-6 rounded-[2rem] font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-100" 
            />
          </motion.div>
        </motion.div>

        {/* Right Content (Visual Mockup) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden lg:block"
        >
          <div className="bg-white border-[12px] border-gray-900 rounded-[3.5rem] p-4 shadow-[40px_40px_0px_0px_rgba(37,99,235,0.05)] overflow-hidden">
            <div className="bg-gray-50 rounded-[2.5rem] h-[500px] w-full border border-gray-100 p-10 space-y-8">
               <div className="flex justify-between items-start">
                 <div className="h-16 w-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200"></div>
                 <div className="space-y-2 text-right">
                   <div className="h-3 w-24 bg-gray-900 rounded-full ml-auto"></div>
                   <div className="h-2 w-32 bg-gray-200 rounded-full ml-auto"></div>
                 </div>
               </div>
               <div className="space-y-4 pt-10">
                 <div className="h-3 w-full bg-gray-200 rounded-full"></div>
                 <div className="h-3 w-full bg-gray-200 rounded-full"></div>
                 <div className="h-3 w-2/3 bg-gray-200 rounded-full"></div>
               </div>
            </div>
          </div>

          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 bg-yellow-400 text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl border-2 border-black"
          >
            ATS COMPATIBLE ⚡
          </motion.div>
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="max-w-xs">
            <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-4 text-blue-600">The Mission</h4>
            <p className="text-gray-400 text-sm font-medium">Empowering professionals worldwide to land their dream jobs with high-standard CV designs.</p>
          </div>
          <div className="flex gap-16">
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-4">Product</h4>
              <ul className="text-gray-400 text-sm space-y-2 font-medium cursor-pointer">
                <li className="hover:text-blue-600">Templates</li>
                <li className="hover:text-blue-600">Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-4">Connect</h4>
              <ul className="text-gray-400 text-sm space-y-2 font-medium cursor-pointer">
                <li className="hover:text-blue-600">LinkedIn</li>
                <li className="hover:text-blue-600">GitHub</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}