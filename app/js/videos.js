const enderecoAtual = window.location.href;
let href = enderecoAtual.split("index.html")[0];
const enderecoJsonLocal = "http://localhost:3000/videos";
const arquivoJson = href + "app/backend/videos.json";

let usarLocalStorage = false;

async function checkApiAvailability() {
  try {
    const response = await fetch(enderecoJsonLocal, {
      method: "HEAD",
      timeout: 2000,
    });
    return response.ok;
  } catch (e) {
    console.log(e + " Localhost API não disponível, usando localStorage...");
    return false;
  }
}

async function initializeLocalStorage() {
  try {
    if (!window.localStorage.getItem("videos")) {
      const response = await fetch(arquivoJson);
      if (response.ok) {
        const data = await response.json();
        window.localStorage.setItem("videos", JSON.stringify(data));
        console.log("Dados inicializados do arquivo JSON para localStorage");
      } else {
        window.localStorage.setItem("videos", JSON.stringify([]));
      }
    }
  } catch (error) {
    console.error("Erro ao inicializar localStorage:", error);
    window.localStorage.setItem("videos", JSON.stringify([]));
  }
}

async function initApi() {
  const apiDisponivel = await checkApiAvailability();
  usarLocalStorage = !apiDisponivel;

  if (usarLocalStorage) {
    await initializeLocalStorage();
    console.log("Usando localStorage como banco de dados");
  } else {
    console.log("Usando API localhost");
  }
}
const localStorageOp = {
  buscarVideos: async function () {
    try {
      const data = JSON.parse(window.localStorage.getItem("videos") || "[]");
      return Array.isArray(data) ? data : data.videos || [];
    } catch (error) {
      console.error(`[Erro em buscarVideos]: ${error.message}`);
      return [];
    }
  },
};
const fakeAPIOp = {
  buscarVideos: async function () {
    try {
      const res = await fetch(enderecoJsonLocal);
      const ideiasJson = await res.json();
      return ideiasJson;
    } catch (error) {
      console.error(`[Erro em buscarVideos]: ${error.message}`);
      return [];
    }
  },
};

export const api = {
  init: initApi,
  buscarVideos: async function () {
    return usarLocalStorage
      ? await localStorageOp.buscarVideos()
      : await fakeAPIOp.buscarVideos();
  },
};
