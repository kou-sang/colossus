# Changelog

Todos los cambios relevantes de **Colossus** (antes "Incursores" / "gym-tracker") se documentan en este archivo.

El formato sigue [Keep a Changelog 1.1.0](https://keepachangelog.com/es-ES/1.1.0/) y el versionado sigue [Versionado Semántico 2.0.0](https://semver.org/lang/es/):

- **MAJOR** (`X.0.0`): cambios que rompen compatibilidad o reescrituras (modelo de datos, arquitectura).
- **MINOR** (`0.X.0`): funcionalidades nuevas compatibles hacia atrás.
- **PATCH** (`0.0.X`): correcciones de errores y ajustes menores.

Tipos de cambio: `Added` (agregado), `Changed` (cambiado), `Deprecated` (obsoleto), `Removed` (eliminado), `Fixed` (corregido), `Security` (seguridad).

Convención de commits recomendada: [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
Cada versión se etiqueta en git como `vX.Y.Z` y la versión vigente se toma de `package.json` (se muestra en la pestaña Perfil).

> Las versiones anteriores a 4.1.0 se reconstruyeron a partir del historial de git. La numeración salta de 2.x a 4.0.0 porque así se nombró ese lanzamiento ("Colossus v4").

## [Unreleased]

## [4.10.0] - 2026-11-04

### Changed
- **Mapa de Recuperación: ahora estima la fatiga de hoy** (verde = recuperado, amarillo = recuperándose, naranja/rojo = fatigado) en lugar de pintar los días desde el último estímulo, que mostraba en verde un músculo recién entrenado y podía leerse como "listo". El modelo corrige lo que hacía fallar al viejo mapa de fatiga, que mostraba músculos "recuperados" en personas agotadas:
  - cuenta la carga real de cada serie para el músculo (ver abajo) en lugar de diluirla entre todos los músculos;
  - recupera más lento: la fatiga se reduce a la mitad cada ~36 h en músculos grandes, ~30 h en medianos y ~24 h en chicos (una sesión exigente necesita 2 a 4 días), antes 18–30 h;
  - con mucho volumen en la semana (más de 20 series efectivas) la recuperación se estira hasta el doble;
  - pondera cada serie por el esfuerzo registrado (RIR).
  Al tocar un músculo se ve su estado, en cuánto tiempo se recupera, la carga de los últimos 7 días y las sesiones que la generaron.
- **Series efectivas con conteo fraccional** (mapa de Estímulo, detalle del músculo, resumen mensual y análisis de rutinas): la serie cuenta entera para los músculos principales del ejercicio, media para los sinergistas y poco para los estabilizadores. Antes cada serie se repartía según el % de la ficha (3 series de press banca = 1,2 series de pecho), así que ningún músculo llegaba a las 10–20 series semanales de referencia aunque entrenaras mucho. Correr, boxeo o yoga suman como máximo media serie por músculo.
- **Promedio semanal desde tu primer registro:** si empezaste a registrar después del inicio del rango, el mapa de Estímulo, el tonelaje por semana y el resumen mensual promedian desde ese día y no dividen por semanas en las que todavía no usabas la app.

## [4.9.0] - 2026-11-04

### Added
- **Músculos de manos y pies:** palma de la mano (tenar, hipotenar y lumbricales), dedos de la mano (falanges e interóseos) y pie (arco plantar y dedos). Se dibujan en los mapas musculares (de frente y de espaldas) y en la ficha de cada ejercicio. Los ejercicios de agarre (hand grip, pelota, pinza con discos, barra gruesa, colgados, cubo de arroz…), las elevaciones de talones y la carrera, la soga y los saltos ahora cargan una parte en estos músculos, y todo lo que usa agarre suma un poco a la palma y a los dedos. Las categorías pasan a llamarse "Antebrazos y manos" y "Pantorrillas y pies".
- **Detalle de Recuperación:** al tocar un músculo en el mapa de Recuperación se ve su historial: cuándo lo entrenaste, con qué ejercicio, qué % del ejercicio recayó en él y cuántas series efectivas sumó.

### Changed
- **Encabezado de los gráficos:** nombre, botón de información y botón de plegar en la misma fila; los selectores (Recuperación/Estímulo, ejercicio de Progresión de fuerza) van en una fila debajo.
- En el mapa de Recuperación, manos y pies cuentan como entrenados desde el 5 % de participación (el resto de los músculos sigue desde el 15 %), porque son músculos chicos que rara vez reciben más carga. El análisis de rutinas no los reporta como "sin trabajar".
- En el detalle de Estímulo, cada ejercicio muestra sus series efectivas y debajo el % del ejercicio y el % del total del músculo (los nombres ya no quedan cortados por la cifra).

### Removed
- **Mapa de fatiga muscular** (lo reemplaza el mapa de Recuperación).
- **Gráfico "Series efectivas por músculo"** (el mapa de Estímulo muestra lo mismo).
- Botón "Filtrar solo este músculo" del detalle del mapa: no hacía nada visible y dejaba los demás gráficos filtrados sin forma clara de deshacerlo.

### Fixed
- Seleccionar Semitendinoso (y otros músculos de nombre largo) ensanchaba el mapa más que la pantalla en el celular. Los nombres se cortan en varias líneas y ninguna columna de Analíticas puede ensancharse más que su contenedor.
- Al volver a tocar un músculo para deseleccionarlo quedaba un borde blanco (el anillo de foco). Ahora solo se marca el foco al navegar con teclado y el realce de hover no queda "pegado" en pantallas táctiles.

## [4.8.0] - 2026-11-04

### Added
- **Analíticas — filtro único de músculos y categorías:** un solo bloque con selección múltiple que reemplaza a los filtros separados de categorías y músculos. Incluye "Todo", un "Todos" para cada categoría muscular, cada músculo suelto y las actividades sin músculos propios (Funcional, Cardio, CrossFit, Combate, Yoga y Pilates, Otros). Un registro entra si es de una categoría elegida o si trabaja algún músculo elegido. Si eliges uno por uno todos los músculos de una categoría, se marca su "Todos".
- **Analíticas — gráficos plegables:** Consistencia, Mapa muscular, Mapa de fatiga, Series efectivas, Progresión de fuerza, Tonelaje semanal, Calorías y alimentación y Resumen del mes se pueden plegar con la flecha. Plegados no se dibujan, así la pestaña carga más rápido.
- **Progresión de fuerza — "Promedio de la selección"** (opción por defecto): una línea por perfil con el cambio promedio (%) del 1RM estimado de todos los ejercicios que entran en el filtro. Cada ejercicio se mide respecto de su primer registro del rango, mantiene su último valor hasta que lo vuelves a hacer y pesa según cuánto trabaja los músculos elegidos. Los ejercicios sueltos siguen disponibles en el selector, en kg.
- **Memoria por dispositivo:** se recuerda qué gráficos y bloques de filtros quedaron plegados y si los filtros estaban ocultos. En la pestaña Ejercicios también se recuerdan la búsqueda, la categoría, el ejercicio abierto y la posición de la lista: al tocar "Volver a la lista" (o al regresar a la pestaña) sigues donde estabas.

### Changed
- `SectionCard` acepta `collapseKey` para volverse plegable y recordar su estado (nuevo hook `usePersistentState`).

## [4.7.0] - 2026-11-04

### Added
- **Ficha del ejercicio desde Inicio:** al tocar el nombre de un ejercicio en *Plan de hoy* o en *Registrado hoy* se abre la misma ficha de la pestaña Ejercicios (ejecución en 3 vistas, músculos, técnica, consejos, errores, claves y alternativas) en una ventana. Las alternativas se pueden recorrer dentro de la ventana con "Volver" al ejercicio anterior, y desde ahí también se puede añadir a una rutina. Los ejercicios con nombre propio (fuera de la biblioteca) muestran un aviso en lugar de una ficha vacía.

### Changed
- La ficha del ejercicio pasa a ser un componente propio (`ExerciseDetail`) compartido por la biblioteca y la ventana. El código de la ficha se descarga recién al pasar el puntero o tocar un ejercicio, así Inicio no carga el motor de dibujo.

## [4.6.0] - 2026-11-03

### Added
- **Nuevo motor de dibujo de ejercicios:** esqueleto 3D con cinemática directa e inversa (codos, rodillas y puños apuntan a donde corresponde) y un cuerpo hecho de secciones musculares en lugar de figuras geométricas. Se distinguen mano, muñeca y antebrazo; pie, tobillo y pantorrilla; pectorales, abdominales, oblicuos, trapecio, glúteos y la silueta de cada músculo de brazos y piernas. Las extremidades del fondo se dibujan atenuadas para que se lea la profundidad en las 3 vistas.
- **Equipamiento dibujado con sus proporciones:** barras con discos, mancuernas, kettlebells, barra W y hexagonal, poleas con su torre y cable, manijas (estribo, soga, barra, V, tobillera), bancos planos/inclinados/declinados, máquinas con su almohadilla, rodillo, palanca y pila de discos, multipower, rack, paralelas, barra fija, anillas, TRX, cajones, fitball, trineo, neumático, cinta, bicicletas, elíptico, remo y ski erg.
- **101 ejercicios nuevos (402 en total), todos distintos entre sí:** más máquinas y variantes por implemento (press de pecho hammer, remo alto en máquina, extensión lumbar en máquina, rotación de tronco en máquina, hack inversa, sentadilla V, prensa vertical, multicadera abducción, gemelos en hack…), mano y antebrazo (curl de muñeca con mancuerna y en polea, extensión de muñeca, desviación cubital, curl de dedos, agarre estático, barra gruesa, colgado a una mano, apretar pelota, cubo de arroz, flexiones sobre los dedos), abdomen (sit up declinado, crunch oblicuo, flexiones laterales, planchas con elevación y en fitball, patadas de tijera, toques de talón, rotación con landmine, molino con kettlebell…), piernas y glúteos (sentadilla barra baja, en cajón, isométrica en pared, con cinturón, estocada estática y cruzada, nórdico inverso, puentes con barra y a una pierna, hidrante, hiperextensión inversa…) y acondicionamiento (ski erg, bicicleta reclinada, stepper, muscle up en anillas, GHD sit up, wall walk, caminata en vertical, arranque con mancuerna, cargada colgante, tirón alto sumo, paseo del camarero, sandbag, arrastre de trineo…). Cada uno con ficha, dibujo en 3 vistas y distribución muscular propia.
- **Variantes separadas:** cuando un nombre agrupaba posturas distintas se dividió en ejercicios propios (por ejemplo press cerrado con barra y en multipower; remo con apoyo en pecho deja de confundirse con el remo en T).
- **Tests de integridad del catálogo:** ningún ejercicio comparte dibujo ni pasos de técnica con otro, todas las posturas pasan un control anatómico (rango de codos, rodillas, caderas, hombros y tobillos, y nada atraviesa el piso) y las 3 vistas se generan sin errores.

### Changed
- **Los 402 dibujos se rehicieron uno por uno** con inicio, mitad y final que corresponden al nombre del ejercicio (posición, dirección del movimiento, ancho de agarre y de pies) y coinciden con el paso a paso. Cada ejercicio abre en la vista que mejor lo muestra (por ejemplo, de frente las elevaciones laterales o el jumping jack y desde arriba el limpiaparabrisas o el Pallof press).
- **Fichas de técnica revisadas:** pasos propios para cada ejercicio (ninguno se repite entre ejercicios) y consejos y errores comunes agrupados por familia de movimiento; todas las fichas muestran claves del entrenador.
- **Analíticas:** el resumen mensual de cardio considera Cardio y Combate; las actividades por tiempo son Cardio, Combate y Movilidad. Nuevos valores MET para ski erg, bicicleta reclinada, stepper, arrastre de trineo, snatch con kettlebell, paseo del camarero, halo, caminata de gusano y saltos de tobillo.
- Artes marciales se dibuja y se explica como deporte de agarre (lucha, judo, BJJ), en línea con su distribución muscular.

### Removed
- **Categorías Baile y Deportes** y sus ejercicios (samba, zumba, salsa, cumbia, reggaetón, aeróbico, fútbol, pádel, tenis, básquet, vóley y escalada). Los registros que ya existían se conservan: se leen como Cardio en Analíticas y mantienen su gasto calórico.

### Fixed
- Dibujos con manos que salían por cualquier lado, piernas en posiciones imposibles, pies que atravesaban el piso y vistas que no correspondían al ejercicio.

## [4.5.0] - 2026-11-03

### Added
- **Agregar a una rutina desde "Registrado hoy":** cada ejercicio registrado tiene un botón para sumarlo a un día de una rutina. Por defecto propone la rutina activa y el día de hoy, con las series, repeticiones y kg que registraste.
- **Configuración (ruedita del encabezado):** volumen general y por tipo de sonido (botones, reloj, festejos), silenciar todo y vibración del reloj. Los colores y el tema se mudaron aquí desde Perfil.
- **Reloj en segundo plano:** el reloj sigue corriendo al cerrar la ventana, al cambiar de pestaña o al recargar la página (hasta 12 h). Mientras corre, aparece un reloj flotante abajo a la derecha con pausa/reanudar.
- **52 ejercicios nuevos (313 en total):** máquinas (jalón, press declinado, curl Scott, tríceps, gemelos, patada de glúteo, sentadilla pendular), variantes por implemento (mancuernas, polea, barra, multipower, kettlebell, barra hexagonal), calistenia (L-sit, dragon flag, flexiones pike, en anillas y pseudo plancha, dominadas arqueras y lastradas, sentadilla cosaca y del patinador, fondos en barra recta) y no convencionales (volteo de neumático, golpes con maza, levantamiento de piedra, Jefferson curl). Todos con ficha, dibujo en 3 vistas y distribución muscular propia.
- Las ventanas (i) de Analíticas muestran las fuentes de las cifras de referencia.
- **Fichas propias para 27 ejercicios:** pasos, consejos y errores comunes escritos para cada uno (antes compartían el texto de otro parecido y a veces se contradecían, como "Crunch en máquina: acuéstate boca arriba"). Entre ellos: press de pecho en polea, pullover y crunch en máquina, crunch en polea, extensión de tríceps en máquina, L-sit, flexiones pike, curl bayesiano, en polea alta, araña y en TRX, tríceps tras nuca en polea, rodillo de muñeca, volteo de neumático, piedra, golpes con maza, Jefferson curl, dragon flag, limpiaparabrisas, almeja, gemelos en prensa, sentadilla cosaca, del patinador y española, press cubano, devil press y cruce posterior en polea.
- **Revisión de los 313 dibujos:** 25 ejercicios tienen ahora su propio dibujo en lugar de reutilizar uno parecido: muscle up, L-sit, flexiones pike, curl bayesiano, curl en polea alta, curl araña, tríceps tras nuca en polea, extensión de tríceps en máquina, rodillo de muñeca, crunch en polea (de rodillas), crunch en máquina (sentado), aductor y abductor en máquina (sentado), vuelos laterales sentado, almeja (acostado de costado), gemelos en prensa, sentadilla sin peso (ya no muestra una pesa), press de pecho en polea, pullover en máquina (sentado), volteo de neumático, levantamiento de piedra, vuelo lateral inclinado (tomado de un poste), peso muerto sumo (piernas abiertas, se lee de frente), sentadilla Zercher (barra en los codos) y patada de glúteo en polea (de pie, con el cable al tobillo).

### Changed
- **Inicio:** "Ejercicio libre" y "Reloj libre" pasan a la sección *Plan de hoy*. Cada ejercicio planificado tiene un solo botón, **Hacer** (antes "Hacer ahora" y "Hecho"); para cronometrar se usa el reloj libre, que sigue corriendo mientras registras.
- **Perfil:** cada sección es plegable y arranca cerrada. *Cerrar sesión* pasó al final de Perfil y pide confirmación (se quitó del encabezado).
- **Textos explicativos reescritos:** las ventanas (i) de Analíticas ahora dicen primero qué muestra el gráfico, después cómo leerlo y un consejo; el cálculo queda plegado en "Cómo se calcula". También se acortaron subtítulos de Analíticas, ayudas del reloj, RIR, Perfil y biblioteca.
- Indicadores de Inicio en una sola fila de tres en el celular.

### Fixed
- El reloj perdía el progreso al cerrarlo y volver a abrirlo.
- El formulario de ejercicio (libre o planificado) se vaciaba al cambiar de pestaña o al usar el reloj: ahora conserva el borrador del día, incluidas las series cargadas.
- Pausar y reanudar el reloj sumaba o saltaba un segundo.
- La lista de ejercicios del selector (rutinas) no dejaba deslizar: volvía sola al elemento activo.
- El reloj flotante ya no tapa el final de la página.
- Dibujos: los ejercicios colgados (dominadas, toes to bar, elevaciones colgado, colgado en barra) muestran la barra fija con sus parantes en las 3 vistas y ya no apoyan los pies en el piso; elevación de rodillas en paralelas queda suspendida; los vuelos laterales en polea y el cruce posterior en polea muestran los cables; el curl nórdico baja con el cuerpo recto; la sentadilla sumo muestra la kettlebell; el curl en TRX muestra las correas.

## [4.4.1] - 2026-11-02

### Added
- **Integración continua (GitHub Actions):** cada PR y cada push a `main` ejecuta `npm ci`, `npm run lint`, `npm test` y `npm run build` (`.github/workflows/ci.yml`). El resultado aparece en la pestaña *Checks* del PR.

### Fixed
- `npm run lint` vuelve a pasar sin errores:
  - Perfil (autoguardado de colores): el estado "Guardando / Guardado / Error" se deriva en el render en lugar de fijarse con `setState` dentro de un efecto (`react-hooks/set-state-in-effect`).
  - Reloj: la configuración guardada se lee con un inicializador de `useState` (`react-hooks/use-memo`).
  - Chat: la expresión que quita emojis usa alternancia en vez de una clase de caracteres con un carácter combinable (`no-misleading-character-class`).
  - Ilustraciones: se quitó una variable sin uso (`no-unused-vars`) y dos comentarios `eslint-disable` innecesarios.

## [4.4.0] - 2026-11-02

### Added
- **Copiar y pegar días de rutina:** cada día tiene botones copiar/pegar en el editor (celular y escritorio), y en la tarjeta de cada rutina se puede tocar un día para copiarlo sin abrir el editor. Al pegar sobre un día con ejercicios se elige **agregar al final** o **reemplazar**. El portapapeles se recuerda en el dispositivo (sirve entre rutinas y después de recargar).
- **Grupos plegables:** cada grupo muestra nombre, rol y miembros; al tocarlo se despliega con la misma información de antes.
- **Chat del grupo en su propia ventana** (accesible con teclado y lector de pantalla).
- **Pruebas automáticas (Vitest):** 26 pruebas de la lógica pura (reloj, análisis de rutinas, fatiga, calorías, resumen mensual, series/RIR y catálogo de ejercicios, incluidas las ilustraciones en las 3 vistas). Comandos `npm test` y `npm run test:watch`.

### Changed
- **Un solo componente de ventana** (`Dialog`) para todas las ventanas emergentes (información de gráficos, reloj, añadir a rutina, confirmaciones, chat y pegar día): Escape cierra, el foco queda dentro de la ventana y vuelve al botón que la abrió, el **botón atrás del celular** cierra la ventana en lugar de salir de la app, y se bloquea el scroll de fondo. El reloj no se puede cerrar por accidente mientras corre.
- **Seguridad: cada persona solo puede leer perfiles, récords y registros propios o de quienes comparten un grupo.** La app mantiene `users/{uid}.friendIds` sincronizado con los integrantes de tus grupos y las nuevas reglas de Firestore lo verifican (las altas se validan contra el grupo). Las consultas por grupo solo incluyen amigos ya confirmados.

### Removed
- `src/components/Modal.jsx` (reemplazado por `Dialog`).

## [4.3.1] - 2026-11-02

### Added
- **Serie por serie:** al registrar o confirmar un ejercicio se puede cargar cada serie con sus repeticiones, kg y RIR (por ejemplo 60×10, 62,5×8, 65×6). La preferencia se recuerda y la próxima vez se prellena con las series de la última sesión. El modo resumen (series × reps × kg) sigue disponible.
- **Esfuerzo percibido (RIR) opcional** en "Hecho": repeticiones que quedaban antes del fallo (0, 1, 2, 3, 4+).
- Hoy: **sugerencia de carga** para cada ejercicio según la última sesión (doble progresión guiada por RIR: subir kg, sumar una repetición o repetir).

### Changed
- Con series detalladas, el registro guarda como resumen la mejor serie (mayor 1RM estimado): récords, ranking y gráficos siguen funcionando igual; el **tonelaje** suma cada serie real.
- El **mapa de fatiga** pondera cada serie por su RIR (al fallo cansa más que con 4 repeticiones en reserva).
- El **resumen mensual** recomienda acercarse al fallo o dejar repeticiones en reserva según el RIR registrado.
- Reglas de Firestore: validan `rir` (0–10) y `setDetails` (máx. 30 series). Los registros anteriores no cambian.

## [4.3.0] - 2026-11-02

### Added
- **Reloj de entrenamiento** en Hoy, con modos Series + descanso, Tabata, EMOM, AMRAP, For Time e Intervalos y tiempos personalizables (se recuerdan por dispositivo). Pitidos en los últimos 3 segundos, vibración en los cambios de fase y pantalla siempre encendida mientras corre. También hay un reloj libre (botón "Reloj").
- Hoy: cada ejercicio del plan tiene **Hacer ahora** (abre el reloj con series, reps y kg de la serie actual) y **Hecho** (pide confirmar series, reps y kg).
- Hoy: el registro se prellena con los **valores que completaste la última vez**; el botón **Completar con valores de rutina** vuelve al plan.
- Rutinas: **análisis muscular** de cada rutina (porcentaje por categoría y por músculo, series efectivas semanales, músculos sin trabajar y desequilibrios empuje/tirón y cuádriceps/isquiotibiales).
- Rutinas: botón **Desactivar** para la rutina activa.
- Analíticas: **mapa de fatiga muscular** (estimación para hoy según los últimos 7 días, con tiempo de recuperación por músculo).
- Analíticas: **calorías y alimentación** (gasto estimado por MET, metabolismo basal Mifflin-St Jeor, objetivo diario, macronutrientes, agua y fibra). Los datos corporales se cargan en Perfil o en la misma tarjeta y son privados.
- Analíticas: **resumen del mes** (últimos 30 días contra los 30 anteriores, progresión de cargas) con **recomendaciones**: aumentar series, kg, días o repeticiones, reducir volumen, hacer abdomen, sumar cardio, equilibrar empuje/tirón.
- Ejercicios: **52 ejercicios nuevos** (8 de antebrazo y agarre, 8 de pecho, 7 de espalda, 4 de hombros, 4 de bíceps, 3 de tríceps, 6 de core, 7 de piernas, 2 de glúteos, 2 de pantorrillas y 1 funcional). Total: 261.
- Ejercicios: **ilustraciones con volumen y tres vistas** (lateral, frontal y superior) generadas desde un esqueleto 3D, con encuadre automático.
- Ejercicios: sección **Claves de entrenadores e investigación** con indicaciones atribuidas a su fuente (Rippetoe, McGill, Contreras, Nippard, Cressey, Israetel, estudios de Maeo, Schoenfeld, Kubo, etc.).

### Changed
- El antebrazo se divide en **braquiorradial, flexores y extensores**: el curl de muñeca (flexores) y el curl de muñeca invertido (extensores) ya no suman al mismo músculo. El id viejo `antebrazos` se reparte automáticamente (historial intacto).
- Distribución muscular revisada en curls (supino, martillo, invertido, Scott, inclinado…) y en ejercicios que tenían porcentajes idénticos a otro distinto.
- Consejos menos genéricos en varias familias de ejercicios (press, pullover, remo, press militar, abdominales, cardio).
- Rutinas (celular): los días con ejercicios se **pliegan** (muestran solo los nombres) y los días de descanso ocupan una sola fila.
- La **versión** se muestra al pie de todas las pestañas (antes solo en Perfil).
- Las tarjetas mantienen el botón (i) en la misma línea del título.
- **Perfiles y récords solo de tus grupos:** antes la app descargaba las colecciones completas `profiles` y `personalBests` (1 lectura por cada usuario registrado en cada apertura). Ahora pide únicamente los documentos tuyos y de quienes comparten un grupo contigo (consultas por id en bloques de 30).
- Velocidad: el reloj y las pantallas de inicio de sesión salen del bundle inicial (se descargan al usarlos, con precarga al pasar el puntero), conexiones adelantadas a Firebase (`preconnect`) y caché de un año para los archivos con hash (`vercel.json`).

### Fixed
- Pullover: los dibujos de inicio y mitad estaban mal (la mitad salía por delante del cuerpo). La interpolación de ángulos ahora toma el camino corto.
- Celular: el botón (i) de Analíticas (y el resto de las ventanas) podía ensanchar la página; ahora se abren en una capa propia sobre toda la pantalla y bloquean el scroll de fondo.
- Ejercicios: no se repiten los alias sin Ñ cuando ya aparece la versión con Ñ.

## [4.2.0] - 2026-10-31

### Added
- Ficha completa para los 209 ejercicios de la pestaña Ejercicios: ilustraciones del movimiento (inicio, mitad y final), diagrama corporal con el % de estímulo por músculo, técnica paso a paso, consejos y errores comunes. Las ilustraciones se dibujan por código y siguen los colores del tema.
- Botón de información (i) en cada gráfico de Analíticas (indicadores, consistencia, mapa muscular, series por músculo, detalle del músculo, progresión de fuerza y tonelaje): explica cómo se calcula, cómo interpretarlo y un consejo.
- Selector de color propio en Perfil (área de saturación y brillo, barra de tono, HEX, colores sugeridos) con la lista de **tus últimos colores** elegidos, guardada en la cuenta.
- Autoguardado de los colores personalizados en la cuenta.

### Changed
- Los nombres de ejercicios conservan la Ñ (CURL ARAÑA, CURL DE MUÑECA, LEÑADOR EN POLEA); los nombres anteriores sin Ñ quedan como alias, así el historial no se pierde.
- "BICICLETA" (abdominales) pasa a llamarse **CRUNCH BICICLETA** para no confundirse con el ciclismo; "BICICLETA" sigue funcionando como alias.
- Los gráficos semanales avisan en el detalle cuando una semana está incompleta (el rango empieza o termina a mitad de semana) o en curso.
- Analíticas: el gráfico de Consistencia pasa arriba de los indicadores y el mapa muscular usa el sexo del perfil (se quitó el selector de cuerpo). Ajustes hechos a mano después de 4.1.0.
- Perfil > Apariencia: se quita el botón "Guardar en mi cuenta" (ahora se guarda solo) y se muestra el estado del guardado.

### Removed
- Sección "Video" (marcador "Próximamente") de la ficha de ejercicios, y el archivo `src/constants/exerciseContent.js`, reemplazado por `exerciseGuides.js` y `exercisePoses.js`.

### Fixed
- Celular: ningún contenido puede ser más ancho que la pantalla (palabras largas, selectores, campos y gráficos) y las ventanas emergentes no superan su alto (hacen scroll por dentro).
- Ejercicios (celular): el último ejercicio de la lista quedaba tapado por la barra de navegación inferior y obligaba a desplazar la pantalla. Ahora la lista se desplaza con la página y el buscador queda fijo arriba.
- Perfil: al recargar, los colores guardados en la cuenta pisaban los últimos colores elegidos si no se había tocado "Guardar".

## [4.1.0] - 2026-10-30

### Added
- Chat en **Grupos** limitado a compartir rutinas propias (sin texto libre ni emojis), con tope de 1 mensaje por minuto por persona, aplicado también en las reglas de Firestore.
- Contador de **copias por rutina**: cuántas personas distintas importaron cada rutina (una por persona; se muestra en Rutinas).
- Botón **Añadir a rutina** en la pestaña Ejercicios (elige rutina, día, series y repeticiones).
- Más de 50 ejercicios nuevos con categoría y músculos: running, sprints, caminata, ciclismo, natación, elíptico, escaladora, funcional, CrossFit, baile (samba, zumba, salsa, cumbia, reggaetón, aeróbico), boxeo y combate, yoga, pilates y deportes (fútbol, pádel, tenis, básquet, vóley, escalada).
- Nuevas categorías: Cardio, CrossFit, Baile, Combate, Yoga y Pilates, Deportes.
- Analíticas: gráfico de **consistencia** (línea suave por perfil con marca especial en los PR) sobre el mapa muscular.
- Analíticas: opción **Unificar ejercicios del día**; desactivada, los gráficos temporales muestran hora y minuto en el eje X.
- Analíticas: los filtros se pueden ocultar con una flecha (visibles por defecto).
- Repeticiones: botones +/- (solo escritorio) en el editor de rutinas.
- Versión de la app visible debajo de la pestaña Perfil.
- Archivo `CHANGELOG.md` y metadatos de ícono (`site.webmanifest`, Open Graph).

### Changed
- La app pasa a llamarse **Colossus** en todos los lugares (título de la pestaña, `package.json`, metadatos).
- Nuevo ícono minimalista: una "C" blanca; el ícono de la pestaña del navegador tiene fondo transparente. Hay versiones con fondo para Instagram, WhatsApp y Canva en `public/brand/`.
- El **Ranking** (fuerza, constancia y récords recientes) pasa a la pestaña Grupos: hay una competencia por cada grupo de amigos y solo compiten sus integrantes.
- Editor de rutinas: se quitó el campo de kg al agregar un ejercicio.
- Las cintas, bicicleta fija, soga y remo ergómetro pasan de "Funcional / Cardio" a la categoría Cardio.

### Removed
- Pestaña Ranking independiente (ahora vive dentro de cada grupo).

### Fixed
- Perfil: en celular la pantalla se extendía más que el ancho y desplazaba la barra de navegación y otros elementos.

## [4.0.0] - 2026-10-29

### Added
- **Grupos** de amigos con código y enlace de invitación; las analíticas comparan solo perfiles que comparten grupo.
- Pestaña **Perfil**: datos, correo, contraseña y colores personalizados (claro/oscuro).
- **Biblioteca de ejercicios** con diccionario de músculos y porcentaje de estímulo por ejercicio.
- Analíticas por músculo: mapa anatómico, series efectivas y recuperación.
- Selector de ejercicios con búsqueda, capa de celebración de récords y borrador de rutina recuperable.
- Documento de verificación de correo (`docs/verificacion-email-token.md`).

### Changed
- Reglas de Firestore ampliadas para grupos e invitaciones.

## [2.0.0] - 2026-10-29

### Changed
- Reescritura completa: arquitectura modular por funcionalidades (`features/`, `services/`, `hooks/`, `context/`).
- Nuevo modelo de datos (`profiles`, `users`, `workoutLogs`, `personalBests`, `routines`).

### Added
- Reglas de seguridad de Firestore e índices.
- Configuración de Firebase CLI, script de respaldo (`scripts/backup-firestore.mjs`) y de migración de datos legados.
- Variables de entorno (`.env.example`).

### Security
- Reglas que impiden editar o borrar datos ajenos.

## [1.6.0] - 2026-10-27

### Changed
- Gráficas y apartados visuales mejorados; corrección de errores (incluye un revert y un reintento del mismo cambio).

## [1.5.2] - 2026-10-26

### Changed
- Cambio del nombre de la página.

## [1.5.1] - 2026-10-26

### Fixed
- Errores del inicio de sesión y de las analíticas; se agregan mensajes de error claros.

## [1.5.0] - 2026-10-26

### Added
- Inicio de sesión con Firebase Auth y con Google.

### Changed
- Analíticas mejoradas.

### Fixed
- Errores en las rutinas.

## [1.4.1] - 2026-10-26

### Fixed
- Problema introducido al agregar el inicio de sesión con correo.

### Changed
- README actualizado.

## [1.4.0] - 2026-10-26

### Added
- Inicio de sesión con correo y credenciales.

## [1.3.0] - 2026-10-25

### Added
- Pantalla de inicio, rutinas, presets y tablas de ranking.

### Changed
- Analíticas mejoradas.

## [1.2.0] - 2026-10-25

### Added
- Herramientas de análisis y visualización de estadísticas.

## [1.1.0] - 2026-10-25

### Added
- Menú desplegable de ejercicios y notificaciones.

## [1.0.1] - 2026-10-24

### Security
- Se eliminan las credenciales en texto plano y se pasan a variables de entorno.

## [1.0.0] - 2026-10-24

### Added
- Versión inicial: registro de ejercicios (proyecto de React + Vite + Firebase).

[Unreleased]: https://github.com/kou-sang/incursores/compare/v4.2.0...HEAD
[4.2.0]: https://github.com/kou-sang/incursores/compare/v4.1.0...v4.2.0
[4.1.0]: https://github.com/kou-sang/incursores/compare/v4.0.0...v4.1.0
[4.0.0]: https://github.com/kou-sang/incursores/compare/v2.0.0...v4.0.0
[2.0.0]: https://github.com/kou-sang/incursores/compare/v1.6.0...v2.0.0
[1.6.0]: https://github.com/kou-sang/incursores/compare/v1.5.2...v1.6.0
[1.5.2]: https://github.com/kou-sang/incursores/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/kou-sang/incursores/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/kou-sang/incursores/compare/v1.4.1...v1.5.0
[1.4.1]: https://github.com/kou-sang/incursores/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/kou-sang/incursores/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/kou-sang/incursores/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/kou-sang/incursores/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/kou-sang/incursores/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/kou-sang/incursores/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/kou-sang/incursores/releases/tag/v1.0.0
