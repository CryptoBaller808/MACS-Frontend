import React, { createContext, useContext, useState, useEffect } from 'react';

// Language Context
const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false
  }
};

// Translation hook
export const useTranslation = () => {
  const { language, translations } = useLanguage();
  
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object') {
            value = value[fallbackKey];
          } else {
            value = key; // Return key if no translation found
            break;
          }
        }
        break;
      }
    }
    
    if (typeof value === 'string') {
      // Replace parameters in translation
      return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match;
      });
    }
    
    return key;
  };
  
  return { t, language, setLanguage: useLanguage().setLanguage };
};

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // In a real app, these would be loaded from separate files or an API
        const translationData = {
          en: {
            common: {
              welcome: 'Welcome',
              loading: 'Loading...',
              error: 'Error',
              success: 'Success',
              cancel: 'Cancel',
              save: 'Save',
              delete: 'Delete',
              edit: 'Edit',
              view: 'View',
              share: 'Share',
              copy: 'Copy',
              copied: 'Copied!',
              close: 'Close',
              next: 'Next',
              previous: 'Previous',
              back: 'Back',
              continue: 'Continue',
              submit: 'Submit',
              search: 'Search',
              filter: 'Filter',
              sort: 'Sort',
              all: 'All',
              none: 'None',
              yes: 'Yes',
              no: 'No',
              or: 'or',
              and: 'and'
            },
            navigation: {
              home: 'Home',
              marketplace: 'Marketplace',
              profile: 'Profile',
              wallet: 'Wallet',
              dashboard: 'Dashboard',
              campaigns: 'Campaigns',
              booking: 'Booking',
              bridge: 'Bridge',
              discover: 'Discover',
              activity: 'Activity',
              notifications: 'Notifications',
              settings: 'Settings',
              help: 'Help',
              logout: 'Logout'
            },
            auth: {
              signIn: 'Sign In',
              signUp: 'Sign Up',
              signOut: 'Sign Out',
              connectWallet: 'Connect Wallet',
              disconnectWallet: 'Disconnect Wallet',
              walletConnected: 'Wallet Connected',
              walletNotConnected: 'Wallet Not Connected'
            },
            marketplace: {
              title: 'Marketplace',
              subtitle: 'Discover amazing art from talented creators',
              buyNow: 'Buy Now',
              placeBid: 'Place Bid',
              makeOffer: 'Make Offer',
              price: 'Price',
              creator: 'Creator',
              owner: 'Owner',
              collection: 'Collection',
              rarity: 'Rarity',
              properties: 'Properties',
              history: 'History',
              description: 'Description'
            },
            profile: {
              title: 'Profile',
              bio: 'Bio',
              website: 'Website',
              twitter: 'Twitter',
              instagram: 'Instagram',
              discord: 'Discord',
              followers: 'Followers',
              following: 'Following',
              created: 'Created',
              collected: 'Collected',
              favorites: 'Favorites',
              editProfile: 'Edit Profile',
              follow: 'Follow',
              unfollow: 'Unfollow',
              tip: 'Tip Artist'
            },
            wallet: {
              title: 'Wallet',
              balance: 'Balance',
              assets: 'Assets',
              transactions: 'Transactions',
              send: 'Send',
              receive: 'Receive',
              swap: 'Swap',
              bridge: 'Bridge',
              history: 'History',
              address: 'Address',
              network: 'Network',
              gas: 'Gas',
              fee: 'Fee'
            },
            campaigns: {
              title: 'Campaigns',
              subtitle: 'Support amazing creative projects',
              createCampaign: 'Create Campaign',
              backProject: 'Back Project',
              goal: 'Goal',
              raised: 'Raised',
              backers: 'Backers',
              daysLeft: 'Days Left',
              funded: 'Funded',
              rewards: 'Rewards',
              updates: 'Updates',
              comments: 'Comments'
            },
            dashboard: {
              title: 'Dashboard',
              overview: 'Overview',
              analytics: 'Analytics',
              earnings: 'Earnings',
              sales: 'Sales',
              views: 'Views',
              likes: 'Likes',
              comments: 'Comments',
              followers: 'Followers',
              revenue: 'Revenue',
              growth: 'Growth'
            },
            notifications: {
              title: 'Notifications',
              markAllRead: 'Mark All Read',
              clearAll: 'Clear All',
              noNotifications: 'No notifications yet',
              newFollower: 'New follower',
              newSale: 'New sale',
              newBid: 'New bid',
              campaignUpdate: 'Campaign update',
              paymentReceived: 'Payment received'
            },
            onboarding: {
              welcome: 'Welcome to MACS!',
              subtitle: 'The Muse Art Creative Sphere',
              getStarted: 'Get Started',
              skipTutorial: 'Skip Tutorial',
              step: 'Step {{current}} of {{total}}',
              createProfile: 'Create Your Profile',
              connectWallet: 'Connect Your Wallet',
              exploreMarketplace: 'Explore the Marketplace',
              complete: 'Complete Setup'
            },
            invite: {
              title: 'Invite Friends',
              subtitle: 'Share MACS with friends and earn rewards',
              inviteCode: 'Your Invite Code',
              inviteLink: 'Your Invite Link',
              shareOnSocial: 'Share on Social Media',
              howItWorks: 'How It Works',
              earnRewards: 'Earn {{amount}} MACS per successful invite',
              totalInvites: 'Total Invites',
              successfulInvites: 'Successful Invites',
              pendingRewards: 'Pending Rewards',
              currentTier: 'Current Tier'
            }
          },
          es: {
            common: {
              welcome: 'Bienvenido',
              loading: 'Cargando...',
              error: 'Error',
              success: 'Éxito',
              cancel: 'Cancelar',
              save: 'Guardar',
              delete: 'Eliminar',
              edit: 'Editar',
              view: 'Ver',
              share: 'Compartir',
              copy: 'Copiar',
              copied: '¡Copiado!',
              close: 'Cerrar',
              next: 'Siguiente',
              previous: 'Anterior',
              back: 'Atrás',
              continue: 'Continuar',
              submit: 'Enviar',
              search: 'Buscar',
              filter: 'Filtrar',
              sort: 'Ordenar',
              all: 'Todo',
              none: 'Ninguno',
              yes: 'Sí',
              no: 'No',
              or: 'o',
              and: 'y'
            },
            navigation: {
              home: 'Inicio',
              marketplace: 'Mercado',
              profile: 'Perfil',
              wallet: 'Billetera',
              dashboard: 'Panel',
              campaigns: 'Campañas',
              booking: 'Reservas',
              bridge: 'Puente',
              discover: 'Descubrir',
              activity: 'Actividad',
              notifications: 'Notificaciones',
              settings: 'Configuración',
              help: 'Ayuda',
              logout: 'Cerrar Sesión'
            },
            auth: {
              signIn: 'Iniciar Sesión',
              signUp: 'Registrarse',
              signOut: 'Cerrar Sesión',
              connectWallet: 'Conectar Billetera',
              disconnectWallet: 'Desconectar Billetera',
              walletConnected: 'Billetera Conectada',
              walletNotConnected: 'Billetera No Conectada'
            },
            marketplace: {
              title: 'Mercado',
              subtitle: 'Descubre arte increíble de creadores talentosos',
              buyNow: 'Comprar Ahora',
              placeBid: 'Hacer Oferta',
              makeOffer: 'Hacer Oferta',
              price: 'Precio',
              creator: 'Creador',
              owner: 'Propietario',
              collection: 'Colección',
              rarity: 'Rareza',
              properties: 'Propiedades',
              history: 'Historial',
              description: 'Descripción'
            },
            profile: {
              title: 'Perfil',
              bio: 'Biografía',
              website: 'Sitio Web',
              twitter: 'Twitter',
              instagram: 'Instagram',
              discord: 'Discord',
              followers: 'Seguidores',
              following: 'Siguiendo',
              created: 'Creado',
              collected: 'Coleccionado',
              favorites: 'Favoritos',
              editProfile: 'Editar Perfil',
              follow: 'Seguir',
              unfollow: 'Dejar de Seguir',
              tip: 'Dar Propina al Artista'
            },
            wallet: {
              title: 'Billetera',
              balance: 'Saldo',
              assets: 'Activos',
              transactions: 'Transacciones',
              send: 'Enviar',
              receive: 'Recibir',
              swap: 'Intercambiar',
              bridge: 'Puente',
              history: 'Historial',
              address: 'Dirección',
              network: 'Red',
              gas: 'Gas',
              fee: 'Tarifa'
            },
            campaigns: {
              title: 'Campañas',
              subtitle: 'Apoya proyectos creativos increíbles',
              createCampaign: 'Crear Campaña',
              backProject: 'Apoyar Proyecto',
              goal: 'Meta',
              raised: 'Recaudado',
              backers: 'Patrocinadores',
              daysLeft: 'Días Restantes',
              funded: 'Financiado',
              rewards: 'Recompensas',
              updates: 'Actualizaciones',
              comments: 'Comentarios'
            },
            dashboard: {
              title: 'Panel',
              overview: 'Resumen',
              analytics: 'Analíticas',
              earnings: 'Ganancias',
              sales: 'Ventas',
              views: 'Vistas',
              likes: 'Me Gusta',
              comments: 'Comentarios',
              followers: 'Seguidores',
              revenue: 'Ingresos',
              growth: 'Crecimiento'
            },
            notifications: {
              title: 'Notificaciones',
              markAllRead: 'Marcar Todo como Leído',
              clearAll: 'Limpiar Todo',
              noNotifications: 'No hay notificaciones aún',
              newFollower: 'Nuevo seguidor',
              newSale: 'Nueva venta',
              newBid: 'Nueva oferta',
              campaignUpdate: 'Actualización de campaña',
              paymentReceived: 'Pago recibido'
            },
            onboarding: {
              welcome: '¡Bienvenido a MACS!',
              subtitle: 'La Esfera Creativa de Arte Muse',
              getStarted: 'Comenzar',
              skipTutorial: 'Saltar Tutorial',
              step: 'Paso {{current}} de {{total}}',
              createProfile: 'Crea Tu Perfil',
              connectWallet: 'Conecta Tu Billetera',
              exploreMarketplace: 'Explora el Mercado',
              complete: 'Completar Configuración'
            },
            invite: {
              title: 'Invitar Amigos',
              subtitle: 'Comparte MACS con amigos y gana recompensas',
              inviteCode: 'Tu Código de Invitación',
              inviteLink: 'Tu Enlace de Invitación',
              shareOnSocial: 'Compartir en Redes Sociales',
              howItWorks: 'Cómo Funciona',
              earnRewards: 'Gana {{amount}} MACS por cada invitación exitosa',
              totalInvites: 'Invitaciones Totales',
              successfulInvites: 'Invitaciones Exitosas',
              pendingRewards: 'Recompensas Pendientes',
              currentTier: 'Nivel Actual'
            }
          },
          ja: {
            common: {
              welcome: 'ようこそ',
              loading: '読み込み中...',
              error: 'エラー',
              success: '成功',
              cancel: 'キャンセル',
              save: '保存',
              delete: '削除',
              edit: '編集',
              view: '表示',
              share: '共有',
              copy: 'コピー',
              copied: 'コピーしました！',
              close: '閉じる',
              next: '次へ',
              previous: '前へ',
              back: '戻る',
              continue: '続行',
              submit: '送信',
              search: '検索',
              filter: 'フィルター',
              sort: '並び替え',
              all: 'すべて',
              none: 'なし',
              yes: 'はい',
              no: 'いいえ',
              or: 'または',
              and: 'と'
            },
            navigation: {
              home: 'ホーム',
              marketplace: 'マーケットプレイス',
              profile: 'プロフィール',
              wallet: 'ウォレット',
              dashboard: 'ダッシュボード',
              campaigns: 'キャンペーン',
              booking: '予約',
              bridge: 'ブリッジ',
              discover: '発見',
              activity: 'アクティビティ',
              notifications: '通知',
              settings: '設定',
              help: 'ヘルプ',
              logout: 'ログアウト'
            },
            auth: {
              signIn: 'サインイン',
              signUp: 'サインアップ',
              signOut: 'サインアウト',
              connectWallet: 'ウォレット接続',
              disconnectWallet: 'ウォレット切断',
              walletConnected: 'ウォレット接続済み',
              walletNotConnected: 'ウォレット未接続'
            },
            marketplace: {
              title: 'マーケットプレイス',
              subtitle: '才能あるクリエイターの素晴らしいアートを発見',
              buyNow: '今すぐ購入',
              placeBid: '入札する',
              makeOffer: 'オファーする',
              price: '価格',
              creator: 'クリエイター',
              owner: '所有者',
              collection: 'コレクション',
              rarity: 'レア度',
              properties: 'プロパティ',
              history: '履歴',
              description: '説明'
            },
            profile: {
              title: 'プロフィール',
              bio: '自己紹介',
              website: 'ウェブサイト',
              twitter: 'Twitter',
              instagram: 'Instagram',
              discord: 'Discord',
              followers: 'フォロワー',
              following: 'フォロー中',
              created: '作成済み',
              collected: 'コレクション',
              favorites: 'お気に入り',
              editProfile: 'プロフィール編集',
              follow: 'フォロー',
              unfollow: 'フォロー解除',
              tip: 'アーティストにチップ'
            },
            wallet: {
              title: 'ウォレット',
              balance: '残高',
              assets: 'アセット',
              transactions: '取引',
              send: '送信',
              receive: '受信',
              swap: 'スワップ',
              bridge: 'ブリッジ',
              history: '履歴',
              address: 'アドレス',
              network: 'ネットワーク',
              gas: 'ガス',
              fee: '手数料'
            },
            campaigns: {
              title: 'キャンペーン',
              subtitle: '素晴らしいクリエイティブプロジェクトを支援',
              createCampaign: 'キャンペーン作成',
              backProject: 'プロジェクト支援',
              goal: '目標',
              raised: '調達済み',
              backers: '支援者',
              daysLeft: '残り日数',
              funded: '資金調達済み',
              rewards: '報酬',
              updates: '更新',
              comments: 'コメント'
            },
            dashboard: {
              title: 'ダッシュボード',
              overview: '概要',
              analytics: '分析',
              earnings: '収益',
              sales: '売上',
              views: '表示回数',
              likes: 'いいね',
              comments: 'コメント',
              followers: 'フォロワー',
              revenue: '収入',
              growth: '成長'
            },
            notifications: {
              title: '通知',
              markAllRead: 'すべて既読にする',
              clearAll: 'すべてクリア',
              noNotifications: 'まだ通知はありません',
              newFollower: '新しいフォロワー',
              newSale: '新しい売上',
              newBid: '新しい入札',
              campaignUpdate: 'キャンペーン更新',
              paymentReceived: '支払い受信'
            },
            onboarding: {
              welcome: 'MACSへようこそ！',
              subtitle: 'ミューズアートクリエイティブスフィア',
              getStarted: '始める',
              skipTutorial: 'チュートリアルをスキップ',
              step: 'ステップ {{current}} / {{total}}',
              createProfile: 'プロフィールを作成',
              connectWallet: 'ウォレットを接続',
              exploreMarketplace: 'マーケットプレイスを探索',
              complete: 'セットアップ完了'
            },
            invite: {
              title: '友達を招待',
              subtitle: '友達とMACSを共有して報酬を獲得',
              inviteCode: '招待コード',
              inviteLink: '招待リンク',
              shareOnSocial: 'ソーシャルメディアで共有',
              howItWorks: '仕組み',
              earnRewards: '成功した招待ごとに{{amount}} MACSを獲得',
              totalInvites: '総招待数',
              successfulInvites: '成功した招待',
              pendingRewards: '保留中の報酬',
              currentTier: '現在のティア'
            }
          }
        };
        
        setTranslations(translationData);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    loadTranslations();
  }, []);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('macs-language');
    if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split('-')[0];
      if (SUPPORTED_LANGUAGES[browserLanguage]) {
        setLanguage(browserLanguage);
      }
    }
  }, []);

  // Save language preference
  const changeLanguage = (newLanguage) => {
    if (SUPPORTED_LANGUAGES[newLanguage]) {
      setLanguage(newLanguage);
      localStorage.setItem('macs-language', newLanguage);
      
      // Update document language
      document.documentElement.lang = newLanguage;
      
      // Update document direction for RTL languages
      document.documentElement.dir = SUPPORTED_LANGUAGES[newLanguage].rtl ? 'rtl' : 'ltr';
    }
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    translations,
    supportedLanguages: SUPPORTED_LANGUAGES,
    currentLanguageData: SUPPORTED_LANGUAGES[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;

