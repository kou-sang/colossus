// Fichas de espalda.
export const BACK_GUIDES = {
  'PESO MUERTO': {
    family: 'deadlift',
    steps: [
      'Párate con los pies al ancho de la cadera y la barra sobre la mitad del pie (a 2–3 cm de las tibias).',
      'Bisagra de cadera y toma la barra con agarre prono, las manos justo por fuera de las piernas.',
      'Baja la cadera hasta que las tibias toquen la barra, saca el pecho y deja los hombros apenas por delante de la barra.',
      'Empuja el piso con las piernas y extiende la cadera, arrastrando la barra pegada a las piernas hasta quedar erguido.',
      'Baja invirtiendo el orden: cadera atrás primero y rodillas cuando la barra pase por ellas.',
    ],
    tip: 'La barra sube en vertical sobre el medio pie: si se aleja de las piernas, la palanca sobre la zona lumbar se multiplica.',
  },
  'PESO MUERTO DEFICIT': {
    family: 'deadlift',
    steps: [
      'Súbete a un disco o plataforma de 3–7 cm con la barra sobre la mitad del pie.',
      'Toma la barra con agarre prono, por fuera de las piernas, bajando la cadera más que en el peso muerto normal.',
      'Saca el pecho y tensa la espalda: las tibias quedan más inclinadas hacia adelante.',
      'Empuja el piso y extiende cadera y rodillas hasta quedar erguido, con la barra pegada a las piernas.',
    ],
    tip: 'El déficit alarga el recorrido y fortalece la salida del piso: usa un 10–20% menos de peso que en el peso muerto convencional.',
  },
  'RACK PULL': {
    family: 'deadlift',
    steps: [
      'Ubica los seguros del rack justo debajo de las rodillas y apoya la barra cargada sobre ellos.',
      'Párate con la barra pegada a los muslos bajos y tómala con agarre prono por fuera de las piernas.',
      'Con el pecho alto y la espalda recta, extiende la cadera llevando los hombros atrás hasta quedar erguido.',
      'Devuelve la barra a los seguros con control, sin soltarla de golpe.',
    ],
    tip: 'Trabaja la parte final del peso muerto y la espalda alta con más carga: es ideal para fortalecer el bloqueo.',
  },
  'PESO MUERTO CON BARRA HEXAGONAL': {
    family: 'deadlift',
    steps: [
      'Párate dentro de la barra hexagonal con los pies al ancho de la cadera, en el centro del marco.',
      'Baja con la cadera y las rodillas y toma las manijas laterales (agarre neutro, palmas hacia el cuerpo).',
      'Con el pecho alto y los brazos estirados, empuja el piso con las piernas.',
      'Termina de pie con la cadera extendida y vuelve a bajar en el mismo camino.',
    ],
    tip: 'El peso queda alineado con el centro del cuerpo: el torso va más vertical y la espalda baja sufre menos que con la barra recta.',
  },
  'PESO MUERTO CON MANCUERNAS': {
    family: 'deadlift',
    steps: [
      'Ubica una mancuerna a cada lado de los pies y párate con los pies al ancho de la cadera.',
      'Baja con la cadera atrás y las rodillas flexionadas y toma las mancuernas con las palmas hacia el cuerpo.',
      'Con la espalda recta y los brazos estirados, empuja el piso hasta quedar de pie.',
      'Baja las mancuernas por los costados de las piernas hasta apoyarlas.',
    ],
    tip: 'Es la mejor forma de aprender el patrón sin barra: el peso a los costados es fácil de equilibrar.',
  },
  'BUENOS DIAS': {
    family: 'hinge',
    steps: [
      'Apoya la barra sobre la espalda alta, como en la sentadilla, con los pies al ancho de la cadera.',
      'Flexiona apenas las rodillas y déjalas fijas.',
      'Lleva la cadera hacia atrás inclinando el torso con la espalda recta, hasta casi la horizontal o hasta sentir el estiramiento atrás de los muslos.',
      'Vuelve a erguirte empujando la cadera hacia adelante.',
    ],
    tip: 'Empieza muy liviano: la barra queda lejos de la cadera y la palanca es enorme.',
  },
  'REMO CON BARRA': {
    family: 'bentRow',
    steps: [
      'De pie con la barra en las manos (agarre prono, un poco más ancho que los hombros), flexiona apenas las rodillas.',
      'Inclina el torso unos 45° llevando la cadera atrás; los brazos cuelgan estirados.',
      'Tira de la barra hacia el ombligo llevando los codos atrás y cerca del cuerpo.',
      'Junta los omóplatos un segundo arriba y baja controlado hasta estirar los brazos.',
    ],
    tip: 'Mantén el ángulo del torso fijo en toda la serie: si te incorporas para subir la barra, sobra peso.',
  },
  'REMO PENDLAY': {
    family: 'bentRow',
    steps: [
      'Párate con la barra en el piso sobre la mitad del pie, como en el peso muerto.',
      'Inclina el torso hasta dejarlo casi paralelo al piso y toma la barra con agarre prono, un poco más ancho que los hombros.',
      'Tira de forma explosiva hasta que la barra toque la parte baja del pecho.',
      'Devuelve la barra al piso y haz una pausa antes de la siguiente repetición.',
    ],
    tip: 'Cada repetición arranca desde cero: obliga a mantener la espalda fija y elimina el impulso.',
  },
  'REMO YATES': {
    family: 'bentRow',
    steps: [
      'Toma la barra con agarre supino (palmas hacia adelante) al ancho de los hombros.',
      'Inclina el torso solo unos 20–30° con las rodillas apenas flexionadas.',
      'Tira de la barra hacia la parte baja del abdomen llevando los codos pegados al cuerpo.',
      'Baja la barra controlando hasta casi estirar los brazos.',
    ],
    tip: 'El torso más erguido permite mover más peso y el agarre supino suma bíceps y la parte baja del dorsal.',
  },
  'REMO EN MULTIPOWER': {
    family: 'bentRow',
    steps: [
      'Baja la barra del multipower a la altura de las rodillas y párate frente a ella.',
      'Toma la barra con agarre prono, inclina el torso unos 45° y destrábala girando las muñecas.',
      'Tira hacia el ombligo con los codos cerca del cuerpo.',
      'Baja controlado y traba la barra al terminar.',
    ],
    tip: 'La guía elimina el balanceo de la barra: te puedes concentrar solo en apretar la espalda.',
  },
  'REMO EN T': {
    family: 'bentRow',
    steps: [
      'Coloca un extremo de la barra en un soporte de landmine (o en una esquina) y carga discos en el otro extremo.',
      'Párate a horcajadas de la barra, de espaldas al anclaje, y engancha el triángulo debajo de la barra junto a los discos.',
      'Con el torso a unos 45° y las rodillas flexionadas, tira del triángulo hacia el pecho bajo.',
      'Baja hasta estirar los brazos sin redondear la espalda.',
    ],
    tip: 'El agarre neutro y cerrado mantiene los codos cerca del cuerpo: gran trabajo de dorsal y espalda media.',
  },
  'REMO UNILATERAL': {
    family: 'oneArmRow',
    steps: [
      'Apoya en un banco plano la rodilla y la mano de un lado; el otro pie queda en el piso, un poco abierto.',
      'Con la espalda paralela al piso, toma la mancuerna con la mano libre (palma hacia el cuerpo) y deja el brazo colgando.',
      'Tira de la mancuerna hacia la cadera llevando el codo atrás y pegado al cuerpo.',
      'Baja hasta estirar el brazo y sentir el estiramiento del dorsal; completa las repeticiones y cambia de lado.',
    ],
    tip: 'Piensa en llevar el codo hacia el bolsillo trasero, no la mano hacia el hombro.',
  },
  'REMO KROC': {
    family: 'oneArmRow',
    steps: [
      'Apoya una mano en un banco alto o en el rack de mancuernas y da un paso atrás con la pierna del mismo lado.',
      'Toma una mancuerna pesada con la otra mano y deja el torso inclinado unos 30° sobre la horizontal.',
      'Rema con fuerza hacia la cadera; al final de la serie se acepta algo de impulso del cuerpo.',
      'Baja con control hasta estirar el brazo y repite muchas repeticiones (15–30).',
    ],
    tip: 'Usa correas si el agarre falla antes que la espalda: el objetivo es el volumen con carga alta.',
  },
  'REMO MEADOWS': {
    family: 'oneArmRow',
    steps: [
      'Ubica una barra en el landmine con discos chicos y párate perpendicular a ella, junto al extremo cargado.',
      'Adelanta la pierna más alejada de la barra y apoya ese antebrazo en el muslo.',
      'Toma la punta de la barra con agarre prono y tira hacia la cadera llevando el codo alto y atrás.',
      'Baja hasta sentir el estiramiento completo del dorsal.',
    ],
    tip: 'Los discos chicos (de 10 kg) dejan más recorrido que los grandes.',
  },
  'REMO GORILA': {
    family: 'bentRow',
    steps: [
      'Ubica dos kettlebells entre los pies, con las piernas bien abiertas.',
      'Bisagra de cadera hasta que el torso quede casi horizontal y toma una kettlebell con cada mano.',
      'Rema una kettlebell hacia la cadera mientras la otra mano empuja la otra pesa contra el piso.',
      'Baja y alterna el lado en cada repetición.',
    ],
    tip: 'Empujar la pesa de apoyo contra el piso estabiliza el tronco y suma trabajo de core.',
  },
  'REMO SEAL': {
    family: 'machineRow',
    steps: [
      'Acuéstate boca abajo en un banco alto (sobre cajones) con la barra en el piso debajo del pecho.',
      'Toma la barra con agarre prono, un poco más ancho que los hombros, con los brazos colgando.',
      'Tira hasta que la barra toque la parte de abajo del banco.',
      'Baja las pesas controlando hasta estirar los brazos debajo del banco.',
    ],
    tip: 'Sin piernas ni zona lumbar en juego, es el remo más estricto que existe.',
  },
  'REMO CON MANCUERNAS EN BANCO INCLINADO': {
    family: 'machineRow',
    steps: [
      'Ajusta un banco a 30–45° y acuéstate boca abajo con el pecho en el respaldo y los pies en el piso.',
      'Toma una mancuerna en cada mano con las palmas enfrentadas y deja los brazos colgando.',
      'Rema llevando los codos hacia atrás y cerca del torso, hasta que las mancuernas lleguen a los costados del pecho.',
      'Baja las mancuernas controlando hasta estirar los brazos.',
    ],
    tip: 'Sin carga en la zona lumbar ni posibilidad de balanceo: ideal si te molesta la espalda baja.',
  },
  'REMO CON APOYO EN PECHO': {
    family: 'machineRow',
    steps: [
      'Párate en la plataforma de la máquina de remo en T con apoyo de pecho y regula la altura del pecho en la almohadilla.',
      'Apoya el pecho y toma las manijas con agarre neutro, brazos estirados.',
      'Rema llevando los codos atrás y juntando los omóplatos, sin despegar el pecho del apoyo.',
      'Baja despacio hasta estirar los brazos.',
    ],
    tip: 'El apoyo saca a la zona lumbar del ejercicio: permite cargar pesado la espalda media.',
  },
  'REMO RENEGADO': {
    family: 'oneArmRow',
    steps: [
      'Colócate en plancha alta con las manos sobre dos mancuernas y los pies más abiertos que la cadera.',
      'Aprieta glúteos y abdomen para que la cadera no gire.',
      'Rema una mancuerna hacia la cadera mientras la otra mano empuja contra el piso.',
      'Apoya la mancuerna y repite con el otro brazo.',
    ],
    tip: 'Cuanto más abiertos los pies, más fácil mantener la cadera quieta: ciérralos a medida que progreses.',
  },
  'REMO BAJO': {
    family: 'seatedRow',
    steps: [
      'Siéntate en el banco de la polea baja con los pies en la plataforma y las rodillas apenas flexionadas.',
      'Toma el triángulo (agarre neutro y cerrado) con los brazos estirados y el torso un poco inclinado adelante.',
      'Lleva el torso a vertical y tira del triángulo hacia el ombligo con los codos pegados al cuerpo.',
      'Junta los omóplatos un segundo y vuelve estirando los brazos y dejando que los hombros se adelanten.',
    ],
    tip: 'El torso se mueve poco (de 20° adelante a vertical): si te echas atrás para tirar, baja el peso.',
  },
  'REMO BAJO AGARRE ABIERTO': {
    family: 'seatedRow',
    steps: [
      'Engancha una barra larga en la polea baja y siéntate con los pies en la plataforma.',
      'Toma la barra con agarre prono, más ancho que los hombros, y los brazos estirados.',
      'Tira hacia la parte baja del pecho con los codos abiertos, casi a la altura de los hombros.',
      'Junta los omóplatos y vuelve despacio hasta estirar los brazos.',
    ],
    tip: 'Con los codos abiertos el trabajo pasa a la espalda media y al deltoides posterior.',
  },
  'REMO UNILATERAL EN POLEA': {
    family: 'seatedRow',
    steps: [
      'Ubica la polea a la altura del abdomen y toma la manija con una mano.',
      'Da un paso atrás con el pie del mismo lado y deja el brazo estirado con el torso apenas girado hacia la polea.',
      'Rema llevando el codo atrás y girando el torso hacia el lado que tira.',
      'Vuelve dejando que el hombro se adelante y estira el brazo; cambia de lado.',
    ],
    tip: 'La rotación suma recorrido al dorsal: el estiramiento adelante es tan importante como el tirón.',
  },
  'REMO EN MAQUINA': {
    family: 'machineRow',
    steps: [
      'Ajusta el asiento para que las manijas queden a la altura del pecho y apoya el pecho en la almohadilla.',
      'Toma las manijas con los brazos estirados.',
      'Rema llevando los codos atrás hasta que las manos lleguen a los costados del pecho.',
      'Junta los omóplatos un segundo y vuelve despacio.',
    ],
    tip: 'Prueba los dos agarres: neutro (codos cerca, más dorsal) y prono (codos abiertos, más espalda media).',
  },
  'REMO ALTO EN MAQUINA': {
    family: 'machineRow',
    steps: [
      'Siéntate con el pecho contra el apoyo y toma las manijas que quedan arriba y adelante.',
      'Con los brazos estirados y los hombros arriba, empieza bajando los omóplatos.',
      'Tira hacia abajo y atrás en arco hasta que las manos lleguen a la altura del pecho.',
      'Vuelve despacio hasta estirar los brazos por encima de la cabeza.',
    ],
    tip: 'Combina el jalón y el remo: trabaja el dorsal en diagonal, ideal para la parte alta y externa.',
  },
  'JALON AL PECHO': {
    family: 'pulldown',
    steps: [
      'Ajusta el rodillo para trabar los muslos y siéntate frente a la polea alta.',
      'Toma la barra con agarre prono, bastante más ancho que los hombros, con los brazos estirados.',
      'Baja los hombros y tira de la barra hacia la parte alta del pecho, inclinando apenas el torso atrás.',
      'Vuelve despacio hasta estirar por completo los brazos.',
    ],
    tip: 'Inicia cada repetición bajando los omóplatos y recién después flexiona los codos.',
  },
  'JALON AL PECHO AGARRE CERRADO': {
    family: 'pulldown',
    steps: [
      'Engancha el triángulo en la polea alta y siéntate con los muslos trabados.',
      'Toma el triángulo con las palmas enfrentadas y los brazos estirados.',
      'Tira hacia la parte alta del pecho con los codos pegados al cuerpo, inclinando un poco el torso atrás.',
      'Vuelve hasta estirar los brazos.',
    ],
    tip: 'Con el agarre cerrado el codo baja por delante del cuerpo y el dorsal recorre más.',
  },
  'JALON AL PECHO AGARRE SUPINO': {
    family: 'pulldown',
    steps: [
      'Siéntate en el jalón con los muslos trabados y toma la barra con las palmas hacia ti, al ancho de los hombros.',
      'Con los brazos estirados, baja primero los hombros.',
      'Tira hacia la parte alta del pecho llevando los codos hacia abajo y pegados al cuerpo.',
      'Deja subir la barra despacio hasta estirar los brazos.',
    ],
    tip: 'Es el equivalente en polea de las dominadas supinas: suma bíceps y la parte baja del dorsal.',
  },
  'JALON TRAS NUCA': {
    family: 'pulldown',
    steps: [
      'Siéntate con los muslos trabados y toma la barra con un agarre muy abierto.',
      'Inclina la cabeza levemente hacia adelante.',
      'Tira de la barra por detrás de la cabeza hasta la altura de las orejas o la nuca.',
      'Vuelve despacio hasta estirar los brazos.',
    ],
    tip: 'Solo si tienes buena movilidad de hombro y ninguna molestia: la versión al pecho trabaja lo mismo con menos riesgo.',
    mistake: 'Golpear la nuca con la barra o empujar la cabeza hacia adelante para hacer lugar.',
  },
  'JALON UNILATERAL': {
    family: 'pulldown',
    steps: [
      'Engancha una manija simple en la polea alta y siéntate con los muslos trabados.',
      'Toma la manija con una mano y el brazo estirado arriba.',
      'Tira llevando el codo hacia abajo y hacia la cadera, girando apenas el torso hacia ese lado.',
      'Vuelve hasta estirar el brazo; termina las repeticiones y cambia de lado.',
    ],
    tip: 'Al trabajar un lado por vez puedes llevar el codo más atrás y corregir diferencias entre lados.',
  },
  'JALON AL PECHO EN MAQUINA': {
    family: 'pulldown',
    steps: [
      'Ajusta el asiento y el rodillo para trabar los muslos en la máquina de jalón de palancas.',
      'Toma las manijas arriba con los brazos estirados.',
      'Tira hacia abajo siguiendo el arco convergente hasta que las manos queden a la altura de los hombros.',
      'Vuelve despacio hasta estirar los brazos; puedes trabajar un brazo por vez.',
    ],
    tip: 'Las palancas independientes siguen el recorrido natural del brazo y permiten cargar más que en la polea.',
  },
  'JALON CON BRAZOS RECTOS': {
    family: 'straightArm',
    steps: [
      'Ubica la polea alta con una barra recta y párate frente a ella a un paso de distancia.',
      'Toma la barra con agarre prono, inclina el torso unos 30° y deja los brazos estirados por delante de la cabeza.',
      'Con los codos apenas flexionados y fijos, baja la barra en arco hasta los muslos.',
      'Vuelve despacio hasta que los brazos queden a la altura de la cabeza.',
    ],
    tip: 'Aísla el dorsal sin bíceps: es ideal como pre-agotamiento antes de las dominadas o los jalones.',
  },
  DOMINADAS: {
    family: 'pullUp',
    steps: [
      'Cuélgate de la barra con agarre prono, un poco más ancho que los hombros, y los brazos estirados.',
      'Baja los hombros (aleja las orejas de los hombros) antes de flexionar los codos.',
      'Tira llevando el pecho hacia la barra hasta que el mentón la supere.',
      'Baja controlado hasta estirar por completo los brazos.',
    ],
    tip: 'Piensa en llevar los codos hacia los bolsillos traseros.',
  },
  'DOMINADAS SUPINAS': {
    family: 'pullUp',
    steps: [
      'Cuélgate de la barra con las palmas hacia ti, al ancho de los hombros.',
      'Baja los hombros y aprieta el abdomen para no balancearte.',
      'Tira hasta que el mentón supere la barra, con los codos hacia adelante y abajo.',
      'Baja controlado hasta estirar los brazos.',
    ],
    tip: 'Suelen salir más fácil que las pronas porque el bíceps colabora más.',
  },
  'DOMINADAS AGARRE NEUTRO': {
    family: 'pullUp',
    steps: [
      'Cuélgate de las manijas paralelas con las palmas enfrentadas.',
      'Baja los hombros y cruza los pies para estabilizar el cuerpo.',
      'Tira hasta que el mentón quede a la altura de las manos.',
      'Baja hasta estirar los brazos.',
    ],
    tip: 'El agarre neutro es el más amable con los hombros y los codos: buena opción si las pronas molestan.',
  },
  'DOMINADAS ASISTIDAS': {
    family: 'pullUp',
    steps: [
      'Elige el contrapeso en la máquina: cuanto más peso, más ayuda.',
      'Apoya las rodillas en la plataforma y toma las manijas de arriba con agarre prono.',
      'Tira hasta que el mentón supere las manijas.',
      'Baja controlado hasta estirar los brazos sin que la máquina te empuje de golpe.',
    ],
    tip: 'Reduce la asistencia de a poco cada semana hasta poder hacer dominadas sin ayuda.',
  },
  'DOMINADAS CON BANDA': {
    family: 'pullUp',
    steps: [
      'Pasa una banda elástica por la barra y engánchala en una rodilla (o en los pies).',
      'Cuélgate con agarre prono, un poco más ancho que los hombros.',
      'Tira hasta que el mentón supere la barra; la banda ayuda más abajo, donde cuesta más.',
      'Baja controlado sin que la banda te dispare hacia arriba.',
    ],
    tip: 'Usa bandas cada vez más finas: es la progresión clásica hacia la primera dominada estricta.',
  },
  'DOMINADAS LASTRADAS': {
    family: 'pullUp',
    steps: [
      'Ajusta un cinturón de lastre con un disco o una mancuerna colgando entre las piernas.',
      'Cuélgate de la barra con agarre prono y los brazos estirados.',
      'Tira hasta que el mentón supere la barra sin balancear las piernas.',
      'Baja controlado con el lastre quieto hasta estirar los brazos.',
    ],
    tip: 'Suma lastre cuando puedas hacer 3 series de 8–10 dominadas estrictas.',
  },
  'DOMINADAS ARQUERAS': {
    family: 'pullUp',
    steps: [
      'Cuélgate de la barra con un agarre muy abierto.',
      'Tira llevando el cuerpo hacia una de las manos: ese codo se flexiona y el otro brazo queda casi estirado.',
      'Llega con el mentón junto a la mano que tira.',
      'Baja al centro y repite hacia el otro lado.',
    ],
    tip: 'Es el paso intermedio hacia la dominada a un brazo: el brazo estirado solo ayuda.',
  },
  'DOMINADAS ESCAPULARES': {
    family: 'pullUp',
    steps: [
      'Cuélgate de la barra con los brazos estirados y los hombros relajados cerca de las orejas.',
      'Sin flexionar los codos, baja los omóplatos y júntalos: el cuerpo sube unos centímetros.',
      'Sostén un segundo con los omóplatos hundidos.',
      'Vuelve a relajar los hombros despacio.',
    ],
    tip: 'Es la base de toda dominada: enseña a iniciar el tirón con la espalda y protege el hombro.',
  },
  'FRONT LEVER': {
    family: 'frontLever',
    steps: [
      'Cuélgate de la barra con agarre prono al ancho de los hombros y los brazos estirados.',
      'Baja los hombros y empuja la barra hacia las caderas con los brazos rectos.',
      'Lleva el cuerpo a la horizontal, primero con las rodillas al pecho (tuck) y luego estirando las piernas.',
      'Sostén la posición con el cuerpo recto y los brazos estirados.',
    ],
    tip: 'Progresa por etapas: tuck, tuck avanzado, una pierna y completo; sostén 5–10 segundos por intento.',
  },
  'REMO INVERTIDO': {
    family: 'invertedRow',
    steps: [
      'Ubica una barra en el rack a la altura de la cadera y acuéstate debajo, tomándola con agarre prono.',
      'Estira el cuerpo con los talones en el piso, formando una línea de los talones a los hombros.',
      'Tira hasta que el pecho toque la barra, juntando los omóplatos.',
      'Baja hasta estirar los brazos sin que la cadera se hunda.',
    ],
    tip: 'Cuanto más horizontal el cuerpo, más difícil: baja la barra o eleva los pies para progresar.',
  },
  HIPEREXTENSIONES: {
    family: 'hyperextension',
    steps: [
      'Regula el banco romano de 45° para que la almohadilla quede justo debajo de la cadera y traba los tobillos.',
      'Cruza los brazos sobre el pecho y deja el torso alineado con las piernas.',
      'Baja flexionando la cadera con la espalda recta hasta casi la vertical.',
      'Sube hasta que el cuerpo vuelva a formar una línea recta, sin arquear la zona lumbar.',
    ],
    tip: 'Para más glúteo: pies en V, espalda alta apenas redondeada y extensión desde la cadera.',
  },
  'HIPEREXTENSIONES A 90 GRADOS': {
    family: 'hyperextension',
    steps: [
      'Acuéstate boca abajo en el GHD o banco horizontal con la cadera sobre la almohadilla y los tobillos trabados.',
      'Cruza los brazos sobre el pecho y deja colgar el torso hacia el piso.',
      'Sube extendiendo la cadera y la espalda hasta que el cuerpo quede horizontal.',
      'Baja despacio hasta la vertical.',
    ],
    tip: 'El recorrido es mayor que a 45° y la parte más dura está arriba: empieza sin peso.',
  },
  'EXTENSION LUMBAR EN MAQUINA': {
    family: 'hyperextension',
    steps: [
      'Siéntate en la máquina con el rodillo a la altura de la espalda alta y ajusta el cinturón o los apoyos de los pies.',
      'Cruza los brazos sobre el pecho y empieza con el torso inclinado hacia adelante.',
      'Empuja el rodillo hacia atrás extendiendo la espalda hasta quedar erguido o apenas reclinado.',
      'Vuelve despacio a la posición inicial.',
    ],
    tip: 'La carga se puede ajustar fino: útil para fortalecer la zona lumbar en rehabilitación o principiantes.',
  },
  SUPERMAN: {
    family: 'superman',
    steps: [
      'Acuéstate boca abajo en el piso con los brazos estirados por delante de la cabeza.',
      'Aprieta los glúteos.',
      'Eleva a la vez brazos, pecho y piernas unos centímetros del piso.',
      'Sostén 2–3 segundos y baja despacio.',
    ],
    tip: 'Mira al piso para no tensar el cuello: el movimiento es corto.',
  },
  'ENCOGIMIENTOS CON BARRA': {
    family: 'shrug',
    steps: [
      'De pie, toma la barra con agarre prono al ancho de los hombros, apoyada en los muslos.',
      'Con los brazos estirados, sube los hombros hacia las orejas.',
      'Sostén un segundo arriba.',
      'Baja despacio hasta estirar el trapecio.',
    ],
    tip: 'Sube en línea recta: girar los hombros no suma trabajo y estresa la articulación.',
  },
  'ENCOGIMIENTOS CON MANCUERNAS': {
    family: 'shrug',
    steps: [
      'De pie, sostén una mancuerna a cada lado del cuerpo con las palmas hacia adentro.',
      'Con las mancuernas a los costados y los brazos estirados, eleva los hombros en vertical hacia las orejas.',
      'Sostén un segundo arriba apretando los trapecios.',
      'Baja despacio.',
    ],
    tip: 'Las mancuernas a los costados dejan los brazos en una posición más natural que la barra.',
  },
  'ENCOGIMIENTOS EN MAQUINA': {
    family: 'shrug',
    steps: [
      'Párate entre las manijas de la máquina de encogimientos (o bajo las almohadillas de hombros).',
      'Toma las manijas a los costados con los brazos estirados.',
      'Sube los hombros hacia las orejas.',
      'Sostén y baja despacio.',
    ],
    tip: 'La máquina permite cargar mucho sin preocuparte por el agarre ni el equilibrio.',
  },
  'ENCOGIMIENTOS EN POLEA': {
    family: 'shrug',
    steps: [
      'Engancha una barra en la polea baja y párate cerca de la columna.',
      'Toma la barra con agarre prono y los brazos estirados delante de los muslos.',
      'Sube los hombros hacia las orejas contra la tensión del cable.',
      'Sostén y baja despacio, sin dejar que el cable te tire hacia adelante.',
    ],
    tip: 'El cable mantiene la tensión también abajo, donde con pesas libres el trapecio descansa.',
  },
  'ENCOGIMIENTOS TRAS LA ESPALDA': {
    family: 'shrug',
    steps: [
      'Toma la barra por detrás de los glúteos con agarre prono (palmas hacia atrás), al ancho de los hombros.',
      'Con los brazos estirados, sube los hombros hacia las orejas y levemente hacia atrás.',
      'Sostén un segundo arriba con la barra pegada a los glúteos.',
      'Baja los hombros despacio hasta el estiramiento.',
    ],
    tip: 'Con la barra detrás trabaja más el trapecio medio y los hombros quedan hacia atrás.',
  },
  'PULLOVER EN MAQUINA': {
    family: 'machinePullover',
    steps: [
      'Ajusta el asiento para que los hombros queden alineados con el eje de giro de la máquina.',
      'Apoya los codos (o la parte de atrás de los brazos) en las almohadillas y toma la barra por encima de la cabeza.',
      'Empuja con los codos hacia abajo y adelante hasta que la barra llegue al abdomen.',
      'Vuelve despacio hasta que los brazos queden por encima de la cabeza.',
    ],
    tip: 'La máquina mantiene la tensión en todo el arco y aísla el dorsal mejor que la mancuerna.',
  },
};
