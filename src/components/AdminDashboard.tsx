import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, ArrowUp, ArrowDown, Download, Upload, Check, X, 
  Settings, Layers, DollarSign, Package, AlertTriangle, ListFilter, FileText,
  TrendingUp, Activity, Shuffle, Eye, EyeOff, Tag, Clock, Flame, Percent,
  Warehouse, Users, ChefHat, Menu, ShoppingBag, Archive, ClipboardList
} from 'lucide-react';
import { Product, Category, ModifierGroup, AuditLog, Tenant, Branch } from '../types';

interface AdminDashboardProps {
  tenant: Tenant;
  setTenants?: React.Dispatch<React.SetStateAction<Tenant[]>>;
  branches: Branch[];
  products: Product[];
  categories: Category[];
  modifierGroups: ModifierGroup[];
  auditLogs?: AuditLog[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  addAuditLog?: (action: string, entityName: string, entityId: string, details: string) => void;
  lang: 'en' | 'ar';
  currentPath: string;
  navigateTo: (path: string) => void;
  activeStaff?: any;
  onLogout?: () => void;
  darkMode?: boolean;
  setDarkMode?: (dark: boolean) => void;
  setBranches?: React.Dispatch<React.SetStateAction<Branch[]>>;
}

export default function AdminDashboard({
  tenant,
  setTenants,
  branches,
  products,
  categories,
  modifierGroups,
  auditLogs,
  setProducts,
  setCategories,
  addAuditLog,
  lang,
  currentPath,
  navigateTo,
  activeStaff,
  onLogout,
  darkMode,
  setDarkMode,
  setBranches
}: AdminDashboardProps) {
  // Dynamically calculate the active tab from the URL pathname
  const activeTab = (() => {
    if (currentPath === '/admin/categories' || currentPath === '/staff/categories') return 'categories';
    if (currentPath === '/admin/settings' || currentPath === '/staff/settings') return 'settings';
    return 'products'; // fallback
  })();

  const setActiveTab = (tab: 'products' | 'categories' | 'settings') => {
    if (tab === 'products') navigateTo('/admin/products');
    else if (tab === 'categories') navigateTo('/admin/categories');
    else if (tab === 'settings') navigateTo('/admin/settings');
  };

  const [selectedBranch, setSelectedBranch] = useState<string>(branches[0]?.id || '');
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Multi-select for bulk actions
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modals / Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // File Inputs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields - Product
  const [prodNameEn, setProdNameEn] = useState('');
  const [prodNameAr, setProdNameAr] = useState('');
  const [prodDescEn, setProdDescEn] = useState('');
  const [prodDescAr, setProdDescAr] = useState('');
  const [prodPrice, setProdPrice] = useState('0');
  const [prodCost, setProdCost] = useState('0');
  const [prodCategory, setProdCategory] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodBarcode, setProdBarcode] = useState('');
  const [prodCalories, setProdCalories] = useState('');
  const [prodPrepTime, setProdPrepTime] = useState('10');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodVideoUrl, setProdVideoUrl] = useState('');
  const [prodTrackStock, setProdTrackStock] = useState(true);
  const [prodStock, setProdStock] = useState('50');
  const [prodAllergens, setProdAllergens] = useState<string[]>([]);
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodRecommended, setProdRecommended] = useState(false);
  const [prodPopular, setProdPopular] = useState(false);
  const [prodModifierGroupIds, setProdModifierGroupIds] = useState<string[]>([]);
  const [prodSizes, setProdSizes] = useState<{ nameEn: string; nameAr: string; priceDifference: number; calories: number }[]>([]);

  // Size sub-form temporary state
  const [newSizeNameEn, setNewSizeNameEn] = useState('');
  const [newSizeNameAr, setNewSizeNameAr] = useState('');
  const [newSizePriceDiff, setNewSizePriceDiff] = useState('0');
  const [newSizeCalories, setNewSizeCalories] = useState('0');

  // Media Gallery / Image Library states
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState<'product' | 'category' | 'logo' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  // Load local images list when opening media gallery
  useEffect(() => {
    if (showMediaGallery) {
      setGalleryLoading(true);
      fetch('/api/list-images')
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.images)) {
            setGalleryImages(data.images);
          }
        })
        .catch(err => console.error('Error fetching gallery images:', err))
        .finally(() => setGalleryLoading(false));
    }
  }, [showMediaGallery]);

  // Filter gallery images by search text
  const filteredGalleryImages = useMemo(() => {
    return galleryImages.filter(img => 
      img.toLowerCase().includes(gallerySearch.toLowerCase())
    );
  }, [galleryImages, gallerySearch]);

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, base64Data })
        });
        const data = await res.json();
        if (data.success) {
          setProdImageUrl(data.url);
          setGalleryImages(prev => [data.url, ...prev.filter(img => img !== data.url)]);
        } else {
          alert(lang === 'ar' ? 'فشل الرفع: ' + data.error : 'Upload failed: ' + data.error);
        }
      } catch (err) {
        alert(lang === 'ar' ? 'خطأ أثناء الرفع' : 'Error uploading image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, base64Data })
        });
        const data = await res.json();
        if (data.success) {
          setCatImageUrl(data.url);
          setGalleryImages(prev => [data.url, ...prev.filter(img => img !== data.url)]);
        } else {
          alert(lang === 'ar' ? 'فشل الرفع: ' + data.error : 'Upload failed: ' + data.error);
        }
      } catch (err) {
        alert(lang === 'ar' ? 'خطأ أثناء الرفع' : 'Error uploading image');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, base64Data })
        });
        const data = await res.json();
        if (data.success) {
          setGalleryImages(prev => [data.url, ...prev.filter(img => img !== data.url)]);
          if (setTenants) {
            setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, logoUrl: data.url } : t));
          }
        } else {
          alert(lang === 'ar' ? 'فشل الرفع: ' + data.error : 'Upload failed: ' + data.error);
        }
      } catch (err) {
        alert(lang === 'ar' ? 'خطأ أثناء الرفع' : 'Error uploading image');
      }
    };
    reader.readAsDataURL(file);
  };

  // Form Fields - Category
  const [catNameEn, setCatNameEn] = useState('');
  const [catNameAr, setCatNameAr] = useState('');
  const [catDescEn, setCatDescEn] = useState('');
  const [catDescAr, setCatDescAr] = useState('');
  const [catImageUrl, setCatImageUrl] = useState('');

  // Auto Calculations
  const computedProfit = Math.max(0, parseFloat(prodPrice) - parseFloat(prodCost));
  const computedMargin = parseFloat(prodPrice) > 0 ? (computedProfit / parseFloat(prodPrice)) * 100 : 0;

  // Filtered lists
  const tenantCategories = useMemo(() => {
    return categories.filter(c => c.tenantId === tenant.id);
  }, [categories, tenant]);

  const tenantProducts = useMemo(() => {
    return products.filter(p => p.tenantId === tenant.id)
      .filter(p => {
        const matchesSearch = p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.nameAr.includes(searchQuery) ||
                              p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
        return matchesSearch && matchesCategory;
      });
  }, [products, tenant, searchQuery, categoryFilter]);

  // Key Metrics Calculations
  const metrics = useMemo(() => {
    const tProds = products.filter(p => p.tenantId === tenant.id);
    const totalCount = tProds.length;
    const avgMargin = totalCount > 0 
      ? tProds.reduce((acc, p) => acc + p.margin, 0) / totalCount 
      : 0;
    const lowStockCount = tProds.filter(p => p.trackStock && p.stockQuantity <= 10).length;
    const totalCategories = tenantCategories.length;

    return { totalCount, avgMargin, lowStockCount, totalCategories };
  }, [products, tenant, tenantCategories]);

  // Open modal for Product Add/Edit
  const openProductModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setProdNameEn(product.nameEn);
      setProdNameAr(product.nameAr);
      setProdDescEn(product.descriptionEn || '');
      setProdDescAr(product.descriptionAr || '');
      setProdPrice(product.price.toString());
      setProdCost(product.costPrice.toString());
      setProdCategory(product.categoryId);
      setProdSku(product.sku);
      setProdBarcode(product.barcode || '');
      setProdCalories(product.calories?.toString() || '');
      setProdPrepTime(product.preparationTime.toString());
      setProdImageUrl(product.imageUrl || '');
      setProdVideoUrl(product.videoUrl || '');
      setProdTrackStock(product.trackStock);
      setProdStock(product.stockQuantity.toString());
      setProdAllergens(product.allergens);
      setProdFeatured(product.isFeatured);
      setProdRecommended(product.isRecommended);
      setProdPopular(product.isPopular);
      setProdModifierGroupIds(product.modifierGroupIds || []);
      setProdSizes(product.sizes.map(s => ({
        nameEn: s.nameEn,
        nameAr: s.nameAr,
        priceDifference: s.priceDifference,
        calories: s.calories || 0
      })));
    } else {
      setEditingProduct(null);
      setProdNameEn('');
      setProdNameAr('');
      setProdDescEn('');
      setProdDescAr('');
      setProdPrice('45');
      setProdCost('15');
      setProdCategory(tenantCategories[0]?.id || '');
      setProdSku(`SKU-${tenant.slug.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setProdBarcode('');
      setProdCalories('450');
      setProdPrepTime('10');
      setProdImageUrl('');
      setProdVideoUrl('');
      setProdTrackStock(true);
      setProdStock('50');
      setProdAllergens([]);
      setProdFeatured(false);
      setProdRecommended(false);
      setProdPopular(false);
      setProdModifierGroupIds([]);
      setProdSizes([]);
    }
    setShowProductModal(true);
  };

  // Open modal for Category Add/Edit
  const openCategoryModal = (category: Category | null = null) => {
    if (category) {
      setEditingCategory(category);
      setCatNameEn(category.nameEn);
      setCatNameAr(category.nameAr);
      setCatDescEn(category.descriptionEn || '');
      setCatDescAr(category.descriptionAr || '');
      setCatImageUrl(category.imageUrl || '');
    } else {
      setEditingCategory(null);
      setCatNameEn('');
      setCatNameAr('');
      setCatDescEn('');
      setCatDescAr('');
      setCatImageUrl('');
    }
    setShowCategoryModal(true);
  };

  // Add Size Option to Product Form
  const handleAddSize = () => {
    if (!newSizeNameEn || !newSizeNameAr) return;
    setProdSizes([...prodSizes, {
      nameEn: newSizeNameEn,
      nameAr: newSizeNameAr,
      priceDifference: parseFloat(newSizePriceDiff) || 0,
      calories: parseInt(newSizeCalories) || 0
    }]);
    setNewSizeNameEn('');
    setNewSizeNameAr('');
    setNewSizePriceDiff('0');
    setNewSizeCalories('0');
  };

  // Remove Size Option
  const handleRemoveSize = (index: number) => {
    setProdSizes(prodSizes.filter((_, i) => i !== index));
  };

  // Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodNameEn || !prodNameAr || !prodCategory || !prodSku) return;

    const basePrice = parseFloat(prodPrice) || 0;
    const baseCost = parseFloat(prodCost) || 0;
    const profit = Math.max(0, basePrice - baseCost);
    const margin = basePrice > 0 ? (profit / basePrice) * 100 : 0;

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `p-${Date.now()}`,
      tenantId: tenant.id,
      categoryId: prodCategory,
      nameEn: prodNameEn,
      nameAr: prodNameAr,
      descriptionEn: prodDescEn,
      descriptionAr: prodDescAr,
      price: basePrice,
      costPrice: baseCost,
      profit,
      margin,
      calories: parseInt(prodCalories) || undefined,
      preparationTime: parseInt(prodPrepTime) || 10,
      sku: prodSku,
      barcode: prodBarcode || undefined,
      imageUrl: prodImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80',
      videoUrl: prodVideoUrl || undefined,
      displayOrder: editingProduct ? editingProduct.displayOrder : products.length + 1,
      isVisible: editingProduct ? editingProduct.isVisible : true,
      isFeatured: prodFeatured,
      isRecommended: prodRecommended,
      isPopular: prodPopular,
      trackStock: prodTrackStock,
      stockQuantity: parseInt(prodStock) || 0,
      allergens: prodAllergens,
      nutrition: {
        carbs: Math.floor(Math.random() * 60) + 10,
        protein: Math.floor(Math.random() * 30) + 5,
        fat: Math.floor(Math.random() * 25) + 5
      },
      modifierGroupIds: prodModifierGroupIds,
      sizes: prodSizes.map((s, idx) => ({
        id: `s-opt-${idx}-${Date.now()}`,
        nameEn: s.nameEn,
        nameAr: s.nameAr,
        priceDifference: s.priceDifference,
        calories: s.calories,
        sku: `${prodSku}-S${idx}`
      })),
      taxRate: tenant.id === 't-1' ? 0.15 : 0.05,
      discountRate: editingProduct ? editingProduct.discountRate : 0
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? productPayload : p));
      addAuditLog?.('UPDATE_PRODUCT', 'Product', productPayload.id, `Updated product detail: ${productPayload.nameEn} (SKU: ${productPayload.sku})`);
    } else {
      setProducts(prev => [...prev, productPayload]);
      addAuditLog?.('CREATE_PRODUCT', 'Product', productPayload.id, `Created product: ${productPayload.nameEn} (SKU: ${productPayload.sku})`);
    }

    setShowProductModal(false);
    setEditingProduct(null);
  };

  // Save Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameEn || !catNameAr) return;

    const categoryPayload: Category = {
      id: editingCategory ? editingCategory.id : `c-${Date.now()}`,
      tenantId: tenant.id,
      nameEn: catNameEn,
      nameAr: catNameAr,
      descriptionEn: catDescEn || undefined,
      descriptionAr: catDescAr || undefined,
      displayOrder: editingCategory ? editingCategory.displayOrder : categories.length + 1,
      isVisible: editingCategory ? editingCategory.isVisible : true,
      imageUrl: catImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80'
    };

    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? categoryPayload : c));
      addAuditLog?.('UPDATE_CATEGORY', 'Category', categoryPayload.id, `Updated category: ${categoryPayload.nameEn}`);
    } else {
      setCategories(prev => [...prev, categoryPayload]);
      addAuditLog?.('CREATE_CATEGORY', 'Category', categoryPayload.id, `Created new category: ${categoryPayload.nameEn}`);
    }

    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    if (confirm(lang === 'ar' ? `هل أنت متأكد من حذف ${target.nameAr}؟` : `Are you sure you want to delete ${target.nameEn}?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      addAuditLog?.('DELETE_PRODUCT', 'Product', id, `Soft deleted product: ${target.nameEn}`);
    }
  };

  // Delete Category
  const handleDeleteCategory = (id: string) => {
    const target = categories.find(c => c.id === id);
    if (!target) return;
    if (confirm(lang === 'ar' ? `هل أنت متأكد من حذف فئة ${target.nameAr}؟` : `Are you sure you want to delete category ${target.nameEn}?`)) {
      setCategories(prev => prev.filter(c => c.id !== id));
      addAuditLog?.('DELETE_CATEGORY', 'Category', id, `Soft deleted category: ${target.nameEn}`);
    }
  };

  // Sorter helpers
  const handleMoveProductOrder = (index: number, direction: 'up' | 'down') => {
    const reordered = [...tenantProducts];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === reordered.length - 1) return;

    const swapTarget = direction === 'up' ? index - 1 : index + 1;
    const tempOrder = reordered[index].displayOrder;
    reordered[index].displayOrder = reordered[swapTarget].displayOrder;
    reordered[swapTarget].displayOrder = tempOrder;

    // Merge back into original state
    setProducts(prev => prev.map(p => {
      const match = reordered.find(r => r.id === p.id);
      return match ? { ...p, displayOrder: match.displayOrder } : p;
    }));
  };

  // Select / Deselect Product
  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const toggleSelectAllProducts = () => {
    if (selectedProductIds.length === tenantProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(tenantProducts.map(p => p.id));
    }
  };

  // Bulk Actions
  const handleBulkVisibility = (isVisible: boolean) => {
    if (selectedProductIds.length === 0) return;
    setProducts(prev => prev.map(p => {
      if (selectedProductIds.includes(p.id)) {
        return { ...p, isVisible };
      }
      return p;
    }));
    addAuditLog?.('BULK_UPDATE_VISIBILITY', 'Product', 'bulk', `Toggled visibility to ${isVisible} for ${selectedProductIds.length} items.`);
    setSelectedProductIds([]);
  };

  const handleBulkDiscount = () => {
    if (selectedProductIds.length === 0) return;
    setProducts(prev => prev.map(p => {
      if (selectedProductIds.includes(p.id)) {
        return { ...p, discountRate: 0.15 }; // apply 15% discount
      }
      return p;
    }));
    addAuditLog?.('BULK_APPLY_DISCOUNT', 'Product', 'bulk', `Applied 15% Bulk Discount promo to ${selectedProductIds.length} items.`);
    setSelectedProductIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    if (confirm(lang === 'ar' ? `هل أنت متأكد من حذف ${selectedProductIds.length} منتجات مجمعة؟` : `Are you sure you want to delete ${selectedProductIds.length} selected items?`)) {
      setProducts(prev => prev.filter(p => !selectedProductIds.includes(p.id)));
      addAuditLog?.('BULK_DELETE_PRODUCTS', 'Product', 'bulk', `Bulk soft deleted ${selectedProductIds.length} items.`);
      setSelectedProductIds([]);
    }
  };

  // Export current menu to CSV
  const handleExportCSV = () => {
    const headers = 'ID,Name_EN,Name_AR,SKU,Price,CostPrice,Margin,Calories,StockQuantity,IsVisible,IsFeatured';
    const rows = tenantProducts.map(p => 
      `"${p.id}","${p.nameEn.replace(/"/g, '""')}","${p.nameAr.replace(/"/g, '""')}","${p.sku}",${p.price},${p.costPrice},${p.margin.toFixed(2)},${p.calories || 0},${p.stockQuantity},${p.isVisible},${p.isFeatured}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\ufeff' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${tenant.slug}-menu-export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog?.('EXPORT_MENU_CSV', 'Product', 'bulk', `Exported current product catalog containing ${tenantProducts.length} items to CSV format.`);
  };

  // Import menu from CSV
  const handleImportCSVClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportCSVFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const lines = text.split('\n');
        // Simple verification of headers
        if (lines.length < 2) throw new Error('Empty CSV file format');
        
        const newProductsAdded: Product[] = [];
        
        // Parse lines skipping header
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Simple CSV parser supporting double quotes
          const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => col.replace(/^"|"$/g, '').trim());
          if (columns.length < 5) continue;

          const id = `p-csv-${Date.now()}-${i}`;
          const nameEn = columns[1] || 'CSV Imported Item';
          const nameAr = columns[2] || 'منتج مستورد';
          const sku = columns[3] || `SKU-IMP-${Math.floor(1000 + Math.random() * 9000)}`;
          const price = parseFloat(columns[4]) || 10;
          const costPrice = parseFloat(columns[5]) || 3;
          const profit = Math.max(0, price - costPrice);
          const margin = price > 0 ? (profit / price) * 100 : 0;
          const calories = parseInt(columns[7]) || 200;
          const stockQuantity = parseInt(columns[8]) || 50;

          const parsedProduct: Product = {
            id,
            tenantId: tenant.id,
            categoryId: tenantCategories[0]?.id || 'c-1',
            nameEn,
            nameAr,
            descriptionEn: 'Imported via CSV Catalog upload',
            descriptionAr: 'تم استيراده عبر تحميل ملف كتالوج CSV',
            price,
            costPrice,
            profit,
            margin,
            calories,
            preparationTime: 12,
            sku,
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80',
            displayOrder: products.length + i,
            isVisible: true,
            isFeatured: false,
            isRecommended: false,
            isPopular: false,
            trackStock: true,
            stockQuantity,
            allergens: [],
            modifierGroupIds: [],
            sizes: [],
            taxRate: tenant.id === 't-1' ? 0.15 : 0.05,
            discountRate: 0
          };
          newProductsAdded.push(parsedProduct);
        }

        if (newProductsAdded.length > 0) {
          setProducts(prev => [...prev, ...newProductsAdded]);
          addAuditLog?.('IMPORT_MENU_CSV', 'Product', 'bulk', `Successfully bulk imported ${newProductsAdded.length} new items into catalog via CSV parse.`);
          alert(lang === 'ar' ? `تم استيراد ${newProductsAdded.length} منتجات بنجاح!` : `Successfully imported ${newProductsAdded.length} products!`);
        }
      } catch (err) {
        alert(lang === 'ar' ? 'فشل استيراد CSV. يرجى التحقق من صياغة الملف.' : 'Failed to import CSV. Please verify file formatting.');
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden text-gray-800 dark:text-gray-100 font-sans bg-gray-50/50 dark:bg-gray-950" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --tenant-primary: ${tenant.primaryColor || '#c9a456'};
          --tenant-secondary: ${tenant.secondaryColor || '#dfbe75'};
        }
        .text-rose-600 { color: var(--tenant-primary) !important; }
        .text-rose-500 { color: var(--tenant-primary) !important; }
        .bg-rose-600 { background-color: var(--tenant-primary) !important; }
        .bg-rose-500 { background-color: var(--tenant-primary) !important; }
        .border-rose-600 { border-color: var(--tenant-primary) !important; }
        .border-rose-500 { border-color: var(--tenant-primary) !important; }
        .bg-rose-50 { background-color: var(--tenant-primary)1a !important; }
        .hover\\:bg-rose-700:hover { background-color: var(--tenant-primary) !important; filter: brightness(0.9); }
        .bg-rose-100 { background-color: var(--tenant-primary)20 !important; }
      ` }} />
      
      {/* Mobile Sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 bottom-0 z-50 w-72 bg-white dark:bg-gray-900 flex flex-col justify-between p-6 shadow-2xl select-none transition-transform duration-300 lg:hidden ${
        lang === 'ar'
          ? (mobileMenuOpen ? 'right-0 translate-x-0' : 'right-0 translate-x-full')
          : (mobileMenuOpen ? 'left-0 translate-x-0' : 'left-0 -translate-x-full')
      }`}>
        <div className="space-y-6 overflow-y-auto no-scrollbar flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100/10 mb-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 font-mono">{lang === 'ar' ? 'القائمة' : 'Navigation'}</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 pb-4 mb-2">
            {tenant.logoUrl ? (
              <img src={tenant.logoUrl} alt={tenant.nameEn} className="w-10 h-10 rounded-xl object-contain bg-white shadow-xs border border-gray-100 p-0.5" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-600 flex items-center justify-center font-black text-lg">
                {tenant.nameAr ? tenant.nameAr.slice(0, 2) : '🍽️'}
              </div>
            )}
            <div>
              <h1 className="text-sm font-black text-gray-955 dark:text-white leading-none">
                {lang === 'ar' ? tenant.nameAr : tenant.nameEn}
              </h1>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                {lang === 'ar' ? 'لوحة تحكم قائمة الطعام' : 'Menu Management'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono block px-2 mb-2">
              {lang === 'ar' ? 'أقسام لوحة التحكم' : 'Console Modules'}
            </span>
            <nav className="space-y-1">
              <button
                onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'products' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إدارة المنتجات والأطباق' : 'Products & Dishes'}</span>
              </button>

              <button
                onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'categories' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إدارة الفئات والأقسام' : 'Categories & Groups'}</span>
              </button>

              <button
                onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'settings' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إعدادات المتجر وهوية المنيو' : 'Store & Menu Settings'}</span>
              </button>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => { navigateTo('/menu'); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/30 hover:bg-rose-100 transition flex items-center gap-2.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'معاينة المنيو للعملاء' : 'View Live Menu'}</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        <div className="pt-4 space-y-3 border-t border-gray-100/10">
          {activeStaff && (
            <div className="flex items-center gap-2 px-1">
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center font-bold text-xs">
                M
              </div>
              <div className="min-w-0 text-right">
                <span className="block text-[11px] font-black text-gray-900 dark:text-white truncate">
                  {activeStaff.name}
                </span>
                <span className="block text-[9px] text-gray-400 truncate">
                  {lang === 'ar' ? 'مدير معتمد' : 'Manager'}
                </span>
              </div>
            </div>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50/60 dark:bg-red-950/10 hover:bg-red-100 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 font-black rounded-xl text-[10px] transition cursor-pointer"
            >
              <span>🚪</span>
              {lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
            </button>
          )}
        </div>
      </aside>

      {/* Sidebar: Fixed, full height (Desktop view only) */}
      <aside className="hidden lg:flex w-72 h-screen shrink-0 bg-white dark:bg-gray-900 flex flex-col justify-between p-6 shadow-2xl z-10 select-none">
        <div className="space-y-6 overflow-y-auto no-scrollbar">
          {/* Logo & Brand title */}
          <div className="flex items-center gap-3 pb-4 mb-2">
            {tenant.logoUrl ? (
              <img src={tenant.logoUrl} alt={tenant.nameEn} className="w-10 h-10 rounded-xl object-contain bg-white shadow-xs border border-gray-100 p-0.5" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-600 flex items-center justify-center font-black text-lg">
                {tenant.nameAr ? tenant.nameAr.slice(0, 2) : '🍽️'}
              </div>
            )}
            <div>
              <h1 className="text-sm font-black text-gray-955 dark:text-white leading-none">
                {lang === 'ar' ? tenant.nameAr : tenant.nameEn}
              </h1>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                {lang === 'ar' ? 'لوحة تحكم قائمة الطعام' : 'Menu Management'}
              </span>
            </div>
          </div>

          {/* Nav menu links */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono block px-2 mb-2">
              {lang === 'ar' ? 'أقسام لوحة التحكم' : 'Console Modules'}
            </span>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إدارة المنتجات والأطباق' : 'Products & Dishes'}</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إدارة الفئات والأقسام' : 'Categories & Groups'}</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إعدادات المتجر وهوية المنيو' : 'Store & Menu Settings'}</span>
              </button>

              <div className="pt-3 border-t border-gray-100/50 dark:border-gray-800">
                <button
                  onClick={() => navigateTo('/menu')}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition flex items-center gap-2.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'معاينة المنيو للعملاء' : 'View Live Menu'}</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Sidebar Footer: Active Session / Logout */}
        <div className="pt-4 space-y-3">
          {activeStaff && (
            <div className="flex items-center gap-2 px-1">
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center font-bold text-xs">
                M
              </div>
              <div className="min-w-0 text-right">
                <span className="block text-[11px] font-black text-gray-900 dark:text-white truncate">
                  {activeStaff.name}
                </span>
                <span className="block text-[9px] text-gray-400 truncate">
                  {lang === 'ar' ? 'مدير معتمد' : 'Manager'}
                </span>
              </div>
            </div>
          )}
          
          {onLogout && (
            <button
              onClick={onLogout}
              type="button"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50/60 dark:bg-red-950/10 hover:bg-red-100 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 font-black rounded-xl text-[10px] transition cursor-pointer"
            >
              <span>🚪</span>
              {lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 h-screen flex flex-col overflow-hidden bg-gray-50/30 dark:bg-gray-950/30">
        
        {/* Top Navbar Header */}
        <header className="h-16 shrink-0 bg-white dark:bg-gray-900 px-8 flex items-center justify-between shadow-md z-10">
          <div>
            <h1 className="text-sm font-black text-gray-950 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              {lang === 'ar' ? 'لوحة تحكم قائمة الطعام' : 'Menu Management Dashboard'}
            </h1>
            <p className="text-[10px] text-gray-400 font-bold mt-0.5">
              {lang === 'ar' ? `المطعم: ${tenant.nameAr}` : `Restaurant: ${tenant.nameEn}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Export / Import Buttons */}
            <button
              onClick={() => navigateTo('/menu')}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200/60 rounded-lg hover:bg-rose-100 transition shadow-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'معاينة المنيو' : 'Live Menu'}
            </button>
            <button 
              onClick={handleExportCSV}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-gray-700 dark:text-gray-202 cursor-pointer animate-in fade-in"
            >
              <Download className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'تصدير CSV' : 'Export CSV'}
            </button>
            
            <button 
              onClick={handleImportCSVClick}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-gray-700 dark:text-gray-202 cursor-pointer animate-in fade-in"
            >
              <Upload className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'استيراد CSV' : 'Import CSV'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportCSVFile} 
              accept=".csv" 
              className="hidden" 
            />

            <button 
              onClick={() => activeTab === 'products' ? openProductModal() : openCategoryModal()}
              type="button"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {activeTab === 'products' 
                ? (lang === 'ar' ? 'إضافة منتج' : 'Add Product') 
                : (lang === 'ar' ? 'إضافة فئة' : 'Add Category')}
            </button>
          </div>
        </header>

        {/* Scrollable Content Pane */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          
          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.035)] flex items-center gap-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-lg">
                <Package className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  {lang === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}
                </span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{metrics.totalCount}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.035)] flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  {lang === 'ar' ? 'إجمالي الفئات' : 'Total Categories'}
                </span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{metrics.totalCategories}</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.035)] flex items-center gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  {lang === 'ar' ? 'متوسط الربح' : 'Avg. Margin'}
                </span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{metrics.avgMargin.toFixed(1)}%</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.035)] flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-lg">
                <AlertTriangle className="w-5 h-5 animate-bounce-slow" />
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                  {lang === 'ar' ? 'نقص المخزون' : 'Stock Alerts'}
                </span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{metrics.lowStockCount}</span>
              </div>
            </div>
          </div>

      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Table Utilities */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
            <div className="flex items-center gap-2 w-full md:max-w-md">
              <input 
                type="text"
                placeholder={lang === 'ar' ? 'البحث بالاسم أو SKU...' : 'Search by name, code or SKU...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:border-rose-600 transition"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:border-rose-600 transition text-gray-600"
              >
                <option value="all">{lang === 'ar' ? 'كل الفئات' : 'All Categories'}</option>
                {tenantCategories.map(c => (
                  <option key={c.id} value={c.id}>{lang === 'ar' ? c.nameAr : c.nameEn}</option>
                ))}
              </select>
            </div>

            {/* Bulk actions list */}
            {selectedProductIds.length > 0 && (
              <div className="flex items-center gap-1.5 p-1 bg-rose-50/50 border border-rose-100 rounded-lg animate-fade-in text-xs">
                <span className="font-semibold text-rose-700 px-2">
                  {lang === 'ar' ? `${selectedProductIds.length} محددة` : `${selectedProductIds.length} selected`}
                </span>
                <button 
                  onClick={() => handleBulkVisibility(true)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition"
                >
                  <Eye className="w-3 h-3" />
                  {lang === 'ar' ? 'إظهار' : 'Show'}
                </button>
                <button 
                  onClick={() => handleBulkVisibility(false)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition"
                >
                  <EyeOff className="w-3 h-3" />
                  {lang === 'ar' ? 'إخفاء' : 'Hide'}
                </button>
                <button 
                  onClick={handleBulkDiscount}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-green-700 bg-white border border-green-200 rounded hover:bg-green-50/50 transition"
                >
                  <Percent className="w-3 h-3" />
                  -15%
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-red-700 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  <Trash2 className="w-3 h-3" />
                  {lang === 'ar' ? 'حذف' : 'Delete'}
                </button>
              </div>
            )}
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.035)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-500">
                <thead className="bg-gray-50/70 text-[11px] uppercase text-gray-400 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="p-4 w-10">
                      <input 
                        type="checkbox" 
                        checked={tenantProducts.length > 0 && selectedProductIds.length === tenantProducts.length}
                        onChange={toggleSelectAllProducts}
                        className="rounded accent-rose-600"
                      />
                    </th>
                    <th className="p-4">{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                    <th className="p-4">SKU / Barcode</th>
                    <th className="p-4">{lang === 'ar' ? 'الفئة' : 'Category'}</th>
                    <th className="p-4">{lang === 'ar' ? 'السعر / التكلفة' : 'Price / Cost'}</th>
                    <th className="p-4">{lang === 'ar' ? 'هامش الربح' : 'Margin / Profit'}</th>
                    <th className="p-4">{lang === 'ar' ? 'المخزون' : 'Stock'}</th>
                    <th className="p-4">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th className="p-4 text-center">{lang === 'ar' ? 'الترتيب' : 'Sort'}</th>
                    <th className="p-4 text-right">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-sans">
                  {tenantProducts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-gray-400">
                        {lang === 'ar' ? 'لم يتم العثور على منتجات مطابقة.' : 'No matching products found.'}
                      </td>
                    </tr>
                  ) : (
                    tenantProducts.map((p, index) => {
                      const cat = categories.find(c => c.id === p.categoryId);
                      return (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition">
                          <td className="p-4">
                            <input 
                              type="checkbox" 
                              checked={selectedProductIds.includes(p.id)}
                              onChange={() => toggleSelectProduct(p.id)}
                              className="rounded accent-rose-600"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={p.imageUrl} 
                                alt={p.nameEn} 
                                className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h4 className="font-semibold text-gray-900">{lang === 'ar' ? p.nameAr : p.nameEn}</h4>
                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
                                  {p.calories && <span className="flex items-center gap-0.5"><Flame className="w-2.5 h-2.5 text-amber-500" /> {p.calories} Cal</span>}
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5 text-blue-500" /> {p.preparationTime} Min</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-xs text-gray-700 block">{p.sku}</span>
                            {p.barcode && <span className="font-mono text-[10px] text-gray-400">{p.barcode}</span>}
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-1 text-[10px] font-semibold bg-gray-50 rounded-full text-gray-600 border border-gray-100">
                              {cat ? (lang === 'ar' ? cat.nameAr : cat.nameEn) : 'Unknown'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="text-gray-900 font-semibold">{p.price.toFixed(2)} {tenant.currencyEn}</div>
                            <div className="text-[10px] text-gray-400">{lang === 'ar' ? 'التكلفة:' : 'Cost:'} {p.costPrice.toFixed(2)}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-emerald-600 font-semibold">+{p.profit.toFixed(2)} {tenant.currencyEn}</div>
                            <div className="text-[10px] font-medium text-gray-400">{p.margin.toFixed(1)}% {lang === 'ar' ? 'هامش' : 'margin'}</div>
                          </td>
                          <td className="p-4">
                            {p.trackStock ? (
                              <span className={`font-semibold ${p.stockQuantity <= 10 ? 'text-amber-600 animate-pulse' : 'text-gray-700'}`}>
                                {p.stockQuantity} {lang === 'ar' ? 'حبة' : 'units'}
                              </span>
                            ) : (
                              <span className="text-gray-400">--</span>
                            )}
                          </td>
                          <td className="p-4">
                            {p.isVisible ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {lang === 'ar' ? 'نشط' : 'Visible'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-gray-400 bg-gray-50 rounded border border-gray-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                {lang === 'ar' ? 'مخفي' : 'Hidden'}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1">
                              <button 
                                onClick={() => handleMoveProductOrder(index, 'up')}
                                disabled={index === 0}
                                className="p-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30"
                              >
                                <ArrowUp className="w-3 h-3 text-gray-500" />
                              </button>
                              <button 
                                onClick={() => handleMoveProductOrder(index, 'down')}
                                disabled={index === tenantProducts.length - 1}
                                className="p-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30"
                              >
                                <ArrowDown className="w-3 h-3 text-gray-500" />
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => openProductModal(p)}
                                className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                                title="Edit Item"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.035)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-500">
                <thead className="bg-gray-50/70 text-[11px] uppercase text-gray-400 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="p-4">{lang === 'ar' ? 'الفئة' : 'Category'}</th>
                    <th className="p-4">{lang === 'ar' ? 'الوصف' : 'Description'}</th>
                    <th className="p-4">{lang === 'ar' ? 'الترتيب' : 'Order'}</th>
                    <th className="p-4">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th className="p-4 text-right">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {tenantCategories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">
                        {lang === 'ar' ? 'لم يتم العثور على فئات مطابقة.' : 'No categories found.'}
                      </td>
                    </tr>
                  ) : (
                    tenantCategories.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={c.imageUrl} 
                              alt={c.nameEn} 
                              className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900">{lang === 'ar' ? c.nameAr : c.nameEn}</h4>
                              <span className="text-[10px] text-rose-600 font-medium">
                                {products.filter(p => p.categoryId === c.id).length} {lang === 'ar' ? 'منتجات' : 'items'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 max-w-xs truncate text-gray-500">
                          {lang === 'ar' ? c.descriptionAr : c.descriptionEn}
                        </td>
                        <td className="p-4 font-mono text-gray-700 font-semibold">
                          #{c.displayOrder}
                        </td>
                        <td className="p-4">
                          {c.isVisible ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {lang === 'ar' ? 'نشط' : 'Visible'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-gray-400 bg-gray-50 rounded border border-gray-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                              {lang === 'ar' ? 'مخفي' : 'Hidden'}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => openCategoryModal(c)}
                              className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCategory(c.id)}
                              className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-905 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.035)] p-6 shadow-xs space-y-6 text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="border-b border-gray-100/10 pb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>⚙️</span>
              {lang === 'ar' ? 'إعدادات النظام العامة' : 'General System Settings'}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1">
              {lang === 'ar' ? 'التحكم في خيارات العمليات والخدمات المفعلة في المنصة' : 'Control operational features and services active on the platform'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Delivery toggle row */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-150/45 dark:border-gray-800/40">
              <div className="space-y-1 text-right">
                <span className="text-xs font-bold text-gray-800 dark:text-white block">
                  {lang === 'ar' ? 'تفعيل خدمة التوصيل للمنازل (Delivery)' : 'Enable Home Delivery Service'}
                </span>
                <p className="text-[10px] text-gray-400">
                  {lang === 'ar' 
                    ? 'عند تعطيله، سيتم إخفاء خيار التوصيل تماماً من المنيو الرقمي للعميل، ولن يتمكن الكاشير من قبول أو عرض طلبات التوصيل.'
                    : 'When disabled, delivery options will be completely hidden from the digital menu and POS checkout.'}
                </p>
              </div>

              <button
                onClick={() => {
                  if (setTenants) {
                    setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, enableDelivery: t.enableDelivery === false ? true : false } : t));
                    addAuditLog?.('TOGGLE_DELIVERY_SERVICE', 'Tenant', tenant.id, `Toggled delivery service to ${tenant.enableDelivery === false ? 'ENABLED' : 'DISABLED'}`);
                  }
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                  tenant.enableDelivery !== false ? 'bg-rose-600' : 'bg-gray-200 dark:bg-gray-850'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tenant.enableDelivery !== false ? (lang === 'ar' ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Store Brand & Appearance Settings */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6 space-y-4">
              <div>
                <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                  {lang === 'ar' ? 'مظهر وهواية المتجر (الماركة)' : 'Store Branding & Aesthetics'}
                </h4>
                <p className="text-[10px] text-gray-400 mt-1">
                  {lang === 'ar' ? 'تخصيص ألوان الهوية والشعار ومعلومات الاتصال وعناوين الفروع الأساسية للمتجر' : 'Customize identity colors, logo, default theme, phone and branch addresses'}
                </p>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-150/45 dark:border-gray-800/40">
                <div className="space-y-1 text-right">
                  <span className="text-xs font-bold text-gray-800 dark:text-white block">
                    {lang === 'ar' ? 'وضع مظهر الموقع الافتراضي' : 'Default Theme Mode'}
                  </span>
                  <p className="text-[10px] text-gray-400">
                    {lang === 'ar' ? 'اختر مظهر الموقع الافتراضي للمستخدمين والمدراء.' : 'Select the default theme mode for users and managers.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (setDarkMode) setDarkMode(false);
                      if (setTenants) {
                        setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, darkMode: false } : t));
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      !darkMode 
                        ? 'bg-rose-600 text-white shadow-xs' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    ☀️ {lang === 'ar' ? 'فاتح' : 'Light'}
                  </button>
                  <button
                    onClick={() => {
                      if (setDarkMode) setDarkMode(true);
                      if (setTenants) {
                        setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, darkMode: true } : t));
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      darkMode 
                        ? 'bg-rose-600 text-white shadow-xs' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    🌙 {lang === 'ar' ? 'داكن' : 'Dark'}
                  </button>
                </div>
              </div>

              {/* Color Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-150/45 dark:border-gray-800/40 space-y-2 text-right">
                  <label className="text-xs font-bold text-gray-800 dark:text-white block">
                    {lang === 'ar' ? 'اللون الأساسي للهوية' : 'Primary Brand Color'}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={tenant.primaryColor || '#c9a456'}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, primaryColor: e.target.value } : t));
                        }
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={tenant.primaryColor || '#c9a456'}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, primaryColor: e.target.value } : t));
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-150/45 dark:border-gray-800/40 space-y-2 text-right">
                  <label className="text-xs font-bold text-gray-800 dark:text-white block">
                    {lang === 'ar' ? 'اللون الثانوي للهوية' : 'Secondary Brand Color'}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={tenant.secondaryColor || '#dfbe75'}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, secondaryColor: e.target.value } : t));
                        }
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={tenant.secondaryColor || '#dfbe75'}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, secondaryColor: e.target.value } : t));
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Settings */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-150/45 dark:border-gray-800/40 space-y-4 text-right">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-800 dark:text-white block">
                      {lang === 'ar' ? 'شعار المتجر (Logo)' : 'Store Brand Logo'}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={tenant.logoUrl || ''}
                        onChange={(e) => {
                          if (setTenants) {
                            setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, logoUrl: e.target.value } : t));
                          }
                        }}
                        placeholder="https://example.com/logo.png"
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-mono text-left"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryTarget('logo');
                          setShowMediaGallery(true);
                        }}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Layers className="w-4 h-4" />
                        {lang === 'ar' ? 'المعرض' : 'Gallery'}
                      </button>
                      <label className="flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-255 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-755 transition cursor-pointer select-none shrink-0">
                        <Upload className="w-3.5 h-3.5 text-gray-500" />
                        <span>{lang === 'ar' ? 'رفع الشعار' : 'Upload Logo'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleLogoImageUpload}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-3 h-24 bg-white dark:bg-gray-855">
                    {tenant.logoUrl ? (
                      <img src={tenant.logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain rounded-lg shadow-xs bg-white" />
                    ) : (
                      <span className="text-[10px] text-gray-400">{lang === 'ar' ? 'لا يوجد شعار' : 'No logo preview'}</span>
                    )}
                  </div>
                </div>

                {/* Logo visibility options */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-gray-100/10">
                  <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={tenant.showLogoInHeader !== false}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, showLogoInHeader: e.target.checked } : t));
                        }
                      }}
                      className="rounded-sm border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                    <span>{lang === 'ar' ? 'عرض اللوجو في الهيدر (Header)' : 'Show Logo in Sticky Header'}</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={tenant.showLogoInFooter !== false}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, showLogoInFooter: e.target.checked } : t));
                        }
                      }}
                      className="rounded-sm border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                    <span>{lang === 'ar' ? 'عرض اللوجو في الفوتر (Footer)' : 'Show Logo in Main Footer'}</span>
                  </label>
                </div>
              </div>

              {/* Multiple Branches & Locations Management */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-150/45 dark:border-gray-800/40 space-y-4 text-right">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100/10">
                  <div>
                    <h5 className="text-xs font-bold text-gray-850 dark:text-white">
                      {lang === 'ar' ? 'إدارة الفروع وعناوينها (أكثر من عنوان ورقم)' : 'Branches & Locations Editor'}
                    </h5>
                    <p className="text-[9px] text-gray-400 mt-0.5">
                      {lang === 'ar' ? 'يمكنك إضافة فروع متعددة مع عناوين باللغتين وأرقام هواتف منفصلة للفوتر.' : 'Add, edit or remove multiple branch locations and contact details.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (setBranches) {
                        const newId = `b-${Date.now()}`;
                        setBranches(prev => [
                          ...prev,
                          {
                            id: newId,
                            tenantId: tenant.id,
                            nameEn: 'New Branch Location',
                            nameAr: 'فرع جديد للمطعم',
                            addressEn: 'Main Street Address',
                            addressAr: 'عنوان تفصيلي للفرع',
                            phone: tenant.phone || '',
                            isActive: true
                          }
                        ]);
                      }
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                  >
                    + {lang === 'ar' ? 'إضافة فرع جديد' : 'Add New Branch'}
                  </button>
                </div>

                <div className="space-y-3.5 pt-2 max-h-[400px] overflow-y-auto pr-1">
                  {branches.filter(b => b.tenantId === tenant.id).map((branch, index) => (
                    <div key={branch.id} className="p-3 bg-white dark:bg-gray-850 rounded-xl border border-gray-150/20 dark:border-gray-800 space-y-3 relative shadow-xs">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100/10">
                        <span className="text-[10px] font-bold text-rose-600">
                          {lang === 'ar' ? `الفرع ${index + 1}` : `Location ${index + 1}`}
                        </span>
                        {branches.filter(b => b.tenantId === tenant.id).length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (setBranches) {
                                setBranches(prev => prev.filter(b => b.id !== branch.id));
                              }
                            }}
                            className="text-red-500 hover:text-red-700 text-[10px] font-bold transition"
                          >
                            {lang === 'ar' ? 'حذف الفرع' : 'Remove Branch'}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500">{lang === 'ar' ? 'اسم الفرع (عربي)' : 'Branch Name (AR)'}</label>
                          <input
                            type="text"
                            value={branch.nameAr}
                            onChange={(e) => {
                              if (setBranches) {
                                setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, nameAr: e.target.value } : b));
                              }
                            }}
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500">{lang === 'ar' ? 'اسم الفرع (إنجليزي)' : 'Branch Name (EN)'}</label>
                          <input
                            type="text"
                            value={branch.nameEn}
                            onChange={(e) => {
                              if (setBranches) {
                                setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, nameEn: e.target.value } : b));
                              }
                            }}
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-left"
                            dir="ltr"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500">{lang === 'ar' ? 'عنوان الفرع (عربي)' : 'Address (AR)'}</label>
                          <input
                            type="text"
                            value={branch.addressAr}
                            onChange={(e) => {
                              if (setBranches) {
                                setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, addressAr: e.target.value } : b));
                              }
                            }}
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500">{lang === 'ar' ? 'عنوان الفرع (إنجليزي)' : 'Address (EN)'}</label>
                          <input
                            type="text"
                            value={branch.addressEn}
                            onChange={(e) => {
                              if (setBranches) {
                                setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, addressEn: e.target.value } : b));
                              }
                            }}
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-left"
                            dir="ltr"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[9px] font-bold text-gray-500">{lang === 'ar' ? 'رقم الهاتف المخصص للفرع' : 'Branch Phone Number'}</label>
                          <input
                            type="text"
                            value={branch.phone}
                            onChange={(e) => {
                              if (setBranches) {
                                setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, phone: e.target.value } : b));
                              }
                            }}
                            placeholder="+966 50 123 4567"
                            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-left font-mono"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Links & Chat Customization */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-150/45 dark:border-gray-800/40 space-y-4 text-right">
                <div>
                  <h5 className="text-xs font-bold text-gray-800 dark:text-white">
                    {lang === 'ar' ? 'روابط التواصل الاجتماعي ورقم الواتساب' : 'Social Channels & WhatsApp'}
                  </h5>
                  <p className="text-[9px] text-gray-400 mt-0.5">
                    {lang === 'ar' ? 'تعديل روابط منصات التواصل ورقم الواتساب للربط التلقائي في المنيو.' : 'Update social channel links and support WhatsApp number.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'رقم الواتساب للمتجر' : 'WhatsApp Chat Number'}</label>
                    <input
                      type="text"
                      value={tenant.whatsappNumber || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, whatsappNumber: e.target.value } : t));
                        }
                      }}
                      placeholder="966500000000"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'رابط حساب الانستجرام (Instagram)' : 'Instagram URL'}</label>
                    <input
                      type="text"
                      value={tenant.instagramUrl || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, instagramUrl: e.target.value } : t));
                        }
                      }}
                      placeholder="https://instagram.com/yourbrand"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-left"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'رابط حساب الفيسبوك (Facebook)' : 'Facebook URL'}</label>
                    <input
                      type="text"
                      value={tenant.facebookUrl || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, facebookUrl: e.target.value } : t));
                        }
                      }}
                      placeholder="https://facebook.com/yourbrand"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-left"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'رابط حساب تويتر / إكس (Twitter/X)' : 'Twitter / X URL'}</label>
                    <input
                      type="text"
                      value={tenant.twitterUrl || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, twitterUrl: e.target.value } : t));
                        }
                      }}
                      placeholder="https://x.com/yourbrand"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Customization Fields */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-150/45 dark:border-gray-800/40 space-y-4 text-right">
                <div>
                  <h5 className="text-xs font-bold text-gray-800 dark:text-white">
                    {lang === 'ar' ? 'تخصيص نصوص الفوتر' : 'Footer Content Customization'}
                  </h5>
                  <p className="text-[9px] text-gray-400 mt-0.5">
                    {lang === 'ar' ? 'تعديل نصوص الفوتر التعريفية وساعات العمل في المنيو الرقمي للعملاء.' : 'Modify slogan, description and opening hours rendered in the footer.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Slogan */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'شعار المتجر القصير (عربي)' : 'Brand Slogan (Arabic)'}</label>
                    <input
                      type="text"
                      value={tenant.sloganAr || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, sloganAr: e.target.value } : t));
                        }
                      }}
                      placeholder="أفضل جودة وخدمة ممتازة"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'شعار المتجر القصير (إنجليزي)' : 'Brand Slogan (English)'}</label>
                    <input
                      type="text"
                      value={tenant.sloganEn || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, sloganEn: e.target.value } : t));
                        }
                      }}
                      placeholder="Premium Quality & Experience"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'وصف المتجر في الفوتر (عربي)' : 'Footer Description (Arabic)'}</label>
                    <textarea
                      value={tenant.descAr || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, descAr: e.target.value } : t));
                        }
                      }}
                      placeholder="فخورون بتقديم أشهى المأكولات المعدة بحب وشغف طيلة أيام الأسبوع..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs resize-none"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'وصف المتجر في الفوتر (إنجليزي)' : 'Footer Description (English)'}</label>
                    <textarea
                      value={tenant.descEn || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, descEn: e.target.value } : t));
                        }
                      }}
                      placeholder="Proudly serving handcrafted meals prepared with fresh ingredients..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs resize-none text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Hours */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'أوقات العمل (عربي)' : 'Opening Hours (Arabic)'}</label>
                    <input
                      type="text"
                      value={tenant.hoursAr || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, hoursAr: e.target.value } : t));
                        }
                      }}
                      placeholder="ساعات العمل: ١٢ ظهراً - ٢ ليلاً"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'أوقات العمل (إنجليزي)' : 'Opening Hours (English)'}</label>
                    <input
                      type="text"
                      value={tenant.hoursEn || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, hoursEn: e.target.value } : t));
                        }
                      }}
                      placeholder="Opening Hours: 12 PM - 2 AM"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Support Message */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'نص خدمة العملاء (عربي)' : 'Support Callout (Arabic)'}</label>
                    <input
                      type="text"
                      value={tenant.supportAr || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, supportAr: e.target.value } : t));
                        }
                      }}
                      placeholder="هل لديك أي استفسار أو ترغب في تقديم طلب خاص؟ تواصل معنا مباشرة"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'نص خدمة العملاء (إنجليزي)' : 'Support Callout (English)'}</label>
                    <input
                      type="text"
                      value={tenant.supportEn || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, supportEn: e.target.value } : t));
                        }
                      }}
                      placeholder="Have any questions or special orders? Contact our support channels directly"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Social Message */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'نص وسائل التواصل الاجتماعي (عربي)' : 'Social Callout (Arabic)'}</label>
                    <input
                      type="text"
                      value={tenant.socialAr || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, socialAr: e.target.value } : t));
                        }
                      }}
                      placeholder="ابقَ على اطلاع بأحدث عروضنا الموسمية وأطباقنا الجديدة..."
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'نص وسائل التواصل الاجتماعي (إنجليزي)' : 'Social Callout (English)'}</label>
                    <input
                      type="text"
                      value={tenant.socialEn || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, socialEn: e.target.value } : t));
                        }
                      }}
                      placeholder="Stay tuned for seasonal discounts, new menu arrivals..."
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Handle */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-700 dark:text-gray-300 block">{lang === 'ar' ? 'المعرف الرقمي للموقع (Social Handle)' : 'Branded Social Handle'}</label>
                    <input
                      type="text"
                      value={tenant.handle || ''}
                      onChange={(e) => {
                        if (setTenants) {
                          setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, handle: e.target.value } : t));
                        }
                      }}
                      placeholder="@restaurant"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-left font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      </main>
    </div>

      {/* Product Form Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 bg-gray-50/50">
              <h3 className="text-base font-bold text-gray-900">
                {editingProduct 
                  ? (lang === 'ar' ? `تعديل منتج: ${editingProduct.nameAr}` : `Edit Product: ${editingProduct.nameEn}`)
                  : (lang === 'ar' ? 'إضافة منتج جديد' : 'Create New Menu Product')}
              </h3>
              <button 
                onClick={() => setShowProductModal(false)}
                className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-5 text-xs text-gray-700 text-left rtl:text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              
              {/* Product Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">{lang === 'ar' ? 'اسم المنتج بالإنجليزية *' : 'Product Name (English) *'}</label>
                  <input 
                    type="text" 
                    value={prodNameEn}
                    onChange={(e) => setProdNameEn(e.target.value)}
                    placeholder="e.g. Wagyu Truffle Burger"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">{lang === 'ar' ? 'اسم المنتج بالعربية *' : 'Product Name (Arabic) *'}</label>
                  <input 
                    type="text" 
                    value={prodNameAr}
                    onChange={(e) => setProdNameAr(e.target.value)}
                    placeholder="مثال: برجر واغيو بالكمأة"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition"
                    required
                  />
                </div>
              </div>

              {/* Product Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">{lang === 'ar' ? 'الوصف بالإنجليزية' : 'Description (English)'}</label>
                  <textarea 
                    value={prodDescEn}
                    onChange={(e) => setProdDescEn(e.target.value)}
                    placeholder="Provide a delightful detailed description..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">{lang === 'ar' ? 'الوصف بالعربية' : 'Description (Arabic)'}</label>
                  <textarea 
                    value={prodDescAr}
                    onChange={(e) => setProdDescAr(e.target.value)}
                    placeholder="اكتب وصفاً جذاباً وتفصيلياً للمنتج..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition resize-none"
                  />
                </div>
              </div>

              {/* Financial Fields */}
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-rose-600" />
                  {lang === 'ar' ? 'التسعير وحساب الهامش' : 'Pricing & Financial Engineering'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-600">{lang === 'ar' ? 'سعر البيع *' : 'Selling Price *'}</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-rose-600 transition font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-600">{lang === 'ar' ? 'تكلفة الإنتاج *' : 'Cost of Goods *'}</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={prodCost}
                      onChange={(e) => setProdCost(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-rose-600 transition font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-400">{lang === 'ar' ? 'صافي الربح المتوقع' : 'Expected Profit'}</label>
                    <div className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-center">
                      {computedProfit.toFixed(2)} {tenant.currencyEn}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-400">{lang === 'ar' ? 'هامش الربح (%)' : 'Profit Margin (%)'}</label>
                    <div className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-green-50 text-green-700 font-bold text-center">
                      {computedMargin.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Sourcing & Categories & Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">{lang === 'ar' ? 'فئة المنتج المحددة *' : 'Target Category *'}</label>
                  <select 
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition text-gray-600"
                    required
                  >
                    {tenantCategories.map(c => (
                      <option key={c.id} value={c.id}>{lang === 'ar' ? c.nameAr : c.nameEn}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">SKU / Code *</label>
                  <input 
                    type="text" 
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">{lang === 'ar' ? 'الباركود' : 'Barcode EAN'}</label>
                  <input 
                    type="text" 
                    value={prodBarcode}
                    onChange={(e) => setProdBarcode(e.target.value)}
                    placeholder="e.g. 6281100..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition font-mono"
                  />
                </div>
              </div>

              {/* Nutrition & Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">{lang === 'ar' ? 'السعرات الحرارية' : 'Total Calories'}</label>
                  <input 
                    type="number" 
                    value={prodCalories}
                    onChange={(e) => setProdCalories(e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">{lang === 'ar' ? 'وقت التحضير (بالدقائق)' : 'Preparation Time (Minutes)'}</label>
                  <input 
                    type="number" 
                    value={prodPrepTime}
                    onChange={(e) => setProdPrepTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">{lang === 'ar' ? 'تتبع كمية المخزون' : 'Active Stock Tracking'}</label>
                  <div className="flex items-center gap-3 py-1.5">
                    <input 
                      type="checkbox" 
                      id="trackStock"
                      checked={prodTrackStock}
                      onChange={(e) => setProdTrackStock(e.target.checked)}
                      className="rounded accent-rose-600 w-4 h-4"
                    />
                    <label htmlFor="trackStock" className="text-gray-500 font-medium">
                      {lang === 'ar' ? 'تفعيل جرد المستودع' : 'Track stock levels'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Image & Video Upload Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="font-semibold text-gray-700 block">{lang === 'ar' ? 'صورة المنتج' : 'Product Image'}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={prodImageUrl}
                      onChange={(e) => setProdImageUrl(e.target.value)}
                      placeholder="https://... أو /uploads/products/..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setGalleryTarget('product');
                        setShowMediaGallery(true);
                      }}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg transition text-xs font-semibold flex items-center gap-1.5 shrink-0"
                    >
                      <Layers className="w-4 h-4" />
                      {lang === 'ar' ? 'معرض الصور' : 'Browse Gallery'}
                    </button>
                    <label className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                      <Upload className="w-4 h-4" />
                      {lang === 'ar' ? 'رفع صورة' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProductImageUpload}
                      />
                    </label>
                  </div>
                  <span className="text-[10px] text-gray-400 block">{lang === 'ar' ? 'يمكنك تحديد صورة من معرض الأكل المحلي، أو رفع ملف صورة جديدة مباشرة.' : 'Select a food photo from the local gallery or upload a new photo directly.'}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">{lang === 'ar' ? 'رابط فيديو للمنتج (اختياري)' : 'Promo Video URL (Optional)'}</label>
                  <input 
                    type="text" 
                    value={prodVideoUrl}
                    onChange={(e) => setProdVideoUrl(e.target.value)}
                    placeholder="https://assets.mixkit.co/..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition text-xs"
                  />
                </div>
              </div>

              {/* Sizes / Product Variants builder */}
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <Shuffle className="w-4 h-4 text-rose-600" />
                  {lang === 'ar' ? 'أحجام وخيارات المنتج الإضافية' : 'Product Sizes & Pricing Variations'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input 
                    type="text" 
                    placeholder={lang === 'ar' ? 'الحجم بالإنجليزية (مثال: Medium)' : 'Size EN (e.g. Large)'}
                    value={newSizeNameEn}
                    onChange={(e) => setNewSizeNameEn(e.target.value)}
                    className="px-2.5 py-1.5 border border-gray-200 rounded bg-white text-xs"
                  />
                  <input 
                    type="text" 
                    placeholder={lang === 'ar' ? 'الحجم بالعربية (مثال: وسط)' : 'Size AR (e.g. كبير)'}
                    value={newSizeNameAr}
                    onChange={(e) => setNewSizeNameAr(e.target.value)}
                    className="px-2.5 py-1.5 border border-gray-200 rounded bg-white text-xs"
                  />
                  <input 
                    type="number" 
                    placeholder={lang === 'ar' ? 'فرق السعر (مثال: +10)' : 'Price Diff (e.g. +15)'}
                    value={newSizePriceDiff}
                    onChange={(e) => setNewSizePriceDiff(e.target.value)}
                    className="px-2.5 py-1.5 border border-gray-200 rounded bg-white text-xs"
                  />
                  <button 
                    type="button"
                    onClick={handleAddSize}
                    className="px-3 py-1.5 bg-rose-600 text-white font-semibold rounded hover:bg-rose-700 transition"
                  >
                    {lang === 'ar' ? 'أضف الحجم' : 'Add Option'}
                  </button>
                </div>

                {prodSizes.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {prodSizes.map((size, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 text-[11px]">
                        <span className="font-semibold text-gray-700">{size.nameEn} | {size.nameAr}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-rose-600">+{size.priceDifference.toFixed(2)} {tenant.currencyEn}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveSize(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modifiers & Multi-Select lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">{lang === 'ar' ? 'ربط مجموعات المعدلات' : 'Link Modifier Groups'}</label>
                  <div className="p-3 border border-gray-200 rounded-lg max-h-32 overflow-y-auto space-y-2 bg-white">
                    {modifierGroups.filter(mg => mg.tenantId === tenant.id).map(mg => (
                      <label key={mg.id} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={prodModifierGroupIds.includes(mg.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProdModifierGroupIds([...prodModifierGroupIds, mg.id]);
                            } else {
                              setProdModifierGroupIds(prodModifierGroupIds.filter(id => id !== mg.id));
                            }
                          }}
                          className="rounded accent-rose-600"
                        />
                        <span>{lang === 'ar' ? mg.nameAr : mg.nameEn}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">{lang === 'ar' ? 'مسببات الحساسية' : 'Allergen Tags'}</label>
                  <div className="grid grid-cols-2 gap-2 p-3 border border-gray-200 rounded-lg bg-white">
                    {['Gluten', 'Dairy', 'Eggs', 'Nuts', 'Seafood', 'Soy', 'Mustard'].map(allergen => (
                      <label key={allergen} className="flex items-center gap-2 cursor-pointer text-xs">
                        <input 
                          type="checkbox"
                          checked={prodAllergens.includes(allergen)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProdAllergens([...prodAllergens, allergen]);
                            } else {
                              setProdAllergens(prodAllergens.filter(a => a !== allergen));
                            }
                          }}
                          className="rounded accent-rose-600"
                        />
                        <span>{allergen}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Marketing flags */}
              <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                    className="rounded accent-rose-600"
                  />
                  <span className="font-semibold text-gray-700">{lang === 'ar' ? 'منتج مميز (Featured)' : 'Featured Item'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={prodRecommended}
                    onChange={(e) => setProdRecommended(e.target.checked)}
                    className="rounded accent-rose-600"
                  />
                  <span className="font-semibold text-gray-700">{lang === 'ar' ? 'موصى به (Recommended)' : 'Recommended'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={prodPopular}
                    onChange={(e) => setProdPopular(e.target.checked)}
                    className="rounded accent-rose-600"
                  />
                  <span className="font-semibold text-gray-700">{lang === 'ar' ? 'شائع الاستخدام (Popular)' : 'Popular / Bestseller'}</span>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg font-semibold text-gray-500 hover:bg-gray-50 transition"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition shadow-sm"
                >
                  {lang === 'ar' ? 'حفظ التغييرات' : 'Save Product Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900">
                {editingCategory 
                  ? (lang === 'ar' ? 'تعديل الفئة' : 'Edit Category')
                  : (lang === 'ar' ? 'إضافة فئة جديدة' : 'Create Category')}
              </h3>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs text-left rtl:text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">{lang === 'ar' ? 'اسم الفئة بالإنجليزية *' : 'Category Title EN *'}</label>
                <input 
                  type="text" 
                  value={catNameEn}
                  onChange={(e) => setCatNameEn(e.target.value)}
                  placeholder="e.g. Beverages"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">{lang === 'ar' ? 'اسم الفئة بالعربية *' : 'Category Title AR *'}</label>
                <input 
                  type="text" 
                  value={catNameAr}
                  onChange={(e) => setCatNameAr(e.target.value)}
                  placeholder="مثال: المشروبات"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">{lang === 'ar' ? 'الوصف بالإنجليزية' : 'Description EN'}</label>
                <textarea 
                  value={catDescEn}
                  onChange={(e) => setCatDescEn(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">{lang === 'ar' ? 'الوصف بالعربية' : 'Description AR'}</label>
                <textarea 
                  value={catDescAr}
                  onChange={(e) => setCatDescAr(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">{lang === 'ar' ? 'رابط صورة للفئة' : 'Category Cover Image URL'}</label>
                <input 
                  type="text" 
                  value={catImageUrl}
                  onChange={(e) => setCatImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 mt-5">
                <button 
                  type="button" 
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition"
                >
                  {lang === 'ar' ? 'حفظ الفئة' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Gallery / Image Library Modal Overlay */}
      {showMediaGallery && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-rose-50/50">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  {lang === 'ar' ? 'معرض صور الأكل' : 'Food Media Library'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowMediaGallery(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search Images */}
                <div className="relative w-full sm:w-72">
                  <input 
                    type="text" 
                    placeholder={lang === 'ar' ? 'بحث في الصور...' : 'Search images...'}
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 text-sm transition"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400">
                    <ListFilter className="w-4 h-4" />
                  </span>
                </div>

                {/* Quick upload in gallery */}
                <label className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  {lang === 'ar' ? 'رفع صورة جديدة للمعرض' : 'Upload New Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async (event) => {
                        const base64Data = event.target?.result as string;
                        try {
                          const res = await fetch('/api/upload-image', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ fileName: file.name, base64Data })
                          });
                          const data = await res.json();
                          if (data.success) {
                            setGalleryImages(prev => [data.url, ...prev.filter(img => img !== data.url)]);
                            if (galleryTarget === 'product') {
                              setProdImageUrl(data.url);
                            } else if (galleryTarget === 'category') {
                              setCatImageUrl(data.url);
                            } else if (galleryTarget === 'logo') {
                              if (setTenants) {
                                setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, logoUrl: data.url } : t));
                              }
                            }
                            setShowMediaGallery(false);
                            setGalleryTarget(null);
                          } else {
                            alert(lang === 'ar' ? 'فشل الرفع: ' + data.error : 'Upload failed: ' + data.error);
                          }
                        } catch (err) {
                          alert(lang === 'ar' ? 'خطأ أثناء الرفع' : 'Error uploading image');
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>

              {/* Gallery Grid */}
              {galleryLoading ? (
                <div className="py-12 flex justify-center items-center">
                  <Activity className="w-8 h-8 text-rose-600 animate-spin" />
                </div>
              ) : filteredGalleryImages.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  {lang === 'ar' ? 'لا توجد صور مطابقة لبحثك' : 'No images match your search'}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5">
                  {filteredGalleryImages.map((imgUrl, i) => {
                    const fileName = imgUrl.split('/').pop() || '';
                    const isSelected = galleryTarget === 'product'
                      ? prodImageUrl === imgUrl
                      : galleryTarget === 'category'
                      ? catImageUrl === imgUrl
                      : tenant.logoUrl === imgUrl;
                    return (
                      <div 
                        key={i}
                        onClick={() => {
                          if (galleryTarget === 'product') {
                            setProdImageUrl(imgUrl);
                          } else if (galleryTarget === 'category') {
                            setCatImageUrl(imgUrl);
                          } else if (galleryTarget === 'logo') {
                            if (setTenants) {
                              setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, logoUrl: imgUrl } : t));
                            }
                          }
                          setShowMediaGallery(false);
                          setGalleryTarget(null);
                        }}
                        className={`group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border-2 transition hover:scale-[1.02] shadow-sm hover:shadow-md ${
                          isSelected ? 'border-rose-600 ring-2 ring-rose-100' : 'border-gray-200 hover:border-rose-300'
                        }`}
                      >
                        <img 
                          src={imgUrl} 
                          alt={fileName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Hover overlay with filename */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-150 flex flex-col justify-end p-2">
                          <p className="text-[10px] text-white font-medium truncate">{fileName}</p>
                        </div>
                        {/* Selected checkmark */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-0.5 shadow-sm animate-in zoom-in-50">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
              <div>
                {lang === 'ar' 
                  ? `إجمالي الصور المتوفرة: ${galleryImages.length} صورة` 
                  : `Total available images: ${galleryImages.length} photos`}
              </div>
              <button
                type="button"
                onClick={() => setShowMediaGallery(false)}
                className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg font-semibold text-gray-700 transition"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
