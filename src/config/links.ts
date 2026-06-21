import { formatWhatsAppLink } from '@/utils/whatsapp'

export const WHATSAPP_NUMBER = '584141234567'
export const WHATSAPP_MESSAGE = 'Hola, quiero comprar el libro de Victoria'

export const AMAZON_URL = 'https://www.amazon.com/-/es/Audible/dp/B005DGW34C/ref=sr_1_1?__mk_es_US=%C3%85M%C3%85%C5%BD%C3%95%C3%91&sr=8-1' // Reemplazar con la URL real del producto

export const LINKS = {
  amazon: AMAZON_URL,
  whatsapp: formatWhatsAppLink(WHATSAPP_NUMBER, WHATSAPP_MESSAGE),
}
