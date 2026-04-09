// Variables principales del juego
let turno = 0; // Contador de turnos
let playerHP = 15; // Vida del jugador
let enemyHP = 15;  // Vida del enemigo
let burnTurns = 0; // Turnos de quemadura
let turnoEnProceso = false; // Para evitar turnos sobrepuestos
let combateIniciado = false; // Solo activo después de iniciar combate

// Espera asincrónica
function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Actualiza la UI
function actualizarUI() {
  document.getElementById("turno").textContent = "Turno: " + turno;
  document.getElementById("enemyHp").textContent = "HP Enemigo: " + enemyHP;
  document.getElementById("playerHP").textContent = "HP Propio: " + playerHP;
}

// Escribe en el log
function escribirLog(texto) {
  const log = document.getElementById("logCombate");
  log.innerHTML += "<br>" + texto;
  log.scrollTop = log.scrollHeight;
}

// Muestra modal de victoria/derrota
function mostrarModal(mensaje) {
  const modal = document.getElementById("resultadoModal");
  const texto = document.getElementById("resultadoTexto");
  texto.textContent = mensaje;
  modal.style.display = "flex";
}

// Revisa estado de combate
function revisarEstado() {
  if (!combateIniciado) return; // Ignorar si no se inició combate
  if (enemyHP <= 0) {
    mostrarModal("El enemigo yace derrotado. ¡Eres un héroe de leyenda!");
  } else if (playerHP <= 0) {
    mostrarModal("Tus fuerzas flaquean… la rata celebra su victoria.");
  }
}

// Resolver turno completo
async function resolverTurno() {
  if (turnoEnProceso) return;
  turnoEnProceso = true;
  turno += 1;
  actualizarUI();

  // Revisión inmediata por si ya hubo daño residual
  if (enemyHP <= 0 || playerHP <= 0) {
    turnoEnProceso = false;
    revisarEstado();
    return;
  }

  // Ataque enemigo
  playerHP -= 3;
  if (playerHP < 0) playerHP = 0;
  escribirLog("🐀 La rata te muerde por 3 de daño.");
  actualizarUI();
  await esperar(600);

  // Daño por quemadura
  if (burnTurns > 0) {
    enemyHP -= 1;
    burnTurns -= 1;
    if (enemyHP < 0) enemyHP = 0;
    escribirLog("🔥 La rata sufre 1 de daño por quemadura.");
    actualizarUI();
    await esperar(500);
  }

  turnoEnProceso = false;
  revisarEstado();
}

// Acciones del jugador
function atacar() {
  if (!combateIniciado || turnoEnProceso) return;
  enemyHP -= 2;
  if (enemyHP < 0) enemyHP = 0;
  escribirLog("⚔️ Atacas a la rata por 2 de daño.");
  resolverTurno();
}

function quemar() {
  if (!combateIniciado || turnoEnProceso) return;
  enemyHP -= 1;
  burnTurns = 3;
  escribirLog("🔥 La rata empieza a quemarse.");
  resolverTurno();
}

function pocion() {
  if (!combateIniciado || turnoEnProceso) return;
  playerHP += 3;
  if (playerHP > 15) playerHP = 15;
  escribirLog("❤️ Usas una poción y recuperas 3 HP.");
  resolverTurno();
}

// Reinicio del combate
function reinicio() {
  turno = 0;
  playerHP = 15;
  enemyHP = 15;
  burnTurns = 0;
  turnoEnProceso = false;
  document.getElementById("logCombate").innerHTML = "El combate comienza...";
  actualizarUI();
  document.getElementById("resultadoModal").style.display = "none"; // Ocultar modal al reiniciar
}

// Configuración de eventos al cargar DOM
document.addEventListener("DOMContentLoaded", () => {
  // Ocultar modal de resultado al inicio
  document.getElementById("resultadoModal").style.display = "none";

  // Botón iniciar combate
  document.getElementById("botIniciar").addEventListener("click", () => {
    document.getElementById("inicioModal").style.display = "none";
    reinicio();
    combateIniciado = true; // Activamos el combate
  });

  // Botones de acción
  document.getElementById("bot_ataque").addEventListener("click", atacar);
  document.getElementById("bot_quemar").addEventListener("click", quemar);
  document.getElementById("bot_pocion").addEventListener("click", pocion);

  // Botón reiniciar
  document.getElementById("reiniciar").addEventListener("click", reinicio);

  // Botón volver a intentar desde modal
  document.getElementById("botReintentar").addEventListener("click", () => {
    document.getElementById("resultadoModal").style.display = "none";
    reinicio();
  });
});