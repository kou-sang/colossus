/*
 * Claves técnicas de entrenadores e investigadores reconocidos, por familia de ejercicio (ver exerciseGuides.js).
 * Son paráfrasis de indicaciones públicas (libros, artículos, estudios), no citas textuales. `by` indica la fuente.
 * Se muestran en la ficha como "Claves de entrenadores" para que el consejo no quede genérico.
 */

export const COACH_CUES = Object.freeze({
  press: [
    { text: 'La barra baja a la parte baja del pecho y sube en diagonal hacia los hombros: el codo siempre debajo de la barra, nunca por delante ni por detrás.', by: 'Mark Rippetoe, "Starting Strength"' },
    { text: 'Intenta "doblar" la barra hacia los pies: activa los dorsales, mete los codos a ~45° y protege el hombro.', by: 'Dave Tate (Elite FTS)' },
    { text: 'Empuja el piso con los pies (leg drive) sin despegar los glúteos: la tensión de todo el cuerpo se traduce en más fuerza.', by: 'Greg Nuckols (Stronger by Science)' },
  ],
  chestMachine: [
    { text: 'Las máquinas permiten acercarse al fallo con poco riesgo: úsalas para las últimas series de pecho, a 0–2 repeticiones del fallo.', by: 'Mike Israetel (Renaissance Periodization)' },
  ],
  fly: [
    { text: 'La mayor tensión de la apertura está en la parte estirada: controla los últimos centímetros de la bajada y no busques chocar las mancuernas arriba.', by: 'Jeff Nippard' },
  ],
  cableCross: [
    { text: 'Elige la altura de la polea según la dirección de las fibras: de arriba hacia abajo para la porción costal, de abajo hacia arriba para la clavicular.', by: 'Bret Contreras / análisis de EMG del pectoral' },
  ],
  pushUp: [
    { text: 'Al llegar arriba empuja un poco más el piso hasta separar los omóplatos ("push-up plus"): activa el serrato anterior, clave para hombros sanos.', by: 'Ludewig y col. (fisioterapia de hombro)' },
    { text: 'Las flexiones con carga equivalente generan ganancias de fuerza y músculo similares al press de banca.', by: 'Calatayud y col., 2015' },
  ],
  dips: [
    { text: 'Baja hasta que el hombro quede apenas por debajo del codo; más profundo solo si no hay molestias en la parte frontal del hombro.', by: 'Eric Cressey' },
  ],
  pullover: [
    { text: 'Es un clásico de la "era dorada": se usaba para trabajar pecho y dorsal en el mismo movimiento manteniendo el codo fijo.', by: 'Arnold Schwarzenegger, "Enciclopedia del culturismo"' },
    { text: 'Piensa en llevar los codos hacia las caderas al volver, no las manos: así el dorsal hace el trabajo.', by: 'Jeff Nippard' },
  ],
  deadlift: [
    { text: 'Arma la posición en 5 pasos: barra sobre la mitad del pie, agarre, tibias contra la barra, pecho arriba (espalda recta) y recién entonces tira.', by: 'Mark Rippetoe, "Starting Strength"' },
    { text: 'Bloquea el tronco antes de tirar: inhala hacia el abdomen y tensa como si fueras a recibir un golpe (bracing).', by: 'Stuart McGill' },
    { text: 'Arrastra la barra pegada a las piernas en todo el recorrido; si se aleja, la palanca sobre la zona lumbar se multiplica.', by: 'Alan Thrall' },
  ],
  pulldown: [
    { text: 'Inicia cada repetición bajando los hombros (depresión escapular) y recién después flexiona los codos.', by: 'Eric Cressey' },
    { text: 'El recorrido completo, con el dorsal bien estirado arriba, da más hipertrofia que las repeticiones parciales cortas.', by: 'Schoenfeld y Grgic, 2020 (revisión sobre rango de movimiento)' },
  ],
  pullUp: [
    { text: 'Antes de sumar repeticiones, domina 3 series de 5 negativas de 5 segundos: construyen la fuerza para las primeras dominadas estrictas.', by: 'Steven Low, "Overcoming Gravity"' },
    { text: 'Piensa en llevar el pecho a la barra y los codos hacia los bolsillos traseros.', by: 'Eric Cressey' },
  ],
  bentRow: [
    { text: 'El remo Pendlay arranca cada repetición desde el piso con el torso horizontal: obliga a mantener la espalda fija y elimina el impulso.', by: 'Glenn Pendlay' },
    { text: 'Tira la barra hacia el ombligo, no hacia el pecho: el codo viaja cerca del cuerpo y el dorsal participa más.', by: 'Jeff Nippard' },
  ],
  seatedRow: [
    { text: 'Deja que los omóplatos se separen al estirar y júntalos al tirar: el movimiento escapular completo es parte del ejercicio.', by: 'Mike Israetel (Renaissance Periodization)' },
  ],
  oneArmRow: [
    { text: 'El remo Kroc usa mucho peso y algo de impulso controlado con repeticiones altas (15–30): construye espalda y agarre.', by: 'Matt Kroczaleski' },
  ],
  hyperextension: [
    { text: 'Para enfocar el glúteo: pies en V, espalda alta redondeada y extensión desde la cadera, sin arquear la zona lumbar arriba.', by: 'Bret Contreras' },
  ],
  hinge: [
    { text: 'Empuja la cadera hacia atrás como si cerraras una puerta con los glúteos; la barra baja sola por los muslos.', by: 'Mark Rippetoe / Alan Thrall' },
    { text: 'El peso muerto rumano trabaja los isquiotibiales en posición estirada, donde más se estimula el crecimiento.', by: 'Maeo y col., 2021' },
  ],
  ohp: [
    { text: 'Aprieta glúteos y abdomen y, cuando la barra pasa la frente, mete la cabeza "por la ventana" de los brazos: la barra termina sobre la mitad del pie.', by: 'Mark Rippetoe, "Starting Strength"' },
  ],
  lateral: [
    { text: 'Sube el brazo en el plano escapular (unos 30° por delante del cuerpo), guiando con el codo: es más cómodo para el hombro.', by: 'Jeff Nippard' },
    { text: 'Inclinarse alejándose de la polea o de un poste aumenta la tensión en el inicio del recorrido, donde la mancuerna casi no carga.', by: 'Análisis biomecánico de curvas de resistencia' },
  ],
  rearDelt: [
    { text: 'Los deltoides posteriores responden bien a repeticiones altas (15–30) y frecuencia alta: 2–4 veces por semana con poco volumen por sesión.', by: 'Mike Israetel (Renaissance Periodization)' },
  ],
  facePull: [
    { text: 'Termina con las manos a la altura de las orejas y los pulgares hacia atrás (rotación externa): equilibra todo el trabajo de press.', by: 'Eric Cressey / Joe DeFranco' },
  ],
  extRot: [
    { text: 'Incluye trabajo de rotadores externos en el calentamiento de los días de empuje: 2 series livianas de 15 alcanzan.', by: 'Eric Cressey' },
  ],
  curl: [
    { text: 'El bíceps también supina el antebrazo: girar la palma hacia arriba mientras subes aumenta su participación.', by: 'Brad Schoenfeld' },
    { text: 'Controla la fase negativa en 2–3 segundos: el estímulo excéntrico contribuye tanto como la subida.', by: 'Schoenfeld y col., 2017 (excéntricas)' },
  ],
  inclineCurl: [
    { text: 'Con el brazo detrás del cuerpo la cabeza larga del bíceps trabaja estirada, la posición que más crecimiento genera por serie.', by: 'Entrenamiento en longitudes largas (Maeo, Pedrosa y col.)' },
  ],
  preacher: [
    { text: 'El banco Scott carga más la parte baja del recorrido: no estires el codo de golpe y considera parciales en la mitad estirada al final de la serie.', by: 'Pedrosa y col., 2022 / Jeff Nippard' },
  ],
  pushdown: [
    { text: 'Las extensiones por encima de la cabeza hacen crecer más el tríceps que el pushdown: combina ambos en la semana.', by: 'Maeo y col., 2023' },
  ],
  overheadExt: [
    { text: 'Con el brazo arriba la cabeza larga del tríceps queda estirada: en un estudio, esta variante dio ~40% más hipertrofia que el pushdown.', by: 'Maeo y col., 2023' },
  ],
  skullCrusher: [
    { text: 'Baja la barra hacia la coronilla (por detrás de la frente) y deja que los brazos se inclinen un poco hacia atrás: más estiramiento del tríceps.', by: 'Jeff Nippard / Maeo y col., 2023' },
  ],
  closeGrip: [
    { text: 'Agarre al ancho de hombros y codos pegados: es el mejor ejercicio de fuerza para tríceps y transfiere directo al press de banca.', by: 'Greg Nuckols (Stronger by Science)' },
  ],
  wristFlex: [
    { text: 'Deja rodar la barra hasta la punta de los dedos y vuelve a cerrar la mano antes de flexionar la muñeca: trabajas flexores de dedos y muñeca juntos.', by: 'Técnica clásica de agarre (strongman)' },
  ],
  wristExt: [
    { text: 'Los extensores son mucho más débiles que los flexores: usa la mitad del peso y entrénalos para equilibrar el antebrazo (ayuda a prevenir el "codo de tenista").', by: 'Fisioterapia deportiva (epicondilalgia lateral)' },
  ],
  grip: [
    { text: 'El agarre se entrena en tres variantes: aplastar (handgrip), pinza (discos) y sostener (colgarse o cargar). Hacer solo una deja huecos.', by: 'Literatura de entrenamiento de agarre (grip sport)' },
  ],
  deadHang: [
    { text: 'Colgarse con hombros activos (levemente bajados) y luego relajarlos alterna fuerza escapular y descompresión; acumula 1–2 minutos por sesión.', by: 'Steven Low, "Overcoming Gravity"' },
  ],
  crunch: [
    { text: 'El crunch es un movimiento de la columna, no de la cadera: enrolla las costillas hacia la pelvis y el recorrido corto es suficiente.', by: 'Stuart McGill' },
  ],
  coreStability: [
    { text: '"Los 3 grandes" (curl up, plancha lateral y bird dog) entrenan el core sin flexionar la columna con carga: mantén cada repetición 8–10 segundos.', by: 'Stuart McGill, "Back Mechanic"' },
  ],
  plank: [
    { text: 'Plancha "de máxima tensión": aprieta glúteos, cuádriceps y puños y tira los codos hacia los pies durante 10–20 segundos; vale más que 2 minutos relajado.', by: 'Pavel Tsatsouline (StrongFirst, RKC plank)' },
  ],
  sidePlank: [
    { text: 'La plancha lateral es parte de los 3 ejercicios básicos para la espalda baja: series cortas de 10 segundos con buena técnica.', by: 'Stuart McGill' },
  ],
  copenhagen: [
    { text: 'Un programa de plancha Copenhague 2–3 veces por semana redujo las lesiones de ingle en futbolistas.', by: 'Harøy y col., 2019' },
  ],
  pallof: [
    { text: 'Es entrenamiento anti-rotación: el core trabaja resistiendo el movimiento. Pausa 2–3 segundos con los brazos estirados.', by: 'John Pallof (fisioterapeuta)' },
  ],
  squat: [
    { text: 'Empuja las rodillas hacia afuera en la misma línea que las puntas de los pies y sube "empujando la cadera" hacia arriba.', by: 'Mark Rippetoe, "Starting Strength"' },
    { text: 'Apoya el pie como un trípode (talón, base del dedo gordo y del meñique) y "atornilla" los pies al piso para estabilizar la rodilla.', by: 'Aaron Horschig (Squat University)' },
    { text: 'La sentadilla profunda (por debajo del paralelo) hace crecer más glúteos y aductores que la media sentadilla.', by: 'Kubo y col., 2019' },
  ],
  legPress: [
    { text: 'La profundidad útil termina donde la pelvis empieza a girar (la zona lumbar se despega): hasta ahí, cuanto más recorrido, mejor.', by: 'Mike Israetel (Renaissance Periodization)' },
  ],
  legExtension: [
    { text: 'El sillón de cuádriceps hace crecer el recto femoral, que las sentadillas trabajan poco: es un buen complemento, no un reemplazo.', by: 'Ema y col., 2013' },
  ],
  legCurl: [
    { text: 'El curl femoral sentado (cadera flexionada) produjo más hipertrofia de isquiotibiales que el acostado en el mismo programa.', by: 'Maeo y col., 2021' },
  ],
  nordic: [
    { text: 'Incluir curls nórdicos reduce aproximadamente a la mitad las lesiones de isquiotibiales en deportistas.', by: 'van der Horst y col., 2015 / Petersen y col., 2011' },
  ],
  lunge: [
    { text: 'Que la rodilla pase la punta del pie es seguro si progresas de a poco: fortalece la articulación en el rango donde suele lesionarse.', by: 'Ben Patrick ("Knees Over Toes Guy")' },
  ],
  hipThrust: [
    { text: 'Mentón metido, costillas abajo y una leve retroversión de pelvis arriba: la extensión sale de la cadera, no de la zona lumbar.', by: 'Bret Contreras ("The Glute Guy")' },
  ],
  gluteBridge: [
    { text: 'El puente y el hip thrust activan el glúteo mayor más que la sentadilla en la parte alta del recorrido.', by: 'Contreras y col., 2015' },
  ],
  abductor: [
    { text: 'Varía el ángulo del torso en la máquina (erguido / inclinado adelante) para cubrir las porciones superior y media del glúteo.', by: 'Bret Contreras' },
  ],
  calf: [
    { text: 'Pausa abajo con el gemelo estirado y sube hasta la punta: la mayor parte del crecimiento viene de la parte estirada del recorrido.', by: 'Kassiano y col., 2023 / Jeff Nippard' },
  ],
  tibial: [
    { text: 'Elevar las puntas contra una pared fortalece el tibial anterior, olvidado en la mayoría de las rutinas y clave para correr y saltar.', by: 'Ben Patrick ("Knees Over Toes Guy")' },
  ],
  kbSwing: [
    { text: 'El swing es una bisagra explosiva: "lanza" la pesa hacia atrás entre las piernas como un pase de fútbol americano y termina en una plancha de pie.', by: 'Pavel Tsatsouline (StrongFirst)' },
  ],
  turkishGetUp: [
    { text: 'Aprende el get up por partes y con la vista en la pesa todo el tiempo; la calidad del movimiento importa más que el peso.', by: 'Gray Cook / Pavel Tsatsouline' },
  ],
  olympic: [
    { text: 'La barra viaja pegada al cuerpo y la potencia sale de la triple extensión (tobillo, rodilla y cadera); los brazos solo terminan el movimiento.', by: 'Greg Everett (Catalyst Athletics)' },
  ],
  farmerWalk: [
    { text: 'Las cargas caminando (granjero, maleta) completan cualquier programa: agarre, core y postura en un solo ejercicio.', by: 'Dan John' },
  ],
  running: [
    { text: 'Alrededor del 80% del tiempo de carrera debería ser suave (puedes conversar) y el 20% intenso: así entrenan los corredores de resistencia de élite.', by: 'Stephen Seiler (entrenamiento polarizado)' },
  ],
  rowErg: [
    { text: 'Orden del tirón: piernas, torso, brazos; y en la vuelta, al revés: brazos, torso, piernas.', by: 'Concept2 (técnica oficial)' },
  ],
  swimming: [
    { text: 'Cabeza baja y mirada al fondo: al bajar la cabeza, la cadera sube y el cuerpo ofrece menos resistencia.', by: 'Terry Laughlin, "Total Immersion"' },
  ],
  yoga: [
    { text: 'Usa la respiración como guía: si no puedes respirar con calma en una postura, retrocede un poco.', by: 'Práctica tradicional de yoga (pranayama)' },
  ],
});
