"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      <div className="max-w-3xl mx-auto relative z-10" ref={ref}>
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 text-sm font-medium mb-4"
          >
            📬 تماس با ما
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black mb-4"
          >
            بریم <span className="gradient-text">شروع کنیم!</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-500 dark:text-neutral-400 text-lg"
          >
            برای شروع رایگان یا هرگونه سوال، اطلاعاتت رو بذار
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-3xl p-8 sm:p-10 shadow-2xl shadow-neutral-200/50 dark:shadow-neutral-900/50"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-500/30"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-black mb-2">ثبت شد! 🎉</h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                به زودی باهات تماس می‌گیریم. خوشحالیم که قراره باهم باشیم!
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">اسم</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: علی رضایی"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">ایمیل</label>
                  <input
                    type="email"
                    required
                    placeholder="example@mail.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600 text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">موضوع</label>
                <input
                  type="text"
                  placeholder="مثلاً: می‌خوام ثبت‌نام کنم"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">پیام</label>
                <textarea
                  rows={4}
                  placeholder="بنویس چی تو ذهنته..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all resize-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full gradient-bg text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 disabled:opacity-70"
                whileHover={!loading ? { scale: 1.02, boxShadow: "0 15px 30px oklch(58% 0.25 270 / 0.4)" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    ارسال کن
                    <Send className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
