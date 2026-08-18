import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Package,
  Boxes,
  ArrowLeftRight,
  Users,
  Star,
  Bot,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Box,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  User,
  X,
  ShoppingCart,
  Minus,
  Plus,
  Receipt,
  Tag,
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
  'Autre',
];

const CATEGORY_STYLES = {
  Boissons: { bg: '#dbeafe', color: '#1d4fd8' },
  Boulangerie: { bg: '#ede9fe', color: '#7c3aed' },
  Épicerie: { bg: '#e0f2fe', color: '#0284c7' },
  'Produits laitiers': { bg: '#fef3c7', color: '#d97706' },
  'Fruits & Légumes': { bg: '#d1fae5', color: '#059669' },
};

const STATUS_STYLES = {
  'En stock': { dot: '#16a34a', color: '#16a34a' },
  'Stock faible': { dot: '#f59e0b', color: '#b45309' },
  Rupture: { dot: '#dc2626', color: '#dc2626' },
};

const getStatusFromStock = (stock) => {
  const stockNum = parseInt(stock, 10) || 0;
  if (stockNum === 0) return 'Rupture';
  if (stockNum <= 12) return 'Stock faible';
  return 'En stock';
};

const NAV_ITEMS = [
  {
    icon: Home,
    label: 'Accueil',
    to: '/acceuil-com',
  },
  {
    icon: Package,
    label: 'Produits',
    to: '/produits',
    active: true,
  },
  {
    icon: ArrowLeftRight,
    label: 'Paiements & Transactions',
    to: '/transactions-commerce',
  },
  {
    icon: Users,
    label: 'Fournisseurs',
    to: '/fournisseurs',
  },
  {
    icon: Star,
    label: 'Fidélité & Tickets',
    to: '/fidelite-commerce',
  },
  {
    icon: Bell,
    label: 'Notifications',
    to: '/notifications-com',
  },
  {
    icon: Bot,
    label: 'Assistant IA',
    to: '/assistant-commerce',
  },
  {
    icon: User,
    label: 'Profil & Paramètres',
    to: '/parametres-commerce',
  },
];

const PAGE_SIZE = 10;

