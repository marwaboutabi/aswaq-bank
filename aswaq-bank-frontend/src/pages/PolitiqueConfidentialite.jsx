import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../components/Logo/Logo';
import './LegalPage.css';

const OFFER_LABELS = {
  personnel: 'Compte Personnel',
  commercant: 'Compte Commerçant',
  fournisseur: 'Compte Fournisseur',
};

const OFFER_DATA_TEXT = {
  personnel: `En tant que titulaire d'un Compte Personnel, seules les données d'identification,
  de contact et de connaissance client (KYC) standard sont collectées, sans donnée
  professionnelle ou commerciale complémentaire.`,
  commercant: `En tant que titulaire d'un Compte Commerçant, des données complémentaires liées à
  votre activité sont également collectées : numéro de registre de commerce, identifiant fiscal
  et informations relatives à votre activité commerciale, aux fins de conformité réglementaire
  et de connaissance client renforcée.`,
  fournisseur: `En tant que titulaire d'un Compte Fournisseur, des données complémentaires liées à
  votre activité de fournisseur sont également collectées : informations d'activité, catalogue de
  produits ou services proposés, et données relatives à vos relations commerciales avec les
  commerçants utilisateurs de la plateforme, aux fins de conformité réglementaire et de
  connaissance client renforcée.`,
};

