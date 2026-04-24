
export const toBase64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));

export const fromBase64 = (str) =>
  Uint8Array.from(atob(str), (c) => c.charCodeAt(0)).buffer;

export const base64ToUint8 = (base64) => {
  const binString = atob(base64);
  const size = binString.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
};

export const arrayBufferToBase64 = (buffer) =>
  Buffer.from(buffer).toString("base64");