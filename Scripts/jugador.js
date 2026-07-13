import { state } from './state.js';
import { enemigoActual } from './enemigos.js';
import { resolverTurno } from './turnos.js';
import { escribirLogAnimado, animarAtaque, actualizarUI } from './ui.js';

export async function atacar() {
  if (state.turnoEnProceso) return;
  state.turnoEnProceso = true;

  enemigoActual.hp -= state.player.habilidades.ataque.danio;
  if (enemigoActual.hp < 0) enemigoActual.hp = 0;

  enemigoActual.efectos.sangrado += state.player.habilidades.ataque.sangrado;

  await animarAtaque(document.querySelector(".hero-wrapper"));
  await escribirLogAnimado(
    `⚔️ ${state.player.nombre} ataca por ${state.player.habilidades.ataque.danio}`,
    "white"
  );

  actualizarUI();
  resolverTurno();
}

export async function quemar() {
  if (state.turnoEnProceso) return;
  state.turnoEnProceso = true;

  enemigoActual.hp -= state.player.habilidades.quemar.danio;
  if (enemigoActual.hp < 0) enemigoActual.hp = 0;

  enemigoActual.efectos.quemadura = state.player.habilidades.quemar.quemadura;

  await animarAtaque(document.querySelector(".hero-wrapper"));
  await escribirLogAnimado("🔥 Usas la antorcha y aplicas quemadura", "orange");

  actualizarUI();
  resolverTurno();
}

export async function pocion() {
  if (state.turnoEnProceso) return;
  state.turnoEnProceso = true;

  state.playerHP += state.player.habilidades.pocion.curacion;

  if (state.playerHP > state.player.hpMax) {
    state.playerHP = state.player.hpMax;
  }

  await escribirLogAnimado(`❤️ Tomas una pocion y recuperas ${state.player.habilidades.pocion.curacion} HP`, "green");

  actualizarUI();
  resolverTurno();
}


export function reinicio() {
  state.turno = 0;
  state.playerHP = state.player.hpMax;
  state.turnoEnProceso = false;

  enemigoActual.hp = enemigoActual.hpMax;
  enemigoActual.efectos.sangrado = 0;
  enemigoActual.efectos.quemadura = 0;

  document.getElementById("logCombate").innerHTML = "El combate comienza...";
  actualizarUI();
}