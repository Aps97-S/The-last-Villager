// ui.js
import { enemigoActual } from './enemigos.js';
import { playerHP } from './jugador.js';
import { esperar } from './utils.js';

// Actualiza UI: HP, barras y turnos
export function actualizarUI(turno) {
  const enemyBar = document.getElementById("enemyHpBar");
  const playerBar = document.getElementById("playerHpBar");

  const enemyPercent = Math.max(enemigoActual.hp,0) / enemigoActual.hpMax * 100;
  const playerPercent = Math.max(playerHP,0) / 15 * 100;

  document.getElementById("turno").textContent = "Turno: " + turno;
  document.getElementById("enemyHp").childNodes[0].textContent = `HP Enemigo: ${enemigoActual.hp}`;
  document.getElementById("playerHP").childNodes[0].textContent = `HP Propio: ${playerHP}`;

  // Actualizar ancho de barras
  enemyBar.style.width = enemyPercent + "%";
  playerBar.style.width = playerPercent + "%";

  // Colores por porcentaje
  enemyBar.className = "hp-bar-fill " + (enemyPercent > 60 ? "full" : enemyPercent > 30 ? "medium" : "low");
  playerBar.className = "hp-bar-fill " + (playerPercent > 60 ? "full" : playerPercent > 30 ? "medium" : "low");
}

// Log animado
export async function escribirLogAnimado(texto, color="white") {
  const log = document.getElementById("logCombate");
  const span = document.createElement("span");
  span.style.color = color;
  log.appendChild(span);
  for(let i=0;i<texto.length;i++){
    span.textContent += texto[i];
    await esperar(25);
  }
  log.appendChild(document.createElement("br"));
  log.scrollTop = log.scrollHeight;
}

// Animaciones
export async function animarAtaque(elemento, intensidad=10) {
  const original = elemento.style.transform || "";
  const pasos = [intensidad, -intensidad, intensidad/2, -intensidad/2, 0];
  for(let i=0;i<pasos.length;i++){
    elemento.style.transform = original + ` translateX(${pasos[i]}px)`;
    await esperar(50);
  }
}

// Modal
export function mostrarModal(mensaje) {
  const modal = document.getElementById("resultadoModal");
  const texto = document.getElementById("resultadoTexto");
  texto.textContent = mensaje;
  modal.style.display = "flex";
}