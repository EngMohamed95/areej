const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const catalogTsPath = path.join(root, 'src', 'meatportCatalog.ts');
const arDescPath = path.join(__dirname, 'product-descriptions-ar.json');
const imagesPath = path.join(__dirname, 'product-images.json');
const dumpPath = path.join(root, 'public', 'tenants', 'meatport', 'database_dump.json');

const arDesc = JSON.parse(fs.readFileSync(arDescPath, 'utf8'));
const images = JSON.parse(fs.readFileSync(imagesPath, 'utf8'));

// The 11 categories ordered exactly as requested by the user:
// 1. كل الوجبات (Virtual "All" in UI)
// 2. السلطات
// 3. مقبلات باردة
// 4. مقبلات ساخنة
// 5. كباب ودجاج
// 6. اللحوم وكرات اللحم
// 7. اطباق خاصة وقائمة ميت بورت
// 8. شاورما وبرجر
// 9. ستيك
// 10. صوصات
// 11. حلويات
// 12. مشروبات
const categories = [
  {
    id: 'c-mp-salads',
    tenantId: 't-1',
    nameEn: 'Salads',
    nameAr: 'السلطات',
    descriptionEn: 'Crisp seasonal salads, fresh burrata, gavurdagi, and fattoush',
    descriptionAr: 'سلطات موسمية طازجة، جبنة بوراتا، سلطة غافورداغي، وسلطة فتوش',
    displayOrder: 1,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-mezes',
    tenantId: 't-1',
    nameEn: 'Cold Appetizers',
    nameAr: 'مقبلات باردة',
    descriptionEn: 'Traditional cold mezes, creamy hummus, mutabbal, and smoked dips',
    descriptionAr: 'مازات تركية وشرقية باردة، حمص كريمي، متبل باذنجان مدخن، وحيدري',
    displayOrder: 2,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-hot-appetizers',
    tenantId: 't-1',
    nameEn: 'Hot Appetizers',
    nameAr: 'مقبلات ساخنة',
    descriptionEn: 'Freshly baked pides, stuffed eggplants, and crispy Turkish kibbeh',
    descriptionAr: 'فطائر بيدا طازجة، باذنجان مجفف محشي، وكبة برغل مقلية ومقرمشة',
    displayOrder: 3,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-kebabs',
    tenantId: 't-1',
    nameEn: 'Kebabs & Chicken',
    nameAr: 'كباب ودجاج',
    descriptionEn: 'Handmade Turkish kebabs, Adana, Urfa, Pistachio, and grilled chicken',
    descriptionAr: 'كباب تركي يدوي، أضنة، أورفا، كباب بالفستق، وشيش ودجاج مشوي',
    displayOrder: 4,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-meats',
    tenantId: 't-1',
    nameEn: 'Meats & Meatballs',
    nameAr: 'اللحوم وكرات اللحم',
    descriptionEn: 'Tender lamb chops, ribs, liver, shish, mixed grills, and stuffed meatballs',
    descriptionAr: 'ريش غنم، ضلوع، كبدة، مشاوي مشكلة، وكرات لحم الشيف المحشوة بالجبن',
    displayOrder: 5,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-specials',
    tenantId: 't-1',
    nameEn: 'Specials & Meat Port Menu',
    nameAr: 'اطباق خاصة وقائمة ميت بورت',
    descriptionEn: 'Slow-cooked lamb tandoor, salt-baked shanks, authentic Turkish soups, and carpaccio',
    descriptionAr: 'تندور غنم مطهو ببطء، موزات بالملح، شوربات تركية، كارباتشيو وتارتار',
    displayOrder: 6,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-shawarmas',
    tenantId: 't-1',
    nameEn: 'Shawarma & Burgers',
    nameAr: 'شاورما وبرجر',
    descriptionEn: 'Turkish beef doner platters, Iskender kebab, sandwiches, and brioche burgers',
    descriptionAr: 'شاورما ودونر لحم، كباب إسكندر، راب، وبرجر الذواقة في خبز البريوش',
    displayOrder: 7,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-steaks',
    tenantId: 't-1',
    nameEn: 'Steaks',
    nameAr: 'ستيك',
    descriptionEn: 'Dry-aged prime cuts, Florentina, Tomahawk, and tenderloin steaks',
    descriptionAr: 'شرائح ستيك معتقة وفاخرة، فلورنتينا، توماهوك، وبورترهاوس مشوي على الفحم',
    displayOrder: 8,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-sauces',
    tenantId: 't-1',
    nameEn: 'Sauces',
    nameAr: 'صوصات',
    descriptionEn: 'Homemade Demi-Glace, Cafe de Paris, Cheddar cheese, and Pepper sauces',
    descriptionAr: 'صلصات محضرة يدوياً: ديمي جلاس، زبدة كافيه دي باريس، شيدر، وفلفل أسود',
    displayOrder: 9,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-desserts',
    tenantId: 't-1',
    nameEn: 'Desserts',
    nameAr: 'حلويات',
    descriptionEn: 'Handcrafted pistachios baklavas, warm Katmer, Kunefe, and desserts',
    descriptionAr: 'بقلاوة تركية فاخرة بالفستق والجوز، كاتمر مقرمش، كنافة، وسوفليه الشوكولاتة',
    displayOrder: 10,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'c-mp-drinks',
    tenantId: 't-1',
    nameEn: 'Drinks',
    nameAr: 'مشروبات',
    descriptionEn: 'Fresh squeezed pomegranate, orange, lemon mint, sodas, and Turkish ayran',
    descriptionAr: 'عصائر طازجة: رمان، برتقال، تفاح أخضر، ليمونادة، مياه شرب، وعيران تركي',
    displayOrder: 11,
    isVisible: true,
    parentId: null,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop&q=80'
  }
];

function makeProduct({
  id,
  categoryId,
  nameEn,
  nameAr,
  descriptionEn,
  descriptionAr,
  price,
  calories,
  allergens = [],
  imageUrl,
  displayOrder,
  sizes
}) {
  const costPrice = Math.round(price * 0.4 * 100) / 100;
  const profit = Math.round((price - costPrice) * 100) / 100;
  const margin = price > 0 ? Math.round((profit / price) * 1000) / 10 : 0;
  const sku = id.replace('mp-p-', 'MP-').toUpperCase();

  const productSizes = sizes || [
    {
      id: `size-${id}-regular`,
      nameEn: 'Regular',
      nameAr: 'عادي',
      priceDifference: 0,
      calories: 0,
      sku: `${sku}-REG`
    }
  ];

  return {
    id,
    tenantId: 't-1',
    categoryId,
    subCategoryId: null,
    nameEn,
    nameAr,
    descriptionEn,
    descriptionAr,
    price,
    costPrice,
    profit,
    margin,
    calories,
    preparationTime: 15,
    sku,
    barcode: null,
    imageUrl: imageUrl || images[id] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=450&fit=crop&q=80',
    videoUrl: null,
    displayOrder,
    isVisible: true,
    isFeatured: displayOrder <= 2,
    isRecommended: displayOrder <= 4,
    isPopular: displayOrder <= 4,
    trackStock: false,
    stockQuantity: 0,
    recipeLink: null,
    allergens,
    nutrition: null,
    modifierGroupIds: [],
    sizes: productSizes,
    taxRate: 0.15,
    discountRate: 0
  };
}

const products = [];

// ==========================================
// 1. السلطات (c-mp-salads)
// ==========================================
products.push(makeProduct({
  id: 'mp-p-057',
  categoryId: 'c-mp-salads',
  nameEn: 'CHEESE SALAD',
  nameAr: 'سلطة جبنة',
  descriptionEn: 'Special cheese 15 gr. Iceberg 50 gr. tomato 60 gr. cucumber 50 gr. red onion 15 gr. parsley 5 gr. olive oil 15 gr. lemon juice 5 ml. salt 2 gr.',
  descriptionAr: 'سلطة جبنة: جبنة خاصة 15 جرام، خس آيسبرغ 50 جرام، طماطم 60 جرام، خيار 50 جرام، بصل أحمر 15 جرام، بقدونس 5 جرام، زيت زيتون 15 جرام، عصير ليمون 5 مل، ملح 2 جرام.',
  price: 19,
  calories: 170,
  allergens: [],
  displayOrder: 1
}));

products.push(makeProduct({
  id: 'mp-p-058',
  categoryId: 'c-mp-salads',
  nameEn: 'BURRETA SALAD',
  nameAr: 'سلطة بوراتا',
  descriptionEn: '300g fresh Italian burrata ball served over cherry tomatoes, baby arugula, pesto and balsamic glaze.',
  descriptionAr: 'سلطة بوراتا: جبنة بوراتا طازجة 300 جرام تقدم مع الطماطم الكرزية والجرجير وزيت الزيتون والخل البلسمي.',
  price: 45,
  calories: 480,
  allergens: ['Milk'],
  displayOrder: 2
}));

products.push(makeProduct({
  id: 'mp-p-059',
  categoryId: 'c-mp-salads',
  nameEn: 'TABOULEH SALAD',
  nameAr: 'سلطة تبولة',
  descriptionEn: 'Fresh chopped parsley, tomatoes, mint, cracked bulgur wheat, seasoned with extra virgin olive oil and lemon.',
  descriptionAr: 'سلطة تبولة: بقدونس طازج مفروم مع الطماطم والنعناع والبرغل الناعم وزيت الزيتون وعصير الليمون.',
  price: 15,
  calories: 270,
  allergens: ['Gluten'],
  displayOrder: 3
}));

products.push(makeProduct({
  id: 'mp-p-060',
  categoryId: 'c-mp-salads',
  nameEn: 'CEASER SALAD',
  nameAr: 'سلطة سيزر',
  descriptionEn: 'Romaine lettuce 120g, grilled chicken 120g, parmesan 30g, croutons 40g, Caesar dressing 40g.',
  descriptionAr: 'سلطة سيزر: خس روماني 120 جرام، دجاج مشوي 120 جرام، جبنة بارميزان 30 جرام، كروتون 40 جرام، صوص سيزر 40 جرام.',
  price: 45,
  calories: 610,
  allergens: ['Gluten', 'Milk', 'Egg', 'Mustard'],
  displayOrder: 4
}));

