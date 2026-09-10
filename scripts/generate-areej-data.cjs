const fs = require('fs');
const path = require('path');

const categories = [
  {
    id: 'cat-salads',
    tenantId: 'areej',
    nameEn: 'Salads',
    nameAr: 'السلطات',
    descriptionEn: 'Fresh, vibrant, handcrafted artisan salads.',
    descriptionAr: 'تشكيلة سلطات طازجة ومقرمشة محضرة بأجود المكونات والصلصات الخاصة.',
    displayOrder: 1,
    isVisible: true,
    imageUrl: '/tenants/areej/assets/cat-salads.jpg'
  },
  {
    id: 'cat-soup',
    tenantId: 'areej',
    nameEn: 'Soup',
    nameAr: 'الشوربة',
    descriptionEn: 'Warm, rich, and velvety soups.',
    descriptionAr: 'شوربات ساخنة وغنية بالنكهات الدافئة والكريمة الفاخرة.',
    displayOrder: 2,
    isVisible: true,
    imageUrl: '/tenants/areej/assets/cat-soup.jpg'
  },
  {
    id: 'cat-appetizers',
    tenantId: 'areej',
    nameEn: 'Appetizers',
    nameAr: 'المقبلات',
    descriptionEn: 'Crispy bites and irresistible savory starters.',
    descriptionAr: 'أشهى المقبلات المقرمشة والمبتكرة لبداية مثالية لوجبتكم.',
    displayOrder: 3,
    isVisible: true,
    imageUrl: '/tenants/areej/assets/cat-appetizers.jpg'
  },
  {
    id: 'cat-pizza',
    tenantId: 'areej',
    nameEn: 'Pizza',
    nameAr: 'البيتزا',
    descriptionEn: 'Authentic Neapolitan artisanal stone-baked pizzas.',
    descriptionAr: 'بيتزا نابولية كلاسيكية مخبوزة على الحجر بعجينة فاخرة وأجبان إيطالية.',
    displayOrder: 4,
    isVisible: true,
    imageUrl: '/tenants/areej/assets/cat-pizza.jpg'
  },
  {
    id: 'cat-sandwiches',
    tenantId: 'areej',
    nameEn: 'Sandwiches & Burgers',
    nameAr: 'الساندوتشات والبرجر',
    descriptionEn: 'Gourmet burgers and handcrafted premium sandwiches.',
    descriptionAr: 'ساندوتشات وبرجر شهي محضرة من أجود اللحوم والدجاج والصلصات.',
    displayOrder: 5,
    isVisible: true,
    imageUrl: '/tenants/areej/assets/cat-sandwiches.jpg'
  },
  {
    id: 'cat-pasta',
    tenantId: 'areej',
    nameEn: 'Pasta & Risotto',
    nameAr: 'الباستا والروزيتو',
    descriptionEn: 'Authentic Italian pasta creations and creamy saffron risottos.',
    descriptionAr: 'أطباق باستا إيطالية وروزيتو بالكريمة والزعفران والترافل الفاخر.',
    displayOrder: 6,
    isVisible: true,
    imageUrl: '/tenants/areej/assets/cat-pasta.jpg'
  },
  {
    id: 'cat-main',
    tenantId: 'areej',
    nameEn: 'Main Dishes',
    nameAr: 'الأطباق الرئيسية',
    descriptionEn: 'Chef specialty cuts, prime steaks, and ocean-fresh seafood.',
    descriptionAr: 'أطباق رئيسية فاخرة من الستيك البقري والسالمون والجمبري المشوي.',
    displayOrder: 7,
    isVisible: true,
    imageUrl: '/tenants/areej/assets/cat-main.jpg'
  },
  {
    id: 'cat-dessert',
    tenantId: 'areej',
    nameEn: 'Dessert',
    nameAr: 'الحلا',
    descriptionEn: 'Decadent sweets, French toast, and warm desserts.',
    descriptionAr: 'حلويات فاخرة من الفرنش توست والوافل والكريب وأم علي الشهية.',
    displayOrder: 8,
    isVisible: true,
    imageUrl: '/tenants/areej/assets/cat-dessert.jpg'
  },
  {
    id: 'cat-hot-drinks',
    tenantId: 'areej',
    nameEn: 'Hot Drinks',
    nameAr: 'المشروبات الساخنة',
    descriptionEn: 'Specialty single-origin coffees, lattes, and premium teas.',
    descriptionAr: 'قهوة مختصة، لاتيه ساخن، شاي تركي ومكسيك وعربي مميز.',
    displayOrder: 9,
    isVisible: true,
    imageUrl: '/tenants/areej/assets/cat-hot-drinks.jpg'
  },
  {
    id: 'cat-cold-drinks',
    tenantId: 'areej',
    nameEn: 'Cold Drinks',
    nameAr: 'المشروبات الباردة',
    descriptionEn: 'Refreshing iced lattes, artisan matchas, smoothies, and mojitos.',
    descriptionAr: 'مشروبات مثلجة منعشة، آيس ماتشا، سموذي طبيعي وموهيتو منعش.',
    displayOrder: 10,
    isVisible: true,
    imageUrl: '/tenants/areej/assets/cat-cold-drinks.jpg'
  }
];

