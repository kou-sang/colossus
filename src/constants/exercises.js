import { CATEGORIES, LEGACY_MUSCLE_DISTRIBUTION, MUSCLE_BY_ID, MUSCLE_IDS } from './muscles';

// Re-exportados para mantener compatibilidad con imports existentes ('constants/exercises').
export { CATEGORIES, CATEGORY_LABELS, MUSCLES, MUSCLE_LABELS } from './muscles';

/*
 * Diccionario de ejercicios con nombres usados en gimnasios de Argentina.
 * Formato: [NOMBRE, CATEGORÍA, distribución { código: % }, alias[]]
 * - La distribución suma 100: es el porcentaje del estímulo que recibe cada músculo.
 * - Los alias resuelven nombres viejos (historial ya guardado) y variantes populares.
 * Códigos de músculo (ver constants/muscles.js):
 *   ps pecho_superior · pm pecho_medio · pi pecho_inferior
 *   ts trapecio_superior · tm trapecio_medio · da dorsal_ancho · rm redondo_mayor · lu lumbares
 *   dan deltoides_anterior · dl deltoides_lateral · dp deltoides_posterior · mr manguito_rotador
 *   bi biceps · br braquial · tl triceps_largo · tla triceps_lateral
 *   brr braquiorradial · fx flexores del antebrazo (agarre) · ex extensores del antebrazo
 *   ab = "agarre genérico" (código compuesto): 55% flexores · 15% extensores · 10% braquiorradial · 12% palma · 8% dedos
 *   ra recto_abdominal · ob oblicuos · se serrato
 *   rf recto_femoral · vl vasto_lateral · vm vasto_medial · bf biceps_femoral · st semitendinoso · ad aductores
 *   gm gluteo_mayor · gme gluteo_medio · ge gemelos · so soleo · ti tibial · pie pie (arco plantar)
 *   pa palma de la mano · dd dedos de la mano
 */
const CODE_TO_MUSCLE = Object.freeze({
  ps: 'pecho_superior', pm: 'pecho_medio', pi: 'pecho_inferior',
  ts: 'trapecio_superior', tm: 'trapecio_medio', da: 'dorsal_ancho', rm: 'redondo_mayor', lu: 'lumbares',
  dan: 'deltoides_anterior', dl: 'deltoides_lateral', dp: 'deltoides_posterior', mr: 'manguito_rotador',
  bi: 'biceps', br: 'braquial', tl: 'triceps_largo', tla: 'triceps_lateral',
  brr: 'braquiorradial', fx: 'antebrazo_flexores', ex: 'antebrazo_extensores',
  ra: 'recto_abdominal', ob: 'oblicuos', se: 'serrato',
  rf: 'recto_femoral', vl: 'vasto_lateral', vm: 'vasto_medial', bf: 'biceps_femoral', st: 'semitendinoso', ad: 'aductores',
  gm: 'gluteo_mayor', gme: 'gluteo_medio', ge: 'gemelos', so: 'soleo', ti: 'tibial', pie: 'pie',
  pa: 'mano_palma', dd: 'mano_dedos',
});

// Códigos compuestos: un porcentaje que se reparte entre varios músculos (proporciones que suman 1).
const COMPOSITE_CODES = Object.freeze({
  // Agarrar involucra también los músculos propios de la mano (palma y dedos).
  ab: { antebrazo_flexores: 0.55, antebrazo_extensores: 0.15, braquiorradial: 0.1, mano_palma: 0.12, mano_dedos: 0.08 },
});

