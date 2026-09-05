/* Who is actually making this request.

   `req.socket.remoteAddress` is the truth when the server faces the internet
   directly, and a lie the moment anything sits in front of it. Behind nginx,
   a load balancer, or any platform-as-a-service, every request arrives from
   the proxy — so a per-address rate limit becomes one bucket shared by every
   user in the world, and ten wrong passwords from one person locks out the
   entire site.

   The fix is `X-Forwarded-For`, and the trap is trusting it. That header is
   set by the client on the way in; if the server reads it without a proxy in
   front to overwrite it, an attacker sends a different address on every
   request and the rate limit stops existing at all. Which failure you get
   depends on the deployment, so it cannot be decided here — TRUST_PROXY says
   how many proxies are really in front, and the default of none is the safe
   one for a server started with `npm start` on a laptop. */

/**
 * @param {number} hops  proxies in front of this server. 0 = none.
 */
export function clientAddress(req, hops) {
  if (hops > 0) {
    const header = req.headers['x-forwarded-for'];
    if (header) {
      /* The header is "client, proxy1, proxy2" — appended left to right, so
         the addresses a proxy we trust actually wrote are the rightmost ones.
         Counting in from the right by the number of hops we trust lands on
         the last address the client could not have forged. */
      const chain = String(header).split(',').map(s => s.trim()).filter(Boolean);
      const index = chain.length - hops;
      const address = chain[Math.max(0, index)];
      if (address) return address;
    }
  }
  return req.socket.remoteAddress ?? 'unknown';
}

/** How many proxies to trust, from the environment. */
export function trustedHops(value = process.env.TRUST_PROXY) {
  if (value === undefined || value === '') return 0;
  if (value === 'true') return 1;
  if (value === 'false') return 0;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
