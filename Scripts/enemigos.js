// enemigos.js
export const enemigos = {
  rata: {
    nombre: "Rata",
    hpMax: 15,
    hp: 15,
    ataque: 3,
    ataquesPorTurno: 1,
    sangradoResistente: false,
    burnResistente: false,
    efectos: { sangrado: 0, quemadura: 0 },
    asset: "./Assets/Rat.png"
  },
  lobo: {
    nombre: "Lobo",
    hpMax: 25,
    hp: 25,
    ataque: 3,
    ataquesPorTurno: 2,
    sangradoResistente: false,
    burnResistente: false,
    efectos: { sangrado: 0, quemadura: 0 },
    asset: "./Assets/wolf.png"
  },
  caballero: {
    nombre: "Caballero",
    hpMax: 40,
    hp: 40,
    ataque: 4,
    ataquesPorTurno: 1,
    sangradoResistente: true,
    burnResistente: false,
    efectos: { sangrado: 0, quemadura: 0 },
    asset: "./Assets/Dark_knight.png"
  }
};

export let enemigoActual = enemigos.rata;

export function seleccionarEnemigo(nombre) {
  if (!enemigos[nombre]) return;
  enemigoActual = enemigos[nombre];
}