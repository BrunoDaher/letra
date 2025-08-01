class Seg {
    constructor() {
      this.key = null;
    }
  
    // Função para gerar uma chave criptográfica
    async generateKey() {
      this.key = await crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt']
      );
    }
  
    // Função para criptografar dados
    async encryptData(data) {
      if (!this.key) {
        throw new Error('A chave criptográfica ainda não foi gerada.');
      }
  
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(data);
  
      const iv = crypto.getRandomValues(new Uint8Array(12));
  
      const ciphertext = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        this.key,
        encodedData
      );
  
      return { ciphertext, iv };
    }
  
    // Função para descriptografar dados
    async decryptData(ciphertext, iv) {
      if (!this.key) {
        throw new Error('A chave criptográfica ainda não foi gerada.');
      }
  
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        this.key,
        ciphertext
      );
  
      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    }
    // Função para criptografar um objeto JavaScript
    async encryptObject(obj) {
      if (!this.key) {
        throw new Error('A chave criptográfica ainda não foi gerada.');
      }

      const jsonString = JSON.stringify(obj);
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(jsonString);
  
      const iv = crypto.getRandomValues(new Uint8Array(12));
  
      const ciphertext = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.key,
        encodedData
      );

      return { ciphertext, iv };
    }

    // Função para descriptografar um objeto JavaScript
    async decryptObject(ciphertext, iv) {
      if (!this.key) {
        throw new Error('A chave criptográfica ainda não foi gerada.');
      }

      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        this.key,
        ciphertext
      );

      const decoder = new TextDecoder();
      const jsonString = decoder.decode(decryptedData);

      
      return JSON.parse(jsonString);
    }
} 

  
  
export default Seg;