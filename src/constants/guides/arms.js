// Fichas de brazos: bíceps, tríceps, antebrazos y mano.
export const ARM_GUIDES = {
  // ───────── Bíceps ─────────
  'CURL CON BARRA': {
    family: 'curl',
    steps: [
      'De pie, toma la barra recta con agarre supino (palmas hacia adelante) al ancho de los hombros.',
      'Deja los codos pegados a los costados y los brazos estirados delante de los muslos.',
      'Flexiona los codos y sube la barra hasta la altura de los hombros sin mover los codos.',
      'Baja en 2–3 segundos hasta estirar los brazos.',
    ],
    tip: 'La barra recta permite cargar más que las mancuernas; si molestan las muñecas, pasa a la barra W.',
  },
  'CURL CON BARRA W': {
    family: 'curl',
    steps: [
      'Toma la barra W por los tramos inclinados internos, con las palmas mirando en diagonal hacia arriba.',
      'Codos pegados al cuerpo y brazos estirados.',
      'Sube la barra hasta la altura de los hombros flexionando solo los codos.',
      'Baja la barra W despacio hasta estirar los codos.',
    ],
    tip: 'La barra W deja las muñecas en un ángulo más cómodo y suma trabajo del braquial.',
  },
  'CURL 21': {
    family: 'curl',
    steps: [
      'Toma la barra recta con agarre supino, codos pegados al cuerpo.',
      'Haz 7 repeticiones desde abajo hasta la mitad del recorrido (codos a 90°).',
      'Sin descansar, haz 7 repeticiones desde la mitad hasta arriba.',
      'Termina con 7 repeticiones completas, de abajo hasta arriba.',
    ],
    tip: 'Usa un 30–40% menos de peso que en tu curl normal: el tiempo bajo tensión es muy alto.',
  },
  'CURL CON MANCUERNAS': {
    family: 'curl',
    steps: [
      'De pie, con una mancuerna en cada mano a los costados y las palmas hacia adelante.',
      'Codos pegados al cuerpo.',
      'Sube las dos mancuernas a la vez hasta la altura de los hombros.',
      'Baja las mancuernas despacio hasta estirar los brazos por completo.',
    ],
    tip: 'Si empiezas con las palmas hacia el cuerpo y las giras al subir (supinación), el bíceps trabaja en su función completa.',
  },
  'CURL ALTERNADO CON MANCUERNAS': {
    family: 'curl',
    steps: [
      'De pie, con las mancuernas a los costados y las palmas hacia el cuerpo.',
      'Sube una mancuerna girando la palma hacia arriba mientras el otro brazo queda quieto.',
      'Baja despacio y recién entonces sube el otro brazo.',
      'Alterna hasta completar las repeticiones de cada lado.',
    ],
    tip: 'Al trabajar un brazo por vez puedes concentrarte en el giro de la muñeca y en no balancear el torso.',
  },
  'CURL MARTILLO': {
    family: 'curl',
    steps: [
      'De pie, con las mancuernas a los costados y las palmas enfrentadas (como si sostuvieras martillos).',
      'Codos pegados al cuerpo y pulgares hacia arriba en todo el recorrido.',
      'Sube las mancuernas sin girar las muñecas hasta la altura de los hombros.',
      'Baja despacio sin girar las muñecas.',
    ],
    tip: 'El agarre neutro trabaja más el braquial y el braquiorradial: dan grosor al brazo.',
  },
  'CURL MARTILLO CRUZADO': {
    family: 'curl',
    steps: [
      'De pie, con las mancuernas a los costados y las palmas enfrentadas.',
      'Sube una mancuerna cruzando frente al pecho hacia el hombro contrario.',
      'Baja por el mismo camino.',
      'Alterna los brazos.',
    ],
    tip: 'El trayecto cruzado enfatiza el braquial y el braquiorradial más que el martillo recto.',
  },
  'CURL ZOTTMAN': {
    family: 'curl',
    steps: [
      'De pie, con las mancuernas a los costados y las palmas hacia adelante.',
      'Sube como en el curl común hasta la altura de los hombros.',
      'Arriba, gira las muñecas hasta que las palmas miren hacia abajo.',
      'Baja en 3 segundos con agarre prono y, abajo, vuelve a girar las palmas hacia adelante.',
    ],
    tip: 'Bíceps al subir y braquiorradial al bajar: es un dos en uno para el brazo y el antebrazo.',
  },
  'CURL MARTILLO CON SOGA': {
    family: 'curl',
    steps: [
      'Engancha una soga en la polea baja y toma un extremo con cada mano (palmas enfrentadas).',
      'Da un paso atrás con los codos pegados al cuerpo.',
      'Sube la soga hasta la altura del pecho separando apenas las manos arriba.',
      'Baja despacio sin dejar que el cable tire de los codos hacia adelante.',
    ],
    tip: 'Tensión constante en braquial y antebrazo: buena opción para terminar el día de brazos.',
  },
  'CURL POLEA': {
    family: 'curl',
    steps: [
      'Engancha una barra recta en la polea baja y tómala con agarre supino al ancho de los hombros.',
      'Da un paso atrás y deja los codos pegados al cuerpo.',
      'Sube la barra hasta la altura de los hombros.',
      'Baja despacio hasta estirar los brazos sin dejar que la pila golpee.',
    ],
    tip: 'La polea mantiene la tensión también abajo, donde la mancuerna "descansa".',
  },
  'CURL INVERTIDO': {
    family: 'curl',
    steps: [
      'Toma la barra con agarre prono (palmas hacia atrás) al ancho de los hombros.',
      'Codos pegados al cuerpo y muñecas rectas.',
      'Sube la barra hasta la altura de los hombros sin doblar las muñecas.',
      'Baja despacio manteniendo las palmas hacia abajo.',
    ],
    tip: 'Trabaja sobre todo el braquiorradial y los extensores: usa bastante menos peso que en el curl común.',
  },
  'CURL INVERTIDO EN POLEA': {
    family: 'curl',
    steps: [
      'Engancha una barra recta en la polea baja y tómala con agarre prono.',
      'Toma la barra con las palmas hacia abajo y da un paso atrás con los codos pegados.',
      'Sube la barra con las muñecas rectas hasta la altura de los hombros.',
      'Baja despacio sin que el cable te tire.',
    ],
    tip: 'La polea da tensión pareja: ideal para series largas de antebrazo.',
  },
  'CURL DRAG': {
    family: 'curl',
    steps: [
      'Toma la barra con agarre supino al ancho de los hombros, apoyada en los muslos.',
      'En lugar de llevar la barra hacia adelante, súbela pegada al cuerpo mientras los codos van hacia atrás.',
      'Llega hasta la parte baja del pecho.',
      'Baja por el mismo camino, rozando el torso.',
    ],
    tip: 'Al llevar los codos atrás se quita al deltoides anterior del movimiento y el bíceps trabaja más estirado.',
  },
  'CURL SCOTT': {
    family: 'preacher',
    steps: [
      'Siéntate en el banco Scott con las axilas apoyadas en el borde superior del atril.',
      'Apoya la parte de atrás de los brazos en el atril y toma la barra W con agarre supino.',
      'Sube la barra hasta que los antebrazos queden casi verticales.',
      'Baja despacio hasta casi estirar los brazos, sin rebotar abajo.',
    ],
    tip: 'La parte más exigente es abajo: controla los últimos centímetros y no bloquees el codo de golpe.',
  },
  'CURL SCOTT CON MANCUERNA': {
    family: 'preacher',
    steps: [
      'Apoya un brazo en el atril del banco Scott con la axila en el borde.',
      'Toma una mancuerna con la palma hacia arriba.',
      'Sube hasta que el antebrazo quede vertical.',
      'Baja despacio hasta casi estirar el brazo; completa las repeticiones y cambia de lado.',
    ],
    tip: 'Trabajar un brazo por vez permite girar bien la muñeca y corregir diferencias entre lados.',
  },
  'CURL SCOTT EN MAQUINA': {
    family: 'preacher',
    steps: [
      'Regula el asiento para que los codos queden alineados con el eje de giro de la máquina.',
      'Apoya los brazos en el atril y toma las manijas con agarre supino.',
      'Sube flexionando los codos hasta el final del recorrido.',
      'Baja despacio hasta casi estirar los brazos.',
    ],
    tip: 'La máquina mantiene la tensión arriba, donde el Scott con barra pierde carga.',
  },
  'CURL EN MAQUINA': {
    family: 'preacher',
    steps: [
      'Siéntate con el pecho cerca del apoyo y los brazos horizontales sobre la almohadilla, a la altura de los hombros.',
      'Alinea los codos con el eje de la máquina y toma las manijas con agarre supino.',
      'Flexiona los codos llevando las manos hacia la cara.',
      'Vuelve despacio hasta casi estirar los brazos.',
    ],
    tip: 'Con los brazos horizontales el bíceps trabaja acortado: es el complemento del curl inclinado.',
  },
  'CURL CONCENTRADO': {
    family: 'concentration',
    steps: [
      'Siéntate en la punta de un banco con las piernas abiertas y una mancuerna en una mano.',
      'Apoya la parte de atrás del brazo en la cara interna del muslo del mismo lado.',
      'Sube la mancuerna hacia el hombro sin mover el codo.',
      'Baja despacio hasta estirar el brazo; cambia de lado.',
    ],
    tip: 'Aprieta un segundo arriba girando el meñique hacia afuera: máxima contracción del bíceps.',
  },
  'CURL BICEPS INCLINADO': {
    family: 'inclineCurl',
    steps: [
      'Ajusta un banco a 45–60° y recuéstate con una mancuerna en cada mano.',
      'Deja colgar los brazos por detrás del torso con las palmas hacia adelante.',
      'Sube las mancuernas sin adelantar los codos.',
      'Baja despacio hasta estirar los brazos por completo.',
    ],
    tip: 'Con el brazo detrás del cuerpo el bíceps trabaja muy estirado: es de los curls que más hipertrofia generan.',
  },
  'CURL ARAÑA': {
    family: 'spiderCurl',
    steps: [
      'Acuéstate boca abajo en un banco inclinado a 45° con el pecho apoyado en el respaldo.',
      'Deja colgar los brazos verticales por delante del banco con una mancuerna en cada mano.',
      'Sube las mancuernas sin mover los codos hacia adelante.',
      'Baja despacio hasta estirar los brazos colgando delante del banco.',
    ],
    tip: 'Los brazos verticales cargan más la parte alta del recorrido: complemento perfecto del curl inclinado.',
  },
  'CURL BAYESIANO': {
    family: 'bayesianCurl',
    steps: [
      'Ubica la polea abajo, párate de espaldas a ella y toma la manija con una mano.',
      'Da un paso adelante: el brazo queda estirado por detrás del cuerpo.',
      'Flexiona el codo sin llevarlo hacia adelante hasta acercar la mano al hombro.',
      'Vuelve despacio hasta estirar el brazo atrás; cambia de lado.',
    ],
    tip: 'Combina el estiramiento del curl inclinado con la tensión constante de la polea.',
  },
  'CURL EN POLEA ALTA': {
    family: 'highCableCurl',
    steps: [
      'Párate entre dos poleas altas y toma una manija con cada mano.',
      'Abre los brazos a la altura de los hombros con las palmas hacia arriba (pose de doble bíceps).',
      'Flexiona los codos llevando las manos hacia las orejas.',
      'Vuelve despacio hasta estirar los brazos en cruz.',
    ],
    tip: 'Los codos quedan fijos a la altura de los hombros: es un curl de contracción máxima.',
  },
  'CURL DE BICEPS EN TRX': {
    family: 'trxCurl',
    steps: [
      'Toma las manijas del TRX con las palmas hacia arriba y camina los pies hacia el anclaje.',
      'Inclina el cuerpo recto hacia atrás con los brazos estirados al frente.',
      'Flexiona los codos llevando las manos hacia la frente: el cuerpo sube.',
      'Vuelve despacio hacia atrás hasta estirar los brazos.',
    ],
    tip: 'Cuanto más inclinado el cuerpo, más difícil: avanza los pies de a poco.',
  },
  'CURL ACOSTADO EN POLEA': {
    family: 'curl',
    steps: [
      'Engancha una barra en la polea baja y acuéstate boca arriba en el piso con los pies hacia la máquina.',
      'Toma la barra con agarre supino y apoya los codos a los costados del cuerpo.',
      'Flexiona los codos llevando la barra hacia el pecho sin despegar los brazos del piso.',
      'Vuelve despacio hasta estirar los brazos junto al cuerpo.',
    ],
    tip: 'Acostado no hay forma de balancear el torso: es uno de los curls más estrictos.',
  },
  'CURL WAITER': {
    family: 'curl',
    steps: [
      'Sostén una mancuerna en vertical con las dos palmas debajo del disco superior, como una bandeja.',
      'Brazos estirados y codos pegados al cuerpo con la mancuerna vertical.',
      'Sube la mancuerna hasta el pecho manteniéndola vertical.',
      'Baja despacio manteniendo la mancuerna como una bandeja.',
    ],
    tip: 'Las palmas abiertas obligan a supinar al máximo: gran contracción de la cabeza corta.',
  },

  // ───────── Tríceps ─────────
  'EXTENSION DE TRICEPS EN POLEA': {
    family: 'pushdown',
    steps: [
      'Engancha una barra recta en la polea alta y tómala con agarre prono al ancho de los hombros.',
      'Inclina apenas el torso y pega los codos a los costados, con los antebrazos horizontales.',
      'Empuja la barra hacia abajo hasta estirar los brazos.',
      'Sube despacio hasta que los antebrazos vuelvan a la horizontal, sin mover los codos.',
    ],
    tip: 'Los codos son la bisagra: si se mueven hacia adelante, entra el hombro.',
  },
  'EXTENSION DE TRICEPS CON SOGA': {
    family: 'pushdown',
    steps: [
      'Engancha la soga en la polea alta y toma un extremo con cada mano (palmas enfrentadas).',
      'Codos pegados al cuerpo y antebrazos horizontales.',
      'Empuja hacia abajo y, al final, separa las manos hacia afuera.',
      'Sube despacio hasta la horizontal.',
    ],
    tip: 'Separar la soga abajo suma contracción de la cabeza lateral.',
  },
  'EXTENSION DE TRICEPS CON BARRA V': {
    family: 'pushdown',
    steps: [
      'Engancha la barra en V en la polea alta y tómala con las manos juntas.',
      'Codos pegados al cuerpo y antebrazos horizontales con la barra V al frente.',
      'Empuja la barra V hacia abajo hasta estirar los brazos.',
      'Sube despacio.',
    ],
    tip: 'El agarre semi-neutro es cómodo para las muñecas y permite cargar más que la soga.',
  },
  'EXTENSION DE TRICEPS AGARRE INVERTIDO': {
    family: 'pushdown',
    steps: [
      'Toma la barra de la polea alta con agarre supino (palmas hacia arriba).',
      'Codos pegados al cuerpo y palmas mirando hacia arriba.',
      'Empuja hacia abajo hasta estirar los brazos.',
      'Sube despacio sin despegar los codos.',
    ],
    tip: 'Más trabajo de la cabeza medial y menos peso que con agarre prono.',
  },
  'EXTENSION UNILATERAL EN POLEA': {
    family: 'pushdown',
    steps: [
      'Engancha una manija simple en la polea alta y tómala con una mano.',
      'Pega el codo al costado con el antebrazo horizontal.',
      'Empuja hacia abajo hasta estirar el brazo.',
      'Sube despacio; completa y cambia de lado.',
    ],
    tip: 'Un brazo por vez corrige diferencias de fuerza y permite un recorrido más largo.',
  },
  'EXTENSION CRUZADA EN POLEA': {
    family: 'pushdown',
    steps: [
      'Ubica una polea alta y párate de costado; toma la manija con la mano más lejana.',
      'El brazo cruza por delante del pecho con el codo flexionado a la altura del pecho.',
      'Estira el brazo hacia afuera y abajo, alejando la mano del cuerpo.',
      'Vuelve despacio cruzando otra vez; cambia de lado.',
    ],
    tip: 'La trayectoria en diagonal sigue la línea de la cabeza lateral del tríceps.',
  },
  'EXTENSION DE TRICEPS CON MANCUERNA': {
    family: 'overheadExt',
    steps: [
      'De pie, sostén una mancuerna con una mano y estira el brazo sobre la cabeza.',
      'Con el codo apuntando al techo, baja la mancuerna por detrás de la cabeza.',
      'Llega hasta que el antebrazo pase la horizontal.',
      'Estira el brazo sin mover el codo; cambia de lado.',
    ],
    tip: 'Sostén el codo con la mano libre para que no se abra.',
  },
  'TRICEPS COPA': {
    family: 'overheadExt',
    steps: [
      'Sentado con respaldo, toma una mancuerna con ambas manos por el disco superior, formando una copa.',
      'Estira los brazos sobre la cabeza.',
      'Baja la mancuerna por detrás de la cabeza con los codos apuntando al techo.',
      'Sube hasta estirar los brazos.',
    ],
    tip: 'Por encima de la cabeza la cabeza larga trabaja estirada: suma tamaño al tríceps.',
  },
  'TRICEPS TRAS NUCA EN POLEA': {
    family: 'cableOverheadExt',
    steps: [
      'Ubica la soga en la polea baja, tómala por encima de la cabeza y date vuelta de espaldas a la máquina.',
      'Da un paso adelante e inclina el torso: los codos quedan junto a la cabeza.',
      'Estira los brazos hacia adelante y arriba.',
      'Vuelve despacio hasta sentir el estiramiento atrás.',
    ],
    tip: 'Los codos se quedan junto a la cabeza: si se abren, trabaja el hombro.',
  },
  'PRESS FRANCES SENTADO CON BARRA W': {
    family: 'overheadExt',
    steps: [
      'Siéntate con respaldo y sostén la barra W sobre la cabeza con agarre prono y las manos juntas.',
      'Con los codos apuntando al techo, baja la barra por detrás de la cabeza.',
      'Llega hasta sentir el estiramiento del tríceps.',
      'Estira los brazos sobre la cabeza sin mover los codos.',
    ],
    tip: 'Mantén las costillas abajo: si la espalda se arquea, el recorrido se acorta.',
  },
  'PRESS FRANCES': {
    family: 'skullCrusher',
    steps: [
      'Acuéstate en el banco plano y sostén la barra W con agarre prono, con los brazos estirados sobre el pecho.',
      'Inclina un poco los brazos hacia la cabeza y déjalos fijos.',
      'Flexiona los codos y baja la barra hacia la frente o por detrás de la cabeza.',
      'Estira los brazos sin mover los codos.',
    ],
    tip: 'Bajar la barra por detrás de la cabeza da más estiramiento a la cabeza larga.',
  },
  'PRESS FRANCES CON MANCUERNAS': {
    family: 'skullCrusher',
    steps: [
      'Acuéstate en el banco con una mancuerna en cada mano y las palmas enfrentadas, brazos estirados.',
      'Fija los codos apuntando al techo.',
      'Baja las mancuernas a los costados de la cabeza.',
      'Estira los brazos.',
    ],
    tip: 'Con agarre neutro las muñecas y los codos sufren menos que con la barra.',
  },
  'PRESS FRANCES EN POLEA': {
    family: 'skullCrusher',
    steps: [
      'Ubica un banco plano frente a la polea baja y acuéstate con la cabeza hacia la máquina.',
      'Toma la barra con agarre prono y estira los brazos sobre el pecho.',
      'Flexiona los codos llevando la barra detrás de la cabeza.',
      'Estira los brazos contra el cable sin mover los codos.',
    ],
    tip: 'El cable mantiene la tensión arriba, donde con la barra libre el tríceps descansa.',
  },
  'JM PRESS': {
    family: 'closeGrip',
    steps: [
      'Acuéstate en el banco plano con la barra en agarre cerrado (manos al ancho de los hombros).',
      'Desde los brazos estirados, baja la barra hacia la garganta llevando los codos hacia adelante.',
      'Detente a unos centímetros del cuello, con los antebrazos casi apoyados en los bíceps.',
      'Empuja de vuelta extendiendo los codos.',
    ],
    tip: 'Híbrido entre press cerrado y press francés: permite cargar mucho al tríceps.',
  },
  'PRESS TATE': {
    family: 'skullCrusher',
    steps: [
      'Acuéstate en el banco con las mancuernas sobre el pecho y las palmas hacia los pies.',
      'Con los codos abiertos hacia afuera, baja las mancuernas hacia el centro del pecho.',
      'Las mancuernas se tocan sobre el esternón.',
      'Empuja hacia arriba abriendo de nuevo los codos.',
    ],
    tip: 'Los codos hacia afuera enfocan la cabeza lateral: usa mancuernas livianas.',
  },
  'PRESS CERRADO': {
    family: 'closeGrip',
    steps: [
      'Acuéstate en el banco plano y toma la barra con las manos al ancho de los hombros.',
      'Saca la barra del rack con los brazos estirados sobre el pecho.',
      'Baja con los codos pegados al cuerpo hasta rozar la parte baja del pecho.',
      'Empuja la barra hasta estirar los brazos sobre el pecho.',
    ],
    tip: 'No juntes de más las manos: más cerrado que el ancho de hombros carga las muñecas sin sumar tríceps.',
  },
  'PRESS CERRADO EN MULTIPOWER': {
    family: 'closeGrip',
    steps: [
      'Ubica el banco plano en el multipower de modo que la barra baje a la parte baja del pecho.',
      'Toma la barra con las manos al ancho de los hombros y destrábala.',
      'Baja en línea recta con los codos pegados al cuerpo.',
      'Empuja hasta estirar los brazos y traba la barra al terminar.',
    ],
    tip: 'La guía permite concentrarse en el bloqueo de los codos: buena opción para series pesadas de tríceps.',
  },
  'PATADA DE TRICEPS': {
    family: 'kickback',
    steps: [
      'Inclina el torso casi paralelo al piso con un pie adelante y la mano libre en la rodilla.',
      'Lleva el codo pegado al costado, con el brazo paralelo al torso y el antebrazo colgando.',
      'Estira el codo llevando la mancuerna hacia atrás.',
      'Vuelve despacio sin mover el brazo; cambia de lado.',
    ],
    tip: 'Haz una pausa con el brazo estirado: ahí está la tensión máxima.',
  },
  'PATADA DE TRICEPS EN POLEA': {
    family: 'kickback',
    steps: [
      'Ubica la polea baja frente a ti y toma la manija con una mano.',
      'Inclina el torso y pega el codo al costado con el antebrazo hacia abajo.',
      'Estira el brazo hacia atrás.',
      'Vuelve el antebrazo despacio hasta 90°; cambia de lado.',
    ],
    tip: 'El cable mantiene la tensión al principio del recorrido, donde la mancuerna no pesa.',
  },
  'FONDOS EN PARALELAS': {
    family: 'dips',
    steps: [
      'Súbete a las paralelas con los brazos estirados y el torso vertical.',
      'Cruza los pies detrás y mantén los codos apuntando hacia atrás.',
      'Baja hasta que los codos queden a 90°.',
      'Empuja las paralelas hasta estirar los brazos sin bloquear de golpe.',
    ],
    tip: 'Con el torso vertical y los codos cerca del cuerpo trabaja más el tríceps que el pecho.',
  },
  'FONDOS EN ANILLAS': {
    family: 'dips',
    steps: [
      'Sube a las anillas con los brazos estirados y las anillas pegadas al cuerpo.',
      'Gira las palmas hacia afuera en la posición de arriba.',
      'Baja hasta que los hombros queden a la altura de los codos.',
      'Empuja hasta estirar los brazos sin que las anillas se abran.',
    ],
    tip: 'Las anillas son inestables: domina antes 10 fondos en paralelas.',
  },
  'FONDOS EN BARRA RECTA': {
    family: 'dips',
    steps: [
      'Súbete a una barra recta con las manos al ancho de los hombros y la barra frente a la cadera.',
      'Inclina el torso adelante y lleva las piernas un poco hacia adelante.',
      'Baja hasta que la barra roce la parte baja del pecho.',
      'Empuja la barra hasta estirar los brazos inclinado hacia adelante.',
    ],
    tip: 'Es el paso previo al muscle up: la transición en la barra se parece mucho.',
  },
  'FONDOS EN MAQUINA': {
    family: 'dips',
    steps: [
      'Elige el contrapeso y apoya las rodillas en la plataforma de la máquina asistida.',
      'Toma las manijas paralelas con los brazos estirados.',
      'Deja subir las manijas hasta que los codos queden a 90°.',
      'Empuja las manijas hacia abajo hasta estirar los brazos.',
    ],
    tip: 'Reduce la asistencia de a poco hasta hacer fondos sin ayuda.',
  },
  'FONDOS SENTADO EN MAQUINA': {
    family: 'dips',
    steps: [
      'Siéntate con la espalda apoyada y ajusta el asiento para que las manijas queden a la altura del pecho.',
      'Toma las manijas a los costados con agarre neutro.',
      'Empuja hacia abajo hasta estirar los brazos junto a la cadera.',
      'Sube despacio hasta que los codos vuelvan a 90°.',
    ],
    tip: 'Sentado y con respaldo es la forma más segura de cargar mucho el tríceps.',
  },
  'FONDOS EN BANCO': {
    family: 'benchDips',
    steps: [
      'Siéntate en el borde de un banco y apoya las manos a los lados de la cadera, con los dedos hacia adelante.',
      'Adelanta los pies y despega la cadera del banco con los brazos estirados.',
      'Baja flexionando los codos hacia atrás hasta 90°.',
      'Empuja el banco hasta estirar los brazos con la espalda cerca del borde.',
    ],
    tip: 'Con las piernas flexionadas es más fácil; con los pies en otro banco, más difícil.',
  },
  'EXTENSION DE TRICEPS EN MAQUINA': {
    family: 'tricepsMachine',
    steps: [
      'Regula el asiento para que los codos queden alineados con el eje de la máquina.',
      'Apoya los codos en la almohadilla y toma las manijas.',
      'Estira los brazos hasta el final del recorrido.',
      'Vuelve despacio hasta que los antebrazos queden cerca de los bíceps.',
    ],
    tip: 'Ideal para trabajar al fallo con seguridad al final de la sesión.',
  },

  // ───────── Antebrazos y mano ─────────
  'CURL DE MUÑECA': {
    family: 'wristFlex',
    steps: [
      'Siéntate y apoya los antebrazos sobre los muslos con las muñecas por delante de las rodillas.',
      'Toma una barra con las palmas hacia arriba.',
      'Deja que la barra baje doblando las muñecas hacia abajo.',
      'Sube flexionando solo las muñecas, sin despegar los antebrazos.',
    ],
    tip: 'Deja rodar la barra hasta la punta de los dedos abajo para sumar trabajo de los flexores de los dedos.',
  },
  'CURL DE MUÑECA INVERTIDO': {
    family: 'wristExt',
    steps: [
      'Siéntate con los antebrazos sobre los muslos y las palmas hacia abajo.',
      'Toma una barra liviana con las muñecas por delante de las rodillas.',
      'Sube el dorso de las manos extendiendo las muñecas.',
      'Deja caer los nudillos despacio hacia el piso.',
    ],
    tip: 'Los extensores son más débiles que los flexores: usa menos de la mitad del peso.',
  },
  'CURL DE MUÑECA CON MANCUERNA': {
    family: 'wristFlex',
    steps: [
      'Siéntate y apoya un antebrazo sobre el muslo con la palma hacia arriba y la mancuerna en la mano.',
      'Deja que la mancuerna baje doblando la muñeca.',
      'Sube flexionando la muñeca.',
      'Completa las repeticiones con una muñeca y cambia de mano.',
    ],
    tip: 'Un lado por vez permite concentrarse en el recorrido completo.',
  },
  'EXTENSION DE MUÑECA CON MANCUERNA': {
    family: 'wristExt',
    steps: [
      'Siéntate y apoya un antebrazo sobre el muslo con la palma hacia abajo.',
      'Deja la muñeca por delante de la rodilla con una mancuerna liviana.',
      'Sube el dorso de la mano extendiendo la muñeca.',
      'Baja el dorso de la mano despacio; cambia de lado.',
    ],
    tip: 'Útil para prevenir y tratar la epicondilitis (codo de tenista) con peso muy bajo.',
  },
  'CURL DE MUÑECA EN POLEA': {
    family: 'wristFlex',
    steps: [
      'Siéntate frente a la polea baja y toma la barra con las palmas hacia arriba.',
      'Apoya los antebrazos en los muslos con las muñecas por delante de las rodillas.',
      'Flexiona las muñecas hacia arriba.',
      'Baja despacio dejando que el cable estire los flexores.',
    ],
    tip: 'La polea mantiene la tensión en todo el recorrido de la muñeca.',
  },
  'CURL DE DEDOS CON BARRA': {
    family: 'wristFlex',
    steps: [
      'Siéntate con los antebrazos en los muslos y una barra en las manos, palmas hacia arriba.',
      'Abre los dedos y deja rodar la barra hasta la punta de los dedos.',
      'Cierra los dedos enrollando la barra de vuelta hacia la palma.',
      'Repite sin mover las muñecas.',
    ],
    tip: 'Trabaja los flexores de los dedos, clave para el agarre en dominadas y peso muerto.',
  },
  'CURL DE MUÑECA TRAS LA ESPALDA': {
    family: 'wristFlex',
    steps: [
      'De pie, toma una barra por detrás de los glúteos con las palmas hacia atrás.',
      'Deja los brazos estirados y relajados.',
      'Flexiona las muñecas llevando la barra hacia arriba y atrás.',
      'Abre los dedos y deja rodar la barra despacio hacia las puntas.',
    ],
    tip: 'De pie se puede usar más peso que sentado.',
  },
  'PRONOSUPINACION CON MANCUERNA': {
    family: 'forearmRotation',
    steps: [
      'Siéntate y apoya el antebrazo en el muslo con la mano por delante de la rodilla.',
      'Toma una mancuerna (o un martillo) por un extremo, con el peso hacia arriba.',
      'Gira la muñeca para llevar el peso hacia afuera (palma hacia arriba).',
      'Vuelve y gira hacia adentro (palma hacia abajo) sin mover el antebrazo.',
    ],
    tip: 'Cuanto más lejos de la mano esté el peso, más difícil: toma la mancuerna más cerca del disco para facilitar.',
  },
  'DESVIACION RADIAL CON MANCUERNA': {
    family: 'forearmRotation',
    steps: [
      'De pie, con el brazo al costado, toma una mancuerna por un extremo con el peso hacia adelante.',
      'Deja que la punta baje.',
      'Levanta la punta hacia adelante y arriba moviendo solo la muñeca hacia el pulgar.',
      'Baja despacio; cambia de lado.',
    ],
    tip: 'Fortalece el lado del pulgar del antebrazo (braquiorradial y extensores radiales).',
  },
  'DESVIACION CUBITAL CON MANCUERNA': {
    family: 'forearmRotation',
    steps: [
      'De pie, con el brazo al costado, toma una mancuerna por un extremo con el peso por detrás de la mano.',
      'Deja que la punta de atrás baje.',
      'Levanta la punta hacia atrás moviendo la muñeca hacia el meñique.',
      'Vuelve despacio a la posición neutra; cambia de lado.',
    ],
    tip: 'Complementa a la desviación radial: juntas equilibran la muñeca.',
  },
  'RODILLO DE MUÑECA': {
    family: 'wristRoller',
    steps: [
      'De pie, sostén el rodillo con ambas manos y los brazos estirados al frente, a la altura de los hombros.',
      'Gira las muñecas alternadamente para enrollar la cuerda hasta que el peso toque el rodillo.',
      'Desenrolla despacio, controlando la bajada.',
      'Repite enrollando hacia el otro lado para trabajar los extensores.',
    ],
    tip: 'Si los hombros se cansan antes, apoya los antebrazos en un banco o baja los brazos.',
  },
  'COLGADO EN BARRA': {
    family: 'deadHang',
    steps: [
      'Toma la barra con agarre prono al ancho de los hombros.',
      'Cuélgate con los brazos estirados y los pies despegados del piso.',
      'Mantén los hombros apenas activos y respira.',
      'Sostén el tiempo indicado y baja con control.',
    ],
    tip: 'Registra los segundos: un minuto colgado es un buen objetivo de agarre.',
  },
  'COLGADO CON TOALLA': {
    family: 'deadHang',
    steps: [
      'Pasa dos toallas por encima de la barra.',
      'Toma un extremo de cada toalla con agarre vertical (como una soga).',
      'Cuélgate con los brazos estirados.',
      'Sostén colgado de las toallas el tiempo indicado.',
    ],
    tip: 'El agarre grueso y vertical es mucho más exigente para los flexores de los dedos.',
  },
  'COLGADO A UNA MANO': {
    family: 'deadHang',
    steps: [
      'Toma la barra con una mano, con agarre prono.',
      'Cuélgate con el brazo estirado; la otra mano queda libre o rozando la barra para equilibrar.',
      'Evita girar: aprieta el abdomen y el hombro activo.',
      'Sostén y cambia de mano.',
    ],
    tip: 'Domina antes 60 segundos colgado con dos manos.',
  },
  'AGARRE ESTATICO CON MANCUERNAS': {
    family: 'grip',
    steps: [
      'Toma una mancuerna pesada en cada mano y párate erguido.',
      'Brazos estirados a los costados y hombros abajo.',
      'Aprieta las manijas con fuerza y sostén.',
      'Apoya las mancuernas con control al terminar.',
    ],
    tip: 'Es el paseo del granjero sin caminar: útil si no tienes espacio.',
  },
  'AGARRE DE BARRA GRUESA': {
    family: 'grip',
    steps: [
      'Coloca agarres gruesos (fat grips) en la barra o usa una barra gruesa.',
      'Levanta la barra hasta quedar de pie con los brazos estirados.',
      'Sostén apretando con toda la mano.',
      'Bájala con control.',
    ],
    tip: 'El diámetro grueso obliga a abrir la mano: trabaja mucho el pulgar y los extensores.',
  },
  'PINZA CON DISCOS': {
    family: 'grip',
    steps: [
      'Junta dos discos lisos y tómalos por el borde con los dedos de un lado y el pulgar del otro.',
      'Levántalos a los costados del cuerpo, sin tocar el centro.',
      'Sostén el tiempo indicado.',
      'Baja con control.',
    ],
    tip: 'Entrena la fuerza de pinza (pulgar contra dedos), que casi ningún otro ejercicio trabaja.',
  },
  'HAND GRIP': {
    family: 'grip',
    steps: [
      'Toma el handgrip con el mango fijo en la palma y los dedos sobre el otro mango.',
      'Cierra la mano hasta que los mangos se toquen.',
      'Sostén 1–2 segundos cerrado.',
      'Abre despacio.',
    ],
    tip: 'Elige una dureza que puedas cerrar al menos 8 veces.',
  },
  'APRETAR PELOTA': {
    family: 'grip',
    steps: [
      'Toma una pelota blanda o antiestrés en la palma.',
      'Apriétala con todos los dedos lo más fuerte posible.',
      'Sostén 3–5 segundos.',
      'Suelta despacio.',
    ],
    tip: 'Ideal para la recuperación de la mano o como calentamiento: series de 10–20.',
  },
  'EXTENSION DE DEDOS CON BANDA': {
    family: 'grip',
    steps: [
      'Pon una banda elástica alrededor de los dedos y el pulgar juntos.',
      'Abre la mano en abanico contra la resistencia de la banda.',
      'Sostén un segundo con los dedos separados.',
      'Cierra despacio.',
    ],
    tip: 'Equilibra todo el trabajo de agarre: previene molestias en el codo.',
  },
  'CUBO DE ARROZ': {
    family: 'grip',
    steps: [
      'Llena un balde con arroz y mete las manos hasta las muñecas.',
      'Abre los dedos con fuerza contra el arroz.',
      'Cierra el puño apretando el arroz.',
      'Alterna también giros y movimientos de muñeca durante 1–2 minutos.',
    ],
    tip: 'Es un clásico de escaladores y luchadores: trabaja flexores y extensores a la vez.',
  },
};
