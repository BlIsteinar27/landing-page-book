export interface Hotspot {
  id: string;
  x: number; // Coordenada relativa 0-1
  y: number; // Coordenada relativa 0-1
  title: string;
  description: string;
  image?: string; // Opcional para futuras expansiones
  isProminent?: boolean; // Si true, hotspot más visible y destacado
}

export interface Realm {
  id: string;
  name: string;
  title: string;
  description: string;
  backgroundImage: string;
  order: number; // 1 = Luz, 2 = Central, 3 = Oscuro
  hotspots?: Hotspot[];
}

export const realms: Realm[] = [
  {
    id: 'realm-light',
    name: 'Reino de la Luz',
    title: 'Reino de la Luz',
    description: 'La cúspide del cono cósmico, donde habitan los dioses de mayor jerarquía.',
    backgroundImage: '/landing-book-victoria/reino-de-la-luz.jpg',
    order: 1,
    hotspots: [
      {
        id: 'realm-light-hotspot',
        x: 0.5,
        y: 0.5,
        title: 'Reino de la Luz',
        description: 'Explora el reino donde habitan los dioses de mayor jerarquía',
        isProminent: true
      }
    ]
  },
  {
    id: 'realm-central',
    name: 'Reino Central',
    title: 'Reino Central',
    description: 'El punto medio del universo, equilibrio entre luz y oscuridad.',
    backgroundImage: '/landing-book-victoria/reino-central.jpg',
    order: 2,
    hotspots: [
      {
        id: 'realm-central-hotspot',
        x: 0.5,
        y: 0.5,
        title: 'Reino Central',
        description: 'Explora el punto medio del universo, equilibrio entre luz y oscuridad',
        isProminent: true
      }
    ]
  },
  {
    id: 'realm-dark',
    name: 'Reino Oscuro',
    title: 'Reino Oscuro',
    description: 'La base del cono, hogar de galaxias y misterios cósmicos.',
    backgroundImage: '/landing-book-victoria/reino-oscuro.png',
    order: 3,
    hotspots: [
      {
        id: 'galaxy-map',
        x: 0.5,
        y: 0.5,
        title: 'Reino Oscuro',
        description: 'Explora las galaxias del universo de Dioses Universales',
        image: '/landing-book-victoria/Mapa de galaxias arreglado_20260622_174207_0000 (1).svg',
        isProminent: true
      }
    ]
  }
];
