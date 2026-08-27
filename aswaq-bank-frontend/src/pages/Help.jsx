import React, { useState } from 'react';
import {
  Sparkles, ChevronDown, MessageCircle, Send, CheckCircle2,
  CreditCard, ShoppingBag, Truck, User, Mail, Phone,
} from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer';
import './InfoPages.css';

const CATEGORIES = [
  { icon: User, label: 'Compte & Profil' },
  { icon: CreditCard, label: 'Paiements & Transactions' },
  { icon: ShoppingBag, label: 'Commerçants' },
  { icon: Truck, label: 'Fournisseurs' },
];

const FAQ = [
  { q: 'Comment ouvrir un compte Aswaq Bank ?', a: "Cliquez sur \"Ouvrir un compte\", renseignez vos informations et suivez les étapes de vérification d'identité. L'ensemble du processus se fait en ligne." },
  { q: 'J\'ai oublié mon mot de passe, que faire ?', a: "Utilisez le lien \"Mot de passe oublié ?\" sur la page de connexion. Un code de vérification vous sera envoyé par email." },
  { q: 'Comment contacter un conseiller ?', a: "Utilisez le formulaire ci-dessous ou écrivez-nous directement à l'adresse indiquée. Notre équipe vous répond sous 24h ouvrées." },
  { q: 'Quels sont les délais de traitement d\'un virement ?', a: "Les virements entre comptes Aswaq Bank sont instantanés. Les virements vers d'autres banques peuvent prendre jusqu'à 24h ouvrées." },
  { q: 'Comment devenir fournisseur partenaire ?', a: "Créez un compte en sélectionnant le profil \"Fournisseur\" lors de l'inscription, puis complétez votre catalogue produits." },
];

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'faq-item-open' : ''}`}>
      <button type="button" className="faq-question" onClick={() => setOpen((v) => !v)}>
        <span>{item.q}</span>
        <ChevronDown size={18} className="faq-chevron" />
      </button>
      {open && <p className="faq-answer">{item.a}</p>}
    </div>
  );
}

export default function Help() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: brancher sur un vrai endpoint backend (ex: POST /api/support/contact) quand il existera
    setSubmitted(true);
  };

  return (
    <div className="info-page">
      <Navbar />
      <main>
        <section className="info-hero">
          <div className="info-hero-decoration info-hero-decoration-1"></div>
          <div className="info-hero-decoration info-hero-decoration-2"></div>
          <div className="info-hero-badge"><Sparkles size={14} /> Aide & Support</div>
          <h1 className="info-hero-title">
            Comment pouvons-nous <br />
            <span>vous aider ?</span>
          </h1>
          <p className="info-hero-text">
            Notre équipe est là pour répondre à vos questions, du compte au support technique.
          </p>
        </section>

        <section className="info-section">
          <div className="section-heading">
            <h2>Par où commencer ?</h2>
            <p>Choisissez une catégorie pour trouver rapidement une réponse.</p>
          </div>
          <div className="help-categories">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="help-category">
                  <div className="help-category-icon"><Icon size={18} /></div>
                  <h4>{c.label}</h4>
                </div>
              );
            })}
          </div>
        </section>

        <section className="info-section-narrow">
          <div className="section-heading">
            <h2>Questions fréquentes</h2>
            <p>Les réponses aux questions les plus posées par nos utilisateurs.</p>
          </div>
          <div className="info-faq-list">
            {FAQ.map((item) => (
              <FaqItem key={item.q} item={item} />
            ))}
          </div>
        </section>

        <section className="info-section-narrow">
          <div className="section-heading">
            <h2>Contactez-nous</h2>
            <p>Une question spécifique ? Écrivez-nous, nous répondons sous 24h ouvrées.</p>
          </div>

          <div className="contact-form-card">
            {submitted ? (
              <div className="contact-form-success">
                <CheckCircle2 size={20} />
                Votre message a bien été envoyé. Nous vous répondrons rapidement.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="contact-form-group">
                  <label className="contact-form-label">Nom complet</label>
                  <input
                    type="text" name="name" className="contact-form-input"
                    value={formData.name} onChange={handleChange} required
                  />
                </div>
                <div className="contact-form-group">
                  <label className="contact-form-label">Adresse e-mail</label>
                  <input
                    type="email" name="email" className="contact-form-input"
                    value={formData.email} onChange={handleChange} required
                  />
                </div>
                <div className="contact-form-group">
                  <label className="contact-form-label">Sujet</label>
                  <input
                    type="text" name="subject" className="contact-form-input"
                    value={formData.subject} onChange={handleChange} required
                  />
                </div>
                <div className="contact-form-group">
                  <label className="contact-form-label">Message</label>
                  <textarea
                    name="message" className="contact-form-textarea"
                    value={formData.message} onChange={handleChange} required
                  />
                </div>
                <button type="submit" className="contact-form-submit">
                  <Send size={16} />
                  Envoyer le message
                </button>
              </form>
            )}
          </div>

          <div className="info-cards-grid" style={{ marginTop: '24px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="info-card">
              <div className="info-card-icon"><Mail size={18} /></div>
              <h3>Par email</h3>
              <p>support@aswaqbank.ma</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon"><Phone size={18} /></div>
              <h3>Par téléphone</h3>
              <p>+212 5XX-XXXXXX (Lun-Ven, 9h-18h)</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}