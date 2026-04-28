import validator from 'email-validator';
import dns from 'dns/promises';

export default async function handler(req, res) {
  const email = (req.query.email || '').trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ status: 'error', message: 'missing email' });
  }

  if (!validator.validate(email)) {
    return res.status(200).json({ email, status: 'invalid', reason: 'bad format' });
  }

  const domain = email.split('@')[1];

  try {
    const mx = await dns.resolveMx(domain);
    if (!mx || mx.length === 0) {
      return res.status(200).json({ email, status: 'invalid', reason: 'no mx' });
    }

    return res.status(200).json({
      email,
      status: 'valid',
      reason: 'format ok + mx found'
    });
  } catch (e) {
    return res.status(200).json({ email, status: 'invalid', reason: 'domain failed' });
  }
}
