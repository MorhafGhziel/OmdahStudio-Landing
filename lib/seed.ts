/**
 * Seed data.
 *
 * Used twice: to populate an empty collection on first read, and as the
 * response when the database is unreachable — so the site never renders an
 * empty page because Mongo had a bad minute.
 */

/**
 * The reels ship in public/videos and are served like any other static
 * asset — no credentials, no proxy, no database. Pointing the seed at the
 * object store meant a site without IDRIVE_* keys rendered every project
 * without its footage, while the images beside them loaded fine.
 */
const REEL = "/videos";

export const defaultServices = [
  {
    id: "01",
    title: "تصوير سكتشات",
    category: "تصوير",
    description:
      "تصوير احترافي يطلع منتجاتك بأفضل صورة ممكنة. باستخدام أحدث التقنيات والمعايير، نخلي تفاصيلها واضحة وجمالها يبان من أول نظرة.",
    features: ["تصوير احترافي", "تفاصيل واضحة", "أحدث التقنيات"],
  },
  {
    id: "02",
    title: "مقاطع ريلز",
    category: "إنتاج",
    description:
      "رسوم متحركة تخطف الانتباه وتوصل رسالتك بطريقة سهلة وواضحة. حركات سلسة وجذابة تخلي محتواك تفاعلي ويشوفه كل اللي يشوفه.",
    features: ["رسوم متحركة", "حركات سلسة", "محتوى تفاعلي"],
  },
  {
    id: "03",
    title: "كتابة محتوى",
    category: "محتوى",
    description:
      "محتوى إبداعي يعبر عن هوية براندك بطريقة قريبة للناس. بأسلوب جذاب يناسب جمهورك ويوصل رسالتك ويخدم أهدافك التسويقية.",
    features: ["محتوى إبداعي", "أسلوب جذاب", "خدمة الأهداف التسويقية"],
  },
  {
    id: "04",
    title: "فويس اوفر",
    category: "صوت",
    description:
      "تسجيل صوتي احترافي يرفع جودة محتواك. أصوات واضحة ومؤثرة توصل رسالتك بطريقة احترافية تليق بمشروعك.",
    features: ["تسجيل احترافي", "أصوات واضحة", "جودة عالية"],
  },
  {
    id: "05",
    title: "تصاميم ثلاثية أبعاد",
    category: "تصميم",
    description:
      "تصاميم ثري دي احترافية تعطي مشروعك بعد جديد. تصاميم واقعية تساعدك تبرز منتجاتك بطريقة مبتكرة وتشوف انتباه العملاء.",
    features: ["تصاميم واقعية", "بعد جديد", "طريقة مبتكرة"],
  },
  {
    id: "06",
    title: "حملات ترويجية",
    category: "تسويق",
    description:
      "حملات متكاملة توصل رسالتك صح وتوصلها للناس. نخطط وننفذ اللي يهتمونك. أفكار جديدة، شغل مرتب، ونتائج تشوفها بعينك.",
    features: ["حملات متكاملة", "أفكار جديدة", "نتائج واضحة"],
  },
  {
    id: "07",
    title: "تصوير منتجات",
    category: "تصوير",
    description:
      "تصوير احترافي يطلع منتجاتك بأفضل صورة ممكنة. باستخدام أحدث التقنيات والمعايير، نخلي تفاصيلها واضحة وجمالها يبان من أول نظرة.",
    features: ["تصوير احترافي", "تفاصيل واضحة", "أحدث التقنيات"],
  },
  {
    id: "08",
    title: "موشن جرافيك",
    category: "إنتاج",
    description:
      "رسوم متحركة تخطف الانتباه وتوصل رسالتك بطريقة سهلة وواضحة. حركات سلسة وجذابة تخلي محتواك تفاعلي ويشوفه كل اللي يشوفه.",
    features: ["رسوم متحركة", "حركات سلسة", "محتوى تفاعلي"],
  },
  {
    id: "09",
    title: "تغطيات",
    category: "إنتاج",
    description:
      "تغطية كاملة لفعالياتك ومناسباتك بجودة عالية. ننقل كل لحظة مهمة بدقة ونوثق جو الحدث بطريقة مميزة وتشوفها كل اللي يشوفها.",
    features: ["تغطية كاملة", "جودة عالية", "توثيق دقيق"],
  },
];

