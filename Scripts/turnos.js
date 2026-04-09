// turnos.js
import { enemigoActual } from './enemigos.js';
import { escribirLogAnimado, animarAtaque, mostrarModal, actualizarUI } from './ui.js';
import { playerHP } from './jugador.js';

export let turno = 0;
export let turnoEnProceso = false;

export async function resolverTurno() {
  if (turnoEnProceso) return;
  turnoEnProceso = true;
  turno++;
  actualizarUI(turno);

  if (enemigoActual.hp <= 0 || playerHP <= 0) {
    turnoEnProceso = false;
    revisarEstado();
    return;
  }

  for (let i = 0; i < enemigoActual.ataquesPorTurno; i++) {
    playerHP -= enemigoActual.ataque;
    if (playerHP < 0) playerHP = 0;
    await animarAtaque(document.querySelector(".enemy-img"));
    await escribirLogAnimado(`🐀 ${enemigoActual.nombre} te ataca por ${enemigoActual.ataque}`, "red");
    actualizarUI(turno);
  }

  // Quemadura
  if (enemigoActual.efectos.quemadura > 0) {
    enemigoActual.hp -= 1;
    enemigoActual.efectos.quemadura--;
    await escribirLogAnimado(`🔥 ${enemigoActual.nombre} recibe 1 de quemadura`, "orange");
    actualizarUI(turno);
  }

  // Sangrado
  if (enemigoActual.efectos.sangrado > 0 && !enemigoActual.sangradoResistente) {
    enemigoActual.hp -= enemigoActual.efectos.sangrado;
    await escribirLogAnimado(
      `🩸 ${enemigoActual.nombre} sufre ${enemigoActual.efectos.sangrado} de sangrado`,
      "crimson"
    );
    enemigoActual.efectos.sangrado--;
    actualizarUI(turno);
  }

  turnoEnProceso = false;
  revisarEstado();
}

export function revisarEstado() {
  if (playerHP <= 0) {
    mostrarModal("Tus fuerzas flaquean… el enemigo te ha vencido.");
  } else if (enemigoActual.hp <= 0) {
    mostrarModal(`¡Has derrotado a ${enemigoActual.nombre}!`);
  }
}