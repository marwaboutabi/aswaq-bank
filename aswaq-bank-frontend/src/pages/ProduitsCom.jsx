import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, Boxes, ArrowLeftRight, Users, Star, Bot, LogOut,
  Search, Bell, ChevronDown, ChevronLeft, ChevronRight,
  Box, Eye, Pencil, Trash2, User, X, Plus,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './ProduitsCom.css';
import api from '../services/api';

const INITIAL_PRODUCTS = [];

const CATEGORIES = [
  'Toutes',
  'Boissons',
  'Épicerie',
  'Produits laitiers',
  'Fruits & Légumes',
  'Viandes & Volailles',
  'Poissons & Fruits de mer',
  'Boulangerie',
  'Pâtisserie',
  'Surgelés',
  'Conserves',
  'Snacks',
  'Confiserie',
  'Hygiène',
  'Beauté & Cosmétiques',
  'Entretien de la maison',
  'Bébé',
  'Animalerie',
  'Maison & Cuisine',
  'Électronique',
  'Papeterie',
  'Jouets',
  'Vêtements',
  'Chaussures',
  'Sport & Loisirs',
  'Bricolage',
  'Jardinage',
  'Automobile',
  'Santé & Parapharmacie',
  'Autre'
];
const CATEGORY_STYLES = {
  Boissons: { bg: '#dbeafe', color: '#1d4fd8' },
  Boulangerie: { bg: '#ede9fe', color: '#7c3aed' },
  Épicerie: { bg: '#e0f2fe', color: '#0284c7' },
  'Produits laitiers': { bg: '#fef3c7', color: '#d97706' },
  'Fruits & Légumes': { bg: '#d1fae5', color: '#059669' },
};

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits', active: true },
  { icon: Boxes, label: 'Stock', to: '/stock' },
  { icon: ArrowLeftRight, label: 'Paiements & Transactions', to: '/transactions-commerce' },
  { icon: Users, label: 'Fournisseurs', to: '/fournisseurs' },
  { icon: Star, label: 'Fidélité & Tickets', to: '/fidelite-commerce' },
  { icon: Bell, label: 'Notifications', to: '/notifications-com' },
 { icon: Bot, label: 'Assistant IA', to: '/assistant-commerce' },
     { icon: User, label: 'Profil & Paramètres', to: '/parametres-commerce' },
];

const PAGE_SIZE = 10;

export default function ProduitsCom() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Toutes');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '', 
    code: '', 
    category: 'Boissons', 
    price: '', 
    description: ''
  });
  useEffect(() => {
  loadProducts();
}, []);


const loadProducts = async () => {
  try {
    const response = await api.get("/products");
    setProducts(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const searchRef = useRef(null);

  const stats = useMemo(() => {
    const total = products.length;
    return [
      { 
        key: 'total', 
        icon: Box, 
        label: 'Total des produits', 
        value: total, 
        sub: 'Tous vos produits', 
      },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
        || p.code.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'Toutes' || p.category === categoryFilter;
      return matchSearch && matchCategory;
    });

    if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'price') list = [...list].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
if (sortBy === 'recent')
    list = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return list;
  }, [products, search, categoryFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => { setCurrentPage(1); }, [search, categoryFilter, sortBy]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
    return;
  }

  try {
    await api.delete(`/products/${id}`);
    await loadProducts();
  } catch (error) {
    console.error(error);
    alert("Impossible de supprimer le produit.");
  }
};

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Boissons',
      price: '',
      description: ''
      
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description || '',
    });
    setShowModal(true);
  };

