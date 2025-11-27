import { decodeBase64 } from "@webpush-libs/encryption/dist/utils.js";
import { decrypt } from "@webpush-libs/encryption";

export async function decryptPayload({ body, remotePublicKey, authSecret, privateKey }) {
  return decrypt({
    payload: Buffer.from(body, "base64"),
    remotePublicKey: decodeBase64(remotePublicKey),
    auth: decodeBase64(authSecret),
    privateKey: decodeBase64(privateKey),
  });
}