const CATALOG_ENTRIES = [
  // ───────── PECHO ─────────
  ['PRESS BANCA', 'PECHO', { pm: 40, ps: 15, pi: 10, dan: 15, tla: 12, tl: 5, se: 3 }, ['PRESS PLANO', 'PRESS DE BANCA PLANO', 'PRESS PLANO CON BARRA']],
  ['PRESS BANCA CON MANCUERNAS', 'PECHO', { pm: 42, ps: 15, pi: 10, dan: 15, tla: 10, tl: 5, se: 3 }, ['PRESS PLANO CON MANCUERNAS']],
  ['PRESS INCLINADO', 'PECHO', { ps: 40, pm: 18, dan: 22, tla: 12, tl: 5, se: 3 }, ['PRESS INCLINADO CON BARRA']],
  ['PRESS INCLINADO CON MANCUERNAS', 'PECHO', { ps: 42, pm: 18, dan: 22, tla: 10, tl: 5, se: 3 }, []],
  ['PRESS DECLINADO', 'PECHO', { pi: 40, pm: 30, dan: 8, tla: 15, tl: 7 }, ['PRESS DECLINADO CON BARRA']],
  ['PRESS DECLINADO CON MANCUERNAS', 'PECHO', { pi: 42, pm: 30, dan: 8, tla: 13, tl: 7 }, []],
  ['PRESS DE PECHO EN MAQUINA', 'PECHO', { pm: 45, ps: 15, pi: 10, dan: 15, tla: 15 }, ['PRESS MAQUINA', 'PRESS EN MAQUINA']],
  ['PRESS INCLINADO EN MAQUINA', 'PECHO', { ps: 45, pm: 15, dan: 25, tla: 15 }, []],
  ['PRESS EN MULTIPOWER', 'PECHO', { pm: 40, ps: 15, pi: 10, dan: 17, tla: 13, tl: 5 }, ['PRESS EN SMITH', 'PRESS BANCA EN SMITH']],
  ['PRESS INCLINADO EN MULTIPOWER', 'PECHO', { ps: 42, pm: 18, dan: 22, tla: 13, tl: 5 }, ['PRESS INCLINADO EN SMITH']],
  ['PRESS SVEND', 'PECHO', { pm: 50, ps: 20, dan: 15, tla: 15 }, ['PRESS CON DISCO']],
  ['MARIPOSA', 'PECHO', { pm: 55, ps: 20, pi: 15, dan: 10 }, ['PEC DECK', 'PECK DECK', 'APERTURAS EN MAQUINA']],
  ['APERTURAS CON MANCUERNAS', 'PECHO', { pm: 50, ps: 20, pi: 15, dan: 10, bi: 5 }, ['APERTURAS', 'APERTURAS PLANAS', 'APERTURAS PLANO']],
  ['APERTURAS INCLINADAS', 'PECHO', { ps: 50, pm: 28, dan: 17, bi: 5 }, ['APERTURAS INCLINADAS CON MANCUERNAS']],
  ['CRUCE DE POLEAS', 'PECHO', { pm: 40, pi: 35, ps: 10, dan: 10, se: 5 }, ['CROSSOVER', 'CRUCE DE POLEAS ALTAS', 'CRUCES EN POLEA']],
  ['CRUCE DE POLEAS BAJAS', 'PECHO', { ps: 50, pm: 25, dan: 20, bi: 5 }, ['CROSSOVER BAJO']],
  ['FLEXIONES', 'PECHO', { pm: 38, ps: 12, pi: 10, dan: 15, tla: 12, tl: 5, ra: 5, se: 3 }, ['LAGARTIJAS', 'PECHADAS', 'FLEXIONES DE BRAZOS']],
  ['FLEXIONES DECLINADAS', 'PECHO', { ps: 35, pm: 25, dan: 20, tla: 12, ra: 5, se: 3 }, ['FLEXIONES CON PIES ELEVADOS']],
  ['FLEXIONES DIAMANTE', 'TRICEPS', { tla: 35, tl: 15, pm: 25, pi: 5, dan: 15, ra: 5 }, ['FLEXIONES CERRADAS']],
  ['FONDOS PARA PECHO', 'PECHO', { pi: 40, pm: 20, dan: 15, tla: 18, tl: 7 }, ['FONDOS INCLINADO ADELANTE']],
  ['PULLOVER', 'PECHO', { da: 35, pm: 30, pi: 10, tl: 15, se: 10 }, ['PULLOVER CON MANCUERNA']],
  ['PRESS HEX', 'PECHO', { pm: 45, ps: 15, pi: 8, tla: 14, tl: 6, dan: 12 }, ['SQUEEZE PRESS', 'PRESS APRETANDO MANCUERNAS']],
  ['PRESS DE PISO', 'PECHO', { pm: 35, ps: 12, pi: 8, tla: 22, tl: 8, dan: 15 }, ['FLOOR PRESS', 'PRESS EN EL PISO']],
  ['APERTURAS DECLINADAS', 'PECHO', { pi: 45, pm: 35, dan: 10, bi: 5, se: 5 }, ['APERTURAS DECLINADAS CON MANCUERNAS']],
  ['APERTURAS EN POLEA', 'PECHO', { pm: 52, ps: 18, pi: 17, dan: 8, bi: 5 }, ['APERTURAS CON POLEAS EN BANCO', 'CABLE FLY']],
  ['CRUCE DE POLEAS MEDIAS', 'PECHO', { pm: 55, ps: 15, pi: 15, dan: 10, se: 5 }, ['CROSSOVER MEDIO', 'CRUCE A LA ALTURA DEL PECHO']],
  ['FLEXIONES INCLINADAS', 'PECHO', { pi: 30, pm: 30, ps: 8, dan: 12, tla: 12, tl: 3, ra: 3, se: 2 }, ['FLEXIONES CON MANOS ELEVADAS', 'FLEXIONES EN BANCO']],
  ['FLEXIONES ARQUERAS', 'PECHO', { pm: 40, ps: 10, pi: 10, dan: 15, tla: 12, tl: 3, ra: 5, se: 5 }, ['ARCHER PUSH UP', 'FLEXIONES ARQUERO']],
  ['FLEXIONES PLIOMETRICAS', 'PECHO', { pm: 36, ps: 12, pi: 10, dan: 16, tla: 14, tl: 4, ra: 5, se: 3 }, ['FLEXIONES CON PALMADA', 'CLAP PUSH UP']],

  // ───────── ESPALDA ─────────
  ['PESO MUERTO', 'ESPALDA', { lu: 22, gm: 22, bf: 12, st: 10, vl: 6, vm: 5, rf: 3, ts: 8, tm: 5, ab: 7 }, ['PESO MUERTO CONVENCIONAL']],
  ['RACK PULL', 'ESPALDA', { lu: 25, ts: 20, gm: 20, tm: 10, bf: 8, st: 7, ab: 10 }, ['PESO MUERTO DESDE RACK']],
  ['JALON AL PECHO', 'ESPALDA', { da: 45, rm: 10, tm: 12, bi: 15, br: 5, dp: 8, ab: 5 }, ['JALON ADELANTE', 'POLEA AL PECHO', 'JALON ABIERTO']],
  ['JALON AL PECHO AGARRE CERRADO', 'ESPALDA', { da: 45, rm: 10, tm: 10, bi: 18, br: 7, dp: 5, ab: 5 }, ['JALON CERRADO', 'JALON CON TRIANGULO']],
  ['JALON TRAS NUCA', 'ESPALDA', { da: 40, rm: 12, tm: 15, bi: 13, dp: 10, ab: 5, mr: 5 }, ['POLEA TRAS NUCA']],
  ['JALON CON BRAZOS RECTOS', 'ESPALDA', { da: 60, rm: 15, tl: 15, ra: 5, se: 5 }, ['PULLOVER EN POLEA', 'PULLDOWN BRAZOS RECTOS']],
  ['DOMINADAS', 'ESPALDA', { da: 45, rm: 10, tm: 10, bi: 17, br: 6, ab: 7, ra: 5 }, ['DOMINADAS PRONAS', 'PULL UPS']],
  ['DOMINADAS SUPINAS', 'ESPALDA', { da: 40, rm: 8, tm: 8, bi: 25, br: 7, ab: 7, ra: 5 }, ['CHIN UPS', 'DOMINADAS AGARRE SUPINO']],
  ['DOMINADAS ASISTIDAS', 'ESPALDA', { da: 46, rm: 10, tm: 10, bi: 17, br: 6, dp: 4, ab: 4, ra: 3 }, ['DOMINADAS EN MAQUINA']],
  ['REMO CON BARRA', 'ESPALDA', { da: 30, tm: 22, rm: 8, dp: 12, bi: 12, br: 4, lu: 7, ab: 5 }, ['REMO INCLINADO CON BARRA', 'REMO BARRA']],
  ['REMO PENDLAY', 'ESPALDA', { da: 28, tm: 24, rm: 8, dp: 12, bi: 12, br: 4, lu: 7, ab: 5 }, []],
  ['REMO BAJO', 'ESPALDA', { da: 35, tm: 22, rm: 8, dp: 10, bi: 15, br: 5, ab: 5 }, ['REMO SENTADO EN POLEA', 'REMO EN POLEA BAJA', 'REMO GIRONDA']],
  ['REMO EN T', 'ESPALDA', { da: 32, tm: 22, rm: 8, dp: 12, bi: 12, br: 4, lu: 5, ab: 5 }, ['REMO T', 'REMO EN BARRA T']],
  ['REMO UNILATERAL', 'ESPALDA', { da: 40, tm: 15, rm: 10, dp: 10, bi: 15, br: 5, ab: 5 }, ['REMO CON MANCUERNA', 'SERRUCHO']],
  ['REMO EN MAQUINA', 'ESPALDA', { da: 35, tm: 25, rm: 8, dp: 12, bi: 12, br: 3, ab: 5 }, ['REMO HAMMER']],
  ['REMO INVERTIDO', 'ESPALDA', { da: 30, tm: 25, dp: 15, bi: 15, br: 5, ra: 5, ab: 5 }, ['REMO AUSTRALIANO']],
  ['HIPEREXTENSIONES', 'ESPALDA', { lu: 50, gm: 30, bf: 10, st: 10 }, ['EXTENSIONES LUMBARES', 'BANCO ROMANO', 'LUMBARES']],
  ['BUENOS DIAS', 'ESPALDA', { lu: 35, bf: 22, st: 22, gm: 21 }, ['GOOD MORNING']],
  ['ENCOGIMIENTOS CON BARRA', 'ESPALDA', { ts: 80, tm: 10, fx: 10 }, ['SHRUGS', 'ENCOGIMIENTOS DE HOMBROS', 'ENCOGIMIENTOS']],
  ['ENCOGIMIENTOS CON MANCUERNAS', 'ESPALDA', { ts: 80, tm: 8, fx: 12 }, []],
  ['REMO CON APOYO EN PECHO', 'ESPALDA', { da: 30, tm: 28, rm: 8, dp: 14, bi: 12, br: 4, ab: 4 }, ['CHEST SUPPORTED ROW', 'REMO EN T CON APOYO', 'REMO T CON APOYO DE PECHO']],
  ['REMO SEAL', 'ESPALDA', { da: 32, tm: 26, rm: 8, dp: 14, bi: 12, br: 4, ab: 4 }, ['SEAL ROW', 'REMO FOCA']],
  ['REMO KROC', 'ESPALDA', { da: 38, tm: 14, rm: 10, dp: 8, bi: 12, br: 5, ab: 8, ts: 5 }, ['KROC ROW']],
  ['REMO MEADOWS', 'ESPALDA', { da: 36, tm: 18, rm: 10, dp: 12, bi: 12, br: 4, ab: 8 }, ['MEADOWS ROW']],
  ['PULLOVER EN MAQUINA', 'ESPALDA', { da: 60, rm: 15, tl: 10, pi: 5, se: 5, ra: 5 }, ['PULLOVER MAQUINA']],
  ['JALON UNILATERAL', 'ESPALDA', { da: 50, rm: 12, tm: 8, bi: 15, br: 5, ob: 5, ab: 5 }, ['JALON A UNA MANO', 'JALON UNILATERAL EN POLEA']],
  ['SUPERMAN', 'ESPALDA', { lu: 45, gm: 25, tm: 15, dp: 5, bf: 5, st: 5 }, ['SUPERMANES', 'EXTENSION LUMBAR EN EL PISO']],

  // ───────── HOMBROS ─────────
  ['PRESS MILITAR', 'HOMBROS', { dan: 45, dl: 20, tla: 15, tl: 5, ts: 8, ps: 5, ra: 2 }, ['PRESS HOMBRO BARRAS', 'PRESS MILITAR CON BARRA', 'PRESS MILITAR PARADO']],
  ['PRESS DE HOMBROS CON MANCUERNAS', 'HOMBROS', { dan: 45, dl: 22, tla: 15, tl: 5, ts: 8, ps: 5 }, ['PRESS HOMBRO', 'PRESS DE HOMBROS', 'PRESS MILITAR CON MANCUERNAS']],
  ['PRESS ARNOLD', 'HOMBROS', { dan: 45, dl: 25, tla: 15, tl: 5, ts: 5, ps: 5 }, ['ARNOLD PRESS', 'PRESS ARNOLD CON MANCUERNAS']],
  ['PRESS DE HOMBROS EN MAQUINA', 'HOMBROS', { dan: 48, dl: 20, tla: 17, tl: 5, ts: 5, ps: 5 }, ['PRESS HOMBRO EN MAQUINA']],
  ['PRESS TRAS NUCA', 'HOMBROS', { dan: 35, dl: 30, dp: 5, tla: 15, tl: 5, ts: 10 }, ['PRESS MILITAR TRAS NUCA']],
  ['LANDMINE PRESS', 'HOMBROS', { dan: 40, ps: 25, tla: 20, se: 10, ra: 5 }, ['PRESS LANDMINE', 'PRESS CON MINA']],
  ['VUELOS LATERALES', 'HOMBROS', { dl: 70, dan: 10, ts: 15, se: 5 }, ['ELEVACIONES LATERALES', 'LATERALES', 'VUELOS LATERALES CON MANCUERNAS']],
  ['VUELOS LATERALES EN POLEA', 'HOMBROS', { dl: 72, dan: 10, ts: 13, se: 5 }, ['LATERALES EN POLEA']],
  ['VUELOS LATERALES EN MAQUINA', 'HOMBROS', { dl: 75, dan: 10, ts: 15 }, ['LATERALES EN MAQUINA']],
  ['VUELOS ANTERIORES', 'HOMBROS', { dan: 70, ps: 15, dl: 10, se: 5 }, ['ELEVACIONES FRONTALES', 'FRONTALES', 'VUELOS FRONTALES']],
  ['VUELOS POSTERIORES', 'HOMBROS', { dp: 60, mr: 12, tm: 18, rm: 5, dl: 5 }, ['PAJARO', 'PAJARITOS', 'POSTERIORES CON MANCUERNAS']],
  ['PEC DECK INVERTIDO', 'HOMBROS', { dp: 62, tm: 20, mr: 10, dl: 8 }, ['MARIPOSA INVERTIDA', 'POSTERIORES EN MAQUINA', 'MARIPOSA POSTERIOR']],
  ['FACE PULL', 'HOMBROS', { dp: 40, mr: 25, tm: 20, ts: 5, dl: 5, bi: 5 }, ['FACEPULL', 'TIRON A LA CARA']],
  ['REMO MENTON', 'HOMBROS', { dl: 40, ts: 35, dan: 10, bi: 10, ab: 5 }, ['REMO AL MENTON', 'REMO ALTO', 'REMO AL CUELLO']],
  ['ROTACION EXTERNA EN POLEA', 'HOMBROS', { mr: 80, dp: 20 }, ['ROTACIONES EXTERNAS', 'ROTADORES']],
  ['ELEVACIONES EN Y', 'HOMBROS', { tm: 35, dl: 25, dp: 20, ts: 10, mr: 10 }, ['Y RAISE']],
  ['PRESS Z', 'HOMBROS', { dan: 42, dl: 18, tla: 15, tl: 5, ts: 6, ra: 8, ob: 6 }, ['Z PRESS', 'PRESS SENTADO EN EL PISO']],
  ['VUELO LATERAL INCLINADO', 'HOMBROS', { dl: 74, dan: 8, ts: 10, se: 3, ob: 5 }, ['LATERAL INCLINADO', 'LEAN AWAY LATERAL', 'VUELO LATERAL AGARRADO']],
  ['CRUCE POSTERIOR EN POLEA', 'HOMBROS', { dp: 62, tm: 18, mr: 12, dl: 8 }, ['REAR DELT EN POLEA', 'CRUCE INVERTIDO EN POLEA']],
  ['PRESS CUBANO', 'HOMBROS', { mr: 40, dp: 20, dl: 15, dan: 10, tm: 10, ts: 5 }, ['CUBAN PRESS']],

  // ───────── BÍCEPS ─────────
  ['CURL CON BARRA', 'BICEPS', { bi: 64, br: 20, brr: 8, fx: 8 }, ['CURL DE BICEPS CON BARRA', 'CURL BARRA RECTA']],
  ['CURL CON BARRA W', 'BICEPS', { bi: 56, br: 24, brr: 12, fx: 8 }, ['CURL BARRA W', 'CURL CON BARRA Z', 'CURL BARRA Z']],
  ['CURL CON MANCUERNAS', 'BICEPS', { bi: 66, br: 18, brr: 8, fx: 8 }, ['CURL SIMULTANEO']],
  ['CURL ALTERNADO CON MANCUERNAS', 'BICEPS', { bi: 68, br: 17, brr: 8, fx: 7 }, ['ALT CON MANCUERNA', 'CURL ALTERNADO', 'BICEPS ALTERNADO']],
  ['CURL MARTILLO', 'BICEPS', { br: 38, brr: 32, bi: 22, fx: 5, ex: 3 }, ['MARTILLO', 'CURL MARTILLO CON MANCUERNAS']],
  ['CURL MARTILLO CON SOGA', 'BICEPS', { br: 38, brr: 30, bi: 24, fx: 6, ex: 2 }, ['MARTILLO CON SOGA', 'MARTILLO EN POLEA']],
  ['CURL POLEA', 'BICEPS', { bi: 66, br: 20, brr: 7, fx: 7 }, ['CURL EN POLEA BAJA', 'CURL EN POLEA']],
  ['CURL SCOTT', 'BICEPS', { bi: 58, br: 30, brr: 7, fx: 5 }, ['SCOTT', 'BANCO SCOTT', 'CURL PREDICADOR']],
  ['CURL CONCENTRADO', 'BICEPS', { bi: 70, br: 20, brr: 5, fx: 5 }, ['BICEP CONCENTRADO', 'BICEPS CONCENTRADO']],
  ['CURL BAYESIANO', 'BICEPS', { bi: 76, br: 14, brr: 5, fx: 5 }, ['BAYESIANA', 'CURL BAYESIANA']],
  ['CURL BICEPS INCLINADO', 'BICEPS', { bi: 74, br: 15, brr: 6, fx: 5 }, ['CURL INCLINADO']],
  ['CURL ARAÑA', 'BICEPS', { bi: 70, br: 22, brr: 4, fx: 4 }, ['CURL SPIDER', 'SPIDER CURL']],
  ['CURL 21', 'BICEPS', { bi: 64, br: 22, brr: 7, fx: 7 }, ['21S', 'VEINTIUNOS']],
  ['CURL EN MAQUINA', 'BICEPS', { bi: 62, br: 28, brr: 5, fx: 5 }, []],
  ['CURL DRAG', 'BICEPS', { bi: 62, br: 18, brr: 8, fx: 7, dp: 5 }, ['DRAG CURL', 'CURL ARRASTRADO']],
  ['CURL EN POLEA ALTA', 'BICEPS', { bi: 72, br: 16, brr: 6, fx: 6 }, ['CURL DOBLE BICEPS EN POLEA', 'CURL EN CRUCE DE POLEAS']],
  ['CURL ZOTTMAN', 'BICEPS', { bi: 40, br: 25, brr: 20, ex: 10, fx: 5 }, ['ZOTTMAN', 'ZOTTMAN CURL']],
  ['CURL MARTILLO CRUZADO', 'BICEPS', { br: 40, brr: 30, bi: 22, fx: 5, ex: 3 }, ['MARTILLO CRUZADO', 'CROSS BODY HAMMER']],
  ['CURL INVERTIDO', 'ANTEBRAZOS', { brr: 38, br: 32, ex: 18, bi: 12 }, ['CURL PRONO', 'CURL REVERSO']],

  // ───────── TRÍCEPS ─────────
  ['EXTENSION DE TRICEPS EN POLEA', 'TRICEPS', { tla: 65, tl: 30, ab: 5 }, ['EXT POLEA ALTA', 'TRICEPS EN POLEA', 'PUSHDOWN', 'EMPUJES EN POLEA']],
  ['EXTENSION DE TRICEPS CON SOGA', 'TRICEPS', { tla: 60, tl: 35, ab: 5 }, ['TRICEPS CON SOGA', 'SOGA TRICEPS']],
  ['EXTENSION DE TRICEPS AGARRE INVERTIDO', 'TRICEPS', { tla: 65, tl: 25, fx: 10 }, ['TRICEPS INVERTIDO', 'TRICEPS SUPINO EN POLEA']],
  ['PRESS FRANCES', 'TRICEPS', { tl: 50, tla: 45, ab: 5 }, ['ROMPECRANEOS', 'PRESS FRANCES CON BARRA']],
  ['PRESS FRANCES CON MANCUERNAS', 'TRICEPS', { tl: 48, tla: 46, ab: 6 }, []],
  ['EXTENSION DE TRICEPS CON MANCUERNA', 'TRICEPS', { tl: 60, tla: 35, ab: 5 }, ['EXT CON MANCUERNA', 'EXTENSION TRAS NUCA CON MANCUERNA']],
  ['TRICEPS COPA', 'TRICEPS', { tl: 62, tla: 33, ab: 5 }, ['EXT COPA', 'COPA']],
  ['TRICEPS TRAS NUCA EN POLEA', 'TRICEPS', { tl: 65, tla: 30, ab: 5 }, ['TRASNUCA', 'TRICEPS TRASNUCA', 'TRAS NUCA EN POLEA']],
  ['PATADA DE TRICEPS', 'TRICEPS', { tla: 50, tl: 45, dp: 5 }, ['KICKBACK', 'PATADA DE TRICEPS CON MANCUERNA']],
  ['FONDOS EN PARALELAS', 'TRICEPS', { tla: 40, tl: 15, pi: 25, pm: 5, dan: 15 }, ['FONDOS', 'PARALELAS']],
  ['FONDOS EN BANCO', 'TRICEPS', { tla: 50, tl: 20, dan: 20, pi: 10 }, ['FONDOS ENTRE BANCOS', 'FONDOS DE TRICEPS EN BANCO']],
  ['FONDOS EN MAQUINA', 'TRICEPS', { tla: 45, tl: 20, pi: 20, dan: 15 }, ['FONDOS ASISTIDOS']],
  ['PRESS CERRADO', 'TRICEPS', { tla: 35, tl: 15, pm: 25, pi: 5, ps: 5, dan: 15 }, ['PRESS BANCA AGARRE CERRADO', 'PRESS BANCA CERRADO']],
  ['JM PRESS', 'TRICEPS', { tla: 45, tl: 30, pm: 10, ps: 5, dan: 5, fx: 5 }, ['PRESS JM']],
  ['EXTENSION UNILATERAL EN POLEA', 'TRICEPS', { tla: 62, tl: 33, ab: 5 }, ['PUSHDOWN A UNA MANO', 'TRICEPS UNILATERAL EN POLEA']],
  ['PRESS TATE', 'TRICEPS', { tla: 55, tl: 35, dan: 5, ab: 5 }, ['TATE PRESS']],

  // ───────── ANTEBRAZOS ─────────
  ['CURL DE MUÑECA', 'ANTEBRAZOS', { fx: 100 }, ['CURL DE MUNECAS', 'FLEXION DE MUNECA']],
  ['CURL DE MUÑECA INVERTIDO', 'ANTEBRAZOS', { ex: 90, brr: 10 }, ['EXTENSION DE MUNECA', 'EXTENSIONES DE MUNECA']],
  ['RODILLO DE MUÑECA', 'ANTEBRAZOS', { fx: 45, ex: 40, dan: 10, brr: 5 }, ['ENROLLADOR', 'WRIST ROLLER']],
  ['COLGADO EN BARRA', 'ANTEBRAZOS', { fx: 43, pa: 7, dd: 5, da: 20, ra: 10, rm: 5, ex: 5, brr: 5 }, ['DEAD HANG', 'COLGARSE EN BARRA']],
  ['CURL DE MUÑECA TRAS LA ESPALDA', 'ANTEBRAZOS', { fx: 95, ts: 5 }, ['CURL DE MUNECA DETRAS DE LA ESPALDA', 'CURL DE MUÑECA DETRAS']],
  ['CURL INVERTIDO EN POLEA', 'ANTEBRAZOS', { brr: 38, br: 30, ex: 20, bi: 12 }, ['CURL PRONO EN POLEA', 'CURL REVERSO EN POLEA']],
  ['PRONOSUPINACION CON MANCUERNA', 'ANTEBRAZOS', { brr: 30, fx: 25, ex: 25, bi: 20 }, ['PRONACION Y SUPINACION', 'ROTACION DE ANTEBRAZO', 'MARTILLO ROTACION']],
  ['DESVIACION RADIAL CON MANCUERNA', 'ANTEBRAZOS', { ex: 45, fx: 40, brr: 15 }, ['DESVIACION RADIAL', 'PALANCA DE MUÑECA']],
  ['PINZA CON DISCOS', 'ANTEBRAZOS', { fx: 45, pa: 25, dd: 15, ex: 10, ts: 5 }, ['PLATE PINCH', 'PELLIZCO DE DISCOS']],
  ['HAND GRIP', 'ANTEBRAZOS', { fx: 60, pa: 25, dd: 10, ex: 5 }, ['HANDGRIP', 'HAND GRIPPER', 'APRETAR HANDGRIP']],
  ['EXTENSION DE DEDOS CON BANDA', 'ANTEBRAZOS', { ex: 70, dd: 25, pa: 5 }, ['APERTURA DE DEDOS CON BANDA', 'FINGER EXTENSION']],
  ['COLGADO CON TOALLA', 'ANTEBRAZOS', { fx: 48, pa: 8, dd: 6, ex: 6, brr: 7, da: 15, ra: 5, rm: 5 }, ['TOWEL HANG', 'COLGADO EN TOALLAS']],

  // ───────── CORE ─────────
  ['CRUNCH', 'CORE', { ra: 85, ob: 15 }, ['ABDOMINALES', 'CRUNCH ABDOMINAL', 'ABDOMINALES CORTOS']],
  ['CRUNCH EN POLEA', 'CORE', { ra: 80, ob: 20 }, ['CRUNCH CON SOGA', 'ABDOMINALES EN POLEA']],
  ['CRUNCH EN MAQUINA', 'CORE', { ra: 82, ob: 13, rf: 5 }, ['ABDOMINALES EN MAQUINA']],
  ['CRUNCH INVERSO', 'CORE', { ra: 80, ob: 15, rf: 5 }, ['CRUNCH REVERSO', 'ABDOMINALES INVERSOS']],
  ['SIT UP', 'CORE', { ra: 70, ob: 15, rf: 15 }, ['ABDOMINALES COMPLETOS', 'SIT UPS']],
  ['PLANCHA', 'CORE', { ra: 45, ob: 25, dan: 10, gm: 10, se: 10 }, ['PLANCHA ABDOMINAL', 'PLANK']],
  ['PLANCHA LATERAL', 'CORE', { ob: 60, ra: 15, gme: 20, dan: 5 }, ['SIDE PLANK']],
  ['ELEVACION DE PIERNAS', 'CORE', { ra: 55, ob: 15, rf: 20, ad: 10 }, ['ELEVACIONES DE PIERNAS', 'ELEVACION DE PIERNAS ACOSTADO']],
  ['ELEVACION DE PIERNAS COLGADO', 'CORE', { ra: 50, ob: 20, rf: 15, ab: 10, da: 5 }, ['ELEVACIONES COLGADO', 'ELEVACION DE PIERNAS EN BARRA']],
  ['ELEVACION DE RODILLAS EN PARALELAS', 'CORE', { ra: 55, ob: 20, rf: 20, tla: 5 }, ['CAPITAN', 'SILLA ROMANA', 'ELEVACION DE RODILLAS']],
  ['RUEDA ABDOMINAL', 'CORE', { ra: 55, ob: 15, da: 15, tl: 5, se: 10 }, ['RUEDITA', 'AB WHEEL']],
  ['RUSSIAN TWIST', 'CORE', { ob: 60, ra: 35, rf: 5 }, ['GIROS RUSOS', 'GIRO RUSO']],
  ['CRUNCH BICICLETA', 'CORE', { ra: 45, ob: 45, rf: 10 }, ['ABDOMINALES BICICLETA', 'BICICLETA']],
  ['LEÑADOR EN POLEA', 'CORE', { ob: 65, ra: 15, dan: 10, se: 10 }, ['LENADOR', 'WOODCHOPPER']],
  ['PALLOF PRESS', 'CORE', { ob: 60, ra: 30, se: 10 }, ['PRESS PALLOF', 'ANTIRROTACION']],
  ['DEAD BUG', 'CORE', { ra: 52, ob: 28, rf: 10, se: 5, dan: 5 }, ['BICHO MUERTO', 'DEADBUG']],
  ['BIRD DOG', 'CORE', { lu: 30, gm: 25, ob: 15, ra: 10, tm: 10, dp: 5, gme: 5 }, ['PERRO PAJARO', 'CUADRUPEDIA CONTRALATERAL']],
  ['HOLLOW HOLD', 'CORE', { ra: 60, ob: 20, rf: 15, se: 5 }, ['HOLLOW BODY', 'BANANA']],
  ['V UPS', 'CORE', { ra: 55, ob: 15, rf: 25, ad: 5 }, ['V UP', 'NAVAJA', 'ABDOMINALES EN V']],
  ['CURL UP DE MCGILL', 'CORE', { ra: 75, ob: 25 }, ['MCGILL CURL UP', 'CURL UP']],
  ['PLANCHA COPENHAGUE', 'CORE', { ad: 45, ob: 30, gme: 10, ra: 10, dan: 5 }, ['COPENHAGEN PLANK', 'PLANCHA DE ADUCTORES']],

  // ───────── PIERNAS ─────────
  ['SENTADILLA', 'PIERNAS', { vl: 22, vm: 20, rf: 12, gm: 25, ad: 10, lu: 6, bf: 3, st: 2 }, ['SENTADILLA CON BARRA', 'SENTADILLA LIBRE', 'SENTADILLA TRASERA']],
  ['SENTADILLA FRONTAL', 'PIERNAS', { vl: 25, vm: 25, rf: 15, gm: 15, ad: 7, lu: 5, ra: 8 }, ['SENTADILLA DE FRENTE']],
  ['SENTADILLA HACK', 'PIERNAS', { vl: 28, vm: 27, rf: 15, gm: 20, ad: 10 }, ['HACK', 'MAQUINA HACK', 'HACK SQUAT']],
  ['SENTADILLA EN MULTIPOWER', 'PIERNAS', { vl: 25, vm: 23, rf: 12, gm: 25, ad: 10, lu: 5 }, ['SENTADILLA EN SMITH']],
  ['SENTADILLA GOBLET', 'PIERNAS', { vl: 22, vm: 22, rf: 12, gm: 22, ad: 12, ra: 5, ab: 5 }, ['SENTADILLA COPA', 'GOBLET']],
  ['SENTADILLA BULGARA', 'PIERNAS', { vl: 20, vm: 20, rf: 10, gm: 30, gme: 8, ad: 7, bf: 5 }, ['BULGARAS', 'ESTOCADA BULGARA']],
  ['SENTADILLA SUMO', 'PIERNAS', { gm: 28, ad: 28, vl: 15, vm: 15, rf: 6, lu: 5, gme: 3 }, ['SENTADILLA SUMO CON MANCUERNA', 'SUMO']],
  ['SISSY SQUAT', 'PIERNAS', { rf: 35, vl: 30, vm: 30, ra: 5 }, ['SENTADILLA SISSY']],
  ['PRENSA 45', 'PIERNAS', { vl: 25, vm: 25, rf: 10, gm: 25, ad: 10, bf: 3, st: 2 }, ['PRENSA 45°', 'PRENSA', 'PRENSA INCLINADA']],
  ['PRENSA HORIZONTAL', 'PIERNAS', { vl: 27, vm: 27, rf: 12, gm: 22, ad: 10, bf: 2 }, ['PRENSA SENTADO']],
  ['SILLON DE CUADRICEPS', 'PIERNAS', { rf: 35, vl: 35, vm: 30 }, ['CUADRICEPS', 'EXTENSIONES DE CUADRICEPS', 'SILLON DE EXTENSIONES', 'EXTENSION DE PIERNAS']],
  ['CAMILLA DE ISQUIOTIBIALES', 'PIERNAS', { bf: 50, st: 40, ge: 10 }, ['ISQUIOTIBIALES', 'CAMILLA', 'CURL FEMORAL ACOSTADO', 'FEMORALES ACOSTADO']],
  ['CURL FEMORAL SENTADO', 'PIERNAS', { bf: 45, st: 50, ge: 5 }, ['SILLON DE ISQUIOTIBIALES', 'FEMORALES SENTADO']],
  ['CURL FEMORAL PARADO', 'PIERNAS', { bf: 55, st: 40, ge: 5 }, ['CURL FEMORAL DE PIE', 'FEMORAL UNILATERAL']],
  ['CURL NORDICO', 'PIERNAS', { bf: 45, st: 45, ge: 10 }, ['NORDIC CURL', 'NORDICOS']],
  ['PESO MUERTO RUMANO', 'PIERNAS', { bf: 25, st: 25, gm: 25, lu: 15, ab: 5, ad: 5 }, ['RDL']],
  ['PESO MUERTO PIERNAS RIGIDAS', 'PIERNAS', { bf: 27, st: 27, gm: 20, lu: 18, ab: 5, ad: 3 }, ['STIFF', 'PESO MUERTO STIFF']],
  ['PESO MUERTO SUMO', 'PIERNAS', { gm: 25, ad: 18, vl: 8, vm: 8, rf: 4, bf: 8, st: 7, lu: 12, ts: 5, ab: 5 }, []],
  ['ESTOCADAS', 'PIERNAS', { vl: 20, vm: 20, rf: 12, gm: 28, gme: 8, ad: 7, bf: 5 }, ['ZANCADAS', 'ESTOCADAS CON MANCUERNAS', 'ESTOCADA']],
  ['ESTOCADAS CAMINANDO', 'PIERNAS', { vl: 20, vm: 18, rf: 12, gm: 30, gme: 8, ad: 7, bf: 5 }, ['ESTOCADAS EN MOVIMIENTO', 'ZANCADAS CAMINANDO']],
  ['ESTOCADAS INVERSAS', 'PIERNAS', { vl: 18, vm: 18, rf: 10, gm: 32, gme: 10, ad: 7, bf: 5 }, ['ESTOCADAS HACIA ATRAS']],
  ['SUBIDAS AL CAJON', 'PIERNAS', { vl: 22, vm: 20, rf: 10, gm: 30, gme: 10, bf: 4, st: 4 }, ['STEP UP', 'SUBIDA AL BANCO']],
  ['ADUCTOR', 'PIERNAS', { ad: 100 }, ['SILLON ADUCTOR', 'MAQUINA ADUCTORA', 'ADUCTORES']],
  ['SENTADILLA ESPAÑOLA', 'PIERNAS', { vl: 30, vm: 30, rf: 25, gm: 10, ra: 5 }, ['SPANISH SQUAT', 'SENTADILLA CON BANDA EN RODILLAS']],
  ['SENTADILLA ZERCHER', 'PIERNAS', { vl: 20, vm: 20, rf: 10, gm: 20, ad: 8, lu: 7, ra: 8, bi: 3, ts: 4 }, ['ZERCHER', 'ZERCHER SQUAT']],
  ['PRENSA UNILATERAL', 'PIERNAS', { vl: 26, vm: 26, rf: 10, gm: 24, gme: 4, ad: 8, bf: 2 }, ['PRENSA A UNA PIERNA']],
  ['ESTOCADA LATERAL', 'PIERNAS', { ad: 25, gm: 22, gme: 12, vl: 15, vm: 16, rf: 6, bf: 2, st: 2 }, ['ZANCADA LATERAL', 'LATERAL LUNGE']],
  ['PESO MUERTO RUMANO UNILATERAL', 'PIERNAS', { bf: 24, st: 22, gm: 26, gme: 10, lu: 10, ab: 4, ad: 4 }, ['RDL A UNA PIERNA', 'PESO MUERTO A UNA PIERNA']],
  ['CURL FEMORAL CON FITBALL', 'PIERNAS', { bf: 38, st: 37, gm: 15, ge: 5, ra: 5 }, ['CURL FEMORAL EN PELOTA', 'CURL CON PELOTA SUIZA']],
  ['GLUTE HAM RAISE', 'PIERNAS', { bf: 40, st: 38, gm: 12, ge: 10 }, ['GHR', 'ELEVACION GLUTEO ISQUIO']],

  // ───────── GLÚTEOS ─────────
  ['HIP THRUST', 'GLUTEOS', { gm: 65, gme: 8, bf: 8, st: 6, vl: 5, vm: 4, ad: 4 }, ['EMPUJE DE CADERA', 'HIP THRUST CON BARRA']],
  ['HIP THRUST EN MAQUINA', 'GLUTEOS', { gm: 68, gme: 8, bf: 8, st: 6, vl: 5, vm: 5 }, []],
  ['PUENTE DE GLUTEOS', 'GLUTEOS', { gm: 60, gme: 10, bf: 15, st: 10, lu: 5 }, ['PUENTE DE GLUTEO', 'ELEVACION DE CADERA', 'PUENTE']],
  ['PATADA DE GLUTEO', 'GLUTEOS', { gm: 70, gme: 10, bf: 10, st: 5, lu: 5 }, ['PATADA DE BURRO']],
  ['MULTICADERA', 'GLUTEOS', { gm: 60, gme: 20, ad: 10, bf: 10 }, ['MAQUINA MULTICADERA']],
  ['ABDUCTOR', 'GLUTEOS', { gme: 80, gm: 20 }, ['SILLON ABDUCTOR', 'MAQUINA ABDUCTORA', 'ABDUCCIONES']],
  ['ABDUCCION EN POLEA', 'GLUTEOS', { gme: 78, gm: 17, ob: 5 }, ['ABDUCCION DE CADERA EN POLEA']],
  ['CAMINATA LATERAL CON BANDA', 'GLUTEOS', { gme: 75, gm: 20, vl: 5 }, ['MONSTER WALK', 'CAMINATA CON BANDA']],
  ['PULL THROUGH', 'GLUTEOS', { gm: 55, bf: 20, st: 15, lu: 10 }, ['PULL THROUGH EN POLEA']],
  ['ALMEJA', 'GLUTEOS', { gme: 85, gm: 15 }, ['CLAMSHELL', 'ALMEJAS']],
  ['HIP THRUST UNILATERAL', 'GLUTEOS', { gm: 62, gme: 12, bf: 8, st: 6, vl: 5, vm: 4, ad: 3 }, ['HIP THRUST A UNA PIERNA']],
  ['FROG PUMP', 'GLUTEOS', { gm: 70, gme: 15, ad: 10, bf: 5 }, ['PUENTE RANA', 'FROG PUMPS']],

  // ───────── PANTORRILLAS ─────────
  ['GEMELOS PARADO', 'PANTORRILLAS', { ge: 62, so: 30, pie: 8 }, ['GEMELOS DE PIE', 'PANTORRILLAS PARADO', 'ELEVACION DE TALONES', 'GEMELOS']],
  ['GEMELOS EN PRENSA', 'PANTORRILLAS', { ge: 59, so: 35, pie: 6 }, ['PANTORRILLAS EN PRENSA']],
  ['GEMELOS EN MULTIPOWER', 'PANTORRILLAS', { ge: 64, so: 28, pie: 8 }, ['GEMELOS EN SMITH']],
  ['SOLEO SENTADO', 'PANTORRILLAS', { so: 69, ge: 25, pie: 6 }, ['SOLEO', 'GEMELOS SENTADO']],
  ['ELEVACION DE PUNTAS', 'PANTORRILLAS', { ti: 88, pie: 12 }, ['TIBIAL', 'ELEVACION DE PUNTAS DE PIE']],
  ['GEMELOS A UNA PIERNA', 'PANTORRILLAS', { ge: 59, so: 30, ti: 2, pie: 9 }, ['GEMELO UNILATERAL', 'GEMELOS UNILATERAL CON MANCUERNA']],
  ['GEMELOS BURRO', 'PANTORRILLAS', { ge: 68, so: 25, pie: 7 }, ['DONKEY CALF RAISE', 'BURRO']],

  // ───────── FUNCIONAL ─────────
  ['BURPEES', 'FUNCIONAL', { pm: 15, dan: 10, tla: 10, vl: 15, vm: 10, rf: 10, gm: 15, ra: 10, ge: 2, pie: 3 }, ['BURPEE']],
  ['ESCALADORES', 'FUNCIONAL', { ra: 35, ob: 15, rf: 20, dan: 15, se: 5, gm: 10 }, ['MOUNTAIN CLIMBERS']],
  ['SALTO AL CAJON', 'FUNCIONAL', { vl: 20, vm: 15, rf: 10, gm: 25, ge: 15, so: 10, pie: 5 }, ['BOX JUMP', 'SALTOS AL CAJON']],
  ['KETTLEBELL SWING', 'FUNCIONAL', { gm: 35, bf: 15, st: 15, lu: 15, ra: 5, ab: 10, dan: 5 }, ['SWING CON PESA RUSA', 'SWING']],
  ['THRUSTER', 'FUNCIONAL', { vl: 15, vm: 15, rf: 10, gm: 20, dan: 20, dl: 5, tla: 10, ra: 5 }, ['THRUSTERS']],
  ['CARGADA DE POTENCIA', 'FUNCIONAL', { ts: 20, gm: 20, bf: 10, st: 5, vl: 12, vm: 8, lu: 10, dan: 5, ab: 5, ge: 5 }, ['POWER CLEAN', 'CARGADA']],
  ['ARRANQUE', 'FUNCIONAL', { ts: 15, dl: 10, dan: 10, gm: 20, bf: 10, vl: 10, vm: 8, lu: 10, ab: 7 }, ['SNATCH']],
  ['WALL BALL', 'FUNCIONAL', { vl: 18, vm: 15, rf: 10, gm: 20, dan: 20, tla: 10, ra: 7 }, ['LANZAMIENTO A LA PARED', 'WALL BALLS']],
  ['BATTLE ROPES', 'FUNCIONAL', { dan: 25, dl: 20, ra: 15, ob: 10, ab: 15, tla: 5, bi: 5, ts: 5 }, ['SOGAS DE BATALLA', 'CUERDAS DE BATALLA']],
  ['PASEO DEL GRANJERO', 'FUNCIONAL', { fx: 22, pa: 5, dd: 3, ex: 5, ts: 25, ra: 10, ob: 10, gm: 5, lu: 10, ge: 5 }, ['FARMER WALK', 'CAMINATA DEL GRANJERO']],
  ['EMPUJE DE TRINEO', 'FUNCIONAL', { vl: 20, vm: 18, rf: 12, gm: 25, ge: 10, so: 10, pie: 5 }, ['TRINEO', 'SLED PUSH']],
  ['CIRCUITO FUNCIONAL', 'FUNCIONAL', { vl: 12, vm: 10, rf: 8, gm: 16, bf: 6, st: 4, dan: 8, ra: 12, ob: 6, da: 6, pm: 6, ge: 6 }, ['CIRCUITO', 'ENTRENAMIENTO FUNCIONAL', 'FUNCIONAL', 'HIIT', 'TABATA', 'CIRCUITO HIIT']],
  ['SENTADILLA SIN PESO', 'FUNCIONAL', { vl: 24, vm: 22, rf: 12, gm: 28, ad: 8, ge: 3, lu: 3 }, ['AIR SQUAT', 'SENTADILLA CON PESO CORPORAL', 'SENTADILLAS']],
  ['SENTADILLA CON SALTO', 'FUNCIONAL', { vl: 18, vm: 16, rf: 10, gm: 24, bf: 4, st: 3, ge: 11, so: 5, ra: 5, pie: 4 }, ['JUMP SQUAT', 'SENTADILLAS CON SALTO']],
  ['ESTOCADAS CON SALTO', 'FUNCIONAL', { vl: 18, vm: 15, rf: 10, gm: 25, gme: 7, bf: 5, ge: 8, ra: 4, ad: 4, pie: 4 }, ['JUMP LUNGES', 'ZANCADAS CON SALTO']],
  ['SENTADILLA A UNA PIERNA', 'FUNCIONAL', { vl: 20, vm: 20, rf: 10, gm: 28, gme: 8, ad: 4, ra: 5, ge: 1, pie: 4 }, ['PISTOL SQUAT', 'SENTADILLA PISTOL']],
  ['SKIPPING', 'FUNCIONAL', { rf: 20, vl: 12, vm: 10, ra: 18, ob: 8, gm: 8, ge: 8, so: 5, ti: 5, pie: 6 }, ['RODILLAS ALTAS', 'HIGH KNEES', 'CORRER EN EL LUGAR']],
  ['JUMPING JACKS', 'FUNCIONAL', { dl: 12, dan: 8, ts: 5, ad: 10, gme: 12, ge: 14, so: 8, vl: 8, vm: 6, ra: 6, ob: 5, pie: 6 }, ['TIJERAS', 'POLICHINELAS', 'SALTOS DE TIJERA']],
  ['PATINADOR', 'FUNCIONAL', { gme: 22, gm: 18, vl: 14, vm: 10, ad: 10, ge: 8, so: 6, ob: 6, pie: 6 }, ['SALTOS LATERALES', 'SKATER JUMPS', 'SKATERS']],
  ['CAMINATA DEL OSO', 'FUNCIONAL', { dan: 18, ra: 18, ob: 8, tla: 10, tl: 4, vl: 10, vm: 8, rf: 8, gm: 8, se: 8 }, ['BEAR CRAWL', 'GATEO']],
  ['PLANCHA CON TOQUE DE HOMBRO', 'FUNCIONAL', { ra: 25, ob: 20, dan: 18, se: 12, tla: 8, gm: 7, gme: 5, rf: 5 }, ['SHOULDER TAPS', 'PLANCHA TOCANDO HOMBROS']],
  ['REMO EN TRX', 'FUNCIONAL', { da: 28, tm: 22, dp: 12, rm: 8, bi: 14, br: 4, ra: 8, ab: 4 }, ['TRX REMO', 'REMO CON SUSPENSION']],
  ['GET UP TURCO', 'FUNCIONAL', { dan: 18, dl: 8, mr: 10, ra: 15, ob: 12, gm: 15, vl: 6, vm: 5, se: 6, tla: 5 }, ['TURKISH GET UP', 'LEVANTADA TURCA']],
  ['SLAM BALL', 'FUNCIONAL', { dan: 12, da: 18, ra: 22, ob: 10, tl: 8, tla: 5, gm: 10, bf: 5, lu: 5, se: 5 }, ['LANZAMIENTO DE BALON AL SUELO', 'SLAM BALLS']],
  ['PASEO DE MALETA', 'FUNCIONAL', { ob: 30, ab: 25, ts: 15, gme: 10, ra: 10, lu: 10 }, ['SUITCASE CARRY', 'CAMINATA CON UNA MANCUERNA']],

  // ───────── CARDIO ─────────
  ['RUNNING', 'CARDIO', { vl: 12, vm: 10, rf: 12, gm: 14, bf: 12, st: 8, ge: 8, so: 8, ti: 4, ra: 3, ob: 3, pie: 6 }, ['CORRER', 'TROTE', 'SALIR A CORRER', 'CARRERA', 'TROTAR']],
  ['SPRINTS', 'CARDIO', { gm: 20, bf: 15, st: 10, vl: 10, vm: 8, rf: 10, ge: 9, so: 5, ra: 4, ob: 3, pie: 6 }, ['SERIES DE VELOCIDAD', 'CARRERAS DE VELOCIDAD', 'SPRINT']],
  ['CINTA', 'CARDIO', { vl: 10, vm: 10, rf: 10, gm: 15, bf: 15, st: 10, ge: 15, so: 10, pie: 5 }, ['CORRER EN CINTA', 'TROTE EN CINTA', 'CAMINADORA']],
  ['CAMINATA', 'CARDIO', { gm: 20, bf: 12, st: 8, vl: 10, vm: 8, rf: 7, ge: 12, so: 12, ti: 5, pie: 6 }, ['CAMINAR', 'CAMINATA RAPIDA']],
  ['CAMINATA EN PENDIENTE', 'CARDIO', { gm: 28, bf: 12, st: 10, vl: 8, vm: 7, rf: 5, ge: 10, so: 10, ti: 5, pie: 5 }, ['CINTA INCLINADA', 'CAMINATA INCLINADA', 'SUBIDA']],
  ['CICLISMO', 'CARDIO', { vl: 20, vm: 18, rf: 16, gm: 12, bf: 8, st: 6, ge: 12, so: 5, lu: 3 }, ['SALIR EN BICI', 'BICI', 'MTB', 'BICICLETA EN RUTA']],
  ['BICICLETA FIJA', 'CARDIO', { vl: 25, vm: 20, rf: 20, gm: 10, bf: 10, st: 5, ge: 10 }, ['SPINNING', 'BICI FIJA']],
  ['NATACION', 'CARDIO', { da: 22, dp: 8, dan: 10, tla: 8, tl: 6, pm: 8, bi: 4, ra: 8, ob: 6, gm: 8, bf: 4, st: 3, ge: 5 }, ['NADAR', 'PILETA']],
  ['ELIPTICO', 'CARDIO', { vl: 14, vm: 12, rf: 12, gm: 18, bf: 10, st: 6, ge: 10, so: 4, da: 4, bi: 3, tla: 4, ra: 3 }, ['MAQUINA ELIPTICA', 'TRANSPORT']],
  ['ESCALADORA', 'CARDIO', { gm: 30, vl: 14, vm: 12, rf: 8, bf: 10, st: 6, ge: 8, so: 8, pie: 4 }, ['STAIR MASTER', 'STAIRMASTER', 'ESCALERA', 'SUBIR ESCALERAS']],
  ['REMO ERGOMETRO', 'CARDIO', { da: 20, tm: 10, bi: 5, vl: 15, vm: 10, rf: 5, gm: 15, bf: 5, st: 5, lu: 5, ra: 5 }, ['REMOERGOMETRO', 'ROWING']],
  ['SOGA', 'CARDIO', { ge: 35, so: 25, ti: 10, ab: 10, dl: 5, ra: 5, pie: 10 }, ['SALTAR LA SOGA', 'SALTO A LA SOGA', 'COMBA']],

  // ───────── CROSSFIT ─────────
  ['MUSCLE UP', 'CROSSFIT', { da: 28, rm: 8, tm: 8, bi: 12, br: 4, pm: 8, pi: 6, tla: 10, tl: 6, ab: 5, ra: 5 }, ['MUSCLE-UP', 'MUSCLE UPS']],
  ['TOES TO BAR', 'CROSSFIT', { ra: 35, ob: 12, rf: 15, fx: 15, ex: 3, da: 10, ad: 5, rm: 5 }, ['T2B', 'PIES A LA BARRA']],
  ['DOBLE SALTO DE SOGA', 'CROSSFIT', { ge: 30, so: 20, ti: 8, ab: 12, dan: 6, dl: 4, ra: 6, ob: 4, pie: 10 }, ['DOUBLE UNDERS', 'DU', 'DOBLES']],
  ['BURPEE SOBRE LA BARRA', 'CROSSFIT', { pm: 12, dan: 10, tla: 8, vl: 12, vm: 8, rf: 8, gm: 14, ge: 8, ra: 12, ob: 4, ps: 4 }, ['BURPEE OVER BAR', 'BURPEES SOBRE BARRA']],
  ['DEVIL PRESS', 'CROSSFIT', { dan: 16, dl: 6, tla: 8, gm: 14, bf: 8, st: 4, lu: 8, vl: 8, vm: 6, ra: 8, ab: 7, ts: 7 }, ['DEVILS PRESS']],
  ['ENVION', 'CROSSFIT', { ts: 12, dan: 14, dl: 6, tla: 8, tl: 3, gm: 16, bf: 6, st: 4, vl: 8, vm: 6, lu: 7, ab: 4, ra: 3, ge: 3 }, ['CLEAN AND JERK', 'CLEAN & JERK', 'DOS TIEMPOS']],
  ['FLEXIONES EN VERTICAL', 'CROSSFIT', { dan: 38, dl: 10, tla: 22, tl: 8, ts: 10, se: 6, ra: 6 }, ['HSPU', 'HANDSTAND PUSH UP', 'FLEXIONES EN PARADA DE MANOS']],
  ['FONDOS EN ANILLAS', 'CROSSFIT', { tla: 38, tl: 14, pi: 18, pm: 6, dan: 14, ra: 10 }, ['RING DIPS', 'FONDOS EN ARGOLLAS']],
  ['TREPADA DE SOGA', 'CROSSFIT', { da: 25, bi: 16, br: 6, fx: 13, pa: 3, dd: 2, brr: 4, rm: 8, tm: 6, ra: 10, rf: 7 }, ['ROPE CLIMB', 'TREPAR LA SOGA']],
  ['PECHO A LA BARRA', 'CROSSFIT', { da: 42, rm: 10, tm: 14, bi: 14, br: 5, dp: 5, ab: 5, ra: 5 }, ['CHEST TO BAR', 'C2B', 'DOMINADAS PECHO A LA BARRA']],
  ['DOMINADAS KIPPING', 'CROSSFIT', { da: 40, rm: 10, tm: 10, bi: 12, br: 4, ab: 6, ra: 12, ob: 6 }, ['KIPPING PULL UP', 'KIPPING']],
  ['SENTADILLA OVERHEAD', 'CROSSFIT', { vl: 18, vm: 16, rf: 10, gm: 20, dan: 10, dl: 5, ts: 6, tm: 4, lu: 5, ra: 6 }, ['OVERHEAD SQUAT', 'OHS', 'SENTADILLA CON BARRA ARRIBA']],
  ['PUSH PRESS', 'CROSSFIT', { dan: 38, dl: 14, tla: 18, tl: 5, ts: 8, vl: 6, vm: 5, gm: 4, ra: 2 }, ['PRESS DE EMPUJE']],
  ['ASSAULT BIKE', 'CROSSFIT', { vl: 15, vm: 12, rf: 12, gm: 12, bf: 8, st: 5, ge: 6, da: 6, dan: 6, bi: 4, tla: 6, ra: 4, ob: 4 }, ['AIR BIKE', 'BICICLETA DE AIRE', 'ECHO BIKE']],


  // ───────── BOXEO Y COMBATE ─────────
  ['BOXEO', 'COMBATE', { dan: 17, dl: 10, tla: 14, tl: 4, pm: 10, se: 10, ra: 12, ob: 12, da: 6, ge: 1, pie: 4 }, ['BOLSA', 'PEGAR A LA BOLSA', 'SHADOW BOXING', 'BOX', 'GUANTES']],
  ['KICKBOXING', 'COMBATE', { gm: 14, gme: 8, vl: 10, vm: 8, rf: 10, bf: 6, ob: 12, ra: 12, dan: 8, tla: 6, ge: 2, pie: 4 }, ['MUAY THAI', 'KICK BOXING', 'PATADAS A LA BOLSA']],
  ['ARTES MARCIALES', 'COMBATE', { da: 12, bi: 8, br: 4, ab: 10, tm: 6, ra: 12, ob: 10, lu: 6, gm: 10, vl: 6, vm: 4, ad: 6, dan: 6 }, ['JIU JITSU', 'BJJ', 'JUDO', 'GRAPPLING', 'LUCHA']],

  // ───────── YOGA Y PILATES ─────────
  ['YOGA', 'MOVILIDAD', { ra: 9, ob: 9, lu: 8, gm: 9, bf: 8, st: 6, vl: 6, vm: 6, dan: 8, tla: 6, ts: 5, tm: 5, ad: 5, se: 5, pie: 5 }, ['VINYASA', 'HATHA', 'CLASE DE YOGA']],
  ['PILATES', 'MOVILIDAD', { ra: 22, ob: 16, lu: 10, gm: 16, gme: 8, ad: 8, bf: 5, st: 4, dan: 4, se: 4, tm: 3 }, ['PILATES MAT', 'PILATES REFORMER', 'CLASE DE PILATES']],


  // ───────── AMPLIACIÓN 4.5.0: máquinas, variantes por implemento, calistenia y no convencionales ─────────
  // Pecho
  ['PRESS DE PECHO EN POLEA', 'PECHO', { pm: 44, ps: 12, pi: 13, dan: 15, tla: 10, se: 6 }, ['PRESS EN POLEA DE PIE', 'PRESS CON POLEAS']],
  ['PRESS DECLINADO EN MAQUINA', 'PECHO', { pi: 42, pm: 28, dan: 10, tla: 20 }, []],
  ['PRESS GUILLOTINA', 'PECHO', { ps: 38, pm: 30, dan: 20, tla: 9, tl: 3 }, ['PRESS AL CUELLO']],
  ['FLEXIONES EN ANILLAS', 'PECHO', { pm: 36, ps: 12, pi: 10, dan: 16, tla: 12, tl: 4, ra: 6, se: 4 }, ['FLEXIONES CON ANILLAS']],
  ['FLEXIONES PSEUDO PLANCHA', 'PECHO', { dan: 30, pm: 28, ps: 10, tla: 12, ra: 8, se: 7, bi: 5 }, ['PSEUDO PLANCHE', 'FLEXIONES PSEUDO PLANCHE']],
  // Espalda
  ['JALON AL PECHO EN MAQUINA', 'ESPALDA', { da: 46, rm: 12, tm: 10, bi: 14, br: 6, dp: 6, ab: 6 }, ['JALON EN MAQUINA', 'JALON CONVERGENTE']],
  ['REMO CON MANCUERNAS EN BANCO INCLINADO', 'ESPALDA', { tm: 26, da: 24, dp: 16, rm: 8, bi: 12, br: 6, ab: 8 }, ['REMO EN BANCO INCLINADO']],
  ['REMO UNILATERAL EN POLEA', 'ESPALDA', { da: 38, rm: 10, tm: 16, dp: 8, bi: 12, br: 6, ab: 6, ob: 4 }, ['REMO A UNA MANO EN POLEA']],
  ['REMO EN MULTIPOWER', 'ESPALDA', { da: 30, tm: 20, rm: 8, dp: 10, bi: 12, br: 5, lu: 8, ab: 7 }, ['REMO EN SMITH']],
  ['REMO GORILA', 'ESPALDA', { da: 32, tm: 16, rm: 8, dp: 8, bi: 10, br: 4, lu: 8, ob: 6, ab: 8 }, ['GORILLA ROW', 'REMO GORILA CON KETTLEBELL']],
  ['DOMINADAS AGARRE NEUTRO', 'ESPALDA', { da: 38, rm: 12, tm: 8, bi: 14, br: 12, brr: 6, ra: 4, ab: 6 }, ['DOMINADAS NEUTRAS']],
  ['DOMINADAS LASTRADAS', 'ESPALDA', { da: 42, rm: 12, tm: 8, bi: 14, br: 6, dp: 4, ra: 6, ab: 8 }, ['DOMINADAS CON PESO']],
  ['DOMINADAS ARQUERAS', 'ESPALDA', { da: 44, rm: 12, tm: 6, bi: 16, br: 6, dp: 4, ob: 4, ab: 8 }, ['ARCHER PULL UP']],
  ['ENCOGIMIENTOS EN MAQUINA', 'ESPALDA', { ts: 72, tm: 14, ab: 14 }, ['ENCOGIMIENTOS EN SMITH']],
  ['ENCOGIMIENTOS EN POLEA', 'ESPALDA', { ts: 68, tm: 18, ab: 14 }, []],
  ['PESO MUERTO CON BARRA HEXAGONAL', 'ESPALDA', { gm: 18, vl: 12, vm: 10, rf: 6, bf: 10, st: 6, lu: 12, ts: 8, tm: 5, ab: 8, da: 5 }, ['PESO MUERTO TRAP BAR', 'TRAP BAR']],
  ['PESO MUERTO CON MANCUERNAS', 'ESPALDA', { gm: 22, bf: 14, st: 10, lu: 14, vl: 8, vm: 6, ts: 6, tm: 6, ab: 10, da: 4 }, []],
  // Hombros
  ['PRESS MILITAR EN MULTIPOWER', 'HOMBROS', { dan: 40, dl: 22, tla: 18, tl: 6, ps: 6, ts: 4, se: 4 }, ['PRESS MILITAR EN SMITH']],
  ['VUELOS LATERALES SENTADO', 'HOMBROS', { dl: 70, dan: 8, dp: 6, ts: 10, se: 6 }, ['VUELOS LATERALES SENTADO CON MANCUERNAS']],
  ['VUELOS ANTERIORES EN POLEA', 'HOMBROS', { dan: 62, dl: 14, ps: 12, se: 6, ts: 6 }, []],
  ['VUELOS ANTERIORES CON DISCO', 'HOMBROS', { dan: 58, dl: 12, ps: 14, se: 6, ts: 6, ab: 4 }, ['ELEVACION FRONTAL CON DISCO']],
  ['PRESS DE HOMBROS CON KETTLEBELL', 'HOMBROS', { dan: 40, dl: 20, tla: 14, tl: 6, se: 6, ra: 4, ob: 4, ab: 6 }, ['PRESS CON PESA RUSA']],
  ['REMO MENTON EN POLEA', 'HOMBROS', { dl: 40, ts: 28, dan: 12, bi: 8, br: 4, ab: 8 }, []],
  ['FLEXIONES PIKE', 'HOMBROS', { dan: 40, dl: 14, tla: 18, tl: 8, ps: 10, se: 6, ra: 4 }, ['PIKE PUSH UP', 'FLEXIONES EN V INVERTIDA']],
  // Bíceps
  ['CURL SCOTT CON MANCUERNA', 'BICEPS', { bi: 66, br: 24, brr: 10 }, ['CURL PREDICADOR CON MANCUERNA']],
  ['CURL SCOTT EN MAQUINA', 'BICEPS', { bi: 68, br: 22, brr: 6, fx: 4 }, ['CURL PREDICADOR EN MAQUINA']],
  ['CURL DE BICEPS EN TRX', 'BICEPS', { bi: 58, br: 18, brr: 6, dp: 6, ra: 6, ab: 6 }, ['CURL EN TRX', 'CURL CON PESO CORPORAL']],
  // Tríceps
  ['EXTENSION DE TRICEPS EN MAQUINA', 'TRICEPS', { tla: 52, tl: 38, ex: 4, ab: 6 }, ['TRICEPS EN MAQUINA']],
  ['PRESS FRANCES EN POLEA', 'TRICEPS', { tl: 50, tla: 42, ab: 8 }, ['ROMPECRANEOS EN POLEA']],
  ['PATADA DE TRICEPS EN POLEA', 'TRICEPS', { tla: 50, tl: 34, dp: 6, ab: 10 }, []],
  ['FONDOS EN BARRA RECTA', 'TRICEPS', { tla: 34, tl: 16, pi: 22, pm: 8, dan: 14, ra: 6 }, ['STRAIGHT BAR DIPS']],
  // Piernas
  ['SENTADILLA PENDULAR', 'PIERNAS', { vl: 28, vm: 26, rf: 12, gm: 22, ad: 8, ge: 4 }, ['PENDULUM SQUAT', 'PENDULAR']],
  ['SENTADILLA CON MANCUERNAS', 'PIERNAS', { vl: 22, vm: 18, rf: 10, gm: 22, ad: 10, bf: 4, lu: 4, ab: 10 }, []],
  ['ESTOCADAS CON BARRA', 'PIERNAS', { vl: 20, vm: 18, rf: 10, gm: 26, gme: 8, ad: 8, bf: 4, lu: 6 }, []],
  ['ESTOCADAS EN MULTIPOWER', 'PIERNAS', { vl: 22, vm: 20, rf: 12, gm: 26, gme: 6, ad: 8, bf: 6 }, ['ESTOCADAS EN SMITH']],
  ['SENTADILLA COSACA', 'PIERNAS', { ad: 24, vl: 18, vm: 16, rf: 6, gm: 20, gme: 8, bf: 4, ra: 4 }, ['COSSACK SQUAT']],
  ['SENTADILLA DEL PATINADOR', 'PIERNAS', { vl: 22, vm: 20, rf: 10, gm: 26, gme: 10, bf: 4, ra: 4, ti: 4 }, ['SKATER SQUAT']],
  ['CURL FEMORAL CON MANCUERNA', 'PIERNAS', { bf: 42, st: 40, ge: 12, ab: 6 }, ['CURL FEMORAL ACOSTADO CON MANCUERNA']],
  ['PESO MUERTO RUMANO CON MANCUERNAS', 'PIERNAS', { bf: 26, st: 18, gm: 28, lu: 12, ad: 4, ab: 8, tm: 4 }, ['RUMANO CON MANCUERNAS']],
  ['SILLON DE CUADRICEPS UNILATERAL', 'PIERNAS', { rf: 32, vl: 34, vm: 34 }, ['EXTENSION DE CUADRICEPS A UNA PIERNA']],
  // Glúteos
  ['PATADA DE GLUTEO EN POLEA', 'GLUTEOS', { gm: 62, gme: 12, bf: 12, st: 6, lu: 4, ra: 4 }, ['PATADA EN POLEA']],
  ['HIP THRUST EN MULTIPOWER', 'GLUTEOS', { gm: 58, gme: 8, bf: 12, st: 6, vl: 6, vm: 4, ad: 6 }, ['HIP THRUST EN SMITH']],
  ['PATADA DE GLUTEO EN MAQUINA', 'GLUTEOS', { gm: 64, gme: 10, bf: 12, st: 8, lu: 6 }, ['PATADA EN MAQUINA']],
  // Pantorrillas
  ['GEMELOS EN MAQUINA', 'PANTORRILLAS', { ge: 58, so: 30, ti: 4, pie: 8 }, ['GEMELOS DE PIE EN MAQUINA']],
  ['GEMELOS CON MANCUERNAS', 'PANTORRILLAS', { ge: 54, so: 28, ab: 6, ti: 4, pie: 8 }, []],
  // Core (calistenia)
  ['L SIT', 'CORE', { ra: 38, rf: 18, ob: 10, tla: 12, ts: 6, se: 6, ad: 6, ab: 4 }, ['L-SIT', 'ESCUADRA']],
  ['DRAGON FLAG', 'CORE', { ra: 52, ob: 14, rf: 10, da: 10, se: 6, lu: 4, ab: 4 }, ['BANDERA DEL DRAGON']],
  ['LIMPIAPARABRISAS', 'CORE', { ob: 46, ra: 26, rf: 10, da: 6, ab: 12 }, ['WINDSHIELD WIPERS']],
  // Funcional no convencional
  ['VOLTEO DE NEUMATICO', 'FUNCIONAL', { gm: 18, vl: 12, vm: 8, bf: 8, lu: 12, ts: 8, dan: 8, tla: 6, bi: 6, ab: 8, ra: 6 }, ['TIRE FLIP', 'VOLTEO DE CUBIERTA']],
  ['GOLPES CON MAZA', 'FUNCIONAL', { ob: 22, ra: 12, da: 16, dan: 8, tla: 8, gm: 10, lu: 8, ab: 12, se: 4 }, ['SLEDGEHAMMER', 'MAZA EN NEUMATICO']],
  ['LEVANTAMIENTO DE PIEDRA', 'FUNCIONAL', { gm: 20, lu: 14, bf: 10, vl: 10, vm: 6, bi: 10, ts: 8, ra: 6, ab: 10, tm: 6 }, ['PIEDRA ATLAS', 'ATLAS STONE']],
  // Movilidad
  ['JEFFERSON CURL', 'MOVILIDAD', { lu: 36, bf: 22, st: 20, gm: 10, ra: 6, ab: 6 }, ['CURL JEFFERSON']],
  // ───────── AMPLIACIÓN 4.6.0: variantes separadas, máquinas nuevas, mano, core y piernas ─────────
  // Pecho
  ['PRESS BANCA AGARRE INVERSO', 'PECHO', { ps: 36, pm: 26, pi: 6, dan: 14, tla: 12, tl: 4, bi: 2 }, ['REVERSE GRIP BENCH', 'PRESS SUPINO']],
  ['PRESS DE PECHO HAMMER', 'PECHO', { pm: 46, ps: 12, pi: 12, dan: 14, tla: 13, se: 3 }, ['PRESS CONVERGENTE', 'PRESS ISOLATERAL']],
  ['FLEXIONES DE RODILLAS', 'PECHO', { pm: 40, ps: 12, pi: 10, dan: 15, tla: 12, tl: 4, ra: 4, se: 3 }, ['FLEXIONES APOYANDO RODILLAS', 'LAGARTIJAS DE RODILLAS']],
  ['FLEXIONES SPIDERMAN', 'PECHO', { pm: 34, ps: 10, pi: 9, dan: 14, tla: 11, tl: 3, ob: 10, ra: 5, rf: 4 }, ['SPIDERMAN PUSH UP']],
  ['CRUCE DE POLEAS UNILATERAL', 'PECHO', { pm: 48, pi: 22, ps: 12, dan: 8, ob: 5, se: 5 }, ['CRUCE A UNA MANO']],
  // Espalda
  ['DOMINADAS CON BANDA', 'ESPALDA', { da: 44, rm: 10, tm: 10, bi: 17, br: 6, ab: 6, ra: 4, dp: 3 }, ['DOMINADAS ASISTIDAS CON BANDA', 'PULL UP CON BANDA']],
  ['JALON AL PECHO AGARRE SUPINO', 'ESPALDA', { da: 40, rm: 10, tm: 9, bi: 22, br: 8, dp: 4, ab: 7 }, ['JALON SUPINO', 'JALON INVERTIDO']],
  ['REMO BAJO AGARRE ABIERTO', 'ESPALDA', { tm: 28, da: 26, dp: 15, rm: 8, bi: 11, br: 5, ab: 7 }, ['REMO SENTADO AGARRE ANCHO']],
  ['REMO ALTO EN MAQUINA', 'ESPALDA', { da: 40, rm: 14, tm: 14, dp: 8, bi: 12, br: 6, ab: 6 }, ['HIGH ROW', 'REMO ALTO HAMMER']],
  ['REMO YATES', 'ESPALDA', { da: 34, tm: 18, rm: 8, dp: 8, bi: 16, br: 5, lu: 6, ab: 5 }, ['REMO SUPINO CON BARRA', 'YATES ROW']],
  ['REMO RENEGADO', 'ESPALDA', { da: 30, tm: 14, dp: 8, bi: 10, ra: 12, ob: 10, dan: 6, tla: 4, ab: 6 }, ['RENEGADE ROW', 'REMO EN PLANCHA']],
  ['PESO MUERTO DEFICIT', 'ESPALDA', { lu: 20, gm: 22, bf: 13, st: 10, vl: 8, vm: 6, rf: 3, ts: 7, tm: 4, ab: 7 }, ['DEFICIT DEADLIFT', 'PESO MUERTO EN DEFICIT']],
  ['ENCOGIMIENTOS TRAS LA ESPALDA', 'ESPALDA', { ts: 70, tm: 18, fx: 12 }, ['ENCOGIMIENTOS DETRAS', 'SHRUG TRAS LA ESPALDA']],
  ['DOMINADAS ESCAPULARES', 'ESPALDA', { tm: 34, da: 26, ts: 10, rm: 8, se: 6, fx: 12, ex: 4 }, ['SCAPULAR PULL UP', 'RETRACCIONES EN BARRA']],
  ['EXTENSION LUMBAR EN MAQUINA', 'ESPALDA', { lu: 66, gm: 18, bf: 8, st: 8 }, ['MAQUINA DE LUMBARES', 'EXTENSION DE ESPALDA EN MAQUINA']],
  ['HIPEREXTENSIONES A 90 GRADOS', 'ESPALDA', { lu: 46, gm: 28, bf: 13, st: 13 }, ['EXTENSIONES EN GHD', 'HIPEREXTENSION HORIZONTAL']],
  ['FRONT LEVER', 'ESPALDA', { da: 36, rm: 10, tm: 10, ra: 18, ob: 6, dp: 6, tl: 6, ab: 8 }, ['PALANCA FRONTAL', 'FRONT LEVER TUCK']],
  // Hombros
  ['PRESS MILITAR SENTADO', 'HOMBROS', { dan: 46, dl: 21, tla: 16, tl: 5, ts: 7, ps: 5 }, ['PRESS MILITAR SENTADO CON BARRA', 'PRESS SENTADO CON BARRA']],
  ['PRESS DE HOMBROS CON MANCUERNAS DE PIE', 'HOMBROS', { dan: 42, dl: 22, tla: 14, tl: 5, ts: 7, ps: 4, ra: 3, ob: 3 }, ['PRESS MILITAR DE PIE CON MANCUERNAS']],
  ['VUELOS POSTERIORES EN BANCO INCLINADO', 'HOMBROS', { dp: 62, tm: 20, mr: 10, rm: 3, dl: 5 }, ['PAJARO EN BANCO', 'POSTERIORES BOCA ABAJO']],
  ['VUELOS POSTERIORES SENTADO', 'HOMBROS', { dp: 58, tm: 18, mr: 12, rm: 4, dl: 6, lu: 2 }, ['PAJARO SENTADO']],
  ['VUELOS ANTERIORES CON BARRA', 'HOMBROS', { dan: 66, ps: 14, dl: 10, se: 4, ts: 4, ab: 2 }, ['FRONTALES CON BARRA', 'ELEVACION FRONTAL CON BARRA']],
  ['ROTACION EXTERNA CON MANCUERNA', 'HOMBROS', { mr: 82, dp: 14, tm: 4 }, ['ROTACION EXTERNA ACOSTADO', 'ROTADORES CON MANCUERNA']],
  ['ROTACION INTERNA EN POLEA', 'HOMBROS', { mr: 30, pm: 25, da: 15, dan: 20, rm: 10 }, ['ROTACIONES INTERNAS']],
  ['VUELO LATERAL ACOSTADO', 'HOMBROS', { dl: 76, dan: 6, dp: 8, ts: 6, se: 4 }, ['LATERAL ACOSTADO DE COSTADO', 'LYING LATERAL RAISE']],
  ['PARADA DE MANOS', 'HOMBROS', { dan: 32, dl: 12, tla: 16, tl: 6, ts: 12, se: 8, ra: 8, fx: 6 }, ['HANDSTAND', 'VERTICAL CONTRA LA PARED']],
  ['VOLANTE CON DISCO', 'HOMBROS', { dan: 50, dl: 14, ps: 10, ob: 10, se: 8, ab: 8 }, ['BUS DRIVER', 'GIROS CON DISCO']],
  // Bíceps
  ['CURL ACOSTADO EN POLEA', 'BICEPS', { bi: 70, br: 18, brr: 6, fx: 6 }, ['CURL TUMBADO EN POLEA', 'LYING CABLE CURL']],
  ['CURL WAITER', 'BICEPS', { bi: 64, br: 22, brr: 6, fx: 8 }, ['CURL DE MESERO', 'WAITER CURL']],
  // Tríceps
  ['EXTENSION DE TRICEPS CON BARRA V', 'TRICEPS', { tla: 63, tl: 30, ab: 7 }, ['PUSHDOWN CON V', 'TRICEPS CON TRIANGULO']],
  ['EXTENSION CRUZADA EN POLEA', 'TRICEPS', { tla: 58, tl: 34, dp: 3, ab: 5 }, ['CROSS BODY EXTENSION', 'EXTENSION CRUZADA']],
  ['PRESS FRANCES SENTADO CON BARRA W', 'TRICEPS', { tl: 58, tla: 36, ab: 6 }, ['EXTENSION TRAS NUCA CON BARRA', 'FRANCES SENTADO']],
  ['FONDOS SENTADO EN MAQUINA', 'TRICEPS', { tla: 52, tl: 22, pi: 14, dan: 12 }, ['DIP MACHINE', 'FONDOS EN MAQUINA SENTADO']],
  ['PRESS CERRADO EN MULTIPOWER', 'TRICEPS', { tla: 37, tl: 15, pm: 24, pi: 5, ps: 4, dan: 15 }, ['PRESS CERRADO EN SMITH']],
  // Antebrazos y mano
  ['CURL DE MUÑECA CON MANCUERNA', 'ANTEBRAZOS', { fx: 96, brr: 4 }, ['CURL DE MUÑECA UNILATERAL']],
  ['EXTENSION DE MUÑECA CON MANCUERNA', 'ANTEBRAZOS', { ex: 94, brr: 6 }, ['CURL DE MUÑECA INVERTIDO CON MANCUERNA']],
  ['CURL DE MUÑECA EN POLEA', 'ANTEBRAZOS', { fx: 92, ex: 4, brr: 4 }, ['FLEXION DE MUÑECA EN POLEA']],
  ['CURL DE DEDOS CON BARRA', 'ANTEBRAZOS', { fx: 70, dd: 18, pa: 6, ex: 3, brr: 3 }, ['FINGER CURL', 'CURL DE DEDOS']],
  ['DESVIACION CUBITAL CON MANCUERNA', 'ANTEBRAZOS', { fx: 48, ex: 44, brr: 8 }, ['DESVIACION CUBITAL', 'ULNAR DEVIATION']],
  ['AGARRE ESTATICO CON MANCUERNAS', 'ANTEBRAZOS', { fx: 52, pa: 9, dd: 5, ex: 10, brr: 6, ts: 12, tm: 6 }, ['FARMER HOLD', 'SOSTENER MANCUERNAS']],
  ['COLGADO A UNA MANO', 'ANTEBRAZOS', { fx: 46, pa: 7, dd: 5, ex: 6, brr: 6, da: 16, ob: 6, ra: 4, rm: 4 }, ['DEAD HANG A UNA MANO']],
  ['AGARRE DE BARRA GRUESA', 'ANTEBRAZOS', { fx: 54, pa: 16, dd: 8, ex: 10, brr: 8, ts: 4 }, ['FAT GRIP', 'AGARRE GRUESO']],
  ['APRETAR PELOTA', 'ANTEBRAZOS', { fx: 56, pa: 26, dd: 10, ex: 8 }, ['PELOTA ANTIESTRES', 'SQUEEZE BALL']],
  ['FLEXIONES SOBRE LOS DEDOS', 'ANTEBRAZOS', { fx: 18, dd: 12, pa: 6, ex: 4, pm: 22, dan: 12, tla: 14, ra: 6, se: 6 }, ['FINGERTIP PUSH UP', 'FLEXIONES CON LA PUNTA DE LOS DEDOS']],
  ['CUBO DE ARROZ', 'ANTEBRAZOS', { fx: 34, ex: 28, brr: 10, pa: 14, dd: 14 }, ['RICE BUCKET', 'GARRAS EN ARROZ']],
  // Core
  ['SIT UP EN BANCO DECLINADO', 'CORE', { ra: 66, ob: 14, rf: 20 }, ['ABDOMINALES DECLINADOS', 'SIT UP DECLINADO']],
  ['CRUNCH OBLICUO', 'CORE', { ob: 62, ra: 38 }, ['ABDOMINALES OBLICUOS', 'CRUNCH CRUZADO']],
  ['FLEXION LATERAL CON MANCUERNA', 'CORE', { ob: 72, ra: 8, lu: 12, ab: 8 }, ['SIDE BEND', 'INCLINACION LATERAL CON MANCUERNA']],
  ['FLEXION LATERAL EN BANCO ROMANO', 'CORE', { ob: 68, lu: 16, ra: 8, gme: 8 }, ['HIPEREXTENSION LATERAL', 'OBLICUOS EN BANCO ROMANO']],
  ['PLANCHA CON ELEVACION DE PIERNA', 'CORE', { ra: 38, ob: 22, gm: 18, dan: 8, se: 8, lu: 6 }, ['PLANCHA CON PIERNA ARRIBA']],
  ['PLANCHA EN FITBALL', 'CORE', { ra: 50, ob: 26, dan: 10, se: 10, gm: 4 }, ['STIR THE POT', 'REMOVER LA OLLA']],
  ['RODILLAS AL PECHO EN FITBALL', 'CORE', { ra: 46, ob: 14, rf: 18, dan: 10, se: 8, tla: 4 }, ['JACKKNIFE EN PELOTA', 'ENCOGIMIENTO EN FITBALL']],
  ['PATADAS DE TIJERA', 'CORE', { ra: 46, rf: 30, ob: 12, ad: 6, se: 6 }, ['FLUTTER KICKS', 'TIJERAS ALTERNADAS']],
  ['TOQUES DE TALON', 'CORE', { ob: 66, ra: 30, se: 4 }, ['HEEL TOUCHES', 'TOQUES DE TOBILLO']],
  ['CRUNCH CON PIERNAS ELEVADAS', 'CORE', { ra: 82, ob: 12, rf: 6 }, ['CRUNCH CON PIERNAS ARRIBA', 'TOE TOUCH CRUNCH']],
  ['ROTACION CON LANDMINE', 'CORE', { ob: 56, ra: 14, dan: 12, se: 6, gme: 6, ab: 6 }, ['LANDMINE ROTATION', 'ARCOIRIS CON LANDMINE']],
  ['ROTACION DE TRONCO EN MAQUINA', 'CORE', { ob: 78, ra: 16, lu: 6 }, ['MAQUINA DE OBLICUOS', 'TORSO ROTATION']],
  ['ELEVACION DE RODILLAS COLGADO', 'CORE', { ra: 48, rf: 22, ob: 14, fx: 10, da: 6 }, ['HANGING KNEE RAISE', 'RODILLAS AL PECHO COLGADO']],
  ['MOLINO CON KETTLEBELL', 'CORE', { ob: 36, dan: 14, dl: 8, mr: 8, gm: 10, bf: 8, st: 6, ad: 6, ra: 4 }, ['WINDMILL', 'KETTLEBELL WINDMILL']],
  // Piernas
  ['SENTADILLA BARRA BAJA', 'PIERNAS', { gm: 28, vl: 18, vm: 16, rf: 8, ad: 12, lu: 10, bf: 4, st: 4 }, ['LOW BAR', 'SENTADILLA LOW BAR']],
  ['SENTADILLA EN CAJON', 'PIERNAS', { gm: 30, vl: 18, vm: 16, rf: 8, ad: 10, lu: 8, bf: 6, st: 4 }, ['BOX SQUAT', 'SENTADILLA AL CAJON']],
  ['SENTADILLA ISOMETRICA EN PARED', 'PIERNAS', { vl: 30, vm: 30, rf: 22, gm: 12, ad: 6 }, ['WALL SIT', 'SILLA EN LA PARED']],
  ['SENTADILLA BELT', 'PIERNAS', { vl: 24, vm: 22, rf: 10, gm: 28, ad: 12, bf: 2, st: 2 }, ['BELT SQUAT', 'SENTADILLA CON CINTURON']],
  ['SENTADILLA V', 'PIERNAS', { vl: 26, vm: 24, rf: 12, gm: 26, ad: 10, bf: 2 }, ['V SQUAT', 'MAQUINA V SQUAT']],
  ['HACK INVERSA', 'PIERNAS', { gm: 34, vl: 18, vm: 16, rf: 8, bf: 10, st: 8, ad: 6 }, ['HACK INVERTIDA', 'REVERSE HACK']],
  ['PRENSA VERTICAL', 'PIERNAS', { vl: 26, vm: 26, rf: 10, gm: 24, ad: 8, bf: 4, st: 2 }, ['VERTICAL LEG PRESS']],
  ['ESTOCADA ESTATICA', 'PIERNAS', { vl: 22, vm: 21, rf: 11, gm: 26, gme: 7, ad: 8, bf: 5 }, ['SPLIT SQUAT', 'ZANCADA FIJA']],
  ['ESTOCADA CRUZADA', 'PIERNAS', { gme: 18, gm: 28, vl: 16, vm: 16, rf: 8, ad: 10, bf: 4 }, ['CURTSY LUNGE', 'ESTOCADA REVERENCIA']],
  ['CURL FEMORAL EN POLEA', 'PIERNAS', { bf: 48, st: 40, ge: 8, gm: 4 }, ['CURL FEMORAL DE PIE EN POLEA']],
  ['ADUCCION EN POLEA', 'PIERNAS', { ad: 88, gm: 4, ob: 4, ra: 4 }, ['ADUCCION DE CADERA EN POLEA']],
  ['NORDICO INVERSO', 'PIERNAS', { rf: 40, vl: 26, vm: 26, ra: 8 }, ['REVERSE NORDIC', 'NORDICO DE CUADRICEPS']],
  ['SENTADILLA HACK CON BARRA', 'PIERNAS', { vl: 24, vm: 24, rf: 12, gm: 18, ad: 8, ts: 4, ab: 10 }, ['HACK CON BARRA', 'BARBELL HACK SQUAT']],
  // Glúteos
  ['MULTICADERA ABDUCCION', 'GLUTEOS', { gme: 76, gm: 18, ob: 6 }, ['ABDUCCION EN MULTICADERA']],
  ['HIPEREXTENSION INVERSA', 'GLUTEOS', { gm: 54, lu: 22, bf: 12, st: 12 }, ['REVERSE HYPER', 'HIPEREXTENSION INVERTIDA']],
  ['PUENTE DE GLUTEOS A UNA PIERNA', 'GLUTEOS', { gm: 56, gme: 14, bf: 16, st: 10, lu: 4 }, ['PUENTE UNILATERAL', 'SINGLE LEG GLUTE BRIDGE']],
  ['PUENTE DE GLUTEOS CON BARRA', 'GLUTEOS', { gm: 66, gme: 6, bf: 10, st: 8, vl: 5, vm: 5 }, ['PUENTE CON BARRA', 'GLUTE BRIDGE CON BARRA']],
  ['ELEVACION LATERAL DE PIERNA ACOSTADO', 'GLUTEOS', { gme: 82, gm: 8, ob: 10 }, ['ABDUCCION ACOSTADO', 'PATADA LATERAL ACOSTADO']],
  ['HIDRANTE', 'GLUTEOS', { gme: 74, gm: 20, ob: 6 }, ['FIRE HYDRANT', 'PATADA DE PERRO']],
  ['PESO MUERTO CON KETTLEBELL', 'GLUTEOS', { gm: 32, bf: 18, st: 14, lu: 14, vl: 6, vm: 4, ab: 12 }, ['DEADLIFT CON PESA RUSA']],
  // Pantorrillas
  ['GEMELOS EN HACK', 'PANTORRILLAS', { ge: 63, so: 26, ti: 4, pie: 7 }, ['GEMELOS EN MAQUINA HACK']],
  ['SALTOS DE TOBILLO', 'PANTORRILLAS', { ge: 46, so: 24, ti: 10, rf: 4, vl: 3, vm: 3, pie: 10 }, ['POGO JUMPS', 'SALTOS POGO']],
  ['CAMINATA EN PUNTAS DE PIE', 'PANTORRILLAS', { ge: 40, so: 34, ti: 6, ab: 8, pie: 12 }, ['CAMINATA EN PUNTAS', 'TIPTOE WALK']],
  // Funcional
  ['PASEO DEL CAMARERO', 'FUNCIONAL', { dan: 22, dl: 14, ts: 16, se: 10, ob: 14, ra: 12, tla: 6, ab: 6 }, ['OVERHEAD CARRY', 'WAITER WALK']],
  ['LEVANTAMIENTO DE SANDBAG', 'FUNCIONAL', { gm: 22, lu: 14, bf: 8, vl: 12, vm: 8, bi: 10, ts: 8, ra: 8, ab: 10 }, ['SANDBAG', 'BOLSA DE ARENA']],
  ['ARRASTRE DE TRINEO', 'FUNCIONAL', { vl: 22, vm: 20, rf: 14, gm: 14, ge: 8, ab: 10, da: 8, pie: 4 }, ['SLED PULL', 'TIRAR DEL TRINEO']],
  ['SALTO HORIZONTAL', 'FUNCIONAL', { gm: 26, vl: 16, vm: 12, rf: 10, bf: 8, ge: 11, so: 6, ra: 6, pie: 5 }, ['BROAD JUMP', 'SALTO EN LARGO']],
  ['LANZAMIENTO LATERAL DE BALON', 'FUNCIONAL', { ob: 40, ra: 14, gm: 14, dan: 10, pm: 8, gme: 8, se: 6 }, ['ROTATIONAL THROW', 'LANZAMIENTO ROTACIONAL']],
  ['SNATCH CON KETTLEBELL', 'FUNCIONAL', { gm: 24, bf: 12, st: 8, lu: 12, dan: 12, dl: 8, ts: 10, ab: 8, ra: 6 }, ['ARRANQUE CON KETTLEBELL', 'KB SNATCH']],
  ['HALO CON KETTLEBELL', 'FUNCIONAL', { dan: 24, dl: 20, dp: 10, tla: 10, ts: 10, ra: 10, ob: 10, ab: 6 }, ['HALO']],
  ['CAMINATA DE GUSANO', 'FUNCIONAL', { dan: 18, ra: 22, bf: 14, st: 12, pm: 10, tla: 10, se: 8, gm: 6 }, ['INCHWORM', 'GUSANO']],
  // Cardio
  ['SKI ERG', 'CARDIO', { da: 24, tl: 14, ra: 14, ob: 6, dan: 6, gm: 12, bf: 6, vl: 8, vm: 6, rm: 4 }, ['ESQUI ERGOMETRO', 'SKIERG']],
  ['BICICLETA RECLINADA', 'CARDIO', { vl: 24, vm: 22, rf: 16, gm: 14, bf: 10, st: 6, ge: 8 }, ['BICI RECLINADA', 'RECUMBENT']],
  ['STEPPER', 'CARDIO', { gm: 26, vl: 18, vm: 16, rf: 10, bf: 8, st: 6, ge: 6, so: 6, pie: 4 }, ['MAQUINA DE STEP', 'ESCALADOR DE PEDALES']],
  // CrossFit
  ['MUSCLE UP EN ANILLAS', 'CROSSFIT', { da: 26, rm: 8, tm: 8, bi: 12, br: 4, pm: 8, pi: 8, tla: 10, tl: 6, ab: 6, ra: 4 }, ['RING MUSCLE UP']],
  ['GHD SIT UP', 'CROSSFIT', { ra: 50, rf: 30, ob: 14, ad: 6 }, ['SIT UP EN GHD']],
  ['WALL WALK', 'CROSSFIT', { dan: 30, dl: 10, tla: 16, ts: 10, se: 10, ra: 14, gm: 4, ab: 6 }, ['CAMINATA EN LA PARED', 'SUBIDA A LA PARED']],
  ['CAMINATA EN VERTICAL', 'CROSSFIT', { dan: 30, dl: 14, tla: 14, tl: 6, ts: 12, se: 10, ra: 8, fx: 6 }, ['HANDSTAND WALK', 'CAMINAR CON LAS MANOS']],
  ['ARRANQUE CON MANCUERNA', 'CROSSFIT', { gm: 22, bf: 10, st: 6, vl: 8, vm: 6, lu: 10, dan: 14, dl: 8, ts: 8, ab: 8 }, ['DUMBBELL SNATCH', 'SNATCH CON MANCUERNA']],
  ['TIRON ALTO SUMO', 'CROSSFIT', { gm: 22, ad: 10, vl: 10, vm: 8, lu: 10, ts: 18, dl: 10, bf: 6, ab: 6 }, ['SUMO DEADLIFT HIGH PULL', 'SDHP']],
  ['CARGADA COLGANTE', 'CROSSFIT', { ts: 22, gm: 20, bf: 12, st: 6, vl: 8, vm: 6, lu: 10, dan: 6, ab: 6, ge: 4 }, ['HANG POWER CLEAN', 'HANG CLEAN']],
  ['ESTOCADAS CON PESO SOBRE LA CABEZA', 'CROSSFIT', { vl: 16, vm: 14, rf: 8, gm: 22, gme: 8, dan: 10, dl: 6, ts: 6, ra: 6, ob: 4 }, ['OVERHEAD LUNGE', 'ZANCADAS OVERHEAD']],
];

