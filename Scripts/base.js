// main.js
import { reinicio, atacar, quemar, pocion } from './jugador.js';

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("resultadoModal").style.display = "none";
  document.getElementById("inicioModal").style.display = "flex";

  document.getElementById("botIniciar").addEventListener("click", () => {
    document.getElementById("inicioModal").style.display = "none";
    reinicio();
  });

  document.getElementById("bot_ataque").addEventListener("click", atacar);
  document.getElementById("bot_quemar").addEventListener("click", quemar);
  document.getElementById("bot_pocion").addEventListener("click", pocion);

  document.getElementById("reiniciar").addEventListener("click", reinicio);

  document.getElementById("botReintentar").addEventListener("click", () => {
    document.getElementById("resultadoModal").style.display = "none";
    reinicio();
  });
  });