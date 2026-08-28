import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'Leafy Greens', tamilName: 'கீரை வகைகள்', slug: 'leafy-greens', emoji: '🥬', color: 'emerald' },
  { name: 'Root Vegetables', tamilName: 'கிழங்கு வகைகள்', slug: 'root-vegetables', emoji: '🥕', color: 'orange' },
  { name: 'Gourds', tamilName: 'சுரை வகைகள்', slug: 'gourds', emoji: '🥒', color: 'lime' },
  { name: 'Daily Essentials', tamilName: 'தினசரி தேவை', slug: 'daily-essentials', emoji: '🧅', color: 'rose' },
  { name: 'Fruits & Vegetables', tamilName: 'காய்கறிகள்', slug: 'fruits-vegetables', emoji: '🍅', color: 'yellow' },
];

// Vegetables with realistic CDN/Cloudflare image URLs
const initialVegetables = [
  {
    name: 'Country Tomato',
    tamilName: 'நாட்டு தக்காளி',
    price: 35,
    unit: 'kg',
    emoji: '🍅',
    categorySlug: 'fruits-vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    description: 'Fresh farm-picked country tomatoes with natural tangy flavor. Great for rasam and curries.',
    isPopular: true,
    discount: 10,
  },
  {
    name: 'Small Onion (Shallots)',
    tamilName: 'சின்ன வெங்காயம்',
    price: 80,
    unit: 'kg',
    emoji: '🧅',
    categorySlug: 'daily-essentials',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80',
    description: 'Traditional sambar onions packed with medicinal benefits and rich flavor.',
    isPopular: true,
    discount: 0,
  },
  {
    name: 'Big Onion',
    tamilName: 'பெரிய வெங்காயம்',
    price: 45,
    unit: 'kg',
    emoji: '🧅',
    categorySlug: 'daily-essentials',
    imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop&q=80',
    description: 'Crisp and pungent red onions essential for everyday cooking.',
    isPopular: false,
    discount: 5,
  },
  {
    name: 'Potato',
    tamilName: 'உருளைக்கிழங்கு',
    price: 40,
    unit: 'kg',
    emoji: '🥔',
    categorySlug: 'root-vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80',
    description: 'Nutritious mountain potatoes, perfect for frying, curries, and roasting.',
    isPopular: true,
    discount: 0,
  },
  {
    name: 'Ooty Carrot',
    tamilName: 'ஊட்டி கேரட்',
    price: 60,
    unit: 'kg',
    emoji: '🥕',
    categorySlug: 'root-vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80',
    description: 'Crunchy sweet Ooty carrots rich in Vitamin A and fresh antioxidants.',
    isPopular: true,
    discount: 15,
  },
  {
    name: 'French Beans',
    tamilName: 'பீன்ஸ்',
    price: 75,
    unit: 'kg',
    emoji: '🫛',
    categorySlug: 'fruits-vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=500&auto=format&fit=crop&q=80',
    description: 'Crisp tender beans harvested fresh every morning.',
    isPopular: false,
    discount: 0,
  },
  {
    name: 'Purple Brinjal (Eggplant)',
    tamilName: 'கத்தரிக்காய்',
    price: 45,
    unit: 'kg',
    emoji: '🍆',
    categorySlug: 'fruits-vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    description: 'Glossy fresh brinjals ideal for ennai kathirikkai and sambar.',
    isPopular: true,
    discount: 0,
  },
  {
    name: "Lady's Finger (Okra)",
    tamilName: 'வெண்டைக்காய்',
    price: 50,
    unit: 'kg',
    emoji: '🌿',
    categorySlug: 'fruits-vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=500&auto=format&fit=crop&q=80',
    description: 'Tender, snap-fresh okra rich in dietary fiber and nutrients.',
    isPopular: true,
    discount: 10,
  },
  {
    name: 'Green Capsicum',
    tamilName: 'குடைமிளகாய்',
    price: 65,
    unit: 'kg',
    emoji: '🫑',
    categorySlug: 'fruits-vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&auto=format&fit=crop&q=80',
    description: 'Crisp bell peppers for stir-fries, fried rice, and salads.',
    isPopular: false,
    discount: 0,
  },
  {
    name: 'Cabbage',
    tamilName: 'முட்டைக்கோஸ்',
    price: 30,
    unit: 'kg',
    emoji: '🥬',
    categorySlug: 'leafy-greens',
    imageUrl: 'https://images.unsplash.com/photo-1551893478-d726eaf0442c?w=500&auto=format&fit=crop&q=80',
    description: 'Dense, tightly packed green cabbage heads freshly picked.',
    isPopular: false,
    discount: 0,
  },
  {
    name: 'Fresh Cauliflower',
    tamilName: 'காலிஃபிளவர்',
    price: 45,
    unit: 'piece',
    emoji: '🥦',
    categorySlug: 'fruits-vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&auto=format&fit=crop&q=80',
    description: 'Whole white florets free from blemishes, perfect for curry or gobi 65.',
    isPopular: true,
    discount: 0,
  },
  {
    name: 'Drumstick',
    tamilName: 'முருங்கைக்காய்',
    price: 15,
    unit: 'piece',
    emoji: '🥢',
    categorySlug: 'fruits-vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=80',
    description: 'Aromatic and fleshy drumsticks for traditional village-style sambar.',
    isPopular: true,
    discount: 0,
  },
  {
    name: 'Bitter Gourd',
    tamilName: 'பாகற்காய்',
    price: 55,
    unit: 'kg',
    emoji: '🥒',
    categorySlug: 'gourds',
    imageUrl: 'https://images.unsplash.com/photo-1628773822503-930a8420311f?w=500&auto=format&fit=crop&q=80',
    description: 'Small dark green bitter gourds loaded with health benefits.',
    isPopular: false,
    discount: 0,
  },
  {
    name: 'Bottle Gourd',
    tamilName: 'சுரைக்காய்',
    price: 35,
    unit: 'kg',
    emoji: '🥒',
    categorySlug: 'gourds',
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&auto=format&fit=crop&q=80',
    description: 'Hydrating, light gourd great for kootu and digestive health.',
    isPopular: false,
    discount: 0,
  },
  {
    name: 'Snake Gourd',
    tamilName: 'புடலங்காய்',
    price: 40,
    unit: 'kg',
    emoji: '🥒',
    categorySlug: 'gourds',
    imageUrl: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=80',
    description: 'Fresh light green snake gourd for nourishing south Indian kootu.',
    isPopular: false,
    discount: 0,
  },
  {
    name: 'Beetroot',
    tamilName: 'பீட்ரூட்',
    price: 45,
    unit: 'kg',
    emoji: '🟣',
    categorySlug: 'root-vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=500&auto=format&fit=crop&q=80',
    description: 'Vibrant ruby red beetroots rich in iron and natural sweetness.',
    isPopular: false,
    discount: 5,
  },
  {
    name: 'White Radish',
    tamilName: 'முள்ளங்கி',
    price: 35,
    unit: 'kg',
    emoji: '⚪',
    categorySlug: 'root-vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80',
    description: 'Crisp, spicy white radishes perfect for sambar and parathas.',
    isPopular: false,
    discount: 0,
  },
  {
    name: 'Palak (Spinach)',
    tamilName: 'பசலைக்கீரை',
    price: 25,
    unit: 'bunch',
    emoji: '🥬',
    categorySlug: 'leafy-greens',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80',
    description: 'Tender washed green spinach bunches bursting with iron.',
    isPopular: true,
    discount: 0,
  },
  {
    name: 'Fresh Coriander',
    tamilName: 'கொத்தமல்லி',
    price: 15,
    unit: 'bunch',
    emoji: '🌿',
    categorySlug: 'leafy-greens',
    imageUrl: 'https://images.unsplash.com/photo-1589135233689-d56d812328bb?w=500&auto=format&fit=crop&q=80',
    description: 'Fragrant freshly cut coriander leaves for garnishing and chutney.',
    isPopular: true,
    discount: 0,
  },
  {
    name: 'Curry Leaves',
    tamilName: 'கறிவேப்பிலை',
    price: 10,
    unit: 'bunch',
    emoji: '🍃',
    categorySlug: 'leafy-greens',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    description: 'Intensely aromatic fresh curry leaves, a south Indian kitchen must-have.',
    isPopular: false,
    discount: 0,
  },
  {
    name: 'Spicy Green Chilli',
    tamilName: 'பச்சை மிளகாய்',
    price: 60,
    unit: 'kg',
    emoji: '🌶️',
    categorySlug: 'daily-essentials',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80',
    description: 'Fiery, sharp green chillies to add authentic kick to dishes.',
    isPopular: true,
    discount: 0,
  },
  {
    name: 'Fresh Ginger',
    tamilName: 'இஞ்சி',
    price: 120,
    unit: 'kg',
    emoji: '🫚',
    categorySlug: 'daily-essentials',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    description: 'Juicy, zesty ginger roots for morning tea and rich curries.',
    isPopular: true,
    discount: 0,
  },
  {
    name: 'Country Garlic',
    tamilName: 'நாட்டு பூண்டு',
    price: 180,
    unit: 'kg',
    emoji: '🧄',
    categorySlug: 'daily-essentials',
    imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&auto=format&fit=crop&q=80',
    description: 'Robust small garlic pods loaded with allicin and strong punchy aroma.',
    isPopular: true,
    discount: 5,
  },
  {
    name: 'Juicy Yellow Lemon',
    tamilName: 'எலுமிச்சை',
    price: 5,
    unit: 'piece',
    emoji: '🍋',
    categorySlug: 'fruits-vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&auto=format&fit=crop&q=80',
    description: 'Plump ripe lemons full of refreshing juice and Vitamin C.',
    isPopular: true,
    discount: 0,
  },
  {
    name: 'Fresh Pollachi Coconut',
    tamilName: 'பொள்ளாச்சி தேங்காய்',
    price: 35,
    unit: 'piece',
    emoji: '🥥',
    categorySlug: 'daily-essentials',
    imageUrl: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=500&auto=format&fit=crop&q=80',
    description: 'Sweet thick flesh Pollachi coconuts full of natural coconut water.',
    isPopular: true,
    discount: 0,
  },
];