/*
 * Actividades retiradas del catálogo en 4.6.0 (baile y deportes). No aparecen en la biblioteca ni en el selector,
 * pero los registros viejos siguen sumando a las analíticas: se cuentan como actividad aeróbica por minutos (CARDIO)
 * con su reparto muscular de siempre.
 */
const RETIRED_ENTRIES = [
  ['SAMBA', { gm: 20, gme: 12, vl: 10, vm: 9, rf: 6, ge: 16, so: 8, ob: 8, ra: 6, ad: 5 }, ['BAILE DE SAMBA', 'SAMBA BRASILERA', 'CARNAVAL']],
  ['ZUMBA', { gm: 16, gme: 8, vl: 10, vm: 8, rf: 8, bf: 5, ge: 14, so: 6, ob: 8, ra: 8, dan: 5, ad: 4 }, ['ZUMBA FITNESS', 'CLASE DE ZUMBA']],
  ['SALSA', { gm: 14, gme: 12, ge: 16, so: 8, vl: 8, vm: 7, rf: 5, ob: 10, ra: 8, ad: 6, dan: 3, ab: 3 }, ['BACHATA', 'MERENGUE', 'BAILE LATINO']],
  ['CUMBIA', { ge: 18, so: 8, vl: 10, vm: 8, rf: 6, gm: 14, gme: 8, ob: 10, ra: 8, ad: 5, ti: 5 }, ['BAILE DE CUMBIA', 'CUMBIA Y FOLKLORE']],
  ['REGGAETON', { gm: 22, gme: 12, vl: 12, vm: 10, rf: 6, ge: 10, so: 4, ob: 8, ra: 8, ad: 4, lu: 4 }, ['BAILE DE REGGAETON', 'PERREO']],
  ['AEROBICO', { vl: 14, vm: 12, rf: 8, gm: 16, bf: 6, st: 4, ge: 14, so: 6, ra: 6, ob: 4, dan: 5, dl: 3, ad: 2 }, ['AEROBICA', 'STEP', 'CLASE DE AEROBICA', 'BAILE LIBRE']],
  ['FUTBOL', { vl: 14, vm: 10, rf: 12, gm: 14, gme: 6, bf: 10, st: 6, ge: 12, so: 5, ti: 3, ra: 4, ad: 4 }, ['FUTBOL 5', 'FUTBOL 11', 'FUTSAL', 'PARTIDO DE FUTBOL']],
  ['PADEL', { ge: 12, so: 6, vl: 10, vm: 8, rf: 6, gm: 10, gme: 6, ob: 12, ra: 8, dan: 8, dl: 4, tla: 4, ab: 6 }, ['PARTIDO DE PADEL']],
  ['TENIS', { ge: 10, so: 5, vl: 10, vm: 8, rf: 5, gm: 10, gme: 6, ob: 12, ra: 8, dan: 8, dl: 4, tla: 6, ab: 8 }, ['PARTIDO DE TENIS']],
  ['BASQUET', { vl: 14, vm: 10, rf: 8, gm: 14, ge: 16, so: 8, ti: 4, dan: 8, tla: 6, ra: 6, ob: 6 }, ['BASQUETBOL', 'BASKET', 'BALONCESTO']],
  ['VOLEY', { ge: 14, so: 6, vl: 14, vm: 10, rf: 8, gm: 12, dan: 10, dl: 4, tla: 6, ra: 8, ob: 4, ab: 4 }, ['VOLEIBOL', 'VOLEYBOL', 'VOLLEY']],
  ['ESCALADA', { da: 22, rm: 6, tm: 8, bi: 14, br: 6, fx: 18, ex: 4, dp: 6, ra: 8, gm: 4, vl: 2, vm: 2 }, ['ESCALADA DEPORTIVA', 'BOULDER', 'ROCODROMO']],
];
export const RETIRED_CATEGORY = 'CARDIO';

