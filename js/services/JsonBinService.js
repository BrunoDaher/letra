class JsonBinService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.jsonbin.io/v3/b"; 
  }

  async executar({ metodo = 'GET', binId, dados = null, jsonPath = null }) {
    const url = `${this.baseUrl}/${binId}`;
    const meusHeaders = new Headers();
    
    meusHeaders.append("Content-Type", "application/json");
    meusHeaders.append("X-Access-Key", this.apiKey);
    meusHeaders.append("X-Bin-Meta", "false");

    // Adiciona o filtro JSON Path se ele for passado
    if (jsonPath) {
      meusHeaders.append("X-JSON-Path", jsonPath);
    }

    const configuracao = {
      method: metodo,
      headers: meusHeaders
    };

    if (metodo !== 'GET' && dados) {
      configuracao.body = JSON.stringify(dados);
    }

    try {
      const resposta = await fetch(url, configuracao);
      if (!resposta.ok) {
        const erro = await resposta.json().catch(() => ({ message: "Erro" }));
        throw new Error(erro.message || `Erro ${resposta.status}`);
      }
      return await resposta.json();
    } catch (erro) {
      console.error("Erro no Service:", erro.message);
      throw erro;
    }
  }

  async ler(id, filtroPath = null) {
    return await this.executar({ metodo: 'GET', binId: id, jsonPath: filtroPath });
  }

  async salvar(id, conteudo) {
    return await this.executar({ metodo: 'PUT', binId: id, dados: conteudo });
  }
}

export default JsonBinService;