async function seed() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.order.deleteMany({});

  console.log('📦 Creating categories...');
  const categoryMap = new Map<string, string>();

  for (const cat of defaultCategories) {
    const created = await prisma.category.create({
      data: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }

  console.log('🥬 Adding 25 fresh Tamil vegetables with Cloudflare/CDN image URLs...');
  for (const veg of initialVegetables) {
    const categoryId = categoryMap.get(veg.categorySlug);
    if (!categoryId) continue;

    await prisma.product.create({
      data: {
        name: veg.name,
        tamilName: veg.tamilName,
        price: veg.price,
        unit: veg.unit,
        imageUrl: veg.imageUrl, // Stored as direct URL!
        emoji: veg.emoji,
        description: veg.description,
        isPopular: veg.isPopular,
        discount: veg.discount,
        categoryId,
      },
    });
  }

  // Create 2 sample orders
  console.log('🛍️ Adding sample customer orders...');
  const sampleProducts = await prisma.product.findMany({ take: 3 });
  if (sampleProducts.length >= 2) {
    await prisma.order.create({
      data: {
        customerName: 'Karthik Raja',
        customerPhone: '+91 98765 43210',
        customerAddress: 'No 45, Gandhi Street, T.Nagar, Chennai',
        notes: 'Please deliver before 8 AM',
        status: 'pending',
        total: sampleProducts[0].price * 2 + sampleProducts[1].price,
        items: JSON.stringify([
          { product: sampleProducts[0], quantity: 2, weight: 1000 },
          { product: sampleProducts[1], quantity: 1, weight: 500 },
        ]),
      },
    });

    await prisma.order.create({
      data: {
        customerName: 'Meena Sundaram',
        customerPhone: '+91 98765 43211',
        customerAddress: 'Flat 3B, Green Meadows, Anna Nagar, Chennai',
        status: 'preparing',
        total: sampleProducts[1].price * 3,
        items: JSON.stringify([
          { product: sampleProducts[1], quantity: 3, weight: 1000 },
        ]),
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
