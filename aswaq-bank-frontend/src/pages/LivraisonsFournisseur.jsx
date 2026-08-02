import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Package, ShoppingCart, CreditCard, Truck, Layers, User, Settings,
  HelpCircle, LogOut, Search, Bell, ChevronDown, Building2, MapPinned,
  CheckCircle, Pencil, FileDown, X, MapPin, ClipboardCheck, PackageCheck,
  CheckCircle2, Bot,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';
import './LivraisonsFournisseur.css';

const STATUS_FLOW = ['En préparation', 'Expédiée', 'En cours de livraison', 'Livrée'];

const STATUS_TONE = {
  'En préparation': 'orange',
  'Expédiée': 'blue',
  'En cours de livraison': 'purple',
  'Livrée': 'green',
};

const STATS = [
  { key: 'total', icon: Truck, tone: 'blue', label: 'Livraisons totales', value: '145' },
  { key: 'prep', icon: Package, tone: 'orange', label: 'En préparation', value: '12' },
  { key: 'cours', icon: MapPinned, tone: 'purple', label: 'En cours de livraison', value: '18' },
  { key: 'livrees', icon: CheckCircle, tone: 'green', label: 'Livrées', value: '115' },
];

const INITIAL_DELIVERIES = [
  {
    id: 'LIV-1001', cmd: 'CMD-1025', client: 'Épicerie Atlas', phone: '06 12 34 56 78',
    adresse: '12 Rue des Oliviers, Maârif, Casablanca', transporteur: 'Aswaq Express',
    expedition: '28/07/2026', prevue: '30/07/2026', statut: 'En cours de livraison',
    tracking: 'AEX-88214-MA', vehicule: 'Fourgon Renault Master', chauffeur: 'Hamid Aoulad',
    produits: [
      { nom: 'Huile d\u2019olive 1L', qte: 20, poids: '20 kg', statut: 'Chargé' },
      { nom: 'Sucre blanc 1kg', qte: 30, poids: '30 kg', statut: 'Chargé' },
    ],
  },
  {
    id: 'LIV-1002', cmd: 'CMD-1024', client: 'Market Plus', phone: '06 22 45 67 89',
    adresse: '45 Avenue Hassan II, Agdal, Rabat', transporteur: 'DHL',
    expedition: '27/07/2026', prevue: '29/07/2026', statut: 'Livrée',
    tracking: 'DHL-40217-MA', vehicule: 'Camionnette Iveco', chauffeur: 'Youssef Amrani',
    produits: [
      { nom: 'Café moulu 250g', qte: 40, poids: '10 kg', statut: 'Livré' },
    ],
  },
  {
    id: 'LIV-1003', cmd: 'CMD-1023', client: 'Bio Shop', phone: '06 33 56 78 90',
    adresse: '3 Rue Ibn Batouta, Ville Nouvelle, Fès', transporteur: 'Aswaq Express',
    expedition: '27/07/2026', prevue: '28/07/2026', statut: 'Expédiée',
    tracking: 'AEX-88190-MA', vehicule: 'Fourgon Renault Master', chauffeur: 'Sanae Idrissi',
    produits: [
      { nom: 'Thé vert 100g', qte: 25, poids: '2,5 kg', statut: 'Chargé' },
      { nom: 'Farine 1kg', qte: 15, poids: '15 kg', statut: 'Chargé' },
    ],
  },
  {
    id: 'LIV-1004', cmd: 'CMD-1022', client: 'Alimentation Nour', phone: '06 44 67 89 01',
    adresse: '78 Boulevard Zerktouni, Guéliz, Marrakech', transporteur: 'CTM Fret',
    expedition: '26/07/2026', prevue: '28/07/2026', statut: 'En préparation',
    tracking: '—', vehicule: '—', chauffeur: '—',
    produits: [
      { nom: 'Riz basmati 1kg', qte: 50, poids: '50 kg', statut: 'En préparation' },
    ],
  },
  {
    id: 'LIV-1005', cmd: 'CMD-1021', client: 'Super Marché Al Amal', phone: '06 55 78 90 12',
    adresse: '9 Rue de la Liberté, Tanger', transporteur: 'Aswaq Express',
    expedition: '25/07/2026', prevue: '27/07/2026', statut: 'Livrée',
    tracking: 'AEX-88056-MA', vehicule: 'Fourgon Renault Master', chauffeur: 'Karim Benjelloun',
    produits: [
      { nom: 'Huile d\u2019olive 1L', qte: 10, poids: '10 kg', statut: 'Livré' },
    ],
  },
  {
    id: 'LIV-1006', cmd: 'CMD-1020', client: 'Bio Shop', phone: '06 66 89 01 23',
    adresse: '21 Avenue Mohammed V, Agadir', transporteur: 'DHL',
    expedition: '25/07/2026', prevue: '27/07/2026', statut: 'En cours de livraison',
    tracking: 'DHL-40188-MA', vehicule: 'Camionnette Iveco', chauffeur: 'Nabil Ouazzani',
    produits: [
      { nom: 'Sucre blanc 1kg', qte: 12, poids: '12 kg', statut: 'Chargé' },
    ],
  },
  {
    id: 'LIV-1007', cmd: 'CMD-1019', client: 'Épicerie Chaabi', phone: '06 77 90 12 34',
    adresse: '5 Rue Allal Ben Abdellah, Casablanca', transporteur: 'CTM Fret',
    expedition: '24/07/2026', prevue: '26/07/2026', statut: 'Expédiée',
    tracking: 'CTM-77021-MA', vehicule: 'Camion Ford Transit', chauffeur: 'Anas Kabbaj',
    produits: [
      { nom: 'Farine 1kg', qte: 40, poids: '40 kg', statut: 'Chargé' },
      { nom: 'Thé vert 100g', qte: 18, poids: '1,8 kg', statut: 'Chargé' },
    ],
  },
  {
    id: 'LIV-1008', cmd: 'CMD-1018', client: 'Marjane Express', phone: '06 88 01 23 45',
    adresse: '60 Route de Kénitra, Salé', transporteur: 'Aswaq Express',
    expedition: '24/07/2026', prevue: '26/07/2026', statut: 'En préparation',
    tracking: '—', vehicule: '—', chauffeur: '—',
    produits: [
      { nom: 'Riz basmati 1kg', qte: 60, poids: '60 kg', statut: 'En préparation' },
    ],
  },
  {
    id: 'LIV-1009', cmd: 'CMD-1017', client: 'Alimentation Salam', phone: '06 99 12 34 56',
    adresse: '14 Rue Ferhat Hached, Meknès', transporteur: 'DHL',
    expedition: '23/07/2026', prevue: '25/07/2026', statut: 'Livrée',
    tracking: 'DHL-40122-MA', vehicule: 'Camionnette Iveco', chauffeur: 'Othmane Fassi',
    produits: [
      { nom: 'Café moulu 250g', qte: 20, poids: '5 kg', statut: 'Livré' },
    ],
  },
  {
    id: 'LIV-1010', cmd: 'CMD-1016', client: 'Épicerie Al Baraka', phone: '06 10 23 45 67',
    adresse: '30 Boulevard Derfoufi, Oujda', transporteur: 'CTM Fret',
    expedition: '23/07/2026', prevue: '25/07/2026', statut: 'En cours de livraison',
    tracking: 'CTM-76988-MA', vehicule: 'Camion Ford Transit', chauffeur: 'Mehdi Rachidi',
    produits: [
      { nom: 'Huile d\u2019olive 1L', qte: 15, poids: '15 kg', statut: 'Chargé' },
    ],
  },
];

