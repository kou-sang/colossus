// Fichas de piernas, glúteos y pantorrillas.
export const LEG_GUIDES = {
  // ───────── Sentadillas ─────────
  SENTADILLA: {
    family: 'squat',
    steps: [
      'Apoya la barra sobre el trapecio (barra alta), tómala un poco más ancho que los hombros y sácala del rack.',
      'Párate con los pies algo más abiertos que la cadera y las puntas hacia afuera (15–30°).',
      'Baja llevando la cadera atrás y las rodillas hacia afuera, en línea con los pies, hasta que la cadera pase la altura de las rodillas.',
      'Sube empujando el piso con todo el pie, con el pecho alto, hasta quedar erguido.',
    ],
    tip: 'La barra va apoyada en el trapecio, no en el cuello; aprieta la barra y lleva los codos hacia abajo.',
  },
  'SENTADILLA BARRA BAJA': {
    family: 'squat',
    steps: [
      'Apoya la barra más abajo, sobre los deltoides posteriores (debajo de la espina del omóplato), con agarre más cerrado.',
      'Pies un poco más abiertos que en la sentadilla clásica.',
      'Baja inclinando más el torso y llevando la cadera bien atrás hasta romper el paralelo.',
      'Sube empujando la cadera hacia arriba y adelante con el pecho firme.',
    ],
    tip: 'Más glúteo, aductores e isquios y menos cuádriceps: es la variante de los powerlifters para mover más peso.',
  },
  'SENTADILLA FRONTAL': {
    family: 'squat',
    steps: [
      'Apoya la barra sobre la parte delantera de los hombros, tocando el cuello, con los dedos debajo de la barra y los codos bien altos.',
      'Pies al ancho de los hombros y puntas apenas afuera.',
      'Baja con el torso casi vertical, rodillas adelante y afuera, hasta romper el paralelo.',
      'Sube manteniendo los codos arriba para que la barra no ruede.',
    ],
    tip: 'Si las muñecas no llegan, cruza los brazos sobre la barra o usa correas en la barra.',
  },
  'SENTADILLA ZERCHER': {
    family: 'squat',
    steps: [
      'Desde un rack a la altura de la cintura, toma la barra en el pliegue de los codos y abraza el abdomen.',
      'Párate con los pies al ancho de los hombros.',
      'Baja con el torso erguido y la barra pegada al cuerpo hasta que los codos rocen los muslos.',
      'Sube empujando el piso sin dejar que la barra se aleje.',
    ],
    tip: 'Suma mucho trabajo de core y espalda alta; usa una toalla en los codos si la barra molesta.',
  },
  'SENTADILLA GOBLET': {
    family: 'squat',
    steps: [
      'Sostén una mancuerna vertical (o una kettlebell) pegada al pecho, con ambas manos debajo del disco superior.',
      'Pies un poco más abiertos que la cadera, puntas hacia afuera.',
      'Baja con el torso erguido, metiendo los codos entre las rodillas.',
      'Sube empujando el piso.',
    ],
    tip: 'El contrapeso al frente ayuda a bajar profundo con la espalda recta: ideal para aprender a sentarse.',
  },
  'SENTADILLA CON MANCUERNAS': {
    family: 'squat',
    steps: [
      'Párate con una mancuerna en cada mano colgando a los costados del cuerpo.',
      'Pies al ancho de la cadera.',
      'Baja con la cadera atrás y los brazos colgando, hasta que las mancuernas queden cerca de los tobillos.',
      'Sube empujando el piso sin que las mancuernas se balanceen.',
    ],
    tip: 'Sin barra en la espalda: buena opción si los hombros no toleran la barra o no hay rack.',
  },
  'SENTADILLA SUMO': {
    family: 'squat',
    steps: [
      'Párate con los pies bien abiertos (casi el doble del ancho de la cadera) y las puntas hacia afuera a unos 45°.',
      'Sostén una kettlebell o mancuerna colgando con ambas manos entre las piernas.',
      'Baja con el torso erguido, empujando las rodillas hacia afuera sobre los pies.',
      'Sube apretando glúteos y aductores.',
    ],
    tip: 'Más aductores y glúteos que la sentadilla clásica; sube a dos cajones bajos para ganar recorrido.',
  },
  'SENTADILLA EN MULTIPOWER': {
    family: 'squat',
    steps: [
      'Ubícate debajo de la barra del multipower y apóyala en el trapecio.',
      'Adelanta los pies unos 20–30 cm respecto de la barra.',
      'Destraba la barra y baja con el torso más vertical que en la sentadilla libre.',
      'Sube empujando el piso y traba la barra al terminar.',
    ],
    tip: 'Con los pies adelante, la guía permite bajar con el torso erguido y cargar el cuádriceps.',
  },
  'SENTADILLA EN CAJON': {
    family: 'squat',
    steps: [
      'Ubica un cajón detrás de ti a la altura de las rodillas (o un poco más bajo) y apoya la barra en la espalda.',
      'Pies abiertos y puntas afuera.',
      'Lleva la cadera atrás y siéntate en el cajón sin desplomarte, con las tibias casi verticales.',
      'Haz una pausa breve sin relajar el tronco y sube de forma explosiva.',
    ],
    tip: 'Enseña a llevar la cadera atrás y fortalece la salida desde abajo: muy usada en powerlifting.',
  },
  'SENTADILLA SIN PESO': {
    family: 'squat',
    steps: [
      'De pie, con los pies al ancho de los hombros y las puntas apenas afuera.',
      'Estira los brazos al frente para equilibrarte.',
      'Baja con la cadera atrás hasta que los muslos queden paralelos al piso o un poco más.',
      'Sube empujando el piso con los brazos al frente.',
    ],
    tip: 'Ideal para calentar o en circuitos de muchas repeticiones.',
  },
  'SENTADILLA ISOMETRICA EN PARED': {
    family: 'squat',
    steps: [
      'Apoya la espalda en la pared y adelanta los pies unos 40–50 cm.',
      'Desliza la espalda hacia abajo hasta que los muslos queden paralelos al piso y las rodillas a 90°.',
      'Mantén la espalda pegada a la pared y el peso en los talones.',
      'Sostén el tiempo indicado y sube deslizando.',
    ],
    tip: 'Es isométrica: se mide en segundos (30–90). Muy útil en rehabilitación de rodilla.',
  },
  'SENTADILLA BELT': {
    family: 'squat',
    steps: [
      'Ajusta el cinturón a la cadera y engánchalo a la máquina (o a un disco entre las piernas) parado sobre la plataforma.',
      'Toma las manijas al frente solo para equilibrarte.',
      'Baja con el torso erguido hasta romper el paralelo.',
      'Sube empujando el piso con el cinturón tenso.',
    ],
    tip: 'La carga cuelga de la cadera: piernas a tope sin compresión en la columna.',
  },
  'SENTADILLA HACK CON BARRA': {
    family: 'squat',
    steps: [
      'Párate delante de una barra en el piso y tómala por detrás de las piernas, con agarre prono.',
      'Baja con la cadera y el torso erguido hasta tomar la barra con los brazos estirados.',
      'Sube empujando el piso con la barra pegada a la parte de atrás de las piernas.',
      'Baja controlado hasta apoyar.',
    ],
    tip: 'Es la versión original de la hack: mucho cuádriceps, pero el agarre limita la carga.',
  },
  'SENTADILLA HACK': {
    family: 'hackSquat',
    steps: [
      'Apoya la espalda en el respaldo de la máquina hack y los hombros debajo de las almohadillas.',
      'Pies en el centro de la plataforma al ancho de los hombros.',
      'Destraba los seguros y baja hasta que las rodillas lleguen a 90° o un poco más.',
      'Empuja la plataforma hasta casi estirar las rodillas, sin bloquearlas.',
    ],
    tip: 'Pies más bajos en la plataforma: más cuádriceps; más altos: más glúteo.',
  },
  'SENTADILLA V': {
    family: 'hackSquat',
    steps: [
      'Párate en la plataforma de la V squat con la espalda contra el respaldo y los hombros bajo los apoyos.',
      'Pies al ancho de la cadera, un poco adelante.',
      'Baja siguiendo el carril inclinado hasta que los muslos queden paralelos.',
      'Sube empujando con todo el pie.',
    ],
    tip: 'El carril en V deja el torso más vertical que la hack: enfoca el cuádriceps con menos carga lumbar.',
  },
  'SENTADILLA PENDULAR': {
    family: 'hackSquat',
    steps: [
      'Ubícate en la máquina pendular con la espalda en el respaldo y los hombros bajo las almohadillas.',
      'Pies en la plataforma inclinada al ancho de la cadera.',
      'Baja dejando que el respaldo describa su arco hasta una sentadilla profunda.',
      'Sube empujando hasta casi estirar las piernas.',
    ],
    tip: 'El arco del péndulo carga más abajo: permite sentadillas muy profundas con poca carga en la espalda.',
  },
  'HACK INVERSA': {
    family: 'hackSquat',
    steps: [
      'Ubícate de frente al respaldo de la máquina hack, con el pecho contra la almohadilla y los hombros bajo los apoyos.',
      'Pies al ancho de los hombros en la plataforma.',
      'Baja llevando la cadera atrás hasta que los muslos queden paralelos.',
      'Sube empujando con los talones.',
    ],
    tip: 'Mirando al respaldo, la cadera va más atrás: más glúteo e isquiotibiales que la hack normal.',
  },
  'PRENSA 45': {
    family: 'legPress',
    steps: [
      'Siéntate con la espalda y la cadera bien apoyadas en el respaldo de la prensa inclinada.',
      'Pies en el centro de la plataforma al ancho de los hombros; destraba los seguros.',
      'Baja la plataforma flexionando las rodillas hasta 90° o un poco más, sin despegar la cadera.',
      'Empuja hasta casi estirar las piernas, sin bloquear las rodillas.',
    ],
    tip: 'Si la cadera se despega abajo, recorta el recorrido: es la señal de que la zona lumbar se redondea.',
  },
  'PRENSA HORIZONTAL': {
    family: 'legPress',
    steps: [
      'Siéntate en la prensa horizontal con la espalda apoyada y los pies en la plataforma vertical.',
      'Toma las manijas laterales.',
      'Empuja hasta casi estirar las piernas (el asiento o la plataforma se desliza).',
      'Vuelve despacio hasta que las rodillas queden a 90°.',
    ],
    tip: 'Menos carga sobre la columna que la prensa inclinada: buena opción para empezar.',
  },
  'PRENSA VERTICAL': {
    family: 'legPress',
    steps: [
      'Acuéstate boca arriba en la prensa vertical con la cadera debajo de la plataforma.',
      'Apoya los pies en la plataforma, destraba y estira las piernas hacia arriba.',
      'Baja la plataforma flexionando las rodillas hacia el pecho.',
      'Empuja hacia arriba sin bloquear las rodillas.',
    ],
    tip: 'Es la más exigente con la zona lumbar al bajar: no fuerces la profundidad.',
  },
  'PRENSA UNILATERAL': {
    family: 'legPress',
    steps: [
      'Siéntate en la prensa 45 y apoya un solo pie en el centro de la plataforma.',
      'La otra pierna queda flexionada fuera de la plataforma.',
      'Baja flexionando la rodilla hasta 90°.',
      'Empuja hasta casi estirar la pierna; cambia de lado.',
    ],
    tip: 'Corrige diferencias entre piernas: empieza con la pierna más débil.',
  },
  'SILLON DE CUADRICEPS': {
    family: 'legExtension',
    steps: [
      'Siéntate con la espalda apoyada y alinea las rodillas con el eje de la máquina.',
      'Ajusta el rodillo sobre la parte baja de las tibias, por encima de los tobillos.',
      'Estira las rodillas hasta que las piernas queden casi rectas.',
      'Baja despacio hasta que las rodillas vuelvan a 90°.',
    ],
    tip: 'Haz una pausa de un segundo arriba apretando el cuádriceps.',
  },
  'SILLON DE CUADRICEPS UNILATERAL': {
    family: 'legExtension',
    steps: [
      'Siéntate en el sillón de cuádriceps con el rodillo sobre la tibia de una sola pierna.',
      'La otra pierna queda flexionada y relajada.',
      'Estira la rodilla hasta casi bloquear.',
      'Baja el rodillo despacio; cambia de pierna.',
    ],
    tip: 'Útil para emparejar la fuerza entre piernas después de una lesión.',
  },
  'SISSY SQUAT': {
    family: 'sissy',
    steps: [
      'Tómate de un soporte con una mano y párate sobre las puntas de los pies.',
      'Inclina el cuerpo recto hacia atrás mientras las rodillas avanzan hacia adelante y abajo.',
      'Baja hasta que las rodillas casi toquen el piso, manteniendo la cadera estirada.',
      'Sube empujando con los cuádriceps.',
    ],
    tip: 'Estira mucho el recto femoral: empieza con recorridos cortos.',
  },
  'SENTADILLA ESPAÑOLA': {
    family: 'spanishSquat',
    steps: [
      'Ata una banda gruesa a un poste a la altura de las rodillas y pásala por detrás de ambas rodillas.',
      'Retrocede hasta que la banda quede tensa, con los pies al ancho de la cadera.',
      'Baja llevando la cadera atrás con las tibias verticales, apoyado en la banda.',
      'Sube manteniendo la tensión de la banda.',
    ],
    tip: 'Las tibias verticales reducen la carga sobre el tendón rotuliano: clásico para tendinopatías.',
  },

  // ───────── Isquiotibiales ─────────
  'CAMILLA DE ISQUIOTIBIALES': {
    family: 'legCurl',
    steps: [
      'Acuéstate boca abajo en la camilla con las rodillas justo fuera del borde del tapizado.',
      'Ajusta el rodillo sobre los tobillos, por encima de los talones, y toma las manijas.',
      'Flexiona las rodillas llevando los talones hacia los glúteos.',
      'Baja despacio hasta casi estirar las piernas.',
    ],
    tip: 'Aprieta la cadera contra el tapizado: si se levanta, la zona lumbar compensa.',
  },
  'CURL FEMORAL CON MANCUERNA': {
    family: 'legCurl',
    steps: [
      'Acuéstate boca abajo en un banco plano con las rodillas fuera del borde.',
      'Pide que te coloquen una mancuerna vertical entre los pies, sujeta por los empeines.',
      'Flexiona las rodillas llevando la mancuerna hacia los glúteos.',
      'Baja despacio sin soltar la mancuerna.',
    ],
    tip: 'Alternativa casera a la camilla: aprieta bien los pies para que la mancuerna no se mueva.',
  },
  'CURL FEMORAL SENTADO': {
    family: 'legCurl',
    steps: [
      'Siéntate con la espalda apoyada, el rodillo sobre los talones y las rodillas alineadas con el eje.',
      'Baja la almohadilla sobre los muslos y apoya los tobillos encima del rodillo.',
      'Flexiona las rodillas llevando el rodillo hacia abajo y atrás.',
      'Vuelve despacio hasta casi estirar las piernas.',
    ],
    tip: 'Sentado, la cadera flexionada estira más los isquiotibiales: genera más hipertrofia que acostado.',
  },
  'CURL FEMORAL PARADO': {
    family: 'legCurl',
    steps: [
      'Párate en la máquina con la cadera contra el apoyo y el rodillo detrás del tobillo de una pierna.',
      'Toma las manijas y deja la otra pierna firme.',
      'Flexiona la rodilla llevando el talón hacia el glúteo.',
      'Baja despacio; cambia de pierna.',
    ],
    tip: 'Trabajar una pierna por vez permite concentrarse y corregir diferencias.',
  },
  'CURL FEMORAL EN POLEA': {
    family: 'legCurl',
    steps: [
      'Ubica una tobillera en la polea baja y engánchala en un tobillo.',
      'Párate de frente a la máquina tomándote del soporte.',
      'Flexiona la rodilla llevando el talón hacia el glúteo sin mover el muslo.',
      'Baja el tobillo despacio contra el cable; cambia de pierna.',
    ],
    tip: 'Si no hay máquina de curl femoral, la polea es el mejor reemplazo.',
  },
  'CURL FEMORAL CON FITBALL': {
    family: 'legCurl',
    steps: [
      'Acuéstate boca arriba con los talones sobre la pelota y los brazos en el piso.',
      'Eleva la cadera hasta alinear hombros, cadera y talones.',
      'Flexiona las rodillas acercando la pelota a los glúteos sin bajar la cadera.',
      'Estira despacio las piernas.',
    ],
    tip: 'Combina puente de glúteos y curl femoral: progresa haciéndolo a una pierna.',
  },
  'CURL NORDICO': {
    family: 'nordic',
    steps: [
      'Arrodíllate sobre una colchoneta con los tobillos trabados (bajo un rodillo o sujetos por un compañero).',
      'Con el cuerpo recto de las rodillas a la cabeza, déjate caer hacia adelante lo más lento posible.',
      'Frena con los isquiotibiales hasta donde puedas y apoya las manos en el piso.',
      'Empuja con las manos para volver y repite.',
    ],
    tip: 'Reduce hasta un 50% las lesiones de isquiotibiales en deportes de carrera (van der Horst, 2015).',
  },
  'GLUTE HAM RAISE': {
    family: 'nordic',
    steps: [
      'Ajusta el GHD para que las rodillas queden apenas detrás de la almohadilla y traba los tobillos.',
      'Empieza con el cuerpo horizontal, mirando al piso.',
      'Flexiona las rodillas empujando los pies contra la plataforma hasta quedar erguido.',
      'Baja despacio hasta la horizontal.',
    ],
    tip: 'Más fácil que el nórdico y más difícil que el curl en máquina: perfecto para progresar.',
  },
  'NORDICO INVERSO': {
    family: 'nordic',
    steps: [
      'Arrodíllate sobre una colchoneta con el cuerpo erguido y los brazos a los costados.',
      'Inclínate hacia atrás con el cuerpo recto, de las rodillas a la cabeza.',
      'Baja hasta donde controles, sintiendo el estiramiento del cuádriceps.',
      'Vuelve a la vertical con la fuerza de los muslos.',
    ],
    tip: 'Fortalece el cuádriceps en estiramiento: útil en rehabilitación de rodilla y para corredores.',
  },
  'PESO MUERTO RUMANO': {
    family: 'hinge',
    steps: [
      'De pie con la barra en las manos (agarre prono, al ancho de los hombros), apoyada en los muslos.',
      'Flexiona apenas las rodillas y mantén ese ángulo durante toda la bajada de la barra.',
      'Lleva la cadera hacia atrás y baja la barra pegada a las piernas hasta debajo de las rodillas.',
      'Vuelve empujando la cadera hacia adelante y aprieta los glúteos arriba.',
    ],
    tip: 'Baja solo mientras la espalda siga recta: el rango depende de tu flexibilidad.',
  },
  'PESO MUERTO PIERNAS RIGIDAS': {
    family: 'hinge',
    steps: [
      'Párate con la barra en las manos y las rodillas casi estiradas.',
      'Inclina el torso hacia adelante con la espalda recta, dejando que la barra baje hacia los pies.',
      'Llega hasta media tibia o hasta sentir un estiramiento fuerte de los isquiotibiales.',
      'Vuelve a erguirte.',
    ],
    tip: 'Con las rodillas casi rectas el estiramiento de isquiotibiales es mayor que en el rumano.',
  },
  'PESO MUERTO RUMANO CON MANCUERNAS': {
    family: 'hinge',
    steps: [
      'De pie, con una mancuerna en cada mano frente a los muslos.',
      'Flexiona apenas las rodillas.',
      'Lleva la cadera atrás bajando las mancuernas pegadas a las piernas hasta media tibia.',
      'Vuelve empujando la cadera adelante.',
    ],
    tip: 'Las mancuernas dejan bajar un poco más que la barra y son fáciles de soltar.',
  },
  'PESO MUERTO RUMANO UNILATERAL': {
    family: 'hinge',
    steps: [
      'Párate sobre una pierna con una mancuerna en cada mano (o en la mano contraria).',
      'Inclina el torso hacia adelante mientras la pierna libre sube por detrás alineada con el tronco.',
      'Baja hasta que el torso quede casi horizontal, sin abrir la cadera.',
      'Vuelve a la posición inicial; cambia de pierna.',
    ],
    tip: 'Al principio sostente de algo con una mano para el equilibrio.',
  },
  'PESO MUERTO SUMO': {
    family: 'deadlift',
    steps: [
      'Párate con los pies muy abiertos y las puntas hacia afuera, con la barra sobre la mitad del pie.',
      'Toma la barra por dentro de las piernas, con las manos al ancho de los hombros.',
      'Empuja las rodillas hacia afuera, saca el pecho y tensa la espalda.',
      'Empuja el piso "separándolo" con los pies hasta quedar erguido.',
    ],
    tip: 'El torso queda más vertical que en el convencional: más aductores y menos zona lumbar.',
  },

  // ───────── Estocadas ─────────
  ESTOCADAS: {
    family: 'lunge',
    steps: [
      'De pie, con una mancuerna en cada mano a los costados.',
      'Da un paso largo hacia adelante.',
      'Baja hasta que la rodilla de atrás casi toque el piso y la de adelante quede a 90°.',
      'Empuja con la pierna de adelante para volver al inicio; alterna.',
    ],
    tip: 'La rodilla de adelante sigue la línea del pie: no la dejes caer hacia adentro.',
  },
  'ESTOCADAS CAMINANDO': {
    family: 'lunge',
    steps: [
      'De pie, con las manos en la cintura o con mancuernas.',
      'Da un paso largo adelante y baja hasta que la rodilla de atrás casi toque el piso.',
      'Empuja y lleva el pie de atrás directamente a la siguiente estocada, avanzando.',
      'Continúa caminando el tramo indicado.',
    ],
    tip: 'Avanzar exige más equilibrio: el glúteo medio trabaja más que en la estocada en el lugar.',
  },
  'ESTOCADAS INVERSAS': {
    family: 'lunge',
    steps: [
      'De pie, con una mancuerna en cada mano.',
      'Da un paso largo hacia atrás apoyando la punta del pie.',
      'Baja hasta que la rodilla de atrás casi toque el piso.',
      'Empuja con la pierna de adelante para volver; alterna.',
    ],
    tip: 'Hacia atrás la rodilla de adelante sufre menos: buena opción si molestan las rodillas.',
  },
  'ESTOCADA ESTATICA': {
    family: 'lunge',
    steps: [
      'Párate en posición de estocada: un pie adelante y el otro atrás apoyado en la punta.',
      'Sostén una mancuerna contra el pecho.',
      'Baja y sube en vertical sin mover los pies, hasta que la rodilla de atrás casi toque el piso.',
      'Completa las repeticiones y cambia de pierna.',
    ],
    tip: 'Sin el paso es más fácil de controlar: ideal para aprender el patrón de la estocada.',
  },
  'ESTOCADAS CON BARRA': {
    family: 'lunge',
    steps: [
      'Apoya la barra en el trapecio como en la sentadilla.',
      'Separa los pies en posición de estocada.',
      'Baja hasta que la rodilla de atrás casi toque el piso con el torso erguido.',
      'Sube empujando con la pierna de adelante con la barra estable; cambia de lado.',
    ],
    tip: 'Usa menos peso que en la sentadilla: el equilibrio es el limitante.',
  },
  'ESTOCADAS EN MULTIPOWER': {
    family: 'lunge',
    steps: [
      'Apoya la barra del multipower en el trapecio y separa los pies en posición de estocada.',
      'Destraba la barra.',
      'Baja en vertical hasta que la rodilla de atrás casi toque el piso.',
      'Sube y, al terminar el lado, traba la barra para cambiar de pierna.',
    ],
    tip: 'La guía quita el problema del equilibrio: permite cargar más la pierna de adelante.',
  },
  'SENTADILLA BULGARA': {
    family: 'lunge',
    steps: [
      'Párate a un paso largo de un banco y apoya el empeine del pie de atrás sobre él.',
      'Con una mancuerna en cada mano, deja casi todo el peso en la pierna de adelante.',
      'Baja hasta que el muslo de adelante quede paralelo al piso.',
      'Sube empujando con la pierna de adelante; cambia de lado.',
    ],
    tip: 'Inclinar un poco el torso hacia adelante carga más el glúteo; erguido, más el cuádriceps.',
  },
  'ESTOCADA CRUZADA': {
    family: 'lunge',
    steps: [
      'De pie, con una mancuerna contra el pecho.',
      'Lleva una pierna hacia atrás y cruzada por detrás de la otra, como en una reverencia.',
      'Baja hasta que la rodilla de atrás casi toque el piso, con la cadera de frente.',
      'Vuelve al inicio; alterna.',
    ],
    tip: 'El cruce estira y carga el glúteo medio de la pierna de adelante.',
  },
  'ESTOCADA LATERAL': {
    family: 'lunge',
    steps: [
      'De pie, con una mancuerna contra el pecho y los pies juntos.',
      'Da un paso amplio hacia el costado.',
      'Baja llevando la cadera atrás sobre la pierna que dio el paso; la otra queda estirada.',
      'Empuja para volver al centro; alterna.',
    ],
    tip: 'Trabaja aductores y glúteo en el plano lateral, poco entrenado en el gimnasio.',
  },
  'SENTADILLA COSACA': {
    family: 'lunge',
    steps: [
      'Párate con las piernas muy abiertas y los brazos al frente.',
      'Baja hacia un lado flexionando esa rodilla hasta quedar casi sentado sobre el talón.',
      'La otra pierna queda estirada con la punta del pie hacia arriba.',
      'Pasa al otro lado sin subir del todo.',
    ],
    tip: 'Es movilidad y fuerza a la vez: baja solo hasta donde mantengas el talón apoyado.',
  },
  'SENTADILLA DEL PATINADOR': {
    family: 'lunge',
    steps: [
      'Párate sobre una pierna con la otra flexionada hacia atrás.',
      'Estira los brazos al frente para equilibrarte mientras la rodilla de atrás baja.',
      'Baja hasta que la rodilla de atrás roce el piso (o una colchoneta) sin apoyarse.',
      'Sube con la pierna de apoyo; cambia de lado.',
    ],
    tip: 'Más accesible que la pistol: progresa poniendo un disco debajo de la rodilla de atrás.',
  },
  'SUBIDAS AL CAJON': {
    family: 'stepUp',
    steps: [
      'Párate frente a un cajón a la altura de la rodilla con una mancuerna en cada mano.',
      'Apoya un pie completo sobre el cajón.',
      'Sube empujando con la pierna de arriba hasta quedar parado sobre el cajón.',
      'Baja controlado con la misma pierna; alterna.',
    ],
    tip: 'Evita impulsarte con el pie de abajo: todo el trabajo es de la pierna que está arriba.',
  },

  // ───────── Aductores y abductores ─────────
  ADUCTOR: {
    family: 'adductor',
    steps: [
      'Siéntate en la máquina con la espalda apoyada y las piernas abiertas contra las almohadillas internas.',
      'Toma las manijas laterales y pega la espalda al respaldo.',
      'Junta las piernas hasta que las almohadillas casi se toquen.',
      'Abre despacio hasta sentir el estiramiento.',
    ],
    tip: 'Ajusta la apertura inicial a tu flexibilidad: más abierto no siempre es mejor.',
  },
  'ADUCCION EN POLEA': {
    family: 'adductor',
    steps: [
      'Engancha la tobillera de la polea baja y párate de costado con la pierna enganchada del lado de la polea.',
      'Tómate del soporte y deja la pierna separada hacia la polea.',
      'Lleva la pierna hacia adentro, cruzando por delante de la otra.',
      'Vuelve la pierna hacia afuera despacio; cambia de lado.',
    ],
    tip: 'Mantén el torso quieto: el movimiento sale solo de la cadera.',
  },
  ABDUCTOR: {
    family: 'abductor',
    steps: [
      'Siéntate en la máquina con la espalda apoyada y las almohadillas por fuera de las rodillas.',
      'Toma las manijas.',
      'Abre las piernas empujando las almohadillas hacia afuera.',
      'Vuelve despacio sin que las pesas choquen.',
    ],
    tip: 'Inclinar el torso hacia adelante suma glúteo mayor; apoyado atrás, más glúteo medio.',
  },
  'ABDUCCION EN POLEA': {
    family: 'abductor',
    steps: [
      'Engancha la tobillera de la polea baja y párate de costado, con la pierna enganchada lejos de la polea.',
      'Tómate del soporte.',
      'Separa la pierna hacia el costado hasta unos 30–40°.',
      'Vuelve despacio cruzando apenas la línea media; cambia de lado.',
    ],
    tip: 'No inclines el torso hacia el lado contrario para subir más la pierna.',
  },
  'CAMINATA LATERAL CON BANDA': {
    family: 'abductor',
    steps: [
      'Coloca una banda alrededor de las rodillas o los tobillos.',
      'Baja a media sentadilla con los pies al ancho de la cadera.',
      'Da pasos cortos hacia el costado sin juntar los pies.',
      'Recorre el tramo y vuelve hacia el otro lado.',
    ],
    tip: 'Buen calentamiento antes de sentadillas: activa el glúteo medio.',
  },
  ALMEJA: {
    family: 'clamshell',
    steps: [
      'Acuéstate de costado con las rodillas flexionadas a 45° y una banda sobre ellas.',
      'Apoya la cabeza en el brazo de abajo y mantén los pies juntos.',
      'Abre la rodilla de arriba sin separar los pies ni girar la cadera.',
      'Cierra despacio; cambia de lado.',
    ],
    tip: 'Pon la mano libre en la cadera para notar si gira hacia atrás.',
  },
  'ELEVACION LATERAL DE PIERNA ACOSTADO': {
    family: 'clamshell',
    steps: [
      'Acuéstate de costado con las piernas estiradas una sobre otra.',
      'Apoya la cabeza en el brazo de abajo.',
      'Eleva la pierna de arriba estirada, con la punta del pie hacia adelante, hasta unos 40°.',
      'Baja la pierna despacio sin apoyarla; cambia de lado.',
    ],
    tip: 'Lleva la pierna un poco hacia atrás: así trabaja el glúteo medio y no el tensor de la fascia.',
  },

  // ───────── Glúteos ─────────
  'HIP THRUST': {
    family: 'hipThrust',
    steps: [
      'Apoya la parte baja de los omóplatos en el borde de un banco y pasa la barra (con almohadilla) sobre la cadera.',
      'Pies apoyados al ancho de la cadera, a una distancia que deje las tibias verticales arriba.',
      'Empuja la cadera hacia arriba hasta alinear hombros, cadera y rodillas.',
      'Aprieta los glúteos un segundo y baja controlado.',
    ],
    tip: 'Mira hacia adelante (mentón al pecho) arriba: evita arquear la zona lumbar.',
  },
  'HIP THRUST EN MAQUINA': {
    family: 'hipThrust',
    steps: [
      'Siéntate en la máquina con la espalda alta en el respaldo y el cinturón o rodillo sobre la cadera.',
      'Apoya los pies en la plataforma al ancho de la cadera.',
      'Empuja la cadera hacia arriba hasta la extensión completa.',
      'Aprieta los glúteos y baja despacio.',
    ],
    tip: 'La máquina reemplaza la barra: se carga y descarga en segundos.',
  },
  'HIP THRUST EN MULTIPOWER': {
    family: 'hipThrust',
    steps: [
      'Ubica un banco perpendicular dentro del multipower y apoya la espalda alta en el borde.',
      'Baja la barra guiada sobre la cadera (con almohadilla) y destrábala.',
      'Empuja la cadera hacia arriba hasta alinear el cuerpo.',
      'Baja despacio y traba la barra al terminar.',
    ],
    tip: 'La guía evita que la barra ruede: más fácil de armar que con barra libre.',
  },
  'HIP THRUST UNILATERAL': {
    family: 'hipThrust',
    steps: [
      'Apoya la espalda alta en el borde de un banco con un pie en el piso.',
      'Eleva la otra pierna flexionada.',
      'Empuja la cadera hacia arriba con la pierna de apoyo hasta alinear el cuerpo.',
      'Baja la cadera despacio sin que rote; cambia de lado.',
    ],
    tip: 'Duplica la carga por lado sin necesidad de barra pesada.',
  },
  'PUENTE DE GLUTEOS': {
    family: 'gluteBridge',
    steps: [
      'Acuéstate boca arriba con las rodillas flexionadas y los pies apoyados cerca de los glúteos.',
      'Brazos estirados a los costados.',
      'Eleva la cadera apretando los glúteos hasta alinear hombros, cadera y rodillas.',
      'Baja la cadera despacio hasta casi tocar el piso.',
    ],
    tip: 'Empuja con los talones: si sientes los isquiotibiales, acerca un poco los pies.',
  },
  'PUENTE DE GLUTEOS CON BARRA': {
    family: 'gluteBridge',
    steps: [
      'Acuéstate en el piso con la barra (con almohadilla) apoyada sobre la cadera.',
      'Rodillas flexionadas y pies apoyados.',
      'Eleva la cadera hasta alinear hombros, cadera y rodillas.',
      'Baja despacio hasta casi apoyar.',
    ],
    tip: 'El recorrido es más corto que el hip thrust: permite cargar mucho.',
  },
  'PUENTE DE GLUTEOS A UNA PIERNA': {
    family: 'gluteBridge',
    steps: [
      'Acuéstate boca arriba con una rodilla flexionada y el pie apoyado.',
      'Eleva la otra pierna flexionada hacia el pecho.',
      'Eleva la cadera empujando con el talón de apoyo.',
      'Baja la cadera despacio sobre una pierna; cambia de lado.',
    ],
    tip: 'Mantén la cadera nivelada: no dejes que caiga hacia el lado libre.',
  },
  'FROG PUMP': {
    family: 'gluteBridge',
    steps: [
      'Acuéstate boca arriba y junta las plantas de los pies con las rodillas abiertas.',
      'Acerca los pies a los glúteos.',
      'Eleva la cadera apretando los glúteos.',
      'Baja y repite de forma continua (20–50 repeticiones).',
    ],
    tip: 'La rotación externa de la cadera enfoca el glúteo mayor: ideal como finalizador.',
  },
  'PATADA DE GLUTEO': {
    family: 'gluteKickback',
    steps: [
      'Colócate en cuatro apoyos con las manos debajo de los hombros y las rodillas debajo de la cadera.',
      'Con la rodilla flexionada a 90°, eleva una pierna llevando la planta del pie hacia el techo.',
      'Sube hasta que el muslo quede alineado con el torso.',
      'Vuelve la rodilla debajo de la cadera despacio; cambia de lado.',
    ],
    tip: 'No arquees la zona lumbar para subir más: el recorrido termina cuando el muslo queda horizontal.',
  },
  HIDRANTE: {
    family: 'gluteKickback',
    steps: [
      'En cuadrupedia, alinea manos con hombros y rodillas con cadera, con la espalda plana.',
      'Con la rodilla flexionada, eleva una pierna hacia el costado.',
      'Sube hasta que el muslo quede casi paralelo al piso, sin girar el torso.',
      'Baja la rodilla despacio sin apoyarla; cambia de lado.',
    ],
    tip: 'Agrega una banda sobre las rodillas para más intensidad.',
  },
  'PATADA DE GLUTEO EN POLEA': {
    family: 'gluteKickback',
    steps: [
      'Engancha la tobillera de la polea baja en un tobillo y párate de frente a la máquina.',
      'Tómate del soporte e inclina apenas el torso.',
      'Lleva la pierna estirada hacia atrás hasta extender la cadera.',
      'Vuelve la pierna despacio bajo la cadera; cambia de lado.',
    ],
    tip: 'El cable mantiene la tensión en todo el arco de la cadera.',
  },
  'PATADA DE GLUTEO EN MAQUINA': {
    family: 'gluteKickback',
    steps: [
      'Apoya el pecho en la almohadilla de la máquina de patada y toma las manijas.',
      'Coloca la planta del pie de la pierna que trabaja en la placa.',
      'Empuja la placa hacia atrás y arriba hasta estirar la pierna.',
      'Vuelve la plataforma despacio; cambia de lado.',
    ],
    tip: 'Con el pecho apoyado la zona lumbar no compensa: todo el trabajo es del glúteo.',
  },
  MULTICADERA: {
    family: 'gluteKickback',
    steps: [
      'Ajusta la multicadera para que el eje quede a la altura de tu cadera y el rodillo detrás del muslo.',
      'Párate de lado sobre la plataforma tomándote de las manijas.',
      'Lleva la pierna hacia atrás empujando el rodillo hasta extender la cadera.',
      'Vuelve despacio; cambia de lado.',
    ],
    tip: 'La misma máquina sirve para abducción, aducción y flexión cambiando el rodillo de lugar.',
  },
  'MULTICADERA ABDUCCION': {
    family: 'abductor',
    steps: [
      'Ajusta la multicadera con el rodillo por fuera del muslo, a la altura de la rodilla.',
      'Párate de frente a la máquina tomándote de las manijas.',
      'Lleva la pierna hacia el costado empujando el rodillo.',
      'Vuelve el rodillo despacio a la línea media; cambia de lado.',
    ],
    tip: 'De pie, la abducción trabaja el glúteo medio como cuando caminas o corres.',
  },
  'PULL THROUGH': {
    family: 'pullThrough',
    steps: [
      'Engancha una soga en la polea baja y párate de espaldas, con la soga entre las piernas.',
      'Toma la soga con ambas manos y da dos pasos adelante.',
      'Lleva la cadera atrás dejando que la soga pase entre las piernas, con la espalda recta.',
      'Empuja la cadera hacia adelante hasta quedar erguido y aprieta los glúteos.',
    ],
    tip: 'Enseña la bisagra de cadera sin carga en la columna: ideal antes del peso muerto.',
  },
  'HIPEREXTENSION INVERSA': {
    family: 'reverseHyper',
    steps: [
      'Acuéstate boca abajo en la máquina con la cadera en el borde y toma las manijas.',
      'Engancha los tobillos al rodillo con las piernas colgando.',
      'Eleva las piernas hacia atrás hasta la horizontal apretando los glúteos.',
      'Baja controlado dejando que el péndulo vuelva.',
    ],
    tip: 'Descomprime y fortalece la zona lumbar a la vez: muy usada en powerlifting.',
  },
  'PESO MUERTO CON KETTLEBELL': {
    family: 'hinge',
    steps: [
      'Ubica la kettlebell entre los pies, con los pies al ancho de la cadera.',
      'Bisagra de cadera con las rodillas un poco flexionadas y toma la manija con ambas manos.',
      'Con la espalda recta, empuja el piso y extiende la cadera hasta quedar de pie.',
      'Baja la kettlebell al piso por el mismo camino.',
    ],
    tip: 'Es la forma más simple de aprender a levantar del piso antes del swing o el peso muerto con barra.',
  },

  // ───────── Pantorrillas ─────────
  'GEMELOS PARADO': {
    family: 'calf',
    steps: [
      'Párate con la punta de los pies sobre un escalón y los talones en el aire.',
      'Tómate de un soporte para equilibrarte.',
      'Baja los talones por debajo del escalón hasta sentir el estiramiento.',
      'Sube lo más alto posible sobre las puntas y sostén un segundo.',
    ],
    tip: 'Con las rodillas estiradas trabaja más el gemelo; flexionadas, el sóleo.',
  },
  'GEMELOS EN MAQUINA': {
    family: 'calf',
    steps: [
      'Ubica los hombros debajo de las almohadillas y la punta de los pies en el escalón de la máquina.',
      'Estira las rodillas.',
      'Baja los talones hasta el estiramiento máximo.',
      'Sube sobre las puntas y sostén un segundo arriba.',
    ],
    tip: 'Haz una pausa de 1–2 segundos abajo: elimina el rebote del tendón de Aquiles.',
  },
  'GEMELOS EN MULTIPOWER': {
    family: 'calf',
    steps: [
      'Ubica un escalón o disco grueso debajo de la barra del multipower y apoya la barra en el trapecio.',
      'Coloca la punta de los pies en el escalón.',
      'Destraba y baja los talones hasta el estiramiento.',
      'Sube sobre las puntas y vuelve a trabar al terminar.',
    ],
    tip: 'La guía permite cargar mucho sin preocuparse por el equilibrio.',
  },
  'GEMELOS CON MANCUERNAS': {
    family: 'calf',
    steps: [
      'Párate en un escalón con la punta de los pies y una mancuerna en cada mano.',
      'Baja los talones por debajo del escalón hasta el estiramiento.',
      'Sube sobre las puntas lo más alto posible.',
      'Sostén arriba y baja despacio con las mancuernas quietas.',
    ],
    tip: 'Si el agarre falla antes que las pantorrillas, usa correas o pasa a la versión a una pierna.',
  },
  'GEMELOS A UNA PIERNA': {
    family: 'calf',
    steps: [
      'Párate sobre un escalón con un solo pie y una mancuerna en la mano del mismo lado.',
      'Tómate de un soporte con la otra mano y flexiona la pierna libre.',
      'Baja el talón hasta el estiramiento y sube sobre la punta.',
      'Completa las repeticiones y cambia de lado.',
    ],
    tip: 'Permite cargar mucho sin máquina y corregir diferencias entre lados.',
  },
  'GEMELOS BURRO': {
    family: 'calf',
    steps: [
      'Apoya los antebrazos o las manos en un soporte alto e inclina el torso a 90° con la cadera flexionada.',
      'Punta de los pies en un escalón (con la máquina o un compañero sobre la cadera para cargar).',
      'Baja los talones y sube sobre las puntas.',
      'Sostén un segundo en puntas con la cadera flexionada.',
    ],
    tip: 'Con la cadera flexionada el gemelo trabaja muy estirado: clásico de la era dorada.',
  },
  'GEMELOS EN HACK': {
    family: 'calf',
    steps: [
      'Ubícate en la máquina hack con la espalda en el respaldo y la punta de los pies en el borde bajo de la plataforma.',
      'Estira las rodillas y destraba la máquina.',
      'Baja los talones con la espalda en el respaldo hasta el estiramiento.',
      'Empuja la plataforma con las puntas y sostén un segundo.',
    ],
    tip: 'Buena alternativa cuando la máquina de gemelos está ocupada.',
  },
  'GEMELOS EN PRENSA': {
    family: 'calf',
    steps: [
      'Siéntate en la prensa con la espalda apoyada y la punta de los pies en el borde inferior de la plataforma.',
      'Estira las piernas sin bloquear las rodillas (no saques los seguros si no hace falta).',
      'Deja que la plataforma flexione los tobillos hacia ti.',
      'Empuja con las puntas extendiendo los tobillos.',
    ],
    tip: 'Mantén los pies firmes en la plataforma: si se resbalan, la plataforma puede bajar de golpe.',
  },
  'SOLEO SENTADO': {
    family: 'calf',
    steps: [
      'Siéntate en la máquina con la almohadilla sobre los muslos, cerca de las rodillas.',
      'Apoya la punta de los pies en el escalón.',
      'Baja los talones hasta el estiramiento.',
      'Sube sobre las puntas y sostén un segundo.',
    ],
    tip: 'Con las rodillas flexionadas el gemelo se relaja y el trabajo pasa al sóleo.',
  },
  'ELEVACION DE PUNTAS': {
    family: 'tibial',
    steps: [
      'Apoya la espalda en la pared con los talones sobre un escalón y la punta de los pies en el aire.',
      'Deja que las puntas bajen.',
      'Sube las puntas hacia las tibias lo más alto posible.',
      'Baja las puntas despacio hasta apoyarlas.',
    ],
    tip: 'Fortalece el tibial anterior: previene la periostitis en corredores.',
  },
  'SALTOS DE TOBILLO': {
    family: 'plyoCalf',
    steps: [
      'De pie, con los pies al ancho de la cadera y las rodillas casi estiradas.',
      'Salta solo con los tobillos, rebotando sobre la parte delantera de los pies.',
      'Minimiza el tiempo de contacto con el piso.',
      'Encadena 10–20 rebotes seguidos.',
    ],
    tip: 'Desarrolla la rigidez del tendón de Aquiles: base de la velocidad y el salto.',
  },
  'CAMINATA EN PUNTAS DE PIE': {
    family: 'plyoCalf',
    steps: [
      'Toma una mancuerna en cada mano y sube sobre las puntas de los pies.',
      'Camina dando pasos cortos sin bajar los talones.',
      'Mantén el torso erguido.',
      'Recorre el tramo indicado.',
    ],
    tip: 'Trabaja gemelos y sóleo en isometría junto con el agarre.',
  },
};