const rawProducts = [
  // --- SALADS (5) ---
  {
    id: 'areej-p-01',
    categoryId: 'cat-salads',
    nameEn: 'Ricola Beetroot Salad',
    nameAr: 'سلطة ريكولا بالبنجر',
    descriptionEn: 'Fresh arugula with orange and pomegranate slices, crunchy almonds, and feta cheese Served with a balsamic, honey, and olive oil dressing',
    descriptionAr: 'جرجير طازج مع شرائح البرتقال والرمان واللوز المقرمش وجبنة الفيتا تُقدم مع صوص البلسمك والعسل وزيت الزيتون',
    price: 41,
    calories: 430,
    imageUrl: '/tenants/areej/assets/cat-salads.jpg',
    isFeatured: true,
    isPopular: true
  },
  {
    id: 'areej-p-02',
    categoryId: 'cat-salads',
    nameEn: "Areej's Salad",
    nameAr: 'سلطة أريج',
    descriptionEn: "Grilled chicken pieces with kale, cherry tomatoes, almonds, pomegranate, and Parmesan cheese, topped with the chef's signature sauce.",
    descriptionAr: 'قطع دجاج مشوي مع خس كيل وطماطم شيري ولوز ورمان وجبنة بارميزان، مع صوص الشيف المميز',
    price: 45,
    calories: 581,
    imageUrl: '/tenants/areej/assets/cat-salads.jpg',
    isFeatured: true,
    isRecommended: true,
    isPopular: true
  },
  {
    id: 'areej-p-03',
    categoryId: 'cat-salads',
    nameEn: 'Chicken Caesar Salad / Crispy Chicken',
    nameAr: 'سلطة سيزر دجاج / كرسبي دجاج',
    descriptionEn: 'Fresh Americano lettuce with grilled chicken pieces (or crispy chicken), toasted croutons, Parmesan cheese, and rich Caesar dressing',
    descriptionAr: 'خس الأمريكي الطازج مع قطع دجاج مشوي (أو دجاج كرسبي مقرمش) خبز الكروتون المحمص وجبنة بارميزان وصوص السيزر الغني',
    price: 42,
    calories: 396,
    imageUrl: '/tenants/areej/assets/cat-salads.jpg',
    isPopular: true
  },
  {
    id: 'areej-p-04',
    categoryId: 'cat-salads',
    nameEn: 'Avocado Salad',
    nameAr: 'سلطة أفوكادو',
    descriptionEn: "A rich blend of baby spinach with sliced avocado, red berries, walnuts, raisins, goat's cheese, and a touch of pomegranate molasses and balsamic.",
    descriptionAr: 'تركيبة غنية من بيبي سبانخ مع شرائح الأفوكادو والتوت الأحمر وعين الجمل والزبيب وجبنة الماعز والقليل من دبس الرمان والبلسمك',
    price: 43,
    calories: 633,
    imageUrl: '/tenants/areej/assets/cat-salads.jpg',
    isRecommended: true
  },
  {
    id: 'areej-p-05',
    categoryId: 'cat-salads',
    nameEn: 'Quinoa Salad with Mango',
    nameAr: 'سلطة كينوا بالمانجو',
    descriptionEn: "Quinoa with mango and fresh fruit pieces (mango, strawberry, blueberry, raspberry, and pomegranate) served with the chef's signature sauce",
    descriptionAr: 'حبوب الكينوا مع المانجو وقطع الفواكه الطازجة (مانجو، فراولة، بلوبيري، رازيبري، ورمان) تُقدم مع صوص الشيف المميز',
    price: 41,
    calories: 415,
    imageUrl: '/tenants/areej/assets/cat-salads.jpg'
  },

  // --- SOUP (2) ---
  {
    id: 'areej-p-06',
    categoryId: 'cat-soup',
    nameEn: 'Chicken Soup',
    nameAr: 'شوربة دجاج',
    descriptionEn: 'A rich and creamy soup made with chicken pieces and cream. Served hot with a creamy texture and distinctive flavor.',
    descriptionAr: 'شوربة غنية وكريمية محضرة من قطع الدجاج والكريمة تقدم ساخنة بقوام كريمي ونكهة مميزة',
    price: 39,
    calories: 815,
    imageUrl: '/tenants/areej/assets/cat-soup.jpg',
    isPopular: true
  },
  {
    id: 'areej-p-07',
    categoryId: 'cat-soup',
    nameEn: 'Mushroom Soup',
    nameAr: 'شوربة مشروم',
    descriptionEn: 'A luxurious blend of fresh mushrooms and rich cream gives you a smooth texture and a deep, warm flavor in every spoonful.',
    descriptionAr: 'مزيج فاخر من الفطر الطازج والكريمة الغنية، يمنحك قوامًا ناعمًا ونكهة عميقة ودافئة في كل ملعقة',
    price: 39,
    calories: 1096,
    imageUrl: '/tenants/areej/assets/cat-soup.jpg',
    isFeatured: true,
    isRecommended: true
  },

  // --- APPETIZERS (8) ---
  {
    id: 'areej-p-08',
    categoryId: 'cat-appetizers',
    nameEn: 'Chicken Dynamite',
    nameAr: 'ديناميت دجاج',
    descriptionEn: 'Crispy chicken pieces coated in spicy dynamite sauce',
    descriptionAr: 'قطع دجاج مقرمشة مغطاة بصوص الديناميت الحار',
    price: 48,
    calories: 580,
    imageUrl: '/tenants/areej/assets/cat-appetizers.jpg',
    isPopular: true
  },
  {
    id: 'areej-p-09',
    categoryId: 'cat-appetizers',
    nameEn: 'Dynamite Shrimp',
    nameAr: 'ديناميت شرمب',
    descriptionEn: 'Crispy shrimp drenched in spicy dynamite sauce',
    descriptionAr: 'حبات جمبري مقرمشة مغمورة بصوص الديناميت الحار',
    price: 63,
    calories: 520,
    imageUrl: '/tenants/areej/assets/cat-appetizers.jpg',
    isFeatured: true,
    isPopular: true
  },
  {
    id: 'areej-p-10',
    categoryId: 'cat-appetizers',
    nameEn: 'Mozzarella Sticks',
    nameAr: 'أصابع موزاريلا',
    descriptionEn: 'Abundant and crispy mozzarella cheese',
    descriptionAr: 'جبنة الموزاريلا الغزيرة والمقرمشة',
    price: 39,
    calories: 464,
    imageUrl: '/tenants/areej/assets/cat-appetizers.jpg'
  },
  {
    id: 'areej-p-11',
    categoryId: 'cat-appetizers',
    nameEn: 'Arancini Roseto',
    nameAr: 'أرانشيني روزيتو',
    descriptionEn: 'Fried risotto balls with an Italian flair, stuffed with mushrooms and mozzarella, served with a rich truffle sauce.',
    descriptionAr: 'كرات روزيتو المقلية بالنكهة الإيطالية محشية بالمشروم والموزاريلا تقدم مع صوص الترافل الغني',
    price: 49,
    calories: 691,
    imageUrl: '/tenants/areej/assets/cat-appetizers.jpg',
    isRecommended: true
  },
  {
    id: 'areej-p-12',
    categoryId: 'cat-appetizers',
    nameEn: 'Crispy Chicken',
    nameAr: 'دجاج مقرمش',
    descriptionEn: 'Crispy chicken fingers served with French fries and a special sauce',
    descriptionAr: 'أصابع دجاج مقرمشة تقدم مع بطاطس مقلية وصوص مميز',
    price: 47,
    calories: 1122,
    imageUrl: '/tenants/areej/assets/cat-appetizers.jpg'
  },
  {
    id: 'areej-p-13',
    categoryId: 'cat-appetizers',
    nameEn: 'Crispy Shrimp',
    nameAr: 'كرسبي جمبري',
    descriptionEn: 'Fried shrimp pieces with French fries and a delicious spicy sauce',
    descriptionAr: 'قطع الروبيان المقلى مع بطاطس مقلية وصوص السبياسي اللذيذ',
    price: 79,
    calories: 792,
    imageUrl: '/tenants/areej/assets/cat-appetizers.jpg',
    isPopular: true
  },
  {
    id: 'areej-p-14',
    categoryId: 'cat-appetizers',
    nameEn: 'Buffalo Chicken',
    nameAr: 'بافلو دجاج',
    descriptionEn: 'Chicken pieces in a spicy buffalo sauce with a delicious mix of cheeses and jalapeños',
    descriptionAr: 'قطع دجاج بصوص البافلو الحار مع مكس الأجبان اللذيذة وهالابينو',
    price: 53,
    calories: 1400,
    imageUrl: '/tenants/areej/assets/cat-appetizers.jpg'
  },
  {
    id: 'areej-p-15',
    categoryId: 'cat-appetizers',
    nameEn: 'Chili Cheese Fries',
    nameAr: 'تشيلي تشيز فرايز',
    descriptionEn: 'French fries topped with minced meat and melted cheese sauce and a mix of cheeses and jalapeños',
    descriptionAr: 'بطاطس مقلية مضاف إليها اللحم المفروم وصوص الجبنة الذائبة ومكس أجبان وهالابينو',
    price: 51,
    calories: 2000,
    imageUrl: '/tenants/areej/assets/cat-appetizers.jpg'
  },

  // --- PIZZA (6) ---
  {
    id: 'areej-p-16',
    categoryId: 'cat-pizza',
    nameEn: 'Margherita Pizza',
    nameAr: 'بيتزا مارجريتا',
    descriptionEn: 'Classic pizza sauce, mozzarella cheese, parmesan cheese, fresh basil, and olive oil.',
    descriptionAr: 'صلصة البيتزا الكلاسيكية، جبنة موزاريلا، جبنة بارميزان، ريحان طازج، وزيت زيتون',
    price: 67,
    calories: 1105,
    imageUrl: '/tenants/areej/assets/cat-pizza.jpg',
    isFeatured: true,
    isPopular: true
  },
  {
    id: 'areej-p-17',
    categoryId: 'cat-pizza',
    nameEn: 'Pepperoni Pizza',
    nameAr: 'بيتزا بيبروني',
    descriptionEn: 'Pizza sauce, mozzarella cheese, pepperoni slices, Parmesan cheese, and olive oil',
    descriptionAr: 'صلصة بيتزا، جبنة موزاريلا، شرائح البيبروني، جبنة بارميزان، وزيت زيتون',
    price: 75,
    calories: 1364,
    imageUrl: '/tenants/areej/assets/cat-pizza.jpg',
    isPopular: true
  },
  {
    id: 'areej-p-18',
    categoryId: 'cat-pizza',
    nameEn: 'Pizza Ranch',
    nameAr: 'بيتزا رانش',
    descriptionEn: 'Chicken pieces, rich ranch dressing, mozzarella cheese, and parmesan cheese',
    descriptionAr: 'قطع دجاج، صوص رانش غني، جبنة موزاريلا، وجبنة بارميزان',
    price: 78,
    calories: 1659,
    imageUrl: '/tenants/areej/assets/cat-pizza.jpg'
  },
  {
    id: 'areej-p-19',
    categoryId: 'cat-pizza',
    nameEn: 'Chicken Musakhan Pizza',
    nameAr: 'بيتزا مسخن دجاج',
    descriptionEn: 'Chicken pieces, mozzarella cheese, and parmesan cheese',
    descriptionAr: 'قطع دجاج، جبنة موزاريلا، وجبنة بارميزان',
    price: 80,
    calories: 1289,
    imageUrl: '/tenants/areej/assets/cat-pizza.jpg'
  },
  {
    id: 'areej-p-20',
    categoryId: 'cat-pizza',
    nameEn: 'Areej Pizza',
    nameAr: 'بيتزا أريج',
    descriptionEn: "A combination of grilled chicken and smoked turkey, along with the chef's signature sauce, mozzarella, and parmesan cheese.",
    descriptionAr: 'مزيج من الدجاج المشوي والتركي المدخن وصوص الشيف المميز والموزاريلا وجبنة البارميزان',
    price: 83,
    calories: 2043,
    imageUrl: '/tenants/areej/assets/cat-pizza.jpg',
    isFeatured: true,
    isRecommended: true,
    isPopular: true
  },
  {
    id: 'areej-p-21',
    categoryId: 'cat-pizza',
    nameEn: 'Seafood Pizza',
    nameAr: 'بيتزا سي فود',
    descriptionEn: 'Neapolitan seafood pizza is distinguished by its combination of classic Neapolitan dough and the taste of fresh seafood.',
    descriptionAr: 'تتميز بيتزا نابولي بالسي فود يجمعها بين العجينه النابولي الكلاسيكيه وطعم البحريات الطازجه',
    price: 91,
    calories: 1090,
    imageUrl: '/tenants/areej/assets/cat-pizza.jpg'
  },

  // --- SANDWICHES (8) ---
  {
    id: 'areej-p-22',
    categoryId: 'cat-sandwiches',
    nameEn: 'Club Sandwich',
    nameAr: 'كلوب ساندوتش',
    descriptionEn: 'Toast slices stuffed with chicken, smoked turkey, fried egg, and cheddar cheese. Add lettuce and tomatoes. Served with French fries.',
    descriptionAr: 'شرائح توست محشية بالدجاج والتركي المدخن والبيض المقلي وجبنة الشيدر مع إضافة الخس والطماطم تقدم مع بطاطس مقلي',
    price: 49,
    calories: 914,
    imageUrl: '/tenants/areej/assets/cat-sandwiches.jpg',
    isPopular: true
  },
  {
    id: 'areej-p-23',
    categoryId: 'cat-sandwiches',
    nameEn: 'Philly Steak Sandwich',
    nameAr: 'فيلي ستيك ساندوتش',
    descriptionEn: 'Beef steak slices with caramelized onions, bell peppers, and mushrooms and a mix of cheeses with cheddar sauce, served with potatoes',
    descriptionAr: 'شرائح لحم ستيك بقر مع البصل المكرمل والفلفل الألوان والمشروم ومكس الأجبان مع صوص الشيدر يقدم مع بطاطس',
    price: 58,
    calories: 1033,
    imageUrl: '/tenants/areej/assets/cat-sandwiches.jpg',
    isFeatured: true,
    isPopular: true
  },
  {
    id: 'areej-p-24',
    categoryId: 'cat-sandwiches',
    nameEn: 'Chicken Quesadilla',
    nameAr: 'كاساديا دجاج',
    descriptionEn: 'Tortilla bread filled with marinated chicken and bell peppers, cheeses, served with sour cream sauce and potatoes.',
    descriptionAr: 'خبز ترتيلا محشو بالدجاج المتبل وفلفل ألوان و مكس أجبان، يقدم مع صوص الساور كريم والبطاطس',
    price: 49,
    calories: 1372,
    imageUrl: '/tenants/areej/assets/cat-sandwiches.jpg'
  },
  {
    id: 'areej-p-25',
    categoryId: 'cat-sandwiches',
    nameEn: 'Chicken Burger',
    nameAr: 'برجر دجاج',
    descriptionEn: 'A chicken patty with cheddar cheese, lettuce, and tomato. Our special burger sauce is served with French fries.',
    descriptionAr: 'قطعة دجاج مع جبنة الشيدر وإضافة الخس والطماطم وصوص البرجر الخاص يقدم مع بطاطس مقلية',
    price: 43,
    calories: 907,
    imageUrl: '/tenants/areej/assets/cat-sandwiches.jpg'
  },
  {
    id: 'areej-p-26',
    categoryId: 'cat-sandwiches',
    nameEn: 'Classic Burger',
    nameAr: 'كلاسيك برجر',
    descriptionEn: 'A beef patty with mushrooms, caramelized onions, cheddar cheese, and sauce. The signature burger is topped with lettuce and tomato, and served with fries.',
    descriptionAr: 'قطعة لحم بقر مع المشروم والبصل المكرمل وجبنة شيدر وصوص البرجر المميز مع إضافة الخس والطماطم ويقدم مع بطاطس',
    price: 51,
    calories: 900,
    imageUrl: '/tenants/areej/assets/cat-sandwiches.jpg',
    isPopular: true
  },
  {
    id: 'areej-p-27',
    categoryId: 'cat-sandwiches',
    nameEn: 'Mushroom Burger',
    nameAr: 'مشروم برجر',
    descriptionEn: 'A patty of beef rich in creamy mushroom sauce, topped with cheddar cheese and French fries.',
    descriptionAr: 'قطعة لحم بقر غنية بصلصة الكريمة والمشروم مع جبن الشيدر والبطاطس المقلية',
    price: 56,
    calories: 1385,
    imageUrl: '/tenants/areej/assets/cat-sandwiches.jpg'
  },
  {
    id: 'areej-p-28',
    categoryId: 'cat-sandwiches',
    nameEn: 'Mini Burger',
    nameAr: 'ميني برجر',
    descriptionEn: '3 mini beef burgers with cheddar cheese Signature burger sauce and French fries',
    descriptionAr: '3 قطع ميني برجر لحم بقر مع جبنة الشيدر وصوص البرجر المميز والبطاطس المقلية',
    price: 43,
    calories: 987,
    imageUrl: '/tenants/areej/assets/cat-sandwiches.jpg'
  },
  {
    id: 'areej-p-29',
    categoryId: 'cat-sandwiches',
    nameEn: 'Halloumi Sandwich',
    nameAr: 'حلومي ساندوتش',
    descriptionEn: "Grilled halloumi cheese with vegetables and sauce Chef's style pesto served with ketchup and fries",
    descriptionAr: 'جبنة حلومي مشوية مع الخضار وصوص البيستو على طريقة الشيف تقدم بالكاتشب مع البطاطس',
    price: 37,
    calories: 650,
    imageUrl: '/tenants/areej/assets/cat-sandwiches.jpg'
  },

  // --- PASTA & RISOTTO (9) ---
  {
    id: 'areej-p-30',
    categoryId: 'cat-pasta',
    nameEn: 'Areej Pasta (Chicken)',
    nameAr: 'أريج باستا دجاج',
    descriptionEn: 'Rigatoni pasta with chicken pieces in a creamy pink sauce Crushed red pepper topped with mozzarella and parmesan',
    descriptionAr: 'مكرونة ريجاتوني مع قطع الدجاج بصوص البينك الكريمي وفلفل أحمر مجروش مضاف إليها الموزاريلا والبارميزان',
    price: 57,
    calories: 1715,
    imageUrl: '/tenants/areej/assets/cat-pasta.jpg',
    isFeatured: true,
    isPopular: true
  },
  {
    id: 'areej-p-31',
    categoryId: 'cat-pasta',
    nameEn: 'Areej Pasta (Shrimp)',
    nameAr: 'أريج باستا جمبري',
    descriptionEn: 'Shrimp Rigatoni Pasta in a Creamy Pink Sauce Crushed Red Pepper Topped with Mozzarella and Parmesan',
    descriptionAr: 'مكرونة ريجاتوني بالجمبري بصوص البينك الكريمي وفلفل أحمر مجروش مضاف إليها الموزاريلا والبارميزان',
    price: 70,
    calories: 1715,
    imageUrl: '/tenants/areej/assets/cat-pasta.jpg',
    isFeatured: true
  },
  {
    id: 'areej-p-32',
    categoryId: 'cat-pasta',
    nameEn: 'Penne Pink (Chicken)',
    nameAr: 'بيني بينك دجاج',
    descriptionEn: 'Penne pasta with creamy pink sauce and chicken parmesan',
    descriptionAr: 'مكرونة بيني مع صوص البينك الكريمي وجبنة البارميزان بالدجاج',
    price: 56,
    calories: 1715,
    imageUrl: '/tenants/areej/assets/cat-pasta.jpg'
  },
  {
    id: 'areej-p-33',
    categoryId: 'cat-pasta',
    nameEn: 'Penne Pink (Shrimp)',
    nameAr: 'بيني بينك جمبري',
    descriptionEn: 'Penne pasta with creamy pink sauce and shrimp parmesan cheese',
    descriptionAr: 'مكرونة بيني مع صوص البينك الكريمي وجبنة البارميزان بالجمبري',
    price: 70,
    calories: 1715,
    imageUrl: '/tenants/areej/assets/cat-pasta.jpg'
  },
  {
    id: 'areej-p-34',
    categoryId: 'cat-pasta',
    nameEn: 'Fettuccine (Chicken)',
    nameAr: 'فتوتشيني دجاج',
    descriptionEn: 'Fettuccine pasta with a rich, creamy white sauce and mushrooms Fresh chicken and Parmesan cheese',
    descriptionAr: 'مكرونة فتوتشيني بصوص أبيض غني بالكريمة والمشروم الطازج وجبنة البارميزان بالدجاج',
    price: 55,
    calories: 1810,
    imageUrl: '/tenants/areej/assets/cat-pasta.jpg',
    isPopular: true
  },
  {
    id: 'areej-p-35',
    categoryId: 'cat-pasta',
    nameEn: 'Fettuccine (Shrimp)',
    nameAr: 'فتوتشيني جمبري',
    descriptionEn: 'Fettuccine pasta with a rich, creamy white sauce and mushrooms Fresh Parmesan cheese with shrimp',
    descriptionAr: 'مكرونة فتوتشيني بصوص أبيض غني بالكريمة والمشروم الطازج وجبنة البارميزان بالجمبري',
    price: 70,
    calories: 1810,
    imageUrl: '/tenants/areej/assets/cat-pasta.jpg'
  },
  {
    id: 'areej-p-36',
    categoryId: 'cat-pasta',
    nameEn: 'Risotto (Chicken)',
    nameAr: 'روزيتو دجاج',
    descriptionEn: 'The famous Italian dish with a creamy texture and Parmesan cheese with chicken, mushrooms, and saffron.',
    descriptionAr: 'الطبق الإيطالي الشهير بقوام كريمي مع جبنة البارميزان مع إضافة (دجاج / مشروم / زعفران)',
    price: 54,
    calories: 1715,
    imageUrl: '/tenants/areej/assets/cat-pasta.jpg'
  },
  {
    id: 'areej-p-37',
    categoryId: 'cat-pasta',
    nameEn: 'Risotto (Shrimp)',
    nameAr: 'روزيتو جمبري',
    descriptionEn: 'The famous Italian dish with a creamy texture and Parmesan cheese with shrimp, mushrooms, and saffron.',
    descriptionAr: 'الطبق الإيطالي الشهير بقوام كريمي مع جبنة البارميزان مع إضافة (جمبري / مشروم / زعفران)',
    price: 70,
    calories: 1715,
    imageUrl: '/tenants/areej/assets/cat-pasta.jpg',
    isRecommended: true
  },
  {
    id: 'areej-p-38',
    categoryId: 'cat-pasta',
    nameEn: 'Lasagna',
    nameAr: 'لازانيا',
    descriptionEn: 'Thin layers of lasagna with fresh tomato sauce, minced meat, and melted cheese',
    descriptionAr: 'طبقات رقيقة من اللازانيا مع صوص الطماطم الطازج واللحم المفروم والجبنة الذائبة',
    price: 57,
    calories: 600,
    imageUrl: '/tenants/areej/assets/cat-pasta.jpg'
  },

  // --- MAIN DISHES (5) ---
  {
    id: 'areej-p-39',
    categoryId: 'cat-main',
    nameEn: 'Steak Cubes',
    nameAr: 'مكعبات لحم',
    descriptionEn: 'Premium beef cubes seared at high heat to achieve the perfect sear while remaining tender inside, coated in a poivre sauce rich in crushed peppercorns and cream.',
    descriptionAr: 'مكعبات لحم بقري فاخرة مطهي على حرارة عالية للوصول إلى التحمير المثالي والطراوة من الداخل مغطى بصوص بوافر الغني بالفلفل المجروش والكريمة',
    price: 116,
    calories: 545,
    imageUrl: '/tenants/areej/assets/cat-main.jpg',
    isFeatured: true,
    isPopular: true
  },
  {
    id: 'areej-p-40',
    categoryId: 'cat-main',
    nameEn: 'Grilled Chicken',
    nameAr: 'جريلد تشكن',
    descriptionEn: "Grilled chicken breasts with mushroom and po'oeuvres sauce Served with mashed potatoes and sautéed vegetables",
    descriptionAr: 'صدور دجاج مشوية بصوص مشروم و بوافر تقدم مع بطاطس بيوريه وخضار سوتيه',
    price: 102,
    calories: 730,
    imageUrl: '/tenants/areej/assets/cat-main.jpg'
  },
  {
    id: 'areej-p-41',
    categoryId: 'cat-main',
    nameEn: 'Salmon Butter Lemon',
    nameAr: 'سالمون بتر ليمون',
    descriptionEn: 'Fresh salmon fillet in a rich lemon butter sauce Served with mashed potatoes and sautéed vegetables',
    descriptionAr: 'فيليه سالمون طازج بصوص الزبدة والليمون الغني يقدم مع بطاطس بيوريه وخضار سوتيه',
    price: 146,
    calories: 1000,
    imageUrl: '/tenants/areej/assets/cat-main.jpg',
    isFeatured: true,
    isRecommended: true
  },
  {
    id: 'areej-p-42',
    categoryId: 'cat-main',
    nameEn: 'Grilled Shrimp',
    nameAr: 'جمبري مشوي',
    descriptionEn: 'Grilled shrimp with a sweet potato base, sweet and creamy with a touch of spicy sriracha',
    descriptionAr: 'حبات جمبري مشوية مع قاعدة بطاطا حلوة والكريمة ولمسة سريراشا حارة',
    price: 97,
    calories: 865,
    imageUrl: '/tenants/areej/assets/cat-main.jpg'
  },
  {
    id: 'areej-p-43',
    categoryId: 'cat-main',
    nameEn: 'Grilled Steak',
    nameAr: 'جريلد ستيك',
    descriptionEn: 'A grilled steak served with sautéed vegetables, potato wedges, and a generous portion of poivre sauce.',
    descriptionAr: 'قطعة ستيك مشوي يقدم مع السوتيه وبطاطس ويدجز وصوص بوافر',
    price: 150,
    calories: 830,
    imageUrl: '/tenants/areej/assets/cat-main.jpg',
    isFeatured: true
  },

  // --- DESSERT (4) ---
  {
    id: 'areej-p-44',
    categoryId: 'cat-dessert',
    nameEn: 'Waffles',
    nameAr: 'الوافل',
    descriptionEn: 'Original waffles with Nutella, fresh strawberries, banana slices, and ice cream',
    descriptionAr: 'الوافل المحمر بالطريقة الأصلية مع النوتيلا وقطع الفراولة والموز والآيس كريم',
    price: 46,
    calories: 550,
    imageUrl: '/tenants/areej/assets/cat-dessert.jpg',
    isPopular: true
  },
  {
    id: 'areej-p-45',
    categoryId: 'cat-dessert',
    nameEn: 'Crepes',
    nameAr: 'الكريب',
    descriptionEn: 'Thin delicate crepes filled with Nutella, fresh strawberry and banana slices served with ice cream',
    descriptionAr: 'قطعة الكريب الرقيقة المحشية بالنوتيلا وقطع الفراولة والموز تقدم مع الآيس كريم',
    price: 46,
    calories: 550,
    imageUrl: '/tenants/areej/assets/cat-dessert.jpg'
  },
  {
    id: 'areej-p-46',
    categoryId: 'cat-dessert',
    nameEn: 'French Toast',
    nameAr: 'فرنش توست',
    descriptionEn: 'French toast topped with cream and toasted in butter Served with pistachio sauce and fresh berries',
    descriptionAr: 'خبز الفرنش توست المغطى بالكريمة والمحمر بالزبدة يقدم مع صوص بستاشيو والفواكه',
    price: 49,
    calories: 400,
    imageUrl: '/tenants/areej/assets/cat-dessert.jpg',
    isFeatured: true,
    isRecommended: true,
    isPopular: true
  },
  {
    id: 'areej-p-47',
    categoryId: 'cat-dessert',
    nameEn: 'Umm Ali',
    nameAr: 'أم علي',
    descriptionEn: 'Flaky puff pastry layers mixed with pistachios and raisins and almonds and coconut with warm milk, vanilla, and sugar',
    descriptionAr: 'طبقات البف بستري الهشة ممزوجة بالفستق والزبيب واللوز وجوز الهند مع الحليب الحار والفانيليا والسكر',
    price: 38,
    calories: 500,
    imageUrl: '/tenants/areej/assets/cat-dessert.jpg'
  },

  // --- HOT DRINKS (22) ---
  { id: 'areej-p-48', categoryId: 'cat-hot-drinks', nameEn: 'Espresso', nameAr: 'إسبريسو', descriptionEn: 'Intense single or double shot of rich espresso.', descriptionAr: 'شوت إسبريسو غني ومركز محضر من أجود حبوب البن.', price: 21, calories: 15 },
  { id: 'areej-p-49', categoryId: 'cat-hot-drinks', nameEn: 'Americano', nameAr: 'أمريكانو', descriptionEn: 'Espresso diluted with hot water for a smooth brew.', descriptionAr: 'شوت إسبريسو ممدد بالماء الساخن بنكهة متوازنة.', price: 23, calories: 3 },
  { id: 'areej-p-50', categoryId: 'cat-hot-drinks', nameEn: 'Macchiato', nameAr: 'ماكياتو', descriptionEn: 'Espresso topped with a dollop of foamed milk.', descriptionAr: 'شوت إسبريسو مع لمسة من رغوة الحليب المخفوق.', price: 25, calories: 15 },
  { id: 'areej-p-51', categoryId: 'cat-hot-drinks', nameEn: 'Cortado', nameAr: 'كورتادو', descriptionEn: 'Equal parts rich espresso and warm steamed milk.', descriptionAr: 'مزيج متساوٍ من الإسبريسو المركز والحليب المبخر.', price: 27, calories: 105 },
  { id: 'areej-p-52', categoryId: 'cat-hot-drinks', nameEn: 'Flat White', nameAr: 'فلات وايت', descriptionEn: 'Smooth microfoam poured over a double ristretto shot.', descriptionAr: 'إسبريسو دبل مع حليب مبخر برغوة مخملية ناعمة.', price: 27, calories: 145, isPopular: true },
  { id: 'areej-p-53', categoryId: 'cat-hot-drinks', nameEn: 'Latte', nameAr: 'لاتيه', descriptionEn: 'Classic espresso with steamed milk and a delicate layer of foam.', descriptionAr: 'قهوة لاتيه كلاسيكية ناعمة بالحليب المبخر.', price: 27, calories: 170 },
  { id: 'areej-p-54', categoryId: 'cat-hot-drinks', nameEn: 'Spanish Latte', nameAr: 'سبانيش لاتيه', descriptionEn: 'Espresso infused with sweetened condensed milk and steamed milk.', descriptionAr: 'لاتيه إسباني مميز بمزيج الحليب المكثف المحلى ونكهة القهوة الغنية.', price: 29, calories: 320, isFeatured: true, isPopular: true },
  { id: 'areej-p-55', categoryId: 'cat-hot-drinks', nameEn: 'Caramel Latte', nameAr: 'كراميل لاتيه', descriptionEn: 'Velvety latte swirled with buttery caramel syrup.', descriptionAr: 'لاتيه فاخر بنكهة صوص الكراميل الغني.', price: 29, calories: 380 },
  { id: 'areej-p-56', categoryId: 'cat-hot-drinks', nameEn: 'Chocolate Latte', nameAr: 'شوكليت لاتيه', descriptionEn: 'A sweet harmony of espresso, premium chocolate, and milk.', descriptionAr: 'مزيج رائع من القهوة والشوكولاتة الفاخرة والحليب.', price: 31, calories: 350 },
  { id: 'areej-p-57', categoryId: 'cat-hot-drinks', nameEn: 'White Mocha', nameAr: 'وايت موكا', descriptionEn: 'Espresso blended with creamy white chocolate and steamed milk.', descriptionAr: 'مزيج إسبريسو مع الشوكولاتة البيضاء الذائبة والحليب المبخر.', price: 29, calories: 320 },
  { id: 'areej-p-58', categoryId: 'cat-hot-drinks', nameEn: 'Mocha Latte', nameAr: 'موكا لاتيه', descriptionEn: 'Rich espresso and dark cocoa combined with silky milk.', descriptionAr: 'شوكولاتة داكنة مع الإسبريسو والحليب المبخر.', price: 29, calories: 365 },
  { id: 'areej-p-59', categoryId: 'cat-hot-drinks', nameEn: 'Coffee of the Day', nameAr: 'قهوة اليوم', descriptionEn: 'Freshly brewed specialty filter coffee of the day.', descriptionAr: 'قهوة اليوم المقطرة الطازجة من محاصيل مختارة.', price: 10, calories: 7, isPopular: true },
  { id: 'areej-p-60', categoryId: 'cat-hot-drinks', nameEn: 'V60 (Ethiopian, Colombian, Brazilian)', nameAr: 'V60 (أثيوبي ، كولومبي ، برازيلي)', descriptionEn: 'Artisan hand-poured specialty coffee using premium Ethiopian, Colombian, or Brazilian beans.', descriptionAr: 'قهوة مقطرة يدويًا بأداة V60 بمحاصيل بن فاخرة (أثيوبي، كولومبي، برازيلي).', price: 25, calories: 12, isFeatured: true, isPopular: true },
  { id: 'areej-p-61', categoryId: 'cat-hot-drinks', nameEn: 'Turkish Coffee', nameAr: 'قهوة تركية', descriptionEn: 'Traditional slow-cooked Turkish coffee with thick aromatic crema.', descriptionAr: 'قهوة تركية تقليدية محضرة على الرمل برغوة غنية.', price: 27, calories: 190 },
  { id: 'areej-p-62', categoryId: 'cat-hot-drinks', nameEn: 'French Coffee', nameAr: 'قهوة فرنسية', descriptionEn: 'Smooth coffee brewed with milk and hazelnut notes.', descriptionAr: 'قهوة فرنسية بنكهة البندق الغنية والحليب المخملي.', price: 32, calories: 270 },
  { id: 'areej-p-63', categoryId: 'cat-hot-drinks', nameEn: 'Saudi Coffee', nameAr: 'قهوة سعودي', descriptionEn: 'Traditional authentic Arabic coffee infused with cardamom and saffron.', descriptionAr: 'دلة قهوة سعودية أصيلة بالهيل والزعفران الفاخر.', price: 36, calories: 20, isFeatured: true },
  { id: 'areej-p-64', categoryId: 'cat-hot-drinks', nameEn: 'Mix Tea', nameAr: 'شاي مكس', descriptionEn: 'Special blended aromatic herbal and black tea infusion.', descriptionAr: 'شاي مكس مميز بتوليفة أعشاب عطرية مختارة.', price: 27, calories: 120 },
  { id: 'areej-p-65', categoryId: 'cat-hot-drinks', nameEn: 'Hot Chocolate', nameAr: 'شوكولاتة ساخنة', descriptionEn: 'Decadent creamy hot chocolate topped with foam.', descriptionAr: 'شوكولاتة ساخنة غنية وكثيفة مع رغوة كريمية.', price: 31, calories: 335 },
  { id: 'areej-p-66', categoryId: 'cat-hot-drinks', nameEn: 'Cappuccino', nameAr: 'كابتشينو', descriptionEn: 'Classic Italian cappuccino with equal parts espresso, milk, and thick froth.', descriptionAr: 'كابتشينو إيطالي كلاسيكي مع رغوة حليب سميكة ورشة كاكاو.', price: 27, calories: 135 },
  { id: 'areej-p-67', categoryId: 'cat-hot-drinks', nameEn: 'Red Tea', nameAr: 'شاي أحمر', descriptionEn: 'Finest Ceylon red tea brewed to perfection.', descriptionAr: 'شاي سيلاني أحمر فاخر ومخدر بعناية.', price: 25, calories: 180 },
  { id: 'areej-p-68', categoryId: 'cat-hot-drinks', nameEn: 'Green Tea', nameAr: 'شاي أخضر', descriptionEn: 'Light and refreshing antioxidant-rich green tea.', descriptionAr: 'شاي أخضر طبيعي منعش وصحي.', price: 25, calories: 180 },
  { id: 'areej-p-69', categoryId: 'cat-hot-drinks', nameEn: 'Koshary Tea', nameAr: 'شاي كشري', descriptionEn: 'Traditional Egyptian style brewed black tea.', descriptionAr: 'شاي كشري بالطريقة التقليدية المحببة.', price: 25, calories: 180 },

  // --- COLD DRINKS (18) ---
  { id: 'areej-p-70', categoryId: 'cat-cold-drinks', nameEn: 'Iced Latte', nameAr: 'آيس لاتيه', descriptionEn: 'Chilled espresso poured over fresh milk and ice.', descriptionAr: 'إسبريسو بارد مع الحليب الطازج والثلج.', price: 29, calories: 120, isPopular: true },
  { id: 'areej-p-71', categoryId: 'cat-cold-drinks', nameEn: 'Iced Caramel Latte', nameAr: 'آيس كراميل لاتيه', descriptionEn: 'Chilled latte swirled with caramel and ice.', descriptionAr: 'آيس لاتيه بارد بنكهة صوص الكراميل.', price: 31, calories: 280 },
  { id: 'areej-p-72', categoryId: 'cat-cold-drinks', nameEn: 'Iced Mocha Latte', nameAr: 'آيس موكا لاتيه', descriptionEn: 'Iced espresso with chocolate sauce and chilled milk.', descriptionAr: 'موكا مثلجة مع شوكولاتة وحليب بارد.', price: 31, calories: 300 },
  { id: 'areej-p-73', categoryId: 'cat-cold-drinks', nameEn: 'Iced White Mocha', nameAr: 'آيس وايت موكا', descriptionEn: 'Espresso over white chocolate and cold milk with ice.', descriptionAr: 'وايت موكا مثلجة مع شوكولاتة بيضاء وحليب طازج.', price: 31, calories: 300 },
  { id: 'areej-p-74', categoryId: 'cat-cold-drinks', nameEn: 'Iced Spanish Latte', nameAr: 'آيس سبانيش لاتيه', descriptionEn: 'Signature iced Spanish latte with sweet condensed milk.', descriptionAr: 'آيس سبانيش لاتيه مميز بالحليب المكثف المحلى ونكهة القهوة الغنية.', price: 31, calories: 265, isFeatured: true, isPopular: true },
  { id: 'areej-p-75', categoryId: 'cat-cold-drinks', nameEn: 'Iced Matcha Latte', nameAr: 'آيس ماتشا لاتيه', descriptionEn: 'Ceremonial grade Japanese matcha shaken with milk and ice.', descriptionAr: 'شاي ماتشا ياباني فاخر بارد مع الحليب المخفوق والثلج.', price: 29, calories: 265, isFeatured: true },
  { id: 'areej-p-76', categoryId: 'cat-cold-drinks', nameEn: 'Strawberry Cream Matcha', nameAr: 'ماتشا بكريمة الفراولة', descriptionEn: 'Layered iced matcha with sweet strawberry compote and cold cream.', descriptionAr: 'ماتشا مثلجة بطبقات كريمة الفراولة الطازجة المنعشة.', price: 31, calories: 325, isPopular: true },
  { id: 'areej-p-77', categoryId: 'cat-cold-drinks', nameEn: 'Mango Cream Matcha', nameAr: 'ماتشا بكريمة المانجو', descriptionEn: 'Exotic tropical mango purée layered with iced matcha and cream.', descriptionAr: 'ماتشا فاخرة بطبقة مهروس المانجو الاستوائي والكريمة الباردة.', price: 31, calories: 325 },
  { id: 'areej-p-78', categoryId: 'cat-cold-drinks', nameEn: 'Passion Fruit Cream Matcha', nameAr: 'ماتشا كريمة باشن فروت', descriptionEn: 'Zesty passion fruit fruit combined with chilled matcha cream.', descriptionAr: 'ماتشا باردة بنكهة الباشن فروت المنعشة وطبقة الكريمة المخملية.', price: 31, calories: 325 },
  { id: 'areej-p-79', categoryId: 'cat-cold-drinks', nameEn: 'Lemon Mint Smoothie', nameAr: 'سموذي ليمون بالنعناع', descriptionEn: 'Frosty freshly blended lemon juice and garden mint.', descriptionAr: 'سموذي ليمون ونعناع مثلج وطازج قمة في الانتعاش.', price: 27, calories: 210, isPopular: true },
  { id: 'areej-p-80', categoryId: 'cat-cold-drinks', nameEn: 'Lemon Raspberry Smoothie', nameAr: 'سموذي ليمون بالتوت', descriptionEn: 'Tangy blend of fresh lemons and sweet raspberries over crushed ice.', descriptionAr: 'سموذي ليمون وتوت بري مثلج متوازن الحموضة والحلاوة.', price: 27, calories: 230 },
  { id: 'areej-p-81', categoryId: 'cat-cold-drinks', nameEn: 'Watermelon Smoothie', nameAr: 'سموذي بطيخ', descriptionEn: 'Pure blended sweet watermelon served ice cold.', descriptionAr: 'سموذي بطيخ طبيعي خالص وبارد جداً.', price: 31, calories: 200 },
  { id: 'areej-p-82', categoryId: 'cat-cold-drinks', nameEn: 'Mango Juice', nameAr: 'عصير مانجو', descriptionEn: '100% freshly pressed thick sweet mango juice.', descriptionAr: 'عصير مانجو طبيعي طازج وكثيف.', price: 31, calories: 325 },
  { id: 'areej-p-83', categoryId: 'cat-cold-drinks', nameEn: 'Orange Juice', nameAr: 'عصير برتقال طازج', descriptionEn: 'Freshly squeezed sweet Valencia oranges.', descriptionAr: 'عصير برتقال طبيعي معصور طازجاً عند الطلب.', price: 27, calories: 220 },
  { id: 'areej-p-84', categoryId: 'cat-cold-drinks', nameEn: 'Milkshake', nameAr: 'ميلك شيك', descriptionEn: 'Rich, thick milkshake blended with premium ice cream.', descriptionAr: 'ميلك شيك غني وكثيف محضر من أفخر أنواع الآيس كريم.', price: 36, calories: 700 },
  { id: 'areej-p-85', categoryId: 'cat-cold-drinks', nameEn: 'Hibiscus', nameAr: 'كركديه منعش', descriptionEn: 'Traditional iced hibiscus tea steeped and sweetened to perfection.', descriptionAr: 'كركديه بارد ومثلج محضر بنكهة متوازنة ومنعشة.', price: 27, calories: 200 },
  { id: 'areej-p-86', categoryId: 'cat-cold-drinks', nameEn: 'Mojito 7up', nameAr: 'موهيتو 7up', price: 29, calories: 240, isPopular: true, descriptionEn: 'Crisp 7up infused with fresh mint, lime slices, and crushed ice.', descriptionAr: 'موهيتو منعش مع سفن أب والنعناع وشرائح الليمون والثلج المجروش.' },
  { id: 'areej-p-87', categoryId: 'cat-cold-drinks', nameEn: 'Red Bull Mojito', nameAr: 'موهيتو ريد بول', price: 36, calories: 240, isFeatured: true, descriptionEn: 'Energizing Red Bull paired with lime, fresh mint, and berry flavor.', descriptionAr: 'موهيتو ريد بول المفعم بالطاقة مع الليمون والنعناع المنعش.' }
];

