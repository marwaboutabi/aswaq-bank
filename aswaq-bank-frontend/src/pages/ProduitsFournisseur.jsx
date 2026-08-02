import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, CreditCard, Truck, Layers, User, Settings,
  HelpCircle, LogOut, Search, Bell, ChevronDown, ChevronLeft, ChevronRight,
  Building2, Plus, Pencil, Trash2, X, AlertTriangle, XCircle, CheckCircle2,
  SlidersHorizontal, Bot
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './ProduitsFournisseur.css';

const STATS = [
  { key: 'total', icon: Package, tone: 'blue', label: 'Produits', value: '87' },
  { key: 'faible', icon: AlertTriangle, tone: 'orange', label: 'Stock faible', value: '5' },
  { key: 'rupture', icon: XCircle, tone: 'purple', label: 'Rupture', value: '2' },
  { key: 'categories', icon: Layers, tone: 'teal', label: 'Catégories', value: '12' },
];

const CATEGORIES = ['Épicerie', 'Boissons', 'Produits frais', 'Hygiène'];

function availabilityFromStock(stock) {
  if (stock === 0) return 'Rupture';
  if (stock <= 10) return 'Stock faible';
  return 'Disponible';
}

const INITIAL_PRODUCTS = [
  { id: 1, name: "Huile d'olive 1L", category: 'Épicerie', price: 75, stock: 120, emoji: '🫒', sku: 'EPI-0012', unit: 'Bouteille', weight: '1 L', updated: '20 Juil 2026', description: "Huile d'olive extra vierge, pression à froid." },
  { id: 2, name: 'Sucre Blanc 1kg', category: 'Épicerie', price: 14, stock: 6, emoji: '🍚', sku: 'EPI-0034', unit: 'Sachet', weight: '1 kg', updated: '19 Juil 2026', description: 'Sucre blanc cristallisé, sachet refermable.' },
  { id: 3, name: 'Café Moulu 250g', category: 'Boissons', price: 48, stock: 0, emoji: '☕', sku: 'BOI-0021', unit: 'Paquet', weight: '250 g', updated: '18 Juil 2026', description: 'Café moulu torréfaction artisanale.' },
  { id: 4, name: 'Thé Vert 100g', category: 'Boissons', price: 32, stock: 4, emoji: '🍵', sku: 'BOI-0045', unit: 'Boîte', weight: '100 g', updated: '21 Juil 2026', description: 'Thé vert à la menthe, feuilles entières.' },
  { id: 5, name: 'Farine 1kg', category: 'Épicerie', price: 9, stock: 85, emoji: '🌾', sku: 'EPI-0056', unit: 'Sachet', weight: '1 kg', updated: '22 Juil 2026', description: 'Farine blanche type 55, qualité supérieure.' },
  { id: 6, name: 'Lait UHT 1L', category: 'Produits frais', price: 7, stock: 200, emoji: '🥛', sku: 'FRA-0011', unit: 'Brique', weight: '1 L', updated: '23 Juil 2026', description: 'Lait entier UHT, longue conservation.' },
  { id: 7, name: 'Savon Liquide 500ml', category: 'Hygiène', price: 22, stock: 0, emoji: '🧴', sku: 'HYG-0007', unit: 'Flacon', weight: '500 ml', updated: '17 Juil 2026', description: 'Savon liquide antibactérien, parfum neutre.' },
  { id: 8, name: 'Riz Basmati 1kg', category: 'Épicerie', price: 28, stock: 15, emoji: '🍚', sku: 'EPI-0078', unit: 'Sachet', weight: '1 kg', updated: '24 Juil 2026', description: 'Riz basmati long grain, origine Inde.' },
  { id: 9, name: "Jus d'Orange 1L", category: 'Boissons', price: 18, stock: 9, emoji: '🧃', sku: 'BOI-0063', unit: 'Bouteille', weight: '1 L', updated: '25 Juil 2026', description: "Jus d'orange 100% pur jus, sans sucre ajouté." },
  { id: 10, name: 'Dentifrice 75ml', category: 'Hygiène', price: 16, stock: 60, emoji: '🪥', sku: 'HYG-0019', unit: 'Tube', weight: '75 ml', updated: '26 Juil 2026', description: 'Dentifrice fluoré, protection complète.' },
];

const EMPTY_FORM = {
  name: '', description: '', category: CATEGORIES[0], price: '', stock: '', unit: '', emoji: '📦', sku: '', weight: '',
};

const PAGE_SIZE = 10;

function AvailabilityBadge({ stock }) {
  const status = availabilityFromStock(stock);
  const toneMap = { Disponible: 'green', 'Stock faible': 'orange', Rupture: 'red' };
  return <span className={`prod-four-badge-pill prod-four-badge-pill-${toneMap[status]}`}>{status}</span>;
}

