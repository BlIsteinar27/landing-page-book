# Auditoría: Hallazgos Críticos

> Este documento lista los hallazgos que bloquean la calidad o la producción del proyecto. Cada problema incluye **dos o tres soluciones posibles** y una breve explicación de lo que repercutirá cada una.
>
> **Objetivo:** ayudarte a decidir, problema por problema, si eliminas, integras o refactorizas el código.

---

## 1. `SagaSection` existe pero no se usa en ninguna página

**Archivos involucrados:**

- `@src/components/SagaSection-server.tsx:1-34`
- `@src/components/SagaSection-client.tsx:1-96`
- `@src/components/InteractiveMapSection-client.tsx:185-242` (donde realmente se renderiza el grid de libros)

**Problema:** `SagaSection` es un componente completo que muestra la saga de libros, pero `page.tsx` no lo importa. El mismo grid de libros está duplicado dentro del mapa interactivo. Esto genera dos fuentes de verdad para la misma información.

### Opción A: Eliminar `SagaSection` por completo

- **Repercusiones:** reduce el tamaño del bundle, elimina confusión y deja claro que el catálogo de libros vive dentro del mapa interactivo.
- **Riesgo:** si en algún momento se quiso una sección aparte de "La Saga", se perdería esa estructura lista.

### Opción B: Integrar `SagaSection` en `page.tsx` y eliminar el grid de libros de `InteractiveMapSection`

- **Repercusiones:** separa responsabilidades: el mapa interactivo se enfoca en el mapa y los hotspots; `SagaSection` se enfoca en el catálogo. Mejora la organización conceptual.
- **Riesgo:** requiere reestructurar `page.tsx` y quitar del mapa la parte que lista los libros. Si actualmente el diseño depende de que los libros aparezcan dentro del flujo del mapa, puede cambiar la experiencia visual.

### Opción C: Mantener ambos componentes, pero unificar la fuente de datos

- **Repercusiones:** conservas la flexibilidad de poder mostrar la saga en ambos lugares sin duplicar los objetos `libros`. La data centralizada evita inconsistencias.
- **Riesgo:** sigues teniendo dos componentes visuales similares que mantener, y si solo se usa uno, el otro sigue siendo código muerto.

**Recomendación provisional:** Opción B si quieres separar el mapa del catálogo, Opción A si el diseño actual ya es el definitivo.

### ✅ RESUELTO (28-06-2026)

**Decisión tomada:** Opción B + limpieza adicional.