const FILTERS = ['Toutes', 'En préparation', 'Expédiée', 'En cours de livraison', 'Livrée'];
const PAGE_SIZE = 10;

const TIMELINE_STEPS = [
  { label: 'Commande préparée', status: 'En préparation', icon: ClipboardCheck },
  { label: 'Colis expédié', status: 'Expédiée', icon: Package },
  { label: 'En cours de livraison', status: 'En cours de livraison', icon: Truck },
  { label: 'Livraison effectuée', status: 'Livrée', icon: PackageCheck },
];

// ====== GÉNÉRATION DU BON DE LIVRAISON ======
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
      <td><span class="status status-${STATUS_TONE[delivery.statut] === 'green' ? 'green' : STATUS_TONE[delivery.statut] === 'orange' ? 'orange' : 'blue'}">${p.statut}</span></td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Bon de livraison ${delivery.id}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1d4fd8; padding-bottom: 20px; margin-bottom: 30px; }
  .header-left h1 { color: #0b1f4b; margin: 0 0 5px; font-size: 26px; }
  .header-left p { color: #6b7280; margin: 0; font-size: 13px; }
  .header-right { text-align: right; }
  .header-right .ref { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
  .header-right .number { font-size: 22px; font-weight: 700; color: #1d4fd8; margin: 4px 0; }
  .header-right .date { font-size: 13px; color: #6b7280; }
  .section { margin-bottom: 25px; }
  .section h3 { color: #0b1f4b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; }
  .info-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 14px; border-bottom: 1px dotted #f1f5f9; }
  .info-row .label { color: #6b7280; }
  .info-row .value { font-weight: 600; color: #0b1f4b; }
  table.products { width: 100%; border-collapse: collapse; margin-top: 10px; }
  table.products th { background: #f8fafc; color: #0b1f4b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; padding: 10px 12px; border-bottom: 2px solid #e5e7eb; }
  table.products td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
  table.products tr:last-child td { border-bottom: none; }
  .status { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
  .status-green { background: #dcfce7; color: #16a34a; }
  .status-orange { background: #fef3c7; color: #b45309; }
  .status-blue { background: #dbeafe; color: #1d4fd8; }
  .status-purple { background: #ede9fe; color: #7c3aed; }
  .totals { background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 15px; }
  .totals .info-row { border-bottom: none; }
  .totals .info-row.final { border-top: 2px solid #cbd5e1; padding-top: 10px; margin-top: 6px; font-weight: 700; font-size: 15px; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer .signatures { display: flex; gap: 60px; }
  .signature-box { text-align: center; }
  .signature-box .line { width: 140px; height: 1px; background: #333; margin: 40px 0 6px; }
  .signature-box .label { font-size: 11px; color: #6b7280; text-transform: uppercase; }
  .footer .note { font-size: 11px; color: #9ca3af; max-width: 280px; text-align: right; }
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
      <div class="ref">N° Livraison</div>
      <div class="number">${delivery.id}</div>
      <div class="date">Commande : ${delivery.cmd}</div>
    </div>
  </div>

  <div class="section">
    <h3>Informations de la livraison</h3>
    <div class="info-grid">
      <div class="info-row"><span class="label">Statut</span><span class="value"><span class="status status-${STATUS_TONE[delivery.statut] === 'green' ? 'green' : STATUS_TONE[delivery.statut] === 'orange' ? 'orange' : STATUS_TONE[delivery.statut] === 'blue' ? 'blue' : 'purple'}">${delivery.statut}</span></span></div>
      <div class="info-row"><span class="label">Date d'expédition</span><span class="value">${delivery.expedition}</span></div>
      <div class="info-row"><span class="label">Livraison prévue</span><span class="value">${delivery.prevue}</span></div>
      <div class="info-row"><span class="label">N° suivi</span><span class="value">${delivery.tracking}</span></div>
    </div>
  </div>

  <div class="section">
    <h3>Commerçant destinataire</h3>
    <div class="info-grid">
      <div class="info-row"><span class="label">Nom</span><span class="value">${delivery.client}</span></div>
      <div class="info-row"><span class="label">Téléphone</span><span class="value">${delivery.phone}</span></div>
      <div class="info-row" style="grid-column: 1 / -1;"><span class="label">Adresse</span><span class="value">${delivery.adresse}</span></div>
    </div>
  </div>

  <div class="section">
    <h3>Transport</h3>
    <div class="info-grid">
      <div class="info-row"><span class="label">Transporteur</span><span class="value">${delivery.transporteur}</span></div>
      <div class="info-row"><span class="label">Véhicule</span><span class="value">${delivery.vehicule}</span></div>
      <div class="info-row"><span class="label">Chauffeur</span><span class="value">${delivery.chauffeur}</span></div>
      <div class="info-row"><span class="label">N° suivi</span><span class="value">${delivery.tracking}</span></div>
    </div>
  </div>

  <div class="section">
    <h3>Produits expédiés</h3>
    <table class="products">
      <thead>
        <tr>
          <th>Produit</th>
          <th>Quantité</th>
          <th>Poids</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        ${produitsRows}
      </tbody>
    </table>
    <div class="totals">
      <div class="info-row"><span class="label">Nombre d'articles</span><span class="value">${delivery.produits.reduce((s, p) => s + p.qte, 0)} unités</span></div>
      <div class="info-row final"><span class="label">Poids total</span><span class="value">${totalPoids.toFixed(1)} kg</span></div>
    </div>
  </div>

  <div class="footer">
    <div class="signatures">
      <div class="signature-box">
        <div class="line"></div>
        <div class="label">Signature transporteur</div>
      </div>
      <div class="signature-box">
        <div class="line"></div>
        <div class="label">Réception commerçant</div>
      </div>
    </div>
    <div class="note">
      Document généré automatiquement par la plateforme Aswaq Bank.<br>
      Le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
    </div>
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
  link.download = `Bon_livraison_${delivery.id}_${delivery.client.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function DeliveryDetailsModal({ delivery, onClose, onChangeStatus }) {
  if (!delivery) return null;

  const currentIndex = STATUS_FLOW.indexOf(delivery.statut);
  const nextStatus = STATUS_FLOW[currentIndex + 1];

  return (
    <div className="liv-four-modal-overlay" onClick={onClose}>
      <div className="liv-four-modal" onClick={(e) => e.stopPropagation()}>
        <div className="liv-four-modal-header">
          <h3>Détails de la livraison {delivery.id}</h3>
          <button type="button" className="liv-four-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="liv-four-modal-body">
          {/* Timeline */}
          <div>
            <p className="liv-four-modal-section-title">Suivi de la livraison</p>
            <div className="liv-four-steps">
              {TIMELINE_STEPS.map((step, i) => {
                const Icon = step.icon;
                const stepIndex = STATUS_FLOW.indexOf(step.status);
                const isDone = stepIndex < currentIndex;
                const isCurrent = stepIndex === currentIndex;
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
                <span className="liv-four-modal-field-label">Numéro de livraison</span>
                <span className="liv-four-modal-field-value">{delivery.id}</span>
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Numéro de commande</span>
                <span className="liv-four-modal-field-value">{delivery.cmd}</span>
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Statut</span>
                <span className={`liv-four-badge-pill liv-four-badge-pill-${STATUS_TONE[delivery.statut]}`}>
                  {delivery.statut}
                </span>
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Date d&apos;expédition</span>
                <span className="liv-four-modal-field-value">{delivery.expedition}</span>
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Date estimée de livraison</span>
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
                  <tr key={p.nom}>
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
                <span className="liv-four-modal-field-value">{delivery.transporteur}</span>
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Numéro de suivi</span>
                <span className="liv-four-modal-field-value">{delivery.tracking}</span>
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Véhicule</span>
                <span className="liv-four-modal-field-value">{delivery.vehicule}</span>
              </div>
              <div className="liv-four-modal-field">
                <span className="liv-four-modal-field-label">Chauffeur</span>
                <span className="liv-four-modal-field-value">{delivery.chauffeur}</span>
              </div>
            </div>
          </div>

          {/* Workflow */}
          <div>
            <p className="liv-four-modal-section-title">Mettre à jour le statut</p>
            <div className="liv-four-workflow">
              {STATUS_FLOW.map((status, i) => (
                <button
                  key={status}
                  type="button"
                  className={`liv-four-workflow-btn ${delivery.statut === status ? 'liv-four-workflow-btn-active' : ''}`}
                  disabled={i > currentIndex + 1}
                  onClick={() => onChangeStatus(delivery.id, status)}
                >
                  {status}
                </button>
              ))}
            </div>
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
              Passer à « {nextStatus} »
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LivraisonsFournisseur() {
  const location = useLocation();
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Toutes');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);

  const NAV_ITEMS = [
    { icon: Home, label: 'Accueil', to: '/accueil-fournisseur' },
    { icon: Package, label: 'Produits', to: '/produits-fournisseur' },
    { icon: ShoppingCart, label: 'Commandes reçues', to: '/commandes-fournisseur' },
    { icon: CreditCard, label: 'Paiements', to: '/paiements-fournisseur' },
    { icon: Truck, label: 'Livraisons', to: '/livraisons-fournisseur' , active: true},
    { icon: Layers, label: 'Catalogue', to: '/catalogue-fournisseur' },
   { icon: Bell, label: 'Notifications', to: '/notifications-fournisseur' },
    { icon: Bot, label: 'Assistant IA', to: '/assistant-fournisseur' },
    { icon: User, label: 'Profil & Paramètres', to: '/profil-fournisseur' },
  ];

  const handleChangeStatus = (id, statut) => {
    setDeliveries((prev) => prev.map((d) => (d.id === id ? { ...d, statut } : d)));
  };

  const filtered = useMemo(() => {
    return deliveries.filter((d) => {
      const matchesFilter = activeFilter === 'Toutes' || d.statut === activeFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        d.id.toLowerCase().includes(q) ||
        d.cmd.toLowerCase().includes(q) ||
        d.client.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [deliveries, search, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageDeliveries = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const inTransit = deliveries.filter((d) => d.statut === 'En cours de livraison').slice(0, 4);
  const selectedDelivery = deliveries.find((d) => d.id === selectedId) || null;

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleDownloadFromTable = (delivery) => {
    downloadDeliveryNote(delivery);
    setToast(`Bon de livraison ${delivery.id} téléchargé`);
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
            <div className="liv-four-search">
              <Search size={16} />
              <input type="text" placeholder="Rechercher..." />
            </div>
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
          {STATS.map((s) => {
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
                className={`liv-four-filter-chip ${activeFilter === filter ? 'liv-four-filter-chip-active' : ''}`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
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
                {pageDeliveries.map((d) => (
                  <tr key={d.id}>
                    <td className="liv-four-ref">{d.id}</td>
                    <td>{d.cmd}</td>
                    <td className="liv-four-client">{d.client}</td>
                    <td>{d.transporteur}</td>
                    <td>{d.expedition}</td>
                    <td>{d.prevue}</td>
                    <td>
                      <span className={`liv-four-badge-pill liv-four-badge-pill-${STATUS_TONE[d.statut]}`}>
                        {d.statut}
                      </span>
                    </td>
                    <td>
                      <div className="liv-four-row-actions">
                        {/* ✅ Bouton œil supprimé */}
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
                {pageDeliveries.length === 0 && (
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
                  <span className="liv-four-map-marker-label">{d.id}</span>
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
      />
    </div>
  );
}