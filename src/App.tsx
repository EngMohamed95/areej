import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  initialTenants, initialBranches, initialCategories, 
  initialModifierGroups, initialProducts
} from './initialData';
import { Tenant, Branch, Category, ModifierGroup, Product, Order, OrderItem, StaffUser } from './types';
import AdminDashboard from './components/AdminDashboard';
import DigitalMenu from './components/DigitalMenu';
import { Lock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import {
  CatalogResource,
  CatalogSnapshot,
  checkAdminSession,
  createOrder,
  deleteUser,
  fetchCatalog,
  fetchUsers,
  loginAdmin,
  logoutAdmin,
  saveCatalogResource,
  saveUser
} from './apiClient';

export default function App() {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>(initialModifierGroups);
  const [databaseStatus, setDatabaseStatus] = useState<'loading' | 'online' | 'syncing' | 'offline'>('loading');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const latestVersionRef = useRef(0);
  const pendingWritesRef = useRef(0);
  const writeQueuesRef = useRef<Partial<Record<CatalogResource, Promise<void>>>>({});
  const tenantsRef = useRef(tenants);
  const branchesRef = useRef(branches);
  const categoriesRef = useRef(categories);
  const productsRef = useRef(products);

  const applyCatalogSnapshot = useCallback((snapshot: CatalogSnapshot) => {
    if (!snapshot.changed) {
      latestVersionRef.current = snapshot.version;
      setDatabaseStatus('online');
      setLastSyncedAt(new Date());
      return;
    }

    if (snapshot.tenants?.length) {
      tenantsRef.current = snapshot.tenants;
      setTenants(snapshot.tenants);
    }
    if (snapshot.branches) {
      branchesRef.current = snapshot.branches;
      setBranches(snapshot.branches);
    }
    if (snapshot.categories) {
      categoriesRef.current = snapshot.categories;
      setCategories(snapshot.categories);
    }
    if (snapshot.products) {
      productsRef.current = snapshot.products;
      setProducts(snapshot.products);
    }
    if (snapshot.modifierGroups) setModifierGroups(snapshot.modifierGroups);

    latestVersionRef.current = snapshot.version;
    setDatabaseStatus('online');
    setLastSyncedAt(new Date());
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const refreshCatalog = async () => {
      if (pendingWritesRef.current > 0) return;
      try {
        const snapshot = await fetchCatalog(latestVersionRef.current, controller.signal);
        applyCatalogSnapshot(snapshot);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('MySQL catalog sync failed:', error);
          setDatabaseStatus('offline');
        }
      }
    };

    void refreshCatalog();
    const intervalId = window.setInterval(refreshCatalog, 2500);
    const handleFocus = () => void refreshCatalog();
    window.addEventListener('focus', handleFocus);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [applyCatalogSnapshot]);

  const persistResource = useCallback(<T,>(resource: CatalogResource, records: T[]) => {
    pendingWritesRef.current += 1;
    setDatabaseStatus('syncing');

    const previous = writeQueuesRef.current[resource] || Promise.resolve();
    const queued = previous
      .catch(() => undefined)
      .then(async () => {
        const result = await saveCatalogResource(resource, records);
        latestVersionRef.current = result.version;
        setLastSyncedAt(new Date());
        setDatabaseStatus('online');
      })
      .catch(error => {
        console.error(`Unable to save ${resource} to MySQL:`, error);
        setDatabaseStatus('offline');
      })
      .finally(() => {
        pendingWritesRef.current = Math.max(0, pendingWritesRef.current - 1);
      });

    writeQueuesRef.current[resource] = queued;
  }, []);

  const updateTenants: React.Dispatch<React.SetStateAction<Tenant[]>> = useCallback(action => {
    const next = typeof action === 'function' ? action(tenantsRef.current) : action;
    tenantsRef.current = next;
    setTenants(next);
    persistResource('tenants', next);
  }, [persistResource]);

  const updateBranches: React.Dispatch<React.SetStateAction<Branch[]>> = useCallback(action => {
    const next = typeof action === 'function' ? action(branchesRef.current) : action;
    branchesRef.current = next;
    setBranches(next);
    persistResource('branches', next);
  }, [persistResource]);

  const updateCategories: React.Dispatch<React.SetStateAction<Category[]>> = useCallback(action => {
    const next = typeof action === 'function' ? action(categoriesRef.current) : action;
    categoriesRef.current = next;
    setCategories(next);
    persistResource('categories', next);
  }, [persistResource]);

  const updateProducts: React.Dispatch<React.SetStateAction<Product[]>> = useCallback(action => {
    const next = typeof action === 'function' ? action(productsRef.current) : action;
    productsRef.current = next;
    setProducts(next);
    persistResource('products', next);
  }, [persistResource]);

  const activeTenant = tenants[0] || initialTenants[0];

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
  const [lang, setLang] = useState<'en' | 'ar'>(() => {
    const savedLanguage = localStorage.getItem('menu_language');
    return savedLanguage === 'en' ? 'en' : 'ar';
  });

  useEffect(() => {
    localStorage.setItem('menu_language', lang);
  }, [lang]);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [activeStaff, setActiveStaff] = useState<StaffUser | null>(null);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  const refreshUsers = useCallback(async () => {
    const result = await fetchUsers();
    setStaffUsers(result.users);
  }, []);

  const handleSaveUser = useCallback(async (user: StaffUser & { pin?: string }) => {
    await saveUser(user);
    await refreshUsers();
  }, [refreshUsers]);

  const handleDeleteUser = useCallback(async (id: string) => {
    await deleteUser(id);
    await refreshUsers();
  }, [refreshUsers]);

  useEffect(() => {
    checkAdminSession()
      .then(result => {
        setIsAdminLoggedIn(result.authenticated);
        setActiveStaff(result.user);
        if (result.authenticated) void refreshUsers();
      })
      .catch(() => {
        setIsAdminLoggedIn(false);
        setActiveStaff(null);
      });
  }, [refreshUsers]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    try {
      const result = await loginAdmin(adminPin);
      setIsAdminLoggedIn(true);
      setActiveStaff(result.user);
      await refreshUsers();
      setAdminPin('');
    } catch (error) {
      // The local Vite server cannot execute PHP; keep a development-only login fallback.
      if (window.location.hostname === 'localhost' && adminPin === '0000') {
        setIsAdminLoggedIn(true);
        setActiveStaff({ id: 'local-admin', tenantId: 'areej', name: 'Areej Manager', email: 'admin@areej-sa.net', role: 'owner', isActive: true });
        setAdminPin('');
        return;
      }
      setPinError(lang === 'ar' ? 'رمز المرور غير صحيح أو تعذر الاتصال بالخادم.' : 'Incorrect PIN or server unavailable.');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setActiveStaff(null);
    setStaffUsers([]);
    void logoutAdmin().catch(error => console.error('Logout failed:', error));
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

  // Place orders directly in MySQL.
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

    void createOrder(newOrder, items).catch(error => {
      console.error('Unable to save order to MySQL:', error);
      alert(lang === 'ar' ? 'تعذر إرسال الطلب الآن، حاول مرة أخرى.' : 'Unable to place the order. Please try again.');
    });
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
            setTenants={updateTenants}
            branches={branches}
            setBranches={updateBranches}
            products={products}
            categories={categories}
            modifierGroups={modifierGroups}
            setProducts={updateProducts}
            setCategories={updateCategories}
            lang={lang}
            setLang={setLang}
            currentPath={currentPath}
            navigateTo={navigateTo}
            activeStaff={activeStaff}
            staffUsers={staffUsers}
            onRefreshUsers={refreshUsers}
            onSaveUser={handleSaveUser}
            onDeleteUser={handleDeleteUser}
            onLogout={handleLogout}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            databaseStatus={databaseStatus}
            lastSyncedAt={lastSyncedAt}
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
