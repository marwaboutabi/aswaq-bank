import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../components/Logo/Logo';
import './LegalPage.css';

const ANNEX_CONTENT = {
  personnel: {
    label: 'Compte Personnel',
    text: `Le Compte Personnel est réservé à un usage strictement individuel et non professionnel :
    gestion de finances personnelles, paiements courants et épargne. Il ne peut être utilisé
    pour l'exercice d'une activité commerciale ou pour la réception répétée de paiements de
    tiers à titre professionnel.`,
  },
  commercant: {
    label: 'Compte Commerçant',
    text: `Le Compte Commerçant est destiné aux personnes physiques ou entreprises individuelles
    exerçant une activité commerciale déclarée. Son titulaire s'engage à fournir, en sus des
    informations d'identification standard, les justificatifs relatifs à son activité
    (registre de commerce, numéro d'identification fiscale, le cas échéant). Les plafonds de
    transaction applicables à ce type de compte peuvent différer de ceux du Compte Personnel,
    conformément aux limites réglementaires fixées pour les établissements de paiement.`,
  },
  fournisseur: {
    label: 'Compte Fournisseur',
    text: `Le Compte Fournisseur est destiné aux personnes physiques ou entreprises individuelles
    opérant en tant que fournisseurs de biens ou services auprès de commerçants. Son titulaire
    s'engage à utiliser le compte exclusivement dans le cadre de ses relations commerciales
    avec les utilisateurs de la plateforme, dans le respect des mêmes exigences de connaissance
    client (KYC) et de conformité que les autres types de comptes.`,
  },
};

