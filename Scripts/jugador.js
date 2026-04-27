import { state } from './state.js';
import { enemigoActual } from './enemigos.js';
import { resolverTurno } from './turnos.js';
import { escribirLogAnimado, animarAtaque, actualizarUI } from './ui.js';

export async function atacar() {
  if (state.turnoEnProceso) return;

  enemigoActual.hp -= 2;

  if (!enemigoActual.sangradoResistente) {
    enemigoActual.efectos.sangrado += 2;
  }

  await animarAtaque(document.querySelector(".hero-img"));
  await escribirLogAnimado(`⚔️ Atacas a ${enemigoActual.nombre} por 2 y aplicas 2 stacks de sangrado`,
    "white");

  actualizarUI();
  await resolverTurno();
}

export async function quemar() {
  if (state.turnoEnProceso) return;

  enemigoActual.hp -= 1;
  enemigoActual.efectos.quemadura = 3;

  await escribirLogAnimado(`🔥 Quemadura aplicada`, "orange");

  actualizarUI();
  await resolverTurno();
}

export async function pocion() {
  if (state.turnoEnProceso) return;

  state.playerHP += 5;
  if (state.playerHP > 15) state.playerHP = 15;

  await escribirLogAnimado("❤️ Te curas 5 HP", "green");

  actualizarUI();
  resolverTurno();
}

export function reinicio() {
  state.turno = 0;
  state.playerHP = 15;
  state.turnoEnProceso = false;

  enemigoActual.hp = enemigoActual.hpMax;
  enemigoActual.efectos.sangrado = 0;
  enemigoActual.efectos.quemadura = 0;

  document.getElementById("logCombate").innerHTML = "El combate comienza...";
  actualizarUI();
}