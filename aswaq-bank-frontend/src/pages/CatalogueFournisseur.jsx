import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, CreditCard, Truck, Layers, User, Settings,
  HelpCircle, LogOut, Search, Bell, ChevronDown, Building2, AlertTriangle,
  EyeOff, Plus, X, UploadCloud, History, Bot,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './CatalogueFournisseur.css';

const CATEGORIES = ['Épicerie', 'Boissons', 'Produits frais', 'Hygiène', 'Entretien'];
const CATEGORY_FILTERS = ['Toutes les catégories', ...CATEGORIES];
const AVAILABILITY_FILTERS = ['Tous', 'Disponible', 'Stock faible', 'Rupture'];
const PAGE_SIZE = 12;

const EMPTY_FORM = {
  nom: '', description: '', categorie: 'Épicerie', prix: '', stock: '',
  sku: '', poids: '', unite: 'kg', actif: true,
};

const INITIAL_PRODUCTS = [
  { id: 1, nom: "Huile d'olive 1L", categorie: 'Épicerie', prix: 65, stock: 42, sku: 'SKU-OLI-001', unite: 'L', poids: '1', actif: true, maj: '25 Juil 2026', cree: '02 Jan 2026', description: "Huile d'olive extra vierge, pressée à froid, conditionnée en bouteille d'1 litre." },
  { id: 2, nom: 'Café moulu 250g', categorie: 'Épicerie', prix: 38, stock: 8, sku: 'SKU-CAF-002', unite: 'g', poids: '250', actif: true, maj: '24 Juil 2026', cree: '05 Jan 2026', description: 'Café moulu torréfié artisanalement, arôme intense, sachet de 250g.' },
  { id: 3, nom: 'Thé vert 100g', categorie: 'Boissons', prix: 22, stock: 30, sku: 'SKU-THE-003', unite: 'g', poids: '100', actif: true, maj: '23 Juil 2026', cree: '10 Jan 2026', description: 'Thé vert en vrac, mélange traditionnel, boîte de 100g.' },
  { id: 4, nom: 'Sucre blanc 1kg', categorie: 'Épicerie', prix: 12, stock: 0, sku: 'SKU-SUC-004', unite: 'kg', poids: '1', actif: true, maj: '22 Juil 2026', cree: '12 Jan 2026', description: 'Sucre blanc cristallisé, sachet d\u20191 kg.' },
  { id: 5, nom: 'Farine 1kg', categorie: 'Épicerie', prix: 9, stock: 55, sku: 'SKU-FAR-005', unite: 'kg', poids: '1', actif: true, maj: '21 Juil 2026', cree: '15 Jan 2026', description: 'Farine de blé tendre type 55, idéale pour la pâtisserie.' },
  { id: 6, nom: 'Riz basmati 1kg', categorie: 'Épicerie', prix: 24, stock: 60, sku: 'SKU-RIZ-006', unite: 'kg', poids: '1', actif: true, maj: '20 Juil 2026', cree: '18 Jan 2026', description: 'Riz basmati long grain, parfumé, sachet d\u20191 kg.' },
  { id: 7, nom: 'Eau minérale 1.5L', categorie: 'Boissons', prix: 6, stock: 120, sku: 'SKU-EAU-007', unite: 'L', poids: '1.5', actif: true, maj: '19 Juil 2026', cree: '20 Jan 2026', description: 'Eau minérale naturelle, bouteille d\u20191,5 litre.' },
  { id: 8, nom: "Jus d'orange 1L", categorie: 'Boissons', prix: 18, stock: 9, sku: 'SKU-JUS-008', unite: 'L', poids: '1', actif: true, maj: '18 Juil 2026', cree: '22 Jan 2026', description: 'Jus d\u2019orange 100% pur jus, sans sucre ajouté.' },
  { id: 9, nom: 'Lait entier 1L', categorie: 'Produits frais', prix: 8, stock: 75, sku: 'SKU-LAI-009', unite: 'L', poids: '1', actif: true, maj: '17 Juil 2026', cree: '25 Jan 2026', description: 'Lait entier pasteurisé, brique d\u20191 litre.' },
  { id: 10, nom: 'Savon liquide 500ml', categorie: 'Hygiène', prix: 28, stock: 5, sku: 'SKU-SAV-010', unite: 'ml', poids: '500', actif: true, maj: '16 Juil 2026', cree: '28 Jan 2026', description: 'Savon liquide pour les mains, parfum doux, flacon pompe 500ml.' },
  { id: 11, nom: 'Shampooing 400ml', categorie: 'Hygiène', prix: 34, stock: 18, sku: 'SKU-SHA-011', unite: 'ml', poids: '400', actif: false, maj: '15 Juil 2026', cree: '30 Jan 2026', description: 'Shampooing doux pour usage quotidien, flacon 400ml.' },
  { id: 12, nom: 'Détergent 1L', categorie: 'Entretien', prix: 19, stock: 3, sku: 'SKU-DET-012', unite: 'L', poids: '1', actif: true, maj: '14 Juil 2026', cree: '02 Fév 2026', description: 'Détergent liquide multi-surfaces, bidon d\u20191 litre.' },
];