products.push(makeProduct({
  id: 'mp-p-061',
  categoryId: 'c-mp-salads',
  nameEn: 'GAVURDAGI SALAD',
  nameAr: 'سلطة غافورداغي',
  descriptionEn: 'Diced tomatoes, cucumbers, walnuts, parsley, onions, tossed with sweet pomegranate molasses and olive oil.',
  descriptionAr: 'سلطة غافورداغي: مكعبات طماطم وخيار ناعمة مع الجوز المقرمش ودبس الرمان وزيت الزيتون البكر.',
  price: 29,
  calories: 330,
  allergens: ['Walnut'],
  displayOrder: 5
}));

products.push(makeProduct({
  id: 'mp-p-062',
  categoryId: 'c-mp-salads',
  nameEn: 'ICEBERG Lettuce Salad',
  nameAr: 'سلطة خس آيسبرغ',
  descriptionEn: 'Crisp iceberg lettuce with cucumbers, cherry tomatoes, and light lemon herb vinaigrette.',
  descriptionAr: 'سلطة خس آيسبرغ مقرمش مع الخيار والطماطم الكرزية وتتبيلة الليمون وزيت الزيتون الخفيفة.',
  price: 19,
  calories: 165,
  allergens: [],
  displayOrder: 6
}));

products.push(makeProduct({
  id: 'mp-p-063',
  categoryId: 'c-mp-salads',
  nameEn: 'QUINOA SALAD',
  nameAr: 'سلطة كينوا',
  descriptionEn: 'Organic quinoa 280g with mixed garden greens, pomegranate seeds, avocado, and citrus vinaigrette.',
  descriptionAr: 'سلطة كينوا عضوية 280 جرام مع الخضار الورقية وحبوب الرمان والأفوكادو وتتبيلة الحمضيات.',
  price: 34,
  calories: 360,
  allergens: [],
  displayOrder: 7
}));

products.push(makeProduct({
  id: 'mp-p-064',
  categoryId: 'c-mp-salads',
  nameEn: "SHEPHERD'S SALAD",
  nameAr: 'سلطة الراعي',
  descriptionEn: 'Tomato 120g, cucumber 80g, green pepper 40g, onion 30g, parsley 10g, olive oil, lemon juice.',
  descriptionAr: 'سلطة الراعي: طماطم 120 جرام، خيار 80 جرام، فلفل أخضر 40 جرام، بصل 30 جرام، بقدونس 10 جرام مع زيت الزيتون والليمون.',
  price: 22,
  calories: 180,
  allergens: [],
  displayOrder: 8
}));

products.push(makeProduct({
  id: 'mp-p-new-fattoush',
  categoryId: 'c-mp-salads',
  nameEn: 'FATTOUSH SALAD',
  nameAr: 'سلطة فتوش',
  descriptionEn: 'Tomato 80g, cucumber 60g, lettuce 50g, radish 20g, green onion 10g, parsley, fresh mint 5g, crispy pita bread, olive oil 15g, fresh lemon juice 15g, pomegranate molasses, sumac 2g, garlic 2g.',
  descriptionAr: 'سلطة فتوش طازجة مع الخيار، الطماطم، الخس، الفجل، النعناع، والخبز المقرمش مع تتبيلة زيت الزيتون ودبس الرمان والسماق والثوم.',
  price: 19,
  calories: 190,
  allergens: ['Gluten'],
  imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=450&fit=crop&q=80',
  displayOrder: 9
}));

// ==========================================
// 2. مقبلات باردة (c-mp-mezes)
// ==========================================
products.push(makeProduct({
  id: 'mp-p-041',
  categoryId: 'c-mp-mezes',
  nameEn: 'HUMMUS',
  nameAr: 'حمص',
  descriptionEn: 'Chickpeas 100 gr. Tahini 25 gr. Olive oil 15 gr. Lemon juice 8 ml. Garlic 3 gr. Salt 2 gr',
  descriptionAr: 'حمص 100 جرام، طحينة 25 جرام، زيت زيتون 15 جرام، عصير ليمون 8 مل، ثوم 3 جرام، ملح 2 جرام.',
  price: 15,
  calories: 220,
  allergens: ['Sesame'],
  displayOrder: 1
}));

products.push(makeProduct({
  id: 'mp-p-042',
  categoryId: 'c-mp-mezes',
  nameEn: 'MOUTTEBEL (Smoked Eggplant Dip)',
  nameAr: 'متبل باذنجان مدخن',
  descriptionEn: 'Grill Eggplant 100 gr. Tahini 20 gr. Yogurt 20 gr. Olive oil 8 gr. Lemon juice 5 gr. Garlic 5 gr. salt 2 gr',
  descriptionAr: 'متبل باذنجان مشوي 100 جرام، طحينة 20 جرام، زبادي 20 جرام، زيت زيتون 8 جرام، عصير ليمون 5 جرام، ثوم 5 جرام، ملح 2 جرام.',
  price: 16,
  calories: 220,
  allergens: ['Sesame'],
  displayOrder: 2
}));

products.push(makeProduct({
  id: 'mp-p-043',
  categoryId: 'c-mp-mezes',
  nameEn: 'AVOCADO MASH',
  nameAr: 'مهروس أفوكادو',
  descriptionEn: 'Avocado 130 gr. Olive Oil 10 gr. Lemon juice 8 gr. Salt 2 gr. Black pepper 2 gr.',
  descriptionAr: 'أفوكادو 130 جرام، زيت زيتون 10 جرام، عصير ليمون 8 جرام، ملح 2 جرام، فلفل أسود 2 جرام.',
  price: 29,
  calories: 250,
  allergens: [],
  displayOrder: 3
}));

products.push(makeProduct({
  id: 'mp-p-044',
  categoryId: 'c-mp-mezes',
  nameEn: 'SPINACH BORANI',
  nameAr: 'بوراني سبانخ',
  descriptionEn: 'Spinach 80 gr. Strained yogurt 60 gr. Garlic 3 gr. Olive Oil 8 gr. Salt 2 gr. onion 30 gr. spices 5 gr.',
  descriptionAr: 'سبانخ 80 جرام، زبادي مصفى 60 جرام، ثوم 3 جرام، زيت زيتون 8 جرام، ملح 2 جرام، بصل 30 جرام، بهارات 5 جرام.',
  price: 15,
  calories: 165,
  allergens: ['Milk'],
  displayOrder: 4
}));

products.push(makeProduct({
  id: 'mp-p-045',
  categoryId: 'c-mp-mezes',
  nameEn: 'ATOM (Yoghurt with Hot Butter & Chili)',
  nameAr: 'أتوم زبادي بالزبدة الحارة',
  descriptionEn: 'Strained yogurt 100 grams. Butter 30 grams. dRY Pepper 3 grams. Garlic 3 grams. Salt 2 gr. eggplant 50 grams. tahini 5 gr.',
  descriptionAr: 'أتوم زبادي مصفى بالزبدة الحارة 100 جرام، زبدة 30 جرام، فلفل جاف 3 جرام، ثوم 3 جرام، ملح 2 جرام، باذنجان 50 جرام، طحينة 5 جرام.',
  price: 19,
  calories: 220,
  allergens: ['Milk'],
  displayOrder: 5
}));

products.push(makeProduct({
  id: 'mp-p-046',
  categoryId: 'c-mp-mezes',
  nameEn: 'SPICY PUREE',
  nameAr: 'بيوريه حار',
  descriptionEn: 'Tomato 90 gr. Red pepper 25 gr. Onion 15 gr. Maydonoz 10 gr. Pomegranade molasses 5 gr. İsot 2 gr salt 2gr.',
  descriptionAr: 'بيوريه حار: طماطم 90 جرام، فلفل أحمر 25 جرام، بصل 15 جرام، بقدونس 10 جرام، دبس رمان 5 جرام، فلفل إيسوت 2 جرام، ملح 2 جرام.',
  price: 15,
  calories: 120,
  allergens: [],
  displayOrder: 6
}));

products.push(makeProduct({
  id: 'mp-p-047',
  categoryId: 'c-mp-mezes',
  nameEn: 'MUHAMMARA',
  nameAr: 'محمرة',
  descriptionEn: 'Red bell pepper 800 gr. Walnut 35 gr. Breadcrumbs 20 gr. Olive oil 10 gr. Pomegranade molasses, Garlic.',
  descriptionAr: 'محمرة: فلفل أحمر حلو 800 جرام، جوز 35 جرام، بقسماط 20 جرام، زيت زيتون 10 جرام، دبس رمان، ثوم.',
  price: 24,
  calories: 310,
  allergens: ['Walnut', 'Gluten'],
  displayOrder: 7
}));

products.push(makeProduct({
  id: 'mp-p-048',
  categoryId: 'c-mp-mezes',
  nameEn: 'SHAKSHOUKA',
  nameAr: 'شكشوكة تركية بالخضار',
  descriptionEn: 'Tomato 80 gr. Pepper 40 gr. Onion 25 gr. Egg 1 piece 50 gr., Olive oil 10 gr. Spice.',
  descriptionAr: 'شكشوكة: طماطم 80 جرام، فلفل 40 جرام، بصل 25 جرام، بيض قطعة واحدة 50 جرام، زيت زيتون 10 جرام، بهارات.',
  price: 19,
  calories: 190,
  allergens: ['Egg'],
  displayOrder: 8
}));

products.push(makeProduct({
  id: 'mp-p-049',
  categoryId: 'c-mp-mezes',
  nameEn: 'STUFFED VINE LEAVES',
  nameAr: 'ورق عنب محشي',
  descriptionEn: 'Spinach 60 gr. Rice 50 gr. Onion 20 gr. Olive oil 15 gr. Parsley dill, mint.',
  descriptionAr: 'ورق عنب محشي: سبانخ 60 جرام، أرز 50 جرام، بصل 20 جرام، زيت زيتون 15 جرام، بقدونس، شبت، نعناع.',
  price: 20,
  calories: 240,
  allergens: [],
  displayOrder: 9
}));

