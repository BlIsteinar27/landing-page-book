import { formatWhatsAppLink } from '@/utils/whatsapp'

// ========== URL DEL SITIO ==========
export const SITE_URL = 'https://landing-page-book-gold.vercel.app'

// ========== WHATSAPP ==========
export const WHATSAPP_NUMBER = '584247203076'
export const WHATSAPP_MESSAGE = 'Hola, quiero comprar el libro Los Dos Reinos de Victoria'

// ========== AMAZON ==========
export const AMAZON_URL = 'https://www.amazon.com/-/es/Audible/dp/B005DGW34C/ref=sr_1_1?__mk_es_US=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-1' // Reemplazar con la URL real del producto

// ========== REDES SOCIALES ==========
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/victoria_aql',
  tiktok: 'https://tiktok.com/@victoria_aql',
  instagramHandle: '@victoria_aql',
  tiktokHandle: '@victoria_aql',
}

// ========== LINKS CONSOLIDADOS ==========
export const LINKS = {
  amazon: AMAZON_URL,
  whatsapp: formatWhatsAppLink(WHATSAPP_NUMBER, WHATSAPP_MESSAGE),
  site: SITE_URL,
  ...SOCIAL_LINKS,
}