// Normaliza nombres para que "press  banca" y "PRESS BANCA" sean el mismo ejercicio.
export const normalizeExerciseName = (rawName) => {
  if (typeof rawName !== 'string') return '';
  return rawName
    .normalize('NFD')
    // La Ñ se conserva ("CURL ARAÑA", no "CURL ARANA"): se recompone antes de quitar el resto de los diacríticos.
    .replace(/([nN])\u0303/g, (_, letter) => (letter === 'n' ? 'ñ' : 'Ñ'))
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
};

const withoutEnyeFor = (name, aliasList) =>
  [name, ...aliasList.map(normalizeExerciseName)].filter((label) => label.includes('Ñ')).map((label) => label.replace(/Ñ/g, 'N'));

/*
 * Redondeo por mayor resto: convierte porcentajes fraccionarios (de los códigos compuestos) en enteros
 * que siguen sumando exactamente `total`. Los músculos que quedan en 0% se descartan.
 */
const roundToTotal = (raw, total) => {
  const entries = Object.entries(raw).map(([id, value]) => ({ id, floor: Math.floor(value), rest: value - Math.floor(value) }));
  let missing = total - entries.reduce((sum, entry) => sum + entry.floor, 0);
  [...entries].sort((a, b) => b.rest - a.rest).forEach((entry) => {
    if (missing > 0) {
      entry.floor += 1;
      missing -= 1;
    }
  });
  return Object.fromEntries(entries.filter((entry) => entry.floor > 0).map((entry) => [entry.id, entry.floor]));
};

