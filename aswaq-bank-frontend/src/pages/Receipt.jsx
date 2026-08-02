// src/pages/SendMoney/Receipt.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Share2, ArrowLeft, Wallet } from 'lucide-react';
import StepsSidebar from '../../components/SendMoney/StepsSidebar';
import { useSendMoney } from '../../context/SendMoneyContext';
import { formatMAD, maskRib, computeFees } from '../../data/mockSendMoney';
import './SendMoney.css';

export default function Receipt() {
  const navigate = useNavigate();
  const { data } = useSendMoney();
  const { beneficiary, amount, transactionRef, executedAt, debitAccount, motif, motifLibre, transferType } = data;

  useEffect(() => {
    if (!transactionRef || !executedAt) {
      navigate('/envoyer-argent');
    }
  }, [transactionRef, executedAt, navigate]);

  if (!transactionRef || !executedAt) return null;

  const executedDate = new Date(executedAt);
  const fees = computeFees(transferType, amount);

  const handleShare = async () => {
    const text = `Reçu Aswaq Bank — ${transactionRef} — ${formatMAD(amount)} envoyés à ${beneficiary.name}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Reçu de virement', text }); } catch { /* annulé */ }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="sm-page">
      <div className="sm-layout">
        <StepsSidebar currentIndex={5} illustration={<Wallet size={64} />} />

        <div className="sm-container">
          <button type="button" className="sm-back-btn" onClick={() => navigate('/envoyer-argent/confirmation')}>
            <ArrowLeft size={16} /> Retour
          </button>

          <div className="sm-header">
            <div className="sm-header-text">
              <h1 className="sm-title">Reçu de virement</h1>
              <p className="sm-subtitle">Aswaq Bank</p>
            </div>
          </div>

          <div className="sm-receipt-card">
            <div className="sm-info-row">
              <span className="sm-info-row-label">Référence</span>
              <span className="sm-info-row-value">{transactionRef}</span>
            </div>
            <div className="sm-info-row">
              <span className="sm-info-row-label">Date et heure</span>
              <span className="sm-info-row-value">
                {executedDate.toLocaleDateString('fr-MA')} à {executedDate.toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <hr className="sm-receipt-divider" />

            <div className="sm-info-row">
              <span className="sm-info-row-label">Compte débiteur</span>
              <span className="sm-info-row-value">{maskRib(debitAccount.rib)}</span>
            </div>
            <div className="sm-info-row">
              <span className="sm-info-row-label">Bénéficiaire</span>
              <span className="sm-info-row-value">{beneficiary.name}</span>
            </div>
            <div className="sm-info-row">
              <span className="sm-info-row-label">Banque du bénéficiaire</span>
              <span className="sm-info-row-value">{beneficiary.bank}</span>
            </div>
            <div className="sm-info-row">
              <span className="sm-info-row-label">RIB bénéficiaire</span>
              <span className="sm-info-row-value">{maskRib(beneficiary.rib)}</span>
            </div>

            <hr className="sm-receipt-divider" />

            <div className="sm-info-row">
              <span className="sm-info-row-label">Montant</span>
              <span className="sm-info-row-value">{formatMAD(amount)}</span>
            </div>
            <div className="sm-info-row">
              <span className="sm-info-row-label">Frais</span>
              <span className="sm-info-row-value">{fees === 0 ? 'Gratuit' : formatMAD(fees)}</span>
            </div>
            <div className="sm-info-row">
              <span className="sm-info-row-label">Motif</span>
              <span className="sm-info-row-value">{motif === 'Autre' ? motifLibre : motif}</span>
            </div>
            <div className="sm-info-row">
              <span className="sm-info-row-label">Statut</span>
              <span className="sm-info-row-value">Exécuté</span>
            </div>

            <p className="sm-receipt-legal">
              Ce document tient lieu de justificatif de virement conforme aux dispositions du code de
              commerce marocain relatives au virement (articles 519 à 521). Conforme aux exigences de
              Bank Al-Maghrib.
            </p>
          </div>

          <div className="sm-actions">
            <button type="button" className="sm-button sm-button-secondary" onClick={() => window.print()}>
              <Download size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Télécharger en PDF
            </button>
            <button type="button" className="sm-button sm-button-primary" onClick={handleShare}>
              <Share2 size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Partager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