const HISTORY_TEMPLATE = [
  { action: 'Produit créé', date: 'Date de création' },
  { action: 'Prix mis à jour', date: 'Il y a 3 semaines' },
  { action: 'Stock réapprovisionné', date: 'Il y a 8 jours' },
  { action: 'Dernière modification', date: 'Date de mise à jour' },
];

function getStatus(product) {
  if (!product.actif) return { label: 'Désactivé', tone: 'gray' };
  if (product.stock === 0) return { label: 'Rupture', tone: 'red' };
  if (product.stock <= 10) return { label: 'Stock faible', tone: 'orange' };
  return { label: 'Disponible', tone: 'green' };
}

function ProductForm({ form, setForm }) {
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="catalog-four-form-grid">
      <div className="catalog-four-form-field catalog-four-form-field-full">
        <label className="catalog-four-form-label">Nom du produit</label>
        <input className="catalog-four-form-input" value={form.nom} onChange={update('nom')} placeholder="Ex. Huile d'olive 1L" />
      </div>

      <div className="catalog-four-form-field catalog-four-form-field-full">
        <label className="catalog-four-form-label">Description</label>
        <textarea className="catalog-four-form-textarea" value={form.description} onChange={update('description')} placeholder="Décrivez le produit..." />
      </div>

      <div className="catalog-four-form-field">
        <label className="catalog-four-form-label">Catégorie</label>
        <select className="catalog-four-form-select" value={form.categorie} onChange={update('categorie')}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="catalog-four-form-field">
        <label className="catalog-four-form-label">Prix (MAD)</label>
        <input className="catalog-four-form-input" type="number" value={form.prix} onChange={update('prix')} placeholder="0.00" />
      </div>

      <div className="catalog-four-form-field">
        <label className="catalog-four-form-label">Quantité en stock</label>
        <input className="catalog-four-form-input" type="number" value={form.stock} onChange={update('stock')} placeholder="0" />
      </div>

      <div className="catalog-four-form-field">
        <label className="catalog-four-form-label">SKU</label>
        <input className="catalog-four-form-input" value={form.sku} onChange={update('sku')} placeholder="SKU-XXX-000" />
      </div>

      <div className="catalog-four-form-field">
        <label className="catalog-four-form-label">Poids</label>
        <input className="catalog-four-form-input" value={form.poids} onChange={update('poids')} placeholder="1" />
      </div>

      <div className="catalog-four-form-field">
        <label className="catalog-four-form-label">Unité</label>
        <select className="catalog-four-form-select" value={form.unite} onChange={update('unite')}>
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="L">L</option>
          <option value="ml">ml</option>
          <option value="unité">unité</option>
        </select>
      </div>

      <div className="catalog-four-form-field">
        <label className="catalog-four-form-label">Statut</label>
        <select
          className="catalog-four-form-select"
          value={form.actif ? 'actif' : 'inactif'}
          onChange={(e) => setForm({ ...form, actif: e.target.value === 'actif' })}
        >
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>

      <div className="catalog-four-form-field catalog-four-form-field-full">
        <label className="catalog-four-form-label">Image</label>
        <div className="catalog-four-form-upload">
          <UploadCloud size={22} />
          Glissez une image ici ou cliquez pour parcourir (simulation)
        </div>
      </div>
    </div>
  );
}