// Set default fallback images for drinks
const finalProducts = rawProducts.map((p, idx) => {
  const cat = categories.find(c => c.id === p.categoryId);
  const img = p.imageUrl || cat?.imageUrl || '/tenants/areej/assets/cat-main.jpg';
  return {
    ...p,
    tenantId: 'areej',
    subCategoryId: null,
    costPrice: Number((p.price * 0.35).toFixed(2)),
    profit: Number((p.price * 0.65).toFixed(2)),
    margin: 65,
    preparationTime: p.categoryId.includes('drinks') ? 5 : (p.categoryId === 'cat-main' ? 25 : 15),
    sku: `ARJ-${String(idx + 1).padStart(3, '0')}`,
    barcode: null,
    imageUrl: img,
    videoUrl: null,
    displayOrder: idx + 1,
    isVisible: true,
    isFeatured: !!p.isFeatured,
    isRecommended: !!p.isRecommended,
    isPopular: !!p.isPopular,
    trackStock: false,
    stockQuantity: 0,
    recipeLink: null,
    allergens: [],
    nutrition: null,
    modifierGroupIds: [],
    sizes: [
      {
        id: `size-${p.id}-reg`,
        nameEn: 'Regular',
        nameAr: 'عادي',
        priceDifference: 0,
        calories: p.calories || 0,
        sku: `ARJ-${String(idx + 1).padStart(3, '0')}-REG`
      }
    ],
    taxRate: 0.15,
    discountRate: 0
  };
});

