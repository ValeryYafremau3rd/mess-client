import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  KeyHelper,
  SessionBuilder,
  SessionCipher,
  SignalProtocolAddress,
} from "@privacyresearch/libsignal-protocol-typescript";
import { socket } from "../client";
import { SignalStore } from "./store";
import { arrayBufferToBase64, fromBase64 } from "./signal.utils";

async function generatePreKeys(startId = 1, count = 5) {
  const publicPreKeys = [];
  for (let i = 0; i < count; i++) {
    const keyId = startId + i;
    const preKey = await KeyHelper.generatePreKey(keyId);

    // removed await
    SignalStore.storePreKey(keyId, preKey);

    publicPreKeys.push({
      id: keyId,
      key: arrayBufferToBase64(preKey.keyPair.pubKey),
    });
  }
  return publicPreKeys;
}

export const replenishPreKeys = async function (userId, startId, count = 5) {
  try {
    socket.emit("upload_more_prekeys", {
      userId,
      oneTimePreKeys: generatePreKeys(startId, count),
    });
    console.log("PreKeys uploaded successfully.");
  } catch (error) {
    console.error("Replenishment Error:", error);
  }
};

export const generateAndRegisterKeys = async function (
  userId,
  startId = 1,
  count = 5,
) {
  try {
    let identityKeyPair;
    let registrationId;

    const existingId = await AsyncStorage.getItem("libsignal_registration_id");

    if (!existingId) {
      registrationId = KeyHelper.generateRegistrationId();
      identityKeyPair = await KeyHelper.generateIdentityKeyPair();

      const identityToStore = {
        pubKey: arrayBufferToBase64(identityKeyPair.pubKey),
        privKey: arrayBufferToBase64(identityKeyPair.privKey),
      };

      // .all
      await AsyncStorage.setItem(
        "libsignal_identity_key",
        JSON.stringify(identityToStore),
      );
      await AsyncStorage.setItem(
        "libsignal_registration_id",
        registrationId.toString(),
      );
    } else {
      registrationId = parseInt(existingId);
      const rawIdentity = await AsyncStorage.getItem("libsignal_identity_key");
      const identity = JSON.parse(rawIdentity);
      identityKeyPair = {
        pubKey: fromBase64(identity.pubKey),
        privKey: fromBase64(identity.privKey),
      };
    }

    const signedPreKey = await KeyHelper.generateSignedPreKey(
      identityKeyPair,
      startId,
    );
    //removed await
    SignalStore.storeSignedPreKey(startId, signedPreKey);

    const publicBundle = {
      userId: userId,
      bundle: {
        registrationId: registrationId,
        identityKey: arrayBufferToBase64(identityKeyPair.pubKey),
        signedPreKey: {
          id: startId,
          key: arrayBufferToBase64(signedPreKey.keyPair.pubKey),
          signature: arrayBufferToBase64(signedPreKey.signature),
        },
        oneTimePreKeys: generatePreKeys(startId, count),
      },
    };

    socket.emit("register_keys", publicBundle);
    console.log("Keys successfully registered");
  } catch (error) {
    console.error("Generation Error:", error);
  }
};

export async function decryptPayload(payload: any, remoteId) {
  const remoteAddress = new SignalProtocolAddress(String(remoteId), 1);
  const sessionCipher = new SessionCipher(SignalStore, remoteAddress);
  const plaintext =
    payload?.type === 3
      ? await sessionCipher.decryptPreKeyWhisperMessage(payload.body, "binary")
      : await sessionCipher.decryptWhisperMessage(payload.body, "binary");

  const decoded = new TextDecoder().decode(new Uint8Array(plaintext));
  try {
    return JSON.parse(decoded);
  } catch {
    return decoded;
  }
}

export async function encryptPayload(recipientId, data) {
  const remoteAddress = new SignalProtocolAddress(recipientId, 1);
  const sessionCipher = new SessionCipher(SignalStore, remoteAddress);

  const hasSession = await SignalStore.containsSession(
    remoteAddress.toString(),
  );

  if (!hasSession) {
    console.log("Fetching bundle...");

    const res = await socket.emitWithAck("get_bundle", recipientId);

    const { registrationId, identityKey, signedPreKey, oneTimePreKey } = res;

    const preKeyBundle = {
      registrationId: Number(registrationId),
      identityKey: fromBase64(identityKey),
      signedPreKey: {
        keyId: Number(signedPreKey.id),
        publicKey: fromBase64(signedPreKey.key),
        signature: fromBase64(signedPreKey.signature),
      },
      preKey: {
        keyId: Number(oneTimePreKey.id),
        publicKey: fromBase64(oneTimePreKey.key),
      },
    };

    const builder = new SessionBuilder(SignalStore, remoteAddress);
    await builder.processPreKey(preKeyBundle);
  }

  const plaintext = new TextEncoder().encode(JSON.stringify(data)).buffer;
  const ciphertext = await sessionCipher.encrypt(plaintext);

  return {
    ...ciphertext,
    registrationId: await SignalStore.getLocalRegistrationId(),
  };
}
