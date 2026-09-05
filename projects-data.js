/* ============================================================
   PROJECT DETAIL DATA
   ------------------------------------------------------------
   One entry per project. project.html reads `?id=` from the URL
   and renders whichever record matches. Photo counts differ per
   project, so each entry only lists what actually exists in
   assets/p<id>/ — phases are split roughly into thirds.
   ============================================================ */
var PROJECTS = {

  1: {
    category: "مشاريع الترميم",
    title: "مشروع مبنى المتحف اليوناني الروماني",
    lede: "عملية ترميم شاملة وإعادة تأهيل لمبنى المتحف اليوناني الروماني بأعلى معايير الجودة للحفاظ على الطابع المعماري الأصيل مع تلبية متطلبات الاستخدام الحديث.",
    type: "ترميم وإعادة تأهيل",
    duration: "18 شهر",
    location: "الإسكندرية - مصر",
    hero: "assets/p1/hero.webp",
    heroJpeg: "assets/p1/hero.jpg",
    photos: ["1.webp","2.webp","3.webp","4.webp","5.webp","6.webp","7.webp","8.webp","9.webp"],
    finalPhoto: "hero.webp"
  },

  2: {
    category: "مشاريع الترميم",
    title: "ترميم وتطوير مبنى (محطة مصر)",
    lede: "عملية ترميم شاملة وإعادة تأهيل لمبنى محطة مصر التاريخي بأعلى معايير الجودة للحفاظ على الطابع المعماري الأصيل مع تلبية متطلبات الاستخدام الحديث.",
    type: "ترميم وإعادة تأهيل",
    duration: "24 شهر",
    location: "الإسكندرية - مصر",
    hero: "assets/p2/hero.webp",
    heroJpeg: "assets/p2/hero.jpeg",
    photos: ["1.webp","2.webp","3.webp","4.webp","5.webp","6.webp"],
    finalPhoto: "hero.webp"
  },

  3: {
    category: "مشاريع الترميم",
    title: "ترميم وتركيب GRC سور المنتزه الأثري",
    lede: "عملية ترميم شاملة وتركيب عناصر GRC لسور المنتزه الأثري بأعلى معايير الجودة للحفاظ على الطابع المعماري الأصيل مع تلبية متطلبات الاستخدام الحديث.",
    type: "ترميم وتركيب GRC",
    duration: "10 أشهر",
    location: "الإسكندرية - مصر",
    hero: "assets/p3/hero.webp",
    heroJpeg: "assets/p3/hero.jpeg",
    photos: ["1.webp","2.webp","3.webp","4.webp","5.webp","6.webp","7.webp"],
    finalPhoto: "hero.webp"
  },

  4: {
    category: "مشاريع GRC",
    title: "تركيب GRC شاطئ فريدة المنتزه",
    lede: "عملية تصنيع وتركيب عناصر GRC لشاطئ فريدة بالمنتزه بأعلى معايير الجودة والدقة لتحقيق أفضل طابع معماري متكامل مع الموقع.",
    type: "تصنيع وتركيب GRC",
    duration: "8 أشهر",
    location: "الإسكندرية - مصر",
    hero: "assets/p4/hero.webp",
    heroJpeg: "assets/p4/hero.jpg",
    photos: ["1.webp","2.webp","3.webp","4.webp","5.webp","6.webp","7.webp","8.webp"],
    finalPhoto: "hero.webp"
  },

  5: {
    category: "مشاريع GRC",
    title: "تركيب GRC بوابة المعمورة المنتزه",
    lede: "عملية تصنيع وتركيب عناصر GRC لبوابة المعمورة بالمنتزه بأعلى معايير الجودة والدقة لتحقيق أفضل طابع معماري متكامل مع الموقع.",
    type: "تصنيع وتركيب GRC",
    duration: "9 أشهر",
    location: "الإسكندرية - مصر",
    hero: "assets/p5/hero.webp",
    heroJpeg: "assets/p5/hero.jpg",
    photos: ["1.webp","2.webp","3.webp","4.webp","5.webp","6.webp","7.webp","8.webp","9.webp"],
    finalPhoto: "hero.webp"
  },

  6: {
    category: "مشاريع GRC",
    title: "تركيب GRC قصر السلاملك والمبنى الملحق",
    lede: "عملية تصنيع وتركيب عناصر GRC لقصر السلاملك والمبنى الملحق به بأعلى معايير الجودة والدقة لتحقيق أفضل طابع معماري متكامل مع الموقع.",
    type: "تصنيع وتركيب GRC",
    duration: "12 شهر",
    location: "الإسكندرية - مصر",
    hero: "assets/p6/hero.webp",
    heroJpeg: "assets/p6/hero.jpg",
    photos: ["1.webp","2.webp","3.webp","4.webp","5.webp","6.webp","7.webp","8.webp","9.webp","10.webp"],
    finalPhoto: "hero.webp"
  },

  7: {
    category: "أعمال خاصة",
    title: "موقع زهرة الأوقاف",
    lede: "عملية تنفيذ متكاملة لمشروع زهرة الأوقاف بأعلى معايير الجودة والدقة في كل تفصيلة لتحقيق تصميم معماري مميز يليق بالموقع.",
    type: "تنفيذ متكامل",
    duration: "20 شهر",
    location: "الإسكندرية - مصر",
    hero: "assets/p7/hero.webp",
    heroJpeg: "assets/p7/hero.jpeg",
    photos: ["1.webp","2.webp","3.webp","4.webp","5.webp","6.webp","7.webp","8.webp","9.webp"],
    finalPhoto: "hero.webp"
  }

};
