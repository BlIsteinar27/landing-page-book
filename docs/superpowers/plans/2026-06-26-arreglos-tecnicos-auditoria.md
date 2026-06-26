# Arreglos Técnicos — Auditoría Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir todos los problemas técnicos identificados en la auditoría del 26/06/2026 que no dependen de contenido pendiente de Victoria.

**Architecture:** Ediciones quirúrgicas a componentes existentes — sin crear archivos nuevos. No se tocan elementos bloqueados por Victoria (sinopsis, foto, WhatsApp real, Amazon real). Solo se corrige lo que está en manos del desarrollador hoy.

**Tech Stack:** Next.js 14+, Tailwind CSS 4.0, Motion (Framer Motion), TypeScript

---

## Archivos que se modifican

| Archivo | Qué se corrige |
|---------|----------------|
| `src/components/SinopsisSection.tsx` | Agregar tag "Romántica" al género |
| `src/components/PersonajesSection.tsx` | Reemplazar cita repetida por contenido propio |
| `src/components/SobreAutoraSection.tsx` | Completar bio (3er párrafo) + cita de inspiración completa |
| `src/components/ContactoSection.tsx` | Reemplazar `href="#"` por enlace de WhatsApp desde `LINKS` |

---

## Task 1: Agregar tag de género faltante en SinopsisSection

**Files:**
- Modificar: `src/components/SinopsisSection.tsx:60-67`

El bloque de tags actualmente tiene solo 2 etiquetas: "Fantasía Oscura" y "Romance Político". Falta "Romántica" y "Política" para describir correctamente el género.

- [ ] **Step 1: Editar los tags de género**

En `src/components/SinopsisSection.tsx` reemplazar el bloque:

```tsx
            {/* Género tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Fantasía Oscura
              </span>
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Romance Político
              </span>
            </div>
```

por:

```tsx
            {/* Género tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Fantasía Oscura
              </span>
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Romance
              </span>
              <span className="px-3 py-1 rounded-full bg-accent-dim text-accent text-sm">
                Política
              </span>
            </div>
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`
Navegar a la sección "El Primer Libro" y confirmar que aparecen 3 tags: Fantasía Oscura, Romance, Política.

- [ ] **Step 3: Commit**

```bash
git add src/components/SinopsisSection.tsx
git commit -m "fix(libro): completar tags de género con Romance y Política"
```

---

## Task 2: Reemplazar cita repetida en PersonajesSection

**Files:**
- Modificar: `src/components/PersonajesSection.tsx:58-69`

**Problema:** La sección repite exactamente la misma frase gancho del Hero (`"Donde amar es un acto político..."`), lo cual es redundante y desperdicia la oportunidad de añadir información nueva sobre los personajes.

**Solución:** Reemplazar por una descripción atmosférica del mundo que usa la descripción de la saga como base, mientras se espera un fragmento real del libro de Victoria.

- [ ] **Step 1: Reemplazar el bloque de cita**

En `src/components/PersonajesSection.tsx` reemplazar el bloque completo:

```tsx
        {/* Cita atmosférica */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center max-w-2xl mx-auto"
        >
          <p className="text-lg md:text-xl italic font-serif text-ink-secondary">
            "Donde amar es un acto político capaz de cambiar por completo el universo."
          </p>
        </motion.blockquote>
```

por:

```tsx
        {/* Descripción de protagonistas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center max-w-2xl mx-auto flex flex-col gap-3"
        >
          <p className="text-base text-ink-secondary leading-relaxed">
            Dioses con poder de doblar el destino del universo. Decisiones que no solo 
            mueven reinos, sino que reescriben las leyes de lo divino.
          </p>
          <p className="text-sm text-ink-tertiary italic font-serif">
            Dioses Universales — Los Dos Reinos
          </p>
        </motion.div>
```

- [ ] **Step 2: Verificar visualmente**

Run: `npm run dev`
Navegar a la sección "Los Protagonistas" y confirmar que el texto bajo la ilustración es diferente al del Hero.

- [ ] **Step 3: Commit**

```bash
git add src/components/PersonajesSection.tsx
git commit -m "fix(personajes): reemplazar cita repetida por descripción propia del mundo"
```

---

## Task 3: Completar bio y cita de inspiración en SobreAutoraSection

**Files:**
- Modificar: `src/components/SobreAutoraSection.tsx:93-111`

**Problemas:**
1. Falta el 3er párrafo de la bio (sobre edición profesional y borradores de Wattpad)
2. La cita de inspiración está truncada con `"..."` — le falta la segunda mitad

- [ ] **Step 1: Completar los tres párrafos de la bio**

En `src/components/SobreAutoraSection.tsx` reemplazar el bloque de párrafos de bio:

```tsx
            <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
              Soy Licenciada en Comunicación Social con mención en Periodismo Audiovisual, 
              y llevo más de una década construyendo universos desde la palabra. Mi relación 
              con la escritura creativa comenzó en 2015, impulsada por una pregunta que 
              siempre me acompañó: ¿qué hay más allá de la comprensión humana?
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
              En 2019 compartí los primeros borradores de mi saga Dioses Universales — 
              publicando el primer libro, Los Dos Reinos en Wattpad — donde una comunidad 
              de lectores acompañó el nacimiento de este universo. Tras años de trabajo y 
              dedicación, cerré la saga en 2024 con siete libros que conforman una historia 
              épica sobre poder, familia y destino.
            </p>
```

por:

