import { state } from './state.js';
import { enemigoActual } from './enemigos.js';
import { resolverTurno } from './turnos.js';
import { escribirLogAnimado, animarAtaque, actualizarUI } from './ui.js';

// cargar personaje activo
export async function cargarPersonaje() {
  const res = await fetch("./Assets/data/personaje.json");
  const data = await res.json();

  state.player=data.hope;
  state.playerHP = state.player.hpMax;
}

export async function atacar() {
  if (state.turnoEnProceso) return;

  enemigoActual.hp -= state.player.habilidades.ataque.danio;

  enemigoActual.efectos.sangrado += state.player.habilidades.ataque.sangrado;

  await animarAtaque(document.querySelector(".hero-img"));
  await escribirLogAnimado(
    `⚔️ ${state.player.nombre} ataca por ${state.player.habilidades.ataque.danio}`,
    "white"
  );

  actualizarUI();
  resolverTurno();
}

export async function quemar() {
  if (state.turnoEnProceso) return;

  enemigoActual.hp -= state.player.habilidades.quemar.danio;

  enemigoActual.efectos.quemadura = state.player.habilidades.quemar.quemadura;

  await escribirLogAnimado("🔥 Usas la antorcha y aplicas quemadura", "orange");

  actualizarUI();
  resolverTurno();
}

export async function pocion() {
  if (state.turnoEnProceso) return;

  state.playerHP += state.player.habilidades.pocion.curacion;

  if (state.playerHP > state.player.hpMax) {
    state.playerHP = state.player.hpMax;
  }

  await escribirLogAnimado("❤️ Tomas una pocion y recuperas 5 HP", "green");

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