- Se integró `SagaSection` en `@src/app/page.tsx` entre `InteractiveMapSection` y `SobreAutoraSection`.
- Se eliminó el Books Grid de `@src/components/InteractiveMapSection-client.tsx` (líneas 185-242).
- Se eliminó el prop `libros` de `InteractiveMapSection` server y client.
- Se creó `@src/data/libros.ts` como fuente única de datos (también resuelve hallazgo #4).
- **Adicional:** Se eliminó la imagen de fondo de `SagaSection-server.tsx` y el bloque de imagen del universo de `SagaSection-client.tsx` (solo se muestra el grid de libros).

---

## 2. `GalaxyOverlay` y `showGalaxyOverlay` están inactivos

**Archivos involucrados:**

- `@src/components/InteractiveMapSection-client.tsx:26`
- `@src/components/GalaxyOverlay.tsx:1-136`

**Problema:** Existe un estado `showGalaxyOverlay` y un componente `GalaxyOverlay`, pero no hay ningún botón, hotspot o acción que lo active. El código nunca se ejecuta.

### Opción A: Eliminar `GalaxyOverlay` y el estado `showGalaxyOverlay`

- **Repercusiones:** limpia el bundle y simplifica `InteractiveMapSection-client`. El componente se vuelve más fácil de entender.
- **Riesgo:** pierdes la funcionalidad de "mapa galáctico completo" si se quería implementar más adelante.

### Opción B: Agregar un punto de entrada visible que abra el mapa galáctico

- **Repercusiones:** habilita una experiencia real: el usuario puede abrir el mapa completo del universo, hacer zoom y explorar. Aprovechas todo el código ya escrito.
- **Riesgo:** requiere decidir dónde poner el botón (por ejemplo, en la esquina de la sección del mapa, o como un hotspot especial) y posiblemente ajustar el diseño.

### Opción C: Abrir `GalaxyOverlay` al hacer clic en el título o en un ícono de "expandir" dentro de la sección del mapa

- **Repercusiones:** entrega natural, mínimo cambio de UI. Reutiliza el SVG del mapa que ya está cargado en la sección.
- **Riesgo:** puede no ser obvio para el usuario si no hay indicación visual clara.

**Recomendación provisional:** Opción B si el mapa galáctico es parte del diseño planificado; Opción A si es funcionalidad descartada.

### ✅ RESUELTO (28-06-2026)

**Decisión tomada:** Opción A.

- Se eliminó `GalaxyOverlay` de `@src/components/InteractiveMapSection-client.tsx` (import, estado `showGalaxyOverlay` y JSX).
- El componente `GalaxyOverlay.tsx` sigue existiendo en el proyecto pero no se usa.

---

## 3. `selectedHotspot` no se usa para nada visible

**Archivo involucrado:**

- `@src/components/InteractiveMapSection-client.tsx:25`

**Problema:** El estado `selectedHotspot` se guarda al abrir un overlay, pero solo se usa para cerrarlo. No hay feedback visual, deep-link ni analytics que lo aprovechen.

### Opción A: Eliminar el estado

- **Repercusiones:** código más limpio y menos renders innecesarios.
- **Riesgo:** pierdes la posibilidad de usar ese estado en el futuro.

### Opción B: Resaltar el hotspot activo en el mapa mientras el overlay está abierto

- **Repercusiones:** mejora la orientación del usuario, indicando qué punto del mapa está viendo. Usa el estado para algo concreto.
- **Riesgo:** requiere pasar `selectedHotspot` a `Hotspot` o gestionar clase/estilo activo.

### Opción C: Usar `selectedHotspot` para actualizar la URL (query param) o para analytics

- **Repercusiones:** permite compartir un enlace directo a un hotspot y medir interacciones.
- **Riesgo:** añade complejidad de routing y de eventos de seguimiento.

**Recomendación provisional:** Opción B si quieres mejorar UX inmediatamente; Opción A si no hay plan de usarlo.

### ✅ RESUELTO (28-06-2026)

**Decisión tomada:** Opción A.

- Se eliminó el estado `selectedHotspot` de `@src/components/InteractiveMapSection-client.tsx`.
- Se eliminó la línea `setSelectedHotspot(hotspot)` de `handleHotspotClick`.
- Se eliminó la línea `setSelectedHotspot(null)` de `closeOverlay`.
- El tipo `HotspotType` se mantiene porque sigue siendo necesario como tipo del parámetro de `handleHotspotClick`.

---

## 4. Datos de libros duplicados en dos secciones

**Archivos involucrados:**

- `@src/components/InteractiveMapSection-server.tsx:3-11`
- `@src/components/SagaSection-server.tsx:4-12`
- `@src/components/InteractiveMapSection-client.tsx:13-17`
- `@src/components/SagaSection-client.tsx:6-10`

**Problema:** El array de libros y la interfaz `Libro` están definidos en dos lugares. Cualquier cambio en un libro debe hacerse dos veces.

### Opción A: Crear `@src/data/libros.ts` y `@src/types/libro.ts`

- **Repercusiones:** una sola fuente de verdad para datos y tipos. Reduce errores de inconsistencia.
- **Riesgo:** mínimo; solo requiere actualizar imports.

### Opción B: Mover los libros a `@src/config/realms-data.ts`

- **Repercusiones:** centraliza todo el lore del universo en un solo archivo.
- **Riesgo:** mezcla datos de "reinos del mapa" con datos de "libros de la saga", lo que puede volverse difícil de mantener si ambos crecen.

### Opción C: Mantener archivos separados pero compartir la interfaz `Libro`

- **Repercusiones:** respeta la separación por feature si los libros del mapa y los de la saga terminan siendo datasets diferentes.
- **Riesgo:** sigue habiendo duplicación de datos a menos que se sincronicen.

**Recomendación provisional:** Opción A. Es la más limpia y escalable.

### ✅ RESUELTO (28-06-2026)

**Decisión tomada:** Opción A.

- Se creó `@src/data/libros.ts` con la interfaz `Libro` y el array `libros` como fuente única.
- Se actualizó `@src/components/SagaSection-server.tsx` para importar `libros` desde `@/data/libros`.
- Se actualizó `@src/components/SagaSection-client.tsx` para importar `Libro` desde `@/data/libros`.
- Se eliminó el array `libros` local de `InteractiveMapSection-server.tsx`.

---

## 5. Testimonios con contenido de plantilla de autoayuda

**Archivo involucrado:**

- `@src/components/TestimoniosSection.tsx:26-51`

**Problema:** Los testimonios son de una plantilla genérica de autoayuda ("María González", "Crecimiento Personal", "Transformación") y no conectan con el tono de fantasía oscura de la saga.

### Opción A: Reemplazar por testimonios reales de lectores beta o fans

- **Repercusiones:** aumenta la credibilidad y la conversión. Refuerza la identidad del libro.
- **Riesgo:** requiere que existan testimonios reales; si no hay, queda bloqueado hasta obtenerlos.

### Opción B: Eliminar temporalmente la sección de testimonios

- **Repercusiones:** evita que el sitio luzca genérico o desconectado. La landing sigue siendo funcional.
- **Riesgo:** pierdes el "social proof" hasta que tengas contenido real.

### Opción C: Dejar placeholders explícitos con un comentario TODO y desactivar la sección en producción

- **Repercusiones:** documenta la intención sin afectar la percepción del usuario.
- **Riesgo:** si se olvida el TODO, el contenido falso llega a producción.

**Recomendación provisional:** Opción B si vas a producción pronto; Opción A si tienes acceso a testimonios reales.

### ✅ RESUELTO (28-06-2026)

**Decisión tomada:** Mantener sin uso.

- El componente `TestimoniosSection.tsx` no se importa en `page.tsx` y no se muestra en la landing.
- Motivo: el libro aún no ha salido, por lo que no hay testimonios reales disponibles.
- El componente se mantiene en el proyecto para cuando exista contenido real.

---

## 6. `next.config.ts` contiene una opción no válida

**Archivo involucrado:**

- `@next.config.ts:7-9`

```ts
images: {
  qualities: [70, 75, 80, 85, 90, 95, 100],
},
```

**Problema:** Next.js no reconoce `images.qualities` como opción estándar. Puede generar advertencias o ser ignorada silenciosamente.

### Opción A: Eliminar la clave `qualities`

- **Repercusiones:** Next.js vuelve a sus defaults. La app sigue funcionando.
- **Riesgo:** pierdes la intención de controlar calidad, aunque actualmente no estaba funcionando.

### Opción B: Usar `quality` por imagen en cada componente `next/image`

- **Repercusiones:** control real por imagen. Puedes optimizar el peso de la landing selectivamente.
- **Riesgo:** requiere revisar cada `<Image>` para decidir su calidad.

### Opción C: Configurar `deviceSizes` e `imageSizes` si el objetivo es optimizar responsive images

- **Repercusiones:** mejora el tamaño de las imágenes entregadas según el dispositivo.
- **Riesgo:** no reemplaza el control de calidad por compresión, pero sí optimiza el ancho de las imágenes.

**Recomendación provisional:** Opción A inmediata (elimina el error), y luego Opción B para ajustar calidad donde sea necesario.

### ✅ RESUELTO (28-06-2026)

**Decisión tomada:** Opción A + B.

- Se eliminó el array `qualities` con valores innecesarios `[70, 75, 80, 85, 90, 95, 100]`.
- Se agregó `qualities: [75, 85]` con los valores reales usados en el proyecto (`RealmLevel` usa `quality={85}`).
- Se agregó `formats: ['image/avif', 'image/webp']` para compresión automática de todas las imágenes.
- Esto elimina las advertencias de `next-image-unconfigured-qualities` en el servidor de desarrollo.

---

## 7. Script de lint en `package.json` no funciona como se espera

**Archivo involucrado:**

- `@package.json:9`

```json
"lint": "eslint"
```

**Problema:** Ejecutar `eslint` sin argumentos no analiza los archivos del proyecto de forma consistente con Next.js.

### Opción A: Cambiar a `"lint": "next lint"`

- **Repercusiones:** usa el linter oficial de Next.js, que incluye reglas específicas de React 19 y App Router.
- **Riesgo:** puede mostrar nuevos errores que antes no se detectaban.

### Opción B: Cambiar a `"lint": "eslint src app --ext .ts,.tsx"`

- **Repercusiones:** mantiene ESLint directo pero con archivos explícitos.
- **Riesgo:** no aprovecha las configuraciones específicas de Next.js para el App Router.

### Opción C: Agregar `"lint:fix": "next lint --fix"`

- **Repercusiones:** permite corregir automáticamente problemas simples.
- **Riesgo:** `--fix` puede cambiar código de forma no deseada; siempre revisar el diff.

**Recomendación provisional:** Opción A + Opción C juntas: `"lint": "next lint"` y `"lint:fix": "next lint --fix"`.

### ✅ RESUELTO (28-06-2026)

**Decisión tomada:** Opción A + C.

- Se cambió `"lint": "eslint"` a `"lint": "next lint"`.
- Se agregó `"lint:fix": "next lint --fix"`.
- Ahora el linter usa las reglas específicas de Next.js, React 19 y App Router.

---

## Resumen de decisiones tomadas

| #   | Problema                        | Decisión tomada                              | Estado      |
| --- | ------------------------------- | -------------------------------------------- | ----------- |
| 1   | `SagaSection` no se usa         | Integrar en `page.tsx` + eliminar Books Grid | ✅ Resuelto |
| 2   | `GalaxyOverlay` inactivo        | Eliminar                                     | ✅ Resuelto |
| 3   | `selectedHotspot` sin uso       | Eliminar estado                              | ✅ Resuelto |
| 4   | Datos de libros duplicados      | Centralizar en `src/data/libros.ts`          | ✅ Resuelto |
| 5   | Testimonios de plantilla        | Mantener sin uso (libro no ha salido)        | ✅ Resuelto |
| 6   | `qualities` en `next.config.ts` | Agregar `[75, 85]` + `formats`               | ✅ Resuelto |
| 7   | Script de lint incorrecto       | Cambiar a `next lint` + agregar `lint:fix`   | ✅ Resuelto |

**Fecha de resolución:** 28-06-2026
