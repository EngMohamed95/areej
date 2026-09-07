const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const catalogTsPath = path.join(root, 'src', 'meatportCatalog.ts');
const arDescPath = path.join(__dirname, 'product-descriptions-ar.json');
const imagesPath = path.join(__dirname, 'product-images.json');
const dumpPath = path.join(root, 'public', 'tenants', 'meatport', 'database_dump.json');

// Read existing descriptions and images
const arDesc = JSON.parse(fs.readFileSync(arDescPath, 'utf8'));
const images = JSON.parse(fs.readFileSync(imagesPath, 'utf8'));

// 1. Categories definition with improved names and display orders matching the latest Google Sheet
const categories = [
  {
    id: 'c-mp-meat-port-menu',
    tenantId: 't-1',
    nameEn: 'Starters & Soups',
    nameAr: 'المقبلات والشوربات',
    descriptionEn: 'Authentic Turkish soups, carpaccio, tartar, and traditional starters',
    descriptionAr: 'شوربات ومقبلات تركية أصلية وفاخرة وكارباتشيو وتارتار ومخللات',
    displayOrder: 1,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-hot-appetizers',
    tenantId: 't-1',
    nameEn: 'Hot Appetizers',
    nameAr: 'مقبلات ساخنة',
    descriptionEn: 'Freshly baked pides, stuffed eggplants, and crispy Turkish kibbeh',
    descriptionAr: 'فطائر بيدا طازجة، باذنجان مجفف محشي، وكبة برغل مقلية ومقرمشة',
    displayOrder: 2,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-mezes',
    tenantId: 't-1',
    nameEn: 'Cold Appetizers & Mezes',
    nameAr: 'مقبلات باردة (مازات)',
    descriptionEn: 'Traditional cold mezes, creamy hummus, mutabbal, and smoked dips',
    descriptionAr: 'مازات تركية وشرقية باردة، حمص كريمي، متبل باذنجان مدخن، وحيدري',
    displayOrder: 3,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-salads',
    tenantId: 't-1',
    nameEn: 'Salads',
    nameAr: 'سلطات',
    descriptionEn: 'Crisp seasonal salads, fresh burrata, gavurdagi, and fattoush',
    descriptionAr: 'سلطات موسمية طازجة، جبنة بوراتا، سلطة غافورداغي، وسلطة فتوش',
    displayOrder: 4,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-steaks',
    tenantId: 't-1',
    nameEn: 'Steaks',
    nameAr: 'ستيك',
    descriptionEn: 'Dry-aged prime cuts, Florentina, Tomahawk, and tenderloin steaks',
    descriptionAr: 'شرائح ستيك معتقة وفاخرة، فلورنتينا، توماهوك، وبورترهاوس مشوي على الفحم',
    displayOrder: 5,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-kebabs',
    tenantId: 't-1',
    nameEn: 'Kebabs',
    nameAr: 'كباب ومشاوي',
    descriptionEn: 'Handmade Turkish kebabs, Adana, Urfa, Pistachio, and Meter Kebab',
    descriptionAr: 'كباب تركي يدوي، أضنة، أورفا، كباب بالفستق، وكباب المتر الفاخر',
    displayOrder: 6,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-specials',
    tenantId: 't-1',
    nameEn: 'Specials',
    nameAr: 'أطباق الشيف الخاصة',
    descriptionEn: 'Slow-cooked lamb tandoor, salt-baked shanks, and premium lamb cuts',
    descriptionAr: 'تندور غنم مطهو ببطء، موزات غنم مطهوة بالملح، وأطباق اللحم الاستثنائية',
    displayOrder: 7,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-meats',
    tenantId: 't-1',
    nameEn: 'Meats & Cuts',
    nameAr: 'لحوم وريش غنم',
    descriptionEn: 'Tender lamb chops, ribs, liver, shish, and mixed grill platters',
    descriptionAr: 'ريش غنم طرية، ضلوع، كبدة، شيش، وأطباق المشاوي المشكلة',
    displayOrder: 8,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-meatballs',
    tenantId: 't-1',
    nameEn: 'Meatballs',
    nameAr: 'كرات اللحم والكفتة',
    descriptionEn: 'Chef Oktay signature meatballs stuffed with Kashar cheese',
    descriptionAr: 'كرات لحم الشيف أوكتاي الشهيرة المحشوة بجبنة القشقوان الذائبة',
    displayOrder: 9,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-shawarmas',
    tenantId: 't-1',
    nameEn: 'Shawarmas & Doner',
    nameAr: 'شاورما ودونر',
    descriptionEn: 'Authentic Turkish beef doner platters, sandwiches, and Iskender kebab',
    descriptionAr: 'شاورما ودونر لحم تركي أصيل، ساندوتشات، راب، وكباب إسكندر الشهير',
    displayOrder: 10,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-burgers',
    tenantId: 't-1',
    nameEn: 'Burgers',
    nameAr: 'برجر الذواقة',
    descriptionEn: 'Brioche gourmet burgers, smoked beef, truffle mayo, and aged cheese',
    descriptionAr: 'برجر ذواقة في خبز البريوش، لحم بقري مدخن، صوص الترافل وجبنة معتقة',
    displayOrder: 11,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-sauces',
    tenantId: 't-1',
    nameEn: 'Sauces',
    nameAr: 'الصلصات والصوصات',
    descriptionEn: 'Homemade Demi-Glace, Cafe de Paris, Cheddar cheese, and Pepper sauces',
    descriptionAr: 'صلصات محضرة يدوياً: ديمي جلاس، زبدة كافيه دي باريس، شيدر، وفلفل أسود',
    displayOrder: 12,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-desserts',
    tenantId: 't-1',
    nameEn: 'Desserts',
    nameAr: 'حلويات تركية',
    descriptionEn: 'Handcrafted pistachios baklavas, warm Katmer, Kunefe, and desserts',
    descriptionAr: 'بقلاوة تركية فاخرة بالفستق والجوز، كاتمر مقرمش، كنافة، وسوفليه الشوكولاتة',
    displayOrder: 13,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-drinks',
    tenantId: 't-1',
    nameEn: 'Drinks & Fresh Juices',
    nameAr: 'مشروبات وعصائر طازجة',
    descriptionEn: 'Fresh squeezed pomegranate, orange, lemon mint, sodas, and Turkish ayran',
    descriptionAr: 'عصائر طازجة: رمان، برتقال، تفاح أخضر، ليمونادة، مياه شرب، وعيران تركي',
    displayOrder: 14,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop&q=80'
  }
];

// Read existing meatportCatalog.ts to preserve unmodified products exactly
const existingCatalog = fs.readFileSync(catalogTsPath, 'utf8');

// Parse raw products from meatportCatalog.ts
const prodRegex = /{\s*id:\s*'(mp-p-[^']+)'[\s\S]*?tenantId:\s*'t-1'[\s\S]*?categoryId:\s*'([^']+)'[\s\S]*?nameEn:\s*'([^']+)'[\s\S]*?nameAr:\s*'([^']+)'[\s\S]*?descriptionEn:\s*'([^']*)'[\s\S]*?descriptionAr:\s*'([^']*)'[\s\S]*?price:\s*([\d.]+)[\s\S]*?costPrice:\s*([\d.]+)[\s\S]*?profit:\s*([\d.]+)[\s\S]*?margin:\s*([\d.]+)[\s\S]*?calories:\s*(\d+|null)[\s\S]*?preparationTime:\s*(\d+)[\s\S]*?sku:\s*'([^']+)'[\s\S]*?imageUrl:\s*('[^']+'|null)[\s\S]*?allergens:\s*\[([\s\S]*?)\]/g;

// Now let's build the definitive updated products array
// We'll write an explicit list of all products in order of categories
console.log('Categories count:', categories.length);
