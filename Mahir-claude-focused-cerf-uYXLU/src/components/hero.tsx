"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Play, Star } from "lucide-react";
import { useRef } from "react";

const floatingCards = [
  { icon: "🚀", label: "رشد سریع", color: "from-violet-500 to-purple-600", delay: 0 },
  { icon: "💡", label: "ایده‌های نو", color: "from-amber-500 to-orange-600", delay: 0.3 },
  { icon: "🎯", label: "هدف‌مند", color: "from-emerald-500 to-teal-600", delay: 0.6 },
  { icon: "⚡", label: "پرسرعت", color: "from-blue-500 to-cyan-600", delay: 0.9 },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background mesh */}
      <div className="absolute inset-0 mesh-gradient" />

      {/* Animated orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-accent-500/10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(oklch(58% 0.25 270) 1px, transparent 1px), linear-gradient(90deg, oklch(58% 0.25 270) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10"
      >
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-8"
          >
            <span className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </span>
            <span className="text-neutral-600 dark:text-neutral-400">
              بیش از ۱۰,۰۰۰ کاربر فعال
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6"
          >
            مهارت‌هات رو
            <br />
            <span className="gradient-text">به اوج برسون</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            ماهیر یه پلتفرم هوشمنده که باهاش مهارت‌هات رو تو هر زمینه‌ای رشد میدی،
            پیشرفتت رو ردیابی می‌کنی و با جامعه‌ای از متخصصین ارتباط برقرار می‌کنی.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.a
              href="#contact"
              className="group flex items-center gap-2 gradient-bg text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl shadow-brand-500/30"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px oklch(58% 0.25 270 / 0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              رایگان شروع کن
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </motion.a>

            <motion.button
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg glass hover:bg-white/20 dark:hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Play className="w-4 h-4 text-white mr-0.5" />
              </div>
              ببین چطور کار می‌کنه
            </motion.button>
          </motion.div>

          {/* Floating Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + card.delay }}
                className="animate-float glass px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
                style={{ animationDelay: `${i * 1.5}s` }}
              >
                <span className="text-2xl">{card.icon}</span>
                <span className="font-semibold text-sm">{card.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-neutral-400 dark:text-neutral-600">اسکرول کن</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-neutral-300 dark:border-neutral-700 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full gradient-bg" />
        </motion.div>
      </motion.div>
    </section>
  );
}