const CATEGORY_IDS = new Set(CATEGORIES.map(({ id }) => id));

// Convierte códigos → ids y porcentajes → fracciones; valida la integridad del diccionario al cargar.
const buildCatalog = () => {
  const catalog = {};
  const aliases = {};
  const problems = [];

  CATALOG_ENTRIES.forEach(([rawName, category, codes, aliasList]) => {
    const name = normalizeExerciseName(rawName);
    if (catalog[name] || aliases[name]) problems.push(`Duplicado: ${name}`);
    if (!CATEGORY_IDS.has(category)) problems.push(`Categoría inválida en ${name}: ${category}`);

    let total = 0;
    const raw = {};
    Object.entries(codes).forEach(([code, percent]) => {
      total += percent;
      const parts = COMPOSITE_CODES[code] ?? (CODE_TO_MUSCLE[code] ? { [CODE_TO_MUSCLE[code]]: 1 } : null);
      if (!parts) {
        problems.push(`Código desconocido en ${name}: ${code}`);
        return;
      }
      Object.entries(parts).forEach(([muscleId, ratio]) => { raw[muscleId] = (raw[muscleId] ?? 0) + percent * ratio; });
    });
    if (total !== 100) problems.push(`${name}: la distribución suma ${total}`);
    const distribution = roundToTotal(raw, total);

    const primaryMuscle = Object.entries(distribution).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'otros';
    catalog[name] = { name, category, distribution, primaryMuscle, aliases: [...new Set([...aliasList.map(normalizeExerciseName), ...withoutEnyeFor(name, aliasList)])] };

    // Los nombres con Ñ se guardaban antes sin ella ("CURL DE MUNECA"): se agregan como alias para no perder historial.
    const withoutEnye = withoutEnyeFor(name, aliasList);
    [...aliasList, ...withoutEnye].forEach((alias) => {
      const key = normalizeExerciseName(alias);
      if (key !== name) aliases[key] = name;
    });
  });

  Object.keys(aliases).forEach((alias) => {
    if (catalog[alias]) problems.push(`Alias que pisa un ejercicio: ${alias}`);
  });
  if (problems.length > 0 && import.meta.env?.DEV) console.warn('[exercises] Diccionario inconsistente:', problems);

  return { catalog, aliases, problems };
};

