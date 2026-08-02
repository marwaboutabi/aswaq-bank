import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  fr: {
    nav: {
      services: "Nos services",
      login: "Se connecter",
      openAccount: "Ouvrir un compte"
    },
    otp: {
      title: "Vérifiez votre adresse email",
      subtitle: "Veuillez saisir le code de vérification à 6 chiffres envoyé à :",
      sentTo: "Nous avons envoyé un code de vérification à :",
      expiresIn: "Le code expire dans",
      notReceived: "Vous n'avez pas reçu le code ?",
      submit: "Vérifier",
      verifyButton: "Vérifier le code",
      verifying: "Vérification...",
      resend: "Renvoyer le code",
      resendIn: "Renvoyer le code dans",
      back: "← Retour",
      protected: "Vos données sont protégées",
      compliance: "Conforme aux exigences de Bank Al-Maghrib.",
      error: "Code de vérification incorrect.",
      errorEmpty: "Veuillez saisir les 6 chiffres",
      resendSuccess: "Nouveau code envoyé !"
    },
    phoneMockup: {
      greeting: "Bonjour, Ahmed 👋",
      availableBalance: "Solde disponible",
      dailySales: "Ventes du jour",
      qrPayment: "Paiement QR",
      stock: "Stock",
      loyalty: "Fidélité",
      notifications: "Notifications",
      recentTransactions: "Transactions récentes",
      seeAll: "Voir tout >",
      paymentReceived: "Paiement reçu",
      supplierPurchase: "Achat fournisseur",
      today: "Aujourd'hui"
    },
    hero: {
      title1: "La banque digitale qui fait grandir le ",
      title2: "commerce de proximité.",
      subtitle: "Gérez vos finances, développez votre commerce, récompensez vos clients et payez simplement, depuis une seule application.",
      btn1: "Ouvrir un compte",
      btn2: "Découvrir nos services",
      secure: "Sécurisé", secureDesc: "Vos données sont protégées",
      fast: "Rapide", fastDesc: "Transactions en quelques secondes",
      compliant: "Conforme", compliantDesc: "Conforme aux exigences de Bank Al-Maghrib"
    },
    services: {
      title: "Nos services principaux",
      products: "Gestion des produits", productsDesc: "Ajoutez, modifiez et supprimez vos produits facilement.",
      dashboard: "Tableau de bord", dashboardDesc: "Suivez vos ventes, votre chiffre d'affaires et la performance de votre activité.",
      qr: "Paiement QR", qrDesc: "Encaissez rapidement et en toute sécurité avec un QR Code.",
      stock: "Gestion du stock", stockDesc: "Consultez votre stock en temps réel et recevez des alertes de stock faible."
    },
    features: {
      digital: "100% digitale", digitalDesc: "Gérez tout depuis votre téléphone",
      loyalty: "Programme de fidélité", loyaltyDesc: "Récompensez vos clients et fidélisez-les",
      notif: "Notifications intelligentes", notifDesc: "Restez informé en temps réel de votre activité",
      support: "Support 24/7", supportDesc: "Une équipe disponible à tout moment"
    },
    footer: {
      desc: "La banque digitale qui fait grandir le commerce de proximité.",
      services: "Services", company: "Entreprise", legal: "Légal",
      rights: "© 2026 ASWAQ Bank. Tous droits réservés."
    },
    login: {
      title: "Bienvenue sur Aswaq Bank",
      subtitle: "Connectez-vous pour accéder à votre espace sécurisé.",
      email: "Adresse e-mail",
      password: "Mot de passe",
      remember: "Se souvenir de moi",
      forgot: "Mot de passe oublié ?",
      submit: "Se connecter",
      noAccount: "Vous n'avez pas de compte ?",
      openAccount: "Ouvrir un compte",
      protected: "Vos données sont protégées",
      compliance: "Conforme aux exigences de Bank Al-Maghrib.",
      errorEmpty: "Veuillez remplir tous les champs",
      success: "Connexion réussie !"
    },
    register: {
      title: "Créer un compte",
      subtitle: "Rejoignez ASWAQ Bank en quelques minutes",
      nom: "Nom",
      prenom: "Prénom",
      email: "Adresse e-mail",
      telephone: "Numéro de téléphone",
      password: "Mot de passe",
      confirmPassword: "Confirmation du mot de passe",
      submit: "Suivant",
      hasAccount: "Déjà un compte ?",
      login: "Se connecter",
      protected: "Vos données sont protégées",
      compliance: "Conforme aux exigences de Bank Al-Maghrib.",
      errorMatch: "Les mots de passe ne correspondent pas",
      errorLength: "Le mot de passe doit contenir au moins 6 caractères",
      success: "Compte créé avec succès !"
    },
    identity: {
      title: "Vérification de l'identité",
      subtitle: "Étape 2 sur 3 — Veuillez compléter vos informations personnelles",
      dob: "Date de naissance *",
      birthPlace: "Lieu de naissance *",
      birthPlacePlaceholder: "Ville de naissance",
      nationality: "Nationalité *",
      nationalityPlaceholder: "Votre nationalité",
      address: "Adresse *",
      addressPlaceholder: "Rue, numéro, appartement",
      city: "Ville *",
      cityPlaceholder: "Votre ville",
      idNumber: "Numéro de la pièce d'identité *",
      idNumberPlaceholder: "Numéro CIN ou Passeport",
      idExpiration: "Date d'expiration *",
      idPhotoLabel: "Photo de la pièce d'identité",
      uploadIdPhoto: "Télécharger la photo de la CIN",
      selfieLabel: "Selfie de vérification",
      uploadSelfie: "Télécharger un selfie",
      submit: "Continuer",
      back: "← Retour à l'accueil",
      protected: "Vos données sont protégées",
      compliance: "Conforme aux exigences de Bank Al-Maghrib.",
      errorRequired: "Veuillez remplir tous les champs obligatoires",
      errorAddress: "Veuillez remplir votre adresse complète",
      errorId: "Veuillez remplir les informations de votre pièce d'identité",
      success: "Informations d'identité enregistrées avec succès"
    },
    forgot: {
      title: "Mot de passe oublié",
      subtitle: "Saisissez votre adresse e-mail afin de recevoir un code de vérification.",
      email: "Adresse e-mail",
      submit: "Envoyer le code",
      back: "← Retour à l'accueil",
      protected: "Vos données sont protégées",
      compliance: "Conforme aux exigences de Bank Al-Maghrib.",
      errorEmpty: "Veuillez saisir votre adresse e-mail"
    },
    reset: {
      title: "Réinitialisation du mot de passe",
      subtitle: "Choisissez un nouveau mot de passe sécurisé.",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      submit: "Modifier le mot de passe",
      protected: "Vos données sont protégées",
      compliance: "Conforme aux exigences de Bank Al-Maghrib.",
      errorLength: "Le mot de passe doit contenir au moins 6 caractères",
      errorMatch: "Les mots de passe ne correspondent pas",
      success: "Mot de passe modifié avec succès !"
    }
  },
  en: {
    nav: {
      services: "Our services",
      login: "Sign in",
      openAccount: "Open an account"
    },
    otp: {
      title: "Verify your email address",
      subtitle: "Please enter the 6-digit verification code sent to:",
      sentTo: "We sent a verification code to:",
      expiresIn: "Code expires in",
      notReceived: "Didn't receive the code?",
      submit: "Verify",
      verifyButton: "Verify code",
      verifying: "Verifying...",
      resend: "Resend code",
      resendIn: "Resend code in",
      back: "← Back",
      protected: "Your data is protected",
      compliance: "Compliant with Bank Al-Maghrib requirements.",
      error: "Incorrect verification code.",
      errorEmpty: "Please enter the 6 digits",
      resendSuccess: "New code sent!"
    },
    phoneMockup: {
      greeting: "Hello, Ahmed 👋",
      availableBalance: "Available balance",
      dailySales: "Daily sales",
      qrPayment: "QR Payment",
      stock: "Stock",
      loyalty: "Loyalty",
      notifications: "Notifications",
      recentTransactions: "Recent transactions",
      seeAll: "See all >",
      paymentReceived: "Payment received",
      supplierPurchase: "Supplier purchase",
      today: "Today"
    },
    hero: {
      title1: "The digital bank that grows ",
      title2: "local commerce.",
      subtitle: "Manage your finances, grow your business, reward your customers and pay simply, all from one app.",
      btn1: "Open an account",
      btn2: "Discover our services",
      secure: "Secure", secureDesc: "Your data is protected",
      fast: "Fast", fastDesc: "Transactions in seconds",
      compliant: "Compliant", compliantDesc: "Compliant with Bank Al-Maghrib requirements"
    },
    services: {
      title: "Our main services",
      products: "Product Management", productsDesc: "Add, edit and delete your products easily.",
      dashboard: "Dashboard", dashboardDesc: "Track your sales, revenue and business performance.",
      qr: "QR Payment", qrDesc: "Collect payments quickly and securely with a QR Code.",
      stock: "Stock Management", stockDesc: "Check your stock in real-time and get low stock alerts."
    },
    features: {
      digital: "100% Digital", digitalDesc: "Manage everything from your phone",
      loyalty: "Loyalty Program", loyaltyDesc: "Reward your customers and keep them loyal",
      notif: "Smart Notifications", notifDesc: "Stay informed in real-time about your activity",
      support: "24/7 Support", supportDesc: "A team available at all times"
    },
    footer: {
      desc: "The digital bank that grows local commerce.",
      services: "Services", company: "Company", legal: "Legal",
      rights: "© 2026 ASWAQ Bank. All rights reserved."
    },
    login: {
      title: "Welcome to Aswaq Bank",
      subtitle: "Sign in to access your secure space.",
      email: "Email address",
      password: "Password",
      remember: "Remember me",
      forgot: "Forgot password?",
      submit: "Sign in",
      noAccount: "Don't have an account?",
      openAccount: "Open an account",
      protected: "Your data is protected",
      compliance: "Compliant with Bank Al-Maghrib requirements.",
      errorEmpty: "Please fill in all fields",
      success: "Login successful!"
    },
    register: {
      title: "Create an account",
      subtitle: "Join ASWAQ Bank in a few minutes",
      nom: "Last name",
      prenom: "First name",
      email: "Email address",
      telephone: "Phone number",
      password: "Password",
      confirmPassword: "Confirm password",
      submit: "Next",
      hasAccount: "Already have an account?",
      login: "Sign in",
      protected: "Your data is protected",
      compliance: "Compliant with Bank Al-Maghrib requirements.",
      errorMatch: "Passwords do not match",
      errorLength: "Password must be at least 6 characters",
      success: "Account created successfully!"
    },
    identity: {
      title: "Identity Verification",
      subtitle: "Step 2 of 3 — Please complete your personal information",
      dob: "Date of birth *",
      birthPlace: "Place of birth *",
      birthPlacePlaceholder: "City of birth",
      nationality: "Nationality *",
      nationalityPlaceholder: "Your nationality",
      address: "Address *",
      addressPlaceholder: "Street, number, apartment",
      city: "City *",
      cityPlaceholder: "Your city",
      idNumber: "ID number *",
      idNumberPlaceholder: "ID or Passport number",
      idExpiration: "Expiration date *",
      idPhotoLabel: "ID Photo",
      uploadIdPhoto: "Upload ID photo",
      selfieLabel: "Verification Selfie",
      uploadSelfie: "Upload a selfie",
      submit: "Continue",
      back: "← Back to Home",
      protected: "Your data is protected",
      compliance: "Compliant with Bank Al-Maghrib requirements.",
      errorRequired: "Please fill in all required fields",
      errorAddress: "Please fill in your complete address",
      errorId: "Please fill in your ID information",
      success: "Identity information saved successfully"
    },
    forgot: {
      title: "Forgot password",
      subtitle: "Enter your email address to receive a verification code.",
      email: "Email address",
      submit: "Send code",
      back: "← Back to home",
      protected: "Your data is protected",
      compliance: "Compliant with Bank Al-Maghrib requirements.",
      errorEmpty: "Please enter your email address"
    },
    reset: {
      title: "Password reset",
      subtitle: "Choose a new secure password.",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      submit: "Change password",
      protected: "Your data is protected",
      compliance: "Compliant with Bank Al-Maghrib requirements.",
      errorLength: "Password must be at least 6 characters",
      errorMatch: "Passwords do not match",
      success: "Password changed successfully!"
    }
  },
  ar: {
    nav: {
      services: "خدماتنا",
      login: "تسجيل الدخول",
      openAccount: "فتح حساب"
    },
    otp: {
      title: "تحقق من بريدك الإلكتروني",
      subtitle: "يرجى إدخال رمز التحقق المكون من 6 أرقام المرسل إلى:",
      sentTo: "أرسلنا رمز التحقق إلى:",
      expiresIn: "تنتهي صلاحية الرمز خلال",
      notReceived: "لم تستلم الرمز؟",
      submit: "تحقق",
      verifyButton: "تحقق من الرمز",
      verifying: "جارٍ التحقق...",
      resend: "إعادة إرسال الرمز",
      resendIn: "إعادة إرسال الرمز خلال",
      back: "رجوع ←",
      protected: "بياناتك محمية",
      compliance: "متوافق مع متطلبات بنك المغرب.",
      error: "رمز التحقق غير صحيح.",
      errorEmpty: "يرجى إدخال الأرقام الستة",
      resendSuccess: "تم إرسال رمز جديد!"
    },
    phoneMockup: {
      greeting: "مرحبا، أحمد 👋",
      availableBalance: "الرصيد المتاح",
      dailySales: "مبيعات اليوم",
      qrPayment: "دفع QR",
      stock: "المخزون",
      loyalty: "الولاء",
      notifications: "الإشعارات",
      recentTransactions: "المعاملات الأخيرة",
      seeAll: "عرض الكل >",
      paymentReceived: "تم استلام الدفع",
      supplierPurchase: "شراء من المورد",
      today: "اليوم"
    },
    hero: {
      title1: "البنك الرقمي الذي ينمي ",
      title2: "التجارة المحلية.",
      subtitle: "أدر أموالك، طور تجارتك، كافئ عملاءك وادفع ببساطة، من تطبيق واحد.",
      btn1: "فتح حساب",
      btn2: "اكتشف خدماتنا",
      secure: "آمن", secureDesc: "بياناتك محمية",
      fast: "سريع", fastDesc: "معاملات في ثوانٍ",
      compliant: "متوافق", compliantDesc: "متوافق مع متطلبات بنك المغرب"
    },
    services: {
      title: "خدماتنا الرئيسية",
      products: "إدارة المنتجات", productsDesc: "أضف، عدل واحذف منتجاتك بسهولة.",
      dashboard: "لوحة التحكم", dashboardDesc: "تتبع مبيعاتك وإيراداتك وأداء نشاطك.",
      qr: "دفع QR", qrDesc: "اقبض المدفوعات بسرعة وأمان عبر رمز QR.",
      stock: "إدارة المخزون", stockDesc: "تحقق من مخزونك في الوقت الفعلي واحصل على تنبيهات."
    },
    features: {
      digital: "100% رقمي", digitalDesc: "أدر كل شيء من هاتفك",
      loyalty: "برنامج الولاء", loyaltyDesc: "كافئ عملاءك واجعلهم أوفياء",
      notif: "إشعارات ذكية", notifDesc: "ابق على اطلاع في الوقت الفعلي",
      support: "دعم 24/7", supportDesc: "فريق متاح في جميع الأوقات"
    },
    footer: {
      desc: "البنك الرقمي الذي ينمي التجارة المحلية.",
      services: "الخدمات", company: "الشركة", legal: "قانوني",
      rights: "© 2026 بنك أسواق. جميع الحقوق محفوظة."
    },
    login: {
      title: "مرحبا بكم في بنك أسواق",
      subtitle: "سجل الدخول للوصول إلى مساحتك الآمنة.",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      remember: "تذكرني",
      forgot: "نسيت كلمة المرور؟",
      submit: "تسجيل الدخول",
      noAccount: "ليس لديك حساب؟",
      openAccount: "فتح حساب",
      protected: "بياناتك محمية",
      compliance: "متوافق مع متطلبات بنك المغرب.",
      errorEmpty: "يرجى ملء جميع الحقول",
      success: "تم تسجيل الدخول بنجاح!"
    },
    register: {
      title: "إنشاء حساب",
      subtitle: "انضم إلى بنك أسواق في بضع دقائق",
      nom: "الاسم العائلي",
      prenom: "الاسم الشخصي",
      email: "البريد الإلكتروني",
      telephone: "رقم الهاتف",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      submit: "التالي",
      hasAccount: "لديك حساب بالفعل؟",
      login: "تسجيل الدخول",
      protected: "بياناتك محمية",
      compliance: "متوافق مع متطلبات بنك المغرب.",
      errorMatch: "كلمات المرور غير متطابقة",
      errorLength: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
      success: "تم إنشاء الحساب بنجاح!"
    },
    identity: {
      title: "التحقق من الهوية",
      subtitle: "الخطوة 2 من 3 — يرجى إكمال معلوماتك الشخصية",
      dob: "تاريخ الميلاد *",
      birthPlace: "مكان الميلاد *",
      birthPlacePlaceholder: "مدينة الميلاد",
      nationality: "الجنسية *",
      nationalityPlaceholder: "جنسيتك",
      address: "العنوان *",
      addressPlaceholder: "الشارع، الرقم، الشقة",
      city: "المدينة *",
      cityPlaceholder: "مدينتك",
      idNumber: "رقم بطاقة الهوية *",
      idNumberPlaceholder: "رقم البطاقة الوطنية أو جواز السفر",
      idExpiration: "تاريخ الانتهاء *",
      idPhotoLabel: "صورة بطاقة الهوية",
      uploadIdPhoto: "تحميل صورة البطاقة",
      selfieLabel: "صورة شخصية للتحقق",
      uploadSelfie: "تحميل صورة شخصية",
      submit: "متابعة",
      back: "← العودة للرئيسية",
      protected: "بياناتك محمية",
      compliance: "متوافق مع متطلبات بنك المغرب.",
      errorRequired: "يرجى ملء جميع الحقول المطلوبة",
      errorAddress: "يرجى ملء عنوانك الكامل",
      errorId: "يرجى ملء معلومات بطاقة الهوية الخاصة بك",
      success: "تم حفظ معلومات الهوية بنجاح"
    },
    forgot: {
      title: "نسيت كلمة المرور",
      subtitle: "أدخل بريدك الإلكتروني لتلقي رمز التحقق.",
      email: "البريد الإلكتروني",
      submit: "إرسال الرمز",
      back: "← العودة إلى الرئيسية",
      protected: "بياناتك محمية",
      compliance: "متوافق مع متطلبات بنك المغرب.",
      errorEmpty: "يرجى إدخال بريدك الإلكتروني"
    },
    reset: {
      title: "إعادة تعيين كلمة المرور",
      subtitle: "اختر كلمة مرور جديدة آمنة.",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور",
      submit: "تغيير كلمة المرور",
      protected: "بياناتك محمية",
      compliance: "متوافق مع متطلبات بنك المغرب.",
      errorLength: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
      errorMatch: "كلمات المرور غير متطابقة",
      success: "تم تغيير كلمة المرور بنجاح!"
    }
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('fr');
  const t = (key) => key.split('.').reduce((obj, k) => obj?.[k], translations[lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);