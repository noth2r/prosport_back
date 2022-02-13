class FromToBinary {
    static EncodeUTF8(data) {
      const textEncoderUTF8 = new TextEncoder("utf-8");
      const json = JSON.stringify(data);
      const bytes = textEncoderUTF8.encode(json);

      return bytes;
    }

    static DecodeUTF8(bytes) {
      const textDecoderUTF8 = new TextDecoder("utf-8");
      const decoded = textDecoderUTF8.decode(bytes);
      const data = JSON.parse(decoded);

      return data;
    }
}

module.exports = FromToBinary