const { catalog: CATALOG, aliases: ALIASES, problems: CATALOG_PROBLEMS } = buildCatalog();

// Historial de actividades retiradas: nombre (o alias) → { distribución en %, categoría }.
const RETIRED = (() => {
  const table = {};
  RETIRED_ENTRIES.forEach(([rawName, codes, aliasList]) => {
    const raw = {};
    Object.entries(codes).forEach(([code, percent]) => {
      const parts = COMPOSITE_CODES[code] ?? { [CODE_TO_MUSCLE[code]]: 1 };
      Object.entries(parts).forEach(([muscleId, ratio]) => { raw[muscleId] = (raw[muscleId] ?? 0) + percent * ratio; });
    });
    const meta = Object.freeze({ name: normalizeExerciseName(rawName), category: RETIRED_CATEGORY, distribution: roundToTotal(raw, 100), retired: true });
    [rawName, ...aliasList].forEach((label) => { table[normalizeExerciseName(label)] = meta; });
  });
  return table;
})();

// Meta de una actividad retirada (o null): solo para que el historial siga contando en las analíticas.
export const getRetiredActivity = (exerciseName) => RETIRED[normalizeExerciseName(exerciseName)] ?? null;

export const EXERCISE_CATALOG = Object.freeze(CATALOG);
export const EXERCISE_ALIASES = Object.freeze(ALIASES);
export const CATALOG_INTEGRITY_PROBLEMS = Object.freeze(CATALOG_PROBLEMS);
export const CATALOG_EXERCISE_NAMES = Object.freeze(Object.keys(EXERCISE_CATALOG).sort((a, b) => a.localeCompare(b, 'es')));