const handleFormSubmit = async (e) => {
      e.preventDefault();

    if (!formData.name || !formData.price) {
    alert("Veuillez remplir les champs obligatoires");
    return;
}

    try {

    if (editingProduct) {

        await api.put(`/products/${editingProduct.id}`, {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            description: formData.description
        });
        

    } else {

        await api.post("/products", {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            description: formData.description
        });

    }

    await loadProducts();

    

} catch (error) {
    console.error(error);
    alert("Impossible d'enregistrer le produit.");
}

    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', category: 'Boissons', price: '', description: ''});
  };

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Voulez-vous vous déconnecter ?')) {
      navigate('/');
    }
  };

  return (
    <div className="prod-layout">
      <aside className="prod-sidebar">
        <div className="prod-sidebar-logo">
          <Logo size={100} className="mb-6 logo-white" />
        </div>

        <nav className="prod-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                state={location.state}
                className={`prod-nav-item ${item.active ? 'prod-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a href="/" onClick={handleLogout} className="prod-logout">
          <LogOut size={18} />
          Déconnexion
        </a>
      </aside>

      <main className="prod-main">
        <header className="prod-topbar">
          <div>
            <h1 className="prod-title">Produits</h1>
            <p className="prod-subtitle">Gérez votre catalogue de produits.</p>
          </div>

          <div className="prod-topbar-actions">
            <button
  type="button"
  className="prod-icon-button"
  onClick={() => navigate('/notifications-com')}
  aria-label="Notifications"
>
              <Bell size={18} />
              <span className="prod-badge">3</span>
            </button>

            <div
              className="prod-user-chip"
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ position: 'relative' }}
            >
              <div className="prod-user-avatar">MB</div>
              <div className="prod-user-info">
                <span className="prod-user-name">Marwa Boutabi</span>
                <span className="prod-user-role">Commerçant</span>
              </div>
              <ChevronDown size={16} />
              {showUserMenu && (
                <div className="prod-user-menu">
                  <Link to="/parametres-commerce" className="prod-menu-item">
                    Mon profil
                  </Link>
                  <Link to="/" onClick={handleLogout} className="prod-menu-item prod-menu-logout">
                    Déconnexion
                  </Link>
                </div>
              )}
            </div>

            <button className="prod-btn-primary" onClick={openAddModal}>
              <Plus size={18} />
              Ajouter un produit
            </button>
          </div>
        </header>

        <section className="prod-filters-row">
          <div className="prod-search" ref={searchRef}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          <select
            className="prod-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat === 'Toutes' ? 'Toutes les catégories' : cat}</option>
            ))}
          </select>

          <select
            className="prod-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Plus récent</option>
            <option value="name">Nom</option>
            <option value="price">Prix</option>
          </select>
        </section>

        <section className="prod-stats-row">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div className="prod-stat-card" key={s.key}>
                <div className="prod-stat-icon">
                  <Icon size={20} />
                </div>
                <div className="prod-stat-body">
                  <p className="prod-stat-label">{s.label}</p>
                  <p className="prod-stat-value">{s.value}</p>
                  <p className="prod-stat-sub">{s.sub}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="prod-panel">
          <div className="prod-table-wrapper">
            <table className="prod-table">
              <thead>
                <tr>
                  <th>Nom du produit</th>
                  <th>Catégorie</th>
                  <th>Prix de vente</th>
                  <th>Description</th>
                  <th>Date d'ajout</th>
                  <th className="prod-th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="prod-empty-state">
                      <div className="prod-empty-icon">
                        <Box size={40} />
                      </div>
                      <h3>Aucun produit pour le moment</h3>
                      <p>Ajoutez vos produits pour les afficher dans votre catalogue.</p>
                      <button className="prod-btn-primary" onClick={openAddModal}>
                        <Plus size={18} />
                        Ajouter un produit
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((p) => {
                    const catStyle = CATEGORY_STYLES[p.category] || { bg: '#f1f5f9', color: '#475569' };
                    return (
                      <tr key={p.id}>
                        
                        <td>
                          <p className="prod-name">{p.name}</p>
                          <p className="prod-code">Code : {p.code}</p>
                        </td>
                        <td>
                          <span
                            className="prod-category-pill"
                            style={{ background: catStyle.bg, color: catStyle.color }}
                          >
                            {p.category}
                          </span>
                        </td>
                        <td className="prod-price">{p.price} MAD</td>
                        <td className="prod-description">{p.description || '-'}</td>
                        <td className="prod-date">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</td>
                        <td>
                          <div className="prod-actions">
                            <button
                              type="button"
                              className="prod-action-btn prod-action-view"
                              aria-label="Voir"
                              onClick={() => setViewingProduct(p)}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              type="button"
                              className="prod-action-btn prod-action-edit"
                              aria-label="Modifier"
                              onClick={() => openEditModal(p)}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              className="prod-action-btn prod-action-delete"
                              aria-label="Supprimer"
                              onClick={() => handleDelete(p.id)}
                            >
                              <Trash2 size={15} />
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

          {paginatedProducts.length > 0 && (
            <div className="prod-pagination">
              <div className="prod-result-count">
                {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''}
              </div>
              
              <div className="prod-per-page">
                <span>{PAGE_SIZE} par page</span>
                <ChevronDown size={15} />
              </div>

              <div className="prod-page-controls">
                <button
                  type="button"
                  className="prod-page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Page précédente"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`prod-page-btn ${currentPage === n ? 'prod-page-btn-active' : ''}`}
                    onClick={() => setCurrentPage(n)}
                  >
                    {n}
                  </button>
                ))}

                <button
                  type="button"
                  className="prod-page-btn"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Page suivante"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <div
          className="prod-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="prod-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="prod-modal-header">
              <h2 className="prod-modal-title">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="prod-modal-close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="prod-form-grid">
                <div className="prod-form-group">
                  <label className="prod-form-label">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="prod-form-input"
                    required
                  />
                </div>


                <div className="prod-form-group">
                  <label className="prod-form-label">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="prod-form-input"
                  >
                    {CATEGORIES.filter(c => c !== 'Toutes').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="prod-form-group">
                  <label className="prod-form-label">
                    Prix (MAD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="prod-form-input"
                    required
                  />
                </div>

                <div className="prod-form-group prod-form-full">
                  <label className="prod-form-label">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="prod-form-input prod-form-textarea"
                    rows={3}
                  />
                </div>
              </div>

              <div className="prod-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="prod-btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="prod-btn-primary"
                >
                  {editingProduct ? 'Enregistrer les modifications' : 'Ajouter le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingProduct && (
        <div
          className="prod-modal-overlay"
          onClick={() => setViewingProduct(null)}
        >
          <div
            className="prod-modal-content prod-modal-view"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="prod-modal-header">
              <h2 className="prod-modal-title">Détails du produit</h2>
              <button
                onClick={() => setViewingProduct(null)}
                className="prod-modal-close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="prod-view-content">
              
              
              <div className="prod-view-info">
                <h3 className="prod-view-name">{viewingProduct.name}</h3>
                <p className="prod-view-code">{viewingProduct.code}</p>
              </div>

              <div className="prod-view-details">
                <div className="prod-view-item">
                  <span className="prod-view-label">Catégorie</span>
                  <span className="prod-view-value">{viewingProduct.category}</span>
                </div>
                <div className="prod-view-item">
                  <span className="prod-view-label">Prix</span>
                  <span className="prod-view-value">{viewingProduct.price} MAD</span>
                </div>
                <div className="prod-view-item">
                  <span className="prod-view-label">Description</span>
                  <span className="prod-view-value">{viewingProduct.description || '-'}</span>
                </div>
                <div className="prod-view-item">
                  <span className="prod-view-label">Date d'ajout</span>
<span className="prod-view-value">
  {new Date(viewingProduct.createdAt).toLocaleDateString("fr-FR")}
</span>                </div>
              </div>
            </div>

            <button
              onClick={() => setViewingProduct(null)}
              className="prod-btn-primary prod-btn-full"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}