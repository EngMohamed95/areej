import fs from 'node:fs';
import path from 'node:path';
import {
  initialBranches,
  initialCategories,
  initialModifierGroups,
  initialProducts,
  initialTenants
} from '../src/initialData';

const target = path.resolve(process.cwd(), 'public', 'api', 'catalog.seed.json');
const seed = {
  tenants: initialTenants,
  branches: initialBranches,
  categories: initialCategories,
  modifierGroups: initialModifierGroups,
  products: initialProducts
};

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(seed, null, 2) + '\n', 'utf8');
console.log(`Generated MySQL catalog seed with ${initialProducts.length} products.`);