// Nombre canónico: resuelve alias ("ALT CON MANCUERNA" → "CURL ALTERNADO CON MANCUERNAS").
export const canonicalExerciseName = (rawName) => {
  const normalized = normalizeExerciseName(rawName);
  return ALIASES[normalized] ?? normalized;
};

export const getExerciseMeta = (exerciseName) => EXERCISE_CATALOG[canonicalExerciseName(exerciseName)] ?? null;

// ───────── Inferencia automática para ejercicios fuera del diccionario ─────────

// Palabras que no identifican al ejercicio (equipamiento, posición, conectores).
const GENERIC_TOKENS = new Set([
  'DE', 'DEL', 'CON', 'EN', 'AL', 'LA', 'EL', 'LOS', 'LAS', 'Y', 'A', 'PARA', 'POR', 'SIN',
  'MANCUERNA', 'MANCUERNAS', 'BARRA', 'POLEA', 'MAQUINA', 'SENTADO', 'PARADO', 'PIE', 'UNILATERAL',
  'AGARRE', 'CERRADO', 'ABIERTO', 'SMITH', 'MULTIPOWER', 'DISCO', 'BANDA', 'CABLE', 'SOGA', 'KETTLEBELL',
]);

// Si nada se parece, palabras clave → reparto macro (mismo que usa el historial legado).
const KEYWORD_RULES = [
  [/BICEP|CURL/, 'biceps'],
  [/TRICEP|FRANCES|PUSHDOWN|FONDO/, 'triceps'],
  [/PECHO|PECTORAL|BANCA|APERTURA|CRUCE/, 'pecho'],
  [/HOMBRO|DELTOID|MILITAR|VUELO|LATERAL|ARNOLD/, 'hombros'],
  [/ESPALDA|DORSAL|REMO|JALON|DOMINAD|PULL/, 'espalda'],
  [/GLUTEO|CADERA|HIP|PATADA/, 'gluteos'],
  [/FEMORAL|ISQUIO/, 'isquiotibiales'],
  [/CUADRICEP|SENTADILLA|PRENSA|ESTOCADA|ZANCADA|PIERNA/, 'cuadriceps'],
  [/ADUCTOR/, 'aductores'],
  [/GEMELO|PANTORRILLA|SOLEO|TALON/, 'gemelos'],
  [/ABDOMINAL|ABS|CRUNCH|PLANCHA|OBLICUO|CORE/, 'abdominales'],
];

