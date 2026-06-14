"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { value: 10000, suffix: "+", label: "کاربر فعال", icon: "👥" },
  { value: 500, suffix: "+", label: "دوره تخصصی", icon: "📚" },
  { value: 98, suffix: "%", label: "رضایت کاربران", icon: "⭐" },
  { value: 50, suffix: "+", label: "کشور جهان", icon: "🌍" },
];

function AnimatedNumber({
  value,
  suffix,
  isInView,
}: {
  value: number;
  suffix: string;
  isInView: boolean;
}) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString("fa-IR"));

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  return (
    <span className="tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stats" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            اعداد <span className="gradient-text">حرف می‌زنن</span>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">
            ماهیر در عمل ثابت کرده که واقعاً کار می‌کنه
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-2xl p-6 sm:p-8 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl sm:text-4xl font-black gradient-text mb-2">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  isInView={isInView}
                />
              </div>
              <div className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