export default function ProduitsCom() {
  const location = useLocation();
  const saleId = location.state?.saleId;
  const saleFromState = location.state?.sale;
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
  const [activeMode, setActiveMode] = useState('catalogue');
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const [cart, setCart] = useState([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [creatingSale, setCreatingSale] = useState(false);
  const [createdSale, setCreatedSale] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Boissons',
    price: '',
    stock: '',
    description: '',
  });

  const searchRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error(
          'La réponse /products n’est pas une liste :',
          response.data
        );
        setProducts([]);
      }
    } catch (error) {
      console.error('Erreur chargement produits :', error);
      setProducts([]);
    }
  };

  const stats = useMemo(() => {
    const total = products.length;

    const enStock = products.filter(
      (p) => getStatusFromStock(p.stock) === 'En stock'
    ).length;

    const faible = products.filter(
      (p) => getStatusFromStock(p.stock) === 'Stock faible'
    ).length;

    const rupture = products.filter(
      (p) => getStatusFromStock(p.stock) === 'Rupture'
    ).length;

    return [
      {
        key: 'total',
        icon: Box,
        label: 'Total des produits',
        value: total,
        sub: 'Tous vos produits',
        subTone: 'muted',
      },
      {
        key: 'stock',
        icon: CheckCircle2,
        label: 'Produits en stock',
        value: enStock,
        sub: `${total ? Math.round((enStock / total) * 100) : 0}% du total`,
        subTone: 'muted',
      },
      {
        key: 'low',
        icon: AlertTriangle,
        label: 'Stock faible',
        value: faible,
        sub: 'À réapprovisionner',
        subTone: 'orange',
      },
      {
        key: 'out',
        icon: XCircle,
        label: 'En rupture',
        value: rupture,
        sub: 'Indisponibles',
        subTone: 'red',
      },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const productName = String(p.name || '');
      const productCode = String(p.code || '');

      const matchSearch =
        !search ||
        productName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        productCode
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === 'Toutes' ||
        p.category === categoryFilter;

      return matchSearch && matchCategory;
    });

    if (sortBy === 'name') {
      list = [...list].sort((a, b) =>
        String(a.name || '').localeCompare(String(b.name || ''))
      );
    }

    if (sortBy === 'price') {
      list = [...list].sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    }

    if (sortBy === 'stock') {
      list = [...list].sort(
        (a, b) => Number(a.stock || 0) - Number(b.stock || 0)
      );
    }

    if (sortBy === 'recent') {
      list = [...list].sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    return list;
  }, [products, search, categoryFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, sortBy]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      await loadProducts();

      setCart((currentCart) =>
        currentCart.filter((item) => item.product.id !== id)
      );
    } catch (error) {
      console.error('Erreur suppression produit :', error);
      alert('Impossible de supprimer le produit.');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      code: '',
      category: 'Boissons',
      price: '',
      stock: '',
      description: '',
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      code: product.code || '',
      category: product.category || 'Boissons',
      price:
        product.price !== undefined && product.price !== null
          ? product.price
          : '',
      stock:
        product.stock !== undefined && product.stock !== null
          ? product.stock
          : '',
      description: product.description || '',
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock:
          formData.stock !== '' && formData.stock !== null
            ? parseInt(formData.stock, 10)
            : 0,
        description: formData.description,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      await loadProducts();
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        code: '',
        category: 'Boissons',
        price: '',
        stock: '',
        description: '',
      });
    } catch (error) {
      console.error('Erreur enregistrement produit :', error);
      const message =
        error?.response?.data?.message ||
        "Impossible d'enregistrer le produit.";
      alert(message);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Voulez-vous vous déconnecter ?')) {
      navigate('/');
    }
  };

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { product, quantity: 1 }];
    });

    setShowCartDrawer(true);
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart((currentCart) =>
        currentCart.filter((item) => item.product.id !== productId)
      );
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.product.id !== productId)
    );
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.product.price || 0) * item.quantity,
      0
    );
  }, [cart]);

  const cartTotal = cartSubtotal;

  const cartItemsCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // =========================================================
  // CREER LA VENTE  ← SEULE PARTIE MODIFIÉE
  // =========================================================

 const handleCreateSale = async () => {
  if (cart.length === 0) {
    alert('Veuillez ajouter au moins un produit au panier.');
    return;
  }

  if (creatingSale) return;

  setCreatingSale(true);

  try {
    const saleRequest = {
      clientId: null,
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      voucherCode:
        voucherCode.trim() !== ''
          ? voucherCode.trim()
          : null,
    };

    console.log('POST /api/sales', saleRequest);

    const response = await api.post('/sales', saleRequest);

    console.log('=== REPONSE COMPLETE DU BACKEND ===');
    console.log(response.data);

    const data = response.data;

    // =====================================================
    // REPONSE ACTUELLE DU BACKEND
    //
    // {
    //   "saleId": 65,
    //   "paymentRequestReference": "PAY-95283D3F",
    //   "totalAmount": 65.00
    // }
    // =====================================================

    const saleId = data?.saleId;
    const paymentRequestReference =
      data?.paymentRequestReference;
    const totalAmount = data?.totalAmount;

    if (!saleId) {
      alert("Erreur : la vente créée n’a pas d’identifiant.");
      console.error(
        "Réponse backend sans saleId :",
        data
      );
      return;
    }

    if (!paymentRequestReference) {
      alert(
        "Erreur : le backend n’a pas renvoyé la référence de paiement."
      );
      console.error(
        "Réponse backend sans paymentRequestReference :",
        data
      );
      return;
    }

    if (totalAmount === undefined || totalAmount === null) {
      alert(
        "Erreur : le backend n’a pas renvoyé le montant de la vente."
      );
      console.error(
        "Réponse backend sans totalAmount :",
        data
      );
      return;
    }

    console.log('=== VENTE CREEE AVEC SUCCES ===');
    console.log('Sale ID :', saleId);
    console.log(
      'Payment Reference :',
      paymentRequestReference
    );
    console.log('Total :', totalAmount);

    setCreatedSale(data);
    setCart([]);
    setVoucherCode('');
    setShowCartDrawer(false);

    // =====================================================
    // REDIRECTION VERS LA PAGE QR CODE
    // =====================================================

    navigate('/recevoir-paiement', {
      state: {
        saleId: saleId,
        amount: totalAmount,
        paymentRequestReference:
          paymentRequestReference,
      },
    });

  } catch (error) {
    console.error(
      'Erreur création vente :',
      error
    );

    console.error(
      'Réponse backend :',
      error?.response?.data
    );

    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      'Impossible de créer la vente.';

    alert(message);

  } finally {
    setCreatingSale(false);
  }
};
  return (
    <div className="prod-page">
      <aside className="prod-sidebar">
        <div className="prod-logo-wrapper">
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
                className={`prod-nav-item ${
                  item.active ? 'prod-nav-item-active' : ''
                }`}
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
            <h1 className="prod-page-title">Produits &amp; Stock</h1>
            <p className="prod-page-subtitle">
              Gérez votre catalogue, votre stock et créez vos ventes.
            </p>
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

            <button
              type="button"
              className="prod-icon-button"
              onClick={() => setShowCartDrawer(true)}
              aria-label="Panier"
            >
              <ShoppingCart size={18} />
              {cartItemsCount > 0 && (
                <span className="prod-badge">{cartItemsCount}</span>
              )}
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
                  <Link
                    to="/"
                    onClick={handleLogout}
                    className="prod-menu-item prod-menu-logout"
                  >
                    Déconnexion
                  </Link>
                </div>
              )}
            </div>

            <button
              type="button"
              className="prod-btn-primary"
              onClick={openAddModal}
            >
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
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'Toutes' ? 'Toutes les catégories' : cat}
              </option>
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
            <option value="stock">Stock</option>
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
                  <p
                    className={`prod-stat-sub prod-stat-sub-${
                      s.subTone || 'muted'
                    }`}
                  >
                    {s.sub}
                  </p>
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
                  <th>Stock actuel</th>
                  <th>Statut</th>
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
                      <p>
                        Ajoutez vos produits pour les afficher dans votre
                        catalogue.
                      </p>
                      <button
                        type="button"
                        className="prod-btn-primary"
                        onClick={openAddModal}
                      >
                        <Plus size={18} />
                        Ajouter un produit
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((p) => {
                    const catStyle = CATEGORY_STYLES[p.category] || {
                      bg: '#f1f5f9',
                      color: '#475569',
                    };

                    const status = getStatusFromStock(p.stock);
                    const statusStyle = STATUS_STYLES[status];

                    return (
                      <tr key={p.id}>
                        <td>
                          <p className="prod-name">{p.name}</p>
                          <p className="prod-code">Code : {p.code}</p>
                        </td>

                        <td>
                          <span
                            className="prod-category-pill"
                            style={{
                              background: catStyle.bg,
                              color: catStyle.color,
                            }}
                          >
                            {p.category}
                          </span>
                        </td>

                        <td className="prod-price">
                          {Number(p.price || 0).toFixed(2)} MAD
                        </td>

                        <td
                          className="prod-stock-value"
                          style={{
                            color:
                              status === 'Rupture'
                                ? '#dc2626'
                                : status === 'Stock faible'
                                ? '#d97706'
                                : '#0f172a',
                          }}
                        >
                          {p.stock ?? 0}
                        </td>

                        <td>
                          <span className="prod-status">
                            <span
                              className="prod-status-dot"
                              style={{ background: statusStyle.dot }}
                            />
                            <span style={{ color: statusStyle.color }}>
                              {status}
                            </span>
                          </span>
                        </td>

                        <td className="prod-date">
                          {p.createdAt
                            ? new Date(p.createdAt).toLocaleDateString(
                                'fr-FR'
                              )
                            : '-'}
                        </td>

                        <td>
                          <div className="prod-actions">
                            <button
                              type="button"
                              className="prod-action-btn"
                              aria-label="Ajouter au panier"
                              title="Ajouter au panier"
                              onClick={() => addToCart(p)}
                              disabled={status === 'Rupture'}
                            >
                              <ShoppingCart size={15} />
                            </button>

                            <button
                              type="button"
                              className="prod-action-btn prod-action-view"
                              aria-label="Voir"
                              title="Voir"
                              onClick={() => setViewingProduct(p)}
                            >
                              <Eye size={15} />
                            </button>

                            <button
                              type="button"
                              className="prod-action-btn prod-action-edit"
                              aria-label="Modifier"
                              title="Modifier"
                              onClick={() => openEditModal(p)}
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              type="button"
                              className="prod-action-btn prod-action-delete"
                              aria-label="Supprimer"
                              title="Supprimer"
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
                {filteredProducts.length} résultat
                {filteredProducts.length > 1 ? 's' : ''}
              </div>

              <div className="prod-per-page">
                <span>{PAGE_SIZE} par page</span>
                <ChevronDown size={15} />
              </div>

              <div className="prod-page-controls">
                <button
                  type="button"
                  className="prod-page-btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                  aria-label="Page précédente"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      type="button"
                      className={`prod-page-btn ${
                        currentPage === n ? 'prod-page-btn-active' : ''
                      }`}
                      onClick={() => setCurrentPage(n)}
                    >
                      {n}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="prod-page-btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
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

      {showCartDrawer && (
        <div
          className="prod-cart-overlay"
          onClick={() => setShowCartDrawer(false)}
        >
          <div
            className="prod-cart-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="prod-cart-drawer-header">
              <h2 className="prod-modal-title">
                Mon Panier ({cartItemsCount})
              </h2>
              <button
                type="button"
                className="prod-modal-close"
                onClick={() => setShowCartDrawer(false)}
                aria-label="Fermer le panier"
              >
                <X size={20} />
              </button>
            </div>

            <div className="prod-cart-drawer-body">
              {cart.length === 0 ? (
                <div className="prod-cart-empty">
                  <ShoppingCart size={32} />
                  <p>Votre panier est vide.</p>
                </div>
              ) : (
                <div className="prod-cart-items">
                  {cart.map((item) => (
                    <div key={item.product.id} className="prod-cart-item">
                      <div className="prod-cart-item-info">
                        <div className="prod-cart-item-name">
                          {item.product.name}
                        </div>
                        <div className="prod-cart-item-price">
                          {Number(item.product.price || 0).toFixed(2)} MAD /
                          unité
                        </div>
                      </div>

                      <div className="prod-cart-item-actions">
                        <button
                          type="button"
                          className="prod-action-btn"
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          aria-label="Diminuer"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="prod-cart-quantity">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          className="prod-action-btn"
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          aria-label="Augmenter"
                        >
                          <Plus size={15} />
                        </button>

                        <button
                          type="button"
                          className="prod-action-btn prod-action-delete"
                          onClick={() => removeFromCart(item.product.id)}
                          aria-label="Supprimer du panier"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="prod-cart-item-total">
                        {(
                          Number(item.product.price || 0) * item.quantity
                        ).toFixed(2)}{' '}
                        MAD
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="prod-cart-drawer-footer">
                <div className="prod-cart-voucher">
                  <label className="prod-form-label">
                    <Tag size={16} />
                    Code du bon d'achat
                  </label>
                  <input
                    type="text"
                    className="prod-form-input"
                    placeholder="Ex : BON-2026-001"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <small>
                    Le bon sera validé par le serveur lors de la création de
                    la vente.
                  </small>
                </div>

                <div className="prod-cart-total-row prod-cart-total-final">
                  <span>Total</span>
                  <strong>{cartTotal.toFixed(2)} MAD</strong>
                </div>

                <button
                  type="button"
                  className="prod-btn-primary prod-btn-full"
                  onClick={handleCreateSale}
                  disabled={creatingSale}
                >
                  {creatingSale ? (
                    <span>Création...</span>
                  ) : (
                    <>
                      <Receipt size={18} />
                      Créer la vente
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="prod-btn-secondary prod-btn-full"
                  onClick={() => {
                    setCart([]);
                    setVoucherCode('');
                  }}
                >
                  Vider le panier
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
                {editingProduct
                  ? 'Modifier le produit'
                  : 'Ajouter un produit'}
              </h2>
              <button
                type="button"
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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="prod-form-input"
                    required
                  />
                </div>

                <div className="prod-form-group">
                  <label className="prod-form-label">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      })
                    }
                    className="prod-form-input"
                  >
                    {CATEGORIES.filter((c) => c !== 'Toutes').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="prod-form-group">
                  <label className="prod-form-label">Prix (MAD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="prod-form-input"
                    required
                  />
                </div>

                <div className="prod-form-group">
                  <label className="prod-form-label">Stock *</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="prod-form-input"
                    required
                  />
                </div>

                <div className="prod-form-group prod-form-full">
                  <label className="prod-form-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
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
                <button type="submit" className="prod-btn-primary">
                  {editingProduct
                    ? 'Enregistrer les modifications'
                    : 'Ajouter le produit'}
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
                type="button"
                onClick={() => setViewingProduct(null)}
                className="prod-modal-close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="prod-view-content">
              <div className="prod-view-info">
                <h3 className="prod-view-name">{viewingProduct.name}</h3>
                <p className="prod-view-code">
                  Code : {viewingProduct.code}
                </p>
              </div>

              <div className="prod-view-details">
                <div className="prod-view-item">
                  <span className="prod-view-label">Catégorie</span>
                  <span className="prod-view-value">
                    {viewingProduct.category}
                  </span>
                </div>

                <div className="prod-view-item">
                  <span className="prod-view-label">Prix</span>
                  <span className="prod-view-value">
                    {Number(viewingProduct.price || 0).toFixed(2)} MAD
                  </span>
                </div>

                <div className="prod-view-item">
                  <span className="prod-view-label">Stock</span>
                  <span className="prod-view-value">
                    {viewingProduct.stock ?? 0}
                  </span>
                </div>

                <div className="prod-view-item">
                  <span className="prod-view-label">Statut</span>
                  <span
                    className="prod-view-value"
                    style={{
                      color:
                        STATUS_STYLES[
                          getStatusFromStock(viewingProduct.stock)
                        ].color,
                    }}
                  >
                    {getStatusFromStock(viewingProduct.stock)}
                  </span>
                </div>

                <div className="prod-view-item">
                  <span className="prod-view-label">Description</span>
                  <span className="prod-view-value">
                    {viewingProduct.description || '-'}
                  </span>
                </div>

                <div className="prod-view-item">
                  <span className="prod-view-label">Date d'ajout</span>
                  <span className="prod-view-value">
                    {viewingProduct.createdAt
                      ? new Date(
                          viewingProduct.createdAt
                        ).toLocaleDateString('fr-FR')
                      : '-'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="prod-btn-primary prod-btn-full"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}