const CAMPAIGN_SERVICES = [
  "تطوير الهوية البصرية",
  "إنتاج فيديوهات ترويجية",
  "تصميم المواد التسويقية",
  "حملة تسويقية شاملة",
];

export const defaultWorks = [
  {
    id: "00",
    title: "Omdah Production",
    category: "إنتاج",
    image: "/images/jedeal.png",
    video: `${REEL}/OmdahProduction.mp4`,
    client: "Omdah",
    year: "2024",
    featured: true,
    link: "/works/omdah-production",
    description:
      "إنتاج فيديو ترويجي يعرض أعمالنا وإنجازاتنا في مجال الإنتاج والتسويق",
    services: [
      "إنتاج فيديو ترويجي",
      "تصوير احترافي",
      "مونتاج وتحرير",
      "هوية بصرية",
    ],
  },
  {
    id: "01",
    title: "Deal",
    category: "تسويق",
    image: "/images/jedeal.png",
    video: `${REEL}/jedeal.mov`,
    client: "Deal",
    year: "2024",
    featured: false,
    link: "/works/jedeal",
    description:
      "تطوير هوية بصرية متكاملة وحملة تسويقية شاملة لـ Deal، تضمنت إنتاج فيديوهات ترويجية وتصميم مواد تسويقية",
    services: CAMPAIGN_SERVICES,
  },
  {
    id: "03",
    title: "Sabahik",
    category: "تسويق",
    image: "/images/sabahk.png",
    video: `${REEL}/Sabahik.mov`,
    client: "Sabahik",
    year: "2024",
    link: "/works/sabahik",
    description:
      "تطوير هوية بصرية متكاملة وحملة تسويقية شاملة لـ Sabahik، تضمنت إنتاج فيديوهات ترويجية وتصميم مواد تسويقية",
    services: CAMPAIGN_SERVICES,
  },
  {
    id: "04",
    title: "Safeside",
    category: "3D",
    image: "/images/safesidee.png",
    video: `${REEL}/Safeside.mp4`,
    video2: `${REEL}/Safeside2.mov`,
    client: "Safeside",
    year: "2023",
    link: "/works/safeside",
    description:
      "تصميم ثلاثي الأبعاد لمشروع معماري ضخم، مع إنتاج فيديو تفاعلي للعرض",
    services: [
      "تصميم ثلاثي الأبعاد",
      "النمذجة المعمارية",
      "إنتاج فيديو تفاعلي",
      "العرض المرئي",
    ],
  },
  {
    id: "05",
    title: "Shakkah",
    category: "تسويق",
    image: "/images/Shakkah.png",
    video: `${REEL}/Shakkah.mov`,
    client: "Shakkah",
    year: "2024",
    link: "/works/shakkah",
    description:
      "تطوير هوية بصرية متكاملة وحملة تسويقية شاملة لـ Shakkah، تضمنت إنتاج فيديوهات ترويجية وتصميم مواد تسويقية",
    services: CAMPAIGN_SERVICES,
  },
];

export const defaultClients = [
  { name: "STC Bank", logo: "/images/StcBank.png" },
  { name: "Zid", logo: "/images/zid.png" },
  { name: "Pangaea", logo: "/images/pangaea.png" },
  { name: "Safeside", logo: "/images/safeside.png" },
  { name: "Al Dammam", logo: "/images/aldammam.png" },
  { name: "Slope", logo: "/images/slope.png" },
  { name: "Deal", logo: "/images/deal.png" },
  { name: "شفل", logo: "/images/شفل.png" },
  { name: "AMF", logo: "/images/AMFlogo.png" },
  { name: "Unknown Room", logo: "/images/Unknown-Room.png" },
  {
    name: "8Oz Coffee",
    logo: "/images/02254bd4-0bd2-40c6-ab3d-45fc52844914_removalai_preview.png",
  },
  {
    name: "Client 1",
    logo: "/images/f2c8e19a-b510-4653-89f4-3ab306ed9139_removalai_preview.png",
  },
  {
    name: "Client 2",
    logo: "/images/e26e1692-ae63-482a-8ab0-0c34c917cc43_removalai_preview.png",
  },
  {
    name: "Client 3",
    logo: "/images/9d1be18b-4426-469d-9076-67e22731bd92_removalai_preview.png",
  },
  {
    name: "Client 4",
    logo: "/images/09191da8-fe58-4854-8891-c19ea6d9ce30_removalai_preview.png",
  },
  { name: "Mylk", logo: "/images/mylk.png" },
];
