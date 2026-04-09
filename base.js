// Variables principales del juego
let turno = 0;// Contador de turnos
let playerHP = 15;// Vida del jugador
let enemyHP = 15;// Vida del enemigo
let burnTurns = 0;// Turnos de quemadura
let bleedStacks = 0; //Turnos de sangrado
let turnoEnProceso = false;// Para evitar turnos sobrepuestos
let combateIniciado = false;// Solo activo después de iniciar combate

// Función de espera asincrónica
function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Actualiza la UI de HP y turnos
function actualizarUI() {
  document.getElementById("turno").textContent = "Turno: " + turno;
  document.getElementById("enemyHp").childNodes[0].textContent = "HP Enemigo: " + enemyHP;
  document.getElementById("playerHP").childNodes[0].textContent = "HP Propio: " + playerHP;

  // Calcular porcentaje de HP
  const enemyPercent = Math.max(enemyHP, 0) / 15 * 100;
  const playerPercent = Math.max(playerHP, 0) / 15 * 100;

  // Actualizar ancho de barra
  const enemyBar = document.getElementById("enemyHpBar");
  const playerBar = document.getElementById("playerHpBar");
  enemyBar.style.width = enemyPercent + "%";
  playerBar.style.width = playerPercent + "%";

  // Cambiar clase según porcentaje
  enemyBar.className = "hp-bar-fill " + (enemyPercent > 60 ? "full" : enemyPercent > 30 ? "medium" : "low");
  playerBar.className = "hp-bar-fill " + (playerPercent > 60 ? "full" : playerPercent > 30 ? "medium" : "low");
}

// Log animado con color
async function escribirLogAnimado(texto, color = "white") {
  const log = document.getElementById("logCombate");
  const span = document.createElement("span");
  span.style.color = color;
  log.appendChild(span);
  for (let i = 0; i < texto.length; i++) {
    span.textContent += texto[i];
    await esperar(25);
  }
  log.appendChild(document.createElement("br"));
  log.scrollTop = log.scrollHeight;
}

// Animación simple de ataque (shake) centrada
async function animarAtaque(elemento, intensidad = 10) {
  const original = elemento.style.transform || "";
  const pasos = [intensidad, -intensidad, intensidad / 2, -intensidad / 2, 0];
  for (let i = 0; i < pasos.length; i++) {
    elemento.style.transform = original + ` translateX(${pasos[i]}px)`;
    await esperar(50);
  }
}

// Muestra modal de victoria/derrota
function mostrarModal(mensaje) {
  const modal = document.getElementById("resultadoModal");
  const texto = document.getElementById("resultadoTexto");
  texto.textContent = mensaje;
  modal.style.display = "flex";
}

// Revisa estado del combate
function revisarEstado() {
  if (!combateIniciado) return;
  if (enemyHP <= 0) {
    mostrarModal("El enemigo yace derrotado. Lograste pasar una noche más");
  } else if (playerHP <= 0) {
    mostrarModal("Tus fuerzas flaquean… la rata celebra su victoria.");
  }
}

// Aplica daño residual por quemadura con efecto visual
async function aplicarQuemadura() {
  if (burnTurns > 0) {
    const enemy = document.querySelector(".enemy-img");
    // efecto visual
    enemy.style.filter = "brightness(1.5) sepia(1) hue-rotate(-20deg)";
    await esperar(300);
    enemy.style.filter = "";

    enemyHP -= 1;
    if (enemyHP < 0) enemyHP = 0;
    await escribirLogAnimado("🔥 La rata sufre 1 de daño por quemadura.", "orange");
    actualizarUI();
    burnTurns -= 1;
  }
}

// Resolver turno completo
async function resolverTurno() {
  if (turnoEnProceso) return;
  turnoEnProceso = true;
  turno += 1;
  actualizarUI();

  // Verificar si ya terminó combate antes de continuar
  if (enemyHP <= 0 || playerHP <= 0) {
    turnoEnProceso = false;
    revisarEstado();
    return;
  }

  // Ataque enemigo
  playerHP -= 3;
  if (playerHP < 0) playerHP = 0;
  await animarAtaque(document.querySelector(".enemy-img"));
  await escribirLogAnimado("🐀 La rata te muerde por 3 de daño.", "red");
  actualizarUI();
  await esperar(300);

  // Daño por quemadura
  await aplicarQuemadura();
  //Daño por sangrado
  await aplicarSangrado();
  turnoEnProceso = false;
  revisarEstado();
}

// Acciones del jugador
async function atacar() {
  if (!combateIniciado || turnoEnProceso) return;
  enemyHP -= 2;
  bleedStacks += 2;
  if (enemyHP < 0) enemyHP = 0;
  await animarAtaque(document.querySelector(".hero-img"));
  await escribirLogAnimado("⚔️ Atacas a la rata por 2 de daño y aplicas 2 stacks de sangrado.", "white");
  actualizarUI();
  await resolverTurno();
}

async function quemar() {
  if (!combateIniciado || turnoEnProceso) return;
  enemyHP -= 1;
  burnTurns = 3;
  await animarAtaque(document.querySelector(".hero-img"));
  await escribirLogAnimado("🔥 La rata empieza a quemarse y recibe 1 de daño del antorcha.", "orange");
  actualizarUI();
  await resolverTurno();
}

async function pocion() {
  if (!combateIniciado || turnoEnProceso) return;
  playerHP += 3;
  if (playerHP > 15) playerHP = 15;
  await escribirLogAnimado("❤️ Usas una poción y recuperas 3 HP.", "green");
  actualizarUI();
  await resolverTurno();
}

async function aplicarSangrado() {

  if (bleedStacks <= 0) return;

  const enemy = document.querySelector(".enemy-img");

  // efecto visual sangrado
  enemy.style.filter = "brightness(0.7) sepia(1) hue-rotate(-50deg)";
  await esperar(250);
  enemy.style.filter = "";

  enemyHP -= bleedStacks;

  if (enemyHP < 0) enemyHP = 0;

  await escribirLogAnimado(
    `🩸 El sangrado inflige ${bleedStacks} de daño (${bleedStacks} stacks).`,
    "crimson"
  );

  actualizarUI();
  bleedStacks--;
}
// Reinicia el combate
function reinicio() {
  turno = 0;
  playerHP = 15;
  enemyHP = 15;
  burnTurns = 0;
  bleedStacks = 0;
  turnoEnProceso = false;
  document.getElementById("logCombate").innerHTML = "El combate comienza...";
  actualizarUI();
  document.getElementById("resultadoModal").style.display = "none";
}

// Configuración de eventos al cargar DOM
document.addEventListener("DOMContentLoaded", () => {
  // Ocultar modal de resultado al inicio
  document.getElementById("resultadoModal").style.display = "none";

  // Botón iniciar combate
  document.getElementById("botIniciar").addEventListener("click", () => {
    document.getElementById("inicioModal").style.display = "none";
    reinicio();
    combateIniciado = true;// Activamos el combate
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

//Barras de vida 
if (enemyPercent <= 30) document.getElementById("enemyHpBar").className = "hp-bar-fill critical";
else if (enemyPercent <= 60) document.getElementById("enemyHpBar").className = "hp-bar-fill low";
else document.getElementById("enemyHpBar").className = "hp-bar-fill";