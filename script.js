window.addEventListener('DOMContentLoaded', () => {
  const player = document.getElementById('player');

  function startMusic() {
    player.play().then(() => {
      console.log("🎵 Música reproducida");
    }).catch(e => {
      console.log("❌ Autoplay bloqueado:", e);
    });

    // Quitamos los listeners después de la primera interacción
    document.removeEventListener('click', startMusic);
    document.removeEventListener('scroll', startMusic);
    document.removeEventListener('keydown', startMusic);
  }

  document.addEventListener('click', startMusic);
  document.addEventListener('scroll', startMusic);
  document.addEventListener('keydown', startMusic);
});
const images = [
  'foto_uno.jpg',
  'foto_dos.jpg',
  'foto_tres.jpg',
  'foto_cuatro.jpg',
  'foto_cinco.jpg',
  'foto_seis.jpg',
  'foto_siete.jpg',
  'foto_ocho.jpg'
];

let current = 0;
const imgEl = document.getElementById('slideshow-img');

function showImage(index) {
  imgEl.src = `assets/img/${images[index]}`;
}

document.getElementById('prev').addEventListener('click', () => {
  current = (current - 1 + images.length) % images.length;
  showImage(current);
});

document.getElementById('next').addEventListener('click', () => {
  current = (current + 1) % images.length;
  showImage(current);
});
function felicitar() {
  const msg = new SpeechSynthesisUtterance("Feliz cumpleaños Abril, te queremos mucho!!!");
  speechSynthesis.speak(msg);
}
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  document.getElementById('flot1').style.transform = `translate(${x}px, ${y}px)`;
  document.getElementById('flot2').style.transform = `translate(${-x}px, ${-y}px)`;
});

// Opcional: cambia cada 4 segundos
setInterval(() => {
  current = (current + 1) % images.length;
  showImage(current);
}, 4000);
const audioPlayer = document.getElementById('player');
const canciones = [
  'cancion_uno.mp3',
  'cancion_dos.mp3',
  'cancion_tres.mp3',
  'cancion_cuatro.mp3',
  'cancion_cinco.mp3'
];

let currentSong = 0;
function generarEstrellas(cantidad = 100) {
  const contenedor = document.getElementById('estrellas');
  for (let i = 0; i < cantidad; i++) {
    const star = document.createElement('div');
    star.classList.add('estrella');
    star.style.top = Math.random() * 100 + 'vh';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.animationDuration = (1 + Math.random() * 2) + 's';
    star.style.opacity = Math.random();
    contenedor.appendChild(star);
  }
}

window.addEventListener('load', generarEstrellas);

function reproducirCancion(index) {
  audioPlayer.src = `assets/audio/${canciones[index]}`;
  audioPlayer.play().catch(e => console.log("Autoplay bloqueado:", e));
}
function lanzarConfeti() {
  for (let i = 0; i < 100; i++) {
    const confeti = document.createElement('div');
    confeti.className = 'confeti';
    confeti.style.left = Math.random() * 100 + 'vw';
    confeti.style.animationDuration = 2 + Math.random() * 3 + 's';
    document.body.appendChild(confeti);
    setTimeout(() => confeti.remove(), 5000);
  }
}

window.addEventListener('load', lanzarConfeti);

// Cuando termina una canción, pasa a la siguiente
audioPlayer.addEventListener('ended', () => {
  currentSong = (currentSong + 1) % canciones.length;
  reproducirCancion(currentSong);
});

// Reproducción tras interacción (click, scroll, key)
function iniciarPlaylist() {
  reproducirCancion(currentSong);
  document.removeEventListener('click', iniciarPlaylist);
  document.removeEventListener('scroll', iniciarPlaylist);
  document.removeEventListener('keydown', iniciarPlaylist);
}

document.addEventListener('click', iniciarPlaylist);
document.addEventListener('scroll', iniciarPlaylist);
document.addEventListener('keydown', iniciarPlaylist);
