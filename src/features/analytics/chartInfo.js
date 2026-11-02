// Textos del botón (i) de cada gráfico de Analíticas. Separados de los .jsx para editarlos sin tocar la lógica.

export const CHART_INFO = Object.freeze({
  kpis: {
    title: 'Indicadores',
    how: [
      'Días entrenados: cantidad de días distintos con al menos un ejercicio registrado dentro del rango (registrar 10 ejercicios el mismo día cuenta como 1 día).',
      'Tonelaje por semana: suma de series × repeticiones × kg de cada registro, dividida por las semanas del rango. Los registros sin peso o sin repeticiones (peso corporal, cardio) no suman.',
      'Récords: registros que superaron tu mejor 1RM estimado de ese ejercicio en el momento de cargarlos.',
      'Racha: semanas seguidas (lunes a domingo) con al menos un entrenamiento. La semana en curso no la corta hasta que termina.',
      'Con "Promedio de la selección", cada indicador se divide por la cantidad de perfiles elegidos.',
    ],
    read: [
      'Los días entrenados miden constancia; el tonelaje mide carga total; los récords miden progreso de fuerza.',
      'Subir tonelaje sin sumar récords suele indicar más volumen con el mismo peso: está bien en fases de volumen, pero a la larga el peso también debería subir.',
    ],
    tip: 'Compara rangos iguales (por ejemplo "Últimos 30 días" hoy contra dentro de un mes) en vez de mirar el número aislado.',
  },
  consistency: {
    title: 'Consistencia',
    how: [
      'Toma los ejercicios que pasan los filtros (perfiles, fechas, categorías y músculos) y los ordena por fecha y hora.',
      'Cada ejercicio registrado suma 1 al total acumulado: la línea empieza en 0 al inicio del rango y termina en el total de ejercicios del período.',
      'Con "Unificar ejercicios del día" activado, cada día es un solo punto (ubicado a la hora del último ejercicio de ese día). Desactivado, cada ejercicio es un punto con su hora y minuto.',
      'La estrella marca los días (o ejercicios) en los que hubo un récord personal de 1RM estimado.',
      'La línea se suaviza entre puntos para leer la tendencia; los valores exactos están en los puntos.',
    ],
    read: [
      'Pendiente pronunciada = entrenamiento frecuente. Tramo plano = días sin entrenar.',
      'Una línea recta y pareja es más valiosa que escalones grandes separados por mesetas largas: la constancia es lo que más se relaciona con el progreso.',
      'Al comparar perfiles, mira la inclinación en las últimas semanas, no solo dónde termina cada línea.',
      'Si las estrellas aparecen en tramos de mucha pendiente, la constancia te está dando resultados.',
    ],
    tip: 'Filtra por una categoría (por ejemplo Piernas) para ver si entrenas ese grupo con la misma regularidad que el resto.',
  },
  muscleMapRecency: {
    title: 'Mapa muscular: Recuperación',
    how: [
      'Para cada músculo busca el último ejercicio que lo trabajó al menos un 15% (según el porcentaje de estímulo del ejercicio en la biblioteca).',
      'Pinta el músculo según los días transcurridos desde entonces: verde = hoy, amarillo ≈ 14 días, rojo = 30 días o más (o nunca).',
      'Siempre usa como mínimo los últimos 30 días de historia, aunque el rango elegido sea más corto, para no marcar como "nunca" algo entrenado hace 10 días.',
    ],
    read: [
      'Verde intenso: entrenado hace muy poco; probablemente todavía se está recuperando.',
      'Amarillo/naranja: buena ventana para volver a entrenarlo.',
      'Rojo: músculo descuidado. Si se repite semana a semana, falta un ejercicio para él en tu rutina.',
    ],
    tip: 'Toca un músculo rojo para ver qué ejercicios lo trabajaron por última vez y busca alternativas en la pestaña Ejercicios.',
  },
  muscleMapStimulus: {
    title: 'Mapa muscular: Estímulo',
    how: [
      'Cada serie se reparte entre los músculos según el porcentaje del ejercicio. Ejemplo: 3 series de press banca (40% pecho medio) suman 1,2 series efectivas al pecho medio.',
      'Se suman todas las series efectivas del rango y se dividen por la cantidad de semanas: el resultado es el promedio semanal.',
      'El color va por escalones: sin estímulo, menos de 3, 3–6, 6–10, 10–20 y más de 20 series efectivas por semana.',
    ],
    read: [
      'La franja de 10–20 series semanales por músculo es el rango orientativo para ganar masa muscular en la mayoría de las personas.',
      'Por debajo de 6 suele alcanzar para mantener, no para crecer.',
      'Muy por encima de 20 puede costar recuperarse, salvo que tengas mucha experiencia.',
    ],
    tip: 'Busca un mapa parejo: si un lado (frente o espalda) está mucho más verde que el otro, equilibra empujes y tirones.',
  },
  muscleSets: {
    title: 'Series efectivas por músculo',
    how: [
      'Es el mismo cálculo del mapa en modo Estímulo, pero en barras: series × porcentaje de participación de cada músculo, promediado por semana.',
      'Solo muestra los músculos que pasan el filtro de músculos individuales.',
      'Con "Promedio de la selección" se divide por la cantidad de perfiles elegidos.',
    ],
    read: [
      'La franja verde marca 10–20 series semanales. Barras dentro de la franja: volumen adecuado para crecer.',
      'Barras cortas en músculos grandes (dorsal, glúteo mayor, cuádriceps) suelen ser la mayor oportunidad de mejora.',
      'Los músculos pequeños (braquial, manguito rotador, tibial) reciben mucho trabajo indirecto; es normal que queden bajos.',
    ],
    tip: 'Toca una barra para abrir el detalle semanal de ese músculo y ver qué ejercicios le aportan.',
  },
  muscleDetail: {
    title: 'Detalle del músculo',
    how: [
      'Series efectivas del músculo semana a semana (lunes a domingo), por perfil, con todos los filtros aplicados.',
      'La primera semana puede quedar incompleta si el rango empieza a mitad de semana, y la última está en curso.',
      'La lista de ejercicios muestra cuántas series efectivas aportó cada uno al músculo y qué porcentaje del total representan.',
    ],
    read: [
      'Barras estables dentro de la franja verde = estímulo sostenido.',
      'Semanas en cero entre semanas altas indican que ese músculo depende de un solo día de la rutina.',
    ],
    tip: 'Si un único ejercicio aporta más del 70%, suma una variante con otro ángulo para trabajar el músculo de forma más completa.',
  },
  strength: {
    title: 'Progresión de fuerza',
    how: [
      'Para cada registro con peso calcula el 1RM estimado (fórmula de Epley): kg × (1 + repeticiones ÷ 30). Por encima de 12 repeticiones se usa 12, porque la fórmula pierde precisión.',
      'Así 80 kg × 5 y 70 kg × 10 se comparan en una misma escala (≈ 93 kg y ≈ 93 kg).',
      'Con "Unificar ejercicios del día" se grafica el mejor valor de cada día; desactivado, cada registro con su hora.',
      'El punto con anillo marca un récord personal en el momento en que se registró.',
      'El eje X es tiempo real: dos semanas sin entrenar ocupan más espacio que dos días.',
    ],
    read: [
      'Una tendencia ascendente sostenida es progreso real de fuerza, aunque haya días peores.',
      'Una meseta de 3–4 semanas sugiere cambiar el estímulo: más series, otro rango de repeticiones o una semana de descarga.',
      'Las caídas puntuales suelen deberse a cansancio o mal descanso, no a pérdida de fuerza.',
    ],
    tip: 'El 1RM estimado es más fiable entre 3 y 8 repeticiones. Para seguir tu fuerza, registra al menos una serie pesada en ese rango.',
  },
  weeklyVolume: {
    title: 'Tonelaje semanal',
    how: [
      'Suma series × repeticiones × kg de todos los ejercicios que pasan los filtros, agrupados por semana (lunes a domingo).',
      'Los registros sin peso o sin repeticiones no suman (peso corporal, cardio, baile).',
      'La primera semana puede estar incompleta si el rango empieza a mitad de semana, y la última está en curso: no las compares con semanas completas.',
    ],
    read: [
      'Un aumento gradual (5–10% por semana) es una progresión sana.',
      'Saltos bruscos aumentan el riesgo de sobrecarga; caídas grandes suelen coincidir con semanas de descanso o viajes.',
      'El tonelaje no distingue intensidad: 100 repeticiones livianas pueden igualar a 20 pesadas. Combínalo con Progresión de fuerza.',
    ],
    tip: 'Planifica una semana de descarga (alrededor de la mitad del tonelaje) cada 4–6 semanas de subida.',
  },
  fatigue: {
    title: 'Mapa de fatiga muscular',
    how: [
      'Cada registro de los últimos 7 días aporta "series efectivas" a cada músculo (series × porcentaje de participación del ejercicio).',
      'Ese aporte se disipa con el tiempo: la mitad cada ~30 h en músculos grandes (cuádriceps, glúteos, dorsales, pecho), ~24 h en medianos y ~18 h en chicos (antebrazos, gemelos).',
      '100% equivale a una sesión exigente completa para ese músculo: ≈4 series efectivas en músculos grandes (cada cabeza del cuádriceps, pectoral, dorsal), 3,5 en medianos y 3 en chicos.',
      'El tiempo de recuperación es lo que falta para bajar del 25% con el mismo ritmo de disipación.',
    ],
    read: [
      'Verde: músculo fresco, listo para una sesión fuerte.',
      'Amarillo/naranja: todavía se está recuperando; sirve para trabajo liviano o técnico.',
      'Rojo: fatiga alta; entrenarlo hoy rinde menos y aumenta el riesgo de sobrecarga.',
      'Es un modelo orientativo: no sabe cuán cerca del fallo llegaste, ni cómo dormiste o comiste.',
    ],
    tip: 'Organiza la semana para que cada músculo vuelva a verde antes de su próxima sesión intensa (en general 48–72 h).',
  },
  energy: {
    title: 'Calorías y alimentación',
    how: [
      'Calorías de cada ejercicio = MET × peso corporal × horas (Compendium of Physical Activities). Ejemplos de MET: pesas 5, correr 9,8, bici 7,5, yoga 2,5.',
      'La duración se estima: en fuerza ≈ 2,5 minutos por serie (trabajo + descanso); en cardio, deportes y baile se usan las repeticiones como minutos.',
      'El metabolismo basal usa la ecuación de Mifflin-St Jeor (peso, altura, edad y sexo).',
      'Mantenimiento = basal × actividad diaria fuera del gimnasio + promedio diario del gasto registrado. El objetivo aplica −20% (bajar grasa, máx. 600 kcal) o +10% (ganar músculo, máx. 350 kcal).',
      'Proteína según objetivo (1,6–2,4 g/kg), grasas ≥ 0,8 g/kg o 25% de las calorías y el resto carbohidratos.',
    ],
    read: [
      'Son estimaciones con un margen de error de ±20%: úsalas como punto de partida y ajusta según tu peso semanal.',
      'Si en 3 semanas el peso no se mueve en la dirección del objetivo, ajusta 150–200 kcal.',
    ],
    tip: 'La proteína repartida en 3–5 comidas (0,3–0,4 g/kg cada una) aprovecha mejor la síntesis muscular que concentrarla en una.',
  },
  monthly: {
    title: 'Resumen del mes',
    how: [
      'Compara los últimos 30 días con los 30 anteriores: días entrenados, ejercicios, series, tonelaje, récords y minutos de cardio.',
      'La progresión de cargas toma la mejor serie (1RM estimado) de cada sesión de cada ejercicio con peso: "estancado" = menos de +2% en el mes con 3 o más sesiones.',
      'Las recomendaciones salen de reglas: menos de 2,5 días por semana, grupos con menos de 6 series efectivas semanales o más de 22, core con menos de 3, cardio por debajo de 150 min/semana, empuje mucho mayor que tirón y ejercicios estancados o en retroceso.',
    ],
    read: [
      'Para los ejercicios estancados se aplica la doble progresión: primero sumar repeticiones hasta ~12 y recién entonces subir 2,5–5% el peso.',
      'Un retroceso del 1RM estimado de más del 5% suele indicar fatiga acumulada, no pérdida real de fuerza.',
    ],
    tip: 'Elige 2 o 3 recomendaciones por mes, no todas a la vez: los cambios chicos y sostenidos son los que se notan.',
  },
});