const fileContent = `import { Tenant, Branch, Category, ModifierGroup, Product, AuditLog } from './types';

export const initialTenants: Tenant[] = [
  {
    id: 'areej',
    nameEn: 'Areej Lounge & Restaurant',
    nameAr: 'مطعم ولاونج أريج',
    slug: 'areej-sa',
    logoUrl: '/logo-areej.png',
    primaryColor: '#c9a456',
    secondaryColor: '#dfbe75',
    currencyEn: 'SAR',
    currencyAr: 'ر.س',
    descAr: 'أهلاً بكم في مطعم ولاونج أريج، نقدّم لكم تجربة استثنائية من أشهى المأكولات والمشروبات بأعلى معايير الجودة والضيافة الراقية.',
    descEn: 'Welcome to Areej Lounge & Restaurant, offering an exquisite dining experience with handcrafted delicacies and exceptional hospitality.',
    addressAr: 'المملكة العربية السعودية',
    addressEn: 'Saudi Arabia',
    phone: '+966500000000',
    hoursAr: 'ساعات العمل: ١٢ ظهراً - ١٢ ليلاً',
    hoursEn: 'Opening Hours: 12 PM - 12 AM',
    handle: '@areej_sa',
    copyrightAr: 'جميع الحقوق محفوظة © ٢٠٢٦ لـ مطعم ولاونج أريج (areej-sa.net)',
    copyrightEn: 'All Rights Reserved © 2026 for Areej Lounge & Restaurant (areej-sa.net)',
    facebookUrl: '#',
    instagramUrl: '#',
    twitterUrl: '#',
    whatsappNumber: '+966500000000'
  }
];

export const initialBranches: Branch[] = [
  {
    id: 'b-areej-1',
    tenantId: 'areej',
    nameEn: 'Main Branch',
    nameAr: 'الفرع الرئيسي',
    addressEn: 'Saudi Arabia',
    addressAr: 'المملكة العربية السعودية',
    phone: '+966500000000',
    isActive: true
  }
];

export const initialCategories: Category[] = ${JSON.stringify(categories, null, 2)};

export const initialModifierGroups: ModifierGroup[] = [];

export const initialProducts: Product[] = ${JSON.stringify(finalProducts, null, 2)};

export const initialAuditLogs: AuditLog[] = [];
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'initialData.ts'), fileContent, 'utf8');
console.log('Successfully generated initialData.ts with', categories.length, 'categories and', finalProducts.length, 'products!');
