import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import {
  NotificationProvider
} from './context/NotificationContext';
import Accueil from './pages/Accueil';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Features from './components/Features';
import Footer from './components/Footer';
import Modal from './components/Modal/Modal';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import IdentityVerification from './pages/IdentityVerification';
import VerifierContact from './pages/VerifierContact';
import ProfessionalInfo from './pages/ProfessionalInfo';
import ConditionsGenerales from './pages/ConditionsGenerales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import AccountSubmitted from './pages/AccountSubmitted';
import ChoixOffre from './pages/ChoixOffre';
import DashboardClient from './pages/DashboardClient';
import MonCompte from './pages/MonCompte';
import TransactionsClient from './pages/TransactionsClient';
import TicketsNumeriquesClient from './pages/TicketsNumeriquesClient';
import Fidelite from './pages/Fidelite';
import Epargne from './pages/Epargne';
import Depenses from './pages/Depenses';
import Notifications from './pages/Notifications';
import Assistant from './pages/Assistant';
import Parametres from './pages/Parametres';
import AcceuilCom from './pages/AcceuilCom';
import ProduitsCom from './pages/ProduitsCom';
import Stock from './pages/Stock';
import PaiementsCom from './pages/PaiementsCom';
import FournisseursCom from './pages/FournisseursCom';
import FideliteCom from './pages/FideliteCom';
import NotifCom from './pages/NotifCom';
import AssistantCom from './pages/AssistantCom';
import ProfilCom from './pages/ProfilCom';

// Import des pages de virement
import SendMoney from './pages/SendMoney';
import SendMoneyVerification from './pages/SendMoneyVerification';
import SendMoneyAmount from './pages/SendMoneyAmount';
import SendMoneySummary from './pages/SendMoneySummary';
import SendMoneyAuth from './pages/SendMoneyAuth';
import SendMoneyConfirmation from './pages/SendMoneyConfirmation';
import ReceiveMoney from './pages/ReceiveMoney';
import PayQRCode from './pages/PayQRCode';
import RecevoirPaiementCom from './pages/RecevoirPaiementCom';
import VirementCom from './pages/VirementCom';
//fournisseur
import AccueilFournisseur from './pages/AccueilFournisseur';
import ProduitsFournisseur from './pages/ProduitsFournisseur';
import CommandesRecuesFournisseur from './pages/CommandesRecuesFournisseur';
import LivraisonsFournisseur from './pages/LivraisonsFournisseur';
import ProfilFournisseur from './pages/ProfilFournisseur';
import NotificationsFournisseur from './pages/NotificationsFournisseur';
import AssistantFournisseur from './pages/AssistantFournisseur';
import InformationsCommercant from './pages/InformationsCommercant';
import InformationsFournisseur from './pages/InformationsFournisseur';

function HomePage() {
  const { lang } = useLanguage();
  const [modalOpen, setModalOpen] = useState(null);

  const openLogin = () => setModalOpen('login');
  const openRegister = () => setModalOpen('register');
  const closeModal = () => setModalOpen(null);

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="font-sans min-h-screen bg-white">
      <Hero onOpenLogin={openLogin} onOpenRegister={openRegister} />
      <Services />
      <Features />
      <Footer />

      <Modal isOpen={modalOpen === 'login'} onClose={closeModal}>
        <Login isModal={true} onClose={closeModal} onSwitchToRegister={openRegister} />
      </Modal>

      <Modal isOpen={modalOpen === 'register'} onClose={closeModal}>
        <CreateAccount isModal={true} onClose={closeModal} onSwitchToLogin={openLogin} />
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/identity-verification" element={<IdentityVerification />} />
          <Route path="/verifier-contact" element={<VerifierContact />} />
          <Route path="/informations-professionnelles" element={<ProfessionalInfo />} />
          <Route path="/conditions-generales" element={<ConditionsGenerales />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/compte-soumis" element={<AccountSubmitted />} />
          <Route path="/choix-offre" element={<ChoixOffre />} />
          
          {/* Routes Client */}
          <Route path="/dashboard-client" element={<DashboardClient />} />
          <Route path="/mon-compte" element={<MonCompte />} />
          <Route path="/transactions-client" element={<TransactionsClient />} />
          <Route path="/tickets-client" element={<TicketsNumeriquesClient />} />
          <Route path="/fidelite" element={<Fidelite />} />
          <Route path="/epargne" element={<Epargne />} />
          <Route path="/depenses" element={<Depenses />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/parametres" element={<Parametres />} />
          
          {/* Routes Commerce */}
          <Route path="/acceuil-com" element={<AcceuilCom />} />
          <Route path="/produits" element={<ProduitsCom />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/transactions-commerce" element={<PaiementsCom />} />
          <Route path="/fournisseurs" element={<FournisseursCom />} />
          <Route path="/fidelite-commerce" element={<FideliteCom />} />
          <Route path="/notifications-com" element={<NotifCom />} />
          <Route path="/assistant-commerce" element={<AssistantCom />} />
          <Route path="/parametres-commerce" element={<ProfilCom />} />
          
          {/* Routes Virement (6 étapes) */}
          <Route path="/envoyer-argent" element={<SendMoney />} />
          <Route path="/envoyer-argent/verification" element={<SendMoneyVerification />} />
          <Route path="/envoyer-argent/recapitulatif" element={<SendMoneyAmount />} />
          <Route path="/envoyer-argent/authentification" element={<SendMoneySummary />} />
          <Route path="/envoyer-argent/confirmation" element={<SendMoneyAuth />} />
          <Route path="/envoyer-argent/success" element={<SendMoneyConfirmation />} />
          <Route path="/recevoir-argent" element={<ReceiveMoney />} />
          <Route path="/payer-qr" element={<PayQRCode />} />
          <Route path="/recevoir-paiement" element={<RecevoirPaiementCom />} />
          <Route path="/virement" element={<VirementCom />} />
          <Route path="/accueil-fournisseur" element={<AccueilFournisseur />} />
          <Route path="/produits-fournisseur" element={<ProduitsFournisseur />} />
          <Route path="/commandes-fournisseur" element={<CommandesRecuesFournisseur />} />
          <Route path="/livraisons-fournisseur" element={<LivraisonsFournisseur />} />
          <Route path="/profil-fournisseur" element={<ProfilFournisseur />} />
          <Route path="/notifications-fournisseur" element={<NotificationsFournisseur />} />
          <Route path="/assistant-fournisseur" element={<AssistantFournisseur />} />
          <Route path="/informations-commercant" element={<InformationsCommercant />} />
          <Route path="/informations-fournisseur" element={<InformationsFournisseur />} />
        </Routes>
      </BrowserRouter>
      </NotificationProvider>
    </LanguageProvider>
  );
}