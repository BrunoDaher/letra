import JsonBinService from '../JsonBinService.js';

class AuthService {
  constructor(apiKey, usersBinId) {
    this.api = new JsonBinService(apiKey);
    this.usersBinId = usersBinId;
  }

  async login(username, password) {
    try {
      // O JSON Path filtra apenas o objeto que tem o username correspondente
      // Exemplo de Path: $[?(@.username=="pearl_user")]
      const filtro = `$[?(@.username=="${username}")]`;
      
      const resultado = await this.api.ler(this.usersBinId, filtro);

      // Se o filtro não encontrar nada, retorna um array vazio
      if (!resultado || resultado.length === 0) {
        throw new Error("Usuário não encontrado.");
      }

      const usuarioCerto = resultado[0];

      // Verifica a senha localmente após o filtro
      if (usuarioCerto.password === password) {
        sessionStorage.setItem('user_bin_id', usuarioCerto.userListId);
        sessionStorage.setItem('is_auth', 'true');
        return { success: true, listId: usuarioCerto.userListId };
      }

      throw new Error("Senha incorreta.");
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  estaLogado() {
    return sessionStorage.getItem('is_auth') === 'true';
  }

  getBinId() {
    return sessionStorage.getItem('user_bin_id');
  }
}

export default AuthService;