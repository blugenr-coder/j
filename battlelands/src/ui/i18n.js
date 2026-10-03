/* Two languages. UI code writes English through t(); Spanish comes from this
   table, and anything missing falls back to English rather than a blank. */
import { SaveManager } from '../core/SaveManager.js';

const ES = {
  'PLAY': 'JUGAR', 'HOME': 'INICIO', 'COLLECTION': 'COLECCIÓN', 'SHOP': 'TIENDA', 'MISSIONS': 'MISIONES', 'SETTINGS': 'AJUSTES',
  'LEVEL': 'NIVEL', 'SOLO • 32 PLAYERS': 'SOLO • 32 JUGADORES', 'CHANGE': 'CAMBIAR',
  'FINDING PLAYERS...': 'BUSCANDO JUGADORES...', 'PREPARING BATTLEFIELD...': 'PREPARANDO EL CAMPO...', 'DEPLOYING...': 'DESPLEGANDO...',
  'LOADING...': 'CARGANDO...', 'TIP': 'CONSEJO',
  'Stay inside the safe zone.': 'Quédate dentro de la zona segura.',
  'Bushes hide you until you shoot.': 'Los arbustos te ocultan hasta que disparas.',
  'A green arrow on loot means it beats what you carry.': 'Una flecha verde en el botín indica que mejora lo que llevas.',
  'Armor soaks damage before your health does.': 'La armadura absorbe el daño antes que tu salud.',
  'Rooftops hide whoever is inside. Listen for shots.': 'Los tejados ocultan a quien está dentro. Atento a los disparos.',
  'Bridges are choke points. Cross fast or swim slow.': 'Los puentes son cuellos de botella. Cruza rápido o nada despacio.',
  'Spark Cannon wins up close. Longshot wins far away.': 'El Spark Cannon gana de cerca. El Longshot gana de lejos.',
  'Tap to auto-aim. Drag the fire button to aim yourself.': 'Toca para apuntar solo. Arrastra el botón de disparo para apuntar tú.',
  'Heal behind cover, not in the open.': 'Cúrate a cubierto, no a la vista.',
  'CHOOSE YOUR LANDING': 'ELIGE DÓNDE ATERRIZAR', 'TAP THE MAP': 'TOCA EL MAPA', 'DEPLOY': 'SALTAR', 'DEPLOYING IN': 'SALTO EN',
  'HIGH LOOT': 'BOTÍN ALTO',
  'ZONE SHRINKING': 'LA ZONA SE CIERRA', 'ZONE CLOSING IN': 'LA ZONA SE CERRARÁ EN', 'NEW SAFE ZONE': 'NUEVA ZONA SEGURA', 'FINAL ZONE': 'ZONA FINAL',
  'GET TO THE ZONE': 'VE A LA ZONA', 'LOW HEALTH': 'SALUD BAJA',
  'PICK UP': 'COGER', 'SWAP': 'CAMBIAR', 'CURRENT': 'ACTUAL', 'NEW': 'NUEVO', 'BETTER': 'MEJOR', 'FULL': 'LLENO',
  'HEAL': 'CURAR', 'RELOAD': 'RECARGAR', 'EMPTY': 'VACÍO',
  'ELIMINATED': 'ELIMINADO', 'VICTORY!': '¡VICTORIA!', 'YOU WON': 'HAS GANADO', 'LAST ONE STANDING': 'EL ÚLTIMO EN PIE',
  'MATCH COMPLETE': 'PARTIDA TERMINADA', 'PLACE': 'PUESTO', 'OF': 'DE',
  'SURVIVAL TIME': 'TIEMPO VIVO', 'ELIMINATIONS': 'ELIMINACIONES', 'DAMAGE': 'DAÑO', 'XP': 'XP', 'REWARDS': 'RECOMPENSAS',
  'MATCH XP': 'XP DE PARTIDA', 'SURVIVAL XP': 'XP DE SUPERVIVENCIA', 'ELIMINATION XP': 'XP POR ELIMINACIONES', 'PLACEMENT XP': 'XP POR PUESTO', 'MISSION XP': 'XP DE MISIONES',
  'COINS': 'MONEDAS', 'PLAY AGAIN': 'JUGAR OTRA', 'MAIN MENU': 'MENÚ PRINCIPAL', 'LEVEL UP!': '¡SUBES DE NIVEL!',
  'MISSION COMPLETE': 'MISIÓN COMPLETADA', 'ACHIEVEMENT': 'LOGRO',
  'CHARACTERS': 'PERSONAJES', 'EMOTES': 'GESTOS', 'TRAILS': 'ESTELAS', 'VICTORY': 'VICTORIA', 'ICONS': 'ICONOS',
  'EQUIP': 'EQUIPAR', 'EQUIPPED': 'EQUIPADO', 'OWNED': 'TUYO', 'LOCKED': 'BLOQUEADO', 'BUY': 'COMPRAR',
  'COMMON': 'COMÚN', 'RARE': 'RARO', 'EPIC': 'ÉPICO', 'LEGENDARY': 'LEGENDARIO',
  'FEATURED': 'DESTACADO', 'BUNDLES': 'LOTES', 'DAILY GIFT': 'REGALO DIARIO', 'CLAIM': 'RECLAMAR', 'CLAIMED': 'RECLAMADO',
  'NOT ENOUGH COINS': 'NO TIENES MONEDAS SUFICIENTES', 'PURCHASED': 'COMPRADO', 'CONFIRM': 'CONFIRMAR', 'CANCEL': 'CANCELAR',
  'BUY FOR': 'COMPRAR POR', 'REACH LEVEL': 'LLEGA AL NIVEL', 'WIN A MATCH TO UNLOCK': 'GANA UNA PARTIDA PARA DESBLOQUEAR',
  'Fake currency for this prototype. No real payments.': 'Moneda ficticia de prototipo. Sin pagos reales.',
  'DAILY MISSIONS': 'MISIONES DIARIAS', 'ACHIEVEMENTS': 'LOGROS', 'NEW IN': 'NUEVAS EN', 'REWARD': 'RECOMPENSA', 'DONE': 'HECHO',
  'PLAY {n} MATCHES': 'JUEGA {n} PARTIDAS', 'GET {n} ELIMINATIONS': 'CONSIGUE {n} ELIMINACIONES', 'FINISH TOP 10 {n} TIMES': 'QUEDA EN EL TOP 10 {n} VECES',
  'SURVIVE {n}s IN ONE MATCH': 'SOBREVIVE {n}s EN UNA PARTIDA', 'DEAL {n} DAMAGE': 'HAZ {n} DE DAÑO', 'HEAL {n} HEALTH': 'CURA {n} DE SALUD',
  'PICK UP {n} EPIC+ ITEMS': 'COGE {n} OBJETOS ÉPICOS O MEJORES', 'REACH TOP 3': 'LLEGA AL TOP 3',
  'FIRST ELIMINATION': 'PRIMERA ELIMINACIÓN', 'WIN A MATCH': 'GANA UNA PARTIDA', 'PLAY 10 MATCHES': 'JUEGA 10 PARTIDAS', '50 ELIMINATIONS': '50 ELIMINACIONES',
  'TOP 3 FIVE TIMES': 'TOP 3 CINCO VECES', 'OWN 6 CHARACTERS': 'TEN 6 PERSONAJES',
  'GAMEPLAY': 'JUEGO', 'AUDIO': 'AUDIO', 'CONTROLS': 'CONTROLES', 'GRAPHICS': 'GRÁFICOS', 'ACCESSIBILITY': 'ACCESIBILIDAD', 'ACCOUNT': 'CUENTA',
  'Aim assist': 'Ayuda al apuntar', 'Sound': 'Sonido', 'Music': 'Música', 'Vibration': 'Vibración', 'Sensitivity': 'Sensibilidad',
  'Joystick size': 'Tamaño del joystick', 'Joystick': 'Joystick', 'FLOATING': 'FLOTANTE', 'FIXED': 'FIJO', 'Button size': 'Tamaño de botones',
  'Quality': 'Calidad', 'HIGH': 'ALTA', 'LOW': 'BAJA', 'Show FPS': 'Mostrar FPS', 'High contrast': 'Alto contraste', 'Large UI': 'Interfaz grande',
  'Reduced motion': 'Menos movimiento', 'Language': 'Idioma', 'Player name': 'Nombre', 'Replay tutorial': 'Repetir tutorial',
  'RESET SETTINGS': 'RESTABLECER AJUSTES', 'RESET PROGRESS': 'BORRAR PROGRESO', 'ON': 'SÍ', 'OFF': 'NO',
  'Reset all progress? Level, coins and items will be lost.': '¿Borrar todo el progreso? Perderás nivel, monedas y objetos.',
  'Settings restored.': 'Ajustes restablecidos.', 'Progress reset.': 'Progreso borrado.', 'Saved.': 'Guardado.',
  'Progress is saved on this device only.': 'El progreso se guarda solo en este dispositivo.',
  'Storage is blocked: progress will not be kept.': 'El almacenamiento está bloqueado: el progreso no se guardará.',
  'PAUSED': 'PAUSA', 'RESUME': 'SEGUIR', 'LEAVE MATCH': 'ABANDONAR', 'Leave this match? You will be placed where you are.': '¿Abandonar la partida? Te quedarás en el puesto actual.',
  'CLOSE': 'CERRAR', 'MAP': 'MAPA', 'YOU': 'TÚ', 'ALIVE': 'VIVOS', 'KILLS': 'BAJAS',
  'DRAG HERE TO MOVE': 'ARRASTRA AQUÍ PARA MOVERTE', 'TAP TO SHOOT • DRAG TO AIM': 'TOCA PARA DISPARAR • ARRASTRA PARA APUNTAR',
  'WALK OVER LOOT TO GRAB IT': 'PASA POR ENCIMA DEL BOTÍN PARA COGERLO', 'STAY INSIDE THE SAFE ZONE': 'QUÉDATE DENTRO DE LA ZONA SEGURA',
  'TAP THE MAP TO PICK A LANDING SPOT': 'TOCA EL MAPA PARA ELEGIR DÓNDE CAER', 'GOT IT': 'ENTENDIDO', 'SKIP': 'SALTAR',
  'WASD to move • Mouse to aim • Click to shoot': 'WASD para moverte • Ratón para apuntar • Clic para disparar',
  'BEST': 'MEJOR', 'MATCHES': 'PARTIDAS', 'WINS': 'VICTORIAS', 'NAME': 'NOMBRE', 'SAVE': 'GUARDAR',
  'ALIVE ': 'VIVOS ', 'SPECTATING': 'OBSERVANDO', 'NEXT': 'SIGUIENTE', 'Tap to continue': 'Toca para continuar',
  'ARMOR BROKEN': 'ARMADURA ROTA', 'RELOADING': 'RECARGANDO', 'HEALED': 'CURADO', 'ARMOR UP': 'ARMADURA +',
  'UNLOCKED': 'DESBLOQUEADO', 'ITEMS': 'OBJETOS', 'SPECIAL OFFER': 'OFERTA ESPECIAL', 'GET': 'CONSEGUIR',
  'Settings': 'Ajustes', 'CONTINUE': 'CONTINUAR', 'NEW SAFE ZONE IN': 'NUEVA ZONA EN', 'SHRINKING': 'CERRÁNDOSE',
  'FPS': 'FPS', 'LEFT': 'IZQ.', 'OUTSIDE ZONE': 'FUERA DE ZONA', 'GO!': '¡YA!',
};

export function lang() { return SaveManager.data.settings.language; }

export function t(s, vars) {
  let out = lang() === 'es' ? (ES[s] ?? s) : s;
  if (vars) for (const k of Object.keys(vars)) out = out.replace(`{${k}}`, vars[k]);
  return out;
}

export const LANGUAGES = [['en', 'English'], ['es', 'Español']];
