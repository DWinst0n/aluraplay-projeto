import { api } from "./videos.js";

const containerVideos = document.querySelector(".videos__container");

export async function buscarEMostrarVideos() {
  try {
    const videos = await api.buscarVideos();

    videos.forEach((video, i) => {
      if (video.categoria == "") {
        throw new Error("Vídeo não tem categoria");
      }
      containerVideos.innerHTML += `
                <li class="videos__item">
                    <iframe id="player${i}" width="100%" height="72%" src="${video.url}?enablejsapi=1" title="${video.titulo}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="descricao-video">
                        <img src="${video.imagem}" alt="Logo do Canal">
                        <div class="descricao__texto">
                            <h3>${video.titulo}</h3>
                            <p>${video.descricao}</p>
                            <p class="categoria" hidden>${video.categoria}</p>
                        </div>
                    </div>
                </li>
                `;
    });
  } catch (error) {
    containerVideos.innerHTML = `<p> Houve um erro ao carregar os vídeos: ${error}</p>`;
  }
}
