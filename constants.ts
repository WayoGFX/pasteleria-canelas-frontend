import { Category, Product, CustomCakeSection } from './types';

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER; // numero telefono
export const BUSINESS_NAME = import.meta.env.VITE_BUSINESS_NAME; // nombre de la empresa

export const TESTIMONIALS = [
  {
    quote: "Muy buenos pasteles, te dan precios accesibles y no usan mucho el fondan como hacen en otras pastelerías 👌🏿👌🏿👌🏿",
    author: "Krissia Tobías",
    rating: 5,
  },
  {
    quote: "Muy buena atención, riquísimos el pan dulce y pasteles.",
    author: "Guadalupe Vasquez",
    rating: 5,
  },
  {
    quote: "Comida: 5/5  |  Servicio: 5/5  |  Ambiente: 5/5",
    author: "Cesi Estrada",
    rating: 5,
  },
];


export const CUSTOM_CAKE_OPTIONS: CustomCakeSection[] = [
  {
    id: 'size',
    name: 'Tamaño (Porciones)',
    options: [
      { id: 'small', name: '10', image: '/assets/personalizados/tamano/10porciones.png' },
      { id: 'medium', name: '15', image: '/assets/personalizados/tamano/15porciones.png' },
      { id: 'large', name: '20', image: '/assets/personalizados/tamano/20porciones.png' },
      { id: 'extralarge', name: '30', image: '/assets/personalizados/tamano/30porciones.png' },
    ],
  },
  {
    id: 'shape',
    name: 'Forma del Pastel',
    options: [
      { id: 'round', name: 'Redondo', image: '/assets/personalizados/forma/redondo.png' },
      { id: 'square', name: 'Cuadrado', image: '/assets/personalizados/forma/cuadrado.png' },
      { id: 'rectangle', name: 'Rectangular', image: '/assets/personalizados/forma/rectangular.png' },
    ],
  },
  {
    id: 'flavor',
    name: 'Sabor del Pan',
    options: [
      { id: 'vanilla', name: 'Vainilla', image: '/assets/personalizados/pan/vainilla.png' },
      { id: 'chocolate', name: 'Chocolate', image: '/assets/personalizados/pan/chocolate.png' },
      { id: 'strawberry', name: 'Fresa', image: '/assets/personalizados/pan/fresa.png' },
       { id: 'redvelvet', name: 'Red Velvet', image: '/assets/personalizados/pan/red-velvet.png' },
    ],
  },
  {
    id: 'syrup',
    name: 'Remojo',
    options: [
       { id: 'no-syrup', name: 'Sin Remojo', image: 'https://placehold.co/500x500/00000000/00000000?text=invisible' },
       { id: 'traditional', name: 'Tres leches', image: '/assets/personalizados/remojo/tresleches.png' },
       { id: 'rompope', name: 'Rompope', image: '/assets/personalizados/remojo/rompope.png' },
       { id: 'coffee', name: 'Café', image: '/assets/personalizados/remojo/cafe.png' },
       { id: 'chocolate', name: 'Chocolate', image: '/assets/personalizados/remojo/chocolate.png' },
    ]
  },
  {
    id: 'filling',
    name: 'Relleno',
    options: [
      { id: 'dulce-de-leche', name: 'Dulce de Leche', image: '/assets/personalizados/relleno/dulce-de-leche.png' },
      { id: 'strawberry-jam', name: 'Mermelada de Fresa', image: '/assets/personalizados/relleno/mermelada-fresa.png' },
      { id: 'chocolate-ganache', name: 'Ganache de Chocolate', image: '/assets/personalizados/relleno/chocolate.png' },
      { id: 'cream-cheese', name: 'Betún de Queso Crema', image: '/assets/personalizados/relleno/quesocrema.png' },
    ],
  },
  {
    id: 'frosting',
    name: 'Cobertura',
    options: [
      { id: 'frutal', name: 'Frutal', image: '/assets/personalizados/cobertura/frutal.png' },
      { id: 'meringue', name: 'Merengue Italiano', image: '/assets/personalizados/cobertura/merengue.png' },
      { id: 'fondant', name: 'Fondant', image: '/assets/personalizados/cobertura/fondant.png' },
      { id: 'whipped-cream', name: 'Crema Batida', image: '/assets/personalizados/cobertura/crema-batida.png' },
      { id: 'frutal', name: 'Frutal', image: '/assets/personalizados/cobertura/frutal.png' },
    ],
  },
];