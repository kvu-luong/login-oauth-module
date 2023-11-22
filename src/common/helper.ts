import * as crypto from 'crypto';
// Function to generate a random code verifier
export const generateCodeVerifier = () => {
  return base64URLEncode(crypto.randomBytes(32));
};
// Function to generate a code challenge from a code verifier
export const generateCodeChallenge = (codeVerifier: string) => {
  const hashed = crypto.createHash('sha256').update(codeVerifier).digest();
  return base64URLEncode(hashed);
};

// Function to URL-safe Base64 encode
export const base64URLEncode = (buffer) => {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};