export default function CatalogueFournisseur() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Toutes les catégories');
  const [availabilityFilter, setAvailabilityFilter] = useState('Tous');
  const [page, setPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' },
    { icon: Package, label: 'Produits', to: '/produits-fournisseur' },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur' },
    { icon: CreditCard, label: 'Paiements', to: '/paiements-fournisseur' },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' },
    { icon: Layers, label: 'Catalogue', to: '/catalogue-fournisseur' , active: true},
   { icon: Bell, label: 'Notifications', to: '/notifications-fournisseur' },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-fournisseur' },
    { icon: User, label: 'Profil & Paramètres', to: '/profil-fournisseur' },

  ];

  const stats = useMemo(() => {
    const publies = products.filter((p) => p.actif).length;
    const categories = new Set(products.map((p) => p.categorie)).size;
    const stockFaible = products.filter((p) => p.actif && p.stock > 0 && p.stock <= 10).length;
    const desactives = products.filter((p) => !p.actif).length;
    return { publies, categories, stockFaible, desactives };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch = q === '' || p.nom.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === 'Toutes les catégories' || p.categorie === categoryFilter;
      const status = getStatus(p).label;
      const matchesAvailability = availabilityFilter === 'Tous' || status === availabilityFilter;
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, search, categoryFilter, availabilityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setAddOpen(true);
  };

  const openEdit = (product) => {
    setForm({
      nom: product.nom, description: product.description, categorie: product.categorie,
      prix: product.prix, stock: product.stock, sku: product.sku, poids: product.poids,
      unite: product.unite, actif: product.actif,
    });
    setEditProduct(product);
  };

  const handleAddSubmit = () => {
    const newProduct = {
      id: Date.now(),
      nom: form.nom || 'Nouveau produit',
      categorie: form.categorie,
      prix: Number(form.prix) || 0,
      stock: Number(form.stock) || 0,
      sku: form.sku || `SKU-NEW-${products.length + 1}`,
      poids: form.poids,
      unite: form.unite,
      actif: form.actif,
      maj: "Aujourd'hui",
      cree: "Aujourd'hui",
      description: form.description,
    };
    setProducts((prev) => [newProduct, ...prev]);
    setAddOpen(false);
  };

  const handleEditSubmit = () => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editProduct.id
          ? {
              ...p,
              nom: form.nom,
              description: form.description,
              categorie: form.categorie,
              prix: Number(form.prix) || 0,
              stock: Number(form.stock) || 0,
              sku: form.sku,
              poids: form.poids,
              unite: form.unite,
              actif: form.actif,
              maj: "Aujourd'hui",
            }
          : p
      )
    );
    setEditProduct(null);
  };

  const handleDeleteConfirm = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
    setDeleteProduct(null);
  };

  const toggleActive = (id) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, actif: !p.actif, maj: "Aujourd'hui" } : p)));
  };

  return (
    <div className="catalog-four-layout">
      {/* Sidebar */}
      <aside className="catalog-four-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6"  logo-white/>
        </div>

        <p className="catalog-four-sidebar-section">
          <Building2 size={13} />
          FOURNISSEUR
        </p>

        <nav className="catalog-four-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to || '#'}
                state={location.state}
                className={`catalog-four-nav-item ${item.active ? 'catalog-four-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/" className="catalog-four-logout">
          <LogOut size={18} />
          Se déconnecter
        </Link>
      </aside>

      {/* Main content */}
      <main className="catalog-four-main">
        <header className="catalog-four-topbar">
          <div>
            <h1 className="catalog-four-greeting">Catalogue des produits</h1>
            <p className="catalog-four-greeting-sub">Gérez les produits proposés aux commerçants.</p>
          </div>

          <div className="catalog-four-topbar-actions">
            <div className="catalog-four-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
            <button
              type="button"
              className="catalog-four-icon-button"
              onClick={() => navigate('/notifications-fournisseur')}
            >
              <Bell size={18} />
              <span className="catalog-four-badge">3</span>
            </button>
            <div className="catalog-four-user-chip">
              <div className="catalog-four-user-avatar">MB</div>
              <div className="catalog-four-user-info">
                <span className="catalog-four-user-name">Marwa Boutabi</span>
                <span className="catalog-four-user-role">Fournisseur</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Stat cards */}
        <section className="catalog-four-stats-row">
          <div className="catalog-four-stat-card">
            <div className="catalog-four-stat-label">Produits publiés</div>
            <p className="catalog-four-stat-value">{stats.publies}</p>
          </div>
          <div className="catalog-four-stat-card">
            <div className="catalog-four-stat-label">Catégories</div>
            <p className="catalog-four-stat-value">{stats.categories}</p>
          </div>
          <div className="catalog-four-stat-card">
            <div className="catalog-four-stat-label">Stock faible</div>
            <p className="catalog-four-stat-value">{stats.stockFaible}</p>
          </div>
          <div className="catalog-four-stat-card">
            <div className="catalog-four-stat-label">Produits désactivés</div>
            <p className="catalog-four-stat-value">{stats.desactives}</p>
          </div>
        </section>

        {/* Action bar */}
        <section className="catalog-four-action-bar">
          <div className="catalog-four-action-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <select
            className="catalog-four-select"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          >
            {CATEGORY_FILTERS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            className="catalog-four-select"
            value={availabilityFilter}
            onChange={(e) => { setAvailabilityFilter(e.target.value); setPage(1); }}
          >
            {AVAILABILITY_FILTERS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>

          <button type="button" className="catalog-four-btn catalog-four-btn-solid" onClick={openAdd}>
            <Plus size={15} />
            Ajouter un produit
          </button>
        </section>

        {/* Product grid - MINIMALISTE */}
        <section className="catalog-four-panel">
          <div className="catalog-four-panel-header">
            <h3>Produits ({filteredProducts.length})</h3>
          </div>

          <div className="catalog-four-grid">
            {pageProducts.map((p) => {
              const status = getStatus(p);
              
              return (
                <div className={`catalog-four-card ${!p.actif ? 'catalog-four-card-disabled' : ''}`} key={p.id}>
                  <div className="catalog-four-card-top">
                    <div className="catalog-four-card-info">
                      <span className="catalog-four-card-category">{p.categorie}</span>
                      <h4 className="catalog-four-card-name">{p.nom}</h4>
                    </div>
                    <span className={`catalog-four-status catalog-four-status-${status.tone}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="catalog-four-card-details">
                    <div className="catalog-four-card-detail">
                      <span className="catalog-four-detail-label">Prix</span>
                      <span className="catalog-four-detail-value">{p.prix.toLocaleString('fr-FR')} MAD</span>
                    </div>
                    <div className="catalog-four-card-detail">
                      <span className="catalog-four-detail-label">Stock</span>
                      <span className="catalog-four-detail-value">{p.stock} {p.unite}</span>
                    </div>
                    <div className="catalog-four-card-detail">
                      <span className="catalog-four-detail-label">SKU</span>
                      <span className="catalog-four-detail-value catalog-four-sku">{p.sku}</span>
                    </div>
                  </div>

                  <div className="catalog-four-card-actions">
                    <button type="button" onClick={() => setViewProduct(p)}>Voir</button>
                    <button type="button" onClick={() => openEdit(p)}>Modifier</button>
                    <button type="button" onClick={() => toggleActive(p.id)}>
                      {p.actif ? 'Désactiver' : 'Activer'}
                    </button>
                    <button type="button" className="catalog-four-action-danger" onClick={() => setDeleteProduct(p)}>
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}

            {pageProducts.length === 0 && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9ca3af', padding: '2rem 0' }}>
                Aucun produit ne correspond à votre recherche.
              </p>
            )}
          </div>

          <div className="catalog-four-pagination">
            <span className="catalog-four-pagination-info">
              Page {currentPage} sur {totalPages} · {filteredProducts.length} produit(s)
            </span>
            <div className="catalog-four-pagination-controls">
              <button
                type="button"
                className="catalog-four-page-btn"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`catalog-four-page-btn ${currentPage === n ? 'catalog-four-page-btn-active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className="catalog-four-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Add product modal */}
      {addOpen && (
        <div className="catalog-four-modal-overlay" onClick={() => setAddOpen(false)}>
          <div className="catalog-four-modal" onClick={(e) => e.stopPropagation()}>
            <div className="catalog-four-modal-header">
              <h3>Ajouter un produit</h3>
              <button type="button" className="catalog-four-modal-close" onClick={() => setAddOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="catalog-four-modal-body">
              <ProductForm form={form} setForm={setForm} />
            </div>
            <div className="catalog-four-modal-footer">
              <button type="button" className="catalog-four-btn catalog-four-btn-outline" onClick={() => setAddOpen(false)}>
                Annuler
              </button>
              <button type="button" className="catalog-four-btn catalog-four-btn-solid" onClick={handleAddSubmit}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit product modal */}
      {editProduct && (
        <div className="catalog-four-modal-overlay" onClick={() => setEditProduct(null)}>
          <div className="catalog-four-modal" onClick={(e) => e.stopPropagation()}>
            <div className="catalog-four-modal-header">
              <h3>Modifier {editProduct.nom}</h3>
              <button type="button" className="catalog-four-modal-close" onClick={() => setEditProduct(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="catalog-four-modal-body">
              <ProductForm form={form} setForm={setForm} />
            </div>
            <div className="catalog-four-modal-footer">
              <button type="button" className="catalog-four-btn catalog-four-btn-outline" onClick={() => setEditProduct(null)}>
                Annuler
              </button>
              <button type="button" className="catalog-four-btn catalog-four-btn-solid" onClick={handleEditSubmit}>
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteProduct && (
        <div className="catalog-four-modal-overlay" onClick={() => setDeleteProduct(null)}>
          <div className="catalog-four-modal catalog-four-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="catalog-four-modal-body" style={{ textAlign: 'center', paddingTop: '2rem' }}>
              <h3 style={{ margin: '0 0 0.4rem', color: 'var(--color-navy, #0b1f4b)' }}>Supprimer ce produit ?</h3>
              <p className="catalog-four-confirm-text">Cette action est irréversible.</p>
            </div>
            <div className="catalog-four-modal-footer" style={{ justifyContent: 'center' }}>
              <button type="button" className="catalog-four-btn catalog-four-btn-outline" onClick={() => setDeleteProduct(null)}>
                Annuler
              </button>
              <button type="button" className="catalog-four-btn catalog-four-btn-danger" onClick={handleDeleteConfirm}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View detail modal */}
      {viewProduct && (
        <div className="catalog-four-modal-overlay" onClick={() => setViewProduct(null)}>
          <div className="catalog-four-modal" onClick={(e) => e.stopPropagation()}>
            <div className="catalog-four-modal-header">
              <h3>{viewProduct.nom}</h3>
              <button type="button" className="catalog-four-modal-close" onClick={() => setViewProduct(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="catalog-four-modal-body">
              <p className="catalog-four-detail-desc">{viewProduct.description}</p>

              <div className="catalog-four-detail-grid">
                <div className="catalog-four-detail-field">
                  <span className="catalog-four-detail-field-label">Prix</span>
                  <span className="catalog-four-detail-field-value">{viewProduct.prix.toLocaleString('fr-FR')} MAD</span>
                </div>
                <div className="catalog-four-detail-field">
                  <span className="catalog-four-detail-field-label">Catégorie</span>
                  <span className="catalog-four-detail-field-value">{viewProduct.categorie}</span>
                </div>
                <div className="catalog-four-detail-field">
                  <span className="catalog-four-detail-field-label">Stock</span>
                  <span className="catalog-four-detail-field-value">{viewProduct.stock} {viewProduct.unite}</span>
                </div>
                <div className="catalog-four-detail-field">
                  <span className="catalog-four-detail-field-label">SKU</span>
                  <span className="catalog-four-detail-field-value">{viewProduct.sku}</span>
                </div>
                <div className="catalog-four-detail-field">
                  <span className="catalog-four-detail-field-label">Date de création</span>
                  <span className="catalog-four-detail-field-value">{viewProduct.cree}</span>
                </div>
                <div className="catalog-four-detail-field">
                  <span className="catalog-four-detail-field-label">Dernière modification</span>
                  <span className="catalog-four-detail-field-value">{viewProduct.maj}</span>
                </div>
                <div className="catalog-four-detail-field">
                  <span className="catalog-four-detail-field-label">Statut</span>
                  <span className={`catalog-four-status catalog-four-status-${getStatus(viewProduct).tone}`}>
                    {getStatus(viewProduct).label}
                  </span>
                </div>
              </div>

              <div>
                <p className="catalog-four-modal-section-title">Historique des mises à jour</p>
                <ul className="catalog-four-history-list">
                  {HISTORY_TEMPLATE.map((h) => (
                    <li className="catalog-four-history-row" key={h.action}>
                      <span>{h.action}</span>
                      <span className="catalog-four-history-date">
                        {h.date === 'Date de création' ? viewProduct.cree : h.date === 'Date de mise à jour' ? viewProduct.maj : h.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="catalog-four-modal-footer">
              <button type="button" className="catalog-four-btn catalog-four-btn-outline" onClick={() => setViewProduct(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}