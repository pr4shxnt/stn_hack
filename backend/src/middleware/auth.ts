import { Request, Response, NextFunction } from "express";
import nacl from "tweetnacl";
import bs58 from "bs58";

export interface AuthRequest extends Request {
  walletAddress?: string;
}

export const verifySignature = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message, signature, publicKey } = req.body;

    if (!message || !signature || !publicKey) {
      return res.status(400).json({ error: "Missing signature data" });
    }

    // Decode base58 signature and public key
    const signatureUint8 = bs58.decode(signature);
    const publicKeyUint8 = bs58.decode(publicKey);
    const messageUint8 = new TextEncoder().encode(message);

    // Verify signature
    const verified = nacl.sign.detached.verify(
      messageUint8,
      signatureUint8,
      publicKeyUint8,
    );

    if (!verified) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Attach wallet address to request
    req.walletAddress = publicKey;
    next();
  } catch (error) {
    console.error("Signature verification error:", error);
    return res.status(401).json({ error: "Signature verification failed" });
  }
};
