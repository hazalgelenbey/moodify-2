const moods = {
  happy: {
    color: "#ffe066",
    videos: [
      { id: "khD07C-YDL4", title: "Mutlu Mod Şarkı" },
    ]
  },
  sad: {
    color: "#a29bfe",
    videos: [
      { id: "n7iuaTlGbd4", title: "Hüzünlü Mod Şarkı" },
    ]
  },
  neseli: {
    color: "#ff7675",
    videos: [
      { id: "VfDGDpNkQps", title: "Neşeli Mod Şarkı" },
    ]
  },
  calm: {
    color: "#55efc4",
    videos: [
      { id: "luv7rM994Q4", title: "Rahat Mod Şarkı" },
    ]
  }
};

const buttons = document.querySelectorAll("[data-mood]");
const playerContainer = document.getElementById("player-container");
const favoritesList = document.getElementById("favorites-list");
const darkModeBtn = document.getElementById("dark-mode-toggle");

let currentVideo = null;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


// Butonlara tıklayınca video oynat
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const mood = btn.getAttribute("data-mood");
    playRandomVideo(mood);
  });
});

// Rastgele video seç ve oynat
function playRandomVideo(mood) {
  const { color, videos } = moods[mood];
  document.body.style.backgroundColor = color;
  const randomIndex = Math.floor(Math.random() * videos.length);
  currentVideo = videos[randomIndex];
  renderPlayer(currentVideo);
}

// Videoyu iframe içine ekle ve favori butonu ekle
function renderPlayer(video) {
  playerContainer.innerHTML = `
    <iframe 
      src="https://www.youtube.com/embed/${video.id}?autoplay=1" 
      allow="autoplay; encrypted-media" allowfullscreen></iframe>
    <button id="fav-btn" style="margin-top:1rem; padding:0.7rem 1.2rem; font-size:1rem; cursor:pointer;">
      ${isFavorite(video.id) ? "⭐ Favorilerden Kaldır" : "⭐ Favorilere Ekle"}
    </button>
  `;

  document.getElementById("fav-btn").onclick = () => {
    toggleFavorite(video);
  };
}

// Favori kontrolü
function isFavorite(id) {
  return favorites.some(v => v.id === id);
}

// Favori ekle/kaldır
function toggleFavorite(video) {
  if (isFavorite(video.id)) {
    favorites = favorites.filter(v => v.id !== video.id);
  } else {
    favorites.push(video);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
  renderPlayer(currentVideo); // Buton metnini güncellemek için
}

// Favorileri listele
function renderFavorites() {
  favoritesList.innerHTML = "";
  if (favorites.length === 0) {
    favoritesList.innerHTML = "<p>Henüz favori eklenmedi.</p>";
    return;
  }
  favorites.forEach(video => {
    const div = document.createElement("div");
    div.className = "favorite-item";
    div.textContent = video.title;
    div.onclick = () => {
      currentVideo = video;
      renderPlayer(video);
      // Arka plan rengini ruh haline göre değiştir
      for(let mood in moods) {
        if (moods[mood].videos.some(v => v.id === video.id)) {
          document.body.style.backgroundColor = moods[mood].color;
          break;
        }
      }
    };
    favoritesList.appendChild(div);
  });
}
// Sayfa yüklendiğinde favorileri göster
renderFavorites();