import { Buffer } from "buffer";
import * as Crypto from "expo-crypto";
import "react-native-get-random-values";

global.Buffer = Buffer;

const randomBytes = (size) => {
  const bytes = Crypto.getRandomValues(new Uint8Array(size));
  return Buffer.from(bytes);
};

const nodeCryptoMock = {
  randomBytes: randomBytes,
  default: {
    randomBytes: randomBytes,
  },
};

global.nodeCrypto = nodeCryptoMock;

try {
  if (!global.crypto || !global.crypto.randomBytes) {
    global.crypto = Object.assign(global.crypto || {}, nodeCryptoMock);
  }
} catch (e) {
  console.log("Global.crypto is read-only, using global.nodeCrypto fallback.");
}
