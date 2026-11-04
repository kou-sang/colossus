// Textos del botón (i) de cada gráfico de Analíticas. Separados de los .jsx para editarlos sin tocar la lógica.
// Estructura: summary (qué muestra, 1-2 frases) → read (cómo leerlo, viñetas cortas) → tip → how (cálculo, plegado por defecto).
// Las cifras de referencia vienen de fuentes citadas en `sources` para que se puedan verificar.

export const CHART_INFO = Object.freeze({
  kpis: {
    title: 'Indicadores',
    summary: 'Cuatro números para ver de un vistazo cómo vas en el período elegido.',
    read: [
      'Días entrenados: tu constancia.',
      'Tonelaje por semana: cuánto peso moviste en total.',
      'Récords: cuántas veces superaste tu mejor marca.',
      'Racha: semanas seguidas sin dejar de entrenar.',
      'Si el tonelaje sube pero los récords no, estás haciendo más trabajo con el mismo peso. Sirve un tiempo, pero tarde o temprano el peso también tiene que subir.',
    ],
    tip: 'No mires el número suelto: compara el mismo rango (por ejemplo "Últimos 30 días") hoy y dentro de un mes.',
    how: [
      'Días entrenados cuenta días distintos: 10 ejercicios el mismo día valen 1.',
      'Tonelaje = series × repeticiones × kg, dividido por las semanas del rango. Lo que no tiene peso (peso corporal, cardio) no suma.',
      'Un récord es un registro que superó tu mejor 1RM estimado de ese ejercicio al momento de cargarlo.',
      'La racha cuenta semanas de lunes a domingo. La semana en curso no la corta hasta que termina.',
      'Con "Promedio de la selección", cada número se divide por la cantidad de perfiles elegidos.',
    ],
  },
  consistency: {
    title: 'Consistencia',
    summary: 'La línea sube 1 cada vez que registras un ejercicio. Muestra con qué regularidad entrenas.',
    read: [
      'Subida empinada: entrenas seguido.',
      'Tramo plano: días sin entrenar.',
      'Una línea pareja vale más que escalones grandes con pausas largas en el medio.',
      'Las estrellas son récords. Si caen en tramos empinados, la constancia está dando resultado.',
      'Al comparar perfiles, mira la inclinación de las últimas semanas, no solo dónde termina cada línea.',
    ],
    tip: 'Filtra una categoría (por ejemplo Piernas) para ver si la entrenas con la misma regularidad que el resto.',
    how: [
      'Toma los ejercicios que pasan los filtros y los ordena por fecha y hora. La línea arranca en 0 al inicio del rango.',
      'Con "Unificar ejercicios del día", cada día es un solo punto. Sin eso, cada ejercicio es un punto a su hora.',
      'La curva se suaviza entre puntos para que se lea la tendencia; los valores exactos están en los puntos.',
    ],
  },
  muscleMapRecency: {
    title: 'Mapa muscular: Recuperación',
    summary: 'Cuánta fatiga le queda hoy a cada músculo según lo que entrenaste en los últimos días.',
    read: [
      'Verde: recuperado, listo para entrenarlo fuerte.',
      'Amarillo: todavía se está recuperando; se puede entrenar, mejor con menos volumen.',
      'Naranja o rojo: fatigado. Entrenarlo fuerte hoy rinde menos y suma riesgo.',
      'Es una estimación: si te sientes agotado aunque el mapa diga verde, hazle caso a tu cuerpo (sueño, estrés y alimentación también cuentan).',
    ],
    tip: 'Toca un músculo para ver cuándo se recupera y con qué ejercicios lo cargaste.',
    how: [
      'Cada serie cuenta entera para los músculos principales del ejercicio y media para los que ayudan (sinergistas); los que solo estabilizan suman poco. Ejemplo: 3 series de press banca = 3 series de pecho medio y 1,5 de deltoides anterior y tríceps.',
      'Cada serie suma fatiga según el esfuerzo (al fallo cansa más que con 4 repeticiones en reserva) y se va disipando: la mitad cada ~36 h en músculos grandes (cuádriceps, glúteos, pecho, dorsales), ~30 h en medianos y ~24 h en chicos. Una sesión exigente suele necesitar 2 a 4 días.',
      'Con mucho volumen en la semana (más de 20 series efectivas) la recuperación se hace más lenta, hasta el doble.',
      '100 % = una sesión muy exigente para ese músculo (6 series efectivas en grandes, 5 en medianos, 4 en chicos). "Recuperado" es menos de 20 %.',
      'Usa los últimos 10 días de registros, aunque el rango elegido sea más corto.',
    ],
    sources: [
      'Raastad y cols. (2004): recuperación de la fuerza tras entrenamiento pesado de piernas (≈ 72 h o más).',
      'Pareja-Blanco y cols. (2017): fatiga y recuperación según cercanía al fallo.',
    ],
  },
  muscleMapStimulus: {
    title: 'Mapa muscular: Estímulo',
    summary: 'Cada músculo se pinta según cuántas series efectivas por semana recibe en promedio.',
    read: [
      'Entre 10 y 20 series por semana es el rango que más se asocia con ganar músculo.',
      'Menos de 6 suele alcanzar para mantener, no para crecer.',
      'Más de 20 puede costar recuperarse: mira el mapa de Recuperación.',
    ],
    tip: 'Busca un mapa parejo. Si el frente está mucho más verde que la espalda (o al revés), equilibra empujes y tirones.',
    how: [
      'Cada serie cuenta entera para los músculos principales del ejercicio y media para los que ayudan (sinergistas); los que solo estabilizan suman poco. Ejemplo: 3 series de press banca = 3 series de pecho medio y 1,5 de deltoides anterior y tríceps.',
      'Se suma el rango y se divide por las semanas. Si empezaste a registrar después del inicio del rango, se cuenta desde tu primer registro (no se promedian semanas en las que todavía no usabas la app).',
      'Escalones de color: 0, menos de 3, 3–6, 6–10, 10–20 y más de 20 series por semana.',
      'Toca un músculo para ver sus series semanales y qué ejercicios lo trabajaron en el rango.',
    ],
    sources: [
      'Schoenfeld y cols. (2017), J Sports Sci: relación dosis-respuesta entre series semanales e hipertrofia.',
      'Pelland y cols. (2024): conteo fraccional de series (directas = 1, indirectas = 0,5).',
    ],
  },
  muscleRecoveryDetail: {
    title: 'Recuperación del músculo',
    summary: 'Cuánta fatiga le queda, cuándo estará recuperado y qué sesiones la generaron.',
    read: [
      'Arriba: el estado de hoy y en cuánto tiempo baja a "Recuperado".',
      'La lista muestra cada vez que lo entrenaste, lo más reciente primero.',
      'El % es la participación del músculo en ese ejercicio según su ficha; series ef. = series del registro contadas para este músculo (enteras si es principal, media si ayuda).',
    ],
    tip: 'Si sigue fatigado y hoy toca, baja el volumen o elige ejercicios que lo carguen menos.',
    how: [
      'Usa los mismos filtros de perfiles, músculos y categorías, pero no el rango de fechas.',
      'El historial lista ejercicios donde el músculo participa con al menos 15 % (5 % para manos y pies).',
    ],
  },
  muscleDetail: {
    title: 'Detalle del músculo',
    summary: 'Series semanales de este músculo y qué ejercicios las aportan.',
    read: [
      'Barras parejas dentro de la franja verde: estímulo sostenido.',
      'Semanas en cero entre semanas altas: ese músculo depende de un solo día de tu rutina.',
    ],
    tip: 'Si un solo ejercicio aporta más del 70%, suma una variante con otro ángulo para trabajarlo más completo.',
    how: [
      'Semanas de lunes a domingo, con todos los filtros aplicados.',
      'La primera semana puede estar incompleta si el rango empieza a mitad de semana, y la última está en curso.',
    ],
  },
  strength: {
    title: 'Progresión de fuerza',
    summary: 'Cuánto ganaste de fuerza en los músculos y categorías elegidos (o en un ejercicio puntual): tu 1RM estimado en el tiempo.',
    read: [
      'Si la tendencia sube, estás ganando fuerza, aunque haya días peores.',
      'Si lleva 3–4 semanas plana, cambia algo: más series, otro rango de repeticiones o una semana más liviana.',
      'Una caída suelta casi siempre es cansancio o mal descanso, no fuerza perdida.',
      'El punto con anillo es un récord.',
    ],
    tip: 'La estimación es más precisa entre 3 y 8 repeticiones. Registra al menos una serie pesada en ese rango.',
    how: [
      'Fórmula de Epley: kg × (1 + repeticiones ÷ 30). Pasadas las 12 repeticiones se usa 12 porque la fórmula pierde precisión.',
      'Así se comparan series distintas: 80 kg × 5 y 70 kg × 10 dan casi lo mismo (≈ 93 kg).',
      'Promedio de la selección: cada ejercicio se mide como % de cambio respecto de su primer registro del rango (así 100 kg de banca y 20 kg de curl pesan igual) y se promedian. Cada ejercicio mantiene su último valor hasta que lo vuelves a hacer.',
      'Si elegiste músculos en el filtro, cada ejercicio pesa según cuánto trabaja esos músculos (una sentadilla pesa más que un hip thrust si elegiste cuádriceps).',
      'Elige un ejercicio en el selector para ver su 1RM estimado en kg.',
      'Con "Unificar ejercicios del día" se grafica el mejor valor de cada día.',
      'El eje es tiempo real: dos semanas sin entrenar ocupan más espacio que dos días.',
    ],
    sources: ['Epley B. (1985), Poundage Chart. Boyd Epley Workout.'],
  },
  weeklyVolume: {
    title: 'Tonelaje semanal',
    summary: 'Todo el peso que moviste cada semana (series × repeticiones × kg).',
    read: [
      'Subir de a poco es progresar bien.',
      'Los saltos bruscos aumentan el riesgo de sobrecarga.',
      'Las caídas grandes suelen ser semanas de descanso o de viaje.',
      'No distingue intensidad: muchas repeticiones livianas pueden igualar pocas pesadas. Míralo junto con Progresión de fuerza.',
    ],
    tip: 'Cada 4–6 semanas de subida, una semana con más o menos la mitad del tonelaje ayuda a recuperarte.',
    how: [
      'Semanas de lunes a domingo. Lo que no tiene peso o repeticiones (peso corporal, cardio) no suma.',
      'La primera y la última semana pueden estar incompletas: no las compares con semanas enteras.',
    ],
  },
  energy: {
    title: 'Calorías y alimentación',
    summary: 'Cuánto gastas al entrenar, cuánto comer para tu objetivo y cómo repartirlo en proteína, grasas y carbohidratos.',
    read: [
      'Son estimaciones con un margen de ±20%. Tómalas como punto de partida.',
      'Pésate cada semana: si en 3 semanas el peso no va hacia tu objetivo, ajusta 150–200 kcal.',
    ],
    tip: 'Reparte la proteína en 3–5 comidas (unos 0,3–0,4 g por kg cada una) en vez de concentrarla en una sola.',
    how: [
      'Gasto de cada ejercicio = MET × peso × horas. Ejemplos de MET: pesas 5, correr 9,8, bici 7,5, yoga 2,5.',
      'Duración estimada: en fuerza ≈ 2,5 min por serie (contando descanso); en cardio, deportes y baile las repeticiones se toman como minutos.',
      'Metabolismo basal con la ecuación de Mifflin-St Jeor (peso, altura, edad y sexo).',
      'Mantenimiento = basal × actividad diaria + gasto promedio registrado. Bajar grasa resta 20% (máx. 600 kcal); ganar músculo suma 10% (máx. 350 kcal).',
      'Proteína 1,6–2,4 g/kg según objetivo, grasas al menos 0,8 g/kg o 25% de las calorías, y el resto carbohidratos.',
    ],
    sources: [
      'Ainsworth y cols. (2011), Compendium of Physical Activities.',
      'Mifflin y cols. (1990), Am J Clin Nutr.',
      'Jäger y cols. (2017), posición de la ISSN sobre proteína y ejercicio.',
    ],
  },
  monthly: {
    title: 'Resumen del mes',
    summary: 'Tus últimos 30 días contra los 30 anteriores, con 2 o 3 cosas concretas para mejorar.',
    read: [
      'Estancado: el ejercicio subió menos de 2% en el mes, con al menos 3 sesiones.',
      'Para destrabarlo: primero suma repeticiones hasta unas 12 y recién ahí sube el peso un 2,5–5%.',
      'Si tus series quedan lejos del fallo (RIR 3 o más), acércate más antes de subir peso.',
      'Una baja de más del 5% suele ser cansancio acumulado, no fuerza perdida.',
    ],
    tip: 'Elige 2 o 3 recomendaciones por mes, no todas a la vez. Los cambios chicos y sostenidos son los que se notan.',
    how: [
      'Compara días entrenados, ejercicios, series, tonelaje, récords y minutos de cardio.',
      'La progresión usa el mejor 1RM estimado de cada sesión de cada ejercicio con peso.',
      'Las recomendaciones aparecen si entrenas menos de 2,5 días por semana, si un grupo recibe menos de 6 o más de 22 series semanales, si el core tiene menos de 3, si haces menos de 150 min de cardio por semana, si empujas mucho más de lo que tiras, o si un ejercicio está estancado o bajando.',
    ],
    sources: ['OMS (2020): 150–300 min semanales de actividad aeróbica moderada.'],
  },
});
