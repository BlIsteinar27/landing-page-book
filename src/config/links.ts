import { formatWhatsAppLink } from "@/utils/whatsapp";
import { RedSocial } from "@/types/red-social";

// ========== URL DEL SITIO ==========
export const SITE_URL = "https://victoriaquerales.com";

// ========== WHATSAPP ==========
export const WHATSAPP_NUMBER = "584247203076";
export const WHATSAPP_MESSAGE =
  "Hola, quiero reservar el libro Los Dos Reinos de Victoria";

// ========== AMAZON ==========
export const AMAZON_URL = "https://www.amazon.com/dp/B0HMK4FGYV";

// ========== REDES SOCIALES ==========
export const SOCIAL_LINKS: Record<string, RedSocial> = {
  instagram: {
    url: "https://www.instagram.com/victoria_aql",
    handle: "@victoria_aql",
    plataforma: "instagram",
  },
  tiktok: {
    url: "https://tiktok.com/@victoria_aql",
    handle: "@victoria_aql",
    plataforma: "tiktok",
  },
};

// Mantener compatibilidad con imports existentes que usan SOCIAL_LINKS.instagram como string
export const SOCIAL_LINKS_FLAT = {
  instagram: SOCIAL_LINKS.instagram.url,
  tiktok: SOCIAL_LINKS.tiktok.url,
  instagramHandle: SOCIAL_LINKS.instagram.handle,
  tiktokHandle: SOCIAL_LINKS.tiktok.handle,
};

// ========== LINKS CONSOLIDADOS ==========
export const LINKS = {
  amazon: AMAZON_URL,
  whatsapp: formatWhatsAppLink(WHATSAPP_NUMBER, WHATSAPP_MESSAGE),
  site: SITE_URL,
  ...SOCIAL_LINKS_FLAT,
};
