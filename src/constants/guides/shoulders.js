// Fichas de hombros.
export const SHOULDER_GUIDES = {
  'PRESS MILITAR': {
    family: 'ohp',
    steps: [
      'De pie, con los pies al ancho de la cadera, apoya la barra sobre la parte delantera de los hombros con agarre prono apenas más ancho que los hombros.',
      'Aprieta glúteos y abdomen; los codos quedan un poco por delante de la barra.',
      'Empuja la barra en vertical, corriendo la cabeza hacia atrás para dejarla pasar.',
      'Bloquea arriba con la barra sobre la mitad del pie y la cabeza "dentro" de los brazos; baja a los hombros.',
    ],
    tip: 'Cuando la barra pase la frente, lleva la cabeza hacia adelante: la barra termina alineada con hombros y cadera.',
  },
  'PRESS MILITAR SENTADO': {
    family: 'ohp',
    steps: [
      'Ajusta el respaldo casi vertical y siéntate con la espalda apoyada, preferentemente dentro de un rack.',
      'Toma la barra con agarre prono apenas más ancho que los hombros y bájala al frente de los hombros.',
      'Empuja en vertical hasta estirar los brazos sobre la cabeza.',
      'Baja controlado hasta la altura del mentón o la clavícula.',
    ],
    tip: 'Sentado no puedes ayudarte con las piernas: es más estricto que el de pie y suele moverse un 10–15% menos de peso.',
  },
  'PRESS MILITAR EN MULTIPOWER': {
    family: 'ohp',
    steps: [
      'Coloca un banco casi vertical dentro del multipower, de modo que la barra baje por delante de la cara.',
      'Toma la barra apenas más ancho que los hombros y destrábala girando las muñecas.',
      'Baja hasta la altura del mentón y empuja en vertical hasta estirar los brazos.',
      'Traba la barra en los ganchos al terminar.',
    ],
    tip: 'Si la barra roza la nariz, adelanta un poco el banco: la trayectoria de la guía es fija.',
  },
  'PRESS TRAS NUCA': {
    family: 'ohp',
    steps: [
      'Siéntate en un banco con respaldo y apoya la barra sobre el trapecio, detrás de la cabeza.',
      'Toma la barra con un agarre bastante más ancho que los hombros.',
      'Empuja en vertical hasta estirar los brazos.',
      'Baja solo hasta la altura de las orejas.',
    ],
    tip: 'Solo con buena movilidad de hombro y sin molestias; para la mayoría el press al frente es la mejor opción.',
    mistake: 'Bajar la barra hasta la nuca con la cabeza empujada hacia adelante.',
  },
  'PRESS Z': {
    family: 'ohp',
    steps: [
      'Siéntate en el piso con las piernas estiradas y la barra apoyada al frente de los hombros (desde un rack bajo).',
      'Mantén el tronco erguido sin apoyo de la espalda, apretando el abdomen.',
      'Empuja la barra en vertical hasta estirar los brazos.',
      'Baja controlado a los hombros.',
    ],
    tip: 'Sin respaldo ni piernas, cualquier inclinación se nota: es un gran test de movilidad de cadera y estabilidad del core.',
  },
  'PRESS DE HOMBROS CON MANCUERNAS': {
    family: 'ohp',
    steps: [
      'Siéntate en un banco con el respaldo casi vertical y apoya las mancuernas en los muslos.',
      'Súbelas a la altura de los hombros, con las palmas hacia adelante y los codos debajo de las muñecas.',
      'Empuja hacia arriba acercando las mancuernas sobre la cabeza.',
      'Baja hasta que las mancuernas queden a la altura de las orejas.',
    ],
    tip: 'Las mancuernas no tienen que chocarse arriba: deja una mano de distancia y mantén la tensión.',
  },
  'PRESS DE HOMBROS CON MANCUERNAS DE PIE': {
    family: 'ohp',
    steps: [
      'De pie, con los pies al ancho de la cadera, sostén las mancuernas a la altura de los hombros con las palmas hacia adelante.',
      'Aprieta glúteos y abdomen para no arquear la zona lumbar.',
      'Empuja las mancuernas hacia arriba hasta estirar los brazos sobre la cabeza.',
      'Baja controlado a la altura de los hombros.',
    ],
    tip: 'De pie el core trabaja más que sentado: si te arqueas para subir, baja el peso.',
  },
  'PRESS ARNOLD': {
    family: 'ohp',
    steps: [
      'Siéntate con respaldo y sostén las mancuernas frente a la cara, a la altura del mentón, con las palmas hacia ti.',
      'Mientras empujas, abre los codos y gira las muñecas hasta que las palmas miren hacia adelante.',
      'Termina con los brazos estirados sobre la cabeza.',
      'Baja invirtiendo el giro hasta volver con las palmas hacia ti.',
    ],
    tip: 'El giro suma recorrido al deltoides anterior: hazlo lento y con menos peso que el press clásico.',
  },
  'PRESS DE HOMBROS EN MAQUINA': {
    family: 'ohp',
    steps: [
      'Ajusta el asiento para que las manijas queden a la altura de los hombros.',
      'Apoya bien la espalda y toma las manijas con agarre prono.',
      'Empuja hacia arriba hasta casi estirar los brazos.',
      'Baja despacio hasta la altura de los hombros sin que la pila toque.',
    ],
    tip: 'Ideal para llegar cerca del fallo con seguridad al final de la rutina de hombros.',
  },
  'PRESS DE HOMBROS CON KETTLEBELL': {
    family: 'ohp',
    steps: [
      'Lleva la kettlebell a la posición de rack: la manija en la palma, la bola apoyada en el dorso del antebrazo y el codo pegado al cuerpo.',
      'Aprieta glúteos, abdomen y el puño libre.',
      'Empuja hacia arriba girando apenas la palma hacia adelante hasta estirar el brazo.',
      'Baja controlado a la posición de rack; termina el lado y cambia.',
    ],
    tip: 'La bola por detrás de la mano obliga a mantener la muñeca recta y estabiliza el hombro.',
  },
  'LANDMINE PRESS': {
    family: 'landmine',
    steps: [
      'Coloca un extremo de la barra en el landmine (o en una esquina) y párate frente al extremo cargado con un pie adelante.',
      'Toma la punta de la barra con una mano a la altura del hombro.',
      'Empuja la barra hacia arriba y adelante hasta estirar el brazo.',
      'Baja controlado a la altura del hombro.',
    ],
    tip: 'La trayectoria en diagonal es amable con el hombro: buena alternativa si el press vertical molesta.',
  },
  'VUELOS LATERALES': {
    family: 'lateral',
    steps: [
      'De pie, con una mancuerna en cada mano a los costados y las palmas hacia el cuerpo.',
      'Flexiona apenas los codos e inclina el torso unos grados hacia adelante.',
      'Eleva los brazos hacia los costados hasta la altura de los hombros, guiando con los codos.',
      'Baja despacio sin dejar que las mancuernas toquen los muslos.',
    ],
    tip: 'Piensa en empujar las mancuernas hacia las paredes, no hacia el techo.',
  },
  'VUELOS LATERALES SENTADO': {
    family: 'lateral',
    steps: [
      'Siéntate en la punta de un banco con la espalda recta y una mancuerna a cada lado.',
      'Con los codos apenas flexionados, eleva los brazos hacia los costados.',
      'Llega a la altura de los hombros.',
      'Baja despacio hasta los costados del banco.',
    ],
    tip: 'Sentado se elimina el impulso de las piernas: es la versión más estricta del vuelo lateral.',
  },
  'VUELOS LATERALES EN POLEA': {
    family: 'lateral',
    steps: [
      'Párate de costado a la polea baja y toma la manija con la mano más alejada; el cable cruza por delante del cuerpo.',
      'Con el codo apenas flexionado, eleva el brazo hacia el costado.',
      'Llega a la altura del hombro.',
      'Baja despacio hasta que la mano quede frente a la cadera; termina el lado y cambia.',
    ],
    tip: 'La polea da tensión desde el inicio del recorrido, donde la mancuerna casi no pesa.',
  },
  'VUELOS LATERALES EN MAQUINA': {
    family: 'lateral',
    steps: [
      'Ajusta el asiento para que los hombros queden alineados con el eje de la máquina.',
      'Apoya la parte externa de los brazos (o los codos) en las almohadillas.',
      'Eleva los codos hacia los costados hasta la altura de los hombros.',
      'Baja despacio sin que la pila de pesas toque.',
    ],
    tip: 'La máquina guía el arco y permite trabajar al fallo sin balanceo.',
  },
  'VUELO LATERAL INCLINADO': {
    family: 'lateral',
    steps: [
      'Tómate de un poste con una mano y separa los pies de él, inclinando el cuerpo hacia el lado opuesto.',
      'Con la otra mano sostén una mancuerna frente a la cadera.',
      'Eleva el brazo hacia el costado hasta la altura del hombro.',
      'Baja despacio; termina el lado y cambia.',
    ],
    tip: 'La inclinación hace que la tensión empiece desde abajo: más trabajo en la parte inicial del recorrido.',
  },
  'VUELO LATERAL ACOSTADO': {
    family: 'lateral',
    steps: [
      'Acuéstate de costado en un banco plano con la cabeza apoyada en el brazo de abajo.',
      'Sostén una mancuerna con la mano de arriba, frente a la cadera.',
      'Eleva el brazo con el codo apenas flexionado hasta que apunte al techo.',
      'Baja despacio hasta la cadera; cambia de lado.',
    ],
    tip: 'Acostado la resistencia máxima está al inicio del recorrido: complementa al vuelo de pie.',
  },
  'VUELOS ANTERIORES': {
    family: 'frontRaise',
    steps: [
      'De pie, con una mancuerna en cada mano delante de los muslos y las palmas hacia ellos.',
      'Con el codo apenas flexionado, eleva un brazo al frente hasta la altura del hombro.',
      'Bájalo despacio y eleva el otro.',
      'Mantén el torso quieto todo el tiempo.',
    ],
    tip: 'Alternar los brazos ayuda a no balancear el torso.',
  },
  'VUELOS ANTERIORES EN POLEA': {
    family: 'frontRaise',
    steps: [
      'Párate de espaldas a la polea baja y toma la manija con una mano; el cable pasa entre las piernas.',
      'Con el brazo estirado frente al muslo, eleva la mano al frente hasta la altura del hombro.',
      'Sostén un segundo.',
      'Baja despacio frente al muslo; termina el lado y cambia.',
    ],
    tip: 'El cable mantiene la tensión abajo, donde la mancuerna descansa.',
  },
  'VUELOS ANTERIORES CON DISCO': {
    family: 'frontRaise',
    steps: [
      'Sostén un disco con ambas manos por los costados (posición de las 3 y las 9), frente a los muslos.',
      'Con los brazos casi estirados, eleva el disco al frente.',
      'Súbelo hasta la altura de los ojos.',
      'Baja el disco despacio hasta la cadera.',
    ],
    tip: 'El agarre neutro del disco es más cómodo para los hombros que el prono.',
  },
  'VUELOS ANTERIORES CON BARRA': {
    family: 'frontRaise',
    steps: [
      'Sostén una barra liviana con agarre prono al ancho de los hombros, frente a los muslos.',
      'Con los brazos casi estirados, eleva la barra al frente.',
      'Eleva la barra con los brazos estirados hasta la línea de los hombros.',
      'Baja despacio sin balancear el cuerpo.',
    ],
    tip: 'Usa una barra corta o una barra W liviana: el brazo largo multiplica la carga sobre el hombro.',
  },
  'VUELOS POSTERIORES': {
    family: 'rearDelt',
    steps: [
      'De pie, flexiona las rodillas e inclina el torso casi paralelo al piso con la espalda recta.',
      'Deja colgar las mancuernas debajo de los hombros con las palmas enfrentadas.',
      'Abre los brazos hacia los costados con los codos apenas flexionados, hasta la altura de los hombros.',
      'Baja despacio sin dejar que las mancuernas se toquen abajo.',
    ],
    tip: 'Piensa en llevar las manos hacia las paredes: si juntas los omóplatos, trabaja más el trapecio.',
  },
  'VUELOS POSTERIORES SENTADO': {
    family: 'rearDelt',
    steps: [
      'Siéntate en la punta de un banco e inclina el torso hasta apoyar el pecho cerca de los muslos.',
      'Sostén las mancuernas detrás de los talones con las palmas enfrentadas.',
      'Abre los brazos hacia los costados hasta la altura de los hombros.',
      'Baja despacio hasta junto a las pantorrillas.',
    ],
    tip: 'Sentado no hay que sostener el torso con la zona lumbar: buena opción si la espalda se cansa de pie.',
  },
  'VUELOS POSTERIORES EN BANCO INCLINADO': {
    family: 'rearDelt',
    steps: [
      'Ajusta un banco a 30–45° y acuéstate boca abajo con los pies en el piso.',
      'Deja colgar las mancuernas con las palmas hacia los pies.',
      'Abre los brazos hacia los costados hasta la altura del banco.',
      'Baja despacio hasta que las mancuernas cuelguen bajo el banco.',
    ],
    tip: 'El apoyo del pecho elimina el impulso: usa mancuernas livianas y busca la contracción arriba.',
  },
  'ELEVACIONES EN Y': {
    family: 'yRaise',
    steps: [
      'Acuéstate boca abajo en un banco inclinado a 30–45° con discos o mancuernas muy livianas.',
      'Deja colgar los brazos con los pulgares hacia arriba.',
      'Eleva los brazos en diagonal, formando una Y con el cuerpo, hasta la altura de las orejas.',
      'Baja los brazos despacio sin perder la retracción de los omóplatos.',
    ],
    tip: 'Trabaja el trapecio inferior, clave para la salud del hombro: el peso debe ser mínimo.',
  },
  'PEC DECK INVERTIDO': {
    family: 'rearDelt',
    steps: [
      'Siéntate mirando hacia la máquina, con el pecho contra el respaldo y las manijas a la altura de los hombros.',
      'Toma las manijas con los brazos estirados al frente y los codos apenas flexionados.',
      'Abre los brazos hacia atrás en arco hasta alinearlos con el cuerpo.',
      'Vuelve despacio al frente.',
    ],
    tip: 'Agarre neutro o prono: el prono enfoca más el deltoides posterior.',
  },
  'CRUCE POSTERIOR EN POLEA': {
    family: 'cableRearFly',
    steps: [
      'Ubica dos poleas a la altura de los hombros y párate en el medio.',
      'Toma el cable izquierdo con la mano derecha y el derecho con la izquierda (cruzados frente al pecho).',
      'Con los codos apenas flexionados, abre los brazos hacia atrás y afuera hasta alinearlos con el cuerpo.',
      'Vuelve despacio cruzando las manos al frente.',
    ],
    tip: 'Con los cables cruzados la tensión dura todo el arco: tira con los codos, no con las manos.',
  },
  'FACE PULL': {
    family: 'facePull',
    steps: [
      'Ubica la polea a la altura de la cara con una soga y toma un extremo con cada mano (palmas enfrentadas).',
      'Da un paso atrás con los brazos estirados.',
      'Tira de la soga hacia la cara separando las manos, con los codos altos y por encima de las manos.',
      'Termina con las manos a los costados de las orejas y vuelve despacio.',
    ],
    tip: 'Al final, gira los antebrazos hacia arriba como mostrando los bíceps: suma rotación externa.',
  },
  'REMO MENTON': {
    family: 'uprightRow',
    steps: [
      'De pie, toma una barra W con agarre prono, las manos a unos 20–30 cm entre sí, frente a los muslos.',
      'Tira de la barra hacia arriba pegada al cuerpo, guiando con los codos.',
      'Sube hasta que los codos lleguen a la altura de los hombros (la barra queda a la altura del pecho).',
      'Baja la barra despacio hasta los muslos.',
    ],
    tip: 'Detente cuando los codos lleguen a la altura de los hombros: más arriba se comprime el hombro.',
  },
  'REMO MENTON EN POLEA': {
    family: 'uprightRow',
    steps: [
      'Engancha una barra recta en la polea baja y párate cerca de la columna.',
      'Toma la barra con agarre prono, un poco más angosto que los hombros.',
      'Tira hacia arriba pegado al cuerpo guiando con los codos hasta la altura de los hombros.',
      'Baja despacio sin que el cable te tire hacia adelante.',
    ],
    tip: 'El cable da una resistencia más pareja que la barra y permite ajustar el peso de a poco.',
  },
  'PRESS CUBANO': {
    family: 'cubanPress',
    steps: [
      'De pie, con mancuernas livianas, haz un remo al mentón hasta que los codos queden a la altura de los hombros.',
      'Sin bajar los codos, gira los antebrazos hacia arriba (rotación externa) hasta que queden verticales.',
      'Desde ahí, empuja las mancuernas por encima de la cabeza.',
      'Desanda el camino: baja a la posición de 90°, gira hacia abajo y baja los brazos.',
    ],
    tip: 'Es un ejercicio de movilidad y salud del hombro: el peso es muy bajo y el movimiento muy controlado.',
  },
  'ROTACION EXTERNA EN POLEA': {
    family: 'extRot',
    steps: [
      'Ubica la polea a la altura del codo y párate de costado, con el lado que trabaja lejos de la polea.',
      'Con el codo pegado al cuerpo y flexionado a 90°, toma la manija con el antebrazo frente al abdomen.',
      'Gira el antebrazo hacia afuera sin despegar el codo.',
      'Vuelve despacio con la mano hacia el ombligo sin despegar el codo.',
    ],
    tip: 'Pon una toalla enrollada entre el codo y el costado: así no se separa del cuerpo.',
  },
  'ROTACION INTERNA EN POLEA': {
    family: 'extRot',
    steps: [
      'Ubica la polea a la altura del codo y párate de costado, con el lado que trabaja cerca de la polea.',
      'Con el codo pegado al cuerpo y a 90°, toma la manija con el antebrazo apuntando hacia afuera.',
      'Gira el antebrazo hacia el abdomen sin despegar el codo.',
      'Vuelve despacio hacia afuera.',
    ],
    tip: 'Complementa a la rotación externa: un manguito rotador equilibrado protege el hombro en los empujes.',
  },
  'ROTACION EXTERNA CON MANCUERNA': {
    family: 'extRot',
    steps: [
      'Acuéstate de costado en el piso con la cabeza apoyada en el brazo de abajo.',
      'Con el brazo de arriba pegado al costado y el codo a 90°, sostén una mancuerna liviana frente al abdomen.',
      'Gira el antebrazo hacia arriba sin despegar el codo del cuerpo.',
      'Baja la mancuerna despacio hacia el abdomen; termina el lado y cambia.',
    ],
    tip: 'Acostado de costado la resistencia coincide con la rotación externa: con 1–3 kg alcanza.',
  },
  'FLEXIONES PIKE': {
    family: 'pikePushUp',
    steps: [
      'Apoya las manos en el piso al ancho de los hombros y camina los pies hacia ellas hasta formar una V invertida con la cadera alta.',
      'Con las piernas lo más estiradas posible, flexiona los codos y baja la cabeza hacia el piso, entre las manos.',
      'Lleva la cabeza un poco por delante de las manos, formando un triángulo.',
      'Empuja hasta estirar los brazos manteniendo la cadera alta.',
    ],
    tip: 'Cuanto más vertical el torso, más se parece a una flexión en vertical: sube los pies a un cajón para progresar.',
  },
  'PARADA DE MANOS': {
    family: 'hspu',
    steps: [
      'Apoya las manos al ancho de los hombros a unos 20–30 cm de la pared, con los dedos abiertos.',
      'Con los brazos estirados, impulsa una pierna y luego la otra hasta apoyar los talones en la pared.',
      'Alinea el cuerpo: costillas abajo, glúteos apretados y la mirada entre las manos.',
      'Sostén la posición respirando y baja una pierna por vez.',
    ],
    tip: 'Empuja el piso como si quisieras crecer: los hombros activos (encogidos hacia las orejas) protegen la articulación.',
  },
  'VOLANTE CON DISCO': {
    family: 'frontRaise',
    steps: [
      'De pie, sostén un disco con ambas manos por los costados y estira los brazos al frente a la altura de los hombros.',
      'Gira el disco hacia un lado como si fuera el volante de un auto, unos 90°.',
      'Vuelve al centro y gira hacia el otro lado.',
      'Mantén los brazos a la misma altura durante toda la serie.',
    ],
    tip: 'Trabaja el deltoides anterior en isometría y los rotadores al girar: series de 30–45 segundos.',
  },
};
