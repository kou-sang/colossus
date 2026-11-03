/*
 * Consejos y errores comunes compartidos por una familia de ejercicios (deben valer para TODOS sus integrantes).
 * Los pasos son propios de cada ejercicio (ver guides/*.js). `cuesFrom` reutiliza las claves de entrenadores de otra familia.
 */
export const GUIDE_FAMILIES = {
  // ───────── Pecho ─────────
  press: {
    tips: [
      'Junta los omóplatos y llévalos hacia abajo antes de bajar el peso: el pecho queda alto y el hombro protegido.',
      'Baja en 2–3 segundos y sube con fuerza, sin rebotar.',
      'Mantén las muñecas rectas, apiladas sobre los codos.',
    ],
    mistakes: [
      'Rebotar el peso en el pecho para subir más.',
      'Despegar la cabeza, los hombros o la cadera del apoyo.',
      'Doblar las muñecas hacia atrás: la carga se va a la articulación.',
    ],
  },
  fly: {
    tips: [
      'Usa menos peso que en el press: con el brazo largo la palanca sobre el hombro es mucho mayor.',
      'Siente el estiramiento abajo, pero sin rebotar.',
      'Mantén fijo el ángulo de los codos en todo el recorrido.',
    ],
    mistakes: [
      'Bajar más allá de la línea del torso y forzar el hombro.',
      'Doblar y estirar los codos durante el arco (se convierte en un press).',
    ],
    cuesFrom: 'fly',
  },
  pullover: {
    tips: [
      'Mantén el ángulo de los codos fijo: el movimiento es solo del hombro.',
      'Empieza liviano hasta conocer tu movilidad: el estiramiento detrás de la cabeza es intenso.',
    ],
    mistakes: [
      'Arquear la zona lumbar para bajar más.',
      'Flexionar los codos al bajar y estirarlos al subir (pasa a ser un press de tríceps).',
    ],
  },
  chestMachine: {
    tips: [
      'Ajusta el asiento antes de cargar: las manijas deben salir a la altura indicada del pecho.',
      'Mantén la espalda y la cabeza apoyadas en todo el recorrido.',
      'Controla la vuelta: que la pila de pesas no golpee.',
    ],
    mistakes: [
      'Asiento demasiado bajo o alto: el esfuerzo pasa a los hombros.',
      'Despegar la espalda del respaldo para empujar más.',
    ],
    cuesFrom: 'chestMachine',
  },
  pecDeck: {
    tips: [
      'Piensa en llevar los codos hacia adelante, no las manos.',
      'Usa un peso que te permita controlar la vuelta.',
    ],
    mistakes: [
      'Abrir demasiado hacia atrás: estresa la parte frontal del hombro.',
      'Doblar y estirar los codos durante el movimiento.',
      'Despegar la espalda del respaldo.',
    ],
    cuesFrom: 'fly',
  },
  cableCross: {
    tips: [
      'El cable mantiene la tensión en todo el recorrido: aprovecha la parte final con una pausa.',
      'Mantén el torso quieto: el movimiento es solo de los brazos.',
    ],
    mistakes: [
      'Tirar con los hombros adelantados y la espalda redondeada.',
      'Balancear el cuerpo para mover el peso.',
      'Dejar que el cable te arrastre hacia atrás en la vuelta.',
    ],
    cuesFrom: 'cableCross',
  },
  cablePress: {
    tips: [
      'Con un pie adelantado el cuerpo queda estable y el cable no te arrastra.',
      'Exhala al empujar y vuelve controlando el peso.',
    ],
    mistakes: [
      'Inclinarte hacia adelante para empujar con el peso del cuerpo.',
      'Subir los hombros hacia las orejas.',
    ],
    cuesFrom: 'chestMachine',
  },
  svend: {
    tips: [
      'Funciona muy bien en series de 12 a 20 al final de la rutina.',
      'Mantén el abdomen firme y los hombros abajo.',
    ],
    mistakes: [
      'Dejar de apretar los discos al estirar los brazos.',
      'Arquear la zona lumbar para compensar.',
    ],
    cuesFrom: 'press',
  },
  pushUp: {
    tips: [
      'Aprieta glúteos y abdomen: el cuerpo se mueve como una tabla.',
      'Mira el piso un poco por delante de las manos para mantener el cuello neutro.',
    ],
    mistakes: [
      'Dejar caer la cadera o levantarla en pico.',
      'Abrir los codos a 90° del cuerpo.',
      'Hacer medio recorrido.',
    ],
    cuesFrom: 'pushUp',
  },
  dips: {
    tips: [
      'Mantén los hombros lejos de las orejas en todo el recorrido.',
      'Si no llegas a 6 repeticiones, usa banda o máquina asistida.',
    ],
    mistakes: [
      'Bajar demasiado y forzar la parte frontal del hombro.',
      'Balancear las piernas para subir.',
    ],
    cuesFrom: 'dips',
  },

  // ───────── Espalda ─────────
  deadlift: {
    tips: [
      'Bloquea el tronco antes de tirar: inhala hacia el abdomen y tensa como si fueras a recibir un golpe.',
      'Empuja el piso con las piernas en lugar de "tirar" con la espalda.',
      'Bloquea arriba apretando los glúteos, sin echarte hacia atrás.',
    ],
    mistakes: [
      'Redondear la espalda baja al despegar el peso.',
      'Subir primero la cadera y dejar el pecho abajo (se convierte en un peso muerto rígido).',
      'Alejar el peso de las piernas.',
    ],
    cuesFrom: 'deadlift',
  },
  hinge: {
    tips: [
      'Empuja la cadera hacia atrás como si cerraras una puerta con los glúteos.',
      'Baja solo mientras la espalda siga recta: el rango depende de tu flexibilidad.',
    ],
    mistakes: [
      'Redondear la espalda para bajar más.',
      'Flexionar de más las rodillas (pasa a ser una sentadilla).',
    ],
    cuesFrom: 'hinge',
  },
  bentRow: {
    tips: [
      'Mantén la espalda recta y el cuello alineado con el torso.',
      'Junta los omóplatos al final de cada repetición.',
    ],
    mistakes: [
      'Incorporarse para mover el peso con impulso.',
      'Redondear la espalda baja.',
      'Tirar con los bíceps y los hombros encogidos.',
    ],
    cuesFrom: 'bentRow',
  },
  oneArmRow: {
    tips: [
      'Mantén la cadera y los hombros paralelos al piso: no gires el tronco para subir el peso.',
      'Deja que el omóplato se estire abajo antes de cada tirón.',
    ],
    mistakes: [
      'Rotar el torso hacia arriba para ayudar.',
      'Tirar con el bíceps llevando la mano al hombro.',
    ],
    cuesFrom: 'oneArmRow',
  },
  machineRow: {
    tips: [
      'Mantén el pecho apoyado durante toda la serie.',
      'Inicia el movimiento juntando los omóplatos.',
    ],
    mistakes: [
      'Despegar el pecho del apoyo para tirar con impulso.',
      'Subir los hombros hacia las orejas.',
    ],
    cuesFrom: 'seatedRow',
  },
  seatedRow: {
    tips: [
      'Mantén el pecho alto y los hombros abajo.',
      'Deja que los omóplatos se separen al estirar y júntalos al tirar.',
    ],
    mistakes: [
      'Balancear el torso atrás y adelante para mover más peso.',
      'Redondear la espalda al estirar los brazos.',
    ],
    cuesFrom: 'seatedRow',
  },
  pulldown: {
    tips: [
      'Lleva la barra hacia el pecho alto, no hacia el abdomen.',
      'Controla la subida: el estiramiento arriba también trabaja el dorsal.',
    ],
    mistakes: [
      'Echarse muy atrás y convertirlo en un remo.',
      'Tirar con los brazos sin bajar primero los hombros.',
    ],
    cuesFrom: 'pulldown',
  },
  straightArm: {
    tips: [
      'Piensa en llevar los codos hacia las caderas.',
      'Mantén el torso quieto en toda la serie.',
    ],
    mistakes: [
      'Doblar los codos y convertirlo en un jalón.',
      'Subir los hombros hacia las orejas.',
    ],
    cuesFrom: 'pulldown',
  },
  pullUp: {
    tips: [
      'Aprieta abdomen y glúteos para que el cuerpo no se balancee.',
      'Si todavía no llegas a 5 repeticiones, haz negativas lentas (5 segundos de bajada).',
    ],
    mistakes: [
      'Hacer medio recorrido sin estirar los brazos abajo.',
      'Balancear las piernas para subir.',
      'Estirar el cuello para "llegar" con el mentón.',
    ],
    cuesFrom: 'pullUp',
  },
  frontLever: {
    tips: [
      'Los brazos van bloqueados todo el tiempo: la fuerza sale de bajar la barra con la espalda.',
      'Entrénalo descansado, al principio de la sesión, con descansos largos.',
    ],
    mistakes: [
      'Doblar los codos para "acortar" la palanca.',
      'Dejar caer la cadera por debajo de la línea del cuerpo.',
    ],
    cuesFrom: 'pullUp',
  },
  invertedRow: {
    tips: [
      'Mantén el cuerpo recto como en una plancha.',
      'Junta los omóplatos al llegar arriba.',
    ],
    mistakes: [
      'Dejar caer la cadera.',
      'Llevar el mentón a la barra en lugar del pecho.',
    ],
    cuesFrom: 'bentRow',
  },
  hyperextension: {
    tips: [
      'Mantén el cuello neutro, mirando al piso.',
      'Para sumar carga, abraza un disco contra el pecho.',
    ],
    mistakes: [
      'Hiperextender la zona lumbar arriba.',
      'Subir con un tirón rápido.',
    ],
    cuesFrom: 'hyperextension',
  },
  superman: {
    tips: [
      'Mantén el cuello neutro mirando el piso.',
      'Haz la pausa arriba: el trabajo está en sostener.',
    ],
    mistakes: [
      'Tirar la cabeza hacia atrás.',
      'Hacer movimientos rápidos con rebote.',
    ],
    cuesFrom: 'hyperextension',
  },
  shrug: {
    tips: [
      'Mantén los brazos estirados: los codos no se flexionan.',
      'Haz una pausa de un segundo arriba.',
    ],
    mistakes: [
      'Girar los hombros en círculos.',
      'Usar tanto peso que el recorrido es mínimo.',
      'Adelantar la cabeza al subir.',
    ],
    cuesFrom: 'deadHang',
  },
  machinePullover: {
    tips: [
      'El movimiento sale de los codos, no de las manos.',
      'Controla la vuelta hasta sentir el estiramiento arriba.',
    ],
    mistakes: [
      'Arquear la espalda baja para mover más peso.',
      'Tirar con los brazos en lugar de empujar con los codos.',
    ],
    cuesFrom: 'pullover',
  },

  // ───────── Hombros ─────────
  ohp: {
    tips: [
      'Aprieta glúteos y abdomen: el tronco no se arquea para empujar.',
      'Los antebrazos quedan verticales debajo del peso en todo el recorrido.',
    ],
    mistakes: [
      'Arquear la zona lumbar para "ayudar" con el pecho.',
      'Empujar el peso por delante de la cara en lugar de sobre la cabeza.',
      'Bajar solo hasta la frente (medio recorrido).',
    ],
    cuesFrom: 'ohp',
  },
  landmine: {
    tips: [
      'Mantén el tronco firme y quieto: el empuje sale del hombro y el brazo.',
      'Termina con el hombro adelante, alcanzando con la mano.',
    ],
    mistakes: [
      'Girar el tronco para subir la barra.',
      'Arquear la espalda baja.',
    ],
    cuesFrom: 'ohp',
  },
  lateral: {
    tips: [
      'El codo sube primero y la mano lo sigue: nunca por encima del codo.',
      'Usa poco peso y controla la bajada en 2–3 segundos.',
    ],
    mistakes: [
      'Balancear el cuerpo para subir el peso.',
      'Subir los hombros hacia las orejas (trabaja el trapecio).',
      'Elevar por encima de la altura de los hombros con mucho peso.',
    ],
    cuesFrom: 'lateral',
  },
  frontRaise: {
    tips: [
      'Mantén el torso quieto y los hombros abajo.',
      'Es un ejercicio complementario: el deltoides anterior ya trabaja mucho en todos los press.',
    ],
    mistakes: [
      'Balancear el cuerpo hacia atrás.',
      'Subir por encima de la altura de los ojos.',
    ],
    cuesFrom: 'lateral',
  },
  rearDelt: {
    tips: [
      'Usa poco peso: el deltoides posterior es un músculo pequeño.',
      'Mantén los codos apenas flexionados y fijos.',
    ],
    mistakes: [
      'Juntar los omóplatos al final (pasa el trabajo al trapecio).',
      'Balancear el torso.',
    ],
    cuesFrom: 'rearDelt',
  },
  cableRearFly: {
    tips: [
      'Mantén los hombros abajo durante todo el movimiento.',
      'Haz una pausa breve con los brazos abiertos.',
    ],
    mistakes: [
      'Doblar los codos y convertirlo en un remo.',
      'Inclinar el torso hacia atrás para abrir más.',
    ],
    cuesFrom: 'rearDelt',
  },
  yRaise: {
    tips: [
      'Lleva los omóplatos hacia abajo y hacia atrás antes de subir los brazos.',
      'Basta con discos de 1–2 kg o sin peso.',
    ],
    mistakes: [
      'Encoger los hombros hacia las orejas.',
      'Arquear la zona lumbar para subir más.',
    ],
    cuesFrom: 'rearDelt',
  },
  facePull: {
    tips: [
      'Los codos quedan siempre por encima de las manos.',
      'Haz una pausa de un segundo con las manos junto a las orejas.',
    ],
    mistakes: [
      'Tirar con los codos bajos (se convierte en un remo).',
      'Echarse hacia atrás para mover más peso.',
    ],
    cuesFrom: 'facePull',
  },
  uprightRow: {
    tips: [
      'Mantén la barra pegada al cuerpo todo el recorrido.',
      'Un agarre más abierto es más amable con el hombro.',
    ],
    mistakes: [
      'Subir los codos por encima de los hombros.',
      'Usar impulso de las piernas.',
    ],
    cuesFrom: 'lateral',
  },
  cubanPress: {
    tips: [
      'Haz cada fase por separado, con una pausa breve.',
      'Usa el peso más liviano que tengas.',
    ],
    mistakes: [
      'Dejar caer los codos al girar los antebrazos.',
      'Apurar el giro con impulso.',
    ],
    cuesFrom: 'extRot',
  },
  extRot: {
    tips: [
      'Movimiento lento y controlado: es trabajo de estabilidad, no de fuerza máxima.',
      'Series de 12–20 repeticiones con peso muy bajo.',
    ],
    mistakes: [
      'Separar el codo del cuerpo para ganar recorrido.',
      'Girar el torso en lugar del brazo.',
    ],
    cuesFrom: 'extRot',
  },
  pikePushUp: {
    tips: [
      'Mantén la cadera alta en toda la serie.',
      'Codos hacia atrás, no hacia los costados.',
    ],
    mistakes: [
      'Bajar la cadera y convertirlo en una flexión común.',
      'Apoyar la cabeza de golpe en el piso.',
    ],
    cuesFrom: 'ohp',
  },

  // ───────── Brazos ─────────
  curl: {
    tips: [
      'Los codos quedan pegados al cuerpo: solo se mueve el antebrazo.',
      'Baja en 2–3 segundos: la bajada también construye músculo.',
    ],
    mistakes: [
      'Balancear el torso para subir el peso.',
      'Adelantar los codos al final para "descansar" arriba.',
      'Hacer medio recorrido sin estirar los brazos abajo.',
    ],
    cuesFrom: 'curl',
  },
  preacher: {
    tips: [
      'Las axilas quedan apoyadas en el borde del atril: los hombros no se adelantan.',
      'Controla la parte baja: es donde el bíceps está más exigido.',
    ],
    mistakes: [
      'Soltar el peso abajo y rebotar con el codo bloqueado.',
      'Despegar los brazos del apoyo para ayudar con el cuerpo.',
    ],
    cuesFrom: 'preacher',
  },
  concentration: {
    tips: [
      'El brazo no se mueve: el codo queda trabado contra el muslo.',
      'Haz las repeticiones lentas y con pausa arriba.',
    ],
    mistakes: [
      'Levantar el torso para subir la mancuerna.',
      'Mover el codo hacia adelante.',
    ],
    cuesFrom: 'curl',
  },
  inclineCurl: {
    tips: [
      'Mantén la cabeza y la espalda apoyadas en el respaldo.',
      'Usa menos peso que de pie: el bíceps arranca muy estirado.',
    ],
    mistakes: [
      'Adelantar los codos al subir.',
      'Despegar los hombros del respaldo.',
    ],
    cuesFrom: 'inclineCurl',
  },
  spiderCurl: {
    tips: [
      'Los brazos quedan verticales: los codos no van hacia adelante.',
      'Aprieta arriba un segundo.',
    ],
    mistakes: [
      'Balancear el cuerpo sobre el banco.',
      'Recortar el recorrido abajo.',
    ],
    cuesFrom: 'curl',
  },
  bayesianCurl: {
    tips: [
      'El codo se queda atrás del cuerpo todo el tiempo.',
      'Trabaja un brazo por vez y empieza por el más débil.',
    ],
    mistakes: [
      'Llevar el codo hacia adelante al subir.',
      'Girar el torso hacia la polea.',
    ],
    cuesFrom: 'inclineCurl',
  },
  highCableCurl: {
    tips: [
      'Mantén los codos a la altura de los hombros.',
      'Pausa con las manos junto a las orejas.',
    ],
    mistakes: [
      'Bajar los codos durante la serie.',
      'Inclinar el torso hacia una de las poleas.',
    ],
    cuesFrom: 'curl',
  },
  trxCurl: {
    tips: [
      'El cuerpo se mantiene recto como una tabla.',
      'Los codos quedan a la altura de los hombros.',
    ],
    mistakes: [
      'Dejar caer la cadera.',
      'Bajar los codos y convertirlo en un remo.',
    ],
    cuesFrom: 'curl',
  },
  pushdown: {
    tips: [
      'Los codos quedan pegados al cuerpo: son la bisagra del movimiento.',
      'Estira por completo abajo y aprieta un segundo.',
    ],
    mistakes: [
      'Mover los codos hacia adelante y atrás.',
      'Inclinarse con todo el peso del cuerpo sobre la barra.',
    ],
    cuesFrom: 'pushdown',
  },
  overheadExt: {
    tips: [
      'Los codos apuntan al techo y no se abren.',
      'Baja hasta sentir el estiramiento del tríceps.',
    ],
    mistakes: [
      'Abrir los codos hacia los costados.',
      'Arquear la espalda para subir el peso.',
    ],
    cuesFrom: 'overheadExt',
  },
  cableOverheadExt: {
    tips: [
      'Mantén el torso inclinado y firme, con un pie adelante.',
      'Estira por completo y vuelve despacio.',
    ],
    mistakes: [
      'Abrir los codos.',
      'Usar el cuerpo para mover el peso.',
    ],
    cuesFrom: 'overheadExt',
  },
  skullCrusher: {
    tips: [
      'Los brazos quedan fijos: solo se mueven los codos.',
      'Baja despacio: el peso pasa cerca de la cabeza.',
    ],
    mistakes: [
      'Abrir los codos hacia los costados.',
      'Convertirlo en un press moviendo los hombros.',
    ],
    cuesFrom: 'skullCrusher',
  },
  closeGrip: {
    tips: [
      'Los codos van pegados al cuerpo todo el recorrido.',
      'Muñecas rectas y apiladas sobre los codos.',
    ],
    mistakes: [
      'Juntar demasiado las manos y doblar las muñecas.',
      'Abrir los codos como en el press de banca.',
    ],
    cuesFrom: 'closeGrip',
  },
  kickback: {
    tips: [
      'El brazo queda paralelo al torso todo el tiempo.',
      'Usa poco peso y pausa con el brazo estirado.',
    ],
    mistakes: [
      'Balancear el brazo desde el hombro.',
      'Dejar caer el codo.',
    ],
    cuesFrom: 'pushdown',
  },
  benchDips: {
    tips: [
      'La espalda baja va cerca del banco.',
      'Los codos apuntan hacia atrás, no hacia afuera.',
    ],
    mistakes: [
      'Bajar demasiado y forzar la parte frontal del hombro.',
      'Empujar con las piernas.',
    ],
    cuesFrom: 'dips',
  },
  tricepsMachine: {
    tips: [
      'Alinea los codos con el eje de la máquina.',
      'Controla la vuelta sin que la pila golpee.',
    ],
    mistakes: [
      'Despegar los codos del apoyo.',
      'Hacer recorridos cortos con mucho peso.',
    ],
    cuesFrom: 'pushdown',
  },
  wristFlex: {
    tips: [
      'Los antebrazos no se mueven: solo trabaja la muñeca.',
      'Series largas (15–25) con peso moderado.',
    ],
    mistakes: [
      'Despegar los antebrazos del apoyo.',
      'Usar impulso de los brazos.',
    ],
    cuesFrom: 'wristFlex',
  },
  wristExt: {
    tips: [
      'Usa poco peso: los extensores son más débiles.',
      'Movimiento lento en las dos direcciones.',
    ],
    mistakes: [
      'Ayudarte flexionando los codos.',
      'Cargar tanto que el recorrido es mínimo.',
    ],
    cuesFrom: 'wristExt',
  },
  forearmRotation: {
    tips: [
      'El codo y el antebrazo quedan quietos: el giro es solo de la muñeca.',
      'Empieza con muy poco peso: la palanca es larga.',
    ],
    mistakes: [
      'Girar desde el hombro.',
      'Hacerlo rápido y sin control.',
    ],
    cuesFrom: 'wristFlex',
  },
  wristRoller: {
    tips: [
      'Gira con las muñecas, no con los brazos.',
      'La bajada lenta trabaja tanto como la subida.',
    ],
    mistakes: [
      'Bajar los brazos durante la serie.',
      'Soltar el peso de golpe.',
    ],
    cuesFrom: 'grip',
  },
  deadHang: {
    tips: [
      'Hombros levemente activos: no te cuelgues totalmente relajado.',
      'Respira de forma tranquila y constante.',
    ],
    mistakes: [
      'Balancear las piernas.',
      'Soltar de golpe al cansarte.',
    ],
    cuesFrom: 'deadHang',
  },
  grip: {
    tips: [
      'Registra segundos o repeticiones para medir el progreso.',
      'Entrena el agarre al final de la sesión: no limites los ejercicios pesados.',
    ],
    mistakes: [
      'Contener la respiración.',
      'Usar implementos tan pesados que la técnica se pierde.',
    ],
    cuesFrom: 'grip',
  },

  // ───────── Piernas y glúteos ─────────
  squat: {
    tips: [
      'Las rodillas siguen la dirección de las puntas de los pies.',
      'Inhala y tensa el abdomen antes de bajar; exhala al pasar la parte más difícil de la subida.',
      'Todo el pie apoyado: el peso repartido entre talón y la base de los dedos.',
    ],
    mistakes: [
      'Dejar que las rodillas se vayan hacia adentro.',
      'Levantar los talones del piso.',
      'Redondear la espalda baja al final de la bajada.',
    ],
    cuesFrom: 'squat',
  },
  hackSquat: {
    tips: [
      'La espalda queda pegada al respaldo todo el recorrido.',
      'Baja controlado y sube sin bloquear las rodillas.',
    ],
    mistakes: [
      'Despegar los talones de la plataforma.',
      'Recortar el recorrido con demasiado peso.',
    ],
    cuesFrom: 'squat',
  },
  legPress: {
    tips: [
      'Mantén la espalda baja y la cadera apoyadas en todo momento.',
      'Empuja con todo el pie, no solo con la punta.',
    ],
    mistakes: [
      'Bloquear las rodillas arriba.',
      'Bajar tanto que la cadera se despega del asiento.',
    ],
    cuesFrom: 'legPress',
  },
  legExtension: {
    tips: [
      'Alinea la rodilla con el eje de la máquina.',
      'Controla la bajada en 2–3 segundos.',
    ],
    mistakes: [
      'Levantar la cadera del asiento.',
      'Dejar caer el peso.',
    ],
    cuesFrom: 'legExtension',
  },
  sissy: {
    tips: [
      'La cadera queda estirada: el cuerpo se mueve como una tabla desde las rodillas.',
      'Usa un soporte hasta dominar el equilibrio.',
    ],
    mistakes: [
      'Sentarse hacia atrás flexionando la cadera.',
      'Bajar más de lo que la rodilla tolera.',
    ],
    cuesFrom: 'legExtension',
  },
  spanishSquat: {
    tips: [
      'Las tibias quedan verticales: la banda sostiene las rodillas.',
      'Ideal en series isométricas de 30–45 segundos.',
    ],
    mistakes: [
      'Usar una banda floja que no sostiene.',
      'Dejar que las rodillas avancen.',
    ],
    cuesFrom: 'squat',
  },
  legCurl: {
    tips: [
      'Mantén la cadera quieta y apoyada.',
      'La bajada lenta es clave para la fuerza excéntrica.',
    ],
    mistakes: [
      'Levantar la cadera para ayudar.',
      'Usar impulso o rebote abajo.',
    ],
    cuesFrom: 'legCurl',
  },
  nordic: {
    tips: [
      'El cuerpo baja recto de las rodillas a la cabeza: la cadera no se dobla.',
      'Empieza con pocas repeticiones (3–5) y súmalas de a poco.',
    ],
    mistakes: [
      'Flexionar la cadera para acortar la palanca.',
      'Dejarse caer sin frenar.',
    ],
    cuesFrom: 'nordic',
  },
  lunge: {
    tips: [
      'El torso queda erguido y la rodilla de adelante en línea con el pie.',
      'Empuja con el talón de la pierna de adelante.',
    ],
    mistakes: [
      'Dejar que la rodilla de adelante se vaya hacia adentro.',
      'Golpear la rodilla de atrás contra el piso.',
      'Dar pasos demasiado cortos.',
    ],
    cuesFrom: 'lunge',
  },
  stepUp: {
    tips: [
      'Apoya todo el pie sobre el cajón.',
      'Baja siempre con control.',
    ],
    mistakes: [
      'Impulsarse con el pie de abajo.',
      'Inclinar el torso hacia adelante en exceso.',
    ],
    cuesFrom: 'lunge',
  },
  adductor: {
    tips: [
      'Haz una pausa con las piernas juntas.',
      'Controla la apertura: los aductores se lesionan con estiramientos bruscos.',
    ],
    mistakes: [
      'Abrir de golpe o rebotar.',
      'Usar impulso del tronco.',
    ],
    cuesFrom: 'abductor',
  },
  abductor: {
    tips: [
      'Sostén un segundo con las piernas abiertas.',
      'Movimiento lento en las dos direcciones.',
    ],
    mistakes: [
      'Dejar que el peso cierre las piernas de golpe.',
      'Mover el tronco para ayudar.',
    ],
    cuesFrom: 'abductor',
  },
  clamshell: {
    tips: [
      'La cadera no gira: la pelvis queda vertical.',
      'Series largas (15–25) con control.',
    ],
    mistakes: [
      'Rotar el torso hacia atrás para abrir más.',
      'Hacerlo rápido con rebote.',
    ],
    cuesFrom: 'abductor',
  },
  hipThrust: {
    tips: [
      'Las tibias quedan verticales arriba.',
      'Aprieta los glúteos un segundo en la extensión completa.',
    ],
    mistakes: [
      'Arquear la zona lumbar en lugar de extender la cadera.',
      'Pies demasiado lejos: trabajan más los isquiotibiales.',
    ],
    cuesFrom: 'hipThrust',
  },
  gluteBridge: {
    tips: [
      'Empuja con los talones.',
      'Mantén las costillas abajo: el movimiento es de la cadera.',
    ],
    mistakes: [
      'Arquear la espalda baja arriba.',
      'Separar las rodillas hacia afuera sin control.',
    ],
    cuesFrom: 'gluteBridge',
  },
  gluteKickback: {
    tips: [
      'Mantén el abdomen firme y la espalda neutra.',
      'Haz una pausa arriba apretando el glúteo.',
    ],
    mistakes: [
      'Arquear la zona lumbar para subir más la pierna.',
      'Usar impulso.',
    ],
    cuesFrom: 'hipThrust',
  },
  pullThrough: {
    tips: [
      'Brazos estirados: solo sostienen la soga.',
      'Aprieta los glúteos para terminar, sin echarte atrás.',
    ],
    mistakes: [
      'Tirar con los brazos.',
      'Flexionar demasiado las rodillas (se convierte en sentadilla).',
    ],
    cuesFrom: 'hinge',
  },
  reverseHyper: {
    tips: [
      'Sube con control: el péndulo no debe arrastrarte.',
      'Las piernas suben hasta la horizontal, no más.',
    ],
    mistakes: [
      'Hiperextender la espalda arriba.',
      'Balancearse con todo el cuerpo.',
    ],
    cuesFrom: 'hyperextension',
  },
  calf: {
    tips: [
      'Recorrido completo: estiramiento abajo y máxima altura arriba.',
      'Pausa de 1–2 segundos abajo para eliminar el rebote del tendón.',
    ],
    mistakes: [
      'Rebotar con recorridos cortos.',
      'Flexionar las rodillas para ayudar.',
    ],
    cuesFrom: 'calf',
  },
  tibial: {
    tips: [
      'Series largas de 15–25 repeticiones.',
      'Puedes sumar carga con una banda o un disco sobre los pies.',
    ],
    mistakes: [
      'Hacer movimientos cortos y rápidos.',
      'Despegar los talones del apoyo.',
    ],
    cuesFrom: 'tibial',
  },
  plyoCalf: {
    tips: [
      'Mantén la pisada sobre la parte delantera del pie.',
      'Para cuando el ritmo o la altura bajan.',
    ],
    mistakes: [
      'Flexionar mucho las rodillas.',
      'Hacerlo con calzado sin amortiguación en superficies duras.',
    ],
    cuesFrom: 'calf',
  },
  hspu: {
    tips: [
      'Manos un poco más abiertas que los hombros y dedos abiertos para equilibrar.',
      'Usa una pared y una colchoneta bajo la cabeza mientras aprendes.',
    ],
    mistakes: [
      'Abrir los codos a 90° al bajar.',
      'Arquear la zona lumbar para alejar los pies de la pared.',
    ],
    cuesFrom: 'ohp',
  },
  crunch: {
    tips: [
      'Exhala al subir y aprieta 1 segundo arriba.',
      'No tires del cuello: las manos solo acompañan la cabeza.',
    ],
    mistakes: [
      'Despegar la zona lumbar del piso.',
      'Usar impulso con los brazos o la cabeza.',
    ],
  },
  sitUp: {
    tips: [
      'Controla la bajada tanto como la subida.',
      'Si sientes la lumbar, vuelve al crunch y progresa desde ahí.',
    ],
    mistakes: [
      'Tirar del cuello con las manos.',
      'Caer de golpe contra el piso o el banco.',
    ],
    cuesFrom: 'crunch',
  },
  reverseCrunch: {
    tips: [
      'Exhala al enrollar la pelvis.',
      'Brazos apoyados solo como estabilizadores, sin empujar el piso con fuerza.',
    ],
    mistakes: [
      'Balancear las piernas para generar impulso.',
      'Dejar caer la pelvis sin control al bajar.',
    ],
    cuesFrom: 'crunch',
  },
  coreStability: {
    tips: [
      'Respira por la nariz manteniendo el abdomen tenso (bracing).',
      'Calidad antes que cantidad: movimientos lentos.',
    ],
    mistakes: [
      'Arquear la zona lumbar al extender brazos o piernas.',
      'Contener la respiración.',
    ],
    cuesFrom: 'coreStability',
  },
  rotation: {
    tips: [
      'El giro nace en las costillas, no en los brazos.',
      'Mantén el abdomen tenso durante todo el recorrido.',
    ],
    mistakes: [
      'Mover solo los brazos o los codos sin girar el tronco.',
      'Ir tan rápido que se pierde el control del recorrido.',
    ],
    cuesFrom: 'crunch',
  },
  legRaise: {
    tips: [
      'Pega la zona lumbar al piso antes de mover las piernas.',
      'Baja más lento de lo que subes.',
    ],
    mistakes: [
      'Arquear la espalda cuando las piernas se acercan al piso.',
      'Usar impulso para subir.',
    ],
    cuesFrom: 'crunch',
  },
  hangingRaise: {
    tips: [
      'Escápulas activas para no colgar de los ligamentos del hombro.',
      'Enrolla la pelvis al final: ahí trabaja el abdomen.',
    ],
    mistakes: [
      'Balancearse para subir las piernas.',
      'Subir solo hasta la cadera sin enrollar la pelvis.',
    ],
    cuesFrom: 'crunch',
  },
  captainChair: {
    tips: [
      'Codos o brazos firmes y hombros lejos de las orejas.',
      'Exhala al subir las rodillas.',
    ],
    mistakes: [
      'Dejar que los hombros se hundan hacia las orejas.',
      'Balancear las piernas.',
    ],
    cuesFrom: 'crunch',
  },
  lSit: {
    tips: [
      'Hombros deprimidos y brazos totalmente estirados.',
      'Aprieta los cuádriceps y estira las puntas de los pies.',
    ],
    mistakes: [
      'Encoger los hombros hacia las orejas.',
      'Dejar caer las piernas por debajo de la horizontal.',
    ],
    cuesFrom: 'coreStability',
  },
  hollow: {
    tips: [
      'La lumbar siempre pegada al piso.',
      'Ajusta la palanca (brazos y piernas) para sostener la forma correcta.',
    ],
    mistakes: [
      'Despegar la lumbar del suelo.',
      'Tensar el cuello en lugar del abdomen.',
    ],
    cuesFrom: 'coreStability',
  },
  dragonFlag: {
    tips: [
      'Cuerpo rígido como una tabla durante todo el recorrido.',
      'Agárrate firme del banco: los dorsales también trabajan.',
    ],
    mistakes: [
      'Flexionar la cadera para acortar la palanca.',
      'Apoyar el cuello en lugar de la parte alta de la espalda.',
    ],
    cuesFrom: 'coreStability',
  },
  abWheel: {
    tips: [
      'Glúteos apretados y pelvis en retroversión todo el tiempo.',
      'Progresión: rodar contra una pared o con recorridos cortos.',
    ],
    mistakes: [
      'Hundir la zona lumbar al estirarse.',
      'Volver tirando con la cadera primero en lugar del abdomen.',
    ],
    cuesFrom: 'plank',
  },
  plank: {
    tips: [
      'Aprieta glúteos y cuádriceps para sostener la línea.',
      'Mejor 3 series de 30 segundos perfectas que una de 2 minutos mala.',
    ],
    mistakes: [
      'Hundir la cadera o subirla en pico.',
      'Mirar al frente forzando el cuello.',
    ],
    cuesFrom: 'plank',
  },
  ballPlank: {
    tips: [
      'Empieza con la pelota contra una pared hasta tener control.',
      'Cuerpo en línea recta como en la plancha.',
    ],
    mistakes: [
      'Hundir la cadera cuando la pelota se mueve.',
      'Apoyar el peso en los hombros sin empujar.',
    ],
    cuesFrom: 'plank',
  },
  sidePlank: {
    tips: [
      'Codo bajo el hombro y hombro empujando el piso.',
      'Cadera alta y adelantada, sin que el tronco rote.',
    ],
    mistakes: [
      'Dejar caer la cadera hacia el piso.',
      'Girar el tronco hacia el piso.',
    ],
    cuesFrom: 'sidePlank',
  },
  copenhagen: {
    tips: [
      'Comienza con la versión corta (rodilla sobre el banco).',
      'Aprieta la pierna de arriba contra el banco: es un ejercicio de aductores.',
    ],
    mistakes: [
      'Dejar caer la cadera.',
      'Progresar a la palanca larga sin dominar la corta.',
    ],
    cuesFrom: 'copenhagen',
  },
  sideBend: {
    tips: [
      'Movimiento lento en un solo plano.',
      'Exhala al subir contrayendo el oblicuo.',
    ],
    mistakes: [
      'Girar el tronco o inclinarse hacia adelante.',
      'Usar mucho peso y acortar el recorrido.',
    ],
    cuesFrom: 'coreStability',
  },
  windmill: {
    tips: [
      'Aprende primero sin peso o con la pesa abajo.',
      'Mantén el brazo de arriba vertical y la mirada en la pesa.',
    ],
    mistakes: [
      'Flexionar el codo de la pesa.',
      'Doblar la espalda en lugar de empujar la cadera hacia el costado.',
    ],
    cuesFrom: 'turkishGetUp',
  },
  cableCrunch: {
    tips: [
      'La cadera queda fija: solo se flexiona la columna.',
      'Exhala fuerte al enrollar.',
    ],
    mistakes: [
      'Sentarse sobre los talones para mover el peso con la cadera.',
      'Tirar con los brazos.',
    ],
    cuesFrom: 'crunch',
  },
  machineCrunch: {
    tips: [
      'Ajusta el asiento para que el eje de giro quede a la altura del abdomen.',
      'Pausa breve con el abdomen contraído.',
    ],
    mistakes: [
      'Tirar con los brazos.',
      'Dejar caer la pila de discos al volver.',
    ],
    cuesFrom: 'crunch',
  },
  rotaryTorso: {
    tips: [
      'Rango moderado y velocidad controlada.',
      'El pecho queda fijo contra la almohadilla.',
    ],
    mistakes: [
      'Girar de golpe o rebotar al final.',
      'Usar demasiado peso con rango forzado.',
    ],
    cuesFrom: 'pallof',
  },
  woodchopper: {
    tips: [
      'Pivota el pie de atrás para proteger la rodilla.',
      'Brazos casi estirados durante todo el arco.',
    ],
    mistakes: [
      'Tirar con los brazos sin girar el tronco.',
      'Redondear la espalda al llegar abajo.',
    ],
    cuesFrom: 'pallof',
  },
  pallof: {
    tips: [
      'Aléjate de la polea para aumentar la dificultad.',
      'Glúteos y abdomen tensos, pelvis neutra.',
    ],
    mistakes: [
      'Dejar que el tronco gire hacia la polea.',
      'Arquear la zona lumbar al estirar los brazos.',
    ],
    cuesFrom: 'pallof',
  },
  landmineRotation: {
    tips: [
      'Gira hombros y caderas juntos, pivotando los pies.',
      'Controla el arco: no dejes que la barra te arrastre.',
    ],
    mistakes: [
      'Doblar los codos y mover la barra con los brazos.',
      'Hacer el arco tan rápido que la lumbar gira sola.',
    ],
    cuesFrom: 'pallof',
  },
  running: {
    tips: [
      'Aumenta el volumen semanal de a poco (no más de ~10 % por semana).',
      'Usa calzado cómodo y cambia de superficie para repartir el impacto.',
    ],
    mistakes: [
      'Dar zancadas largas apoyando el talón muy por delante del cuerpo.',
      'Tensar hombros y puños.',
    ],
    cuesFrom: 'running',
  },
  walking: {
    tips: [
      'Suma pasos durante el día además de las sesiones.',
      'Lleva la cabeza alta y los hombros relajados.',
    ],
    mistakes: [
      'Encorvarse mirando el piso.',
      'Agarrarse de las barandas de la cinta.',
    ],
    cuesFrom: 'running',
  },
  plyo: {
    tips: [
      'Aterriza suave y silencioso, con las rodillas alineadas a los pies.',
      'Haz series cortas con descanso completo: la calidad es la clave.',
    ],
    mistakes: [
      'Aterrizar con las rodillas hacia adentro.',
      'Seguir saltando con fatiga y mala técnica.',
    ],
    cuesFrom: 'squat',
  },
  stairs: {
    tips: [
      'Mantén el tronco erguido y el peso en las piernas.',
      'Ajusta la velocidad para apoyar el pie completo.',
    ],
    mistakes: [
      'Colgarse de las barandas con los brazos.',
      'Ir tan rápido que solo apoyas la punta del pie.',
    ],
    cuesFrom: 'running',
  },
  cycling: {
    tips: [
      'Asiento a la altura correcta: rodilla apenas flexionada con el pedal abajo.',
      'Combina cadencia y resistencia; no solo velocidad sin carga.',
    ],
    mistakes: [
      'Asiento demasiado bajo que sobrecarga las rodillas.',
      'Rodillas abiertas hacia afuera al pedalear.',
    ],
    cuesFrom: 'running',
  },
  elliptical: {
    tips: [
      'Usa brazos y piernas de forma coordinada.',
      'Varía resistencia e inclinación para cambiar el estímulo.',
    ],
    mistakes: [
      'Apoyar todo el peso en las manijas.',
      'Pararse en puntas de pie.',
    ],
    cuesFrom: 'running',
  },
  rowErg: {
    tips: [
      'Secuencia: piernas → tronco → brazos, y al volver al revés.',
      'Resistencia (damper) media: 4–6 es suficiente para casi todos.',
    ],
    mistakes: [
      'Tirar con los brazos antes de empujar con las piernas.',
      'Redondear la espalda en el ataque.',
    ],
    cuesFrom: 'rowErg',
  },
  skiErg: {
    tips: [
      'El movimiento nace en la cadera.',
      'Mantén los brazos casi estirados durante el tirón.',
    ],
    mistakes: [
      'Tirar solo con los brazos.',
      'Redondear la espalda al flexionarte.',
    ],
    cuesFrom: 'hinge',
  },
  swimming: {
    tips: [
      'Trabaja la técnica de respiración antes que la distancia.',
      'Mantén el cuerpo alineado y horizontal en el agua.',
    ],
    mistakes: [
      'Levantar la cabeza para respirar (hunde las piernas).',
      'Patear desde las rodillas.',
    ],
    cuesFrom: 'swimming',
  },
  jumpRope: {
    tips: [
      'Saltos bajos y rítmicos sobre la punta de los pies.',
      'Giro con las muñecas, codos cerca del cuerpo.',
    ],
    mistakes: [
      'Saltar muy alto o con las piernas flexionadas.',
      'Girar la soga con los hombros.',
    ],
    cuesFrom: 'running',
  },
  pistol: {
    tips: [
      'Trabaja la movilidad de tobillo para que el talón no se despegue.',
      'Progresa con apoyos (cajón, TRX) hasta dominar el recorrido.',
    ],
    mistakes: [
      'Dejar que la rodilla se vaya hacia adentro.',
      'Caer al fondo sin control.',
    ],
    cuesFrom: 'squat',
  },
  burpee: {
    tips: [
      'Mantén un ritmo constante que puedas sostener.',
      'Plancha firme: sin hundir la cadera.',
    ],
    mistakes: [
      'Arquear la espalda en la plancha.',
      'Aterrizar con las piernas rígidas.',
    ],
    cuesFrom: 'plank',
  },
  crawl: {
    tips: [
      'Cadera estable y abdomen firme.',
      'Movimientos lentos y controlados.',
    ],
    mistakes: [
      'Subir la cadera muy alto.',
      'Dejar que la cadera se balancee de lado a lado.',
    ],
    cuesFrom: 'plank',
  },
  kbBallistic: {
    tips: [
      'Aprende primero el swing a dos manos.',
      'Mantén la pesa cerca del cuerpo en la subida.',
    ],
    mistakes: [
      'Tirar con el brazo en lugar de usar la cadera.',
      'Dejar que la pesa golpee el antebrazo.',
    ],
    cuesFrom: 'kbSwing',
  },
  halo: {
    tips: [
      'Movimiento lento y controlado alrededor de la cabeza.',
      'Pelvis neutra y abdomen activo.',
    ],
    mistakes: [
      'Arquear la zona lumbar.',
      'Mover la cabeza en lugar de la pesa.',
    ],
    cuesFrom: 'ohp',
  },
  devilPress: {
    tips: [
      'Usa mancuernas de cabeza hexagonal para que no rueden.',
      'Mantén la espalda neutra al pasar las pesas entre las piernas.',
    ],
    mistakes: [
      'Hacer el lanzamiento con los brazos.',
      'Redondear la espalda al recoger las mancuernas.',
    ],
    cuesFrom: 'kbSwing',
  },
  medBall: {
    tips: [
      'Elige un balón con el que puedas mantener la velocidad.',
      'La potencia viene de piernas y cadera.',
    ],
    mistakes: [
      'Lanzar solo con los brazos.',
      'Recibir el balón con los brazos rígidos.',
    ],
    cuesFrom: 'squat',
  },
  battleRopes: {
    tips: [
      'Media sentadilla firme y pecho alto.',
      'Ondas que lleguen hasta el anclaje.',
    ],
    mistakes: [
      'Pararse derecho con las piernas rígidas.',
      'Mover solo las muñecas.',
    ],
    cuesFrom: 'plank',
  },
  trxRow: {
    tips: [
      'Cuerpo recto como en una plancha.',
      'Ajusta la dificultad con la inclinación.',
    ],
    mistakes: [
      'Dejar caer la cadera.',
      'Tirar con los brazos sin juntar los omóplatos.',
    ],
    cuesFrom: 'bentRow',
  },
  olympic: {
    tips: [
      'Aprende con barra vacía o palo y con un entrenador.',
      'Velocidad antes que peso: la técnica se rompe con cargas altas.',
    ],
    mistakes: [
      'Tirar con los brazos antes de extender la cadera.',
      'Alejar la barra del cuerpo.',
    ],
    cuesFrom: 'olympic',
  },
  overheadSquat: {
    tips: [
      'Barra siempre sobre el medio del pie.',
      'Empuja activamente la barra hacia arriba.',
    ],
    mistakes: [
      'Dejar que la barra se vaya hacia adelante.',
      'Flexionar los codos.',
    ],
    cuesFrom: 'squat',
  },
  thruster: {
    tips: [
      'Codos altos en el rack frontal.',
      'Usa el impulso de las piernas para el empuje.',
    ],
    mistakes: [
      'Empujar con los brazos sin usar las piernas.',
      'Dejar caer los codos en la sentadilla.',
    ],
    cuesFrom: 'ohp',
  },
  highPull: {
    tips: [
      'Codos altos y afuera al final.',
      'La cadera inicia el tirón.',
    ],
    mistakes: [
      'Tirar solo con los brazos.',
      'Encorvar la espalda al levantar la barra.',
    ],
    cuesFrom: 'deadlift',
  },
  muscleUp: {
    tips: [
      'Domina antes las versiones estrictas (dominadas y fondos).',
      'Progresa de a pocas repeticiones por serie.',
    ],
    mistakes: [
      'Balanceo descontrolado que sobrecarga el hombro.',
      'Hacer muchas repeticiones con mala técnica.',
    ],
    cuesFrom: 'pullUp',
  },
  ropeClimb: {
    tips: [
      'Aprende el bloqueo de pies antes de subir alto.',
      'Usa guantes o protectores si la soga quema.',
    ],
    mistakes: [
      'Subir solo con los brazos.',
      'Soltarse y deslizarse al bajar.',
    ],
    cuesFrom: 'pullUp',
  },
  ghd: {
    tips: [
      'Empieza con un rango corto (hasta la horizontal).',
      'Pocas repeticiones al principio.',
    ],
    mistakes: [
      'Bajar demasiado sin control.',
      'Hacer muchas series desde el primer día.',
    ],
    cuesFrom: 'crunch',
  },
  carry: {
    tips: [
      'Pasos cortos y rápidos con el cuerpo erguido.',
      'Respira manteniendo el abdomen firme.',
    ],
    mistakes: [
      'Inclinarse hacia el lado de la carga.',
      'Encoger los hombros hacia las orejas.',
    ],
    cuesFrom: 'farmerWalk',
  },
  sled: {
    tips: [
      'Pasos cortos y potentes.',
      'Mantén la tensión constante sobre el trineo.',
    ],
    mistakes: [
      'Redondear la espalda.',
      'Dar zancadas largas que frenan el empuje.',
    ],
    cuesFrom: 'running',
  },
  strongman: {
    tips: [
      'Aprende cada técnica con cargas livianas.',
      'Usa piernas y cadera, no la espalda.',
    ],
    mistakes: [
      'Levantar con la espalda redondeada.',
      'Usar cargas excesivas sin progresión.',
    ],
    cuesFrom: 'deadlift',
  },
  circuit: {
    tips: [
      'Elige ejercicios que puedas hacer bien aun con fatiga.',
      'Ten todo el material preparado antes de empezar.',
    ],
    mistakes: [
      'Perder la técnica por ir más rápido.',
      'Repetir el mismo grupo muscular en estaciones seguidas.',
    ],
    cuesFrom: 'squat',
  },
  combat: {
    tips: [
      'Entrena la técnica con un instructor antes de golpear fuerte.',
      'Usa vendas y guantes adecuados.',
    ],
    mistakes: [
      'Bajar la guardia después de golpear.',
      'Golpear solo con el brazo sin girar la cadera.',
    ],
    cuesFrom: 'running',
  },
  pilates: {
    tips: [
      'Activa el centro (abdomen y suelo pélvico) en cada movimiento.',
      'Respira de forma controlada y continua.',
    ],
    mistakes: [
      'Usar impulso en lugar de control.',
      'Tensar el cuello en los ejercicios boca arriba.',
    ],
    cuesFrom: 'coreStability',
  },
  jeffersonCurl: {
    tips: [
      'Progresa muy de a poco en peso y rango.',
      'Hazlo descansado, nunca al final de un entrenamiento pesado.',
    ],
    mistakes: [
      'Usar mucho peso desde el inicio.',
      'Rebotar en la posición baja.',
    ],
    cuesFrom: 'hinge',
  },
  kbSwing: {
    tips: [
      'Bisagra de cadera, no sentadilla: las tibias quedan casi verticales.',
      'Aprieta glúteos y abdomen arriba: el cuerpo forma una plancha de pie.',
    ],
    mistakes: [
      'Levantar la pesa con los hombros y los brazos.',
      'Arquear la espalda al final del balanceo.',
    ],
  },
  turkishGetUp: {
    tips: [
      'Aprende la secuencia sin peso o con un zapato sobre el puño.',
      'Ve lento y controla cada transición.',
    ],
    mistakes: [
      'Doblar el codo de la pesa.',
      'Apurar los pasos y perder la línea vertical del brazo.',
    ],
  },
  yoga: {
    tips: [
      'Respira lento por la nariz en cada postura.',
      'Usa bloques o una correa para adaptar las posturas.',
    ],
    mistakes: [
      'Contener la respiración.',
      'Forzar el rango de movimiento hasta sentir dolor.',
    ],
  },
};
