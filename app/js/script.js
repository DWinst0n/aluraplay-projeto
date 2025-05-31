import { buscarEMostrarVideos } from "carregarVideos.js";
import { api } from "videos.js";
import { YT } from "iframeApi.js";

window.addEventListener("DOMContentLoaded", async () => {
  await api.init();

  let players = {};
  function onYouTubeIframeAPIReady() {
    document.querySelectorAll("iframe").forEach((iframe, index) => {
      const playerId = `player${index}`;
      iframe.id = playerId;
      players[playerId] = new YT.Player(playerId, {
        events: {
          onReady: onPlayerReady,
        },
      });
    });
  }

  function onPlayerReady(event) {
    const iframe = event.target.getIframe();
    let hoverTimeout;
    let videoIniciado = false;

    iframe.addEventListener("mouseenter", () => {
      hoverTimeout = setTimeout(() => {
        event.target.mute();
        event.target.playVideo();
        videoIniciado = true;
      }, 800);
    });

    iframe.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimeout);

      if (videoIniciado) {
        const oldIframe = event.target.getIframe();
        const iframeContainer = oldIframe.parentNode;
        const newIframe = oldIframe.cloneNode(true);

        iframeContainer.replaceChild(newIframe, oldIframe);

        new YT.Player(newIframe.id, {
          events: {
            onReady: onPlayerReady,
          },
        });

        videoIniciado = false;
      }
    });
  }

  await buscarEMostrarVideos();
  onYouTubeIframeAPIReady();
});

const barraDePesquisa = document.querySelector(".pesquisar__input");
barraDePesquisa.addEventListener("input", filtrarPesquisa);
function filtrarPesquisa() {
  const videos = document.querySelectorAll(".videos__item");

  if (barraDePesquisa.value != "") {
    for (let video of videos) {
      let titulo = video
        .querySelector(".titulo-video")
        .textContent.toLowerCase();
      let valorFiltro = barraDePesquisa.value.toLowerCase();

      if (!titulo.includes(valorFiltro)) {
        video.style.display = "none";
      } else {
        video.style.display = "block";
      }
    }
  } else {
    for (let video of videos) {
      video.style.display = "block";
    }
  }
}

const botaoCategoria = document.querySelectorAll(".superior__item");
botaoCategoria.forEach((botao) => {
  let nomeCategoria = botao.textContent;
  botao.addEventListener("click", () => filtrarPorCategoria(nomeCategoria));
});

function filtrarPorCategoria(filtro) {
  const videos = document.querySelectorAll(".videos__item");
  for (let video of videos) {
    let categoria = video.querySelector(".categoria").textContent.toLowerCase();
    let valorFiltro = filtro.toLowerCase();

    if (!categoria.includes(valorFiltro) && valorFiltro != "tudo") {
      video.style.display = "none";
    } else {
      video.style.display = "block";
    }
  }
}
