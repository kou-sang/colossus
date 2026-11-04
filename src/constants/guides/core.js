// Fichas de core: flexión, anti-extensión, anti-rotación, rotación y flexión lateral.
export const CORE_GUIDES = {
  // ───────── Flexión de tronco en el piso ─────────
  CRUNCH: {
    family: 'crunch',
    steps: [
      'Acuéstate boca arriba con las rodillas flexionadas y los pies apoyados al ancho de la cadera.',
      'Apoya las yemas de los dedos detrás de las orejas, con los codos abiertos.',
      'Enrolla el tronco despegando solo los omóplatos del piso, acercando las costillas a la pelvis.',
      'Baja vértebra por vértebra hasta apoyar los hombros sin relajar del todo el abdomen.',
    ],
    tip: 'El recorrido es corto: la zona lumbar no se despega del piso.',
  },
  'SIT UP': {
    family: 'sitUp',
    steps: [
      'Acostado boca arriba, rodillas flexionadas y pies firmes en el piso (puedes trabarlos bajo un apoyo).',
      'Manos detrás de la cabeza o cruzadas sobre el pecho.',
      'Enrolla primero los hombros y sigue subiendo hasta quedar sentado con el torso vertical.',
      'Vuelve a bajar controlando hasta apoyar la espalda completa.',
    ],
    tip: 'A diferencia del crunch, aquí trabajan también los flexores de cadera en la segunda mitad del recorrido.',
  },
  'SIT UP EN BANCO DECLINADO': {
    family: 'sitUp',
    steps: [
      'Siéntate en el banco declinado y traba los tobillos bajo los rodillos.',
      'Recuéstate hasta que la espalda quede casi apoyada en la almohadilla, con las manos detrás de la cabeza.',
      'Sube enrollando el tronco hasta que el pecho apunte a las rodillas.',
      'Desciende lento hasta casi tocar el respaldo y repite sin apoyarte.',
    ],
    tip: 'Más declinación = más difícil; agrega un disco al pecho solo cuando domines 15 repeticiones.',
  },
  'CRUNCH INVERSO': {
    family: 'reverseCrunch',
    steps: [
      'Acostado boca arriba, brazos a los lados con las palmas al piso.',
      'Eleva las piernas con las rodillas a 90° (muslos verticales).',
      'Enrolla la pelvis llevando las rodillas hacia el pecho y despegando la cola del piso.',
      'Baja la pelvis despacio hasta volver a apoyar el sacro, sin dejar caer las piernas.',
    ],
    tip: 'Piensa en "rodar" la pelvis, no en patear las piernas hacia arriba.',
  },
  'CRUNCH CON PIERNAS ELEVADAS': {
    family: 'crunch',
    steps: [
      'Acuéstate y eleva las piernas estiradas hasta la vertical, con los tobillos juntos.',
      'Extiende los brazos por detrás de la cabeza.',
      'Despega los hombros llevando las manos hacia las puntas de los pies.',
      'Regresa los hombros al piso manteniendo las piernas quietas en la vertical.',
    ],
    tip: 'Las piernas verticales bloquean la ayuda de la cadera: todo el esfuerzo es del recto abdominal.',
  },
  'CURL UP DE MCGILL': {
    family: 'coreStability',
    steps: [
      'Acuéstate con una pierna flexionada y la otra estirada en el piso.',
      'Coloca las manos debajo de la zona lumbar para mantener su curva natural.',
      'Eleva apenas la cabeza y los hombros como un bloque, sin flexionar el cuello ni la columna lumbar.',
      'Sostén 8–10 segundos respirando y apoya; cambia la pierna flexionada a mitad de la serie.',
    ],
    tip: 'Es un ejercicio de rigidez, no de recorrido: la elevación es de pocos centímetros.',
  },

  // ───────── Rotación y oblicuos ─────────
  'CRUNCH BICICLETA': {
    family: 'rotation',
    steps: [
      'Acuéstate con las manos detrás de la cabeza y los hombros despegados del piso.',
      'Eleva las piernas: una rodilla hacia el pecho y la otra pierna estirada cerca del suelo.',
      'Gira el tronco llevando el codo hacia la rodilla contraria mientras pedaleas.',
      'Alterna lados con ritmo controlado, rotando desde las costillas.',
    ],
    tip: 'El codo no tiene que tocar la rodilla: lo que importa es girar el hombro hacia la cadera contraria.',
  },
  'CRUNCH OBLICUO': {
    family: 'rotation',
    steps: [
      'Acostado, un pie apoyado y el tobillo contrario cruzado sobre esa rodilla.',
      'Mano del lado del pie apoyado detrás de la cabeza.',
      'Despega el hombro y gíralo en diagonal hacia la rodilla cruzada.',
      'Vuelve al piso y completa todas las repeticiones antes de cambiar de lado.',
    ],
    tip: 'Exhala al subir y aprieta el costado de la cintura en el punto más alto.',
  },
  'TOQUES DE TALON': {
    family: 'rotation',
    steps: [
      'Acostado con las rodillas flexionadas y los pies algo más separados que en el crunch.',
      'Despega los hombros del piso y estira los brazos a los costados del cuerpo.',
      'Inclina el tronco de lado hasta tocar el talón derecho con la mano derecha.',
      'Pasa al otro lado sin apoyar los hombros entre repeticiones.',
    ],
    tip: 'Es una inclinación lateral, no un giro: los hombros se mantienen mirando al techo.',
  },
  'RUSSIAN TWIST': {
    family: 'rotation',
    steps: [
      'Siéntate con las rodillas flexionadas y reclina el tronco unos 45°, espalda recta.',
      'Toma un disco o una pelota medicinal frente al pecho y despega los pies del piso (o déjalos apoyados para facilitar).',
      'Gira el tronco llevando el peso hacia un costado de la cadera.',
      'Gira al otro lado pasando por el centro, sin redondear la espalda.',
    ],
    tip: 'Los hombros giran junto con el peso; si solo mueves los brazos, el oblicuo no trabaja.',
  },
  LIMPIAPARABRISAS: {
    family: 'rotation',
    steps: [
      'Acuéstate con los brazos abiertos en cruz y las palmas apoyadas en el piso.',
      'Eleva las piernas juntas hasta la vertical.',
      'Bájalas hacia un costado, como un limpiaparabrisas, sin despegar los hombros.',
      'Regresa al centro con el abdomen y baja hacia el otro lado.',
    ],
    tip: 'Comienza con las rodillas flexionadas y amplía el recorrido a medida que ganes control.',
  },

  // ───────── Piernas al tronco ─────────
  'ELEVACION DE PIERNAS': {
    family: 'legRaise',
    steps: [
      'Acuéstate boca arriba con las piernas estiradas y los brazos a los lados, palmas al piso.',
      'Presiona la zona lumbar contra el piso.',
      'Eleva las piernas juntas y estiradas hasta la vertical.',
      'Bájalas lentamente hasta quedar a pocos centímetros del piso sin que la lumbar se arquee.',
    ],
    tip: 'Si la lumbar se despega al bajar, corta el recorrido o flexiona un poco las rodillas.',
  },
  'PATADAS DE TIJERA': {
    family: 'legRaise',
    steps: [
      'Acostado con los hombros apenas despegados y las piernas estiradas a unos 20–30 cm del piso.',
      'Mantén la lumbar pegada al suelo con las manos a los costados o debajo de la cola.',
      'Sube una pierna y baja la otra alternando en movimientos cortos y rápidos.',
      'Sostén el patrón el tiempo indicado sin apoyar los talones.',
    ],
    tip: 'Puntas estiradas y movimientos cortos: el trabajo es isométrico para el abdomen bajo.',
  },
  'ELEVACION DE PIERNAS COLGADO': {
    family: 'hangingRaise',
    steps: [
      'Cuélgate de la barra con agarre prono a la anchura de los hombros y los brazos estirados.',
      'Activa los hombros (escápulas hacia abajo) para no balancearte.',
      'Eleva las piernas estiradas hasta la horizontal o más arriba, enrollando la pelvis al final.',
      'Bájalas lento hasta la vertical frenando el balanceo.',
    ],
    tip: 'Las piernas estiradas son el doble de exigentes que las rodillas: domina primero la variante con rodillas.',
  },
  'ELEVACION DE RODILLAS COLGADO': {
    family: 'hangingRaise',
    steps: [
      'Cuélgate de la barra con los brazos estirados y el cuerpo quieto.',
      'Flexiona caderas y rodillas a la vez llevando las rodillas hacia el pecho.',
      'Al final, inclina la pelvis hacia atrás para acortar el abdomen.',
      'Estira las piernas despacio hasta quedar colgado, sin balanceo.',
    ],
    tip: 'Sube las rodillas por encima de la cadera; si quedan abajo, solo trabaja el psoas.',
  },
  'ELEVACION DE RODILLAS EN PARALELAS': {
    family: 'captainChair',
    steps: [
      'Súbete a las paralelas (o a la silla romana) con los brazos estirados y la espalda apoyada si la máquina tiene respaldo.',
      'Hombros lejos de las orejas, piernas colgando.',
      'Lleva las rodillas al pecho enrollando la pelvis.',
      'Baja las piernas con control sin dejar que el cuerpo se balancee.',
    ],
    tip: 'El respaldo elimina el balanceo: ideal para aprender la elevación antes de la barra.',
  },
  'L SIT': {
    family: 'lSit',
    steps: [
      'Apóyate en las paralelas (o en el piso con paralelas bajas) con los brazos estirados y los hombros bajos.',
      'Eleva las rodillas al pecho como paso intermedio.',
      'Estira las piernas al frente hasta que queden horizontales, formando una L con el tronco.',
      'Sostén la posición el tiempo indicado con las puntas de los pies estiradas.',
    ],
    tip: 'Progresión: L sit con rodillas flexionadas, luego una pierna estirada, luego ambas.',
  },

  // ───────── Anti-extensión ─────────
  'DEAD BUG': {
    family: 'coreStability',
    steps: [
      'Acostado boca arriba, brazos estirados hacia el techo y rodillas a 90° sobre la cadera.',
      'Aplana la zona lumbar contra el piso.',
      'Estira una pierna y el brazo contrario hacia el piso sin tocarlo.',
      'Vuelve al centro y repite con el otro lado, exhalando en cada extensión.',
    ],
    tip: 'Si la lumbar se arquea, acorta la extensión de la pierna.',
  },
  'BIRD DOG': {
    family: 'coreStability',
    steps: [
      'Ponte en cuadrupedia: manos bajo los hombros y rodillas bajo la cadera.',
      'Mantén la espalda neutra, como una mesa.',
      'Estira un brazo al frente y la pierna contraria hacia atrás hasta quedar alineados con el tronco.',
      'Sostén 2 segundos, vuelve y alterna con el otro lado.',
    ],
    tip: 'Imagina un vaso de agua sobre la zona lumbar: no debe moverse.',
  },
  'HOLLOW HOLD': {
    family: 'hollow',
    steps: [
      'Acuéstate boca arriba con los brazos estirados por detrás de la cabeza.',
      'Pega la lumbar al piso apretando el abdomen.',
      'Despega hombros y piernas estiradas del suelo, formando una "banana".',
      'Sostén la posición respirando corto sin que la lumbar se despegue.',
    ],
    tip: 'Flexiona las rodillas o lleva los brazos al costado para hacerlo más fácil.',
  },
  'V UPS': {
    family: 'hollow',
    steps: [
      'Acuéstate estirado con los brazos por detrás de la cabeza.',
      'En un solo movimiento eleva piernas y tronco juntos.',
      'Toca las puntas de los pies con las manos formando una V, equilibrado sobre la cola.',
      'Baja controlando ambos extremos a la vez hasta quedar estirado.',
    ],
    tip: 'Piernas y tronco suben a la misma velocidad; si las piernas quedan atrás, flexiona las rodillas.',
  },
  'DRAGON FLAG': {
    family: 'dragonFlag',
    steps: [
      'Acuéstate en un banco y tómate del borde detrás de la cabeza.',
      'Eleva el cuerpo recto hasta quedar apoyado solo sobre la parte alta de la espalda.',
      'Baja el cuerpo rígido, de hombros a pies, hasta quedar casi horizontal.',
      'Vuelve a subir sin flexionar la cadera.',
    ],
    tip: 'Comienza con negativas: sube en bloque como puedas y trabaja solo la bajada lenta.',
  },
  'RUEDA ABDOMINAL': {
    family: 'abWheel',
    steps: [
      'Arrodíllate sobre una colchoneta y toma la rueda bajo los hombros.',
      'Redondea levemente la espalda alta y aprieta los glúteos.',
      'Rueda hacia adelante estirando el cuerpo hasta donde puedas mantener la lumbar sin arquear.',
      'Vuelve tirando con el abdomen hasta la posición inicial.',
    ],
    tip: 'Usa una pared delante para limitar el recorrido mientras ganas fuerza.',
  },
  PLANCHA: {
    family: 'plank',
    steps: [
      'Apoya los antebrazos en el piso con los codos bajo los hombros.',
      'Estira las piernas atrás y apóyate en las puntas de los pies.',
      'Forma una línea recta de cabeza a talones apretando glúteos y abdomen.',
      'Sostén el tiempo indicado respirando sin que la cadera suba ni caiga.',
    ],
    tip: 'Empuja el piso con los antebrazos para separar los omóplatos.',
  },
  'PLANCHA CON ELEVACION DE PIERNA': {
    family: 'plank',
    steps: [
      'Colócate en plancha sobre antebrazos con el cuerpo alineado.',
      'Sin mover la cadera, eleva una pierna estirada unos 15–20 cm.',
      'Sostén 2 segundos apretando el glúteo de esa pierna.',
      'Bájala y alterna, evitando que la pelvis rote.',
    ],
    tip: 'Al quitar un apoyo, la pelvis tiende a girar: el abdomen y el glúteo medio la sostienen.',
  },
  'PLANCHA EN FITBALL': {
    family: 'ballPlank',
    steps: [
      'Apoya los antebrazos sobre el fitball, manos juntas, y estira las piernas atrás.',
      'Alinea cabeza, cadera y talones.',
      'Sostén la posición o dibuja pequeños círculos con los antebrazos ("revolver la olla").',
      'Mantén la cadera quieta mientras la pelota se mueve.',
    ],
    tip: 'La inestabilidad de la pelota aumenta mucho la demanda del abdomen frente a la plancha en el piso.',
  },
  'RODILLAS AL PECHO EN FITBALL': {
    family: 'ballPlank',
    steps: [
      'Apoya las manos en el piso bajo los hombros y las tibias sobre el fitball.',
      'Alinea el cuerpo como en una plancha alta.',
      'Lleva las rodillas al pecho haciendo rodar la pelota hacia adelante.',
      'Estira las piernas para volver a la plancha sin hundir la cadera.',
    ],
    tip: 'Más lejos queda la pelota de las manos, más difícil es mantener la línea.',
  },

  // ───────── Lateral ─────────
  'PLANCHA LATERAL': {
    family: 'sidePlank',
    steps: [
      'Acuéstate de costado con el codo de apoyo justo debajo del hombro.',
      'Apila los pies (o pon uno delante del otro para más estabilidad).',
      'Eleva la cadera hasta formar una línea recta de cabeza a pies.',
      'Sostén; para progresar, eleva el brazo libre hacia el techo.',
    ],
    tip: 'Empuja el piso con el antebrazo para que el hombro no se hunda.',
  },
  'PLANCHA COPENHAGUE': {
    family: 'copenhagen',
    steps: [
      'Acuéstate de costado junto a un banco con el antebrazo bajo el hombro.',
      'Apoya el tobillo (o la rodilla, en la versión corta) de la pierna de arriba sobre el banco.',
      'Eleva la cadera apretando la pierna de arriba contra el banco; la pierna de abajo se despega del piso.',
      'Sostén con el cuerpo en línea y cambia de lado.',
    ],
    tip: 'Empieza con la rodilla sobre el banco (palanca corta) antes de apoyar el tobillo.',
  },
  'FLEXION LATERAL CON MANCUERNA': {
    family: 'sideBend',
    steps: [
      'De pie, pies al ancho de la cadera, una mancuerna en una mano y el otro brazo relajado.',
      'Deja que la mancuerna baje por el costado del muslo inclinando el tronco de lado.',
      'Sube contrayendo el oblicuo del lado opuesto hasta pasar levemente la vertical.',
      'Completa la serie y cambia de mano.',
    ],
    tip: 'Usa una sola mancuerna: con una en cada mano los pesos se compensan y el oblicuo no trabaja.',
  },
  'FLEXION LATERAL EN BANCO ROMANO': {
    family: 'sideBend',
    steps: [
      'Colócate de costado en el banco romano con la cadera sobre la almohadilla y los pies trabados.',
      'Cruza los brazos sobre el pecho o pon las manos detrás de la cabeza.',
      'Baja el tronco de lado hacia el piso.',
      'Elévalo inclinándote hacia el techo hasta pasar la línea del cuerpo.',
    ],
    tip: 'El tronco se mueve en un solo plano: sin girar hacia el piso ni hacia el techo.',
  },
  'MOLINO CON KETTLEBELL': {
    family: 'windmill',
    steps: [
      'Sostén la kettlebell arriba con el brazo estirado; pies algo más abiertos que la cadera y apuntando hacia el lado contrario a la pesa.',
      'Mira la pesa durante todo el movimiento.',
      'Empuja la cadera hacia el lado de la pesa e inclina el tronco hasta tocar el pie contrario con la mano libre.',
      'Sube manteniendo el brazo vertical hasta quedar erguido.',
    ],
    tip: 'La pierna del lado de la pesa queda estirada; la otra puede flexionarse un poco.',
  },

  // ───────── Poleas y máquinas ─────────
  'CRUNCH EN POLEA': {
    family: 'cableCrunch',
    steps: [
      'Arrodíllate frente a la polea alta con la soga tomada a los costados de la cabeza.',
      'Fija la cadera en una posición: no se mueve durante la serie.',
      'Enrolla el tronco llevando los codos hacia los muslos.',
      'Vuelve hasta estirar el abdomen sin que la carga te levante.',
    ],
    tip: 'Las manos quedan pegadas a la cabeza; si los brazos tiran, trabajan los dorsales.',
  },
  'CRUNCH EN MAQUINA': {
    family: 'machineCrunch',
    steps: [
      'Siéntate en la máquina con el pecho contra la almohadilla y toma las manijas sobre los hombros.',
      'Traba los pies bajo los rodillos si la máquina los tiene.',
      'Flexiona el tronco hacia adelante y abajo, acercando costillas y pelvis.',
      'Vuelve lento hasta sentir el estiramiento sin dejar caer la pila de discos.',
    ],
    tip: 'Elige un peso con el que sientas el abdomen y no los brazos.',
  },
  'ROTACION DE TRONCO EN MAQUINA': {
    family: 'rotaryTorso',
    steps: [
      'Siéntate en la máquina de rotación con las piernas trabadas y el pecho contra la almohadilla.',
      'Elige el rango de inicio girado hacia un lado.',
      'Gira el tronco hacia el lado contrario usando los oblicuos, no los brazos.',
      'Vuelve lento y cambia de lado al terminar la serie.',
    ],
    tip: 'Rango moderado (unos 45° por lado) y sin rebotes: la columna lumbar no está hecha para girar mucho.',
  },
  'LEÑADOR EN POLEA': {
    family: 'woodchopper',
    steps: [
      'De costado a la polea alta, toma la manija con ambas manos sobre el hombro más cercano.',
      'Pies al ancho de los hombros y rodillas apenas flexionadas.',
      'Tira en diagonal hacia abajo, cruzando el cuerpo hasta la cadera contraria, girando el tronco y pivotando el pie de atrás.',
      'Regresa controlando hasta la posición inicial.',
    ],
    tip: 'Los brazos quedan casi estirados: el movimiento lo genera el giro del tronco.',
  },
  'PALLOF PRESS': {
    family: 'pallof',
    steps: [
      'Párate de costado a la polea con la manija a la altura del pecho, tomada con ambas manos.',
      'Aléjate hasta que el cable quede tenso; pies al ancho de los hombros.',
      'Empuja la manija al frente hasta estirar los brazos sin dejar que el tronco gire hacia la polea.',
      'Sostén 2 segundos y vuelve al pecho.',
    ],
    tip: 'Es anti-rotación: el éxito es que nada se mueva salvo los brazos.',
  },
  'ROTACION CON LANDMINE': {
    family: 'landmineRotation',
    steps: [
      'Coloca una barra en el landmine y toma la punta con ambas manos frente a la cara, brazos estirados.',
      'Pies algo más abiertos que los hombros y rodillas apenas flexionadas.',
      'Lleva la punta en arco hacia una cadera girando hombros y caderas.',
      'Vuelve por arriba y desciende hacia la otra cadera.',
    ],
    tip: 'Los brazos se mantienen largos y el arco es controlado: no dejes que la barra te arrastre.',
  },
};
