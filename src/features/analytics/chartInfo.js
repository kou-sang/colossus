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
    summary: 'Cada músculo se pinta según cuántos días pasaron desde la última vez que lo entrenaste.',
    read: [
      'Verde: lo entrenaste hace poco; puede que todavía se esté recuperando.',
      'Amarillo o naranja: buen momento para volver a entrenarlo.',
      'Rojo: hace 30 días o más (o nunca). Si sigue rojo semana tras semana, a tu rutina le falta un ejercicio para ese músculo.',
    ],
    tip: 'Toca un músculo rojo para ver con qué lo trabajaste la última vez y busca alternativas en Ejercicios.',
    how: [
      'Cuenta solo ejercicios donde ese músculo participa al menos un 15% (según la ficha del ejercicio).',
      'Escala de color: verde = hoy, amarillo ≈ 14 días, rojo = 30 días o más.',
      'Siempre mira como mínimo los últimos 30 días, aunque elijas un rango más corto, para no marcar como "nunca" algo que entrenaste hace 10 días.',
    ],
  },
  muscleMapStimulus: {
    title: 'Mapa muscular: Estímulo',
    summary: 'Cada músculo se pinta según cuántas series semanales recibe en promedio.',
    read: [
      'Entre 10 y 20 series por semana es el rango que más se asocia con ganar músculo.',
      'Menos de 6 suele alcanzar para mantener, no para crecer.',
      'Bastante más de 20 puede costar recuperarse si no tienes mucha experiencia.',
    ],
    tip: 'Busca un mapa parejo. Si el frente está mucho más verde que la espalda (o al revés), equilibra empujes y tirones.',
    how: [
      'Cada serie se reparte entre los músculos según la ficha del ejercicio. Ejemplo: 3 series de press banca, con 40% de pecho medio, suman 1,2 series al pecho medio.',
      'Se suma todo el rango y se divide por la cantidad de semanas.',
      'Escalones de color: 0, menos de 3, 3–6, 6–10, 10–20 y más de 20 series por semana.',
    ],
    sources: ['Schoenfeld y cols. (2017), J Sports Sci: relación dosis-respuesta entre series semanales e hipertrofia.'],
  },
  muscleSets: {
    title: 'Series efectivas por músculo',
    summary: 'Las mismas series semanales del mapa de Estímulo, pero en barras para comparar músculos.',
    read: [
      'La franja verde marca 10–20 series por semana: barras dentro de ella van bien para crecer.',
      'Barras cortas en músculos grandes (dorsal, glúteo, cuádriceps) suelen ser la mejora más fácil.',
      'Los músculos chicos (braquial, manguito rotador, tibial) trabajan mucho de forma indirecta. Es normal que queden bajos.',
    ],
    tip: 'Toca una barra para ver semana a semana qué ejercicios le aportan a ese músculo.',
    how: [
      'Series × porcentaje de participación del músculo en cada ejercicio, promediado por semana.',
      'Solo aparecen los músculos que pasan el filtro de músculos.',
      'Con "Promedio de la selección" se divide por la cantidad de perfiles.',
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
  fatigue: {
    title: 'Mapa de fatiga muscular',
    summary: 'Una estimación de cuánto cansancio le queda a cada músculo por lo que entrenaste en los últimos 7 días.',
    read: [
      'Verde: fresco, listo para una sesión fuerte.',
      'Amarillo o naranja: todavía recuperándose; sirve para trabajo liviano o técnica.',
      'Rojo: muy cargado. Entrenarlo fuerte hoy rinde menos.',
      'Es orientativo: no sabe cómo dormiste ni cómo comiste, y sin RIR no sabe qué tan cerca del fallo llegaste.',
    ],
    tip: 'Organiza la semana para que cada músculo vuelva a verde antes de su próxima sesión fuerte (en general 48–72 h).',
    how: [
      'Cada registro suma series al músculo según la ficha del ejercicio, y ese cansancio baja a la mitad cada ~30 h en músculos grandes, ~24 h en medianos y ~18 h en chicos.',
      '100% equivale a una sesión exigente para ese músculo: unas 4 series en músculos grandes, 3,5 en medianos y 3 en chicos.',
      'El tiempo de recuperación es lo que falta para bajar del 25%.',
      'Si registras RIR, las series más cerca del fallo cuentan más: al fallo ×1,15, a 1 ×1,05, a 2 ×1, a 3 ×0,85 y a 4 o más ×0,7.',
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
