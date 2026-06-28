# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Mapa interactivo del cono cósmico con navegación vertical
- Tres reinos explorables: Reino de la Luz, Reino Central, Reino Oscuro
- Sistema de hotspots interactivos con tooltips
- Overlay del mapa de galaxias con zoom pinch
- Scroll snap con haptic feedback
- Grid de los 7 libros de la saga
- Animaciones con Motion (framer-motion)
- Configuración de Tailwind CSS con tema cósmico

### Changed
- Separación server/client para componentes interactivos
- Optimización de imágenes con next/image

### Fixed
- **CRITICAL:** Corregida lógica de pinch zoom en useTouchGestures
- **CRITICAL:** Tooltip de hotspots ahora funciona con hover en desktop
- **CRITICAL:** Scale inline cambiado a animate de Motion en GalaxyOverlay
- **CRITICAL:** Agregada configuración de Tailwind CSS (tailwind.config.ts)
- **CRITICAL:** Parallax optimizado para ejecutarse solo cuando el reino está activo
- **IMPORTANT:** Agregados focus states a todos los botones para accesibilidad
- **IMPORTANT:** Agregado soporte para prefers-reduced-motion en animaciones

### Performance
- Parallax condicional para reducir consumo de recursos
- React Compiler habilitado para optimización automática
- Lazy loading de imágenes
- Animaciones optimizadas con Motion

### Accessibility
- Focus states claros en todos los elementos interactivos
- Respeto a prefers-reduced-motion
- Navegación por teclado funcional
- Alt text en imágenes

## [0.1.0] - 2026-06-26

### Added
- Landing page inicial para "Dioses Universales"
- Sección Hero con CTA
- Sección de Comunidad
- Sección de Contacto
- Configuración base de Next.js 16
- Configuración de TypeScript
- Configuración de ESLint

---

## [0.0.1] - 2026-06-XX

### Added
- Inicialización del proyecto
- Estructura base de archivos
- Dependencias principales instaladas
