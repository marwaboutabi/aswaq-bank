import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, CreditCard, Truck, Layers, User, Settings,
  HelpCircle, LogOut, Search, Bell, ChevronDown, ChevronLeft, ChevronRight,
  Building2, Plus, Pencil, Trash2, X, AlertTriangle, XCircle, CheckCircle2,
  SlidersHorizontal, Bot
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import axiosClient from '../services/api';
import './ProduitsFournisseur.css';

const CATEGORIES = ['Épicerie', 'Boissons', 'Produits frais', 'Hygiène'];

const EMPTY_FORM = {
  name: '', description: '', category: CATEGORIES[0], price: '', stock: '',
};

const PAGE_SIZE = 10;

function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function AvailabilityBadge({ availability }) {
  const toneMap = { Disponible: 'green', 'Stock faible': 'orange', Rupture: 'red' };
  return <span className={`prod-four-badge-pill prod-four-badge-pill-${toneMap[availability] || 'green'}`}>{availability}</span>;
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

          <div className="prod-four-form-row">
            <label>Stock</label>
            <input type="number" min="0" value={form.stock} onChange={update('stock')} placeholder="0" required />
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

  // State pour stocker les informations de l'utilisateur connecté
  const [user, setUser] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Chargement du profil utilisateur au montage du composant
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        const response = await fetch('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Impossible de récupérer le profil');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
      }
    };

    loadUser();
  }, []);

  const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' },
    { icon: Package, label: 'Produits', to: '/produits-fournisseur', active: true },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur' },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' },
    { icon: Bell, label: 'Notifications', to: '/notifications-fournisseur' },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-fournisseur' },
    { icon: User, label: 'Profil & Paramètres', to: '/profil-fournisseur' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosClient.get('/supplier/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const stats = useMemo(() => {
    const total = products.length;
    const faible = products.filter((p) => p.availability === 'Stock faible').length;
    const rupture = products.filter((p) => p.availability === 'Rupture').length;
    const categories = new Set(products.map((p) => p.category)).size;
    return [
      { key: 'total', icon: Package, tone: 'blue', label: 'Produits', value: String(total) },
      { key: 'faible', icon: AlertTriangle, tone: 'orange', label: 'Stock faible', value: String(faible) },
      { key: 'rupture', icon: XCircle, tone: 'purple', label: 'Rupture', value: String(rupture) },
      { key: 'categories', icon: Layers, tone: 'teal', label: 'Catégories', value: String(categories) },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'all'
        || (statusFilter === 'available' && p.availability === 'Disponible')
        || (statusFilter === 'low' && p.availability === 'Stock faible')
        || (statusFilter === 'out' && p.availability === 'Rupture');
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetFiltersPage = () => setPage(1);

  const handleAddProduct = async (form) => {
    try {
      const res = await axiosClient.post('/supplier/products', {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
      });
      setProducts((prev) => [res.data, ...prev]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProduct = async (form) => {
    try {
      const res = await axiosClient.put(`/supplier/products/${editingProduct.id}`, {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
      });
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? res.data : p)));
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosClient.delete(`/supplier/products/${deletingProduct.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setDeletingProduct(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Helper pour générer les initiales si l'utilisateur est chargé
  const getInitials = () => {
    if (!user) return 'MB'; // Fallback par défaut
    const prenom = user.prenom || user.firstName || '';
    const nom = user.nom || user.lastName || '';
    const firstLetter = prenom.charAt(0).toUpperCase();
    const lastLetter = nom.charAt(0).toUpperCase();
    return `${firstLetter}${lastLetter}` || 'U';
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
            
            <button type="button" className="prod-four-icon-button" onClick={() => navigate('/notifications-fournisseur')}>
              <Bell size={18} />
              <span className="prod-four-badge">3</span>
            </button>
            <div className="prod-four-user-chip">
              {/* Avatar avec initiales dynamiques */}
              <div className="prod-four-user-avatar">{getInitials()}</div>
              <div className="prod-four-user-info">
                {/* Affichage dynamique Nom Prénom */}
                <span className="prod-four-user-name">
                  {user
                    ? `${user.prenom || user.firstName || ''} ${user.nom || user.lastName || ''}`.trim()
                    : 'Fournisseur'}
                </span>
                <span className="prod-four-user-role">Fournisseur</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="prod-four-stats-row">
          {stats.map((s) => {
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
                  <th>Référence</th>
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
                {loading && (
                  <tr>
                    <td colSpan={8} className="prod-four-empty-row">Chargement des produits...</td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={8} className="prod-four-empty-row">{error}</td>
                  </tr>
                )}

                {!loading && !error && pageProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="prod-four-updated">{p.sku}</td>
                    <td>
                      <span className="prod-four-product-name">{p.name}</span>
                    </td>
                    <td>
                      <span className="prod-four-category-pill">{p.category}</span>
                    </td>
                    <td className="prod-four-price">{p.price.toLocaleString('fr-FR')} MAD</td>
                    <td className="prod-four-stock">{p.stock}</td>
                    <td><AvailabilityBadge availability={p.availability} /></td>
                    <td className="prod-four-updated">{formatDate(p.updatedAt)}</td>
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

                {!loading && !error && pageProducts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="prod-four-empty-row">
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