import AsyncStorage from "@react-native-async-storage/async-storage";
import { base64ToUint8, fromBase64, toBase64 } from "./signal.utils";


export const SignalStore = {
  async getIdentityKeyPair() {
    let json = await AsyncStorage.getItem("libsignal_identity_key");

    const keyPair = JSON.parse(json);
    const pubBytes = base64ToUint8(keyPair.pubKey);
    const privBytes = base64ToUint8(keyPair.privKey);

    return {
      pubKey: pubBytes.buffer,
      privKey: privBytes.buffer,
    };
  },

  async getLocalRegistrationId() {
    const id = await AsyncStorage.getItem("libsignal_registration_id");
    return id ? Number(id) : undefined;
  },

  async loadPreKey(keyId) {
    const json = await AsyncStorage.getItem(`prekey_${keyId}`);
    if (!json) return undefined;
    const data = JSON.parse(json);
    return {
      pubKey: fromBase64(data.pubKey),
      privKey: fromBase64(data.privKey),
    };
  },

  async storePreKey(keyId, keyPair) {
    const data = {
      keyId,
      pubKey: toBase64(keyPair.keyPair.pubKey),
      privKey: toBase64(keyPair.keyPair.privKey),
    };
    return await AsyncStorage.setItem(`prekey_${keyId}`, JSON.stringify(data));
  },

  async storeSignedPreKey(keyId, keyPair) {
    const data = {
      keyId,
      pubKey: toBase64(keyPair.keyPair.pubKey),
      privKey: toBase64(keyPair.keyPair.privKey),
      signature: toBase64(keyPair.signature),
    };
    return await AsyncStorage.setItem(
      `signed_prekey_${keyId}`,
      JSON.stringify(data),
    );
  },

  async loadSession(identifier) {
    const session = await AsyncStorage.getItem(`session_${identifier}`);
    return session ?? undefined;
  },

  async containsSession(addressStr) {
    try {
      const session = await AsyncStorage.getItem(`session_${addressStr}`);
      return session !== null;
    } catch (error) {
      console.error("Error checking session:", error);
      return false;
    }
  },

  async storeSession(identifier, record) {
    return await AsyncStorage.setItem(`session_${identifier}`, record);
  },

  async removePreKey(keyId) {
    return await AsyncStorage.removeItem(`prekey_${keyId}`);
  },

  async loadSignedPreKey(keyId) {
    const json = await AsyncStorage.getItem(`signed_prekey_${keyId}`);
    if (!json) return undefined;
    const data = JSON.parse(json);
    return {
      pubKey: fromBase64(data.pubKey),
      privKey: fromBase64(data.privKey),
    };
  },

  async removeSignedPreKey(keyId) {
    return await AsyncStorage.removeItem(`signed_prekey_${keyId}`);
  },

  async loadIdentityKey(identifier) {
    return await AsyncStorage.getItem(`identity_key_${identifier}`);
  },

  async saveIdentity(identifier, key) {
    await AsyncStorage.setItem(`identity_key_${identifier}`, key);
    return true;
  },

  async isTrustedIdentity() {
    return true;
  },
};
