import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, CreditCard, Truck, Layers, User, Settings,
  HelpCircle, LogOut, Search, Bell, ChevronDown, Building2, MapPinned,
  CheckCircle, Pencil, FileDown, X, MapPin, ClipboardCheck, PackageCheck,
  CheckCircle2, Bot,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import api from '../services/api'; // Import de l'instance API
import './LivraisonsFournisseur.css';

// --- CONSTANTES METIER ---

const STATUS_FLOW = [
  'EN_PREPARATION',
  'EN_LIVRAISON',
  'LIVREE'
];

const STATUS_LABELS = {
  EN_PREPARATION: 'En préparation',
  EN_LIVRAISON: 'En cours de livraison',
  LIVREE: 'Livrée',
};

const STATUS_TONE = {
  EN_PREPARATION: 'orange',
  EN_LIVRAISON: 'purple',
  LIVREE: 'green',
};

const FILTERS = [
  'Toutes',
  'EN_PREPARATION',
  'EN_LIVRAISON',
  'LIVREE'
];

const PAGE_SIZE = 10;

const TIMELINE_STEPS = [
  { label: 'Commande préparée', status: 'EN_PREPARATION', icon: ClipboardCheck },
  { label: 'Colis expédié / En route', status: 'EN_LIVRAISON', icon: Truck },
  { label: 'Livraison effectuée', status: 'LIVREE', icon: PackageCheck },
];

// --- FONCTIONS UTILITAIRES ---

/**
 * Transforme la réponse brute de l'API en format attendu par le JSX
 */
function mapDeliveryFromApi(d) {
  return {
    id: d.id, // ID Livraison ou OrderID selon ton besoin d'affichage
    orderId: d.orderId, // Gardé pour les appels API PATCH
    cmd: d.orderReference || `CMD-${d.orderId}`,
    client: d.merchantName || 'Inconnu',
    phone: d.merchantPhone || '—',
    adresse: d.merchantAddress || '—',

    transporteur: d.transporteur || '—',
    vehicule: d.vehicule || '—',
    chauffeur: d.chauffeur || '—',
    tracking: d.trackingNumber || '—',

    expedition: d.expeditionDate
      ? new Date(d.expeditionDate).toLocaleDateString('fr-FR')
      : '—',

    prevue: d.estimatedDeliveryDate
      ? new Date(d.estimatedDeliveryDate).toLocaleDateString('fr-FR')
      : '—',

    statut: d.status, // Doit être EN_PREPARATION, EN_LIVRAISON ou LIVREE

    produits: (d.items || []).map((item) => ({
      id: item.id,
      nom: item.productName,
      qte: item.quantity,
      poids: '—', // Si le poids n'est pas dans l'API, on met un placeholder
      statut:
        d.status === 'LIVREE'
          ? 'Livré'
          : d.status === 'EN_LIVRAISON'
            ? 'En livraison'
            : 'En préparation',
    })),
  };
}

/**
 * Génère le HTML du bon de livraison
 */