const meaningfulTokens = (name) => normalizeExerciseName(name).split(' ').filter((token) => token.length > 1 && !GENERIC_TOKENS.has(token));

// Índice de búsqueda: nombre canónico + alias, tokenizados una sola vez.
const SIMILARITY_INDEX = Object.values(CATALOG).flatMap((entry) =>
  [entry.name, ...entry.aliases].map((label) => ({ entry, tokens: new Set(meaningfulTokens(label)) })),
);

const MIN_SIMILARITY = 0.5;
const inferenceCache = new Map();

/**
 * Estima músculos y categoría de un ejercicio que no está en el diccionario.
 * 1) Ejercicio más parecido por palabras significativas (Dice ≥ 0.5) → copia su reparto.
 * 2) Palabra clave → reparto macro. 3) Sin datos → null.
 * Memoizado: se llama en cada cálculo de analíticas.
 */
export const inferExerciseMeta = (rawName) => {
  const name = canonicalExerciseName(rawName);
  if (!name) return null;
  if (inferenceCache.has(name)) return inferenceCache.get(name);

  let result = null;
  try {
    const queryTokens = meaningfulTokens(name);
    let best = null;
    if (queryTokens.length > 0) {
      SIMILARITY_INDEX.forEach(({ entry, tokens }) => {
        if (tokens.size === 0) return;
        const shared = queryTokens.filter((token) => tokens.has(token)).length;
        const score = (2 * shared) / (queryTokens.length + tokens.size); // Coeficiente de Dice
        if (shared > 0 && (!best || score > best.score)) best = { entry, score };
      });
    }
    if (best && best.score >= MIN_SIMILARITY) {
      result = { distribution: best.entry.distribution, category: best.entry.category, source: 'similar', matchedName: best.entry.name };
    } else {
      const rule = KEYWORD_RULES.find(([pattern]) => pattern.test(name));
      if (rule) {
        const distribution = LEGACY_MUSCLE_DISTRIBUTION[rule[1]];
        const topMuscle = Object.entries(distribution).sort((a, b) => b[1] - a[1])[0][0];
        result = { distribution, category: MUSCLE_BY_ID[topMuscle]?.category ?? 'OTROS', source: 'keyword', matchedName: null };
      }
    }
  } catch {
    result = null; // La inferencia es auxiliar: nunca debe romper un cálculo.
  }
  inferenceCache.set(name, result);
  return result;
};

export const getExerciseCategory = (item) => {
  const meta = getExerciseMeta(item?.exercise) ?? getRetiredActivity(item?.exercise);
  if (meta) return meta.category;
  const muscle = MUSCLE_BY_ID[item?.muscle];
  if (muscle) return muscle.category;
  return inferExerciseMeta(item?.exercise)?.category ?? 'OTROS';
};

/**
 * Distribución { muscleId: fracción 0–1 } para un log o ítem de rutina.
 * Prioridad: catálogo → músculo guardado (datos viejos) → macro legado → inferencia automática → vacío.
 */
export const resolveMuscleDistribution = (item) => {
  const meta = getExerciseMeta(item?.exercise) ?? getRetiredActivity(item?.exercise);
  const source = meta?.distribution
    ?? (MUSCLE_IDS.includes(item?.muscle) ? { [item.muscle]: 100 } : null)
    ?? LEGACY_MUSCLE_DISTRIBUTION[item?.muscle]
    ?? inferExerciseMeta(item?.exercise)?.distribution
    ?? null;
  if (!source) return {};
  return Object.fromEntries(Object.entries(source).map(([muscleId, percent]) => [muscleId, percent / 100]));
};

// Músculo con mayor participación (compatibilidad con código que esperaba un único músculo).
export const resolveMuscle = (item) => {
  const entries = Object.entries(resolveMuscleDistribution(item));
  if (entries.length === 0) return 'otros';
  return entries.sort((a, b) => b[1] - a[1])[0][0];
};

// Búsqueda para el selector de ejercicios: coincide por nombre o alias, sin tildes; prioriza "empieza con".
export const searchExercises = (query, extraNames = []) => {
  const normalizedQuery = normalizeExerciseName(query);
  const customEntries = extraNames
    .map(canonicalExerciseName)
    .filter((name) => name && !CATALOG[name])
    .map((name) => ({ name, category: getRetiredActivity(name)?.category ?? inferExerciseMeta(name)?.category ?? 'OTROS', aliases: [], isCustom: true }));
  const pool = [...Object.values(CATALOG), ...new Map(customEntries.map((entry) => [entry.name, entry])).values()];
  if (!normalizedQuery) return pool.map((entry) => ({ entry, matchedAlias: null, rank: 2 })).sort((a, b) => a.entry.name.localeCompare(b.entry.name, 'es'));

  const queryTokens = normalizedQuery.split(' ');
  const results = [];
  pool.forEach((entry) => {
    const labels = [entry.name, ...entry.aliases];
    const matched = labels.find((label) => queryTokens.every((token) => label.includes(token)));
    if (!matched) return;
    const rank = matched.startsWith(normalizedQuery) ? 0 : 1;
    results.push({ entry, matchedAlias: matched === entry.name ? null : matched, rank });
  });
  return results.sort((a, b) => a.rank - b.rank || a.entry.name.localeCompare(b.entry.name, 'es'));
};
