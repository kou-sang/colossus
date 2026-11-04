// Fichas de pecho: pasos propios de cada ejercicio (coinciden con el dibujo), un consejo y, si aplica, un error típico.
export const CHEST_GUIDES = {
  'PRESS BANCA': {
    family: 'press',
    steps: [
      'Acuéstate en el banco plano con los ojos debajo de la barra del rack y los pies firmes en el piso, a los costados del banco.',
      'Toma la barra con agarre prono, un poco más ancho que los hombros (los antebrazos quedan verticales abajo).',
      'Junta los omóplatos, saca la barra del rack y ubícala con los brazos estirados sobre los hombros.',
      'Baja controlado hasta rozar la parte baja del pecho (línea de los pezones), con los codos a unos 45–60° del torso.',
      'Empuja hacia arriba y levemente hacia la cara hasta volver a estirar los brazos sobre los hombros.',
    ],
    tip: 'La barra no viaja en línea recta: baja al pecho bajo y sube en una diagonal suave hacia los hombros.',
  },
  'PRESS BANCA CON MANCUERNAS': {
    family: 'press',
    steps: [
      'Siéntate en la punta del banco con las mancuernas apoyadas en los muslos y recuéstate llevándolas al pecho.',
      'Estira los brazos: las mancuernas quedan sobre los hombros, cerca una de otra, con las palmas hacia los pies.',
      'Baja abriendo los codos a unos 45° hasta que las mancuernas queden a los costados del pecho, a la altura de los pezones.',
      'Empuja hacia arriba y hacia adentro, acercando las mancuernas sin chocarlas.',
    ],
    tip: 'Las mancuernas permiten bajar un poco más que la barra y que cada brazo trabaje por separado: si un lado se atrasa, iguala el ritmo con el más débil.',
    mistake: 'Soltar las mancuernas de golpe al terminar: bájalas al pecho y llévalas a los muslos al incorporarte.',
  },
  'PRESS INCLINADO': {
    family: 'press',
    steps: [
      'Ajusta el respaldo a 30–45° y siéntate con la espalda apoyada y los pies firmes en el piso.',
      'Toma la barra un poco más ancho que los hombros y sácala del rack con los brazos estirados sobre los hombros.',
      'Baja controlado hasta la parte alta del pecho, debajo de las clavículas, con los codos a unos 45°.',
      'Empuja la barra en vertical hasta estirar los brazos sobre los hombros.',
    ],
    tip: 'Con más de 45° de inclinación el ejercicio se vuelve un press de hombros: 30° es el punto ideal para el pecho superior.',
  },
  'PRESS INCLINADO CON MANCUERNAS': {
    family: 'press',
    steps: [
      'Respaldo a 30–45°: siéntate con las mancuernas sobre los muslos y llévalas a los hombros al recostarte.',
      'Estira los brazos sobre los hombros con las palmas hacia adelante y las mancuernas casi juntas.',
      'Baja abriendo los codos hasta que las mancuernas queden a los costados de la parte alta del pecho.',
      'Sube empujando hacia arriba y adentro hasta estirar los brazos.',
    ],
    tip: 'Mantén el pecho alto y los omóplatos juntos contra el respaldo: si los hombros se adelantan, el deltoides anterior se lleva el trabajo.',
  },
  'PRESS DECLINADO': {
    family: 'press',
    steps: [
      'Traba los tobillos debajo del rodillo y recuéstate en el banco declinado (15–30°) con la cabeza más baja que la cadera.',
      'Toma la barra un poco más ancho que los hombros; pide ayuda para sacarla del soporte.',
      'Baja la barra hasta la parte baja del pecho, con los codos a unos 45° del torso.',
      'Empuja hacia arriba hasta estirar los brazos sobre los hombros.',
    ],
    tip: 'El recorrido es más corto que en el plano: permite mover más peso con menos estrés en el hombro.',
    mistake: 'Entrenarlo solo: sacar y devolver la barra cabeza abajo es la parte más riesgosa.',
  },
  'PRESS DECLINADO CON MANCUERNAS': {
    family: 'press',
    steps: [
      'Siéntate con las mancuernas en los muslos, traba los tobillos bajo el rodillo y recuéstate en el banco declinado.',
      'Estira los brazos sobre los hombros con las palmas hacia los pies.',
      'Baja las mancuernas hasta los costados de la parte baja del pecho.',
      'Sube acercándolas sin chocarlas y vuelve a bajar despacio.',
    ],
    tip: 'Para terminar, baja las mancuernas al pecho y siéntate con ellas apoyadas en el cuerpo antes de soltarlas.',
  },
  'PRESS EN MULTIPOWER': {
    family: 'press',
    steps: [
      'Ubica el banco plano dentro del multipower de modo que la barra baje justo sobre la parte baja del pecho.',
      'Toma la barra un poco más ancho que los hombros, gírala para destrabarla de los ganchos y estira los brazos.',
      'Baja en línea recta (la guía no permite la diagonal) hasta rozar el pecho.',
      'Empuja hasta estirar los brazos y vuelve a trabar la barra al terminar la serie.',
    ],
    tip: 'Pon los topes de seguridad un poco por encima de la altura del pecho: puedes ir al fallo sin compañero.',
  },
  'PRESS INCLINADO EN MULTIPOWER': {
    family: 'press',
    steps: [
      'Coloca el banco a 30–45° dentro del multipower, de modo que la barra baje a la parte alta del pecho.',
      'Toma la barra un poco más ancho que los hombros y destrábala girando las muñecas.',
      'Baja en vertical hasta rozar la parte alta del pecho.',
      'Empuja hasta estirar los brazos y traba la barra en los ganchos al final.',
    ],
    tip: 'Si la barra cae sobre el cuello o el abdomen, mueve el banco antes de cargar peso: la trayectoria no se puede corregir en el aire.',
  },
  'PRESS HEX': {
    family: 'press',
    steps: [
      'Acuéstate en el banco plano con dos mancuernas sobre el pecho, palmas enfrentadas y las mancuernas tocándose.',
      'Apriétalas una contra otra con fuerza: esa presión se mantiene en toda la serie.',
      'Baja las mancuernas juntas hasta rozar el esternón, con los codos pegados al cuerpo.',
      'Empuja hacia arriba sin dejar de apretar hasta estirar los brazos.',
    ],
    tip: 'Usa bastante menos peso que en el press con mancuernas: el trabajo sale de la presión hacia adentro, no de la carga.',
  },
  'PRESS DE PISO': {
    family: 'press',
    steps: [
      'Acuéstate boca arriba en el piso, con las rodillas flexionadas y los pies apoyados, debajo de la barra en un rack bajo.',
      'Toma la barra un poco más ancho que los hombros y estira los brazos sobre el pecho.',
      'Baja hasta que la parte de atrás de los brazos toque el piso, con los codos a unos 45° del torso.',
      'Haz una pausa breve sin relajar y empuja hasta estirar los brazos.',
    ],
    tip: 'El piso corta el recorrido: menos estrés en el hombro y mucho trabajo de tríceps en el bloqueo final.',
    mistake: 'Dejar caer los codos al piso: apóyalos suave, sin rebote.',
  },
  'PRESS GUILLOTINA': {
    family: 'press',
    steps: [
      'Acuéstate en el banco plano y toma la barra bastante más ancho que en el press de banca.',
      'Estira los brazos sobre los hombros con los codos apuntando hacia afuera.',
      'Baja la barra hacia el cuello/clavículas con los codos abiertos a 90°, sin juntar los omóplatos tanto como en el press clásico.',
      'Detente a 2–3 cm del cuello y empuja de nuevo hacia arriba.',
    ],
    tip: 'Es un ejercicio avanzado para el pecho superior: usa poco peso, topes de seguridad y nunca lo hagas al fallo.',
    mistake: 'Apoyar la barra en el cuello o hacerlo sin seguros.',
  },
  'PRESS BANCA AGARRE INVERSO': {
    family: 'press',
    steps: [
      'Acuéstate en el banco plano y toma la barra con las palmas hacia ti (supinas), al ancho de los hombros.',
      'Saca la barra con ayuda y ubícala con los brazos estirados sobre el pecho.',
      'Baja con los codos pegados al cuerpo hasta rozar la parte baja del pecho o el inicio del abdomen.',
      'Empuja hacia arriba y hacia la cara hasta estirar los brazos.',
    ],
    tip: 'El agarre supino enfoca el pecho superior con menos rotación del hombro; empieza con 40–50% de tu peso habitual.',
    mistake: 'Envolver la barra sin pulgar: con agarre supino la barra se resbala con facilidad.',
  },
  'APERTURAS CON MANCUERNAS': {
    family: 'fly',
    steps: [
      'Acuéstate en el banco plano con una mancuerna en cada mano sobre el pecho, palmas enfrentadas.',
      'Flexiona apenas los codos (como abrazando un barril) y deja fijo ese ángulo.',
      'Abre los brazos en arco hacia los costados hasta que los codos lleguen a la altura del banco.',
      'Vuelve por el mismo arco hasta juntar las mancuernas sobre el pecho.',
    ],
    tip: 'Piensa en llevar los codos hacia el techo al subir, no las manos: así trabaja el pecho y no el bíceps.',
  },
  'APERTURAS INCLINADAS': {
    family: 'fly',
    steps: [
      'Ajusta el respaldo a 30° y recuéstate con las mancuernas sobre la parte alta del pecho, palmas enfrentadas.',
      'Fija los codos apenas flexionados.',
      'Abre los brazos en arco hacia los costados y un poco hacia atrás hasta sentir el estiramiento del pecho superior.',
      'Cierra el arco hasta juntar las mancuernas sobre los hombros.',
    ],
    tip: 'La inclinación desplaza el estiramiento a la porción clavicular: baja un poco menos que en el banco plano.',
  },
  'APERTURAS DECLINADAS': {
    family: 'fly',
    steps: [
      'Traba los tobillos en el banco declinado y recuéstate con las mancuernas sobre el pecho.',
      'Con los codos levemente flexionados, abre los brazos en arco hacia los costados.',
      'Baja hasta que los codos queden apenas por debajo del torso.',
      'Junta las mancuernas sobre la parte baja del pecho siguiendo el mismo arco.',
    ],
    tip: 'Enfoca la porción inferior del pecho: imagina que llevas las manos hacia el ombligo al cerrar.',
  },
  'APERTURAS EN POLEA': {
    family: 'fly',
    steps: [
      'Ubica un banco plano entre dos poleas bajas y toma una manija con cada mano antes de recostarte.',
      'Acostado, estira los brazos sobre el pecho con los codos levemente flexionados y las palmas enfrentadas.',
      'Abre los brazos en arco hasta la altura del banco, dejando que los cables tiren hacia afuera.',
      'Cierra el arco hasta juntar las manos sobre el pecho, apretando un segundo arriba.',
    ],
    tip: 'A diferencia de las mancuernas, el cable mantiene la tensión arriba: la contracción final vale tanto como el estiramiento.',
  },
  PULLOVER: {
    family: 'pullover',
    steps: [
      'Acuéstate a lo largo del banco plano con los pies en el piso y sostén una mancuerna con ambas manos por el disco superior.',
      'Estira los brazos sobre el pecho con los codos apenas flexionados.',
      'Lleva la mancuerna en arco por detrás de la cabeza hasta que los brazos queden a la altura del banco o un poco más abajo.',
      'Vuelve por el mismo arco hasta tener la mancuerna sobre el pecho, sin doblar más los codos.',
    ],
    tip: 'Exhala al volver y mantén las costillas abajo: si la zona lumbar se arquea al bajar, recorta el recorrido.',
  },
  'PRESS DE PECHO EN MAQUINA': {
    family: 'chestMachine',
    steps: [
      'Regula el asiento para que las manijas queden a la altura de la mitad del pecho y apoya toda la espalda.',
      'Toma las manijas horizontales con agarre prono y los codos un poco por debajo de los hombros.',
      'Empuja hacia adelante hasta casi estirar los brazos.',
      'Vuelve despacio hasta que las manos queden a la altura del pecho, sin que la pila de pesas toque.',
    ],
    tip: 'Es ideal para llegar cerca del fallo con seguridad, al final de la rutina de pecho.',
  },
  'PRESS INCLINADO EN MAQUINA': {
    family: 'chestMachine',
    steps: [
      'Siéntate con la espalda contra el respaldo inclinado y regula el asiento para que las manijas queden a la altura de la parte alta del pecho.',
      'Toma las manijas con agarre prono, codos por debajo de las manijas.',
      'Empuja hacia arriba y adelante, siguiendo la guía de la máquina, hasta casi estirar los brazos.',
      'Baja controlado hasta sentir el estiramiento del pecho superior.',
    ],
    tip: 'Si sientes más los hombros que el pecho, baja un punto el asiento: las manijas deben salir desde debajo de las clavículas.',
  },
  'PRESS DECLINADO EN MAQUINA': {
    family: 'chestMachine',
    steps: [
      'Regula el asiento para que las manijas queden a la altura de la parte baja del pecho.',
      'Apoya la espalda, toma las manijas y deja los codos apenas abiertos.',
      'Empuja hacia adelante y abajo, siguiendo el arco de la máquina, hasta casi estirar los brazos.',
      'Vuelve despacio hasta que las manos queden a la altura del pecho bajo.',
    ],
    tip: 'Es una buena alternativa a los fondos para la porción inferior del pecho cuando los hombros molestan.',
  },
  'PRESS DE PECHO HAMMER': {
    family: 'chestMachine',
    steps: [
      'Carga los discos en cada brazo de la máquina y ajusta el asiento para que las manijas queden a la altura de la mitad del pecho.',
      'Apoya la espalda y toma las manijas verticales (agarre neutro).',
      'Empuja hacia adelante: cada brazo converge hacia el centro siguiendo su propio arco.',
      'Vuelve despacio hasta sentir el estiramiento; puedes trabajar un brazo por vez.',
    ],
    tip: 'Los brazos independientes (isolateral) dejan ver qué lado es más débil: empieza cada serie con ese lado.',
  },
  MARIPOSA: {
    family: 'pecDeck',
    steps: [
      'Siéntate con la espalda apoyada y regula el asiento para que las manijas queden a la altura de los hombros.',
      'Toma las manijas con los brazos abiertos a los costados y los codos levemente flexionados.',
      'Junta las manos al frente del pecho en un arco amplio, como si abrazaras un árbol.',
      'Vuelve despacio hasta que los brazos queden alineados con el cuerpo, sin pasar hacia atrás.',
    ],
    tip: 'Haz una pausa de un segundo con las manos juntas: es el punto de máxima contracción que las mancuernas no tienen.',
  },
  'CRUCE DE POLEAS': {
    family: 'cableCross',
    steps: [
      'Ubica ambas poleas en la parte más alta y toma una manija con cada mano.',
      'Da un paso al frente con un pie adelantado e inclina un poco el torso; los brazos quedan abiertos y arriba.',
      'Con los codos levemente flexionados, lleva las manos hacia abajo y al centro hasta juntarlas frente a la cadera.',
      'Vuelve despacio hasta que las manos queden a la altura de los hombros, sintiendo el estiramiento.',
    ],
    tip: 'De arriba hacia abajo enfocas la porción inferior del pecho: cruza apenas las manos al final para sumar contracción.',
  },
  'CRUCE DE POLEAS BAJAS': {
    family: 'cableCross',
    steps: [
      'Baja ambas poleas al mínimo y toma una manija con cada mano.',
      'Da un paso al frente con el torso casi vertical; las manos quedan abajo, a los costados de los muslos.',
      'Con los codos apenas flexionados, sube las manos en arco hacia adelante y arriba hasta juntarlas a la altura del pecho.',
      'Baja despacio por el mismo arco.',
    ],
    tip: 'Imagina que levantas una bandeja con las dos manos: el movimiento de abajo hacia arriba enfoca el pecho superior.',
  },
  'CRUCE DE POLEAS MEDIAS': {
    family: 'cableCross',
    steps: [
      'Ubica ambas poleas a la altura del pecho y toma una manija con cada mano.',
      'Da un paso al frente; los brazos quedan abiertos en horizontal, con los codos apenas flexionados.',
      'Junta las manos frente al esternón en un arco horizontal.',
      'Vuelve despacio hasta que las manos queden un poco por detrás de la línea de los hombros.',
    ],
    tip: 'El arco horizontal coincide con las fibras de la porción media: es la versión en polea más parecida a la mariposa.',
  },
  'CRUCE DE POLEAS UNILATERAL': {
    family: 'cableCross',
    steps: [
      'Ubica una polea arriba y párate de costado a ella, tomando la manija con la mano más cercana.',
      'Separa los pies, inclina apenas el torso y apoya la otra mano en la cadera.',
      'Lleva la manija en diagonal hacia abajo, cruzando frente al cuerpo hasta la cadera contraria.',
      'Vuelve despacio hasta que el brazo quede arriba y abierto; completa las repeticiones y cambia de lado.',
    ],
    tip: 'Al trabajar un lado por vez puedes cruzar la línea media del cuerpo: más recorrido de contracción que con dos poleas.',
  },
  'PRESS DE PECHO EN POLEA': {
    family: 'cablePress',
    steps: [
      'Ubica dos poleas a la altura del pecho y párate de espaldas a ellas, con una manija en cada mano.',
      'Da un paso al frente con un pie adelantado; las manos quedan a los costados del pecho con los codos atrás.',
      'Empuja las manijas hacia adelante y apenas hacia el centro hasta estirar los brazos.',
      'Vuelve despacio hasta que las manos lleguen otra vez al pecho.',
    ],
    tip: 'Empuja con el pecho, no inclinando el cuerpo: el tronco queda firme como si estuvieras parado contra una pared.',
  },
  'PRESS SVEND': {
    family: 'svend',
    steps: [
      'De pie, sostén uno o dos discos lisos entre las palmas, pegados al pecho.',
      'Aprieta los discos con fuerza, como si quisieras juntarlos.',
      'Empuja los discos hacia adelante a la altura del pecho hasta estirar los brazos, sin dejar de apretar.',
      'Vuelve al pecho despacio, manteniendo la presión todo el tiempo.',
    ],
    tip: 'La clave es la presión entre las palmas, no el peso del disco: funciona muy bien al final de la rutina de pecho.',
  },
  FLEXIONES: {
    family: 'pushUp',
    steps: [
      'Apoya las manos en el piso un poco más abiertas que los hombros, debajo de ellos, y estira las piernas sobre las puntas de los pies.',
      'Forma una línea recta de la cabeza a los talones apretando glúteos y abdomen.',
      'Baja el pecho hasta casi tocar el piso, con los codos a unos 45° del torso.',
      'Empuja el piso hasta estirar los brazos sin perder la línea del cuerpo.',
    ],
    tip: 'Al llegar arriba empuja un poco más el piso hasta separar los omóplatos: activa el serrato anterior.',
  },
  'FLEXIONES DE RODILLAS': {
    family: 'pushUp',
    steps: [
      'Apoya las manos debajo de los hombros y las rodillas en el piso (sobre una colchoneta), con los pies en el aire.',
      'Alinea cabeza, espalda y muslos: la cadera no se queda atrás.',
      'Baja el pecho hasta casi tocar el piso con los codos a 45°.',
      'Empuja hasta estirar los brazos sin despegar las rodillas.',
    ],
    tip: 'Es la progresión para llegar a las flexiones completas: cuando hagas 3 series de 15, pasa a las inclinadas o a las clásicas.',
  },
  'FLEXIONES DECLINADAS': {
    family: 'pushUp',
    steps: [
      'Apoya los pies sobre un cajón o banco y las manos en el piso, un poco más abiertas que los hombros.',
      'Mantén el cuerpo recto de los talones a la cabeza.',
      'Baja hasta que la frente o el pecho alto queden cerca del piso.',
      'Empuja hasta estirar los brazos.',
    ],
    tip: 'Cuanto más alto el apoyo de los pies, más trabajo pasa al pecho superior y al hombro.',
  },
  'FLEXIONES INCLINADAS': {
    family: 'pushUp',
    steps: [
      'Apoya las manos en el borde de un banco (o en la barra del multipower), un poco más abiertas que los hombros.',
      'Lleva los pies atrás hasta que el cuerpo quede recto e inclinado.',
      'Baja el pecho hasta rozar el borde del banco con los codos a 45°.',
      'Empuja el banco hasta estirar los brazos con el cuerpo en línea.',
    ],
    tip: 'Cuanto más alto el apoyo de las manos, más fácil: baja la altura semana a semana hasta llegar al piso.',
  },
  'FLEXIONES DIAMANTE': {
    family: 'pushUp',
    steps: [
      'Junta las manos debajo del pecho formando un rombo con los pulgares y los índices.',
      'Estira las piernas y alinea el cuerpo de la cabeza a los talones.',
      'Baja con los codos pegados al cuerpo hasta que el pecho roce las manos.',
      'Empuja hasta estirar los brazos sin que los codos se abran.',
    ],
    tip: 'El agarre cerrado carga mucho el tríceps: si molestan las muñecas, separa un poco las manos.',
  },
  'FLEXIONES ARQUERAS': {
    family: 'pushUp',
    steps: [
      'Apoya las manos muy separadas, casi al doble del ancho de los hombros, con las piernas estiradas.',
      'Baja llevando el pecho hacia una de las manos: ese codo se flexiona y el otro brazo queda casi estirado.',
      'Empuja con el brazo flexionado hasta volver al centro.',
      'Repite hacia el otro lado.',
    ],
    tip: 'Es el paso intermedio hacia la flexión a un brazo: el brazo estirado solo ayuda a equilibrar.',
  },
  'FLEXIONES PLIOMETRICAS': {
    family: 'pushUp',
    steps: [
      'Colócate en posición de flexión con las manos debajo de los hombros.',
      'Baja controlado hasta casi tocar el piso.',
      'Empuja con toda la fuerza posible hasta que las manos se despeguen del piso (puedes dar una palmada).',
      'Aterriza con los codos suaves y encadena la siguiente repetición.',
    ],
    tip: 'Son de potencia: series cortas de 3–6 repeticiones con descanso completo, al principio de la sesión.',
  },
  'FLEXIONES SPIDERMAN': {
    family: 'pushUp',
    steps: [
      'Colócate en posición de flexión con las manos un poco más abiertas que los hombros.',
      'Mientras bajas el pecho, lleva una rodilla hacia afuera hasta tocar el codo del mismo lado.',
      'Empuja hasta estirar los brazos y devuelve la pierna atrás.',
      'Alterna el lado en cada repetición.',
    ],
    tip: 'Suma trabajo de oblicuos y flexores de cadera: mantén la cadera baja mientras la rodilla avanza.',
  },
  'FLEXIONES EN ANILLAS': {
    family: 'pushUp',
    steps: [
      'Baja las anillas a unos centímetros del piso y tómalas con las palmas enfrentadas.',
      'Estira el cuerpo en plancha con los brazos rectos y las anillas pegadas a los costados del pecho.',
      'Baja hasta que las manos queden a la altura del pecho, sin dejar que las anillas se abran.',
      'Empuja hasta estirar los brazos y, arriba, gira las palmas hacia afuera.',
    ],
    tip: 'La inestabilidad obliga a trabajar más el pecho y el core: domina antes 20 flexiones en el piso.',
  },
  'FLEXIONES PSEUDO PLANCHA': {
    family: 'pushUp',
    steps: [
      'Apoya las manos a la altura de la cintura, con los dedos apuntando hacia afuera o hacia atrás.',
      'Inclina el cuerpo hacia adelante hasta que los hombros queden por delante de las manos; brazos estirados.',
      'Baja manteniendo esa inclinación hasta acercar el pecho al piso.',
      'Empuja hasta estirar los brazos sin retroceder los hombros.',
    ],
    tip: 'Prepara muñecas y hombros para la plancha de calistenia: progresa adelantando los hombros de a poco.',
    mistake: 'Hacerlas sin entrar en calor las muñecas: la carga sobre ellas es muy alta.',
  },
  'FLEXIONES SOBRE LOS DEDOS': {
    family: 'pushUp',
    steps: [
      'Apoya en el piso solo las yemas de los cinco dedos de cada mano, abiertos como una cúpula, debajo de los hombros.',
      'Estira las piernas y alinea el cuerpo; la palma no toca el piso.',
      'Baja el pecho controlado hasta casi tocar el piso.',
      'Empuja hasta estirar los brazos sin que los dedos se aplasten.',
    ],
    tip: 'Fortalece los dedos y el agarre: empieza apoyando las rodillas y suma repeticiones de a poco.',
  },
  'FONDOS PARA PECHO': {
    family: 'dips',
    steps: [
      'Toma las paralelas y súbete hasta quedar con los brazos estirados y los hombros bajos.',
      'Flexiona las rodillas e inclina el torso hacia adelante unos 30°.',
      'Baja abriendo apenas los codos hasta que los hombros queden un poco por debajo de los codos.',
      'Empuja hasta estirar los brazos manteniendo la inclinación.',
    ],
    tip: 'La inclinación del torso es lo que pasa el trabajo al pecho; con el torso vertical el ejercicio carga más el tríceps.',
  },
};
