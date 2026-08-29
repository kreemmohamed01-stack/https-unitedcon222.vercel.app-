/* ============================================================
   UNITED CONSTRUCTION — i18n.js
   ------------------------------------------------------------
   Tiny in-page AR/EN switcher. No page reload, no duplicated
   HTML files: every translatable node carries data-i18n="key"
   (text content) or data-i18n-attr="attr:key|attr2:key2" (for
   placeholder / aria-label / title / alt). This file swaps them,
   flips <html dir/lang>, and remembers the choice.

   Load order: this file must come AFTER the page's own markup
   (defer) and BEFORE script.js's language-menu wiring runs, or
   just be self-contained — it wires the menu itself.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'uc-lang';

  /* ==========================================================
     DICTIONARY
     ----------------------------------------------------------
     One key per translatable string, shared across all pages.
     Arabic values match the current live copy exactly, so
     switching back to "ar" is always a lossless round-trip.
     ========================================================== */
  var DICT = {

    /* ---------- header / nav (shared) ---------- */
    'nav.home':        { ar: 'الرئيسية',        en: 'Home' },
    'nav.about':        { ar: 'عن الشركة',       en: 'About Us' },
    'nav.services':     { ar: 'خدماتنا',         en: 'Services' },
    'nav.projects':     { ar: 'مشاريعنا',        en: 'Projects' },
    'nav.fields':       { ar: 'مجالات التنفيذ',   en: 'Work Fields' },
    'nav.media':        { ar: 'المركز الإعلامي', en: 'Media Center' },
    'nav.careers':      { ar: 'وظائف',           en: 'Careers' },
    'nav.contact':      { ar: 'تواصل معنا',      en: 'Contact Us' },
    'nav.clients':      { ar: 'عملاؤنا',         en: 'Our Clients' },
    'nav.whoweare':     { ar: 'من نحن',          en: 'Who We Are' },

    'a11y.langSelect':  { ar: 'اختيار اللغة',    en: 'Select language' },
    'a11y.menuOpen':    { ar: 'فتح القائمة',     en: 'Open menu' },
    'a11y.menuClose':   { ar: 'إغلاق القائمة',   en: 'Close menu' },
    'a11y.brand':       { ar: 'المتحدة للإنشاءات والمقاولات — الصفحة الرئيسية', en: 'United Construction — Home' },
    'a11y.logo':        { ar: 'شعار المتحدة للإنشاءات والمقاولات', en: 'United Construction logo' },
    'a11y.mainNav':     { ar: 'التنقل الرئيسي',  en: 'Main navigation' },
    'a11y.mobileNav':   { ar: 'قائمة الجوال',    en: 'Mobile menu' },
    'a11y.whatsapp':    { ar: 'تواصل معنا على واتساب', en: 'Contact us on WhatsApp' },
    'a11y.whatsappKareem': { ar: 'تواصل مع كريم علي على واتساب', en: 'Contact Kareem Aly on WhatsApp' },

    'home.pageTitle': { ar: 'المتحدة للإنشاءات والمقاولات | United Construction', en: 'United Construction | المتحدة للإنشاءات والمقاولات' },

    'lang.ar': { ar: 'العربية', en: 'العربية' },
    'lang.en': { ar: 'English', en: 'English' },

    /* ---------- mobile drawer footer ---------- */
    'drawer.address': { ar: '21 طريق اسكندرية مطروح ش مدرسة شيرين قسم العامرية اسكندرية', en: '21 Alexandria–Matrouh Rd, Shirin School St, Al-Amriya, Alexandria' },

    /* ---------- index.html · hero ---------- */
    'hero.eyebrow':   { ar: 'BUILDING THE FUTURE', en: 'BUILDING THE FUTURE' },
    'hero.title1':    { ar: 'نحوّل الرؤية',        en: 'We turn vision' },
    'hero.title2Pre': { ar: 'إلى ',                en: 'into ' },
    'hero.title2Em':  { ar: 'واقع',                en: 'reality' },
    'hero.title2Post':{ ar: ' ملموس',              en: ' on the ground' },
    'hero.lede':      { ar: 'المتحدة للإنشاءات والمقاولات، خبرة تمتد في تنفيذ أعمال <span class="ltr">GRC</span> والترميم والتطوير المعماري، ننفذ معايير الجودة والدقة في كل تفصيلة.',
                          en: 'United Construction — deep experience delivering <span class="ltr">GRC</span> works, restoration and architectural development, executing quality and precision in every detail.' },
    'hero.ctaProjects': { ar: 'استعرض مشاريعنا', en: 'View Our Projects' },
    'hero.ctaServices': { ar: 'تعرّف على خدماتنا', en: 'Explore Our Services' },
    'hero.scrollCue':   { ar: 'اكتشف المزيد',     en: 'Discover More' },

    /* ---------- services strip ---------- */
    'svc.discover': { ar: 'اكتشف المزيد', en: 'Learn More' },

    'svc1.title': { ar: 'أعمال خاصة ومشاريع تراثية', en: 'Special & Heritage Projects' },
    'svc1.desc':  { ar: 'تنفيذ الأعمال ذات التفاصيل الدقيقة والمشاريع ذات الطابع المميز.', en: 'Delivering intricately detailed works and projects of distinctive character.' },

    'svc2.title': { ar: 'التطوير المعماري', en: 'Architectural Development' },
    'svc2.desc':  { ar: 'تطوير وتحسين المظهر والعناصر المعمارية للمباني والمنشآت.', en: 'Developing and enhancing the appearance and architectural elements of buildings and facilities.' },

    'svc3.title': { ar: 'الواجهات والعناصر المعمارية', en: 'Facades & Architectural Elements' },
    'svc3.desc':  { ar: 'تنفيذ التفاصيل والزخارف والأشكال المعمارية بدقة عالية.', en: 'Executing architectural details, ornamentation and forms with high precision.' },

    'svc4.title': { ar: 'الترميم والتطوير', en: 'Restoration & Development' },
    'svc4.desc':  { ar: 'ترميم وتطوير العناصر والمباني ذات الطابع المعماري والتراثي.', en: 'Restoring and developing elements and buildings of architectural and heritage character.' },

    'svc5.titlePre': { ar: 'أعمال ', en: '' },
    'svc5.titlePost':{ ar: '', en: ' Works' },
    'svc5.desc1': { ar: 'تصنيع وتركيب العناصر والواجهات المعمارية باستخدام ', en: 'Manufacturing and installing architectural elements and facades using high-quality ' },
    'svc5.desc2': { ar: ' عالي الجودة.', en: '.' },

    /* ---------- about section (index) ---------- */
    'about.kicker':  { ar: 'من نحن', en: 'ABOUT US' },
    'about.title1':  { ar: 'نبني التفاصيــل', en: 'We build the details' },
    'about.title2Pre':{ ar: 'التي تصنع ', en: 'that make the ' },
    'about.title2Em': { ar: 'الفرق', en: 'difference' },
    'about.lede':    { ar: 'المتحدة للإنشاءات والمقاولات شركة رائدة في تقديم حلول متكاملة في مجال الإنشاءات والترميم والتطوير المعماري، تجمع بين الخبرة الهندسية، جودة التنفيذ، والدقة في كل تفصيلة لنحقق تصاميم استثنائية نبني المستقبل.',
                        en: 'United Construction is a leading provider of integrated construction, restoration and architectural development solutions — combining engineering expertise, execution quality and precision in every detail to deliver exceptional designs and build the future.' },

    'pillar1.title': { ar: 'تنفيذ متكامل', en: 'Integrated Execution' },
    'pillar1.desc':  { ar: 'من الفكرة والتصميم حتى التسليم النهائي', en: 'From concept and design through to final handover' },
    'pillar2.title': { ar: 'جودة ودقة', en: 'Quality & Precision' },
    'pillar2.desc':  { ar: 'التزام صارم بأعلى معايير الجودة في كل مرحلة', en: 'Strict commitment to the highest quality standards at every stage' },
    'pillar3.title': { ar: 'خبرة متخصصة', en: 'Specialized Expertise' },
    'pillar3.desc':  { ar: 'خبرة واسعة في مشاريع الإنشاءات والتطوير المعماري', en: 'Extensive experience in construction and architectural development projects' },

    'about.cta': { ar: 'اكتشف الشركة', en: 'Discover the Company' },

    /* ---------- stats section ---------- */
    'stats.kicker': { ar: 'أرقام وإنجازات', en: 'NUMBERS & ACHIEVEMENTS' },
    'stats.titlePre': { ar: 'خبرة تمتد، ', en: 'Enduring expertise, ' },
    'stats.titleEm':  { ar: 'وإنجازات تتحدث', en: 'achievements that speak' },
    'stats.lede':   { ar: 'نفخر بما حققناه من إنجازات تعكس التزامنا بالجودة، ودقة التنفيذ، وثقة عملائنا على مدار أكثر من عقد من الخبرة.',
                        en: 'We take pride in achievements that reflect our commitment to quality, precise execution, and our clients’ trust across more than a decade of experience.' },

    'stat1.label': { ar: 'سنة من الخبرة', en: 'Years of Experience' },
    'stat1.desc':  { ar: 'خبرة ممتدة في مجال الإنشاءات والمقاولات والتطوير المعماري والترميم.', en: 'Extensive experience in construction, contracting, architectural development and restoration.' },
    'stat2.label': { ar: 'مشروع مكتمل', en: 'Completed Projects' },
    'stat2.desc':  { ar: 'مشاريع متنوعة نفذناها بنجاح في قطاعات مختلفة.', en: 'A diverse range of projects successfully delivered across different sectors.' },
    'stat3.label': { ar: 'عميل وشريك', en: 'Clients & Partners' },
    'stat3.desc':  { ar: 'ثقة عملائنا وشركائنا هي أساس نجاحنا واستمرارنا.', en: 'The trust of our clients and partners is the foundation of our success and continuity.' },
    'stat4.label': { ar: 'فريق عمل متخصص', en: 'Specialized Team Members' },
    'stat4.desc':  { ar: 'مهندسون وفنيون ذوو خبرة عالية ملتزمون بأعلى معايير الجودة.', en: 'Highly experienced engineers and technicians committed to the highest quality standards.' },

    /* ---------- projects section (index) ---------- */
    'projects.kicker': { ar: 'مشاريعنا', en: 'OUR PROJECTS' },
    'projects.titlePre': { ar: 'نماذج مــن ', en: 'A selection of ' },
    'projects.titleEm':  { ar: 'أعمالنا', en: 'our work' },
    'projects.lede': { ar: 'نفخر بتنفيذ مجموعة متنوعة من المشاريع التي تعكس التزامنا بالجودة والدقة في التنفيذ، وثقة عملائنا على مدار سنوات من الخبرة.',
                        en: 'We take pride in delivering a diverse range of projects that reflect our commitment to quality and precise execution, and our clients’ trust across years of experience.' },
    'projects.prev': { ar: 'المشاريع السابقة', en: 'Previous projects' },
    'projects.next': { ar: 'المشاريع التالية', en: 'Next projects' },
    'projects.listLabel': { ar: 'قائمة المشاريع، يمكن التمرير أفقيًا', en: 'Project list, scrollable horizontally' },
    'projects.viewAll': { ar: 'استعرض جميع المشاريع', en: 'View All Projects' },
    'projects.scrollMore': { ar: 'مرر لمزيد من المشاريع', en: 'Scroll for more projects' },

    'p7.title':  { ar: 'موقع زهرة الأوقاف', en: 'Zahret Al-Awqaf Site' },
    'p6.titlePre': { ar: 'تركيب ', en: 'Installation of ' },
    'p6.titlePost':{ ar: ' قصر السلاملك والمبنى الملحق', en: ' Elements — Salamlek Palace & Annex' },
    'p3.titlePre': { ar: 'ترميم وتركيب ', en: 'Restoration & Installation of ' },
    'p3.titlePost':{ ar: ' سور المنتزه الأثري', en: ' Elements — Al-Montazah Heritage Wall' },
    'p4.titlePre': { ar: 'تركيب ', en: 'Installation of ' },
    'p4.titlePost':{ ar: ' شاطئ فريدة المنتزه', en: ' Elements — Farida Beach, Al-Montazah' },
    'p5.titlePre': { ar: 'تركيب ', en: 'Installation of ' },
    'p5.titlePost':{ ar: ' بوابة المعمورة المنتزه', en: ' Elements — Al-Maamoura Gate, Al-Montazah' },
    'p2.title':  { ar: 'ترميم وتطوير مبنى (محطة مصر) بالإسكندرية', en: 'Restoration & Development of Misr Station Building, Alexandria' },
    'p1.titlePre': { ar: 'تركيب ', en: 'Installation of ' },
    'p1.titlePost':{ ar: ' مبنى ساحة المتحف اليوناني الروماني', en: ' Elements — Greco-Roman Museum Plaza Building' },

    /* ---------- partners section ---------- */
    'partners.kicker': { ar: 'شركاؤنا', en: 'OUR PARTNERS' },
    'partners.titlePre': { ar: 'شركاء ', en: 'Partners in ' },
    'partners.titleEm':  { ar: 'النجاح', en: 'Success' },
    'partners.lede': { ar: 'نفخر بالتعاون مع نخبة من الشركات والمؤسسات الرائدة التي تشاركنا الالتزام بالجودة والدقة والابتكار في كل مشروع.',
                         en: 'We are proud to collaborate with a select group of leading companies and institutions who share our commitment to quality, precision and innovation in every project.' },
    'partners.sloganPre': { ar: 'معاً نبني ', en: 'Together we build the ' },
    'partners.sloganEm1': { ar: 'المستقبل', en: 'future' },
    'partners.sloganMid': { ar: ' ونحقق ', en: ' and achieve ' },
    'partners.sloganEm2': { ar: 'النجاح', en: 'success' },

    'partner1.name': { ar: 'حسن علام القابضة', en: 'Hassan Allam Holding' },
    'partner2.name': { ar: 'دارك للمقاولات', en: 'Dark Contracting' },
    'partner3.name': { ar: 'شركة النيل العامة<br>للطرق والكباري', en: 'Nile General Co.<br>for Roads & Bridges' },
    'partner4.name': { ar: 'المقاولون العرب', en: 'Arab Contractors' },
    'partner4.sub':  { ar: 'عثمان أحمد عثمان وشركاه', en: 'Osman Ahmed Osman & Co.' },
    'partner5.name': { ar: 'شركة جيكو', en: 'Geco Company' },
    'partner5.sub':  { ar: 'للمقاولات العامة والهندسية', en: 'General & Engineering Contracting' },
    'partner6.name': { ar: 'ريستور جروب', en: 'Restore Group' },
    'partner6.sub':  { ar: 'للترميم والتطوير', en: 'Restoration & Development' },

    /* ---------- contact section ---------- */
    'contact.kicker':  { ar: 'CONTACT', en: 'CONTACT' },
    'contact.titlePre':{ ar: 'تواصل ', en: 'Get in ' },
    'contact.titleEm': { ar: 'معنـا', en: 'Touch' },
    'contact.lede':    { ar: 'يسعدنا تواصلكم معنا لأي استفسار أو طلب خدمة. فريقنا جاهز للرد عليكم في أقرب وقت ممكن.',
                          en: 'We’d love to hear from you for any inquiry or service request. Our team is ready to respond as soon as possible.' },

    'form.name':    { ar: 'الاسم الكامل', en: 'Full Name' },
    'form.email':   { ar: 'البريد الإلكتروني', en: 'Email Address' },
    'form.phone':   { ar: 'رقم الهاتف', en: 'Phone Number' },
    'form.message': { ar: 'رسالتك', en: 'Your Message' },
    'form.send':    { ar: 'إرسال الرسالة', en: 'Send Message' },
    'form.errorRequired': { ar: 'من فضلك أكمل الحقول المطلوبة بشكل صحيح.', en: 'Please fill in all required fields correctly.' },
    'form.success': { ar: 'تم تجهيز رسالتك — أكمل الإرسال من بريدك.', en: 'Your message is ready — finish sending it from your mail app.' },
    'form.mailSubject': { ar: 'طلب من الموقع — ', en: 'Website request — ' },
    'form.mailName':    { ar: 'الاسم: ', en: 'Name: ' },
    'form.mailEmail':   { ar: 'البريد: ', en: 'Email: ' },
    'form.mailPhone':   { ar: 'الهاتف: ', en: 'Phone: ' },

    'contact.mapAria':  { ar: 'افتح موقعنا على خرائط جوجل — 21 طريق اسكندرية مطروح، ش مدرسة شيرين، قسم العامرية، اسكندرية',
                            en: 'Open our location on Google Maps — 21 Alexandria–Matrouh Rd, Shirin School St, Al-Amriya, Alexandria' },
    'contact.mapTitle': { ar: '21 طريق اسكندرية مطروح', en: '21 Alexandria–Matrouh Rd' },
    'contact.mapSub':   { ar: 'ش مدرسة شيرين، قسم العامرية، اسكندرية', en: 'Shirin School St, Al-Amriya, Alexandria' },
    'contact.mapOpen':  { ar: 'عرض خريطة أكبر', en: 'View larger map' },

    'contact.tileEmail': { ar: 'البريد الإلكتروني', en: 'Email Address' },
    'contact.tilePhone': { ar: 'الهاتف', en: 'Phone' },
    'contact.tileAddress': { ar: 'العنوان', en: 'Address' },
    'contact.addressBlock': { ar: '21 طريق اسكندرية مطروح<br>ش مدرسة شيرين قسم العامرية<br>اسكندرية', en: '21 Alexandria–Matrouh Rd<br>Shirin School St, Al-Amriya<br>Alexandria' },

    /* ---------- footer (shared) ---------- */
    'footer.blurb': { ar: 'نحوّل الأفكار إلى مشاريع واقعية بأعلى معايير الجودة والاحترافية لبناء مستقبل أفضل.',
                        en: 'We turn ideas into real projects with the highest standards of quality and professionalism, building a better future.' },
    'footer.quickLinks': { ar: 'روابط سريعة', en: 'Quick Links' },
    'footer.services':   { ar: 'خدماتنا', en: 'Our Services' },
    'footer.aboutCol':   { ar: 'عن الشركة', en: 'About the Company' },
    'footer.contactCol': { ar: 'تواصل معنا', en: 'Contact Us' },

    'footer.svc1': { ar: 'المقاولات العامة', en: 'General Contracting' },
    'footer.svc2': { ar: 'التصميم المعماري', en: 'Architectural Design' },
    'footer.svc3': { ar: 'إدارة المشاريع', en: 'Project Management' },
    'footer.svc4': { ar: 'التشطيبات الداخلية', en: 'Interior Finishing' },
    'footer.svc5': { ar: 'البنية التحتية', en: 'Infrastructure' },

    'footer.aboutWho':   { ar: 'من نحن', en: 'Who We Are' },
    'footer.aboutVision':{ ar: 'رؤيتنا', en: 'Our Vision' },
    'footer.aboutValues':{ ar: 'قيمنا', en: 'Our Values' },
    'footer.aboutFlow':  { ar: 'منهجية عملنا', en: 'Our Methodology' },
    'footer.aboutCert':  { ar: 'اعتماداتنا', en: 'Our Credentials' },

    'footer.addressBlock': { ar: '21 طريق اسكندريه مطروح<br>ش مدرسه شيرين<br>قسم العامريه، اسكندريه', en: '21 Alexandria–Matrouh Rd<br>Shirin School St<br>Al-Amriya, Alexandria' },
    'footer.hours':     { ar: 'السبت – الخميس', en: 'Sat – Thu' },
    'footer.hoursTime': { ar: '9:00 ص – 6:00 م', en: '9:00 AM – 6:00 PM' },
    'footer.poweredBy': { ar: 'Powered by', en: 'Powered by' },

    /* ---------- about.html ---------- */
    'about.pageTitle': { ar: 'عن الشركة | المتحدة للإنشاءات والمقاولات', en: 'About Us | United Construction' },
    'ab.requestQuote': { ar: 'طلب عرض سعر', en: 'Request a Quote' },
    'ab.kicker': { ar: 'عن المتحدة للمقاولات', en: 'ABOUT UNITED CONTRACTING' },
    'ab.titlePre': { ar: 'نبني المستقبل', en: 'Building the future' },
    'ab.titleMid': { ar: 'بجودة ', en: 'with quality that ' },
    'ab.titleEm':  { ar: 'تدوم', en: 'lasts' },
    'ab.lede': { ar: 'المتحدة للمقاولات شركة مصرية متخصصة في أعمال التشييد والبناء والمقاولات والتشطيبات، نلتزم بتنفيذ مشاريعنا بأعلى معايير الجودة والدقة والالتزام.',
                  en: 'United Contracting is an Egyptian company specialized in construction, building, contracting and finishing works. We are committed to delivering our projects to the highest standards of quality, precision and reliability.' },
    'ab.ctaContact': { ar: 'تواصل معنا', en: 'Contact Us' },

    'ab.factLocation': { ar: 'الموقع', en: 'Location' },
    'ab.factLocationVal': { ar: 'الإسكندرية - العامرية', en: 'Alexandria — Al-Amriya' },
    'ab.factStart': { ar: 'بداية النشاط', en: 'Founded' },
    'ab.factField': { ar: 'مجال العمل', en: 'Field of Work' },
    'ab.factFieldVal': { ar: 'تشييد ومقاولات - تشطيبات', en: 'Construction & Contracting — Finishing' },
    'ab.factType': { ar: 'نوع المنشأة', en: 'Entity Type' },
    'ab.factTypeVal': { ar: 'منشأة فردية', en: 'Sole Proprietorship' },

    'ab.whoKicker': { ar: 'من نحن', en: 'WHO WE ARE' },
    'ab.whoTitlePre': { ar: 'خبرة موثوقة..', en: 'Trusted expertise..' },
    'ab.whoTitleEm':  { ar: 'الالتزام بالجودة', en: 'a commitment to quality' },
    'ab.whoLede': { ar: 'تأسست المتحدة للمقاولات عام 2020 بمدينة الإسكندرية، عملنا على تنفيذ العديد من المشاريع الاستثنائية وغير السكنية بكفاءة عالية واهتمام بأدق التفاصيل من مرحلة التصميم حتى تسليم المشروع.',
                          en: 'United Contracting was founded in 2020 in Alexandria. We have delivered numerous exceptional, non-residential projects with high efficiency and close attention to detail, from the design stage through to project handover.' },
    'ab.whoCta': { ar: 'المزيد عن الشركة', en: 'More About the Company' },

    'ab.whyTitlePre': { ar: 'لماذا تختار ', en: 'Why choose ' },
    'ab.whyTitleEm':  { ar: 'المتحدة؟', en: 'United?' },

    'why1.title': { ar: 'جودة عالية', en: 'High Quality' },
    'why1.desc':  { ar: 'مواد عالية الجودة ومطابقة للمواصفات', en: 'High-quality materials that meet specifications' },
    'why2.title': { ar: 'كفاءة واحترافية', en: 'Efficiency & Professionalism' },
    'why2.desc':  { ar: 'فريق عمل متخصص ومدرب باستمرار', en: 'A specialized, continuously trained team' },
    'why3.title': { ar: 'التزام كامل', en: 'Full Commitment' },
    'why3.desc':  { ar: 'الالتزام بالوقت المحدد وتسليم المشاريع', en: 'Committed to deadlines and project handover' },
    'why4.title': { ar: 'حلول متكاملة', en: 'Integrated Solutions' },
    'why4.desc':  { ar: 'من التصميم إلى التنفيذ والتشطيب النهائي', en: 'From design to execution and final finishing' },
    'why5.title': { ar: 'خبرة موثوقة', en: 'Trusted Expertise' },
    'why5.desc':  { ar: 'خبرة عملية في تنفيذ عدة أنواع من المشاريع', en: 'Hands-on experience delivering many types of projects' },

    'ab.offerTitle': { ar: 'مـاذا نقـدم', en: 'What We Offer' },

    'offer1.title': { ar: 'أعمال التشييد والبناء', en: 'Construction & Building Works' },
    'offer1.desc':  { ar: 'تنفيذ الأعمال الإنشائية للمباني السكنية وغير السكنية وفق أعلى معايير الجودة.', en: 'Executing structural works for residential and non-residential buildings to the highest quality standards.' },
    'offer2.title': { ar: 'أعمال المقاولات', en: 'Contracting Works' },
    'offer2.desc':  { ar: 'تنفيذ جميع الأعمال المدنية والإنشائية بكفاءة ودقة حسب متطلبات المشروع.', en: 'Executing all civil and structural works efficiently and precisely per project requirements.' },
    'offer3.titlePre': { ar: 'أعمال ', en: '' },
    'offer3.titlePost':{ ar: ' والواجهات', en: ' & Facade Works' },
    'offer3.desc1': { ar: 'تصميم وتنفيذ وتركيب عناصر ', en: 'Designing, executing and installing ' },
    'offer3.desc2': { ar: ' للواجهات والزخارف المعمارية.', en: ' elements for facades and architectural ornamentation.' },
    'offer4.title': { ar: 'أعمال التشطيبات', en: 'Finishing Works' },
    'offer4.desc':  { ar: 'تنفيذ التشطيبات الداخلية والخارجية بأحدث الأساليب وأفضل الخامات.', en: 'Executing interior and exterior finishing with the latest methods and finest materials.' },

    'ab.flowTitle': { ar: 'منهجيــة عملنـا', en: 'Our Methodology' },
    'flow1.title': { ar: 'دراسة المشروع', en: 'Project Study' },
    'flow1.desc':  { ar: 'تحليل المتطلبات ووضع خطة التنفيذ المناسبة.', en: 'Analyzing requirements and setting an appropriate execution plan.' },
    'flow2.title': { ar: 'التخطيط', en: 'Planning' },
    'flow2.desc':  { ar: 'تصميم الحلول الهندسية وإعداد الجداول الزمنية.', en: 'Designing engineering solutions and preparing timelines.' },
    'flow3.title': { ar: 'التنفيذ', en: 'Execution' },
    'flow3.desc':  { ar: 'تنفيذ الأعمال وفق أعلى معايير الجودة والسلامة.', en: 'Carrying out the works to the highest quality and safety standards.' },
    'flow4.title': { ar: 'التشطيب', en: 'Finishing' },
    'flow4.desc':  { ar: 'تشطيب المشروع بأفضل الخامات والتقنيات.', en: 'Finishing the project with the best materials and techniques.' },
    'flow5.title': { ar: 'التسليم', en: 'Handover' },
    'flow5.desc':  { ar: 'تسليم المشروع في الوقت المحدد وبأفضل جودة.', en: 'Handing over the project on time and at the best quality.' },

    'ab.certTitlePre': { ar: 'اعتماداتنا ', en: 'Our official ' },
    'ab.certTitleEm':  { ar: 'الرسمية', en: 'credentials' },
    'ab.certLede': { ar: 'شركة مسجلة رسميًا ومرخصة لدى الجهات الحكومية المصرية.', en: 'An officially registered and licensed company with the Egyptian government authorities.' },
    'cert1.label': { ar: 'البطاقة الضريبية', en: 'Tax Card' },
    'cert2.label': { ar: 'تسجيل ضريبة القيمة المضافة', en: 'VAT Registration' },
    'a11y.close': { ar: 'إغلاق', en: 'Close' },

    'ab.finalCta1': { ar: 'لديك مشروع؟', en: 'Have a project?' },
    'ab.finalCta2': { ar: 'دعنا نحوله إلى حقيقة.', en: 'Let’s make it a reality.' },

    /* ---------- project.html ---------- */
    'proj.backToProjects': { ar: 'العودة إلى المشاريع', en: 'Back to Projects' },
    'proj.backToHome': { ar: 'العودة إلى الرئيسية', en: 'Back to Home' },
    'proj.metaType': { ar: 'نوع المشروع', en: 'Project Type' },
    'proj.metaDuration': { ar: 'مدة التنفيذ', en: 'Duration' },
    'proj.metaLocation': { ar: 'الموقع', en: 'Location' },

    'proj.journeyTitle': { ar: 'رحلة المشروع', en: 'Project Journey' },
    'proj.journeyLede': { ar: 'من الفكرة إلى الواقع. كل مرحلة من التنفيذ بدقة وعناية لضمان أفضل النتائج وأعلى جودة.',
                            en: 'From concept to reality. Every stage executed with precision and care to ensure the best results and highest quality.' },
    'proj.tabRestore': { ar: 'مرحلة الترميم', en: 'Restoration Phase' },
    'proj.tabBuild':   { ar: 'مرحلة البناء', en: 'Construction Phase' },
    'proj.tabResult':  { ar: 'النتيجة النهائية', en: 'Final Result' },
    'proj.similarProject1': { ar: 'لديك مشروع مشابه؟', en: 'Have a similar project?' },
    'proj.similarProject2': { ar: 'دعنا نحوله إلى حقيقة.', en: 'Let’s make it a reality.' },
    'proj.prevPhotos': { ar: 'الصور السابقة', en: 'Previous photos' },
    'proj.nextPhotos': { ar: 'الصور التالية', en: 'Next photos' },

    /* ---------- projects-all.html ---------- */
    'pa.pageTitle': { ar: 'جميع المشاريع | المتحدة للإنشاءات والمقاولات', en: 'All Projects | United Construction' },
    'pa.kicker': { ar: 'أعمالنا', en: 'OUR WORK' },
    'pa.titlePre': { ar: 'جميع ', en: 'All Our ' },
    'pa.titleEm':  { ar: 'مشاريعنا', en: 'Projects' },
    'pa.lede': { ar: 'مجموعة كاملة من مشاريعنا المنفذة في الترميم وGRC والتطوير المعماري، بأعلى معايير الجودة والدقة في كل تفصيلة.',
                  en: 'A complete collection of our delivered projects in restoration, GRC and architectural development, executed to the highest standards of quality and precision.' },

    'pa.catSpecial':     { ar: 'أعمال خاصة', en: 'Special Works' },
    'pa.catGRC':         { ar: 'مشاريع GRC', en: 'GRC Projects' },
    'pa.catRestoration': { ar: 'مشاريع الترميم', en: 'Restoration Projects' },

    /* ---------- fields.html (Work Fields) ---------- */
    'fl.pageTitle': { ar: 'مجالات التنفيذ | المتحدة للإنشاءات والمقاولات', en: 'Work Fields | United Construction' },
    'fl.kicker': { ar: 'مجالات التنفيذ', en: 'OUR WORK CATEGORIES' },
    'fl.title':  { ar: 'مجالات <em>التنفيذ</em>', en: 'Our Work <em>Categories</em>' },
    'fl.lede': { ar: 'ننفذ أعمالنا بأعلى معايير الجودة والدقة، في مختلف المجالات لنحول التصميم إلى واقع يدوم.',
                  en: 'We execute our work to the highest standards of quality and precision, across every field, turning design into a lasting reality.' },
    'fl.more': { ar: 'عرض المزيد', en: 'View More' },
    'fl.ctaSub': { ar: 'دعنا نساعدك على تنفيذه بأعلى جودة.', en: 'Let us help you deliver it at the highest quality.' },

    'fl.f1.title':   { ar: 'أعمال السيراميك', en: 'Ceramic Works' },
    'fl.f1.titleEn': { ar: 'Ceramic Works', en: 'Ceramic Works' },
    'fl.f1.desc':    { ar: 'توريد وتركيب السيراميك بجودة عالية وتشطيبات احترافية تناسب جميع المساحات.',
                        en: 'Supplying and installing ceramic tiles with high quality and professional finishes suited to every space.' },

    'fl.f2.title':   { ar: 'أعمال الموزايكو', en: 'Mosaic Works' },
    'fl.f2.titleEn': { ar: 'Mosaic Works', en: 'Mosaic Works' },
    'fl.f2.desc':    { ar: 'تنفيذ أعمال الموزايكو بكافة أشكالها وألوانها للمداخل والأرضيات والتفاصيل الجمالية.',
                        en: 'Executing mosaic work in every shape and color for entrances, flooring and aesthetic detailing.' },

    'fl.f3.title':   { ar: 'أعمال الدهانات', en: 'Painting Works' },
    'fl.f3.titleEn': { ar: 'Painting Works', en: 'Painting Works' },
    'fl.f3.desc':    { ar: 'جميع أعمال الدهان الداخلي والخارجي بأفضل الخامات والألوان وبأيدي متخصصة.',
                        en: 'All interior and exterior painting works with the finest materials, colors and specialized hands.' },

    'fl.f4.title':   { ar: 'أعمال المباني', en: 'Building Works' },
    'fl.f4.titleEn': { ar: 'Building Works', en: 'Building Works' },
    'fl.f4.desc':    { ar: 'تنفيذ أعمال المباني والحوائط والسور والترميمات بجودة عالية ومتانة تدوم.',
                        en: 'Executing building, wall, fencing and restoration works with high quality and lasting durability.' }
  };

  /* ==========================================================
     PROJECT DATA (project.html dynamic content) — English
     ----------------------------------------------------------
     Mirrors PROJECTS from projects-data.js by id. project.js
     reads this via window.PROJECTS_EN when lang=en.
     ========================================================== */
  window.PROJECTS_EN = {
    1: {
      category: "Restoration Projects",
      title: "Greco-Roman Museum Building Project",
      lede: "A comprehensive restoration and rehabilitation of the Greco-Roman Museum building to the highest quality standards, preserving its authentic architectural character while meeting modern usage requirements.",
      type: "Restoration & Rehabilitation",
      duration: "18 months",
      location: "Alexandria, Egypt"
    },
    2: {
      category: "Restoration Projects",
      title: "Misr Station Building Restoration & Development",
      lede: "A comprehensive restoration and rehabilitation of the historic Misr Station building to the highest quality standards, preserving its authentic architectural character while meeting modern usage requirements.",
      type: "Restoration & Rehabilitation",
      duration: "24 months",
      location: "Alexandria, Egypt"
    },
    3: {
      category: "Restoration Projects",
      title: "Restoration & GRC Installation — Al-Montazah Heritage Wall",
      lede: "A comprehensive restoration and GRC element installation for the Al-Montazah heritage wall to the highest quality standards, preserving its authentic architectural character while meeting modern usage requirements.",
      type: "Restoration & GRC Installation",
      duration: "10 months",
      location: "Alexandria, Egypt"
    },
    4: {
      category: "GRC Projects",
      title: "GRC Installation — Farida Beach, Al-Montazah",
      lede: "Manufacturing and installing GRC elements for Farida Beach in Al-Montazah to the highest standards of quality and precision, achieving an architectural character fully integrated with the site.",
      type: "GRC Manufacturing & Installation",
      duration: "8 months",
      location: "Alexandria, Egypt"
    },
    5: {
      category: "GRC Projects",
      title: "GRC Installation — Al-Maamoura Gate, Al-Montazah",
      lede: "Manufacturing and installing GRC elements for the Al-Maamoura Gate in Al-Montazah to the highest standards of quality and precision, achieving an architectural character fully integrated with the site.",
      type: "GRC Manufacturing & Installation",
      duration: "9 months",
      location: "Alexandria, Egypt"
    },
    6: {
      category: "GRC Projects",
      title: "GRC Installation — Salamlek Palace & Annex",
      lede: "Manufacturing and installing GRC elements for Salamlek Palace and its annex building to the highest standards of quality and precision, achieving an architectural character fully integrated with the site.",
      type: "GRC Manufacturing & Installation",
      duration: "12 months",
      location: "Alexandria, Egypt"
    },
    7: {
      category: "Special Works",
      title: "Zahret Al-Awqaf Site",
      lede: "A fully integrated execution of the Zahret Al-Awqaf project to the highest standards of quality and precision in every detail, achieving a distinctive architectural design worthy of the site.",
      type: "Integrated Execution",
      duration: "20 months",
      location: "Alexandria, Egypt"
    }
  };

  window.JOURNEY_PHASES_EN = [
    { title: 'Restoration Phase', copy: 'Restoration works included structural reinforcement, facade treatment and restoring architectural elements to preserve the building’s authentic character.' },
    { title: 'Construction Phase', copy: 'Executing structural works and interior/exterior finishing to the highest standards of quality and safety.' },
    { title: 'Final Result', copy: 'The project was completed to the highest quality, restoring the building to its original form as a distinguished historic landmark.' }
  ];

  /* ==========================================================
     ENGINE
     ========================================================== */
  function getLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ar' || saved === 'en') return saved;
    } catch (e) {}
    return 'ar';
  }

  function setStoredLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function applyLang(lang) {
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');

    // text content
    var nodes = document.querySelectorAll('[data-i18n]');
    Array.prototype.forEach.call(nodes, function (el) {
      var key = el.getAttribute('data-i18n');
      var entry = DICT[key];
      if (!entry) return;
      var val = entry[lang];
      if (val == null) return;
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    // attributes: data-i18n-attr="placeholder:key1|aria-label:key2"
    var attrNodes = document.querySelectorAll('[data-i18n-attr]');
    Array.prototype.forEach.call(attrNodes, function (el) {
      var spec = el.getAttribute('data-i18n-attr');
      spec.split('|').forEach(function (pair) {
        var parts = pair.split(':');
        var attr = parts[0];
        var key  = parts[1];
        if (!attr || !key) return;
        var entry = DICT[key];
        if (!entry) return;
        var val = entry[lang];
        if (val == null) return;
        el.setAttribute(attr, val);
      });
    });

    // title tag
    var titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey && DICT[titleKey]) {
      document.title = DICT[titleKey][lang];
    }

    // lang switch UI state
    var langCurrent = document.getElementById('langCurrent');
    if (langCurrent) langCurrent.textContent = lang.toUpperCase();

    var langButtons = document.querySelectorAll('#langMenu [data-lang]');
    Array.prototype.forEach.call(langButtons, function (b) {
      b.setAttribute('aria-current', String(b.getAttribute('data-lang') === lang));
    });

    document.body.classList.toggle('lang-en', lang === 'en');

    // let page-specific scripts (project.js) react
    document.dispatchEvent(new CustomEvent('uc:langchange', { detail: { lang: lang } }));
  }

  function initLangSwitch() {
    var langMenu = document.getElementById('langMenu');
    if (!langMenu) return;
    langMenu.addEventListener('click', function (e) {
      var choice = e.target.closest('[data-lang]');
      if (!choice) return;
      var lang = choice.getAttribute('data-lang');
      setStoredLang(lang);
      applyLang(lang);
    });
  }

  window.UC_I18N = { applyLang: applyLang, getLang: getLang, DICT: DICT };

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(getLang());
    initLangSwitch();
  });

})();
