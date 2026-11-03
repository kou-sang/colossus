// Fichas de cardio, funcional, crossfit, combate y movilidad.
export const CONDITIONING_GUIDES = {
  // ───────── Cardio ─────────
  RUNNING: {
    family: 'running',
    steps: [
      'Corre con el tronco erguido e inclinado apenas hacia adelante desde los tobillos.',
      'Apoya el pie debajo de la cadera, no por delante, con la rodilla levemente flexionada.',
      'Balancea los brazos con los codos a ~90°, de adelante hacia atrás sin cruzar el pecho.',
      'Mantén una cadencia ágil (pasos cortos y frecuentes) y respira de forma rítmica.',
    ],
    tip: 'Para medir intensidad: a ritmo suave deberías poder hablar en frases completas.',
  },
  SPRINTS: {
    family: 'running',
    steps: [
      'Arranca con el cuerpo inclinado hacia adelante y empuja fuerte el piso con la pierna de atrás.',
      'En la aceleración da pasos potentes llevando la rodilla alta y el brazo contrario adelante.',
      'Endereza el tronco progresivamente a medida que ganas velocidad.',
      'Recupera caminando o trotando entre series hasta poder repetir con la misma calidad.',
    ],
    tip: 'Calienta bien y empieza al 80 % de tu velocidad máxima; los isquios son los más expuestos.',
  },
  CINTA: {
    family: 'running',
    steps: [
      'Sube a la cinta parado sobre los laterales, enciéndela a velocidad baja y recién entonces pisa la banda.',
      'Corre en el centro de la banda, sin acercarte demasiado a la consola.',
      'Suelta las barandas: los brazos se balancean igual que corriendo afuera.',
      'Agrega 1 % de inclinación para compensar la falta de viento y terreno.',
    ],
    tip: 'Engancha el clip de seguridad a la ropa: detiene la cinta si te caes.',
  },
  CAMINATA: {
    family: 'walking',
    steps: [
      'Camina erguido, con la mirada al frente y los hombros relajados.',
      'Apoya primero el talón y rueda el pie hasta despegar con los dedos.',
      'Balancea los brazos de forma natural, en oposición a las piernas.',
      'Mantén un ritmo que te deje conversar pero que eleve el pulso.',
    ],
    tip: 'A paso ligero (unos 6 km/h) ya es un excelente ejercicio aeróbico de baja intensidad.',
  },
  'CAMINATA EN PENDIENTE': {
    family: 'walking',
    steps: [
      'Sube la inclinación de la cinta (8–15 %) a una velocidad que puedas caminar sin agarrarte.',
      'Inclina un poco el tronco hacia adelante desde los tobillos, no desde la cintura.',
      'Empuja con toda la planta del pie y siente el trabajo en glúteos y pantorrillas.',
      'Mantén los brazos libres balanceándose; colgarte de las barandas anula el beneficio.',
    ],
    tip: 'La pendiente aumenta mucho el gasto sin el impacto de correr.',
  },
  SKIPPING: {
    family: 'plyo',
    steps: [
      'Párate erguido sobre la parte delantera de los pies.',
      'Eleva una rodilla hasta la altura de la cadera mientras el brazo contrario sube.',
      'Alterna rápidamente, apoyando solo la punta del pie bajo la cadera.',
      'Mantén el tronco alto sin echarte hacia atrás.',
    ],
    tip: 'Contactos cortos y rápidos: piensa en "piso caliente".',
  },
  ESCALADORA: {
    family: 'stairs',
    steps: [
      'Sube a la escaladora con la máquina detenida y tómate de las barandas laterales solo para equilibrarte.',
      'Elige una velocidad que te permita apoyar el pie completo en cada escalón.',
      'Sube escalón por escalón empujando con el talón y extendiendo la cadera.',
      'Mantén el tronco erguido, sin apoyar el peso en los brazos.',
    ],
    tip: 'Saltear un escalón cada tanto aumenta el trabajo de glúteos.',
  },
  STEPPER: {
    family: 'stairs',
    steps: [
      'Sube a los pedales con los pies completos apoyados y tómate de la baranda.',
      'Presiona un pedal hacia abajo mientras el otro sube, de forma alternada.',
      'Usa recorridos medios: sin que los pedales toquen el tope de abajo ni el de arriba.',
      'Mantén la cadera y el tronco quietos y el peso sobre las piernas.',
    ],
    tip: 'Si los pedales golpean el tope, aumenta la resistencia en lugar de acelerar.',
  },
  CICLISMO: {
    family: 'cycling',
    steps: [
      'Ajusta el asiento: con el pedal abajo la rodilla queda apenas flexionada (25–35°).',
      'Toma el manubrio con los codos levemente flexionados y la espalda recta, inclinada hacia adelante.',
      'Pedalea en círculos completos: empuja hacia abajo y tira hacia atrás por debajo.',
      'Mantén una cadencia de 80–95 rpm y cambia de marcha según la pendiente.',
    ],
    tip: 'Usa casco y luces; en la calle la técnica más importante es la visibilidad.',
  },
  'BICICLETA FIJA': {
    family: 'cycling',
    steps: [
      'Ajusta la altura del asiento a la de tu cadera estando de pie junto a la bici.',
      'Siéntate con el tronco erguido o apenas inclinado y las manos en el manubrio.',
      'Pedalea con las rodillas alineadas con los pies, sin abrirlas hacia afuera.',
      'Regula la resistencia para que el ritmo no sea solo velocidad sin carga.',
    ],
    tip: 'Ideal para cardio sin impacto o para calentar antes de piernas.',
  },
  'BICICLETA RECLINADA': {
    family: 'cycling',
    steps: [
      'Siéntate con la espalda completamente apoyada en el respaldo.',
      'Ajusta la distancia del asiento: con el pedal más lejos la rodilla queda casi extendida.',
      'Toma las manijas laterales y pedalea empujando con el talón.',
      'Mantén la zona lumbar pegada al respaldo durante todo el ejercicio.',
    ],
    tip: 'El respaldo descarga la espalda: buena opción si tienes molestias lumbares.',
  },
  'ASSAULT BIKE': {
    family: 'cycling',
    steps: [
      'Ajusta el asiento como en una bici fija y toma las manijas móviles.',
      'Empuja una manija y tira de la otra mientras pedaleas, coordinando brazos y piernas.',
      'Para esprintar, inclínate apenas hacia adelante y acelera piernas y brazos a la vez.',
      'Para descansar, suelta las manijas y pedalea solo con las piernas.',
    ],
    tip: 'El ventilador aumenta la resistencia cuanto más fuerte vas: los intervalos cortos son brutales.',
  },
  ELIPTICO: {
    family: 'elliptical',
    steps: [
      'Sube a los pedales con la máquina quieta y toma las manijas móviles.',
      'Mueve los pies en elipse manteniendo toda la planta apoyada.',
      'Empuja y tira de las manijas en oposición a las piernas.',
      'Mantén el tronco erguido, sin apoyar el peso sobre los brazos.',
    ],
    tip: 'Pedalear hacia atrás cada tanto involucra más los isquiotibiales.',
  },
  'REMO ERGOMETRO': {
    family: 'rowErg',
    steps: [
      'Ataque: rodillas flexionadas, tibias verticales, tronco inclinado hacia adelante y brazos estirados.',
      'Empuja con las piernas manteniendo los brazos estirados.',
      'Cuando las piernas terminan, abre el tronco hacia atrás y tira del mango hasta las costillas bajas.',
      'Vuelve en orden inverso: brazos, tronco y por último flexiona las rodillas.',
    ],
    tip: 'Ritmo 1:2 — el empuje es explosivo y la vuelta dura el doble.',
  },
  'SKI ERG': {
    family: 'skiErg',
    steps: [
      'Párate frente a la máquina y toma las manijas arriba con los brazos casi estirados.',
      'Tira hacia abajo flexionando la cadera y las rodillas a la vez, como si clavaras bastones.',
      'Termina con las manos al costado de los muslos y el tronco inclinado.',
      'Vuelve a estirarte acompañando las manijas hacia arriba.',
    ],
    tip: 'La potencia viene de la bisagra de cadera, no solo de los brazos.',
  },
  NATACION: {
    family: 'swimming',
    steps: [
      'Flota horizontal con la cara en el agua y la mirada hacia el fondo.',
      'Estira un brazo adelante mientras el otro tira del agua hacia la cadera.',
      'Gira el cuerpo de lado a lado con cada brazada y saca la boca al costado para respirar.',
      'Patea con las piernas casi estiradas, desde la cadera y con los tobillos relajados.',
    ],
    tip: 'Respira cada 3 brazadas para equilibrar ambos lados.',
  },
  SOGA: {
    family: 'jumpRope',
    steps: [
      'Ajusta el largo: pisando el centro, las manijas llegan a las axilas.',
      'Codos pegados al cuerpo y manos a la altura de la cadera.',
      'Gira la soga con las muñecas, no con los hombros.',
      'Salta apenas unos centímetros sobre la punta de los pies, con las rodillas suaves.',
    ],
    tip: 'Un salto por vuelta y bajo: el ritmo importa más que la altura.',
  },
  'DOBLE SALTO DE SOGA': {
    family: 'jumpRope',
    steps: [
      'Empieza con algunos saltos simples para tomar ritmo.',
      'Salta más alto de lo normal, con el cuerpo recto y los pies juntos.',
      'Acelera el giro de muñecas para que la soga pase dos veces antes de aterrizar.',
      'Aterriza sobre la punta de los pies y encadena el siguiente salto.',
    ],
    tip: 'No dobles las rodillas para ganar tiempo: el salto debe ser vertical.',
  },

  // ───────── Saltos ─────────
  'SENTADILLA CON SALTO': {
    family: 'plyo',
    steps: [
      'Párate con los pies al ancho de los hombros y los brazos relajados al costado.',
      'Baja a media sentadilla llevando los brazos hacia atrás.',
      'Salta explosivamente estirando el cuerpo y llevando los brazos arriba.',
      'Aterriza suave en media sentadilla y enlaza el siguiente salto.',
    ],
    tip: 'Aterriza en silencio: rodillas alineadas con los pies y cadera atrás.',
  },
  'SALTO AL CAJON': {
    family: 'plyo',
    steps: [
      'Párate a un paso del cajón con los pies al ancho de la cadera.',
      'Carga con una media sentadilla y los brazos atrás.',
      'Salta llevando las rodillas al pecho y aterriza con los pies completos sobre el cajón.',
      'Párate arriba y baja caminando, no saltando hacia atrás.',
    ],
    tip: 'Elige una altura que te permita aterrizar en media sentadilla, no en sentadilla profunda.',
  },
  'SALTO HORIZONTAL': {
    family: 'plyo',
    steps: [
      'Párate detrás de una línea con los pies al ancho de la cadera.',
      'Balancea los brazos hacia atrás flexionando cadera y rodillas.',
      'Lanza los brazos al frente y salta lo más lejos posible.',
      'Aterriza con ambos pies a la vez, absorbiendo con cadera y rodillas.',
    ],
    tip: 'Mide la distancia desde la línea hasta el talón más atrasado.',
  },
  'ESTOCADAS CON SALTO': {
    family: 'plyo',
    steps: [
      'Colócate en posición de estocada con ambas rodillas a 90°.',
      'Salta explosivamente hacia arriba.',
      'En el aire cambia las piernas de posición.',
      'Aterriza suave en estocada con la otra pierna adelante y repite.',
    ],
    tip: 'La rodilla de atrás no golpea el piso: frena unos centímetros antes.',
  },
  'JUMPING JACKS': {
    family: 'plyo',
    steps: [
      'Párate con los pies juntos y los brazos al costado.',
      'Salta abriendo las piernas más allá de los hombros mientras subes los brazos por los costados.',
      'Junta las palmas (o casi) sobre la cabeza.',
      'Salta de nuevo para cerrar piernas y bajar los brazos.',
    ],
    tip: 'Mantén las rodillas suaves y aterriza en la punta de los pies.',
  },
  PATINADOR: {
    family: 'plyo',
    steps: [
      'Párate sobre una pierna con la rodilla flexionada.',
      'Salta lateralmente hacia el otro lado.',
      'Aterriza sobre la otra pierna cruzando la pierna libre por detrás.',
      'Estabiliza un instante y salta de regreso.',
    ],
    tip: 'Aterriza con la rodilla alineada con el pie, sin que se vaya hacia adentro.',
  },
  'SENTADILLA A UNA PIERNA': {
    family: 'pistol',
    steps: [
      'Párate sobre una pierna con la otra estirada al frente.',
      'Lleva los brazos adelante como contrapeso.',
      'Baja lentamente sentándote atrás hasta quedar en sentadilla profunda sobre una pierna.',
      'Sube empujando con todo el pie sin que el talón se despegue.',
    ],
    tip: 'Progresión: baja hasta un cajón, luego desde un escalón con la pierna libre colgando.',
  },

  // ───────── Peso corporal ─────────
  BURPEES: {
    family: 'burpee',
    steps: [
      'Desde de pie, agáchate y apoya las manos en el piso.',
      'Salta con los pies hacia atrás hasta quedar en plancha.',
      'Vuelve a llevar los pies junto a las manos.',
      'Salta estirando el cuerpo con las manos sobre la cabeza.',
    ],
    tip: 'Agrega una flexión en la plancha para la versión completa.',
  },
  'BURPEE SOBRE LA BARRA': {
    family: 'burpee',
    steps: [
      'Colócate de costado a una barra apoyada en el piso.',
      'Haz el burpee bajando el pecho al piso junto a la barra.',
      'Vuelve a pararte con los pies juntos.',
      'Salta lateralmente por encima de la barra con ambos pies a la vez y repite del otro lado.',
    ],
    tip: 'Pecho al piso y salto con los dos pies a la vez: son los estándares del movimiento.',
  },
  ESCALADORES: {
    family: 'burpee',
    steps: [
      'Colócate en plancha alta con las manos bajo los hombros.',
      'Lleva una rodilla hacia el pecho sin subir la cadera.',
      'Cambia de pierna rápidamente, como si corrieras en el lugar.',
      'Mantén los hombros sobre las manos todo el tiempo.',
    ],
    tip: 'Aprieta el abdomen: si la cadera rebota, baja la velocidad.',
  },
  'CAMINATA DEL OSO': {
    family: 'crawl',
    steps: [
      'Ponte en cuadrupedia y despega las rodillas unos centímetros del piso.',
      'Avanza moviendo a la vez la mano y el pie contrarios.',
      'Mantén la espalda plana y la cadera a la altura de los hombros.',
      'Da pasos cortos sin que las rodillas toquen el piso.',
    ],
    tip: 'Ponte un vaso de plástico en la espalda baja: si se cae, tu cadera se movió.',
  },
  'PLANCHA CON TOQUE DE HOMBRO': {
    family: 'crawl',
    steps: [
      'Colócate en plancha alta con los pies algo separados.',
      'Lleva una mano a tocar el hombro contrario.',
      'Devuelve la mano al piso y toca con la otra.',
      'Alterna sin que la cadera se balancee de lado a lado.',
    ],
    tip: 'Pies más juntos = más difícil; ábrelos para ganar estabilidad.',
  },
  'CAMINATA DE GUSANO': {
    family: 'crawl',
    steps: [
      'De pie, flexiona la cadera y apoya las manos en el piso cerca de los pies (flexiona las rodillas si hace falta).',
      'Camina con las manos hacia adelante hasta quedar en plancha alta.',
      'Opcional: haz una flexión.',
      'Camina con los pies hacia las manos manteniendo las piernas lo más estiradas posible.',
    ],
    tip: 'Excelente para entrada en calor: estira isquios y activa hombros y core.',
  },
  'WALL WALK': {
    family: 'hspu',
    steps: [
      'Acuéstate boca abajo con los pies contra la pared.',
      'Empuja hasta plancha alta y apoya los pies en la pared.',
      'Camina con los pies hacia arriba mientras retrocedes con las manos hacia la pared.',
      'Llega hasta quedar en vertical con el pecho cerca de la pared y baja en orden inverso.',
    ],
    tip: 'Aprieta glúteos y abdomen: el cuerpo debe estar recto, sin arquear la espalda.',
  },
  'CAMINATA EN VERTICAL': {
    family: 'hspu',
    steps: [
      'Patea a la vertical con los brazos estirados y el cuerpo apretado.',
      'Inclina levemente los hombros hacia adelante para empezar a "caer".',
      'Da pasos cortos con las manos para atrapar ese desequilibrio.',
      'Para terminar, baja una pierna al piso de forma controlada.',
    ],
    tip: 'Domina 30–60 segundos de vertical contra la pared antes de intentar caminar.',
  },
  'FLEXIONES EN VERTICAL': {
    family: 'hspu',
    steps: [
      'Ponte en vertical de espaldas a la pared, con las manos un poco más abiertas que los hombros.',
      'Baja la cabeza controlando hasta tocar suavemente una colchoneta.',
      'Los codos apuntan hacia adelante y algo afuera, no completamente abiertos.',
      'Empuja hasta estirar los brazos manteniendo el cuerpo recto.',
    ],
    tip: 'Si todavía no tienes la fuerza, usa una pila de colchonetas para acortar el recorrido.',
  },

  // ───────── Kettlebell, mancuerna y balón ─────────
  'KETTLEBELL SWING': {
    family: 'kbSwing',
    steps: [
      'Párate con los pies algo más abiertos que los hombros y la pesa en el piso un poco adelante.',
      'Toma la pesa con ambas manos y llévala hacia atrás entre las piernas (bisagra de cadera).',
      'Extiende la cadera de forma explosiva para lanzar la pesa al frente.',
      'Déjala subir hasta la altura del pecho y recíbela de nuevo entre las piernas con la cadera atrás.',
    ],
    tip: 'Los brazos solo guían: la pesa sube por la potencia de la cadera.',
  },
  'SNATCH CON KETTLEBELL': {
    family: 'kbBallistic',
    steps: [
      'Empieza con un balanceo hacia atrás entre las piernas con una sola mano.',
      'Extiende la cadera y tira la pesa cerca del cuerpo con el codo alto.',
      'Mete la mano por debajo para que la pesa gire sobre el antebrazo y no golpee.',
      'Termina con el brazo estirado arriba y vuelve a bajarla en arco hasta las piernas.',
    ],
    tip: 'Si la pesa golpea el antebrazo, estás llevándola demasiado lejos del cuerpo.',
  },
  'ARRANQUE CON MANCUERNA': {
    family: 'kbBallistic',
    steps: [
      'Coloca la mancuerna entre los pies y tómala con una mano, cadera atrás y pecho alto.',
      'Extiende piernas y cadera de forma explosiva manteniendo la mancuerna cerca del cuerpo.',
      'Tira con el codo alto y métete debajo con una flexión rápida de rodillas.',
      'Recíbela con el brazo bloqueado arriba y párate completamente.',
    ],
    tip: 'Alterna de mano en cada repetición para equilibrar el trabajo.',
  },
  'HALO CON KETTLEBELL': {
    family: 'halo',
    steps: [
      'Sostén la kettlebell invertida por los cuernos frente al pecho.',
      'Llévala alrededor de la cabeza, pasando junto a una oreja.',
      'Pasa por detrás de la nuca y vuelve por el otro lado.',
      'Completa las vueltas en un sentido y luego en el otro.',
    ],
    tip: 'Aprieta glúteos y abdomen para que la espalda baja no se arquee.',
  },
  'GET UP TURCO': {
    family: 'turkishGetUp',
    steps: [
      'Acostado, presiona la kettlebell arriba con un brazo y flexiona la rodilla del mismo lado.',
      'Empuja con ese pie y rueda hasta apoyarte en el codo y luego en la mano contraria.',
      'Eleva la cadera, pasa la pierna estirada por debajo y apoya esa rodilla.',
      'Desde la media rodilla, párate; luego deshaz cada paso en orden inverso.',
    ],
    tip: 'Mira la pesa y mantén el brazo vertical durante todo el recorrido.',
  },
  'DEVIL PRESS': {
    family: 'devilPress',
    steps: [
      'Con una mancuerna en cada mano, baja el pecho al piso como en un burpee.',
      'Salta con los pies hacia las manos quedando en bisagra con las mancuernas en el piso.',
      'Lanza las mancuernas entre las piernas y hacia arriba con la extensión de cadera.',
      'Termínalas sobre la cabeza con los brazos bloqueados.',
    ],
    tip: 'Es un movimiento de cadera: si lo haces con los brazos te agotas en pocas repeticiones.',
  },
  'WALL BALL': {
    family: 'medBall',
    steps: [
      'Párate frente a la pared con el balón medicinal a la altura del pecho.',
      'Haz una sentadilla profunda manteniendo el balón pegado al pecho.',
      'Sube de forma explosiva y lanza el balón hacia el objetivo marcado en la pared.',
      'Recíbelo y encadena directamente con la siguiente sentadilla.',
    ],
    tip: 'Usa el impulso de las piernas: el lanzamiento empieza en la sentadilla.',
  },
  'SLAM BALL': {
    family: 'medBall',
    steps: [
      'Sostén el balón sobre la cabeza con los brazos estirados.',
      'Lánzalo con fuerza contra el piso frente a tus pies, flexionando cadera y tronco.',
      'Acompaña con las rodillas al bajar.',
      'Recógelo con la espalda neutra (bisagra) y vuelve a subirlo.',
    ],
    tip: 'Usa un slam ball sin rebote: un balón que rebota puede golpearte la cara.',
  },
  'LANZAMIENTO LATERAL DE BALON': {
    family: 'medBall',
    steps: [
      'Párate de costado a la pared con el balón a la altura de la cadera más alejada.',
      'Gira el tronco y la cadera cargando el balón hacia atrás.',
      'Rota de forma explosiva y lanza el balón contra la pared.',
      'Recíbelo y repite; completa la serie y cambia de lado.',
    ],
    tip: 'Pivota el pie de atrás: la rotación debe venir de la cadera.',
  },
  'BATTLE ROPES': {
    family: 'battleRopes',
    steps: [
      'Toma un extremo de la soga en cada mano y aléjate hasta que tengan algo de tensión.',
      'Colócate en media sentadilla con el pecho alto.',
      'Sube y baja los brazos alternadamente para generar ondas que lleguen al anclaje.',
      'Mantén el ritmo durante el tiempo indicado sin pararte del todo.',
    ],
    tip: 'Prueba variantes: ondas dobles, golpes al piso o círculos hacia afuera.',
  },
  'REMO EN TRX': {
    family: 'trxRow',
    steps: [
      'Toma las manijas y camina hacia el anclaje hasta que el cuerpo quede inclinado hacia atrás.',
      'Cuerpo recto de talones a cabeza, brazos estirados.',
      'Tira del pecho hacia las manos juntando los omóplatos.',
      'Baja controlando hasta estirar los brazos sin perder la línea del cuerpo.',
    ],
    tip: 'Más vertical = más fácil; caminar los pies hacia el anclaje lo hace más difícil.',
  },

  // ───────── Halterofilia ─────────
  'CARGADA DE POTENCIA': {
    family: 'olympic',
    steps: [
      'Posición inicial: barra sobre el medio del pie, agarre un poco más ancho que los hombros, hombros apenas por delante de la barra.',
      'Primer tirón: despega la barra extendiendo las rodillas con la espalda firme.',
      'Segundo tirón: al pasar las rodillas, extiende cadera, rodillas y tobillos de golpe y encoge los hombros.',
      'Métete debajo y recibe la barra sobre los hombros con los codos altos, en media sentadilla.',
    ],
    tip: 'La barra viaja pegada al cuerpo: si se aleja, los brazos están tirando demasiado pronto.',
  },
  'CARGADA COLGANTE': {
    family: 'olympic',
    steps: [
      'Párate con la barra en las manos y bájala hasta justo encima de las rodillas con bisagra de cadera.',
      'Desde esa posición, salta extendiendo cadera y rodillas de forma explosiva.',
      'Encoge los hombros y tira con los codos altos y afuera.',
      'Gira los codos rápido y recibe la barra en los hombros en media sentadilla.',
    ],
    tip: 'Ideal para aprender el segundo tirón sin la complejidad de sacar la barra del piso.',
  },
  ARRANQUE: {
    family: 'olympic',
    steps: [
      'Toma la barra con agarre ancho (la barra queda en la ingle al estar de pie).',
      'Despega la barra del piso con la espalda firme y los hombros por delante.',
      'Extiende la cadera de forma explosiva cuando la barra pasa por los muslos.',
      'Métete debajo y recibe la barra arriba con los brazos bloqueados en sentadilla profunda.',
    ],
    tip: 'Trabaja primero la sentadilla overhead: sin esa movilidad no podrás recibir el arranque.',
  },
  'SENTADILLA OVERHEAD': {
    family: 'overheadSquat',
    steps: [
      'Sostén la barra sobre la cabeza con agarre ancho y brazos bloqueados.',
      'Empuja la barra hacia arriba y activa los hombros.',
      'Baja en sentadilla profunda manteniendo la barra sobre el medio del pie.',
      'Sube sin que la barra se vaya hacia adelante.',
    ],
    tip: 'Practica con un palo de escoba antes de cargar peso.',
  },
  THRUSTER: {
    family: 'thruster',
    steps: [
      'Coloca la barra en posición de rack frontal sobre los hombros.',
      'Haz una sentadilla frontal completa con los codos altos.',
      'Sube de forma explosiva y usa ese impulso para empujar la barra sobre la cabeza.',
      'Bájala de nuevo a los hombros y encadena con la siguiente sentadilla.',
    ],
    tip: 'Es un solo movimiento continuo: no hagas una pausa entre la sentadilla y el empuje.',
  },
  'PUSH PRESS': {
    family: 'thruster',
    steps: [
      'Barra en rack frontal, pies al ancho de la cadera.',
      'Flexiona levemente las rodillas (unos 10 cm) con el tronco vertical.',
      'Extiende las piernas de golpe y empuja la barra sobre la cabeza.',
      'Termina con los brazos bloqueados y la cabeza "pasando la ventana" entre los brazos.',
    ],
    tip: 'La flexión es corta y rápida: no es una sentadilla.',
  },
  ENVION: {
    family: 'olympic',
    steps: [
      'Barra en rack frontal con los codos un poco adelante.',
      'Hunde levemente las rodillas con el tronco vertical.',
      'Impulsa la barra hacia arriba y métete debajo abriendo los pies en tijera (uno adelante y otro atrás).',
      'Bloquea los brazos y vuelve a juntar los pies: primero el de adelante, luego el de atrás.',
    ],
    tip: 'Recibe con el peso repartido entre ambas piernas y el talón de atrás elevado.',
  },
  'TIRON ALTO SUMO': {
    family: 'highPull',
    steps: [
      'Párate con los pies muy abiertos y toma la barra con agarre cerrado en el centro.',
      'Levántala como en un peso muerto sumo hasta la cadera.',
      'Sigue el impulso tirando con los codos altos y afuera.',
      'Lleva la barra hasta debajo del mentón y bájala controlando.',
    ],
    tip: 'Los codos siempre por encima de las manos al final del tirón.',
  },
  'ESTOCADAS CON PESO SOBRE LA CABEZA': {
    family: 'overheadSquat',
    steps: [
      'Sostén la barra (o un disco) sobre la cabeza con los brazos bloqueados.',
      'Da un paso al frente manteniendo el peso sobre la cabeza.',
      'Baja con la barra arriba hasta que la rodilla de atrás casi toque el piso.',
      'Vuelve a juntar los pies o avanza con la otra pierna.',
    ],
    tip: 'Si la barra se va hacia adelante, acorta el paso o reduce el peso.',
  },

  // ───────── Gimnásticos ─────────
  'MUSCLE UP': {
    family: 'muscleUp',
    steps: [
      'Cuélgate de la barra y genera un balanceo (kipping) del arco al hueco.',
      'Desde el hueco, tira fuerte con los brazos hacia la cadera llevando la barra al pecho.',
      'Inclina el tronco sobre la barra y gira las muñecas por encima.',
      'Empuja hasta estirar los brazos con la barra a la altura de la cadera.',
    ],
    tip: 'Prerrequisito: unas 10 dominadas estrictas y 10 fondos en paralelas.',
  },
  'MUSCLE UP EN ANILLAS': {
    family: 'muscleUp',
    steps: [
      'Toma las anillas con agarre falso (muñeca por encima de la anilla).',
      'Tira llevando las anillas hacia el pecho, pegadas al cuerpo.',
      'Inclínate hacia adelante y pasa el pecho por encima de las anillas (transición).',
      'Empuja como en un fondo hasta quedar con los brazos estirados y las anillas junto a la cadera.',
    ],
    tip: 'Practica la transición con los pies en el piso y las anillas bajas.',
  },
  'TOES TO BAR': {
    family: 'muscleUp',
    steps: [
      'Cuélgate de la barra con agarre prono.',
      'Genera un pequeño balanceo empujando la barra hacia abajo con los brazos estirados.',
      'Desde el hueco, eleva las piernas hasta tocar la barra con la punta de los pies.',
      'Baja controlando para encadenar la siguiente repetición.',
    ],
    tip: 'Los dorsales ayudan: empuja la barra hacia los muslos al subir las piernas.',
  },
  'DOMINADAS KIPPING': {
    family: 'muscleUp',
    steps: [
      'Cuélgate de la barra con los brazos estirados.',
      'Pasa del arco (pecho adelante, piernas atrás) al hueco (piernas adelante) para generar impulso.',
      'En el hueco, tira con los brazos y lleva el mentón sobre la barra.',
      'Empuja la barra para alejarte y vuelve al arco para la siguiente.',
    ],
    tip: 'Domina primero las dominadas estrictas: el kipping exige mucho al hombro.',
  },
  'PECHO A LA BARRA': {
    family: 'muscleUp',
    steps: [
      'Cuélgate con agarre prono algo más ancho que los hombros.',
      'Inicia con un kipping o de forma estricta.',
      'Tira hasta que el pecho, debajo de la clavícula, toque la barra.',
      'Baja con control hasta estirar los brazos.',
    ],
    tip: 'Inclina el tronco hacia atrás al final para que el pecho llegue a la barra.',
  },
  'TREPADA DE SOGA': {
    family: 'ropeClimb',
    steps: [
      'Toma la soga con ambas manos, una sobre la otra, lo más alto posible.',
      'Sube las rodillas y traba la soga entre los pies (empeine sobre la soga y el otro pie pisándola).',
      'Párate sobre el bloqueo de pies para avanzar y vuelve a tomar más arriba.',
      'Baja mano por mano usando los pies como freno, sin deslizarte.',
    ],
    tip: 'El trabajo es de piernas: con buen bloqueo de pies los brazos solo sostienen.',
  },
  'GHD SIT UP': {
    family: 'ghd',
    steps: [
      'Siéntate en la GHD con los glúteos fuera de la almohadilla y los pies trabados.',
      'Baja el tronco hacia atrás hasta la horizontal (o algo más) con los brazos estirados.',
      'Extiende las rodillas para subir con potencia y lleva las manos hacia los pies.',
      'Vuelve a bajar controlando.',
    ],
    tip: 'Empieza con pocas repeticiones: el exceso puede causar rabdomiólisis.',
  },

  // ───────── Cargas y strongman ─────────
  'PASEO DEL GRANJERO': {
    family: 'carry',
    steps: [
      'Levanta una mancuerna (o manija) pesada en cada mano como en un peso muerto.',
      'Párate erguido con los hombros atrás y el abdomen firme.',
      'Camina con pasos cortos y rápidos sin que las pesas se balanceen.',
      'Al terminar, apoya las pesas con la espalda neutra.',
    ],
    tip: 'Agarre, trapecios y core: un ejercicio simple que entrena todo.',
  },
  'PASEO DE MALETA': {
    family: 'carry',
    steps: [
      'Toma una sola mancuerna pesada con una mano.',
      'Párate erguido sin inclinarte hacia el lado de la pesa.',
      'Camina la distancia indicada manteniendo los hombros nivelados.',
      'Cambia de mano y repite.',
    ],
    tip: 'Es un ejercicio anti-inclinación lateral: los oblicuos del lado contrario trabajan fuerte.',
  },
  'PASEO DEL CAMARERO': {
    family: 'carry',
    steps: [
      'Sostén una kettlebell arriba con el brazo estirado.',
      'Bíceps junto a la oreja y muñeca firme.',
      'Camina con pasos controlados sin arquear la espalda.',
      'Cambia de brazo al completar la distancia.',
    ],
    tip: 'Excelente para la estabilidad del hombro; usa un peso moderado.',
  },
  'EMPUJE DE TRINEO': {
    family: 'sled',
    steps: [
      'Toma los postes del trineo con los brazos estirados y el cuerpo inclinado unos 45°.',
      'Empuja el piso con pasos cortos y potentes, como si corrieras.',
      'Mantén la espalda recta y la cadera alineada con el tronco.',
      'Avanza sin que los brazos se flexionen.',
    ],
    tip: 'Sin fase excéntrica: puedes entrenarlo pesado sin tanta fatiga muscular posterior.',
  },
  'ARRASTRE DE TRINEO': {
    family: 'sled',
    steps: [
      'Toma las correas del trineo de frente a él y aléjate hasta tensarlas.',
      'Inclina el tronco levemente hacia atrás con las rodillas flexionadas.',
      'Camina hacia atrás con pasos cortos empujando con la parte delantera del pie.',
      'Mantén los brazos firmes y la tensión constante.',
    ],
    tip: 'Caminar hacia atrás trabaja mucho los cuádriceps con muy poca carga para la rodilla.',
  },
  'VOLTEO DE NEUMATICO': {
    family: 'strongman',
    steps: [
      'Agáchate frente al neumático con el pecho contra él y los dedos debajo del borde.',
      'Empuja con las piernas hacia adelante y arriba, como un peso muerto que avanza.',
      'Cuando el neumático pase la cadera, lleva una rodilla adelante y cambia el agarre a empujar.',
      'Empuja con los brazos hasta voltearlo.',
    ],
    tip: 'No levantes con la espalda redonda: el pecho se mantiene contra el neumático.',
  },
  'GOLPES CON MAZA': {
    family: 'strongman',
    steps: [
      'Párate frente al neumático con los pies separados y toma la maza con las manos separadas.',
      'Lleva la maza por encima del hombro deslizando la mano de arriba hacia la cabeza de la maza.',
      'Golpea el neumático deslizando esa mano hacia la otra y flexionando las rodillas.',
      'Alterna el lado del que levantas la maza.',
    ],
    tip: 'Controla el rebote: la maza puede volver con fuerza hacia ti.',
  },
  'LEVANTAMIENTO DE PIEDRA': {
    family: 'strongman',
    steps: [
      'Párate con la piedra entre los pies y abrázala con las manos debajo.',
      'Levántala hasta apoyarla sobre los muslos (lap) en sentadilla.',
      'Vuelve a abrazarla bien arriba y extiende la cadera de forma explosiva.',
      'Cárgala sobre la plataforma o el hombro.',
    ],
    tip: 'Usa tacky o resina y protege los antebrazos con mangas.',
  },
  'LEVANTAMIENTO DE SANDBAG': {
    family: 'strongman',
    steps: [
      'Toma la bolsa del piso agarrándola por la tela con las manos debajo.',
      'Súbela hasta la cadera abrazándola como en una sentadilla Zercher.',
      'Extiende la cadera y gira para cargarla sobre un hombro.',
      'Bájala controlando y alterna el hombro en cada repetición.',
    ],
    tip: 'La carga inestable obliga a todo el cuerpo a estabilizar: empieza liviano.',
  },
  'CIRCUITO FUNCIONAL': {
    family: 'circuit',
    steps: [
      'Arma 3–6 estaciones (por ejemplo wall ball, swing con kettlebell y salto al cajón).',
      'Haz cada estación por tiempo (30–45 s) o repeticiones.',
      'Pasa a la siguiente con un descanso mínimo.',
      'Descansa 1–2 minutos al terminar la vuelta y repite 3–5 veces.',
    ],
    tip: 'Alterna estaciones de tren superior, inferior y cardio para no agotar un solo grupo.',
  },

  // ───────── Combate ─────────
  BOXEO: {
    family: 'combat',
    steps: [
      'Guardia: pie izquierdo adelante (diestros), rodillas suaves y puños a la altura del mentón.',
      'Jab: estira el brazo adelantado rotando el puño y vuelve rápido a la guardia.',
      'Cross: rota cadera y pie de atrás para lanzar el puño trasero en línea recta.',
      'Muévete con pasos cortos sin cruzar los pies y vuelve siempre a la guardia.',
    ],
    tip: 'Exhala con cada golpe y mantén el mentón protegido detrás del hombro.',
  },
  KICKBOXING: {
    family: 'combat',
    steps: [
      'Desde la guardia de boxeo, mantén el peso repartido para poder patear.',
      'Gira sobre el pie de apoyo y eleva la rodilla de la pierna que patea.',
      'Extiende la pierna en arco (patada circular) golpeando con la tibia.',
      'Recoge la pierna y vuelve a la guardia sin bajar las manos.',
    ],
    tip: 'Gira el pie de apoyo hacia afuera: protege la rodilla y da potencia a la patada.',
  },
  'ARTES MARCIALES': {
    family: 'combat',
    steps: [
      'Guardia de lucha: pies separados, rodillas flexionadas, cadera atrás y manos al frente a la altura del pecho.',
      'Entrada a las piernas: baja el nivel y da un paso profundo hacia adelante llevando la rodilla de atrás cerca del piso.',
      'Abraza las piernas del compañero con la cabeza pegada a su costado y empuja con la pierna de atrás.',
      'Sprawl: para defender una entrada, lanza las piernas hacia atrás y aplasta la cadera contra el piso con el pecho arriba.',
    ],
    tip: 'Practica las caídas (ukemi) antes que los derribos y entrena siempre sobre tatami.',
  },

  // ───────── Movilidad ─────────
  YOGA: {
    family: 'yoga',
    steps: [
      'Perro boca abajo: manos y pies apoyados, cadera arriba y espalda larga.',
      'Guerrero II: piernas abiertas, rodilla delantera sobre el tobillo y brazos extendidos.',
      'Árbol: apoya la planta de un pie en el muslo contrario y lleva los brazos arriba.',
      'Mantén cada postura 5 respiraciones lentas por la nariz.',
    ],
    tip: 'Nunca fuerces una postura hasta el dolor: la flexibilidad llega con constancia.',
  },
  PILATES: {
    family: 'pilates',
    steps: [
      'The hundred: acostado, cabeza y hombros despegados, piernas a 45° y brazos bombeando.',
      'Roll up: desde acostado, enrolla la columna vértebra por vértebra hasta llegar a los pies.',
      'Teaser: equilíbrate sobre la cola formando una V con piernas y tronco.',
      'Coordina cada movimiento con la respiración y el abdomen hundido.',
    ],
    tip: 'Calidad y control antes que repeticiones: cada movimiento es lento y preciso.',
  },
  'JEFFERSON CURL': {
    family: 'jeffersonCurl',
    steps: [
      'Párate sobre un cajón con una barra liviana o disco en las manos y las piernas estiradas.',
      'Mete el mentón y enrolla la columna desde el cuello hacia abajo, vértebra por vértebra.',
      'Deja que el peso baje por debajo de la altura de los pies.',
      'Sube desenrollando desde la pelvis hasta la cabeza.',
    ],
    tip: 'Es un ejercicio de movilidad: empieza sin peso o con 5 kg y progresa muy despacio.',
  },
};