function ProductFormModal({ title, submitLabel, initialValues, onCancel, onSubmit }) {
  const [form, setForm] = useState(initialValues);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="prod-four-modal-overlay" onClick={onCancel}>
      <div className="prod-four-modal" onClick={(e) => e.stopPropagation()}>
        <div className="prod-four-modal-header">
          <h3>{title}</h3>
          <button type="button" className="prod-four-modal-close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <form className="prod-four-modal-body" onSubmit={handleSubmit}>
          <div className="prod-four-form-row">
            <label>Nom du produit</label>
            <input type="text" value={form.name} onChange={update('name')} placeholder="Ex. Huile d'olive 1L" required />
          </div>

          <div className="prod-four-form-row">
            <label>Description</label>
            <textarea value={form.description} onChange={update('description')} placeholder="Courte description du produit" rows={3} />
          </div>

          <div className="prod-four-form-grid">
            <div className="prod-four-form-row">
              <label>Catégorie</label>
              <select value={form.category} onChange={update('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="prod-four-form-row">
              <label>Prix (MAD)</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={update('price')} placeholder="0.00" required />
            </div>
          </div>

          <div className="prod-four-form-grid">
            <div className="prod-four-form-row">
              <label>Stock</label>
              <input type="number" min="0" value={form.stock} onChange={update('stock')} placeholder="0" required />
            </div>
            <div className="prod-four-form-row">
              <label>Unité</label>
              <input type="text" value={form.unit} onChange={update('unit')} placeholder="Ex. Sachet, Bouteille..." />
            </div>
          </div>

          <div className="prod-four-form-grid">
            <div className="prod-four-form-row">
              <label>SKU</label>
              <input type="text" value={form.sku} onChange={update('sku')} placeholder="Ex. EPI-0099" />
            </div>
            <div className="prod-four-form-row">
              <label>Poids</label>
              <input type="text" value={form.weight} onChange={update('weight')} placeholder="Ex. 1 kg" />
            </div>
          </div>

          

          <div className="prod-four-modal-actions">
            <button type="button" className="prod-four-btn prod-four-btn-ghost" onClick={onCancel}>Annuler</button>
            <button type="submit" className="prod-four-btn prod-four-btn-primary">{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ product, onCancel, onConfirm }) {
  return (
    <div className="prod-four-modal-overlay" onClick={onCancel}>
      <div className="prod-four-modal prod-four-modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="prod-four-confirm-icon">
          <AlertTriangle size={22} />
        </div>
        <h3 className="prod-four-confirm-title">Supprimer ce produit ?</h3>
        <p className="prod-four-confirm-text">
          {product?.name ? `« ${product.name} » va être supprimé. ` : ''}Cette action est irréversible.
        </p>
        <div className="prod-four-modal-actions prod-four-modal-actions-center">
          <button type="button" className="prod-four-btn prod-four-btn-ghost" onClick={onCancel}>Annuler</button>
          <button type="button" className="prod-four-btn prod-four-btn-danger" onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

export default function ProduitsFournisseur() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' },
    { icon: Package, label: 'Produits', to: '/produits-fournisseur', active: true },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur' },
    { icon: CreditCard, label: 'Paiements', to: '/paiements-fournisseur' },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' },
    { icon: Layers, label: 'Catalogue', to: '/catalogue-fournisseur' },
    { icon: Bell, label: 'Notifications', to: '/notifications-fournisseur' },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-fournisseur' },
    { icon: User, label: 'Profil & Paramètres', to: '/profil-fournisseur' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      const status = availabilityFromStock(p.stock);
      const matchesStatus =
        statusFilter === 'all'
        || (statusFilter === 'available' && status === 'Disponible')
        || (statusFilter === 'low' && status === 'Stock faible')
        || (statusFilter === 'out' && status === 'Rupture');
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetFiltersPage = () => setPage(1);

  const handleAddProduct = (form) => {
    const newProduct = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      emoji: form.emoji || '📦',
      unit: form.unit,
      sku: form.sku,
      weight: form.weight,
      updated: "Aujourd'hui",
    };
    setProducts((prev) => [newProduct, ...prev]);
    setShowAddModal(false);
  };

  const handleEditProduct = (form) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: form.name,
              description: form.description,
              category: form.category,
              price: Number(form.price) || 0,
              stock: Number(form.stock) || 0,
              emoji: form.emoji || p.emoji,
              unit: form.unit,
              sku: form.sku,
              weight: form.weight,
              updated: "Aujourd'hui",
            }
          : p
      )
    );
    setEditingProduct(null);
  };

  const handleConfirmDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    setDeletingProduct(null);
  };

  return (
    <div className="prod-four-layout">
      {/* Sidebar */}
      <aside className="prod-four-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6" logo-white />
        </div>

        <p className="prod-four-sidebar-section">
          <Building2 size={13} />
          FOURNISSEUR
        </p>

        <nav className="prod-four-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to || '#'}
                state={location.state}
                className={`prod-four-nav-item ${item.active ? 'prod-four-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/" className="prod-four-logout">
          <LogOut size={18} />
          Se déconnecter
        </Link>
      </aside>

      {/* Main content */}
      <main className="prod-four-main">
        <header className="prod-four-topbar">
          <div>
            <h1 className="prod-four-greeting">Catalogue des produits</h1>
            <p className="prod-four-greeting-sub">Gérez les produits proposés à vos commerçants.</p>
          </div>

          <div className="prod-four-topbar-actions">
            <div className="prod-four-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button type="button" className="prod-four-icon-button" onClick={() => navigate('/notifications-fournisseur')}>
              <Bell size={18} />
              <span className="prod-four-badge">3</span>
            </button>
            <div className="prod-four-user-chip">
              <div className="prod-four-user-avatar">MB</div>
              <div className="prod-four-user-info">
                <span className="prod-four-user-name">Marwa Boutabi</span>
                <span className="prod-four-user-role">Fournisseur</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="prod-four-stats-row">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div className="prod-four-stat-card" key={s.key}>
                <div className={`prod-four-stat-icon prod-four-stat-icon-${s.tone}`}>
                  <Icon size={18} />
                </div>
                <div className="prod-four-stat-label">{s.label}</div>
                <p className="prod-four-stat-value">{s.value}</p>
              </div>
            );
          })}
        </section>

        {/* Toolbar: search / filters / add */}
        <section className="prod-four-toolbar">
          <div className="prod-four-toolbar-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetFiltersPage();
              }}
            />
          </div>

          <div className="prod-four-toolbar-filters">
            <div className="prod-four-select-wrap">
              <SlidersHorizontal size={14} />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  resetFiltersPage();
                }}
              >
                <option value="all">Toutes les catégories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="prod-four-select-wrap">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  resetFiltersPage();
                }}
              >
                <option value="all">Tous les statuts</option>
                <option value="available">En stock</option>
                <option value="low">Stock faible</option>
                <option value="out">Rupture</option>
              </select>
            </div>
          </div>

          <button type="button" className="prod-four-btn prod-four-btn-primary prod-four-add-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Ajouter un produit
          </button>
        </section>

        {/* Table */}
        <section className="prod-four-panel prod-four-table-panel">
          <div className="prod-four-table-scroll">
            <table className="prod-four-table">
              <thead>
                <tr>
                  <th>Nom du produit</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Disponibilité</th>
                  <th>Dernière mise à jour</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="prod-four-product-name">{p.name}</span>
                    </td>
                    <td>
                      <span className="prod-four-category-pill">{p.category}</span>
                    </td>
                    <td className="prod-four-price">{p.price.toLocaleString('fr-FR')} MAD</td>
                    <td className="prod-four-stock">{p.stock}</td>
                    <td><AvailabilityBadge stock={p.stock} /></td>
                    <td className="prod-four-updated">{p.updated}</td>
                    <td>
                      <div className="prod-four-row-actions">
                        <button
                          type="button"
                          className="prod-four-action-btn"
                          title="Modifier"
                          onClick={() => setEditingProduct(p)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="prod-four-action-btn prod-four-action-btn-danger"
                          title="Supprimer"
                          onClick={() => setDeletingProduct(p)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {pageProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="prod-four-empty-row">
                      Aucun produit ne correspond à votre recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="prod-four-pagination">
            <span className="prod-four-pagination-info">
              {filteredProducts.length === 0
                ? '0 produit'
                : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} sur ${filteredProducts.length} produits`}
            </span>
            <div className="prod-four-pagination-controls">
              <button
                type="button"
                className="prod-four-page-btn"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`prod-four-page-btn ${n === currentPage ? 'prod-four-page-btn-active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className="prod-four-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {showAddModal && (
        <ProductFormModal
          title="Ajouter un produit"
          submitLabel="Ajouter"
          initialValues={EMPTY_FORM}
          onCancel={() => setShowAddModal(false)}
          onSubmit={handleAddProduct}
        />
      )}

      {editingProduct && (
        <ProductFormModal
          title="Modifier le produit"
          submitLabel="Enregistrer les modifications"
          initialValues={{
            name: editingProduct.name,
            description: editingProduct.description || '',
            category: editingProduct.category,
            price: editingProduct.price,
            stock: editingProduct.stock,
            unit: editingProduct.unit || '',
            emoji: editingProduct.emoji || '📦',
            sku: editingProduct.sku || '',
            weight: editingProduct.weight || '',
          }}
          onCancel={() => setEditingProduct(null)}
          onSubmit={handleEditProduct}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onCancel={() => setDeletingProduct(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}