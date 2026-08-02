import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, Boxes, ArrowLeftRight, Users, Star, Bot, LogOut,
  Bell, ChevronDown, ChevronLeft, ChevronRight, User,
  Search, Filter, Plus, Pencil, Trash2,
  ShoppingCart, ClipboardList, Download,
  CheckCircle2, ArrowRight, X, Phone, Mail, MapPin,
  Building2, FileText, Check, Circle, Save,
  Calendar, Trash2 as TrashIcon, Plus as PlusIcon, Minus, Send,
  Tag, AlertCircle
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './FournisseursCom.css';

const AVATAR_COLORS = ['#1d4fd8', '#2563eb', '#3b82f6', '#7c3aed', '#0ea5e9', '#ea580c', '#dc2626'];

const FOURNISSEURS_CATALOGUES = {
  1: [
    { id: 101, ref: 'ATL-HUI-001', nom: "Huile d'olive vierge 1L", categorie: 'Alimentaire', marque: 'Atlas Bio', prixAchat: 35.00, conditionnement: 'Bouteille 1L', stock: 120 },
    { id: 102, ref: 'ATL-RIZ-005', nom: 'Riz basmati premium 5kg', categorie: 'Alimentaire', marque: 'Indus Rice', prixAchat: 95.00, conditionnement: 'Sac 5kg', stock: 45 },
    { id: 103, ref: 'ATL-SUC-003', nom: 'Sucre en morceaux 1kg', categorie: 'Alimentaire', marque: 'Cosumar', prixAchat: 11.00, conditionnement: 'Paquet 1kg', stock: 150 },
    { id: 104, ref: 'ATL-FAR-008', nom: 'Farine de blé 25kg', categorie: 'Alimentaire', marque: 'Minoterie Atlas', prixAchat: 180.00, conditionnement: 'Sac 25kg', stock: 30 },
  ],
  2: [
    { id: 201, ref: 'MF-LAIT-010', nom: 'Lait demi-écrémé 1L', categorie: 'Produits laitiers', marque: 'Centrale', prixAchat: 6.50, conditionnement: 'Brique 1L', stock: 200 },
    { id: 202, ref: 'MF-YAU-011', nom: 'Yaourt nature pack 4', categorie: 'Produits laitiers', marque: 'Centrale', prixAchat: 8.00, conditionnement: 'Pack 4x125g', stock: 150 },
    { id: 203, ref: 'MF-FRO-012', nom: 'Fromage frais 200g', categorie: 'Produits laitiers', marque: 'Jaouda', prixAchat: 12.00, conditionnement: 'Pot 200g', stock: 60 },
  ],
  3: [
    { id: 301, ref: 'FM-TOM-020', nom: 'Tomates fraîches', categorie: 'Fruits & Légumes', marque: 'Ferme locale', prixAchat: 8.00, conditionnement: 'Kg', stock: 100 },
    { id: 302, ref: 'FM-POM-021', nom: 'Pommes Golden', categorie: 'Fruits & Légumes', marque: 'Moyen Atlas', prixAchat: 12.00, conditionnement: 'Kg', stock: 80 },
    { id: 303, ref: 'FM-ORA-022', nom: 'Oranges à jus', categorie: 'Fruits & Légumes', marque: 'Berkane', prixAchat: 7.50, conditionnement: 'Kg', stock: 120 },
  ],
  4: [
    { id: 401, ref: 'CD-EAU-030', nom: 'Eau minérale 1.5L', categorie: 'Boissons', marque: 'Sidi Ali', prixAchat: 4.50, conditionnement: 'Bouteille 1.5L', stock: 500 },
    { id: 402, ref: 'CD-COL-031', nom: 'Cola 33cl', categorie: 'Boissons', marque: 'Coca-Cola', prixAchat: 5.00, conditionnement: 'Canette 33cl', stock: 300 },
    { id: 403, ref: 'CD-JUS-032', nom: "Jus d'orange 1L", categorie: 'Boissons', marque: 'Pulpy', prixAchat: 12.00, conditionnement: 'Brique 1L', stock: 150 },
  ],
  5: [
    { id: 501, ref: 'TP-CAS-040', nom: 'Caisse enregistreuse', categorie: 'Équipements', marque: 'Epson', prixAchat: 2500.00, conditionnement: 'Unité', stock: 10 },
    { id: 502, ref: 'TP-LEC-041', nom: 'Lecteur code-barres', categorie: 'Équipements', marque: 'Zebra', prixAchat: 850.00, conditionnement: 'Unité', stock: 15 },
  ],
};

