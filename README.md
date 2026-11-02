# COLOSSUS

Este proyecto inició como una idea para compartir con los amigos. Ahora es un sistema semi-completo para llevar registro de ejercicios, rutinas y proveer analíticas profundas para mejorar rendmiento en el gimnasio.

## Versionado y cambios

- El historial de cambios está en [`CHANGELOG.md`](CHANGELOG.md) (formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) + [SemVer](https://semver.org/lang/es/)).
- La versión vigente se define en `package.json` y se muestra al pie de todas las pestañas.
- Para publicar una versión: actualizar `version` en `package.json`, mover los cambios de `[Unreleased]` a una sección nueva del changelog y crear la etiqueta (`git tag vX.Y.Z`).

## Pruebas

- Instalar Vitest una vez: `npm i -D vitest` (agrega la dependencia y actualiza `package-lock.json`).
- `npm test` corre todas las pruebas (`src/**/*.test.js`); `npm run test:watch` las repite al guardar.

## Reglas de Firestore

Las reglas (`firestore.rules`) limitan la lectura de perfiles, récords y registros a ti y a quienes comparten un grupo contigo (`users/{uid}.friendIds`, que mantiene la app). Desplegar con `firebase deploy --only firestore:rules` **después** de publicar la versión de la app que sincroniza `friendIds` (4.4.0 o posterior).
