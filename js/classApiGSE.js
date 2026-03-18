/**
 * LyricsEngine - Módulo de busca de letras de música
 * Prioriza LRCLIB (grátis/direto) com fallback para Google CSE
 */
export default class LyricsEngine {
    constructor(config = {}) {
        // Credenciais do Google (opcionais, para o motor secundário)
        this.googleApiKey = config.apiKey || null;
        this.googleCx = config.cx || null;
        
        // Proxy para contornar bloqueios de CORS em raspagem direta (opcional)
        this.proxy = "https://api.allorigins.win/get?url=";
    }

    /**
     * Método principal: busca a letra em todos os motores disponíveis
     * @param {string} artist - Nome do artista
     * @param {string} track - Nome da música
     * @returns {Promise<Object>} Objeto com a letra e metadados
     */
    async search(artist, track) {
        if (!artist || !track) {
            throw new Error("Artista e música são obrigatórios.");
        }

        console.log(`[LyricsEngine] Iniciando busca para: ${artist} - ${track}`);

        // 1. Tentativa Primária: LRCLIB (Rápido, sem API Key, texto limpo)
        const fromLrc = await this.fetchLRCLIB(artist, track);
        if (fromLrc && fromLrc.content) {
            return { ...fromLrc, engine: 'LRCLIB' };
        }

        // 2. Tentativa Secundária: Google Custom Search (Se configurado)
        if (this.googleApiKey && this.googleCx) {
            console.log("[LyricsEngine] LRCLIB falhou. Tentando Google CSE...");
            const googleLink = await this.fetchGoogleLink(`${artist} ${track} lyrics`);
            
            if (googleLink) {
                return {
                    content: "Letra encontrada via Google, mas requer acesso direto.",
                    url: googleLink,
                    engine: 'GoogleSearch',
                    note: "O CORS do navegador impede a extração automática do texto deste link."
                };
            }
        }

        throw new Error("Não foi possível encontrar a letra nos motores disponíveis.");
    }

    /**
     * MÉTODO PRIVADO: Busca no LRCLIB
     */
    async fetchLRCLIB(artist, track) {
        try {
            const query = `artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(track)}`;
            const response = await fetch(`https://lrclib.net/api/get?${query}`);
            
            if (!response.ok) return null;

            const data = await response.json();
            return {
                content: data.plainLyrics || null,
                synced: data.syncedLyrics || null,
                instrumental: data.instrumental || false
            };
        } catch (err) {
            console.error("Erro no motor LRCLIB:", err);
            return null;
        }
    }

    /**
     * MÉTODO PRIVADO: Busca link no Google CSE
     */
    async fetchGoogleLink(query) {
        try {
            const url = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleCx}&q=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                return data.items[0].link; // Retorna o primeiro link (geralmente Genius ou Letras.mus)
            }
            return null;
        } catch (err) {
            console.error("Erro no motor Google:", err);
            return null;
        }
    }
}