const INITIAL_FOURNISSEURS = [
  { id: 1, name: 'Atlas Distribution', initials: 'A', color: '#1d4fd8', category: 'Distribution', ville: 'Casablanca', telephone: '+212 6 12 34 56 78', email: 'contact@atlas.ma', status: 'Actif' },
  { id: 2, name: 'Maroc Food', initials: 'MF', color: '#2563eb', category: 'Alimentaire', ville: 'Rabat', telephone: '+212 6 22 33 44 55', email: 'info@marocfood.ma', status: 'Actif' },
  { id: 3, name: 'Fresh Market', initials: 'FM', color: '#3b82f6', category: 'Fruits & Légumes', ville: 'Marrakech', telephone: '+212 6 55 66 77 88', email: 'contact@freshmarket.ma', status: 'Actif' },
  { id: 4, name: 'Casa Drinks', initials: 'CD', color: '#7c3aed', category: 'Boissons', ville: 'Casablanca', telephone: '+212 6 11 22 33 44', email: 'contact@casadrinks.ma', status: 'Actif' },
  { id: 5, name: 'TechPro Solutions', initials: 'TP', color: '#0ea5e9', category: 'Équipements', ville: 'Tanger', telephone: '+212 6 77 88 99 00', email: 'info@techpro.ma', status: 'Inactif' },
];

const INITIAL_COMMANDES = [
  { id: 'CMD-0008', fournisseur: 'Atlas Distribution', date: '22/07/2026', montant: '2 850,00 MAD', status: 'En préparation', livraison: '25/07/2026' },
  { id: 'CMD-0007', fournisseur: 'Maroc Food', date: '21/07/2026', montant: '1 250,00 MAD', status: 'Expédiée', livraison: '23/07/2026' },
  { id: 'CMD-0006', fournisseur: 'Fresh Market', date: '20/07/2026', montant: '980,00 MAD', status: 'Livrée', livraison: '21/07/2026' },
  { id: 'CMD-0005', fournisseur: 'Casa Drinks', date: '19/07/2026', montant: '1 650,00 MAD', status: 'En attente', livraison: '24/07/2026' },
];

const CATEGORY_STYLES = {
  Distribution: { bg: '#dbeafe', color: '#1d4fd8' },
  Alimentaire: { bg: '#ffedd5', color: '#ea580c' },
  'Fruits & Légumes': { bg: '#dcfce7', color: '#16a34a' },
  Boissons: { bg: '#ede9fe', color: '#7c3aed' },
  Équipements: { bg: '#e0f2fe', color: '#0284c7' },
  'Produits laitiers': { bg: '#fef3c7', color: '#ca8a04' },
};

const STATUS_STYLES = {
  Actif: { bg: '#dcfce7', color: '#16a34a' },
  Inactif: { bg: '#f1f5f9', color: '#64748b' },
};

const COMMANDE_STATUS_STYLES = {
  'En préparation': { bg: '#dbeafe', color: '#1d4fd8' },
  'Expédiée': { bg: '#ede9fe', color: '#7c3aed' },
  'Livrée': { bg: '#dcfce7', color: '#16a34a' },
  'En attente': { bg: '#ffedd5', color: '#ea580c' },
};

const CATEGORIES = ['Distribution', 'Alimentaire', 'Fruits & Légumes', 'Boissons', 'Équipements', 'Textile', 'Autre'];
const DELAIS = ['24-48h', '2-3 jours', '1 semaine', '2 semaines', '1 mois', 'Personnalisé'];
const CONDITIONS = ['Paiement à la livraison', 'Paiement à 30 jours', 'Paiement à 60 jours', '50% à la commande', 'Autre'];

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

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('');
};

