"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";

const team = [
  {
    name: "امیر سامی منش",
    role: "بنیانگذار و مدیرعامل",
    avatar: "AS",
    bio: "۱۰ سال تجربه در توسعه محصولات دیجیتال و یادگیری ماشین",
    gradient: "from-violet-500 to-purple-600",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "سارا احمدی",
    role: "مدیر محصول",
    avatar: "SA",
    bio: "متخصص طراحی تجربه کاربری با تمرکز بر آموزش آنلاین",
    gradient: "from-emerald-500 to-teal-600",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "رضا محمدی",
    role: "مدیر فناوری",
    avatar: "RM",
    bio: "معمار نرم‌افزار و متخصص هوش مصنوعی و یادگیری عمیق",
    gradient: "from-blue-500 to-cyan-600",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
  {
    name: "نیلوفر کریمی",
    role: "طراح ارشد",
    avatar: "NK",
    bio: "طراح خلاق با ۸ سال سابقه در طراحی رابط‌های کاربری",
    gradient: "from-rose-500 to-pink-600",
    links: { github: "#", linkedin: "#", twitter: "#" },
  },
];

export function Team() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="team" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 text-sm font-medium mb-4"
          >
            🧑‍💻 تیم ما
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black mb-4"
          >
            پشت <span className="gradient-text">ماهیر</span> چه کسانی هستن؟
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group text-center p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-xl hover:shadow-neutral-100 dark:hover:shadow-neutral-900 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} mx-auto mb-4 flex items-center justify-center text-2xl font-black text-white shadow-lg`}
              >
                {member.avatar}
              </div>

              <h3 className="font-bold text-lg mb-1">{member.name}</h3>
              <p className="text-brand-600 dark:text-brand-400 text-sm font-medium mb-3">
                {member.role}
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed mb-4">
                {member.bio}
              </p>

              <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {["GitHub", "LinkedIn", "X"].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    aria-label={platform}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
