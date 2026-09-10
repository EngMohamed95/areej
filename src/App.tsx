import React, { useState, useEffect } from 'react';
import { 
  initialTenants, initialBranches, initialCategories, 
  initialModifierGroups, initialProducts
} from './initialData';
import { Tenant, Branch, Category, ModifierGroup, Product, Order, OrderItem } from './types';
import AdminDashboard from './components/AdminDashboard';
import DigitalMenu from './components/DigitalMenu';
import { Lock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

// Clear legacy cached Meatport keys and synchronize Areej catalog version
const AREEJ_CATALOG_VERSION = 'areej_v2.1';

const syncAreejCatalog = () => {
  const legacyKeys = [
    'saas_tenants', 'saas_branches', 'saas_categories_t-1', 
    'saas_categories_version_t-1', 'saas_products_t-1', 
    'saas_products_version_t-1', 'saas_modifier_groups_t-1',
    'saas_ingredients_t-1', 'saas_recipes_t-1', 'saas_orders_t-1',
    'saas_order_items_t-1', 'saas_audit_logs_t-1', 'saas_employees_t-1',
    'meatport_admin_session'
  ];
  try {
    legacyKeys.forEach(k => localStorage.removeItem(k));
    
    const currentVersion = localStorage.getItem('areej_catalog_version');
    if (currentVersion !== AREEJ_CATALOG_VERSION) {
      localStorage.removeItem('menu_categories');
      localStorage.removeItem('menu_products');
      localStorage.removeItem('menu_store_profile');
      localStorage.removeItem('menu_branches');
      localStorage.removeItem('menu_modifier_groups');
      localStorage.setItem('areej_catalog_version', AREEJ_CATALOG_VERSION);
    }
  } catch (e) {
    console.error('Catalog sync error:', e);
  }
};

syncAreejCatalog();

export default function App() {
  // Store Branding & Profile
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('menu_store_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!parsed[0].logoUrl || parsed[0].logoUrl === '' || parsed[0].logoUrl.includes('meatport')) {
            parsed[0].logoUrl = initialTenants[0].logoUrl;
          }
          if (parsed[0].nameEn === 'Areej Restaurant') {
            parsed[0].nameEn = initialTenants[0].nameEn;
            parsed[0].nameAr = initialTenants[0].nameAr;
          }
          if (!parsed[0].primaryColor || parsed[0].primaryColor === '#e11d48') {
            parsed[0].primaryColor = initialTenants[0].primaryColor;
            parsed[0].secondaryColor = initialTenants[0].secondaryColor;
          }
          parsed[0].instagramUrl = initialTenants[0].instagramUrl;
          parsed[0].snapchatUrl = initialTenants[0].snapchatUrl;
          parsed[0].tiktokUrl = initialTenants[0].tiktokUrl;
          parsed[0].twitterUrl = initialTenants[0].twitterUrl;
          parsed[0].mapsUrl = initialTenants[0].mapsUrl;
          parsed[0].handle = initialTenants[0].handle;
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('menu_store_profile', JSON.stringify(initialTenants));
    return initialTenants;
  });

  useEffect(() => {
    localStorage.setItem('menu_store_profile', JSON.stringify(tenants));
  }, [tenants]);

  const activeTenant = tenants[0] || initialTenants[0];

  // Branches
  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('menu_branches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('menu_branches', JSON.stringify(initialBranches));
    return initialBranches;
  });

  useEffect(() => {
    localStorage.setItem('menu_branches', JSON.stringify(branches));
  }, [branches]);

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('menu_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('menu_categories', JSON.stringify(initialCategories));
    return initialCategories;
  });

  useEffect(() => {
    localStorage.setItem('menu_categories', JSON.stringify(categories));
  }, [categories]);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('menu_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('menu_products', JSON.stringify(initialProducts));
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('menu_products', JSON.stringify(products));
  }, [products]);

  // Modifier Groups
  const [modifierGroups] = useState<ModifierGroup[]>(() => {
    const saved = localStorage.getItem('menu_modifier_groups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('menu_modifier_groups', JSON.stringify(initialModifierGroups));
    return initialModifierGroups;
  });

  // Client-side routing
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.dispatchEvent(new Event('pushstate'));
  };

  // Redirect root path '/' to '/menu'
  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      navigateTo('/menu');
    }
  }, []);

  // Theme & Language
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('menu_admin_session') === 'true';
  });
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '0000' || adminPin === '1234') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('menu_admin_session', 'true');
      setPinError('');
      setAdminPin('');
    } else {
      setPinError(lang === 'ar' ? 'رمز المرور غير صحيح! (الرمز الافتراضي: 0000)' : 'Incorrect PIN! (Default: 0000)');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('menu_admin_session');
    navigateTo('/menu');
  };

  // Dynamic Title & Favicon
  useEffect(() => {
    if (activeTenant) {
      const brandTitle = lang === 'ar' ? activeTenant.nameAr : activeTenant.nameEn;
      document.title = `${brandTitle} | areej-sa.net`;
      let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      if (activeTenant.logoUrl) {
        favicon.href = activeTenant.logoUrl;
      }
    }
  }, [activeTenant, lang]);

  // Place order handler (stores orders locally)
  const placeOrder = (
    orderMetadata: Omit<Order, 'id' | 'createdAt' | 'tenantId' | 'branchId' | 'status' | 'preparationTimeEstimate'>,
    items: Omit<OrderItem, 'id' | 'orderId'>[]
  ) => {
    const orderId = `ord-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newOrder: Order = {
      ...orderMetadata,
      id: orderId,
      tenantId: activeTenant.id,
      branchId: branches[0]?.id || 'b-areej-1',
      status: 'pending',
      createdAt: timestamp,
      source: 'DigitalMenu'
    };

    const savedOrders = localStorage.getItem('menu_orders');
    const ordersList = savedOrders ? JSON.parse(savedOrders) : [];
    ordersList.unshift(newOrder);
    localStorage.setItem('menu_orders', JSON.stringify(ordersList.slice(0, 50)));
  };

  const isCurrentViewAdmin = currentPath.startsWith('/admin') || currentPath.startsWith('/staff');

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50/50 text-gray-800'
    }`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {isCurrentViewAdmin ? (
        isAdminLoggedIn ? (
          <AdminDashboard 
            tenant={activeTenant}
            setTenants={setTenants}
            branches={branches}
            setBranches={setBranches}
            products={products}
            categories={categories}
            modifierGroups={modifierGroups}
            setProducts={setProducts}
            setCategories={setCategories}
            lang={lang}
            currentPath={currentPath}
            navigateTo={navigateTo}
            activeStaff={{
              name: lang === 'ar' ? 'إدارة مطعم أريج' : 'Areej Manager',
              role: 'manager',
              email: 'admin@areej-sa.net',
              phone: activeTenant.phone || ''
            }}
            onLogout={handleLogout}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        ) : (
          /* Elegant Admin Access Gate */
          <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-8 shadow-2xl space-y-6 text-center">
              
              <div className="flex flex-col items-center space-y-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-gray-200 dark:border-gray-800 shadow-md flex items-center justify-center p-1.5">
                  {activeTenant.logoUrl ? (
                    <img 
                      src={activeTenant.logoUrl} 
                      alt={activeTenant.nameEn} 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-rose-600 text-white font-black flex items-center justify-center text-xl">
                      {activeTenant.nameAr ? activeTenant.nameAr.slice(0, 2) : '🍴'}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-955 dark:text-white">
                    {lang === 'ar' ? activeTenant.nameAr : activeTenant.nameEn}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    {lang === 'ar' ? 'لوحة تحكم قائمة الطعام' : 'Menu Management Dashboard'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4 text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-gray-500 dark:text-gray-400">
                    {lang === 'ar' ? 'الرمز السري للإدارة (PIN)' : 'Admin Passcode (PIN)'}
                  </label>
                  
                  <div className="relative flex justify-center items-center gap-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <input 
                      type="password"
                      maxLength={4}
                      required
                      value={adminPin}
                      onChange={(e) => {
                        setAdminPin(e.target.value.replace(/[^0-9]/g, ''));
                        setPinError('');
                      }}
                      placeholder="••••"
                      className="w-full text-center tracking-widest text-base font-mono font-black px-4 py-1 bg-transparent focus:outline-none text-gray-900 dark:text-white"
                      autoFocus
                    />
                    <div className={`absolute inset-y-0 ${lang === 'ar' ? 'left-3' : 'right-3'} flex items-center pointer-events-none text-gray-400`}>
                      <Lock className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {pinError && (
                  <p className="text-red-600 text-[10px] font-black text-center">{pinError}</p>
                )}

                {/* Keypad numbers */}
                <div className="grid grid-cols-3 gap-2 pt-1 max-w-[260px] mx-auto" dir="ltr">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        if (adminPin.length < 4) {
                          setAdminPin(prev => prev + num);
                          setPinError('');
                        }
                      }}
                      className="py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 active:scale-95 text-gray-800 dark:text-gray-200 font-extrabold text-sm rounded-xl border border-gray-150 dark:border-gray-700 transition cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setAdminPin('');
                      setPinError('');
                    }}
                    className="py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-bold text-xs rounded-xl active:scale-95 transition cursor-pointer"
                  >
                    {lang === 'ar' ? 'مسح' : 'Clear'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (adminPin.length < 4) {
                        setAdminPin(prev => prev + '0');
                        setPinError('');
                      }
                    }}
                    className="py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 active:scale-95 text-gray-800 dark:text-gray-200 font-extrabold text-sm rounded-xl border border-gray-150 dark:border-gray-700 transition cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminPin(prev => prev.slice(0, -1));
                      setPinError('');
                    }}
                    className="py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-bold text-xs rounded-xl active:scale-95 transition flex items-center justify-center cursor-pointer"
                  >
                    ⌫
                  </button>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-[#c9a456] via-[#b38c3e] to-[#97732a] hover:brightness-105 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-[#c9a456]/20 active:scale-95 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {lang === 'ar' ? 'دخول لوحة التحكم' : 'Unlock Dashboard'}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('/menu')}
                    className="w-full py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {lang === 'ar' ? (
                      <>
                        <span>العودة إلى قائمة الطعام</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>Return to Digital Menu</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      ) : (
        /* Customer Digital Menu View */
        <div className="flex-1 w-full flex flex-col">
          <DigitalMenu 
            tenant={activeTenant}
            branches={branches}
            products={products}
            categories={categories}
            modifierGroups={modifierGroups}
            lang={lang}
            setLang={setLang}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onPlaceOrder={placeOrder}
          />
        </div>
      )}

    </div>
  );
}
