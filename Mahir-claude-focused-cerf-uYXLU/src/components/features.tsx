"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Brain,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Globe,
  ChevronLeft,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "یادگیری هوشمند",
    description:
      "با الگوریتم‌های هوش مصنوعی، مسیر یادگیری شخصی برات طراحی می‌شه که دقیقاً متناسب با سطح و هدف توئه.",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    delay: 0,
  },
  {
    icon: TrendingUp,
    title: "ردیابی پیشرفت",
    description:
      "با داشبوردهای جذاب، هر روز پیشرفتت رو ببین و با آمارهای دقیق انگیزه‌ات رو حفظ کن.",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    delay: 0.1,
  },
  {
    icon: Users,
    title: "جامعه فعال",
    description:
      "به هزاران متخصص وصل شو، پروژه مشترک بساز، و از تجربیات یکدیگه یاد بگیرید.",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    delay: 0.2,
  },
  {
    icon: Shield,
    title: "امنیت بالا",
    description:
      "اطلاعاتت با بالاترین استانداردهای امنیتی حفاظت میشه. حریم خصوصیت برای ما مهمه.",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    delay: 0.3,
  },
  {
    icon: Zap,
    title: "سرعت بی‌نظیر",
    description:
      "با زیرساخت ابری پیشرفته، هر جای دنیا باشی بدون تاخیر از ماهیر استفاده کن.",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    delay: 0.4,
  },
  {
    icon: Globe,
    title: "چند زبانه",
    description:
      "محتوا به فارسی، انگلیسی و بیش از ۲۰ زبان دیگه در دسترسه. یادگیری بدون مرز.",
    color: "from-indigo-500 to-blue-600",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    delay: 0.5,
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: feature.delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-200 dark:hover:border-neutral-700 hover:shadow-xl hover:shadow-neutral-100 dark:hover:shadow-neutral-900 transition-all duration-300 cursor-pointer"
    >
      <div
        className={`inline-flex w-12 h-12 rounded-xl ${feature.bg} items-center justify-center mb-4`}
      >
        <div
          className={`bg-gradient-to-br ${feature.color} w-8 h-8 rounded-lg flex items-center justify-center`}
        >
          <feature.icon className="w-4 h-4 text-white" />
        </div>
      </div>

      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
        {feature.description}
      </p>

      <motion.div
        className="flex items-center gap-1 mt-4 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: `oklch(58% 0.25 270)` }}
      >
        بیشتر بخون
        <ChevronLeft className="w-3 h-3" />
      </motion.div>

      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity`}
      />
    </motion.div>
  );
}

export function Features() {
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true });

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 text-sm font-medium mb-4"
          >
            ✨ ویژگی‌های منحصربه‌فرد
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black mb-4"
          >
            چرا <span className="gradient-text">ماهیر؟</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-lg"
          >
            ما ابزارهایی ساختیم که واقعاً کمک می‌کنن تا سریع‌تر و هوشمندانه‌تر یاد بگیری
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
