import { state } from './state.js';
import { enemigoActual } from './enemigos.js';
import { esperar } from './utils.js';

export function actualizarUI() {
  const enemyBar = document.getElementById("enemyHpBar");
  const playerBar = document.getElementById("playerHpBar");

  const enemyPercent = Math.max(enemigoActual.hp, 0) / enemigoActual.hpMax * 100;
  const playerPercent = Math.max(state.playerHP, 0) / state.player.hpMax * 100;

  //texto
  document.getElementById("turno").textContent = "Turno: " + state.turno;
  document.getElementById("enemyHp").childNodes[0].textContent = `HP Enemigo: ${enemigoActual.hp}`;
  document.getElementById("playerHP").childNodes[0].textContent = `HP Propio: ${state.playerHP}`;

  //barras
  enemyBar.style.width = enemyPercent + "%";
  playerBar.style.width = playerPercent + "%";
  // colores
  enemyBar.className = "hp-bar-fill " +
    (enemyPercent > 60 ? "full" : enemyPercent > 30 ? "medium" : "low");

  playerBar.className = "hp-bar-fill " +
    (playerPercent > 60 ? "full" : playerPercent > 30 ? "medium" : "low");
}


export async function escribirLogAnimado(texto, color = "white") {
  const log = document.getElementById("logCombate");
  const span = document.createElement("span");
  span.style.color = color;
  log.appendChild(span);

  for (let i = 0; i < texto.length; i++) {
    span.textContent += texto[i];
    await esperar(25);
  }

  log.appendChild(document.createElement("br"));
  log.scrollTop = log.scrollHeight;
}

export async function animarAtaque(elemento, intensidad = 10) {
  const pasos = [intensidad, -intensidad, intensidad / 2, -intensidad / 2, 0];

  for (let i = 0; i < pasos.length; i++) {
    elemento.style.transform = `translateX(${pasos[i]}px)`;
    await esperar(50);
  }
  elemento.style.transform = "";
}

export function mostrarModal(mensaje) {
  const modal = document.getElementById("resultadoModal");
  document.getElementById("resultadoTexto").textContent = mensaje;
  modal.style.display = "flex";
}