products.push(makeProduct({
  id: 'mp-p-050',
  categoryId: 'c-mp-mezes',
  nameEn: 'HAYDARI',
  nameAr: 'حيدري زبادي مصفى بالثوم',
  descriptionEn: 'Strained Yogurt 150 gr. Garlic 3 gr. Olive oil 5 gr. Salt 2 gr.',
  descriptionAr: 'حيدري زبادي مصفى بالثوم 150 جرام، ثوم 3 جرام، زيت زيتون 5 جرام، ملح 2 جرام.',
  price: 18,
  calories: 165,
  allergens: ['Milk'],
  displayOrder: 10
}));

// ==========================================
// 3. مقبلات ساخنة (c-mp-hot-appetizers)
// ==========================================
products.push(makeProduct({
  id: 'mp-p-051',
  categoryId: 'c-mp-hot-appetizers',
  nameEn: 'STUFFED DRIED EGGPLANT',
  nameAr: 'باذنجان مجفف محشي',
  descriptionEn: 'Dried Eggplant 80 gr., Rice 50 gr. Bulgur 20 gr. beef meat 40 gr. Onion 30 gr. Tomato paste 15 gr. red sweet pepper paste 10 gr. Olive oil 20 ml. spice 5 gr. salt 3 gr. garlic 5 gr.',
  descriptionAr: 'باذنجان مجفف محشي: باذنجان مجفف 80 جرام، أرز 50 جرام، برغل 20 جرام، لحم بقري 40 جرام، بصل 30 جرام، معجون طماطم 15 جرام، معجون فلفل أحمر حلو 10 جرام، زيت زيتون 20 مل، بهارات 5 جرام، ملح 3 جرام، ثوم 5 جرام.',
  price: 20,
  calories: 420,
  allergens: ['Gluten', 'Milk'],
  displayOrder: 1
}));

products.push(makeProduct({
  id: 'mp-p-052',
  categoryId: 'c-mp-hot-appetizers',
  nameEn: 'FRIED BULGUR MEATBALLS',
  nameAr: 'كبة برغل مقلية',
  descriptionEn: 'Fine bulgur 45g, flour 10g, semolina 15g, minced beef, onion 35g, walnut 15g, butter 10g, spices.',
  descriptionAr: 'كبة برغل مقلية: برغل ناعم 45 جرام، دقيق 10 جرام، سميد 15 جرام، لحم بقري، بصل 35 جرام، جوز 15 جرام، زبدة 10 جرام، بهارات 10 جرام، زيت قلي.',
  price: 16,
  calories: 280,
  allergens: ['Gluten', 'Egg', 'Milk', 'Soybean'],
  displayOrder: 2
}));

products.push(makeProduct({
  id: 'mp-p-053',
  categoryId: 'c-mp-hot-appetizers',
  nameEn: 'FRENCH FRIES',
  nameAr: 'بطاطس مقلية',
  descriptionEn: '220g golden crispy salted French fries.',
  descriptionAr: 'بطاطس مقلية: بطاطس مقرمشة ذهبية 220 جرام متبلة بالملح.',
  price: 20,
  calories: 560,
  allergens: [],
  displayOrder: 3
}));

products.push(makeProduct({
  id: 'mp-p-054',
  categoryId: 'c-mp-hot-appetizers',
  nameEn: 'ANTEP LAHMACUN',
  nameAr: 'لحم بعجين عنتابي',
  descriptionEn: 'Crispy Turkish flatbread topped with finely minced beef, peppers, garlic, and fresh herbs.',
  descriptionAr: 'لحم بعجين عنتابي: عجينة رقيقة مقرمشة تعلوها خلطة لحم مفروم بالبصل والطماطم والفلفل والتوابل التركية.',
  price: 25,
  calories: 470,
  allergens: ['Gluten'],
  displayOrder: 4
}));

products.push(makeProduct({
  id: 'mp-p-055',
  categoryId: 'c-mp-hot-appetizers',
  nameEn: 'With KHASAR CHEESE Pide',
  nameAr: 'بيدا بجبنة قشقوان',
  descriptionEn: 'Traditional Turkish baked pide loaded with melted Kashar cheese and rich butter.',
  descriptionAr: 'فطيرة بيدا تركية طازجة محشوة بجبنة القشقوان الذائبة الفاخرة مع الزبدة.',
  price: 25,
  calories: 820,
  allergens: ['Gluten', 'Milk'],
  displayOrder: 5
}));

products.push(makeProduct({
  id: 'mp-p-056',
  categoryId: 'c-mp-hot-appetizers',
  nameEn: 'CUBE MEAT PIDE',
  nameAr: 'بيدا بلحم مكعبات',
  descriptionEn: 'Stone-baked Turkish boat pide filled with diced tender beef, tomatoes, and green peppers.',
  descriptionAr: 'فطيرة بيدا تركية تقليدية محشوة بمكعبات لحم بقري طري متبل مع الطماطم والفلفل الأخضر.',
  price: 35,
  calories: 760,
  allergens: ['Gluten', 'Milk'],
  displayOrder: 6
}));

// ==========================================
// 4. كباب ودجاج (c-mp-kebabs)
// ==========================================
const kebabsData = [
  { id: 'mp-p-017', nameEn: 'ADANA KEBAB', nameAr: 'كباب أضنة', price: 47, cal: 520, allergens: [], descEn: 'Kebab meat 200 gr.hot red pepper 5 gr. lamb oil 40 gr.sweet fresh red pepper 20 gr. salt 4 gr.with grill tomato.green pepper ,bulgur rice.', descAr: 'لحم كباب 200 جرام، فلفل أحمر حار 5 جرام، دهن غنم 40 جرام، فلفل أحمر طازج حلو 20 جرام، ملح 4 جرام مع طماطم مشوية، فلفل أخضر، برغل.' },
  { id: 'mp-p-018', nameEn: 'URFA KEBAB', nameAr: 'كباب أورفا', price: 47, cal: 520, allergens: [], descEn: 'Kebab meat 200 gr.sweet red pepper 4 gr.fresh sweet red pepper 20 gr.salt 4 gr.with grill tomato,green pepper,bulgur rice.', descAr: 'لحم كباب 200 جرام، فلفل أحمر حلو 4 جرام، فلفل أحمر حلو طازج 20 جرام، ملح 4 جرام مع طماطم مشوية، فلفل أخضر، برغل.' },
  { id: 'mp-p-019', nameEn: 'BEYTİ WRAP', nameAr: 'راب بيتي', price: 53, cal: 600, allergens: ['Milk', 'Gluten'], descEn: 'Garlic kebab 250 gr.red pepper spice 4 gr.yogurt 100 gr.tomato sauce 40 gr.butter 20 gr.salt 4 gr.with grill tomato,green pepper,lavash bread 150 gr.', descAr: 'كباب بالثوم 250 جرام، فلفل أحمر بهار 4 جرام، زبادي 100 جرام، صلصة طماطم 40 جرام، زبدة 20 جرام، ملح 4 جرام مع طماطم مشوية، فلفل أخضر، خبز لواش 150 جرام.' },
  { id: 'mp-p-020', nameEn: 'PISTACHIO KEBAB', nameAr: 'كباب بالفستق', price: 55, cal: 580, allergens: ['Pistachio'], descEn: '250g unspiced kebab meat, pistachio 50 gr.lamb fat 50 gr.salt 4 gr.grill tomato,green pepper,rice,lavash bread 150 gr.', descAr: '250 جرام لحم كباب بدون بهارات، فستق 50 جرام، دهن غنم 50 جرام، ملح 4 جرام، طماطم مشوية، فلفل أخضر، أرز، خبز لواش 150 جرام.' },
  { id: 'mp-p-021', nameEn: "GALATA CHEF'S KEBAB", nameAr: 'كباب شيف غلطة', price: 64, cal: 650, allergens: ['Milk'], descEn: 'Lamb and Beef meat mix 250 gr.sweet green and Khasar 10 gr.red peppers.50 gr.salt 4 gr.butter 20 gr.with tomato,green pepper.', descAr: 'مزيج لحم غنم وبقري 250 جرام مع فلفل حلو أخضر وأحمر وجبنة قشقوان والزبدة والبهارات مع طماطم وفلفل أخضر مشوي.' },
  { id: 'mp-p-022', nameEn: 'BEEF KEBAB', nameAr: 'كباب لحم بقري', price: 58, cal: 550, allergens: [], descEn: 'Beef meat 250 gr.beef fat 50 gr.salt 4 gr.with grill tomato,green pepper.', descAr: 'لحم بقري 250 جرام، دهن بقري 50 جرام، ملح 4 جرام مع طماطم مشوية، فلفل أخضر.' },
  { id: 'mp-p-023', nameEn: 'CHICKEN KEBAB', nameAr: 'كباب دجاج', price: 44, cal: 420, allergens: [], descEn: 'Chicken kebab 200 gr.lamb fat 50 gr.salt 3 gr.with grill tomato,green pepper,bulgur rice.', descAr: 'كباب دجاج 200 جرام، دهن غنم 50 جرام، ملح 3 جرام مع طماطم مشوية، فلفل أخضر، برغل.' },
  { id: 'mp-p-024', nameEn: 'KUŞLEME KEBAB (Lamb Tenderloin Kebab)', nameAr: 'كباب كوشلمة لحم غنم', price: 80, cal: 650, allergens: [], descEn: 'Lamb fillet 220 gr.olive oil 20 ml.salt 4 gr.with grill tomato,green pepper.', descAr: 'فيليه لحم غنم 220 جرام، زيت زيتون 20 مل، ملح 4 جرام مع طماطم مشوية، فلفل أخضر.' },
  { id: 'mp-p-025', nameEn: 'ALİ NAZİK KEBAB', nameAr: 'كباب علي نازك', price: 63, cal: 850, allergens: ['Milk'], descEn: 'Kebab meat 250 gr.grill eggplant 100 gr.garlic 5 gr.salt 4 gr.yogurt 100 gr.grill tomato,green pepper.', descAr: 'لحم كباب 250 جرام، باذنجان مشوي 100 جرام، ثوم 5 جرام، ملح 4 جرام، زبادي 100 جرام، طماطم وفلفل أخضر مشوي.' },
  { id: 'mp-p-026', nameEn: 'WHOLE CHICKEN', nameAr: 'دجاجة كاملة مشوية', price: 59, cal: 1050, allergens: ['Milk'], descEn: 'Whole chicken 600 gr.spices 5 gr.salt 4 gr.butter 20 gr.with green pepper,tomato,rice.', descAr: 'دجاجة كاملة 600 جرام، بهارات 5 جرام، ملح 4 جرام، زبدة 20 جرام مع فلفل أخضر، طماطم، أرز.' },
  { id: 'mp-p-027', nameEn: 'HALF CHICKEN', nameAr: 'نصف دجاجة مشوية', price: 32, cal: 600, allergens: ['Milk'], descEn: 'Half chicken 350 gr.spices 3 gr.salt 3 gr.butter 10 gr.rice 100 gr.with green pepper,tomato,rice.', descAr: 'نصف دجاجة 350 جرام، بهارات 3 جرام، ملح 3 جرام، زبدة 10 جرام، أرز 100 جرام مع فلفل أخضر، طماطم، أرز.' },
  { id: 'mp-p-028', nameEn: 'PIPE KEBAB', nameAr: 'كباب بايب', price: 276, cal: 2480, allergens: ['Milk'], descEn: 'Special meat mix 1200 gr.vegetables 200 gr.salt 15 gr.sweet spices 10 gr.butter 50 gr.with green pepper,tomato.', descAr: 'خلطة لحم خاصة 1200 جرام، خضروات 200 جرام، ملح 15 جرام، بهارات حلوة 10 جرام، زبدة 50 جرام مع فلفل أخضر، طماطم.' },
  { id: 'mp-p-029', nameEn: 'METER KEBAB', nameAr: 'كباب متر', price: 229, cal: 2200, allergens: ['Gluten'], descEn: 'Special kebab meat 850 gr.lamb fat 150 gr.sweet red pepper 50 gr.salt 10 gr.with green pepper,tomato.', descAr: 'لحم كباب خاص 850 جرام، دهن غنم 150 جرام، فلفل أحمر حلو 50 جرام، ملح 10 جرام مع فلفل أخضر، طماطم.' },
  { id: 'mp-p-030', nameEn: 'CHICKEN SHISH', nameAr: 'شيش طاووق', price: 45, cal: 490, allergens: ['Milk'], descEn: 'Chicken meat 250 gr.special sauce 50 ml.salt 4 gr.grilled tomato,green pepper 50 gr.with green pepper,tomato bulgur.', descAr: 'لحم دجاج 250 جرام، صلصة خاصة 50 مل، ملح 4 جرام، طماطم وفلفل أخضر مشوي 50 جرام مع فلفل أخضر، برغل طماطم.' },
  { id: 'mp-p-031', nameEn: 'CHICKEN WING', nameAr: 'أجنحة دجاج', price: 45, cal: 720, allergens: ['Milk'], descEn: 'Chicken wings 250 gr.salt 4 gr.special sauce 30 gr.tomato puree 10 gr.with green pepper,tomato,bulgur.', descAr: 'أجنحة دجاج 250 جرام، ملح 4 جرام، صلصة خاصة 30 جرام، بيوريه طماطم 10 جرام مع فلفل أخضر، طماطم، برغل.' }
];