export default function PolitiqueConfidentialite() {
  const location = useLocation();
  const offreId = location.state?.offre;
  const offerLabel = OFFER_LABELS[offreId];
  const offerDataText = OFFER_DATA_TEXT[offreId];

  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
        <Logo  size={100} className="mb-6" />
          <h1 className="legal-title">Politique de Confidentialité</h1>
          <p className="legal-updated">Dernière mise à jour : Juillet 2026</p>
        </div>

        <div className="legal-body">
          <section className="legal-section">
            <h2>1. Préambule</h2>
            <p>
              ASWAQ BANK accorde une importance particulière à la protection des données personnelles de
              ses utilisateurs. La présente Politique de confidentialité décrit les conditions dans
              lesquelles vos données personnelles sont collectées, traitées et protégées, conformément à la
              loi n°09-08 relative à la protection des personnes physiques à l'égard du traitement des
              données à caractère personnel et sous le contrôle de la Commission Nationale de contrôle de la
              Protection des Données à caractère personnel (CNDP).
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Responsable du traitement</h2>
            <p>
              ASWAQ BANK, établissement de paiement agréé par Bank Al-Maghrib, est responsable du traitement
              des données personnelles collectées dans le cadre de la fourniture de ses services.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Données collectées</h2>

            {offerLabel && (
              <div className="legal-annex-badge">{offerLabel}</div>
            )}

            <p>Dans le cadre de l'ouverture et de la gestion de votre compte, nous collectons notamment :</p>
            <ul>
              <li><strong>Données d'identification :</strong> nom, prénom, date et lieu de naissance, nationalité, numéro de pièce d'identité ;</li>
              <li><strong>Données de contact :</strong> adresse postale, numéro de téléphone, adresse e-mail ;</li>
              <li><strong>Données biométriques :</strong> photographie du document d'identité et selfie de vérification, aux fins exclusives de vérification d'identité ;</li>
              <li><strong>Données professionnelles et financières :</strong> profession, situation professionnelle, source des revenus, fourchette de revenus (le cas échéant) et objet du compte ;</li>
              <li><strong>Données de transaction :</strong> historique des opérations effectuées sur le compte ;</li>
              <li><strong>Données techniques :</strong> adresse IP, identifiant de l'appareil, journaux de connexion, à des fins de sécurité.</li>
            </ul>

            {offerDataText ? (
              <div className="legal-annex-block">
                <p>{offerDataText}</p>
              </div>
            ) : (
              <p>
                Des données complémentaires peuvent être collectées selon le type de compte choisi
                (Compte Personnel, Compte Commerçant ou Compte Fournisseur).
              </p>
            )}
          </section>

          <section className="legal-section">
            <h2>4. Finalités du traitement</h2>
            <p>Vos données sont traitées pour les finalités suivantes :</p>
            <ul>
              <li>Vérifier votre identité conformément aux obligations de connaissance client (KYC) et de lutte contre le blanchiment de capitaux et le financement du terrorisme (LCB-FT) ;</li>
              <li>Ouvrir, gérer et sécuriser votre compte de paiement ;</li>
              <li>Exécuter les opérations de paiement que vous initiez ;</li>
              <li>Prévenir et détecter les fraudes ;</li>
              <li>Répondre à nos obligations légales et réglementaires, notamment vis-à-vis de Bank Al-Maghrib ;</li>
              <li>Améliorer la qualité de nos services et assurer le support client.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Base légale du traitement</h2>
            <p>
              Le traitement de vos données repose sur l'exécution du contrat de services conclu avec vous,
              sur le respect de nos obligations légales et réglementaires en tant qu'établissement de
              paiement supervisé par Bank Al-Maghrib, ainsi que, pour la vérification biométrique, sur votre
              consentement explicite recueilli lors de votre inscription.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Destinataires des données</h2>
            <p>
              Vos données peuvent être communiquées, dans la stricte limite de leurs missions respectives :
            </p>
            <ul>
              <li>Aux services internes d'ASWAQ BANK en charge de la gestion de votre compte ;</li>
              <li>À Bank Al-Maghrib, dans le cadre de ses missions de supervision et de contrôle ;</li>
              <li>Aux autorités judiciaires ou administratives compétentes, sur réquisition légale ;</li>
              <li>À nos prestataires techniques (hébergement, vérification d'identité), soumis à des
                obligations contractuelles strictes de confidentialité et de sécurité.</li>
            </ul>
            <p>Vos données ne sont ni vendues, ni louées à des tiers à des fins commerciales.</p>
          </section>

          <section className="legal-section">
            <h2>7. Durée de conservation</h2>
            <p>
              Vos données sont conservées pendant toute la durée de la relation contractuelle, puis
              archivées pour la durée requise par les obligations légales applicables aux établissements de
              paiement, notamment en matière de lutte contre le blanchiment de capitaux, avant leur
              suppression ou anonymisation.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Sécurité des données</h2>
            <p>
              ASWAQ BANK met en œuvre des mesures techniques et organisationnelles appropriées (chiffrement
              des données, contrôle d'accès, journalisation des traitements) afin de protéger vos données
              contre tout accès non autorisé, perte, altération ou divulgation.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Vos droits</h2>
            <p>Conformément à la loi n°09-08, vous disposez des droits suivants sur vos données personnelles :</p>
            <ul>
              <li><strong>Droit d'accès :</strong> obtenir la communication des données vous concernant ;</li>
              <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes ;</li>
              <li><strong>Droit d'opposition :</strong> vous opposer, pour motif légitime, à certains traitements ;</li>
              <li><strong>Droit de suppression :</strong> demander la suppression de vos données, dans les limites des obligations légales de conservation applicables aux établissements financiers.</li>
            </ul>
            <p>
              Ces droits peuvent être exercés en nous contactant via les coordonnées indiquées ci-dessous.
              Vous disposez également du droit de saisir la CNDP en cas de litige non résolu.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Transfert de données hors du Maroc</h2>
            <p>
              Dans l'hypothèse où des données seraient amenées à être traitées par des prestataires situés
              hors du Maroc, ASWAQ BANK s'assure que ces transferts s'effectuent dans le respect des
              exigences de la loi n°09-08, notamment via des garanties contractuelles appropriées.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Contact</h2>
            <p>
              Pour toute question relative à la présente Politique de confidentialité ou pour exercer vos
              droits, vous pouvez contacter notre Délégué à la protection des données à l'adresse :
              <strong> confidentialite@aswaqbank.ma</strong>
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Modification de la présente politique</h2>
            <p>
              La présente Politique de confidentialité peut être mise à jour périodiquement afin de refléter
              les évolutions légales, réglementaires ou opérationnelles. Toute modification substantielle
              vous sera notifiée par les moyens appropriés.
            </p>
          </section>
        </div>

        <div className="legal-footer">
          <Link to="/" className="legal-back-link">← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}