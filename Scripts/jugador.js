// jugador.js
import { resolverTurno, turnoEnProceso } from './turnos.js';
import { escribirLogAnimado, animarAtaque, actualizarUI } from './ui.js';
import { enemigoActual } from './enemigos.js';

export let playerHP = 15;

// Acciones del jugador
export async function atacar() {
  if (turnoEnProceso) return;
  enemigoActual.hp -= 2;
  if (!enemigoActual.sangradoResistente) enemigoActual.efectos.sangrado += 2;
  await animarAtaque(document.querySelector(".hero-img"));
  await escribirLogAnimado(
    `⚔️ Atacas a ${enemigoActual.nombre} por 2 y aplicas 2 stacks de sangrado`,
    "white"
  );
  actualizarUI(); // actualizar HP antes de turno enemigo
  await resolverTurno();
}
export async function quemar() {
  if (turnoEnProceso) return;
  enemigoActual.hp -= 1;
  if (!enemigoActual.burnResistente) enemigoActual.efectos.quemadura = 3;
  await animarAtaque(document.querySelector(".hero-img"));
  await escribirLogAnimado(`🔥 ${enemigoActual.nombre} empieza a quemarse`, "orange");
  actualizarUI();
  await resolverTurno();
}

export async function pocion() {
  if (turnoEnProceso) return;
  playerHP += 5;
  if (playerHP > 15) playerHP = 15;
  await escribirLogAnimado("❤️ Usas una poción y recuperas 5 HP", "green");
  actualizarUI();
  await resolverTurno();
}

// Reinicia el combate
export function reinicio() {
  playerHP = 15;
  enemigoActual.hp = enemigoActual.hpMax;
  enemigoActual.efectos.quemadura = 0;
  enemigoActual.efectos.sangrado = 0;
  turnos.turno = 0;
  turnos.turnoEnProceso = false;
  document.getElementById("logCombate").innerHTML = "El combate comienza...";
  actualizarUI(turnos.turno);
  document.getElementById("resultadoModal").style.display = "none";
}