```tsx
            <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
              Soy Licenciada en Comunicación Social con mención en Periodismo Audiovisual, 
              y llevo más de una década construyendo universos desde la palabra. Mi relación 
              con la escritura creativa comenzó en 2015, impulsada por una pregunta que 
              siempre me acompañó: ¿qué hay más allá de la comprensión humana?
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
              En 2019 compartí los primeros borradores de mi saga Dioses Universales — 
              publicando el primer libro, Los Dos Reinos en Wattpad — donde una comunidad 
              de lectores acompañó el nacimiento de este universo. Tras años de trabajo y 
              dedicación, cerré la saga en 2024 con siete libros que conforman una historia 
              épica sobre poder, familia y destino.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-ink-secondary">
              Actualmente, la saga se encuentra en proceso de edición profesional, y su 
              primer volumen llegará a manos de los lectores en octubre de 2026. Los 
              borradores originales de Wattpad ya no están disponibles, pues esta nueva 
              etapa trae consigo una versión pulida y definitiva de mi universo.
            </p>
```

- [ ] **Step 2: Completar la cita de inspiración**

En el mismo archivo reemplazar el bloque de blockquote:

```tsx
            {/* Cita de inspiración */}
            <blockquote className="border-l-2 border-accent pl-4 italic text-ink-secondary">
              "Desde niña, me inventaba historias para tranquilizar la soledad de mi mente 
              inquieta. Siempre estaba en las nubes, imaginando cómo se creó el universo..."
            </blockquote>
```

por:

```tsx
            {/* Cita de inspiración */}
            <blockquote className="border-l-2 border-accent pl-4 italic text-ink-secondary">
              "Desde niña, me inventaba historias para tranquilizar la soledad de mi mente 
              inquieta. Siempre estaba en las nubes, imaginando cómo se creó el universo y 
              si de verdad existen seres poderosos capaces de mantener el orden más allá de 
              la comprensión humana. Por ese motivo, hace 11 años comencé los primeros 
              borradores de lo que hoy es mi saga Dioses Universales — porque algunas 
              preguntas solo encuentran respuesta cuando las conviertes en un mundo propio."
            </blockquote>
```

- [ ] **Step 3: Verificar visualmente**

Run: `npm run dev`
Navegar a "La autora" y confirmar:
- Que aparecen 3 párrafos de bio
- Que la cita de inspiración está completa (sin `"..."`)

- [ ] **Step 4: Commit**

```bash
git add src/components/SobreAutoraSection.tsx
git commit -m "fix(autora): completar tercer párrafo de bio y cita de inspiración completa"
```

---

## Task 4: Corregir enlace de WhatsApp en ContactoSection

**Files:**
- Modificar: `src/components/ContactoSection.tsx:1-72`

**Problema:** El botón de WhatsApp tiene `href="#"` hardcodeado, lo que hace que no funcione. Debe usar `LINKS.whatsapp` del archivo de configuración centralizada, igual que lo hace `CTAButton` y `StickyCTA`.

- [ ] **Step 1: Agregar import de LINKS**

En `src/components/ContactoSection.tsx`, reemplazar la línea de import actual:

```tsx
import { motion } from 'motion/react';
```

por:

```tsx
import { motion } from 'motion/react';
import { LINKS } from '@/config/links';
```

- [ ] **Step 2: Reemplazar el href del botón WhatsApp**

En el mismo archivo, reemplazar el bloque del botón WhatsApp:

```tsx
          {/* WhatsApp */}
          <a
            href="#" // Enlace pendiente de Victoria
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
          >
```

por:

```tsx
          {/* WhatsApp */}
          <a
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-[#25D366] text-white font-medium hover:bg-[#20bd5a] transition-colors"
          >
```

- [ ] **Step 3: Verificar que el enlace se genera correctamente**

Run: `npm run dev`
En la sección Contacto, hacer hover sobre el botón de WhatsApp y verificar en la barra de estado del navegador que la URL generada contiene `wa.me/` con un número de teléfono (aunque sea el placeholder por ahora).

- [ ] **Step 4: Commit**

```bash
git add src/components/ContactoSection.tsx
git commit -m "fix(contacto): conectar botón WhatsApp a LINKS centralizado en lugar de href=#"
```

---

## Task 5: Verificación final integral

- [ ] **Step 1: Arrancar el servidor de desarrollo**

Run: `npm run dev`

- [ ] **Step 2: Verificar cada sección corregida**

Recorrer la página completa y confirmar:

| Sección | Verificar |
|---------|-----------|
| Sobre el Libro | 3 tags: Fantasía Oscura, Romance, Política |
| Los Protagonistas | Texto bajo ilustración diferente al Hero |
| La Autora | 3 párrafos de bio + cita completa sin `"..."` |
| Contacto | Botón WhatsApp genera URL `wa.me/...` en hover |

- [ ] **Step 3: Verificar que no hay regresiones**

Confirmar que estas secciones no fueron afectadas:
- Hero: badge, título, frase, CTA y portada correctos
- La Saga: mapa de galaxias y mockups de 7 libros visibles
- Comunidad: cards de Instagram y TikTok funcionales
- Footer: copyright y redes sociales correctos

- [ ] **Step 4: Commit final de verificación**

```bash
git add .
git commit -m "chore: verificación integral post-arreglos de auditoría"
```

---

## Notas importantes

**Lo que este plan NO toca** (bloqueado por Victoria):
- Sinopsis del libro → sigue mostrando placeholder hasta que Victoria la entregue
- Foto de la autora → sigue mostrando placeholder hasta que Victoria confirme
- Número de WhatsApp real → `links.ts` sigue con `584141234567` placeholder
- URL de Amazon real → `links.ts` sigue con URL placeholder

**Cuando Victoria entregue la info**, los arreglos se harán en un plan separado de 1 tarea:
- Sinopsis → `SinopsisSection.tsx:70-72`
- Foto → `SobreAutoraSection.tsx:66-77` (reemplazar div placeholder por `<Image>`)
- WhatsApp real → `src/config/links.ts:3`
- Amazon real → `src/config/links.ts:6`
