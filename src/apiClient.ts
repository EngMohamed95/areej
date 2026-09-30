import { Branch, Category, ModifierGroup, Order, OrderItem, Product, StaffUser, Tenant } from './types';

export type CatalogResource = 'tenants' | 'branches' | 'categories' | 'modifierGroups' | 'products';

export interface CatalogSnapshot {
  success: boolean;
  changed: boolean;
  version: number;
  tenants?: Tenant[];
  branches?: Branch[];
  categories?: Category[];
  modifierGroups?: ModifierGroup[];
  products?: Product[];
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Database API is not available on this server.');
  }

  const data = await response.json();
  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
  return data as T;
};

export const fetchCatalog = async (since = 0, signal?: AbortSignal): Promise<CatalogSnapshot> => {
  const response = await fetch(`/api/catalog.php?since=${since}`, {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    signal
  });
  return parseResponse<CatalogSnapshot>(response);
};

export const saveCatalogResource = async <T>(resource: CatalogResource, records: T[]) => {
  const response = await fetch('/api/catalog.php', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resource, records })
  });
  return parseResponse<{ success: true; version: number }>(response);
};

export const loginAdmin = async (pin: string) => {
  const response = await fetch('/api/auth.php', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin })
  });
  return parseResponse<{ success: true; user: StaffUser }>(response);
};

export const checkAdminSession = async () => {
  const response = await fetch('/api/auth.php', {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store'
  });
  return parseResponse<{ success: true; authenticated: boolean; user: StaffUser | null }>(response);
};

export const fetchUsers = async () => {
  const response = await fetch('/api/users.php', {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store'
  });
  return parseResponse<{ success: true; users: StaffUser[] }>(response);
};

export const saveUser = async (user: StaffUser & { pin?: string }) => {
  const response = await fetch('/api/users.php', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return parseResponse<{ success: true; user: StaffUser }>(response);
};

export const deleteUser = async (id: string) => {
  const response = await fetch('/api/users.php', {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  return parseResponse<{ success: true }>(response);
};

export const logoutAdmin = async () => {
  const response = await fetch('/api/auth.php', {
    method: 'DELETE',
    credentials: 'same-origin'
  });
  return parseResponse<{ success: true }>(response);
};

export const createOrder = async (
  order: Order,
  items: Omit<OrderItem, 'id' | 'orderId'>[]
) => {
  const response = await fetch('/api/orders.php', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order, items })
  });
  return parseResponse<{ success: true; orderId: string }>(response);
};
