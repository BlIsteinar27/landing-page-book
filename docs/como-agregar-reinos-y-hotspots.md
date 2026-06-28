# Cómo Agregar Nuevos Reinos y Hotspots

## Agregar un Nuevo Reino

1. Abrir `src/config/realms-data.ts`
2. Agregar nuevo objeto al array `realms`:

```typescript
{
  id: 'realm-nuevo',
  name: 'Nombre del Reino',
  title: 'Título para Display',
  description: 'Descripción del reino',
  backgroundImage: '/ruta/a/imagen.jpg',
  order: 4, // Número de orden (debe ser único)
  hotspots: [] // Array vacío o con hotspots predefinidos
}
```

3. Colocar la imagen en `public/landing-book-victoria/`
4. El componente se renderizará automáticamente en el orden especificado

## Agregar un Hotspot a un Reino Existente

1. Abrir `src/config/realms-data.ts`
2. Encontrar el reino deseado en el array `realms`
3. Agregar hotspot al array `hotspots`:

```typescript
hotspots: [
  {
    id: 'hotspot-unico',
    x: 0.5, // Coordenada X (0 = izquierda, 1 = derecha)
    y: 0.5, // Coordenada Y (0 = arriba, 1 = abajo)
    title: 'Título del Hotspot',
    description: 'Descripción del punto de interés',
    image: '/ruta/a/imagen-opcional.jpg' // Opcional
  }
]
```

4. Las coordenadas son relativas (0-1), por lo que funcionan en cualquier tamaño de pantalla

## Coordenadas de Hotspots

- `x: 0.5` = Centro horizontal
- `y: 0.5` = Centro vertical
- `x: 0.2` = 20% desde la izquierda
- `y: 0.8` = 80% desde arriba

Para encontrar coordenadas precisas:
1. Abrir la imagen en un editor de imágenes
2. Usar la herramienta de medición
3. Dividir la posición en píxeles por el ancho/alto total de la imagen

## Agregar Imagen Opcional a Hotspot

Si el hotspot debe abrir un overlay con una imagen:
1. Colocar la imagen en `public/landing-book-victoria/`
2. Agregar la propiedad `image` al hotspot
3. El componente `GalaxyOverlay` se usará automáticamente

## Notas

- El orden de los reinos se determina por la propiedad `order`
- Los IDs deben ser únicos
- Las imágenes deben estar optimizadas para web (JPEG/WebP, calidad 80-85%)
- Para hotspots sin imagen, se mostrará un tooltip con título y descripción
