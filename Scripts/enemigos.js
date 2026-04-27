let enemigos = {};
export let enemigoActual = null;

// cargar JSON
export async function cargarEnemigos() {
  const res = await fetch("./Assets/data/enemigos.json");
  enemigos = await res.json();

  enemigoActual = JSON.parse(JSON.stringify(enemigos.rata));
}

// cambiar enemigo
export function seleccionarEnemigo(nombre) {
  if (!enemigos[nombre]) return;

  enemigoActual = JSON.parse(JSON.stringify(enemigos[nombre]));
}

// reset enemigo actual
export function resetEnemigo() {
  enemigoActual = JSON.parse(JSON.stringify(enemigos.rata));
}