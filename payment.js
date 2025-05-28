// api/payment.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { amount } = req.body;

    // Se o valor enviado for menor que R$10,00, rejeitar
    if (amount < 10) {
      return res.status(400).json({ success: false, message: 'O valor mínimo é R$10,00.' });
    }

    try {
      const response = await fetch('https://api.pushpay.com/v1/transactions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer {seu-token-de-api}', // Substitua com o token de API da PushPay
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'BRL',
          description: 'Pagamento via PushPay',
          method: 'credit_card', // ou 'pix' se fosse suportado pela PushPay
        }),
      });

      const data = await response.json();

      if (response.ok) {
        res.status(200).json({ success: true, data });
      } else {
        res.status(400).json({ success: false, error: data });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Método não permitido' });
  }
};
