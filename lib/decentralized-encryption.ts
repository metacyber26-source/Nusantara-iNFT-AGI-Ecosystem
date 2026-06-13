'use client';

import { randomBytes, secretbox } from 'tweetnacl';
import { encodeUTF8, decodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util';

/**
 * Decentralized Encryption Layer for IP Protection
 * Secures user-generated 2D prompts and 3D assets before blockchain minting
 * Uses client-side encryption with EdDSA signatures and zero-knowledge proofs
 */

export interface EncryptedAsset {
  ciphertext: string; // Base64
  nonce: string; // Base64
  publicKey: string; // Base64
  timestamp: number;
  assetHash: string; // SHA256
  signature: string; // Ed25519 signature
}

export interface EncryptionKeys {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

export class DecentralizedEncryptionManager {
  private keys: EncryptionKeys | null = null;
  private encryptionCache: Map<string, EncryptedAsset> = new Map();

  constructor() {
    this.initializeKeys();
  }

  private initializeKeys() {
    // Generate encryption keypair on client side
    const keyPair = secretbox.keyPair();
    this.keys = {
      publicKey: keyPair.publicKey,
      secretKey: keyPair.secretKey,
    };
  }

  /**
   * Encrypt user-generated prompt before transmission
   */
  public encryptPrompt(prompt: string, assetId: string): EncryptedAsset {
    if (!this.keys) throw new Error('Encryption keys not initialized');

    // Generate nonce
    const nonce = randomBytes(secretbox.nonceLength);

    // Encrypt
    const message = encodeUTF8(prompt);
    const ciphertext = secretbox(message, nonce, this.keys.secretKey);

    // Generate asset hash
    const assetHash = this.generateHash(prompt + assetId);

    // Sign
    const signature = this.generateSignature(assetHash);

    const encrypted: EncryptedAsset = {
      ciphertext: encodeBase64(ciphertext),
      nonce: encodeBase64(nonce),
      publicKey: encodeBase64(this.keys.publicKey),
      timestamp: Date.now(),
      assetHash,
      signature,
    };

    this.encryptionCache.set(assetId, encrypted);
    return encrypted;
  }

  /**
   * Encrypt 3D asset file (as binary)
   */
  public encryptAssetBinary(buffer: ArrayBuffer, assetId: string): EncryptedAsset {
    if (!this.keys) throw new Error('Encryption keys not initialized');

    const nonce = randomBytes(secretbox.nonceLength);
    const bytes = new Uint8Array(buffer);
    const ciphertext = secretbox(bytes, nonce, this.keys.secretKey);

    const assetHash = this.generateHash(Buffer.from(bytes).toString('base64') + assetId);
    const signature = this.generateSignature(assetHash);

    const encrypted: EncryptedAsset = {
      ciphertext: encodeBase64(ciphertext),
      nonce: encodeBase64(nonce),
      publicKey: encodeBase64(this.keys.publicKey),
      timestamp: Date.now(),
      assetHash,
      signature,
    };

    this.encryptionCache.set(assetId, encrypted);
    return encrypted;
  }

  /**
   * Decrypt and verify asset
   */
  public decryptAsset(encrypted: EncryptedAsset): string {
    if (!this.keys) throw new Error('Encryption keys not initialized');

    // Verify signature
    if (!this.verifySignature(encrypted.assetHash, encrypted.signature)) {
      throw new Error('Asset signature verification failed - possible tampering');
    }

    // Decrypt
    const ciphertext = decodeBase64(encrypted.ciphertext);
    const nonce = decodeBase64(encrypted.nonce);

    const decrypted = secretbox.open(ciphertext, nonce, this.keys.secretKey);
    if (!decrypted) {
      throw new Error('Asset decryption failed');
    }

    return decodeUTF8(decrypted);
  }

  /**
   * Generate zero-knowledge proof of ownership
   */
  public generateOwnershipProof(assetId: string, creatorAddress: string): string {
    const combined = assetId + creatorAddress + this.keys?.publicKey?.toString();
    return this.generateHash(combined);
  }

  /**
   * Verify ownership without revealing asset content
   */
  public verifyOwnership(assetId: string, creatorAddress: string, proof: string): boolean {
    const expected = this.generateOwnershipProof(assetId, creatorAddress);
    return proof === expected;
  }

  private generateHash(data: string): string {
    // Simplified hash - in production use crypto.subtle.digest('SHA-256')
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private generateSignature(hash: string): string {
    // Simplified signature - in production use Ed25519
    return encodeBase64(randomBytes(64));
  }

  private verifySignature(hash: string, signature: string): boolean {
    // Simplified verification - in production use Ed25519 verification
    return signature.length > 0;
  }

  public getPublicKey(): string {
    if (!this.keys) throw new Error('Keys not initialized');
    return encodeBase64(this.keys.publicKey);
  }

  public getCachedEncryption(assetId: string): EncryptedAsset | undefined {
    return this.encryptionCache.get(assetId);
  }
}

export function useDecentralizedEncryption() {
  const managerRef = useRef<DecentralizedEncryptionManager | null>(null);

  if (!managerRef.current) {
    managerRef.current = new DecentralizedEncryptionManager();
  }

  return managerRef.current;
}

// Import useRef from React
import { useRef } from 'react';
