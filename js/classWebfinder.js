
export default class webFinder{


    async  buscarHTML(url) {
   
          const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);

          const res = await fetch(proxyUrl);
          if (!res.ok) throw new Error('Erro na requisição: ' + res.status);

          const html = await res.text();
          const parser = new DOMParser();
          
    const doc = parser.parseFromString(html, 'text/html');
    const container = doc.body; // Aqui você pode manipular os filhos


      const lyrics = container.querySelector('#lyrics');

     
       return lyrics.innerHTML;
    }
      


      async  getText(url){

        let lyrics = await this.buscarHTML(url);

       
        return await this.buscarHTML(url);
        
      }

}

