export interface Hotspot {
  id: string;
  x: number; // Coordenada relativa 0-1
  y: number; // Coordenada relativa 0-1
  title: string;
  description: string;
  image?: string; // Opcional para futuras expansiones
  isProminent?: boolean; // Si true, hotspot más visible y destacado
}

export type LoreBulletIcon = 'diamond' | 'plus' | 'asterisk';

export interface LorePoint {
  text: string;
  icon?: LoreBulletIcon;
}

export interface RealmLore {
  title: string;
  subtitle: string;
  points: LorePoint[];
}

export interface Realm {
  id: string;
  name: string;
  title: string;
  description: string;
  backgroundImage: string;
  order: number; // 1 = Luz, 2 = Central, 3 = Oscuro
  hotspots?: Hotspot[];
  lore?: RealmLore;
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
    ],
    lore: {
      title: 'El Reino de la Luz',
      subtitle: 'Hogar de los dragones',
      points: [
        { icon: 'diamond', text: 'El reino más rico, creador del concepto del dinero.' },
        { icon: 'diamond', text: 'Rico en tierras y minerales.' },
        { icon: 'diamond', text: 'El reino pacífico.' },
        { icon: 'diamond', text: 'Cuna del arte.' },
        { icon: 'diamond', text: 'Elitistas por excelencia, clasistas, engreídos (pero algunos son cheveres).' }
      ]
    }
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
    ],
    lore: {
      title: 'El Reino Central',
      subtitle: 'El corazón del universo',
      points: [
        { icon: 'diamond', text: 'Está exactamente en el universo.' },
        { icon: 'diamond', text: 'Proteccionistas de la naturaleza, el océano y toda criatura viviente.' },
        { icon: 'plus', text: 'Los seres centrales están conectados con la naturaleza y con los sentimientos.' },
        { icon: 'plus', text: 'Son amables, pero fuertes; no dejarse engañar por ellos o tus cosechas pagarán el precio.' }
      ]
    }
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
    ],
    lore: {
      title: 'El Reino Oscuro',
      subtitle: 'La base del cono cósmico',
      points: [
        { icon: 'diamond', text: 'Viven criaturas monstruosas de todo tipo.' },
        { icon: 'diamond', text: 'En constantes guerras territoriales.' },
        { icon: 'diamond', text: 'Se prioriza la razón por encima de los sentimientos.' },
        { icon: 'plus', text: 'Hay más dioses, por lo tanto son los que empiezan las guerras.' },
        { icon: 'diamond', text: 'Gobernado por los dioses Seth (Dios de la Muerte & el Inframundo) y Laila (Diosa de la Oscuridad).' },
        { icon: 'asterisk', text: 'Reino de mayor extensión de territorio. Donde no solo están los reinos principales (Norte, Este, Oeste, Sur), sino el territorio de las galaxias, donde viven criaturas grandiosas como peligrosas. Al igual, abundancia en recursos tecnológicos, minerales y mágicos.' }
      ]
    }
  }
];
