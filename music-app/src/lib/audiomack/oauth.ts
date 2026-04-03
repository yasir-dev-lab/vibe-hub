import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

const CONSUMER_KEY = process.env.AUDIOMACK_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.AUDIOMACK_CONSUMER_SECRET || '';

const oauth = new OAuth({
  consumer: {
    key: CONSUMER_KEY,
    secret: CONSUMER_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString: string, key: string) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64');
  },
});

export function signRequest(
  method: string,
  url: string,
  token?: { key: string; secret: string }
) {
  const requestData = {
    url,
    method,
  };

  const authData = token
    ? { ...oauth.authorize(requestData, token) }
    : { ...oauth.authorize(requestData) };

  return authData;
}

export function toHeader(oauthData: Record<string, string>) {
  return oauth.toHeader(oauthData);
}
