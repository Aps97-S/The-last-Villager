import { enemigoActual } from './enemigos.js';
import { state } from './state.js';
import { escribirLogAnimado, animarAtaque, mostrarModal, actualizarUI } from './ui.js';

export async function resolverTurno() {
  state.turno++;
  actualizarUI();

  if (enemigoActual.hp <= 0 || state.playerHP <= 0) {
    state.turnoEnProceso = false;
    revisarEstado();
    return;
  }

  for (let i = 0; i < enemigoActual.ataquesPorTurno; i++) {
    state.playerHP -= enemigoActual.ataque;
    if (state.playerHP < 0) state.playerHP = 0;

    await animarAtaque(document.querySelector(".enemy-wrapper"));
    await escribirLogAnimado(`${enemigoActual.emoji} ${enemigoActual.nombre} te ataca por ${enemigoActual.ataque}`, "red");
    actualizarUI();
  }

  // quemadura
  if (enemigoActual.efectos.quemadura > 0) {
    enemigoActual.hp -= 1;
    if (enemigoActual.hp < 0) enemigoActual.hp = 0;
    enemigoActual.efectos.quemadura--;
    await escribirLogAnimado(`🔥 ${enemigoActual.nombre} recibe 1 de quemadura`, "orange");
  }

  // sangrado
  if (enemigoActual.efectos.sangrado > 0 && !enemigoActual.sangradoResistente) {
    enemigoActual.hp -= enemigoActual.efectos.sangrado;
    if (enemigoActual.hp < 0) enemigoActual.hp = 0;
    await escribirLogAnimado(`🩸 ${enemigoActual.nombre} sufre ${enemigoActual.efectos.sangrado} de sangrado`, "crimson");
    enemigoActual.efectos.sangrado--;
  }

  state.turnoEnProceso = false;
  revisarEstado();
}

function revisarEstado() {
  if (state.playerHP <= 0) {
    mostrarModal("Has sido derrotado");
  } else if (enemigoActual.hp <= 0) {
    mostrarModal(`Has derrotado a ${enemigoActual.nombre}`);
  }
}