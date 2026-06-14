export type Lang = "en" | "fa";

export const t = {
  nav: {
    about:    { en: "About",    fa: "درباره" },
    team:     { en: "Team",     fa: "تیم" },
    work:     { en: "Work",     fa: "پروژه‌ها" },
    services: { en: "Services", fa: "خدمات" },
    contact:  { en: "Contact",  fa: "تماس" },
    cta:      { en: "Get in touch", fa: "تماس بگیرید" },
  },
  hero: {
    badge:   { en: "A multidisciplinary design & build studio", fa: "استودیوی طراحی و ساخت چند تخصصی" },
    h1a:     { en: "We craft", fa: "ما کار" },
    h1b:     { en: "skilled work.", fa: "ماهرانه می‌سازیم." },
    tagline: { en: "MAHIR — meaning skilled — is a tight-knit team of designers, engineers and strategists turning bold ideas into products people love.", fa: "ماهیر — به معنای متخصص — تیمی متحد از طراحان، مهندسان و استراتژیست‌هاست که ایده‌های جسورانه را به محصولاتی تبدیل می‌کند که مردم دوست دارند." },
    cta1:    { en: "See our work", fa: "نمونه کارها" },
    cta2:    { en: "Start a project", fa: "شروع پروژه" },
    stats: {
      shipped:   { en: "Projects shipped",  fa: "پروژه تحویل‌شده" },
      together:  { en: "Years together",    fa: "سال همکاری" },
      specialists:{ en: "Specialists",      fa: "متخصص" },
      industries: { en: "Industries",       fa: "صنعت" },
    },
  },
  about: {
    badge: { en: "About us", fa: "درباره ما" },
    h2:    { en: "We believe great work changes things.", fa: "ما باور داریم کار خوب، چیزها را تغییر می‌دهد." },
    p:     { en: "Founded in 2017, MAHIR has grown from a two-person freelance duo into a full-service studio trusted by startups and established brands alike. We're remote-first, outcome-obsessed, and allergic to mediocrity.", fa: "ماهیر از سال ۱۳۹۶ تاکنون از یک دو نفره آزادکار به یک استودیوی کامل تبدیل شده که هم استارتاپ‌ها و هم برندهای معتبر به آن اعتماد می‌کنند. ما دورکار، نتیجه‌محور و حساس نسبت به میانه‌حالی هستیم." },
    values: {
      craft: {
        title: { en: "Craft over noise",   fa: "کیفیت بر سرعت" },
        desc:  { en: "We say no to shortcuts. Every pixel, every line of code, every word is considered. Quality is the only metric that matters long-term.", fa: "نه به میانبر می‌گوییم. هر پیکسل، هر خط کد، هر کلمه با دقت انتخاب می‌شود. کیفیت تنها معیاری است که در بلندمدت اهمیت دارد." },
      },
      partner: {
        title: { en: "True partnership",   fa: "شراکت واقعی" },
        desc:  { en: "We embed with your team, not just deliver to it. Shared Slack, shared goals, shared ownership. When you win, we win.", fa: "ما با تیم شما همراه می‌شویم، نه فقط تحویل می‌دهیم. اهداف مشترک، مالکیت مشترک. وقتی شما موفق شوید، ما هم موفق شده‌ایم." },
      },
      speed: {
        title: { en: "Speed with intent",  fa: "سرعت با هدف" },
        desc:  { en: "We move fast — but every decision is deliberate. Agile doesn't mean sloppy; it means ruthless prioritisation and clear communication.", fa: "سریع حرکت می‌کنیم — اما هر تصمیم آگاهانه است. چابکی یعنی اولویت‌بندی بی‌رحمانه و ارتباط شفاف." },
      },
    },
  },
  team: {
    badge: { en: "The team",                fa: "تیم ما" },
    h2:    { en: "Small team,\noutsized impact.", fa: "تیم کوچک،\nتأثیر بزرگ." },
    p:     { en: "We keep the team lean on purpose — every person ships, and nobody hides behind process.", fa: "تیم را عمداً کوچک نگه می‌داریم — هر نفر کار می‌سازد و کسی پشت فرآیند پنهان نمی‌شود." },
    members: {
      ar: { name: "Alex Rivera",  role: { en: "Design Lead",        fa: "سرپرست طراحی" },      bio: { en: "10 years crafting digital experiences for startups and Fortune 500s. Obsessed with the details that make users smile.", fa: "۱۰ سال تجربه در ساخت تجربه‌های دیجیتال برای استارتاپ‌ها و شرکت‌های بزرگ. مجنون جزئیاتی که کاربران را لبخند می‌زنند." } },
      sc: { name: "Sam Chen",     role: { en: "Engineering Lead",   fa: "سرپرست مهندسی" },    bio: { en: "Full-stack architect with a love for clean systems. Turns complex requirements into elegant, maintainable code.", fa: "معمار فول‌استک با عشق به سیستم‌های تمیز. نیازهای پیچیده را به کد زیبا و قابل نگهداری تبدیل می‌کند." } },
      jp: { name: "Jordan Park",  role: { en: "Strategy Director",  fa: "مدیر استراتژی" },    bio: { en: "Ex-consultant turned product strategist. Helps founders find the signal in the noise and build with conviction.", fa: "مشاور سابق که به استراتژیست محصول تبدیل شده. به بنیان‌گذاران کمک می‌کند سیگنال را از نویز تشخیص دهند." } },
      ml: { name: "Morgan Lee",   role: { en: "Motion Designer",    fa: "طراح موشن" },         bio: { en: "Brings interfaces to life through thoughtful animation. Believes motion is the bridge between static and magical.", fa: "رابط‌ها را با انیمیشن‌های هوشمندانه زنده می‌کند. باور دارد موشن پلی است بین سکون و جادو." } },
    },
  },
  work: {
    badge: { en: "Selected work", fa: "نمونه کارهای منتخب" },
    h2:    { en: "projects shipped.", fa: "پروژه تحویل شده." },
    p:     { en: "A selection of our recent work across product design, engineering and brand.", fa: "گزیده‌ای از آخرین کارهای ما در طراحی محصول، مهندسی و برند." },
    all:   { en: "All", fa: "همه" },
    cats: {
      "Product Design": { en: "Product Design", fa: "طراحی محصول" },
      "Brand & Web":    { en: "Brand & Web",    fa: "برند و وب" },
      "Mobile App":     { en: "Mobile App",     fa: "اپ موبایل" },
      "Design System":  { en: "Design System",  fa: "سیستم طراحی" },
      "Web App":        { en: "Web App",         fa: "اپ وب" },
    },
    modal: {
      client: { en: "Client", fa: "کارفرما" },
      year:   { en: "Year",   fa: "سال" },
      role:   { en: "Role",   fa: "نقش" },
      close:  { en: "Close",  fa: "بستن" },
    },
    projects: {
      1: { title: "Forma", desc: { en: "A B2B analytics dashboard that transformed how a logistics company tracked 40M+ events daily.", fa: "داشبورد تحلیلی B2B که نحوه ردیابی روزانه ۴۰ میلیون+ رویداد را در یک شرکت لجستیک متحول کرد." } },
      2: { title: "Verdant", desc: { en: "Full brand identity and marketing site for a climate-tech startup raising their Series A.", fa: "هویت بصری کامل و سایت بازاریابی برای یک استارتاپ فناوری اقلیمی در مرحله جذب سرمایه Series A." } },
      3: { title: "Pulse", desc: { en: "A health-tracking app for athletes that hit #3 in the App Store fitness category within two weeks.", fa: "اپلیکیشن ردیابی سلامت برای ورزشکاران که در دو هفته به رتبه ۳ دسته فیتنس اپ استور رسید." } },
      4: { title: "Arch", desc: { en: "A comprehensive design system for a fintech company — 200+ components, tokens, and documentation.", fa: "سیستم طراحی جامع برای یک شرکت فین‌تک — بیش از ۲۰۰ کامپوننت، توکن و مستندات." } },
      5: { title: "Collab", desc: { en: "Real-time collaborative workspace tool that reduced meeting time by 34% for remote teams.", fa: "ابزار همکاری آنی که زمان جلسات تیم‌های دورکار را ۳۴٪ کاهش داد." } },
      6: { title: "Cove", desc: { en: "Brand refresh and e-commerce rebuild for a premium sustainable goods company.", fa: "بازطراحی برند و ساخت مجدد فروشگاه آنلاین برای یک شرکت کالاهای پریمیوم پایدار." } },
    },
  },
  services: {
    badge: { en: "What we do",   fa: "چه می‌کنیم" },
    h2:    { en: "Three disciplines.\nOne team.", fa: "سه تخصص.\nیک تیم." },
    p:     { en: "We don't do handoffs. Design, engineering and strategy work in lockstep, every day.", fa: "ما تحویل‌دهی بین تیمی نداریم. طراحی، مهندسی و استراتژی هر روز دوشادوش هم کار می‌کنند." },
    items: {
      1: { title: { en: "Product Design", fa: "طراحی محصول" }, desc: { en: "From early discovery through polished UI — we design products that are intuitive, beautiful and built for real people.", fa: "از کشف اولیه تا رابط کاربری صیقلی — محصولاتی طراحی می‌کنیم که برای آدم‌های واقعی ساخته شده‌اند." } },
      2: { title: { en: "Engineering",    fa: "مهندسی" },       desc: { en: "Full-stack development with modern tooling. Fast, scalable, and maintainable code that your team will love working with.", fa: "توسعه فول‌استک با ابزارهای مدرن. کد سریع، مقیاس‌پذیر و قابل نگهداری که تیم شما دوست خواهد داشت." } },
      3: { title: { en: "Brand & Strategy", fa: "برند و استراتژی" }, desc: { en: "We help you find your position, craft your story, and build a visual identity that stands out and scales.", fa: "به شما کمک می‌کنیم جایگاهتان را پیدا کنید، داستانتان را بسازید و هویت بصری‌ای خلق کنید که متمایز و قابل رشد باشد." } },
    },
  },
  aiChat: {
    badge:  { en: "AI Consultant",           fa: "مشاور هوشمند" },
    h2:     { en: "MAHIR AI Consultant",     fa: "مشاور هوشمند ماهیر" },
    p:      { en: "Describe your project or business to our AI consultant. Based on your needs, we'll recommend the best MAHIR services for you.", fa: "پروژه یا کسب‌وکارتون رو برای مشاور هوشمند ما توضیح بدید. بر اساس نیازتون، بهترین خدمات ماهیر رو بهتون پیشنهاد می‌دیم." },
    features: {
      f1: { title: { en: "Needs Analysis",      fa: "تحلیل نیاز" },        desc: { en: "We identify your exact project requirements based on your description.", fa: "بر اساس توضیحات شما، نیازهای دقیق پروژه رو شناسایی می‌کنیم" } },
      f2: { title: { en: "Tailored Suggestion",  fa: "پیشنهاد متناسب" },   desc: { en: "We introduce relevant MAHIR services with clear reasoning.", fa: "خدمات مناسب ماهیر رو با دلایل واضح معرفی می‌کنیم" } },
      f3: { title: { en: "Starting Path",        fa: "مسیر شروع" },        desc: { en: "We review the next steps to start working together.", fa: "قدم‌های بعدی برای شروع همکاری رو با هم بررسی می‌کنیم" } },
    },
    header:      { en: "MAHIR AI Consultant", fa: "مشاور هوشمند ماهیر" },
    online:      { en: "Powered by Claude",   fa: "مبتنی بر Claude" },
    reset:       { en: "Restart",             fa: "شروع مجدد" },
    placeholder: { en: "Describe your project...", fa: "پروژه‌تون رو توضیح بدید..." },
    suggestions: {
      s1: { en: "I want a mobile app for my business", fa: "یک اپ موبایل برای کسب‌وکارم می‌خوام" },
      s2: { en: "I need branding and visual identity",  fa: "برندینگ و هویت بصری نیاز دارم" },
      s3: { en: "I want a management panel and dashboard", fa: "پنل مدیریت و داشبورد می‌خوام" },
    },
    errorKey:  { en: "To activate the AI chat, please contact MAHIR:\nhello@mahir.studio", fa: "برای فعال‌سازی چت هوشمند، لطفاً با تیم ماهیر تماس بگیرید:\nhello@mahir.studio" },
    errorGen:  { en: "Sorry, something went wrong. Please try again.", fa: "متأسفم، مشکلی پیش آمد. لطفاً دوباره تلاش کنید." },
  },
  contact: {
    badge:   { en: "Get in touch",  fa: "تماس با ما" },
    h2:      { en: "Let's build something great.", fa: "بیا چیز بزرگی بسازیم." },
    p:       { en: "Tell us about your project and we'll get back to you within one business day. No pressure, no pitch — just a conversation.", fa: "پروژه‌تان را برای ما توضیح دهید و ما در کمتر از یک روز کاری پاسخ می‌دهیم. بدون فشار، بدون ارائه — فقط یک گفتگو." },
    channels: {
      email:  { label: { en: "Email",  fa: "ایمیل" },   value: "hello@mahir.studio" },
      phone:  { label: { en: "Phone",  fa: "تلفن" },    value: "+1 (555) 084 2210" },
      studio: { label: { en: "Studio", fa: "استودیو" }, value: { en: "Remote-first · Worldwide", fa: "دورکار اول · سراسر جهان" } },
    },
    follow:  { en: "Follow us", fa: "ما را دنبال کنید" },
    form: {
      title:      { en: "Send a message",        fa: "ارسال پیام" },
      name:       { en: "name",                  fa: "نام" },
      namePh:     { en: "Your name",             fa: "نام شما" },
      email:      { en: "email",                 fa: "ایمیل" },
      emailPh:    { en: "you@example.com",       fa: "شما@example.com" },
      subject:    { en: "Subject",               fa: "موضوع" },
      subjectPh:  { en: "What's this about?",    fa: "موضوع پیام چیست؟" },
      message:    { en: "Message",               fa: "پیام" },
      messagePh:  { en: "Tell us about your project...", fa: "درباره پروژه‌تان بنویسید..." },
      required:   { en: "required",              fa: "اجباری" },
      send:       { en: "Send message →",        fa: "ارسال پیام ←" },
      errName:    { en: "Name is required",      fa: "نام الزامی است" },
      errEmail:   { en: "Email is required",     fa: "ایمیل الزامی است" },
      errInvalid: { en: "Invalid email",         fa: "ایمیل نامعتبر است" },
      errMsg:     { en: "Message is required",   fa: "پیام الزامی است" },
    },
    success: {
      title: { en: "Message sent!",              fa: "پیام ارسال شد!" },
      p:     { en: "Thanks! We'll be in touch shortly.", fa: "ممنون! به زودی با شما در تماس خواهیم بود." },
      again: { en: "Send another message",       fa: "ارسال پیام جدید" },
    },
  },
  footer: {
    tagline: { en: "Turning bold ideas into products people love.", fa: "تبدیل ایده‌های جسورانه به محصولاتی که مردم دوست دارند." },
    nav:     { en: "Navigation",   fa: "صفحات" },
    contact: { en: "Contact",      fa: "تماس" },
    rights:  { en: "All rights reserved.", fa: "تمام حقوق محفوظ است." },
  },
} as const;

export function tr<T extends { en: string; fa: string }>(obj: T, lang: Lang): string {
  return obj[lang];
}