export default function FournisseursCom() {
  const location = useLocation();
  const navigate = useNavigate();

  const [fournisseurs, setFournisseurs] = useState(INITIAL_FOURNISSEURS);
  const [commandes, setCommandes] = useState(INITIAL_COMMANDES);
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  
  const [formData, setFormData] = useState({
    entreprise: '', contact: '', categorie: '', produits: '',
    telephone: '', email: '', adresse: '', ville: '',
    delai: '', conditions: '', statut: 'Actif', notes: '',
  });

  const [orderData, setOrderData] = useState({
    fournisseur: '', dateCommande: new Date().toISOString().split('T')[0],
    dateLivraison: '', reference: '', conditionsPaiement: '',
    modeLivraison: '', adresseLivraison: 'Magasin principal, Casablanca',
    notes: '', produits: [],
  });

  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('Toutes');
  const [catalogBrandFilter, setCatalogBrandFilter] = useState('Toutes');

  const filteredFournisseurs = useMemo(() => {
    return fournisseurs.filter(f =>
      !search || f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, fournisseurs]);

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Voulez-vous vous déconnecter ?')) navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.entreprise || !formData.telephone || !formData.adresse || !formData.ville) return;
    const newId = Math.max(...fournisseurs.map(f => f.id), 0) + 1;
    const newFournisseur = {
      id: newId, name: formData.entreprise, initials: getInitials(formData.entreprise),
      color: AVATAR_COLORS[newId % AVATAR_COLORS.length], category: formData.categorie || 'Autre',
      ville: formData.ville, telephone: formData.telephone, email: formData.email || '-', status: formData.statut,
    };
    setFournisseurs(prev => [newFournisseur, ...prev]);
    setNewSupplierName(formData.entreprise);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    setShowAddModal(false);
    setFormData({ entreprise: '', contact: '', categorie: '', produits: '', telephone: '', email: '', adresse: '', ville: '', delai: '', conditions: '', statut: 'Actif', notes: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    const fournisseur = fournisseurs.find(f => f.id === id);
    if (window.confirm(`Voulez-vous vraiment supprimer "${fournisseur.name}" ?`)) {
      setFournisseurs(prev => prev.filter(f => f.id !== id));
    }
  };

  const scrollToCommandes = () => {
    const element = document.getElementById('section-commandes');
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectSupplier = (supplierId) => {
    setOrderData(prev => ({ ...prev, fournisseur: supplierId, produits: [] }));
    setCatalogSearch('');
    setCatalogCategoryFilter('Toutes');
    setCatalogBrandFilter('Toutes');
  };

  const addToCart = (product) => {
    setOrderData(prev => {
      const existing = prev.produits.find(p => p.id === product.id);
      if (existing) {
        return { ...prev, produits: prev.produits.map(p => p.id === product.id ? { ...p, quantite: p.quantite + 1 } : p) };
      }
      return { ...prev, produits: [...prev.produits, { ...product, quantite: 1 }] };
    });
  };

  const removeFromCart = (productId) => {
    setOrderData(prev => ({ ...prev, produits: prev.produits.filter(p => p.id !== productId) }));
  };

  const updateQuantity = (productId, delta) => {
    setOrderData(prev => ({
      ...prev,
      produits: prev.produits.map(p => p.id === productId ? { ...p, quantite: Math.max(1, p.quantite + delta) } : p)
    }));
  };

  const calculateTotal = () => {
    const subtotal = orderData.produits.reduce((sum, prod) => sum + (prod.prixAchat * prod.quantite), 0);
    const tva = subtotal * 0.20;
    return { subtotal, tva, total: subtotal + tva, totalQty: orderData.produits.reduce((sum, prod) => sum + prod.quantite, 0) };
  };

  const handleSendOrder = () => {
    if (!orderData.fournisseur || orderData.produits.length === 0) return;
    
    const currentTotal = calculateTotal();
    const dateStr = new Date().toLocaleDateString('fr-FR');
    const montantStr = currentTotal.total.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MAD';
    const newId = `CMD-${Math.floor(Math.random() * 9000) + 1000}`;

    const newOrder = {
      id: newId,
      fournisseur: selectedFournisseur.name,
      date: dateStr,
      montant: montantStr,
      status: 'En attente',
      livraison: orderData.dateLivraison || 'À définir'
    };

    setCommandes(prev => [newOrder, ...prev]);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    setShowOrderModal(false);
    setOrderData({ fournisseur: '', dateCommande: new Date().toISOString().split('T')[0], dateLivraison: '', reference: '', conditionsPaiement: '', modeLivraison: '', adresseLivraison: 'Magasin principal, Casablanca', notes: '', produits: [] });
    setTimeout(() => scrollToCommandes(), 300);
  };

  const selectedFournisseur = fournisseurs.find(f => f.id === parseInt(orderData.fournisseur));
  const supplierCatalog = selectedFournisseur ? (FOURNISSEURS_CATALOGUES[selectedFournisseur.id] || []) : [];
  
  const filteredCatalog = useMemo(() => {
    return supplierCatalog.filter(p => {
      const matchesSearch = p.nom.toLowerCase().includes(catalogSearch.toLowerCase()) || p.ref.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchesCategory = catalogCategoryFilter === 'Toutes' || p.categorie === catalogCategoryFilter;
      const matchesBrand = catalogBrandFilter === 'Toutes' || p.marque === catalogBrandFilter;
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [supplierCatalog, catalogSearch, catalogCategoryFilter, catalogBrandFilter]);

  const catalogCategories = ['Toutes', ...new Set(supplierCatalog.map(p => p.categorie))];
  const catalogBrands = ['Toutes', ...new Set(supplierCatalog.map(p => p.marque))];
  const totals = calculateTotal();

  return (
    <div className="fourn-layout">
      <aside className="fourn-sidebar">
        <div className="fourn-sidebar-logo"><Logo size={100} className="mb-6 logo-white"/></div>
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
              <p className="fourn-stat-value">{fournisseurs.length}</p>
            </div>
          </div>
          <div className="fourn-stat-card">
            <div className="fourn-stat-icon" style={{ background: '#ffedd5', color: '#ea580c' }}><ShoppingCart size={22} /></div>
            <div className="fourn-stat-body">
              <p className="fourn-stat-label">Commandes en cours</p>
              <p className="fourn-stat-value">{commandes.filter(c => c.status !== 'Livrée').length}</p>
            </div>
          </div>
          <div className="fourn-stat-card">
            <div className="fourn-stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}><CheckCircle2 size={22} /></div>
            <div className="fourn-stat-body">
              <p className="fourn-stat-label">Commandes livrées</p>
              <p className="fourn-stat-value">{commandes.filter(c => c.status === 'Livrée').length}</p>
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
                  <tr><th>Fournisseur</th><th>Catégorie</th><th>Ville</th><th>Téléphone</th><th>Statut</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredFournisseurs.map((f) => {
                    const catStyle = CATEGORY_STYLES[f.category] || { bg: '#f1f5f9', color: '#475569' };
                    const statusStyle = STATUS_STYLES[f.status];
                    return (
                      <tr key={f.id}>
                        <td>
                          <div className="fourn-supplier-cell">
                            <div className="fourn-avatar" style={{ background: f.color }}>{f.initials}</div>
                            <span className="fourn-supplier-name">{f.name}</span>
                          </div>
                        </td>
                        <td><span className="fourn-category-pill" style={{ background: catStyle.bg, color: catStyle.color }}>{f.category}</span></td>
                        <td className="fourn-cell-text">{f.ville}</td>
                        <td className="fourn-cell-text">{f.telephone}</td>
                        <td><span className="fourn-status-pill" style={{ background: statusStyle.bg, color: statusStyle.color }}>{f.status}</span></td>
                        <td>
                          <div className="fourn-actions">
                            <button className="fourn-action-btn fourn-action-edit"><Pencil size={14} /></button>
                            <button className="fourn-action-btn fourn-action-delete" onClick={() => handleDelete(f.id)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                  {commandes.map((cmd) => {
                    const cmdStatusStyle = COMMANDE_STATUS_STYLES[cmd.status] || { bg: '#f1f5f9', color: '#64748b' };
                    return (
                      <tr key={cmd.id}>
                        <td className="fourn-cell-text fourn-command-id">{cmd.id}</td>
                        <td className="fourn-cell-text">{cmd.fournisseur}</td>
                        <td className="fourn-cell-text">{cmd.date}</td>
                        <td className="fourn-cell-text fourn-amount">{cmd.montant}</td>
                        <td><span className="fourn-command-status" style={{ background: cmdStatusStyle.bg, color: cmdStatusStyle.color }}>{cmd.status}</span></td>
                        <td className="fourn-cell-text">{cmd.livraison}</td>
                      </tr>
                    );
                  })}
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
            <p>{newSupplierName ? `"${newSupplierName}" a été enregistré.` : 'La commande a été envoyée avec succès.'}</p>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fourn-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="fourn-modal">
            <div className="fourn-modal-header">
              <div>
                <h2 className="fourn-modal-title">Ajouter un fournisseur</h2>
                <p className="fourn-modal-subtitle">Enregistrez un nouveau fournisseur.</p>
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
                <label className="fourn-form-label">Ville *</label>
                <input type="text" name="ville" value={formData.ville} onChange={handleInputChange} className="fourn-input" />
              </div>
              <div className="fourn-form-group">
                <label className="fourn-form-label">Catégorie</label>
                <select name="categorie" value={formData.categorie} onChange={handleInputChange} className="fourn-select">
                  <option value="">Sélectionnez</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="fourn-modal-footer">
              <button className="fourn-btn-secondary" onClick={() => setShowAddModal(false)}>Annuler</button>
              <button className="fourn-btn-primary" onClick={handleSave}>Enregistrer</button>
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
                <p className="fourn-modal-subtitle">Sélectionnez un fournisseur et parcourez son catalogue.</p>
              </div>
              <button className="fourn-modal-close" onClick={() => setShowOrderModal(false)}><X size={20} /></button>
            </div>

            <div className="fourn-modal-body">
              <div className="fourn-modal-section">
                <h3 className="fourn-section-title"><span className="fourn-section-icon fourn-section-icon-blue"><User size={18} /></span> 1. Fournisseur</h3>
                <select name="fournisseur" value={orderData.fournisseur} onChange={(e) => handleSelectSupplier(e.target.value)} className="fourn-select">
                  <option value="">-- Sélectionner un fournisseur --</option>
                  {fournisseurs.filter(f => f.status === 'Actif').map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                {selectedFournisseur && (
                  <div className="fourn-supplier-info-card">
                    <strong>{selectedFournisseur.name}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                      <Phone size={12} style={{verticalAlign: 'middle', marginRight: '4px'}} /> {selectedFournisseur.telephone}
                    </div>
                  </div>
                )}
              </div>

              {selectedFournisseur && (
                <div className="fourn-modal-section">
                  <h3 className="fourn-section-title"><span className="fourn-section-icon fourn-section-icon-blue"><Package size={18} /></span> 2. Catalogue</h3>
                  {supplierCatalog.length === 0 ? (
                    <div className="fourn-empty-catalog">
                      <AlertCircle size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                      <p>Aucun produit disponible pour ce fournisseur.</p>
                    </div>
                  ) : (
                    <>
                      <div className="fourn-catalog-filters">
                        <div className="fourn-search" style={{ flex: 2 }}>
                          <Search size={16} />
                          <input type="text" placeholder="Rechercher..." value={catalogSearch} onChange={(e) => setCatalogSearch(e.target.value)} />
                        </div>
                        <select className="fourn-select" value={catalogCategoryFilter} onChange={(e) => setCatalogCategoryFilter(e.target.value)}>
                          {catalogCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="fourn-catalog-grid">
                        {filteredCatalog.map(product => {
                          const isInCart = orderData.produits.some(p => p.id === product.id);
                          const cartProduct = orderData.produits.find(p => p.id === product.id);
                          return (
                            <div key={product.id} className={`fourn-product-card ${isInCart ? 'in-cart' : ''}`}>
                              {isInCart && <div className="fourn-product-badge-top"><Check size={12} /> Dans le panier</div>}
                              <div className="fourn-product-info">
                                <div className="fourn-product-name">{product.nom}</div>
                                <div className="fourn-product-meta">
                                  <span className="fourn-product-ref">Réf: {product.ref}</span>
                                  <span className="fourn-product-brand">{product.marque}</span>
                                </div>
                                <div className="fourn-product-footer">
                                  <div className="fourn-product-price">
                                    <span className="fourn-price-value">{product.prixAchat.toFixed(2)}</span>
                                    <span className="fourn-price-unit">MAD</span>
                                  </div>
                                  {isInCart ? (
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
                              <div style={{ fontWeight: '600', color: '#0b1f4b' }}>{prod.nom}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Réf: {prod.ref}</div>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <button className="fourn-qty-btn" onClick={() => updateQuantity(prod.id, -1)}><Minus size={12} /></button>
                                <span style={{ fontWeight: '600', minWidth: '30px' }}>{prod.quantite}</span>
                                <button className="fourn-qty-btn" onClick={() => updateQuantity(prod.id, 1)}><PlusIcon size={12} /></button>
                              </div>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700', color: '#1d4fd8' }}>{(prod.prixAchat * prod.quantite).toFixed(2)} MAD</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <button className="fourn-action-btn fourn-action-delete" onClick={() => removeFromCart(prod.id)}><TrashIcon size={14} /></button>
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
                    <label className="fourn-form-label">Notes (optionnel)</label>
                    <textarea name="notes" value={orderData.notes} onChange={handleOrderInputChange} className="fourn-textarea" rows={2} />
                  </div>
                </div>
              )}
            </div>

            <div className="fourn-modal-footer">
              <button className="fourn-btn-secondary" onClick={() => setShowOrderModal(false)}>Annuler</button>
              <button className="fourn-btn-primary" onClick={handleSendOrder} disabled={!orderData.fournisseur || orderData.produits.length === 0}>
                <Send size={18} /> Envoyer la commande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}