import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, Boxes, ArrowLeftRight, Users, Star, Bot, LogOut,
  Bell, ChevronDown, User,
  Search, Plus, Trash2,
  ShoppingCart, ClipboardList,
  CheckCircle2, X, Phone,
  Check, Plus as PlusIcon, Minus, Send,
  AlertCircle
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import axiosClient from '../services/api';
import './FournisseursCom.css';

const NAV_ITEMS = [
  { icon: Home, label: 'Accueil', to: '/acceuil-com' },
  { icon: Package, label: 'Produits', to: '/produits' },
  { icon: Boxes, label: 'Stock', to: '/stock' },
  { icon: ArrowLeftRight, label: 'Paiements & Transactions', to: '/transactions-commerce' },
  { icon: Users, label: 'Fournisseurs', to: '/fournisseurs', active: true },
  { icon: Star, label: 'Fidélité & Tickets', to: '/fidelite-commerce' },
  { icon: Bell, label: 'Notifications', to: '/notifications-com' },
  { icon: Bot, label: 'Assistant IA', to: '/assistant-commerce' },
  { icon: User, label: 'Profil & Paramètres', to: '/parametres-commerce' },
];

const STATUS_LABELS = {
  EN_ATTENTE: 'En attente',
  EN_PREPARATION: 'En préparation',
  EXPEDIEE: 'Expédiée',
  LIVREE: 'Livrée',
  ANNULEE: 'Annulée',
};

const COMMANDE_STATUS_STYLES = {
  EN_ATTENTE: { bg: '#ffedd5', color: '#ea580c' },
  EN_PREPARATION: { bg: '#dbeafe', color: '#1d4fd8' },
  EXPEDIEE: { bg: '#ede9fe', color: '#7c3aed' },
  LIVREE: { bg: '#dcfce7', color: '#16a34a' },
  ANNULEE: { bg: '#f1f5f9', color: '#64748b' },
};

const CATEGORIES = ['Distribution', 'Alimentaire', 'Fruits & Légumes', 'Boissons', 'Équipements', 'Textile', 'Autre'];

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((w) => w.charAt(0).toUpperCase()).slice(0, 2).join('');
};

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR');
}

