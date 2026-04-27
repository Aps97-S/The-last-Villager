import { state } from './state.js';

export async function cargarPersonaje() {
  const res = await fetch("./Assets/data/personaje.json");
  const data = await res.json();

  state.player = data.hope;
  state.playerHP = state.player.hpMax;
}