export default function ConditionsGenerales() {
  const location = useLocation();
  const offreId = location.state?.offre;
  const annex = ANNEX_CONTENT[offreId];

  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
        <Logo  size={100} className="mb-6" />
          <h1 className="legal-title">Conditions Générales d'Utilisation</h1>
          <p className="legal-updated">Dernière mise à jour : Juillet 2026</p>
        </div>

        <div className="legal-body">
          <section className="legal-section">
            <h2>1. Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (« CGU ») régissent l'accès et l'utilisation
              des services proposés par ASWAQ BANK, établissement de paiement agréé conformément aux
              dispositions de la loi n°103-12 relative aux établissements de crédit et organismes assimilés.
              L'ouverture d'un compte et l'utilisation de l'application impliquent l'acceptation pleine et
              entière des présentes CGU.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Statut réglementaire</h2>
            <p>
              ASWAQ BANK exerce son activité en qualité d'établissement de paiement, sous le contrôle et la
              supervision de Bank Al-Maghrib, conformément à la loi n°103-12 relative aux établissements de
              crédit et organismes assimilés. Les services proposés sont limités aux activités couvertes par
              l'agrément délivré par Bank Al-Maghrib, notamment la gestion de comptes de paiement, l'exécution
              d'opérations de paiement et la mise à disposition de moyens de paiement.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Ouverture de compte et conditions d'éligibilité</h2>
            <p>L'ouverture d'un compte ASWAQ BANK est soumise aux conditions cumulatives suivantes :</p>
            <ul>
              <li>Être une personne physique majeure, résidente au Maroc ;</li>
              <li>Fournir une pièce d'identité en cours de validité (CIN ou passeport) ;</li>
              <li>Compléter avec exactitude les informations d'identification et de connaissance client (KYC) demandées ;</li>
              <li>Accepter les présentes CGU ainsi que la Politique de confidentialité.</li>
            </ul>
            <p>
              ASWAQ BANK se réserve le droit de refuser l'ouverture d'un compte, de suspendre ou de clôturer
              un compte existant en cas de doute sur l'exactitude des informations fournies, de suspicion de
              fraude, ou de non-respect des obligations réglementaires applicables en matière de lutte contre
              le blanchiment de capitaux et le financement du terrorisme (LCB-FT).
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Vérification d'identité et connaissance client (KYC)</h2>
            <p>
              Conformément aux exigences réglementaires en matière de connaissance client, l'utilisateur
              s'engage à fournir des informations exactes et à jour concernant son identité, son adresse,
              sa situation professionnelle, la source de ses revenus ainsi que l'objet de l'utilisation du
              compte. Ces informations peuvent être vérifiées par des moyens biométriques (comparaison
              faciale, vérification documentaire) auxquels l'utilisateur consent expressément lors de son
              inscription.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Services de paiement</h2>
            <p>
              Le compte de paiement permet à l'utilisateur d'effectuer des opérations de dépôt, de retrait,
              de virement et de paiement, dans la limite des plafonds réglementaires applicables aux comptes
              de paiement et des plafonds spécifiques fixés par ASWAQ BANK. Ces plafonds sont communiqués à
              l'utilisateur au moment de l'ouverture du compte et peuvent évoluer selon le niveau de
              vérification atteint par l'utilisateur.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Obligations de l'utilisateur</h2>
            <ul>
              <li>Préserver la confidentialité de ses identifiants de connexion et codes de sécurité ;</li>
              <li>Informer sans délai ASWAQ BANK en cas de perte, vol ou usage frauduleux suspecté de son compte ;</li>
              <li>Utiliser le compte à des fins strictement personnelles et licites ;</li>
              <li>Ne pas céder, prêter ou transférer l'accès à son compte à un tiers.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Responsabilité</h2>
            <p>
              ASWAQ BANK met en œuvre les moyens techniques et organisationnels raisonnables pour assurer la
              sécurité et la disponibilité du service. Sa responsabilité ne saurait être engagée en cas
              d'interruption de service liée à un cas de force majeure, à une intervention d'un tiers non
              autorisé résultant d'une négligence de l'utilisateur, ou à un dysfonctionnement des réseaux de
              télécommunication indépendant de sa volonté.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Tarification</h2>
            <p>
              Les frais applicables aux opérations et services proposés sont détaillés dans la grille
              tarifaire disponible dans l'application et communiquée à l'utilisateur avant toute souscription.
              Toute modification tarifaire fait l'objet d'une notification préalable conformément à la
              réglementation en vigueur.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Suspension et clôture de compte</h2>
            <p>
              ASWAQ BANK peut suspendre ou clôturer un compte en cas de manquement aux présentes CGU, de
              suspicion d'activité frauduleuse, sur demande des autorités compétentes, ou à la demande de
              l'utilisateur lui-même. En cas de clôture, le solde disponible est restitué à l'utilisateur
              selon les modalités prévues par la réglementation applicable.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Réclamations et médiation</h2>
            <p>
              Toute réclamation relative aux services peut être adressée au service client d'ASWAQ BANK.
              À défaut de résolution amiable, l'utilisateur peut, conformément à la réglementation
              applicable, saisir les instances de médiation bancaire compétentes.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Droit applicable et juridiction compétente</h2>
            <p>
              Les présentes CGU sont soumises au droit marocain. Tout litige relatif à leur interprétation
              ou à leur exécution relève de la compétence exclusive des juridictions marocaines.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Modification des CGU</h2>
            <p>
              ASWAQ BANK se réserve le droit de modifier les présentes CGU à tout moment, sous réserve
              d'en informer l'utilisateur préalablement par tout moyen approprié. La poursuite de
              l'utilisation du service après notification vaut acceptation des CGU modifiées.
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Dispositions spécifiques à votre type de compte</h2>

            {annex ? (
              <>
                <div className="legal-annex-badge">{annex.label}</div>
                <div className="legal-annex-block">
                  <p>{annex.text}</p>
                </div>
              </>
            ) : (
              <p>
                Les dispositions spécifiques applicables dépendent du type de compte sélectionné
                lors de votre inscription (Compte Personnel, Compte Commerçant ou Compte
                Fournisseur).
              </p>
            )}

            <p>
              En cas de changement de l'usage réel du compte non conforme au type sélectionné lors
              de l'ouverture, ASWAQ BANK se réserve le droit de demander une mise à jour des
              informations fournies ou de procéder à une requalification du compte.
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