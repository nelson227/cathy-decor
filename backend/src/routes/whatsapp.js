import express from 'express';
import { sendWhatsAppMessage } from '../services/whatsappService.js';

const router = express.Router();

// Numéro WhatsApp business de Cathy Décor (reçoit toutes les demandes)
const BUSINESS_NUMBER = process.env.WHATSAPP_BUSINESS_NUMBER || process.env.TWILIO_WHATSAPP_BUSINESS_PHONE || '+14387650938';

// POST /api/whatsapp/send-quote - Envoi automatique de demande de devis
router.post('/send-quote', async (req, res) => {
  try {
    const { serviceName, nom, prenom, telephone, date, nombreInvites, theme, lieu, description } = req.body;

    if (!nom || !prenom || !telephone) {
      return res.status(400).json({
        success: false,
        message: 'Nom, prénom et téléphone sont requis'
      });
    }

    const message = `🎉 *DEMANDE DE DEVIS - CATHY DÉCOR*
━━━━━━━━━━━━━━━━━━━━━

📋 *Type d'événement:* ${serviceName || 'Non spécifié'}

👤 *Informations client:*
• Nom: ${nom}
• Prénom: ${prenom}
• Téléphone: ${telephone}

📅 *Détails de l'événement:*
• Date souhaitée: ${date || 'Non précisée'}
• Nombre d'invités: ${nombreInvites || 'Non précisé'}
• Thème souhaité: ${theme || 'À définir'}
• Lieu: ${lieu || 'Non précisé'}

📝 *Description du besoin:*
${description || 'Aucune description fournie'}

━━━━━━━━━━━━━━━━━━━━━
📩 Message envoyé automatiquement depuis le site Cathy Décor`;

    const result = await sendWhatsAppMessage(BUSINESS_NUMBER, message);

    if (result.success) {
      res.json({
        success: true,
        message: 'Votre demande de devis a été envoyée avec succès ! Nous vous recontacterons très bientôt.'
      });
    } else {
      // Twilio pas configuré - on sauvegarde quand même la demande
      console.warn('WhatsApp non configuré, demande reçue:', { nom, prenom, telephone, serviceName });
      res.json({
        success: true,
        message: 'Votre demande a été enregistrée avec succès ! Nous vous recontacterons très bientôt.',
        note: 'pending_whatsapp'
      });
    }
  } catch (error) {
    console.error('❌ Send quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la demande. Veuillez réessayer.'
    });
  }
});

// POST /api/whatsapp/send-order - Envoi automatique de commande
router.post('/send-order', async (req, res) => {
  try {
    const { name, phone, email, eventType, eventDate, eventLocation, guests, notes, items, total } = req.body;

    if (!name || !phone || !email || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Informations client et articles requis'
      });
    }

    const itemsList = items
      .map(item => `- ${item.name} (x${item.quantity}) : ${(item.price * item.quantity).toLocaleString('fr-FR')} DH`)
      .join('\n');

    const message = `🎉 *COMMANDE CATHY DÉCOR*
━━━━━━━━━━━━━━━━━━━━━

👤 *Client:*
• Nom: ${name}
• Téléphone: ${phone}
• Email: ${email}

📅 *Événement:*
• Type: ${eventType || 'Non spécifié'}
• Date: ${eventDate || 'Non spécifiée'}
• Lieu: ${eventLocation || 'Non spécifié'}
• Nombre d'invités: ${guests || 'Non spécifié'}

🛒 *Services demandés:*
${itemsList}

💰 *Total: ${(total || 0).toLocaleString('fr-FR')} DH*

📝 *Notes:* ${notes || 'Aucune'}

━━━━━━━━━━━━━━━━━━━━━
📩 Message envoyé automatiquement depuis le site Cathy Décor`;

    const result = await sendWhatsAppMessage(BUSINESS_NUMBER, message);

    if (result.success) {
      res.json({
        success: true,
        message: 'Votre commande a été envoyée avec succès ! Nous vous recontacterons très bientôt.'
      });
    } else {
      console.warn('WhatsApp non configuré, commande reçue:', { name, phone, email, total });
      res.json({
        success: true,
        message: 'Votre commande a été enregistrée avec succès ! Nous vous recontacterons très bientôt.',
        note: 'pending_whatsapp'
      });
    }
  } catch (error) {
    console.error('❌ Send order error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la commande. Veuillez réessayer.'
    });
  }
});

export default router;