kebabsData.forEach((k, idx) => {
  products.push(makeProduct({
    id: k.id,
    categoryId: 'c-mp-kebabs',
    nameEn: k.nameEn,
    nameAr: k.nameAr,
    descriptionEn: k.descEn,
    descriptionAr: k.descAr,
    price: k.price,
    calories: k.cal,
    allergens: k.allergens,
    displayOrder: idx + 1
  }));
});

// ==========================================
// 5. اللحوم وكرات اللحم (c-mp-meats)
// ==========================================
const meatsAndMeatballs = [
  { id: 'mp-p-032', nameEn: 'LAMB CHOPS', nameAr: 'ريش غنم', price: 85, cal: 720, allergens: ['Milk'], descEn: 'Lamb chops 250 gr.olive oil 10 gr. salt 3 gr.black pepper 2 gr.thyme 2 gr.butter 5 gr.with tomatto,green pepper bulgur rise', descAr: 'ريش غنم 250 جرام، زيت زيتون 10 جرام، ملح 3 جرام، فلفل أسود 2 جرام، زعتر 2 جرام، زبدة 5 جرام مع طماطم وفلفل أخضر، برغل.' },
  { id: 'mp-p-033', nameEn: 'LAMB TANDERLOIN (LOKUM İSTANBUL)', nameAr: 'لوكوم إسطنبول من لحم الغنم', price: 120, cal: 560, allergens: [], descEn: 'Lamb tenderloin .salt 10 gr black pepper 2 gr.Rosemary 2 gr.with tomatto,green pepper', descAr: 'فيليه لحم غنم طري جداً، زيت زيتون، ملح، فلفل أسود، روزماري مع طماطم وفلفل أخضر مشوي.' },
  { id: 'mp-p-034', nameEn: 'LAMB SHISH', nameAr: 'شيش غنم', price: 80, cal: 610, allergens: [], descEn: 'Lamb shish 250 gr.green pepper 40 gr.onion 20 gr.Marinasion olive oiles.with tomatto,green pepper', descAr: 'شيش غنم 250 جرام، فلفل أخضر 40 جرام، بصل 20 جرام، متبل بزيت الزيتون مع طماطم وفلفل أخضر.' },
  { id: 'mp-p-035', nameEn: 'LAMB RIBS', nameAr: 'ضلوع غنم', price: 70, cal: 980, allergens: [], descEn: 'Lamb ribs  450 gr.salt 5 gr.olive oil 10 ml. Rosemary 2 gr. thyme 2 gr.with tomatto,green pepper', descAr: 'ضلوع غنم 450 جرام، ملح 5 جرام، زيت زيتون 10 مل، روزماري 2 جرام، زعتر 2 جرام مع طماطم وفلفل أخضر.' },
  { id: 'mp-p-036', nameEn: 'LAMB LIVER', nameAr: 'كبدة غنم', price: 50, cal: 430, allergens: ['Milk'], descEn: 'Lamb liver 200 gr. onion 30 gr.butter 10 gr. salt 4 gr.with tomatto,green pepper', descAr: 'كبدة غنم 200 جرام، بصل 30 جرام، زبدة 10 جرام، ملح 4 جرام مع طماطم وفلفل أخضر.' },
  { id: 'mp-p-037', nameEn: 'LAMB RACK', nameAr: 'راك غنم', price: 189, cal: 890, allergens: ['Milk'], descEn: 'Lamb rack 320 gr.butter 10 gr.garlic 5 gr. rosemary 2 gr. salt 3 gr. black pepper 2 gr.with tomatto,green pepper', descAr: 'ريش غنم (راك) 320 جرام، زبدة 10 جرام، ثوم 5 جرام، روزماري 2 جرام، ملح 3 جرام، فلفل أسود 2 جرام مع طماطم وفلفل أخضر.' },
  { id: 'mp-p-038', nameEn: 'LAMB CROWN (TAÇ) Crown with Butter', nameAr: 'تاج غنم بالزبدة', price: 169, cal: 1180, allergens: ['Milk'], descEn: 'Lamb crown 350 gr. butter 30 gr.garlic 3 gr. salt 3 gr. rosemary 2 gr.with tomatto,green pepper', descAr: 'تاج غنم 350 جرام، زبدة 30 جرام، ثوم 3 جرام، ملح 3 جرام، روزماري 2 جرام مع طماطم وفلفل أخضر.' },
  { id: 'mp-p-039', nameEn: 'MIXED GRILL', nameAr: 'مشاوي مشكلة', price: 120, cal: 1350, allergens: ['Milk', 'Gluten'], descEn: 'Meat ball khasar80 gr.lamb shish 80 gr.lamb chops 120 gr.Yağlı Kara 120 gr. 80 gr.with tomatto,green pepper,Bulgur rise', descAr: 'كفتة بالجبن قشقوان 80 جرام، شيش غنم 80 جرام، ريش غنم 120 جرام، ياغلي كارا 120 جرام مع طماطم وفلفل أخضر، برغل.' },
  { id: 'mp-p-040', nameEn: 'BEEF SAUTE', nameAr: 'سوتيه لحم بقري', price: 65, cal: 360, allergens: ['Milk'], descEn: 'Beef meat 150 gr.green pepper 60 gr.tomatto 50 gr.onion 40 gr.butter 10 gr.salt 4 gr.with tomatto,green pepper', descAr: 'سوتيه لحم بقري 150 جرام، فلفل أخضر 60 جرام، طماطم 50 جرام، بصل 40 جرام، زبدة 10 جرام، ملح 4 جرام مع طماطم وفلفل أخضر.' },
  { id: 'mp-p-072', nameEn: 'CHEFF OKTAY MEAT BALLS', nameAr: 'كرات لحم الشيف أوكتاي', price: 43, cal: 720, allergens: ['Milk', 'Egg', 'Gluten'], descEn: 'meatballs 250 gr.greated onion 15 gr.garlic 3 gr. fresh breadcrumbs 10 gr.egg salt 4 gr. black pepper 1 grpaprika 1 gr cumin 1 gr.Kashar cheese 100 gr.with crispy', descAr: 'كرات لحم الشيف أوكتاي المميزة 250 جرام محشوة بجبنة القشقوان مع البصل والثوم والبهارات والبطاطس المقرمشة.' },
  { id: 'mp-p-073', nameEn: 'Grilled Meatballs Stuffed with Kashar Cheese', nameAr: 'كرات لحم مشوية محشية بجبنة قشقوان', price: 46, cal: 650, allergens: ['Milk', 'Egg', 'Gluten'], descEn: 'special beef meat 180 gr. Kashar 60 gr.butter 20 gr.onions 15 gr garlic 10 gr. salt 3 gr.pepper 3 gr.grill tomato and green pepper.with 100 gr.crispy', descAr: 'كرات لحم مشوية محشية بجبنة قشقوان 180 جرام مع الزبدة والثوم والبهارات، تقدم مع طماطم وفلفل أخضر مشوي وبطاطس مقرمشة.' }
];

meatsAndMeatballs.forEach((m, idx) => {
  products.push(makeProduct({
    id: m.id,
    categoryId: 'c-mp-meats',
    nameEn: m.nameEn,
    nameAr: m.nameAr,
    descriptionEn: m.descEn,
    descriptionAr: m.descAr,
    price: m.price,
    calories: m.cal,
    allergens: m.allergens,
    displayOrder: idx + 1
  }));
});

