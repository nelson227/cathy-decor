import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Initialize Twilio client only if credentials are provided
const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

// Service WhatsApp avec Twilio
export const sendWhatsAppMessage = async (phoneNumber, message) => {
  if (!client) {
    console.warn('WhatsApp: Twilio not configured. Skipping message.');
    return { 
      success: false, 
      error: 'Twilio not configured',
      message: 'Configure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to enable WhatsApp' 
    };
  }

  try {
    const response = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phoneNumber}`,
      body: message
    });
    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error('WhatsApp Error:', error);
    return { success: false, error: error.message };
  }
};

// Générer message formaté comme dans le prompt
export const generateOrderMessage = (order) => {
  const itemsList = order.items
    .map(item => `- ${item.name} (x${item.quantity}): ${(item.price * item.quantity).toLocaleString('fr-FR')} DH`)
    .join('\n');

  const message = `🎉 *COMMANDE CATHY DÉCOR*

*Numéro de commande:* ${order.orderNumber}

*Client:*
Nom: ${order.customer.name}
Téléphone: ${order.customer.phone}
Email: ${order.customer.email}

*Événement:*
Type: ${order.event.type}
Date: ${order.event.date ? new Date(order.event.date).toLocaleDateString('fr-FR') : 'Non spécifiée'}
Lieu: ${order.event.location}
Nombre d'invités: ${order.event.guests || 'Non spécifié'}
Budget estimé: ${order.event.budget ? order.event.budget.toLocaleString('fr-FR') + ' DH' : 'Non spécifié'}

*Services demandés:*
${itemsList}

*Total:* ${order.total.toLocaleString('fr-FR')} DH

*Notes spéciales:*
${order.customer.notes || 'Aucune'}

Merci de nous avoir choisis! Nous vous recontacterons sous peu.`;

  return message;
};

// Lien WhatsApp direct
export const generateWhatsAppLink = (phoneNumber, message) => {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

export default {
  sendWhatsAppMessage,
  generateOrderMessage,
  generateWhatsAppLink
};
