"use client";

import { motion } from "framer-motion";
import { Zap, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-neutral-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <motion.div
          className="flex items-center gap-2 font-bold text-lg"
          whileHover={{ scale: 1.05 }}
        >
          <div className="gradient-bg w-7 h-7 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">ماهیر</span>
        </motion.div>

        <p className="text-neutral-400 dark:text-neutral-600 text-sm flex items-center gap-1">
          ساخته شده با <Heart className="w-4 h-4 text-rose-500 fill-current" /> در ایران
        </p>

        <p className="text-neutral-400 dark:text-neutral-600 text-sm">
          © ۱۴۰۳ ماهیر. تمام حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
