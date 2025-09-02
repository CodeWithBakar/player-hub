const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { pool } = require("../config/database");

const createCheckoutSession = async (req, res) => {
  const { ticketId, quantity, email } = req.body;

  try {
    const ticketResult = await pool.query(
      "SELECT * FROM ticket_types WHERE id = $1",
      [ticketId]
    );
    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found." });
    }
    const ticket = ticketResult.rows[0];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: ticket.name,
              description: `Event ticket for Player Hub event`,
            },
            unit_amount: ticket.price,
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
      customer_email: email,
      metadata: {
        event_id: ticket.event_id,
        ticket_type_id: ticket.id,
        quantity: quantity,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({ error: "Failed to create payment session." });
  }
};

// Stripe Webhook Handler
const handleWebhook = (req, res) => {
  console.log("Stripe webhook received:", req.body);
  res.status(200).send();
};

module.exports = { createCheckoutSession, handleWebhook };