// ==========================================
// 6. اطباق خاصة وقائمة ميت بورت (c-mp-specials)
// ==========================================
const specialsAndStarters = [
  { id: 'mp-p-074', nameEn: 'LAMB TANDOOR (Slow-Cooked Lamb)', nameAr: 'تندور غنم مطهو ببطء', price: 90, cal: 780, allergens: ['Milk'], descEn: 'Lamb Tandoor (Slow-Cooked Lamb) 350 gr. Calori:780 Allergen ;milk yogurt Butter BULGUR rice', descAr: 'تندور غنم مطهو ببطء 350 جرام على الطريقة التركية مع الأرز والزبادي والزبدة.' },
  { id: 'mp-p-075', nameEn: 'SALT BAKED LAMB SHOULDERS', nameAr: 'كتف غنم مطهو بالملح', price: 250, cal: 820, allergens: ['Milk'], descEn: 'Lamb shoulder 320 gr.(salt for cook 2000 gr)Butter 50 gr..black pepper 2 gr.Rosemary 3 gr.Tomato 50 gr.', descAr: 'كتف غنم كامل مخبوز بقشرة الملح الصخري 1200 جرام مع الروزماري والزبدة والطماطم.' },
  { id: 'mp-p-076', nameEn: 'SALT BAKED LAMB SHANKS', nameAr: 'موزات غنم مطهوة بالملح', price: 390, cal: 900, allergens: ['Milk'], descEn: 'Lamb shank 2000 gr. (salt for cook 900 gr)butter 50 gr.Garlic 10 gr.Thyme 2 gr.black pepper 2 gr.Bay leaf 1 pieces', descAr: 'موزات غنم طرية 2000 جرام مخبوزة بالملح والزبدة والثوم والزعتر وورق الغار.' },
  { id: 'mp-p-077', nameEn: 'LAMB RACK (Chef Special)', nameAr: 'راك غنم مشوي فاخر', price: 230, cal: 850, allergens: ['Milk'], descEn: 'Lamb rack 1200g, Butter 50 gr., black pepper 2 gr., Rosemary 3 gr., Tomato 50 gr.', descAr: 'ضلوع راك غنم فاخرة 1200 جرام مشوية مع الزبدة والروزماري والفلفل الأسود والطماطم.' },
  { id: 'mp-p-065', nameEn: 'BEEF CARPACCIO', nameAr: 'كارباتشيو لحم بقري', price: 79, cal: 220, allergens: ['Milk', 'Egg'], descEn: 'Beef Fillet 120 gr. Roka 19 gr. Permesan cheese 3 gr. Capari 10 gr. olive oil 10 ml. lemon juice 10 ml. sea salt 2 grams. black pepper 1 gr. balsamic 5 ml. mustard', descAr: 'كارباتشيو لحم بقري: شرائح فيليه لحم بقري رقيقة 120 جرام مع الجرجير وجبنة بارميزان والكبر وزيت الزيتون والليمون والخل البلسمي والخردل.' },
  { id: 'mp-p-066', nameEn: 'STEAK TARTAR', nameAr: 'ستيك تارتار', price: 72, cal: 320, allergens: ['Milk', 'Egg'], descEn: 'Beef fillet 150 gr. onion 15 gr. pickles 15 gr. capari 15 gr. dijon mustard 10 gr. olive oil 10 ml. egg yellows salt 2gr. black pepper 1 gr. frenk onions 5 gr.', descAr: 'ستيك تارتار: لحم فيليه بقري مفروم طازج 150 جرام مع مخلل، كبر، بصل، خردل ديجون، صفار البيض، وزيت الزيتون.' },
  { id: 'mp-p-067', nameEn: 'LENTIL SOUP', nameAr: 'شوربة عدس', price: 19, cal: 200, allergens: ['Gluten', 'Milk'], img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=450&fit=crop&q=80', descEn: 'Red lentils, onion, carrot, potato, flour, butter, vegetable oil, salt, black pepper, water.', descAr: 'شوربة عدس أحمر تركية تقليدية مع البصل والجزر والبطاطس والزبدة والبهارات الشهية.' },
  { id: 'mp-p-069', nameEn: 'YUVALAMA SOUP', nameAr: 'شوربة يوفالاما', price: 25, cal: 330, allergens: ['Milk', 'Gluten'], descEn: 'Chickpeas 20g, lamb meat 20g, rice flour 10g, spices 4g, butter 10g.', descAr: 'شوربة يوفالاما التقليدية: كرات اللحم الغنم والأرز الصغيرة مع الحمص ومرق الزبادي بالنعناع والزبدة.' },
  { id: 'mp-p-070', nameEn: 'KELLE PAÇA (HEAD-TROTTERS) SOUP', nameAr: 'شوربة كلة باشا', price: 30, cal: 325, allergens: ['Milk'], descEn: '50g head meat, 50g trotters, traditional spices and broth.', descAr: 'شوربة كلة باشا: شوربة كوارع ورأس غنم تركية تقليدية غنية بالنكهة والتوابل والثوم.' },
  { id: 'mp-p-068', nameEn: 'TURKISH PICKLES', nameAr: 'مخللات تركية مشكلة', price: 15, cal: 35, allergens: [], descEn: '200g assorted traditional Turkish crunchy pickles.', descAr: 'مخللات تركية مقرمشة مشكلة 200 جرام بنكهة خل مميزة وتوابل أصيلة.' }
];

specialsAndStarters.forEach((sp, idx) => {
  products.push(makeProduct({
    id: sp.id,
    categoryId: 'c-mp-specials',
    nameEn: sp.nameEn,
    nameAr: sp.nameAr,
    descriptionEn: sp.descEn,
    descriptionAr: sp.descAr,
    price: sp.price,
    calories: sp.cal,
    allergens: sp.allergens,
    imageUrl: sp.img,
    displayOrder: idx + 1
  }));
});

// ==========================================
// 7. شاورما وبرجر (c-mp-shawarmas)
// ==========================================
products.push(makeProduct({
  id: 'mp-p-078',
  categoryId: 'c-mp-shawarmas',
  nameEn: 'Beef Shawarma Platter',
  nameAr: 'صحن شاورما لحم تركي',
  descriptionEn: 'Marinated prime beef doner served with Turkish bread, crispy fries, grilled tomatoes, and garlic sauce.',
  descriptionAr: 'شاورما ولحم دونر بقري متبل يقدم مع الخبز التركي، بطاطس مقرمشة، طماطم، وصوص الثومية الخاص.',
  price: 39,
  calories: 450,
  allergens: ['Gluten', 'Milk', 'Egg', 'Mustard', 'Sesame'],
  displayOrder: 1,
  sizes: [
    { id: 'size-mp-p-078-small', nameEn: 'Small (120g)', nameAr: 'صغير (120 جم)', priceDifference: 0, calories: 300, sku: 'MP-078-SM' },
    { id: 'size-mp-p-078-medium', nameEn: 'Medium (180g)', nameAr: 'وسط (180 جم)', priceDifference: 20, calories: 450, sku: 'MP-078-MD' },
    { id: 'size-mp-p-078-large', nameEn: 'Large (240g)', nameAr: 'كبير (240 جم)', priceDifference: 40, calories: 600, sku: 'MP-078-LG' }
  ]
}));

products.push(makeProduct({
  id: 'mp-p-079',
  categoryId: 'c-mp-shawarmas',
  nameEn: 'Iskender Kebab',
  nameAr: 'كباب إسكندر',
  descriptionEn: 'beef shawarma 120 gr.turkhish pide 150 gr.tomato sos 80 gr.yogurt 150 gr.grıll tomato grıll green pepper butter 20 gr.salt 5 gr.',
  descriptionAr: 'كباب إسكندر الشهير: شرائح شاورما لحم 120 جرام على خبز بيدا مقطع، مغطى بصلصة الطماطم الغنية والزبدة الساخنة مع زبادي تركي.',
  price: 65,
  calories: 1150,
  allergens: ['Gluten', 'Milk', 'Sesame'],
  displayOrder: 2
}));

products.push(makeProduct({
  id: 'mp-p-080',
  categoryId: 'c-mp-shawarmas',
  nameEn: 'Beef Shawarma Sandwich',
  nameAr: 'ساندوتش شاورما لحم',
  descriptionEn: 'Beef shawarmas Sandwich:turkish bread 80 gr.Beef döner 80 gr.tomato 30 gr.lettuce 20 gr.pickles 20 gr, 25 gr.crispy',
  descriptionAr: 'ساندوتش شاورما لحم: خبز تركي 80 جرام مع دونر لحم بقري 80 جرام، طماطم، خس، مخلل، وبطاطس مقرمشة.',
  price: 20,
  calories: 350,
  allergens: ['Gluten', 'Milk', 'Egg', 'Sesame'],
  displayOrder: 3
}));

products.push(makeProduct({
  id: 'mp-p-081',
  categoryId: 'c-mp-shawarmas',
  nameEn: 'Beef Shawarma WRAP',
  nameAr: 'راب شاورما لحم',
  descriptionEn: 'Beef shawarmas Wrap 100 gr. tomato 30 gr.chips 40 gr.turkish pickles 20 gr, lettuce 20 gr.',
  descriptionAr: 'راب شاورما لحم: خبز تورتيلا راب مع شاورما لحم بقري 100 جرام، طماطم، مخلل تركي، وبطاطس مقرمشة.',
  price: 25,
  calories: 450,
  allergens: ['Gluten', 'Milk', 'Egg', 'Sesame'],
  displayOrder: 4
}));

products.push(makeProduct({
  id: 'mp-p-082',
  categoryId: 'c-mp-shawarmas',
  nameEn: 'Classic Burger',
  nameAr: 'برجر كلاسيك',
  descriptionEn: 'Brioche burger bread 80gr,Beef burger meat180 gr,chedar cheese20 gr,pickles 20 gr,crispy onions 15 gr,burger sauce 25 gr.salt 4gr.with crisps',
  descriptionAr: 'برجر كلاسيك: خبز بريوش 80 جرام، لحم برجر بقري 180 جرام، جبنة شيدر 20 جرام، مخلل، بصل مقرمش، صوص برجر خاص مع بطاطس مقرمشة.',
  price: 35,
  calories: 920,
  allergens: ['Gluten', 'Milk', 'Egg', 'Mustard', 'Sesame'],
  displayOrder: 5
}));

products.push(makeProduct({
  id: 'mp-p-083',
  categoryId: 'c-mp-shawarmas',
  nameEn: 'Turkish Delight Burger',
  nameAr: 'برجر تركيش ديلايت',
  descriptionEn: 'Brioche burger bread 80 gr.beef burger meats 180 gr.old cheese 25 gr.crispy onione35 gr special turkhish spıce sauce 30 gr.salt 3 gr.with chrisps',
  descriptionAr: 'برجر تركيش ديلايت: خبز بريوش، لحم برجر 180 جرام، جبنة معتقة 25 جرام، بصل مقرمش، صوص توابل تركية مميزة مع بطاطس مقرمشة.',
  price: 75,
  calories: 980,
  allergens: ['Gluten', 'Milk', 'Egg', 'Mustard', 'Sesame'],
  displayOrder: 6
}));

products.push(makeProduct({
  id: 'mp-p-084',
  categoryId: 'c-mp-shawarmas',
  nameEn: "Chef's Burger",
  nameAr: 'برجر الشيف',
  descriptionEn: 'Brioche burger bread 130 gr.beef burger meat,cheddar cheese 20 gr.fume beef meat 40 gr crispy onione,pickles,.truffle mayonnaise,salt 3 gr.with crisps',
  descriptionAr: 'برجر الشيف الفاخر: خبز بريوش 130 جرام، لحم برجر بقري، جبنة شيدر، لحم بقري مدخن 40 جرام، بصل مقرمش، مخلل، ومايونيز الكمأة (ترافل).',
  price: 40,
  calories: 1180,
  allergens: ['Gluten', 'Milk', 'Egg', 'Mustard', 'Sesame'],
  displayOrder: 7
}));

products.push(makeProduct({
  id: 'mp-p-085',
  categoryId: 'c-mp-shawarmas',
  nameEn: 'Mini Burger',
  nameAr: 'ميني برجر',
  descriptionEn: 'Mini burger bread 60 gr.Beef Burger meat 129 gr,cheddar cheese 20 gr,pickles 10 gr.crispy oni,burger sauce 20 gr.salt 2 gr.with chrisps',
  descriptionAr: 'ميني برجر: قطعتين ميني برجر بخبز البريوش، لحم بقري، جبنة شيدر، مخلل، صوص البرجر مع بطاطس مقرمشة.',
  price: 25,
  calories: 650,
  allergens: ['Gluten', 'Milk', 'Egg', 'Mustard', 'Sesame'],
  displayOrder: 8
}));

// ==========================================
// 8. ستيك (c-mp-steaks)
// ==========================================
const steaksData = [
  { id: 'mp-p-001', nameEn: 'PORTEHOUSE STEAK', nameAr: 'ستيك بورترهاوس', price: 266, cal: 1650, descEn: 'Porterhouse steak, 700 gr.(Dry aged) salt 5 gr.,black paper 2 gr.,olive oil 10 ml..grill tomato 60 grams,with baked patatos 150 grams.,spinach 80 gr', descAr: 'ستيك بورترهاوس، 700 جرام (مُعتق جاف) ملح 5 جرام، فلفل أسود 2 جرام، زيت زيتون 10 مل، طماطم مشوية 60 جرام، مع بطاطس مخبوزة 150 جرام، سبانخ 80 جرام.' },
  { id: 'mp-p-002', nameEn: 'FLORENTINA STEAK', nameAr: 'ستيك فلورنتينا', price: 380, cal: 2300, descEn: 'Florentine steak 1000gr. sea salt 8 gr. black peper 3 gr.olive oil 15 ml.grill vagetabels 200 gr.with baked patato 150 gr.butter with garlic 25 gr.spinach 80. gr', descAr: 'ستيك فلورنتين 1000 جرام، ملح بحري 8 جرام، فلفل أسود 3 جرام، زيت زيتون 15 مل، خضار مشوية 200 جرام مع بطاطس مخبوزة 150 جرام، زبدة بالثوم 25 جرام، سبانخ 80 جرام.' },
  { id: 'mp-p-003', nameEn: 'T-BÖNE STEAK', nameAr: 'ستيك تي بون', price: 190, cal: 1150, descEn: 'T- Bone steak 500 gr sea salt 5 gr. black peper 2 gr olive oil 10 ml.grill munsroom 70 gr. with baked patato.spinach 80 gr.', descAr: 'ستيك تي بون 500 جرام، ملح بحري 5 جرام، فلفل أسود 2 جرام، زيت زيتون 10 مل، فطر مشوي 70 جرام مع بطاطس مخبوزة، سبانخ 80 جرام.' },
  { id: 'mp-p-004', nameEn: 'NEW YORK STEAK', nameAr: 'ستيك نيويورك', price: 159, cal: 850, descEn: 'striploin :350 gr.sea salt 4 gr black peper 2 gr olive oil:8 ml.with baked patato:150 gr.spinach 80 gr', descAr: 'ستربلوين: 350 جرام، ملح بحري 4 جرام، فلفل أسود 2 جرام، زيت زيتون: 8 مل مع بطاطس مخبوزة: 150 جرام، سبانخ 80 جرام.' },
  { id: 'mp-p-005', nameEn: 'RIBEYE STEAK', nameAr: 'ستيك ريب آي', price: 135, cal: 1150, descEn: 'Ribeye steak 400 gr.sea salt 4 gr. black paper 2 gr.with baked patato 150 gr.spinach 80 gr', descAr: 'ستيك ريب آي 400 جرام، ملح بحري 4 جرام، فلفل أسود 2 جرام مع بطاطس مخبوزة 150 جرام، سبانخ 80 جرام.' },
  { id: 'mp-p-006', nameEn: 'ENTRECOTE', nameAr: 'ستيك أنتركوت', price: 91, cal: 700, descEn: 'Entrecote 250 gr. sea salt 4 gr.black paper 2 gr.with baked patato 150 gr.spinach 80 gr.', descAr: 'أنتركوت 250 جرام، ملح بحري 4 جرام، فلفل أسود 2 جرام مع بطاطس مخبوزة 150 جرام، سبانخ 80 جرام.' },
  { id: 'mp-p-007', nameEn: 'DALLAS STEAK', nameAr: 'ستيك دالاس', price: 190, cal: 1750, descEn: 'Dallas steak 500 gr. sea salt 6 gr.black pepper 2 gr.with baked Patato 180 gr.spinach 80 gr.', descAr: 'ستيك دالاس 500 جرام، ملح بحري 6 جرام، فلفل أسود 2 جرام مع بطاطس مخبوزة 180 جرام، سبانخ 80 جرام.' },
  { id: 'mp-p-008', nameEn: 'TOMAHAWK STEAK', nameAr: 'ستيك توماهوك', price: 315, cal: 2100, descEn: 'tomahawk 900 gr. sea salt 8 gr. black paper 3 gr. with baked patato 150 gr.spinach 80 gr', descAr: 'توماهوك 900 جرام، ملح بحري 8 جرام، فلفل أسود 3 جرام مع بطاطس مخبوزة 150 جرام، سبانخ 80 جرام.' },
  { id: 'mp-p-009', nameEn: 'LOKUM STEAK', nameAr: 'ستيك لوكوم', price: 149, cal: 500, descEn: 'Beef Tenderloin 220 gr. sea salt 3 gr. black paper 1 gr.with baby patato :150 gr. spinach 80 gr.', descAr: 'فيليه لحم بقري 220 جرام، ملح بحري 3 جرام، فلفل أسود 1 جرام مع بطاطس صغيرة: 150 جرام، سبانخ 80 جرام.' },
  { id: 'mp-p-010', nameEn: 'FİLET MİGNON', nameAr: 'فيليه مينيون', price: 165, cal: 420, descEn: 'Dana Bonfile250 gr.sea salt 4 gr. black pepper 2 gr.with baked Patato 180 gr. spinach 80 gr.', descAr: 'فيليه لحم بقري 250 جرام، ملح بحري 4 جرام، فلفل أسود 2 جرام مع بطاطس مخبوزة 180 جرام، سبانخ 80 جرام.' },
  { id: 'mp-p-011', nameEn: 'BEEF SHASLIK', nameAr: 'شيش لحم بقري', price: 145, cal: 650, descEn: 'Beef fillet 220 gr. Onion 40 gr. sweet red pepper 30 gr.green pepper 30 gr.olive oil 15 ml garlic 5 gr.salt 3 gr.with baked patato.spinach', descAr: 'فيليه لحم بقري 220 جرام، بصل 40 جرام، فلفل أحمر حلو 30 جرام، فلفل أخضر 30 جرام، زيت زيتون 15 مل، ثوم 5 جرام، ملح 3 جرام مع بطاطس مخبوزة، سبانخ.' },
  { id: 'mp-p-012', nameEn: 'CHATEAUBRİAND (2 Personly)', nameAr: 'شاتوبريان لشخصين', price: 189, cal: 650, descEn: 'Beef fillet:400 gr.salt 3 gr. black pepper 3 gr.Butter 30 gr.bread ,cherry tomato,roka 15 gr', descAr: 'فيليه لحم بقري: 400 جرام، ملح 3 جرام، فلفل أسود 3 جرام، زبدة 30 جرام، خبز، طماطم كرزية، جرجير 15 جرام.' },
  { id: 'mp-p-013', nameEn: 'CHATEAUBRİAND (4 Personly)', nameAr: 'شاتوبريان لأربعة أشخاص', price: 378, cal: 1300, descEn: 'Beef fillet:800 gr.salt 3 gr. black pepper 3 gr.Butter 30 gr.bread ,cherry tomato,roka 15 gr', descAr: 'فيليه لحم بقري: 800 جرام، ملح 3 جرام، فلفل أسود 3 جرام، زبدة 30 جرام، خبز، طماطم كرزية، جرجير 15 جرام.' },
  { id: 'mp-p-014', nameEn: 'ASSADO / Asado (for 2 persons)', nameAr: 'أسادو لشخصين', price: 220, cal: 925, descEn: '2 PERSON 800 GR.800 GR.4  SALT OLİVE OİL SPİCE ONİON ROKA', descAr: 'لشخصين 800 جرام، ملح، زيت زيتون، بهارات، بصل، جرجير.' },
  { id: 'mp-p-015', nameEn: 'ASSADO / Asado (for 4 persons)', nameAr: 'أسادو لأربعة أشخاص', price: 430, cal: 1850, descEn: '4 PERSON 800 GR.3 GR.SALT 15 GR OLİVE OİL 5 GR.SPİCE 20 GR.ONİON 15 GR ROKA', descAr: 'لـ 4 أشخاص 800 جرام، 3 جرام ملح، 15 جرام زيت زيتون، 5 جرام بهارات، 20 جرام بصل، 15 جرام جرجير.' },
  { id: 'mp-p-016', nameEn: 'BEEF SPAGEHETTI', nameAr: 'سباغيتي باللحم', price: 145, cal: 310, descEn: '200g beef fillet strips: sea salt 5 gr.spices 4 gr.olive oil 20 gr.baby patato 80 gr.spinach 80 gr.', descAr: '200 جرام فيليه لحم بقري، ملح بحري 5 جرام، بهارات 4 جرام، زيت زيتون 20 جرام، بطاطس صغيرة 80 جرام، سبانخ 80 جرام.' }
];

steaksData.forEach((s, idx) => {
  products.push(makeProduct({
    id: s.id,
    categoryId: 'c-mp-steaks',
    nameEn: s.nameEn,
    nameAr: s.nameAr,
    descriptionEn: s.descEn,
    descriptionAr: s.descAr,
    price: s.price,
    calories: s.cal,
    allergens: s.id === 'mp-p-011' ? ['Milk', 'Gluten'] : [],
    displayOrder: idx + 1
  }));
});

// ==========================================
// 9. صوصات (c-mp-sauces)
// ==========================================
products.push(makeProduct({
  id: 'mp-p-086',
  categoryId: 'c-mp-sauces',
  nameEn: 'Cheddar Cheese Sauce',
  nameAr: 'صوص جبنة شيدر',
  descriptionEn: 'cheddar cheese 30 gr.milk 30 ml.crema 20 ml.butter 4 gr.flour 3 gr.salt 1gr.white pepper 0.3 gr.',
  descriptionAr: 'صوص جبنة شيدر كريمي غني ولذيذ محضر بالكريمة والزبدة الطبيعية.',
  price: 5,
  calories: 340,
  allergens: ['Milk', 'Gluten'],
  displayOrder: 1
}));

products.push(makeProduct({
  id: 'mp-p-087',
  categoryId: 'c-mp-sauces',
  nameEn: 'Cafe de Paris Butter Sauce',
  nameAr: 'صوص زبدة كافيه دي باريس',
  descriptionEn: 'Butter 30 gr.Dijon hardal 3 gr.Worcestershire 2 gr.garlic 2 gr.maydonoz 2 gr.frenc onion 2 gr.lemon juice 2 ml.black pepper 0.5 gr.paprica 0.4 gr.',
  descriptionAr: 'صوص زبدة كافيه دي باريس الشهير للستيك بالأعشاب الطازجة وخردل ديجون.',
  price: 5,
  calories: 315,
  allergens: ['Milk', 'Mustard'],
  displayOrder: 2
}));

products.push(makeProduct({
  id: 'mp-p-088',
  categoryId: 'c-mp-sauces',
  nameEn: 'Demi-Glace',
  nameAr: 'صوص ديمي جلاس',
  descriptionEn: 'Veal bone broth150 ml.mirepoix vegatable30 gr,tomate paste5 gr,butter 20 gr.flour3 gr.black pepper 1 gr.thyme0.3 gr.bay leaf 1',
  descriptionAr: 'صوص ديمي جلاس كلاسيكي محضر بمرق عظام العجل والخضار والأعشاب العطرية.',
  price: 5,
  calories: 45,
  allergens: ['Gluten', 'Milk'],
  displayOrder: 3
}));

products.push(makeProduct({
  id: 'mp-p-089',
  categoryId: 'c-mp-sauces',
  nameEn: 'Black pepper sauce',
  nameAr: 'صوص فلفل أسود',
  descriptionEn: 'beef demi glace 50 ml.crema 25 gr.butter 4gr.black papper pure.2 gr.onion 4 gr.garlic 2 gr.salt 1 gr.',
  descriptionAr: 'صوص فلفل أسود كريمي غني بنكهة الفلفل الأسود المجروش مع الكريمة والديمي جلاس.',
  price: 5,
  calories: 95,
  allergens: ['Milk'],
  displayOrder: 4
}));

// ==========================================
// 10. حلويات (c-mp-desserts)
// ==========================================
const dessertsData = [
  { id: 'mp-p-090', nameEn: 'Carrot Slice Baklava', nameAr: 'بقلاوة شريحة جزر', price: 35, cal: 650, allergens: ['Milk', 'Pistachio'], descEn: 'Layered phyllo pastry with pistachios, baked and soaked in syrup', descAr: 'بقلاوة شريحة جزر: طبقات من رقائق العجين الهشة محشوة بالفستق الحلبي الفاخر ومخبوزة ومسقاة بالقطر.' },
  { id: 'mp-p-091', nameEn: 'Pistachio Sarma', nameAr: 'سارما بالفستق', price: 38, cal: 450, allergens: ['Milk', 'Pistachio'], descEn: 'Rolled phyllo pastry filled with premium pistachios', descAr: 'سارما بالفستق: رقائق عجين ملفوفة ومحشوة بالفستق الحلبي الفاخر ومسقاة بالقطر.' },
  { id: 'mp-p-092', nameEn: 'Cold Baklava', nameAr: 'بقلاوة باردة', price: 35, cal: 500, allergens: ['Milk', 'Pistachio'], descEn: 'Chocolate-flaored cold mild baklaa with pistachios', descAr: 'بقلاوة باردة: بقلاوة باردة بنكهة الشوكولاتة والحليب مع الفستق الحلبي.' },
  { id: 'mp-p-093', nameEn: 'Walnut Baklava', nameAr: 'بقلاوة بالجوز', price: 29, cal: 500, allergens: ['Milk', 'Walnut'], descEn: 'Traditional baklava filled with walnuts and syruo', descAr: 'بقلاوة بالجوز: بقلاوة تركية تقليدية محشوة بالجوز ومسقاة بالقطر.' },
  { id: 'mp-p-094', nameEn: "Bird's Nest Baklava", nameAr: 'بقلاوة عش العصفور', price: 29, cal: 450, allergens: ['Milk', 'Walnut', 'Pistachio'], descEn: 'Crispy shredded phyllo nest filled with pistachios and walnuts', descAr: 'بقلاوة عش العصفور: خيوط الكنافة المقرمشة والملفوفة على شكل عش العصفور محشوة بالفستق والمكسرات.' },
  { id: 'mp-p-095', nameEn: "Oktay Chef's Walnut Turkish Baklava", nameAr: 'بقلاوة تركية بالجوز من الشيف أوكتاي', price: 29, cal: 520, allergens: ['Milk', 'Walnut'], descEn: 'Traditional handcrafted baklava filled with premium walnuts and syrup from Chef Oktay.', descAr: 'بقلاوة تركية بالجوز من الشيف أوكتاي: بقلاوة تركية تقليدية محشوة بالجوز ومسقاة بالقطر من تحضير الشيف.' },
  { id: 'mp-p-096', nameEn: 'Pistachio Katmer', nameAr: 'كاتمر بالفستق', price: 49, cal: 900, allergens: ['Milk', 'Pistachio'], descEn: 'Thin crispy pastry with pistachio and clotted cream', descAr: 'كاتمر بالفستق: فطيرة رقيقة ومقرمشة محشوة بالفستق الحلبي والقشطة الطازجة.' },
  { id: 'mp-p-097', nameEn: 'OVEN RICE PUDING', nameAr: 'أرز بالحليب في الفرن', price: 20, cal: 450, allergens: ['Milk', 'Egg'], descEn: 'SÜT 90.EGG 5GR.VANİLİA,2 GR.RİCE 10 GR.SUGAR 15 GR.', descAr: 'أرز بالحليب في الفرن (سوتلاش): حليب طازج، أرز، فانيليا، وسكر مخبوز بالفرن ليتحمر سطحه.' },
  { id: 'mp-p-098', nameEn: 'Künefe', nameAr: 'كنافة تركية بالجبنة', price: 30, cal: 650, allergens: ['Milk', 'Pistachio'], descEn: 'Hot shredded pastry with melted cheese and syrup, served with pistachio', descAr: 'كنافة تركية ساخنة محشوة بالجبنة الذائبة ومسقاة بالقطر ومزينة بالفستق الحلبي.' },
  { id: 'mp-p-099', nameEn: 'Chocolate Souffle', nameAr: 'سوفليه شوكولاتة', price: 25, cal: 450, allergens: ['Egg', 'Milk'], descEn: 'Warm chocolate cake with a molten center', descAr: 'سوفليه شوكولاتة: كعكة الشوكولاتة الدافئة المحشوة بالشوكولاتة السائلة الذائبة.' },
  { id: 'mp-p-100', nameEn: 'Ice Cream with Kaymak', nameAr: 'آيس كريم بالقشطة (دوغورما)', price: 25, cal: 250, allergens: ['Milk'], descEn: 'Authentic Turkish Maraş style ice cream served with traditional Kaymak clotted cream.', descAr: 'آيس كريم تركي تقليدي بالقشطة الطازجة (قيماق) بنكهة المستكة الطبيعية.' },
  { id: 'mp-p-101', nameEn: "Chef's Special Fruits Dessert", nameAr: 'حلى فواكه الشيف الخاصة', price: 30, cal: 280, allergens: [], descEn: 'Fresh caramelized pineapple slices, strawberries, natural syrup, and Chef special touch.', descAr: 'حلى فواكه الشيف الخاصة: شرائح أناناس مكرملة طازجة مع الفراولة وصلصة الشيف المميزة.' }
];

dessertsData.forEach((d, idx) => {
  products.push(makeProduct({
    id: d.id,
    categoryId: 'c-mp-desserts',
    nameEn: d.nameEn,
    nameAr: d.nameAr,
    descriptionEn: d.descEn,
    descriptionAr: d.descAr,
    price: d.price,
    calories: d.cal,
    allergens: d.allergens,
    displayOrder: idx + 1
  }));
});

// ==========================================
// 11. مشروبات (c-mp-drinks)
// ==========================================
const drinksData = [
  { id: 'mp-p-102', nameEn: 'Pina Colada Juice', nameAr: 'عصير بينا كولادا', price: 22, cal: 320, allergens: ['Milk'], descEn: 'Pineapple 120 ml, coconut cream 60 ml, fresh ice.', descAr: 'عصير بينا كولادا: مزيج منعش من الأناناس الطبيعي 120 مل مع كريمة جوز الهند 60 مل ومكعبات الثلج.', img: images['mp-p-102'] },
  { id: 'mp-p-103', nameEn: 'Fresh Pineapple Juice', nameAr: 'عصير أناناس طازج', price: 20, cal: 160, allergens: [], descEn: 'Fresh squeezed pineapple juice 200 ml.', descAr: 'عصير أناناس طازج وطبيعي 200 مل بدون سكر مضاف.', img: images['mp-p-103'] },
  { id: 'mp-p-104', nameEn: 'Fresh Orange Juice', nameAr: 'عصير برتقال طازج', price: 18, cal: 120, allergens: [], descEn: 'Freshly squeezed orange juice 200 ml with crushed ice.', descAr: 'عصير برتقال طازج 200 مل معصور يومياً وغني بفيتامين سي.', img: images['mp-p-104'] },
  { id: 'mp-p-new-pomegranate', nameEn: 'Fresh Pomegranate Juice', nameAr: 'عصير رمان طازج', price: 22, cal: 150, allergens: [], descEn: '100% pure freshly squeezed sweet and tart pomegranate juice.', descAr: 'عصير رمان طازج 100% طبيعي ومعصور عند الطلب.', img: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?w=600&h=450&fit=crop&q=80' },
  { id: 'mp-p-new-orange-pom', nameEn: 'Orange & Pomegranate Juice', nameAr: 'عصير برتقال ورمان', price: 16, cal: 130, allergens: [], descEn: 'Refreshing signature mix of fresh orange and rich pomegranate juice.', descAr: 'مزيج منعش من عصير البرتقال الطازج وعصير الرمان الطبيعي.', img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&h=450&fit=crop&q=80' },
  { id: 'mp-p-new-orange-carrot', nameEn: 'Orange & Carrot Juice', nameAr: 'عصير برتقال وجزر', price: 20, cal: 110, allergens: [], descEn: 'Healthy revitalizing blend of fresh sweet carrots and zesty orange juice.', descAr: 'عصير برتقال وجزر طازج صحي وغني بالفيتامينات ومحضر عند الطلب.', img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&h=450&fit=crop&q=80' },
  { id: 'mp-p-108', nameEn: 'Fresh Lemonade with Mint', nameAr: 'ليمونادة نعناع طازجة', price: 19, cal: 110, allergens: [], descEn: 'Fresh lemon juice 50 ml, fresh mint leaves, purified water, light cane sugar.', descAr: 'ليمونادة بالنعناع المنعش: عصير ليمون طازج مع أوراق النعناع الخضراء ومكعبات الثلج.', img: images['mp-p-108'] },
  { id: 'mp-p-new-green-apple', nameEn: 'Fresh Green Apple Juice', nameAr: 'عصير تفاح أخضر طازج', price: 24, cal: 110, allergens: [], descEn: 'Crisp, tangy and refreshing freshly squeezed green apple juice.', descAr: 'عصير تفاح أخضر طازج ومنعش معصور طبيعياً 100%.', img: 'https://images.unsplash.com/photo-1576186726580-a816e8b12896?w=600&h=450&fit=crop&q=80' },
  { id: 'mp-p-114', nameEn: 'Fresh Carrot Juice', nameAr: 'عصير جزر طازج', price: 11, cal: 90, allergens: [], descEn: 'Fresh carrot juice 200 ml, cold water 50 ml, fresh lemon squeeze.', descAr: 'عصير جزر طازج 200 مل مع قطرات الليمون المنعشة.', img: images['mp-p-114'] },
  { id: 'mp-p-new-glass-water', nameEn: 'Glass of Water', nameAr: 'كأس ماء نقي', price: 4, cal: 0, allergens: [], descEn: 'Pure refreshing chilled drinking water served in a glass.', descAr: 'كأس ماء شرب نقي ومبرد.', img: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&h=450&fit=crop&q=80' },
  { id: 'mp-p-116', nameEn: 'Pepsi', nameAr: 'بيبسي', price: 5, cal: 150, allergens: [], descEn: 'Chilled 330ml can of classic Pepsi.', descAr: 'مشروب غازي بيبسي بارد 330 مل.', img: images['mp-p-116'] },
  { id: 'mp-p-117', nameEn: 'Pepsi Light', nameAr: 'بيبسي لايت', price: 5, cal: 1, allergens: [], descEn: 'Chilled 330ml can of Pepsi Diet/Light.', descAr: 'مشروب غازي بيبسي دايت خالي من السكر 330 مل.', img: images['mp-p-117'] },
  { id: 'mp-p-118', nameEn: 'Pepsi Zero Sugar', nameAr: 'بيبسي زيرو', price: 5, cal: 0, allergens: [], descEn: 'Chilled 330ml can of Pepsi Zero Sugar.', descAr: 'مشروب غازي بيبسي زيرو بدون سكر 330 مل.', img: images['mp-p-118'] },
  { id: 'mp-p-119', nameEn: '7 Up', nameAr: 'سفن أب', price: 5, cal: 140, allergens: [], descEn: 'Chilled 330ml can of refreshing lemon-lime 7 Up.', descAr: 'مشروب غازي سفن أب بنكهة الليمون المنعشة 330 مل.', img: images['mp-p-119'] },
  { id: 'mp-p-120', nameEn: 'Miranda Orange', nameAr: 'ميرندا برتقال', price: 5, cal: 160, allergens: [], descEn: 'Chilled 330ml can of Miranda Orange soda.', descAr: 'مشروب غازي ميرندا بنكهة البرتقال اللذيذة 330 مل.', img: images['mp-p-120'] },
  { id: 'mp-p-121', nameEn: 'Coca Cola', nameAr: 'كوكاكولا', price: 5, cal: 140, allergens: [], descEn: 'Chilled 330ml can of original Coca-Cola.', descAr: 'مشروب غازي كوكاكولا كلاسيك 330 مل.', img: images['mp-p-121'] },
  { id: 'mp-p-122', nameEn: 'Small Bottle Water (250ml)', nameAr: 'زجاجة مياه صغيرة (250 مل)', price: 2, cal: 0, allergens: [], descEn: 'Pure bottled mineral water 250 ml.', descAr: 'زجاجة مياه معدنية نقية صغيرة 250 مل.', img: images['mp-p-122'] },
  { id: 'mp-p-123', nameEn: 'Sparkling Water (200ml)', nameAr: 'مياه غازية فوارة (200 مل)', price: 7, cal: 0, allergens: [], descEn: 'Chilled sparkling carbonated mineral water 200 ml.', descAr: 'مياه معدنية غازية فوارة ومنعشة 200 مل.', img: images['mp-p-123'] },
  { id: 'mp-p-124', nameEn: 'Big Bottle Water (1L)', nameAr: 'زجاجة مياه كبيرة (1 لتر)', price: 6, cal: 0, allergens: [], descEn: 'Pure bottled mineral water 1 Liter.', descAr: 'زجاجة مياه معدنية نقية كبيرة 1 لتر.', img: images['mp-p-124'] },
  { id: 'mp-p-126', nameEn: 'Soda Water', nameAr: 'صودا سادة', price: 5, cal: 0, allergens: [], descEn: 'Crisp plain club soda 250 ml.', descAr: 'مياه صودا سادة فوارة 250 مل.', img: images['mp-p-126'] },
  { id: 'mp-p-127', nameEn: 'Traditional Turkish Ayran', nameAr: 'عيران تركي تقليدي', price: 5, cal: 90, allergens: ['Milk'], descEn: 'Yogurt 200 ml, water 100 ml, fresh mint, sea salt.', descAr: 'لبن عيران تركي مخفوق طازج مع رشة ملح وأوراق النعناع.', img: images['mp-p-127'] }
];

drinksData.forEach((dr, idx) => {
  products.push(makeProduct({
    id: dr.id,
    categoryId: 'c-mp-drinks',
    nameEn: dr.nameEn,
    nameAr: dr.nameAr,
    descriptionEn: dr.descEn,
    descriptionAr: dr.descAr,
    price: dr.price,
    calories: dr.cal,
    allergens: dr.allergens,
    imageUrl: dr.img,
    displayOrder: idx + 1
  }));
});

console.log(`Generated ${categories.length} categories and ${products.length} products.`);

// Version tag for cache busting in App.tsx
const version = 'meatport-catalog-ordered-2026-09-07-v4';

const tsContent = `import { Category, Product } from './types';

export const meatportCatalogVersion = '${version}';

export const meatportCategories: Category[] = ${JSON.stringify(categories, null, 2)};

export const meatportProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(catalogTsPath, tsContent, 'utf8');
console.log('Successfully wrote updated src/meatportCatalog.ts');

// Also update product-descriptions-ar.json and product-images.json
products.forEach(p => {
  arDesc[p.id] = p.descriptionAr;
  if (p.imageUrl) {
    images[p.id] = p.imageUrl;
  }
});
fs.writeFileSync(arDescPath, JSON.stringify(arDesc, null, 2), 'utf8');
fs.writeFileSync(imagesPath, JSON.stringify(images, null, 2), 'utf8');
console.log('Successfully updated product-descriptions-ar.json and product-images.json');

// Also update public/tenants/meatport/database_dump.json
if (fs.existsSync(dumpPath)) {
  const rawDump = fs.readFileSync(dumpPath, 'utf8').replace(/^\uFEFF/, '');
  const dump = JSON.parse(rawDump);
  dump.categories = categories;
  dump.products = products;
  fs.writeFileSync(dumpPath, JSON.stringify(dump, null, 2), 'utf8');
  console.log('Successfully updated database_dump.json');
}
