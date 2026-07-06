#!/usr/bin/env node
/**
 * Point fmtkit.wu101.com at the fmtkit Cloudflare Pages project.
 * Requires CLOUDFLARE_API_TOKEN with Pages Edit + Zone DNS Edit (+ Zone Read).
 */

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

const PROJECT = 'fmtkit';
const ZONE_NAME = 'wu101.com';
const CUSTOM_DOMAIN = 'fmtkit.wu101.com';
const DNS_NAME = 'fmtkit';

if (!TOKEN || !ACCOUNT_ID) {
  console.error('CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required');
  process.exit(1);
}

const api = async (path, { method = 'GET', body } = {}) => {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!json.success) {
    const msg = json.errors?.map((e) => e.message).join('; ') || res.statusText;
    throw new Error(`${method} ${path}: ${msg}`);
  }
  return json.result;
};

async function resolveZoneId() {
  if (ZONE_ID) {
    console.log(`Using CLOUDFLARE_ZONE_ID: ${ZONE_ID}`);
    return ZONE_ID;
  }
  for (const path of [`/zones?name=${ZONE_NAME}`, `/accounts/${ACCOUNT_ID}/zones?name=${ZONE_NAME}`]) {
    try {
      const zones = await api(path);
      const zone = zones.find((z) => z.name === ZONE_NAME);
      if (zone) {
        console.log(`Zone ID: ${zone.id}`);
        return zone.id;
      }
    } catch (e) {
      console.warn(String(e.message));
    }
  }
  throw new Error(
    'Could not resolve zone ID. Set CLOUDFLARE_ZONE_ID secret or grant Zone Read on the API token.',
  );
}

async function pagesSubdomain() {
  const project = await api(`/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}`);
  const subdomain = project.subdomain ?? `${PROJECT}.pages.dev`;
  const target = subdomain.includes('.') ? subdomain : `${subdomain}.pages.dev`;
  console.log(`Pages target: ${target}`);
  return target;
}

async function ensurePagesDomain() {
  const domains = await api(`/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/domains`);
  const exists = domains.some((d) => d.name === CUSTOM_DOMAIN);
  if (exists) {
    console.log(`Pages custom domain already attached: ${CUSTOM_DOMAIN}`);
    return;
  }
  await api(`/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/domains`, {
    method: 'POST',
    body: { name: CUSTOM_DOMAIN },
  });
  console.log(`Attached Pages custom domain: ${CUSTOM_DOMAIN}`);
}

async function ensureDnsCname(zoneId, target) {
  const query = new URLSearchParams({ name: CUSTOM_DOMAIN, type: 'CNAME' });
  const records = await api(`/zones/${zoneId}/dns_records?${query}`);
  const payload = {
    type: 'CNAME',
    name: DNS_NAME,
    content: target,
    proxied: true,
    ttl: 1,
  };

  if (records.length > 0) {
    const record = records[0];
    if (record.content === target && record.proxied === true) {
      console.log(`DNS already correct: ${CUSTOM_DOMAIN} -> ${target}`);
      return;
    }
    await api(`/zones/${zoneId}/dns_records/${record.id}`, { method: 'PATCH', body: payload });
    console.log(`Updated DNS: ${CUSTOM_DOMAIN} -> ${target}`);
    return;
  }

  await api(`/zones/${zoneId}/dns_records`, { method: 'POST', body: payload });
  console.log(`Created DNS: ${CUSTOM_DOMAIN} -> ${target}`);
}

const zoneId = await resolveZoneId();
const target = await pagesSubdomain();
await ensurePagesDomain();
await ensureDnsCname(zoneId, target);
console.log(`Done. https://${CUSTOM_DOMAIN} should be live shortly.`);