function generateDeliveryNoteHTML(delivery) {
  const totalPoids = delivery.produits.reduce((sum, p) => {
    const num = parseFloat(p.poids.replace(',', '.'));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const produitsRows = delivery.produits.map((p) => `
    <tr>
      <td>${p.nom}</td>
      <td>${p.qte}</td>
      <td>${p.poids}</td>
      <td><span class="status status-${STATUS_TONE[delivery.statut] === 'green' ? 'green' : STATUS_TONE[delivery.statut] === 'orange' ? 'orange' : 'purple'}">${p.statut}</span></td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Bon de livraison ${delivery.cmd}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1d4fd8; padding-bottom: 20px; margin-bottom: 30px; }
  .header-left h1 { color: #0b1f4b; margin: 0 0 5px; font-size: 26px; }
  .header-left p { color: #6b7280; margin: 0; font-size: 13px; }
  .header-right { text-align: right; }
  .header-right .ref { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
  .header-right .number { font-size: 22px; font-weight: 700; color: #1d4fd8; margin: 4px 0; }
  .section { margin-bottom: 25px; }
  .section h3 { color: #0b1f4b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; }
  .info-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; border-bottom: 1px dotted #f1f5f9; }
  .info-row .label { color: #6b7280; }
  .info-row .value { font-weight: 600; color: #0b1f4b; }
  table.products { width: 100%; border-collapse: collapse; margin-top: 10px; }
  table.products th { background: #f8fafc; color: #0b1f4b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; padding: 10px 12px; border-bottom: 2px solid #e5e7eb; }
  table.products td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
  .status { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
  .status-green { background: #dcfce7; color: #16a34a; }
  .status-orange { background: #fef3c7; color: #b45309; }
  .status-purple { background: #ede9fe; color: #7c3aed; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; display: flex; justify-content: space-between; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>ASWAQ BANK</h1>
      <p>Bon de livraison officiel</p>
    </div>
    <div class="header-right">
      <div class="ref">N° Commande</div>
      <div class="number">${delivery.cmd}</div>
    </div>
  </div>
  <div class="section">
    <h3>Informations</h3>
    <div class="info-grid">
      <div class="info-row"><span class="label">Statut</span><span class="value">${STATUS_LABELS[delivery.statut]}</span></div>
      <div class="info-row"><span class="label">Expédition</span><span class="value">${delivery.expedition}</span></div>
      <div class="info-row"><span class="label">Prévue</span><span class="value">${delivery.prevue}</span></div>
      <div class="info-row"><span class="label">Suivi</span><span class="value">${delivery.tracking}</span></div>
    </div>
  </div>
  <div class="section">
    <h3>Commerçant</h3>
    <div class="info-grid">
      <div class="info-row"><span class="label">Nom</span><span class="value">${delivery.client}</span></div>
      <div class="info-row" style="grid-column: 1 / -1;"><span class="label">Adresse</span><span class="value">${delivery.adresse}</span></div>
    </div>
  </div>
  <div class="section">
    <h3>Produits</h3>
    <table class="products">
      <thead><tr><th>Produit</th><th>Qté</th><th>Poids</th><th>Statut</th></tr></thead>
      <tbody>${produitsRows}</tbody>
    </table>
  </div>
  <div class="footer">
    <div>Signature Transporteur</div>
    <div>Signature Commerçant</div>
  </div>
</body>
</html>`;
}

function downloadDeliveryNote(delivery) {
  const html = generateDeliveryNoteHTML(delivery);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Bon_livraison_${delivery.cmd}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// --- COMPOSANT MODAL ---

function DeliveryDetailsModal({ delivery, onClose, onChangeStatus, onUpdateInfo }) {
  const [form, setForm] = useState({
    transporteur: '',
    vehicule: '',
    chauffeur: '',
    tracking: '',
    estimatedDate: '',
  });

  useEffect(() => {
    if (delivery) {
      setForm({
        transporteur: delivery.transporteur !== '—' ? delivery.transporteur : '',
        vehicule: delivery.vehicule !== '—' ? delivery.vehicule : '',
        chauffeur: delivery.chauffeur !== '—' ? delivery.chauffeur : '',
        tracking: delivery.tracking !== '—' ? delivery.tracking : '',
        estimatedDate: '',
      });
    }
  }, [delivery]);

  if (!delivery) return null;

  const inputStyle = {
    padding: '6px 8px',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    fontSize: 14,
    width: '100%',
  };

  // Le fournisseur peut désormais faire avancer le statut jusqu'à LIVREE
  const nextStatus =
    delivery.statut === 'EN_PREPARATION'
      ? 'EN_LIVRAISON'
      : delivery.statut === 'EN_LIVRAISON'
        ? 'LIVREE'
        : null;

  const handleSaveInfo = () => {
    const payload = {};
    if (form.transporteur.trim()) payload.transporteur = form.transporteur.trim();
    if (form.vehicule.trim()) payload.vehicule = form.vehicule.trim();
    if (form.chauffeur.trim()) payload.chauffeur = form.chauffeur.trim();
    if (form.tracking.trim()) payload.trackingNumber = form.tracking.trim();
    if (form.estimatedDate) payload.estimatedDeliveryDate = form.estimatedDate;
    onUpdateInfo(delivery, payload);
  };

  return (
    <div className="liv-four-modal-overlay" onClick={onClose}>
      <div className="liv-four-modal" onClick={(e) => e.stopPropagation()}>
        <div className="liv-four-modal-header">
          <h3>Détails de la livraison {delivery.cmd}</h3>
          <button type="button" className="liv-four-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="liv-four-modal-body">
          {/* Timeline */}
          <div>
            <p className="liv-four-modal-section-title">Suivi de la livraison</p>
            <div className="liv-four-steps">
              {TIMELINE_STEPS.map((step) => {
                const Icon = step.icon;
                const isDone = STATUS_FLOW.indexOf(step.status) < STATUS_FLOW.indexOf(delivery.statut);
                const isCurrent = step.status === delivery.statut;
                return (
                  <div className="liv-four-step" key={step.status}>
                    <span
                      className={`liv-four-step-dot ${isDone ? 'liv-four-step-dot-done' : ''} ${isCurrent ? 'liv-four-step-dot-current' : ''}`}
                    >
                      <Icon size={14} />
                    </span>
                    <span className={`liv-four-step-line ${isDone ? 'liv-four-step-line-done' : ''}`} />
                    <span className={`liv-four-step-label ${isCurrent ? 'liv-four-step-label-active' : ''}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* General info */}
          <div>
            <p className="liv-four-modal-section-title">Informations générales</p>
            <div className="liv-four-modal-grid">
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Commande</span>
                <span className="liv-four-modal-field-value">{delivery.cmd}</span>
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Statut</span>
                <span className={`liv-four-badge-pill liv-four-badge-pill-${STATUS_TONE[delivery.statut]}`}>
                  {STATUS_LABELS[delivery.statut]}
                </span>
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Date d&apos;expédition</span>
                <span className="liv-four-modal-field-value">{delivery.expedition}</span>
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Date estimée</span>
                <span className="liv-four-modal-field-value">{delivery.prevue}</span>
              </div>
            </div>
          </div>

          {/* Commerçant */}
          <div>
            <p className="liv-four-modal-section-title">Informations du commerçant</p>
            <div className="liv-four-modal-grid">
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Nom</span>
                <span className="liv-four-modal-field-value">{delivery.client}</span>
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Téléphone</span>
                <span className="liv-four-modal-field-value">{delivery.phone}</span>
              </div>
              <div className="liv-four-modal-field" style={{ gridColumn: '1 / -1' }}>
                <span className="liv-four-modal-field-label">Adresse complète</span>
                <span className="liv-four-modal-field-value">{delivery.adresse}</span>
              </div>
            </div>
          </div>

          {/* Produits */}
          <div>
            <p className="liv-four-modal-section-title">Produits expédiés</p>
            <table className="liv-four-products-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Poids</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {delivery.produits.map((p) => (
                  <tr key={p.id || p.nom}>
                    <td>{p.nom}</td>
                    <td>{p.qte}</td>
                    <td>{p.poids}</td>
                    <td>{p.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Transport */}
          <div>
            <p className="liv-four-modal-section-title">Transport</p>
            <div className="liv-four-transport-grid">
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Transporteur</span>
                <input
                  type="text"
                  style={inputStyle}
                  value={form.transporteur}
                  onChange={(e) => setForm((f) => ({ ...f, transporteur: e.target.value }))}
                  disabled={delivery.statut === 'LIVREE'}
                  placeholder="Nom du transporteur"
                />
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Numéro de suivi</span>
                <input
                  type="text"
                  style={inputStyle}
                  value={form.tracking}
                  onChange={(e) => setForm((f) => ({ ...f, tracking: e.target.value }))}
                  disabled={delivery.statut === 'LIVREE'}
                  placeholder="N° de tracking"
                />
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Véhicule</span>
                <input
                  type="text"
                  style={inputStyle}
                  value={form.vehicule}
                  onChange={(e) => setForm((f) => ({ ...f, vehicule: e.target.value }))}
                  disabled={delivery.statut === 'LIVREE'}
                  placeholder="Immatriculation / type"
                />
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Chauffeur</span>
                <input
                  type="text"
                  style={inputStyle}
                  value={form.chauffeur}
                  onChange={(e) => setForm((f) => ({ ...f, chauffeur: e.target.value }))}
                  disabled={delivery.statut === 'LIVREE'}
                  placeholder="Nom du chauffeur"
                />
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Date d&apos;expédition</span>
                <span className="liv-four-modal-field-value">{delivery.expedition}</span>
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Date estimée de livraison</span>
                <input
                  type="date"
                  style={inputStyle}
                  value={form.estimatedDate}
                  onChange={(e) => setForm((f) => ({ ...f, estimatedDate: e.target.value }))}
                  disabled={delivery.statut === 'LIVREE'}
                />
              </div>
            </div>

            {delivery.statut !== 'LIVREE' && (
              <button
                type="button"
                className="liv-four-btn liv-four-btn-outline"
                style={{ marginTop: 10 }}
                onClick={handleSaveInfo}
              >
                Enregistrer les informations
              </button>
            )}
          </div>

          {/* Workflow Buttons */}
          <div>
            <p className="liv-four-modal-section-title">Mettre à jour le statut</p>
            <div className="liv-four-workflow">
              {STATUS_FLOW.map((status) => {
                const isCurrent = delivery.statut === status;
                const canSelect = nextStatus === status;

                return (
                  <button
                    key={status}
                    type="button"
                    className={`liv-four-workflow-btn ${
                      isCurrent ? 'liv-four-workflow-btn-active' : ''
                    }`}
                    disabled={!canSelect}
                    onClick={() => {
                      if (canSelect) {
                        onChangeStatus(delivery.id, status);
                      }
                    }}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                );
              })}
            </div>

            {delivery.statut === 'LIVREE' && (
              <div style={{ marginTop: 10, color: '#16a34a', fontSize: '0.85rem', fontWeight: 600 }}>
                ✓ Livraison marquée comme livrée
              </div>
            )}
          </div>
        </div>

        <div className="liv-four-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', padding: '1.1rem 1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <button type="button" className="liv-four-btn liv-four-btn-outline" onClick={() => downloadDeliveryNote(delivery)}>
            <FileDown size={15} />
            Bon de livraison
          </button>

          {nextStatus && (
            <button
              type="button"
              className="liv-four-btn liv-four-btn-solid"
              onClick={() => onChangeStatus(delivery.id, nextStatus)}
            >
              Passer à « {STATUS_LABELS[nextStatus]} »
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---

export default function LivraisonsFournisseur() {
  const location = useLocation();
  const navigate = useNavigate();

  // States
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Toutes');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);

  const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' },
    { icon: Package, label: 'Produits', to: '/produits-fournisseur' },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur' },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' , active: true},
   { icon: Bell, label: 'Notifications', to: '/notifications-fournisseur' },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-fournisseur' },
    { icon: User, label: 'Profil & Paramètres', to: '/profil-fournisseur' },
  ];

  // Chargement des données
  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/supplier/deliveries');

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setDeliveries(data.map(mapDeliveryFromApi));
    } catch (err) {
      console.error('Erreur chargement livraisons fournisseur:', err);

      setError(
        err.response?.data?.message ||
        'Impossible de charger les livraisons.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  // Changement de statut (Appel API)
  const handleChangeStatus = async (id, statut) => {
    const delivery = deliveries.find((d) => d.id === id);
    if (!delivery) return;

    // Le fournisseur peut faire avancer le statut : EN_PREPARATION -> EN_LIVRAISON -> LIVREE
    const allowedNext = {
      EN_PREPARATION: 'EN_LIVRAISON',
      EN_LIVRAISON: 'LIVREE',
    };

    if (allowedNext[delivery.statut] !== statut) {
      return;
    }

    try {
      await api.patch(`/supplier/orders/${delivery.orderId}/status`, {
        status: statut,
      });

      // Mise à jour optimiste de l'UI
      setDeliveries((prev) =>
        prev.map((d) => (d.id === id ? { ...d, statut } : d))
      );

      setToast(
        statut === 'LIVREE'
          ? 'La livraison a été marquée comme livrée.'
          : 'La livraison est maintenant en cours de livraison.'
      );
      setTimeout(() => setToast(null), 3000);

    } catch (err) {
      console.error('Erreur changement statut livraison:', err);

      setToast(
        err.response?.data?.message ||
        'Impossible de modifier le statut.'
      );

      setTimeout(() => setToast(null), 3000);
    }
  };

  // Mise à jour des infos de livraison (transporteur, véhicule, chauffeur, tracking, date estimée)
  const handleUpdateDeliveryInfo = async (delivery, fields) => {
    try {
      const response = await api.patch(`/supplier/deliveries/${delivery.orderId}`, fields);
      const updated = mapDeliveryFromApi(response.data);

      setDeliveries((prev) =>
        prev.map((d) => (d.id === delivery.id ? updated : d))
      );

      setToast('Informations de livraison mises à jour.');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Erreur mise à jour livraison:', err);

      setToast(
        err.response?.data?.message ||
        "Impossible de mettre à jour les informations de livraison."
      );

      setTimeout(() => setToast(null), 3000);
    }
  };

  // Calcul des stats dynamiques
  const stats = useMemo(() => [
    {
      key: 'total',
      icon: Truck,
      tone: 'blue',
      label: 'Livraisons totales',
      value: deliveries.length,
    },
    {
      key: 'prep',
      icon: Package,
      tone: 'orange',
      label: 'En préparation',
      value: deliveries.filter(
        (d) => d.statut === 'EN_PREPARATION'
      ).length,
    },
    {
      key: 'cours',
      icon: MapPinned,
      tone: 'purple',
      label: 'En cours de livraison',
      value: deliveries.filter(
        (d) => d.statut === 'EN_LIVRAISON'
      ).length,
    },
    {
      key: 'livrees',
      icon: CheckCircle,
      tone: 'green',
      label: 'Livrées',
      value: deliveries.filter(
        (d) => d.statut === 'LIVREE'
      ).length,
    },
  ], [deliveries]);

  // Filtrage et Recherche
  const filtered = useMemo(() => {
    return deliveries.filter((d) => {
      const matchesFilter =
        activeFilter === 'Toutes' ||
        d.statut === activeFilter;

      const q = search.trim().toLowerCase();

      const matchesSearch =
        q === '' ||
        String(d.id).toLowerCase().includes(q) ||
        String(d.cmd || '').toLowerCase().includes(q) ||
        String(d.client || '').toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [deliveries, search, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageDeliveries = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const inTransit = deliveries
    .filter((d) => d.statut === 'EN_LIVRAISON')
    .slice(0, 4);

  const selectedDelivery = deliveries.find((d) => d.id === selectedId) || null;

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleDownloadFromTable = (delivery) => {
    downloadDeliveryNote(delivery);
    setToast(`Bon de livraison ${delivery.cmd} téléchargé`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="liv-four-layout">
      {/* Toast notification */}
      {toast && (
        <div className="liv-four-toast">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* Sidebar */}
      <aside className="liv-four-sidebar">
        <div className="acc-sidebar-logo">
          <Logo size={100} className="mb-6" logo-white />
        </div>

        <p className="liv-four-sidebar-section">
          <Building2 size={13} />
          FOURNISSEUR
        </p>

        <nav className="liv-four-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to || '#'}
                state={location.state}
                className={`liv-four-nav-item ${item.active ? 'liv-four-nav-item-active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/" className="liv-four-logout">
          <LogOut size={18} />
          Se déconnecter
        </Link>
      </aside>

      {/* Main content */}
      <main className="liv-four-main">
        <header className="liv-four-topbar">
          <div>
            <h1 className="liv-four-greeting">Livraisons</h1>
            <p className="liv-four-greeting-sub">Suivez et gérez les livraisons de vos commandes.</p>
          </div>

          <div className="liv-four-topbar-actions">
            <button
              type="button"
              className="liv-four-icon-button"
              onClick={() => navigate('/notifications-fournisseur')}
            >
              <Bell size={18} />
              <span className="liv-four-badge">3</span>
            </button>
            <div className="liv-four-user-chip">
              <div className="liv-four-user-avatar">MB</div>
              <div className="liv-four-user-info">
                <span className="liv-four-user-name">Marwa Boutabi</span>
                <span className="liv-four-user-role">Fournisseur</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* Stat cards */}
        <section className="liv-four-stats-row">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div className="liv-four-stat-card" key={s.key}>
                <div className={`liv-four-stat-icon liv-four-stat-icon-${s.tone}`}>
                  <Icon size={18} />
                </div>
                <div className="liv-four-stat-label">{s.label}</div>
                <p className="liv-four-stat-value">{s.value}</p>
              </div>
            );
          })}
        </section>

        {/* Action bar */}
        <section className="liv-four-action-bar">
          <div className="liv-four-action-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher une livraison..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="liv-four-filter-chips">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`liv-four-filter-chip ${
                  activeFilter === filter ? 'liv-four-filter-chip-active' : ''
                }`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter === 'Toutes' ? 'Toutes' : STATUS_LABELS[filter]}
              </button>
            ))}
          </div>

          <button type="button" className="liv-four-btn liv-four-btn-outline">
            <FileDown size={15} />
            Exporter
          </button>
        </section>

        {/* Table */}
        <section className="liv-four-panel liv-four-table-panel">
          <div className="liv-four-panel-header">
            <h3>Liste des livraisons</h3>
          </div>

          <div className="liv-four-table-wrapper">
            <table className="liv-four-table">
              <thead>
                <tr>
                  <th>N° Livraison</th>
                  <th>Commande</th>
                  <th>Commerçant</th>
                  <th>Transporteur</th>
                  <th>Date d&apos;expédition</th>
                  <th>Date estimée</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      Chargement des livraisons...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}>
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && pageDeliveries.map((d) => (
                  <tr key={d.id}>
                    <td className="liv-four-ref">{d.id}</td>
                    <td>{d.cmd}</td>
                    <td className="liv-four-client">{d.client}</td>
                    <td>{d.transporteur}</td>
                    <td>{d.expedition}</td>
                    <td>{d.prevue}</td>
                    <td>
                      <span className={`liv-four-badge-pill liv-four-badge-pill-${STATUS_TONE[d.statut]}`}>
                        {STATUS_LABELS[d.statut] || d.statut}
                      </span>
                    </td>
                    <td>
                      <div className="liv-four-row-actions">
                        <button
                          type="button"
                          className="liv-four-row-action-btn"
                          title="Modifier le statut"
                          onClick={() => setSelectedId(d.id)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="liv-four-row-action-btn"
                          title="Télécharger le bon de livraison"
                          onClick={() => handleDownloadFromTable(d)}
                        >
                          <FileDown size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && !error && pageDeliveries.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af' }}>
                      Aucune livraison ne correspond à votre recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="liv-four-pagination">
            <span className="liv-four-pagination-info">
              Page {currentPage} sur {totalPages} · {filtered.length} livraison(s)
            </span>
            <div className="liv-four-pagination-controls">
              <button
                type="button"
                className="liv-four-page-btn"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`liv-four-page-btn ${currentPage === n ? 'liv-four-page-btn-active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className="liv-four-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* Simulated tracking map */}
        <section className="liv-four-panel liv-four-map-panel">
          <div className="liv-four-panel-header">
            <h3>Suivi des livraisons</h3>
          </div>
          <div className="liv-four-map">
            {inTransit.map((d, i) => {
              const positions = [
                { top: '30%', left: '22%' },
                { top: '55%', left: '48%' },
                { top: '38%', left: '70%' },
                { top: '68%', left: '82%' },
              ];
              const pos = positions[i] || positions[0];
              return (
                <div className="liv-four-map-marker" style={pos} key={d.id}>
                  <span className="liv-four-map-marker-label">{d.cmd}</span>
                  <span className="liv-four-map-marker-icon">
                    <MapPin size={16} />
                  </span>
                </div>
              );
            })}
            <span className="liv-four-map-note">Carte simulée — intégration cartographique à venir</span>
          </div>
        </section>
      </main>

      <DeliveryDetailsModal
        delivery={selectedDelivery}
        onClose={() => setSelectedId(null)}
        onChangeStatus={handleChangeStatus}
        onUpdateInfo={handleUpdateDeliveryInfo}
      />
    </div>
  );
}