/**
 * Formatea un enlace de WhatsApp con número de teléfono y mensaje predeterminado
 * @param phoneNumber - Número de teléfono (ej: "584141234567")
 * @param message - Mensaje predeterminado
 * @returns URL completa de WhatsApp
 */
export function formatWhatsAppLink(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
