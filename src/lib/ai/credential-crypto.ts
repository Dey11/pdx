import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const ENVELOPE_VERSION = "v1";

const decodeEncryptionKey = (encodedKey: string): Buffer => {
  const key = Buffer.from(encodedKey, "base64");

  if (key.length !== 32 || key.toString("base64") !== encodedKey) {
    throw new Error(
      "BYOK_ENCRYPTION_KEY must be exactly 32 bytes encoded as base64"
    );
  }

  return key;
};

/** Encrypts a provider API key into a versioned, authenticated envelope. */
export const encryptApiKey = (apiKey: string, encodedKey: string): string => {
  const key = decodeEncryptionKey(encodedKey);
  const nonce = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, nonce);
  const ciphertext = Buffer.concat([
    cipher.update(apiKey, "utf8"),
    cipher.final(),
  ]);

  return [
    ENVELOPE_VERSION,
    nonce.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(".");
};

/** Decrypts an API key after authenticating the complete stored envelope. */
export const decryptApiKey = (envelope: string, encodedKey: string): string => {
  const [version, nonce, authTag, ciphertext, extra] = envelope.split(".");

  if (
    version !== ENVELOPE_VERSION ||
    !nonce ||
    !authTag ||
    !ciphertext ||
    extra
  ) {
    throw new Error("Unsupported or malformed API key envelope");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    decodeEncryptionKey(encodedKey),
    Buffer.from(nonce, "base64url")
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64url")),
    decipher.final(),
  ]).toString("utf8");
};

export const getApiKeyHint = (apiKey: string): string =>
  `••••${apiKey.slice(-4)}`;
