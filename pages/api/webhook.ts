import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false, // Stripe benötigt den rohen Request-Body
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10', // oder die aktuelle Stripe-Version, die du nutzt
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let event;

  try {
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'] as string;

    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook error:', err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  // ✅ Stripe-Event verarbeiten
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      // Beispiel: E-Mail loggen
      console.log('✅ Zahlung abgeschlossen für:', session.customer_email);

      // TODO: Zugriff aktivieren, Datenbank aktualisieren etc.
      break;

    // andere Events kannst du genauso hinzufügen

    default:
      console.log(`📌 Unbehandelter Eventtyp: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
