import dns from "dns/promises";

export default async function handler(req, res) {
  const email = req.query.email || "";

  if (!email.includes("@")) {
    return res.status(200).json({
      status: "invalid",
      reason: "bad format"
    });
  }

  const domain = email.split("@")[1];

  try {
    const mx = await dns.resolveMx(domain);

    if (mx && mx.length > 0) {
      return res.status(200).json({
        status: "valid",
        reason: "mx found"
      });
    } else {
      return res.status(200).json({
        status: "invalid",
        reason: "no mx"
      });
    }

  } catch (e) {
    return res.status(200).json({
      status: "invalid",
      reason: "domain error"
    });
  }
}