export default function FournisseursCom() {
  const location = useLocation();
  const navigate = useNavigate();

  // Fournisseurs inscrits (comptes réels, ont un catalogue réel)
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  // Fournisseurs manuels (simple fiche contact, pas de compte ni catalogue)
  const [manualSuppliers, setManualSuppliers] = useState([]);
  const [loadingManualSuppliers, setLoadingManualSuppliers] = useState(true);

  const [commandes, setCommandes] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    entreprise: '', categorie: '', ville: '', telephone: '', email: '',
  });

  const [orderData, setOrderData] = useState({
    fournisseurId: '', dateLivraison: '', notes: '', produits: [],
  });

  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('Toutes');

  const fetchSuppliers = async () => {
    try {
      setLoadingSuppliers(true);
      const res = await axiosClient.get('/merchant/suppliers');
      setFournisseurs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const fetchManualSuppliers = async () => {
    try {
      setLoadingManualSuppliers(true);
      const res = await axiosClient.get('/merchant/manual-suppliers');
      setManualSuppliers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingManualSuppliers(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await axiosClient.get('/merchant/orders');
      setCommandes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchManualSuppliers();
    fetchOrders();
  }, []);

  // Liste fusionnée pour l'affichage du tableau (chaque ligne garde son origine)
  const allSuppliers = useMemo(() => [
    ...fournisseurs.map((f) => ({ ...f, kind: 'inscrit' })),
    ...manualSuppliers.map((f) => ({ ...f, kind: 'manuel' })),
  ], [fournisseurs, manualSuppliers]);

  const filteredFournisseurs = useMemo(() => {
    return allSuppliers.filter((f) =>
      !search
      || (f.companyName || '').toLowerCase().includes(search.toLowerCase())
      || (f.email || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allSuppliers]);

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Voulez-vous vous déconnecter ?')) navigate('/');
  };

  const scrollToCommandes = () => {
    const element = document.getElementById('section-commandes');
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ---- Ajout d'un fournisseur manuel ----

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetFormData = () => setFormData({ entreprise: '', categorie: '', ville: '', telephone: '', email: '' });

  const handleSave = async () => {
    if (!formData.entreprise || !formData.telephone) return;
    try {
      const res = await axiosClient.post('/merchant/manual-suppliers', {
        companyName: formData.entreprise,
        category: formData.categorie,
        ville: formData.ville,
        telephone: formData.telephone,
        email: formData.email,
      });
      setManualSuppliers((prev) => [res.data, ...prev]);
      setToastMessage(`"${formData.entreprise}" a été enregistré.`);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setShowAddModal(false);
      resetFormData();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du fournisseur.");
    }
  };

  const handleDeleteManual = async (id, name) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer "${name}" ?`)) return;
    try {
      await axiosClient.delete(`/merchant/manual-suppliers/${id}`);
      setManualSuppliers((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression.');
    }
  };

  // ---- Commande (fournisseurs inscrits uniquement) ----

  const handleSelectSupplier = async (supplierId) => {
    setOrderData((prev) => ({ ...prev, fournisseurId: supplierId, produits: [] }));
    setCatalogSearch('');
    setCatalogCategoryFilter('Toutes');
    setCatalog([]);
    if (!supplierId) return;
    try {
      setLoadingCatalog(true);
      const res = await axiosClient.get(`/merchant/suppliers/${supplierId}/products`);
      setCatalog(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  const addToCart = (product) => {
    setOrderData((prev) => {
      const existing = prev.produits.find((p) => p.id === product.id);
      if (existing) {
        return {
          ...prev,
          produits: prev.produits.map((p) =>
            p.id === product.id ? { ...p, quantite: Math.min(p.quantite + 1, product.stock) } : p
          ),
        };
      }
      return { ...prev, produits: [...prev.produits, { ...product, quantite: 1 }] };
    });
  };

  const removeFromCart = (productId) => {
    setOrderData((prev) => ({ ...prev, produits: prev.produits.filter((p) => p.id !== productId) }));
  };

  const updateQuantity = (productId, delta) => {
    setOrderData((prev) => ({
      ...prev,
      produits: prev.produits.map((p) => {
        if (p.id !== productId) return p;
        const newQty = Math.max(1, Math.min(p.quantite + delta, p.stock));
        return { ...p, quantite: newQty };
      }),
    }));
  };

  const calculateTotal = () => {
    const subtotal = orderData.produits.reduce((sum, prod) => sum + prod.price * prod.quantite, 0);
    const tva = subtotal * 0.2;
    return { subtotal, tva, total: subtotal + tva };
  };

  const handleSendOrder = async () => {
    if (!orderData.fournisseurId || orderData.produits.length === 0) return;
    try {
      const res = await axiosClient.post('/merchant/orders', {
        supplierId: orderData.fournisseurId,
        deliveryDate: orderData.dateLivraison || null,
        notes: orderData.notes,
        items: orderData.produits.map((p) => ({ supplierProductId: p.id, quantity: p.quantite })),
      });
      setCommandes((prev) => [res.data, ...prev]);
      setToastMessage('La commande a été envoyée avec succès.');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setShowOrderModal(false);
      setOrderData({ fournisseurId: '', dateLivraison: '', notes: '', produits: [] });
      setCatalog([]);
      setTimeout(() => scrollToCommandes(), 300);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'envoi de la commande.");
    }
  };

  const selectedFournisseur = fournisseurs.find((f) => f.id === Number(orderData.fournisseurId));

  const filteredCatalog = useMemo(() => {
    return catalog.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchesCategory = catalogCategoryFilter === 'Toutes' || p.category === catalogCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [catalog, catalogSearch, catalogCategoryFilter]);

  const catalogCategories = ['Toutes', ...new Set(catalog.map((p) => p.category))];
  const totals = calculateTotal();

  return (
    <div className="fourn-layout">
      <aside className="fourn-sidebar">
        <div className="fourn-sidebar-logo"><Logo size={100} className="mb-6 logo-white" /></div>
        <nav className="fourn-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.to} state={location.state} className={`fourn-nav-item ${item.active ? 'fourn-nav-item-active' : ''}`}>
                <Icon size={18} />{item.label}
              </Link>
            );
          })}
        </nav>
        <a href="/" onClick={handleLogout} className="fourn-logout">
          <LogOut size={18} /> Déconnexion
        </a>
      </aside>

      <main className="fourn-main">
        <header className="fourn-topbar">
          <div>
            <h1 className="fourn-title">Fournisseurs</h1>
            <p className="fourn-subtitle">Gérez vos fournisseurs et vos commandes en toute simplicité.</p>
          </div>
          <div className="fourn-topbar-actions">
            <button type="button" className="fourn-icon-button" onClick={() => navigate('/notifications-com')}>
              <Bell size={18} /><span className="fourn-badge">3</span>
            </button>
            <div className="fourn-user-chip" onClick={() => navigate('/parametres-commerce')}>
              <div className="fourn-user-avatar">MB</div>
              <div className="fourn-user-info">
                <span className="fourn-user-name">Marwa Boutabi</span>
                <span className="fourn-user-role">Commerçant</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <section className="fourn-stats-row">
          <div className="fourn-stat-card">
            <div className="fourn-stat-icon" style={{ background: '#dbeafe', color: '#1d4fd8' }}><Users size={22} /></div>
            <div className="fourn-stat-body">
              <p className="fourn-stat-label">Nombre de fournisseurs</p>
              <p className="fourn-stat-value">{allSuppliers.length}</p>
            </div>
          </div>
          <div className="fourn-stat-card">
            <div className="fourn-stat-icon" style={{ background: '#ffedd5', color: '#ea580c' }}><ShoppingCart size={22} /></div>
            <div className="fourn-stat-body">
              <p className="fourn-stat-label">Commandes en cours</p>
              <p className="fourn-stat-value">{commandes.filter((c) => c.status !== 'LIVREE' && c.status !== 'ANNULEE').length}</p>
            </div>
          </div>
          <div className="fourn-stat-card">
            <div className="fourn-stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}><CheckCircle2 size={22} /></div>
            <div className="fourn-stat-body">
              <p className="fourn-stat-label">Commandes livrées</p>
              <p className="fourn-stat-value">{commandes.filter((c) => c.status === 'LIVREE').length}</p>
            </div>
          </div>
        </section>

        <div className="fourn-content-grid">
          <section className="fourn-panel fourn-quick-actions">
            <h2 className="fourn-panel-title">Actions rapides</h2>
            <div className="fourn-quick-actions-list">
              <button className="fourn-quick-action" onClick={() => setShowAddModal(true)}><Plus size={18} /> Ajouter un fournisseur</button>
              <button className="fourn-quick-action" onClick={() => setShowOrderModal(true)}><ShoppingCart size={18} /> Passer une commande</button>
              <button className="fourn-quick-action" onClick={scrollToCommandes}><ClipboardList size={18} /> Voir les commandes</button>
            </div>
          </section>

          <section className="fourn-panel">
            <div className="fourn-panel-header">
              <h2 className="fourn-panel-title">Liste des fournisseurs</h2>
              <div className="fourn-panel-actions">
                <div className="fourn-search">
                  <Search size={16} />
                  <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="fourn-table-wrapper">
              <table className="fourn-table">
                <thead>
                  <tr><th>Fournisseur</th><th>Type</th><th>Ville</th><th>Téléphone</th><th>Email</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {(loadingSuppliers || loadingManualSuppliers) && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>Chargement...</td></tr>
                  )}
                  {!loadingSuppliers && !loadingManualSuppliers && filteredFournisseurs.map((f) => (
                    <tr key={`${f.kind}-${f.id}`}>
                      <td>
                        <div className="fourn-supplier-cell">
                          <div className="fourn-avatar" style={{ background: f.kind === 'inscrit' ? '#1d4fd8' : '#94a3b8' }}>{getInitials(f.companyName)}</div>
                          <span className="fourn-supplier-name">{f.companyName}</span>
                        </div>
                      </td>
                      <td>
                        {f.kind === 'inscrit'
                          ? <span className="fourn-status-pill" style={{ background: '#dcfce7', color: '#16a34a' }}>Inscrit</span>
                          : <span className="fourn-status-pill" style={{ background: '#f1f5f9', color: '#64748b' }}>Manuel</span>}
                      </td>
                      <td className="fourn-cell-text">{f.ville || f.city || '—'}</td>
                      <td className="fourn-cell-text">{f.telephone}</td>
                      <td className="fourn-cell-text">{f.email || '—'}</td>
                      <td>
                        {f.kind === 'manuel' ? (
                          <div className="fourn-actions">
                            <button className="fourn-action-btn fourn-action-delete" onClick={() => handleDeleteManual(f.id, f.companyName)}><Trash2 size={14} /></button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!loadingSuppliers && !loadingManualSuppliers && filteredFournisseurs.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>Aucun fournisseur trouvé.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="fourn-panel" id="section-commandes">
            <div className="fourn-panel-header">
              <h2 className="fourn-panel-title">Commandes récentes</h2>
            </div>
            <div className="fourn-table-wrapper">
              <table className="fourn-table">
                <thead>
                  <tr><th>N° Commande</th><th>Fournisseur</th><th>Date</th><th>Montant</th><th>Statut</th><th>Livraison prévue</th></tr>
                </thead>
                <tbody>
                  {loadingOrders && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>Chargement...</td></tr>
                  )}
                  {!loadingOrders && commandes.map((cmd) => {
                    const style = COMMANDE_STATUS_STYLES[cmd.status] || { bg: '#f1f5f9', color: '#64748b' };
                    return (
                      <tr key={cmd.id}>
                        <td className="fourn-cell-text fourn-command-id">{cmd.reference}</td>
                        <td className="fourn-cell-text">{cmd.supplierName}</td>
                        <td className="fourn-cell-text">{formatDateTime(cmd.orderDate)}</td>
                        <td className="fourn-cell-text fourn-amount">{cmd.totalAmount?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD</td>
                        <td><span className="fourn-command-status" style={{ background: style.bg, color: style.color }}>{STATUS_LABELS[cmd.status] || cmd.status}</span></td>
                        <td className="fourn-cell-text">{cmd.deliveryDate || 'À définir'}</td>
                      </tr>
                    );
                  })}
                  {!loadingOrders && commandes.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '1rem' }}>Aucune commande pour l'instant.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {showSuccessToast && (
        <div className="fourn-toast">
          <CheckCircle2 size={20} />
          <div>
            <strong>Succès !</strong>
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fourn-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="fourn-modal">
            <div className="fourn-modal-header">
              <div>
                <h2 className="fourn-modal-title">Ajouter un fournisseur</h2>
                <p className="fourn-modal-subtitle">Fiche contact simple — sans compte ni catalogue en ligne. Les commandes ne peuvent pas être passées via la plateforme pour ce fournisseur.</p>
              </div>
              <button className="fourn-modal-close" onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            <div className="fourn-modal-body">
              <div className="fourn-form-group">
                <label className="fourn-form-label">Nom de l'entreprise *</label>
                <input type="text" name="entreprise" value={formData.entreprise} onChange={handleInputChange} className="fourn-input" />
              </div>
              <div className="fourn-form-group">
                <label className="fourn-form-label">Téléphone *</label>
                <input type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange} className="fourn-input" />
              </div>
              <div className="fourn-form-group">
                <label className="fourn-form-label">Ville</label>
                <input type="text" name="ville" value={formData.ville} onChange={handleInputChange} className="fourn-input" />
              </div>
              <div className="fourn-form-group">
                <label className="fourn-form-label">Catégorie</label>
                <select name="categorie" value={formData.categorie} onChange={handleInputChange} className="fourn-select">
                  <option value="">Sélectionnez</option>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="fourn-form-group">
                <label className="fourn-form-label">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="fourn-input" />
              </div>
            </div>
            <div className="fourn-modal-footer">
              <button className="fourn-btn-secondary" onClick={() => setShowAddModal(false)}>Annuler</button>
              <button className="fourn-btn-primary" onClick={handleSave} disabled={!formData.entreprise || !formData.telephone}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="fourn-modal-overlay fourn-modal-overlay-large" onClick={(e) => e.target === e.currentTarget && setShowOrderModal(false)}>
          <div className="fourn-modal fourn-modal-xlarge">
            <div className="fourn-modal-header">
              <div>
                <h2 className="fourn-modal-title">Passer une commande</h2>
                <p className="fourn-modal-subtitle">Sélectionnez un fournisseur et parcourez son catalogue réel.</p>
              </div>
              <button className="fourn-modal-close" onClick={() => setShowOrderModal(false)}><X size={20} /></button>
            </div>

            <div className="fourn-modal-body">
              <div className="fourn-modal-section">
                <h3 className="fourn-section-title"><span className="fourn-section-icon fourn-section-icon-blue"><User size={18} /></span> 1. Fournisseur</h3>
                <select className="fourn-select" value={orderData.fournisseurId} onChange={(e) => handleSelectSupplier(e.target.value)}>
                  <option value="">-- Sélectionner un fournisseur --</option>
                  {fournisseurs.map((f) => <option key={f.id} value={f.id}>{f.companyName}</option>)}
                </select>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                  Seuls les fournisseurs inscrits sur la plateforme peuvent recevoir une commande.
                </p>
                {selectedFournisseur && (
                  <div className="fourn-supplier-info-card">
                    <strong>{selectedFournisseur.companyName}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                      <Phone size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {selectedFournisseur.telephone}
                    </div>
                  </div>
                )}
              </div>

              {orderData.fournisseurId && (
                <div className="fourn-modal-section">
                  <h3 className="fourn-section-title"><span className="fourn-section-icon fourn-section-icon-blue"><Package size={18} /></span> 2. Catalogue</h3>
                  {loadingCatalog && <p>Chargement du catalogue...</p>}
                  {!loadingCatalog && catalog.length === 0 && (
                    <div className="fourn-empty-catalog">
                      <AlertCircle size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                      <p>Aucun produit disponible pour ce fournisseur.</p>
                    </div>
                  )}
                  {!loadingCatalog && catalog.length > 0 && (
                    <>
                      <div className="fourn-catalog-filters">
                        <div className="fourn-search" style={{ flex: 2 }}>
                          <Search size={16} />
                          <input type="text" placeholder="Rechercher..." value={catalogSearch} onChange={(e) => setCatalogSearch(e.target.value)} />
                        </div>
                        <select className="fourn-select" value={catalogCategoryFilter} onChange={(e) => setCatalogCategoryFilter(e.target.value)}>
                          {catalogCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="fourn-catalog-grid">
                        {filteredCatalog.map((product) => {
                          const isInCart = orderData.produits.some((p) => p.id === product.id);
                          const cartProduct = orderData.produits.find((p) => p.id === product.id);
                          const outOfStock = product.stock === 0;
                          return (
                            <div key={product.id} className={`fourn-product-card ${isInCart ? 'in-cart' : ''}`}>
                              {isInCart && <div className="fourn-product-badge-top"><Check size={12} /> Dans le panier</div>}
                              <div className="fourn-product-info">
                                <div className="fourn-product-name">{product.name}</div>
                                <div className="fourn-product-meta">
                                  <span className="fourn-product-ref">Réf: {product.sku}</span>
                                  <span className="fourn-product-brand">Stock: {product.stock}</span>
                                </div>
                                <div className="fourn-product-footer">
                                  <div className="fourn-product-price">
                                    <span className="fourn-price-value">{product.price.toFixed(2)}</span>
                                    <span className="fourn-price-unit">MAD</span>
                                  </div>
                                  {outOfStock ? (
                                    <span style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 600 }}>Rupture</span>
                                  ) : isInCart ? (
                                    <div className="fourn-product-qty-control">
                                      <button className="fourn-qty-btn" onClick={() => updateQuantity(product.id, -1)}><Minus size={12} /></button>
                                      <span className="fourn-qty-value">{cartProduct.quantite}</span>
                                      <button className="fourn-qty-btn" onClick={() => updateQuantity(product.id, 1)}><PlusIcon size={12} /></button>
                                    </div>
                                  ) : (
                                    <button className="fourn-add-btn" onClick={() => addToCart(product)}><Plus size={14} /> Ajouter</button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {orderData.produits.length > 0 && (
                <div className="fourn-modal-section fourn-modal-section-full">
                  <h3 className="fourn-section-title"><span className="fourn-section-icon fourn-section-icon-blue"><ShoppingCart size={18} /></span> 3. Récapitulatif</h3>
                  <div className="fourn-cart-table">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>Produit</th>
                          <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>Qté</th>
                          <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>Sous-total</th>
                          <th style={{ padding: '0.75rem', textAlign: 'center' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderData.produits.map((prod) => (
                          <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ fontWeight: '600', color: '#0b1f4b' }}>{prod.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Réf: {prod.sku}</div>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <button className="fourn-qty-btn" onClick={() => updateQuantity(prod.id, -1)}><Minus size={12} /></button>
                                <span style={{ fontWeight: '600', minWidth: '30px' }}>{prod.quantite}</span>
                                <button className="fourn-qty-btn" onClick={() => updateQuantity(prod.id, 1)}><PlusIcon size={12} /></button>
                              </div>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700', color: '#1d4fd8' }}>{(prod.price * prod.quantite).toFixed(2)} MAD</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <button className="fourn-action-btn fourn-action-delete" onClick={() => removeFromCart(prod.id)}><Trash2 size={14} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="fourn-cart-summary">
                    <div className="fourn-summary-row"><span>Total TTC estimé</span><span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1d4fd8' }}>{totals.total.toFixed(2)} MAD</span></div>
                  </div>
                  <div className="fourn-form-group" style={{ marginTop: '1rem' }}>
                    <label className="fourn-form-label">Date de livraison souhaitée</label>
                    <input type="date" className="fourn-input" value={orderData.dateLivraison} onChange={(e) => setOrderData((prev) => ({ ...prev, dateLivraison: e.target.value }))} />
                  </div>
                  <div className="fourn-form-group" style={{ marginTop: '1rem' }}>
                    <label className="fourn-form-label">Notes (optionnel)</label>
                    <textarea className="fourn-textarea" rows={2} value={orderData.notes} onChange={(e) => setOrderData((prev) => ({ ...prev, notes: e.target.value }))} />
                  </div>
                </div>
              )}
            </div>

            <div className="fourn-modal-footer">
              <button className="fourn-btn-secondary" onClick={() => setShowOrderModal(false)}>Annuler</button>
              <button className="fourn-btn-primary" onClick={handleSendOrder} disabled={!orderData.fournisseurId || orderData.produits.length === 0}>
                <Send size={18} /> Envoyer la commande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}