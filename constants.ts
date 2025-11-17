import { Category, Product, CustomCakeSection } from './types';

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER; // numero telefono
export const BUSINESS_NAME = import.meta.env.VITE_BUSINESS_NAME; // nombre de la empresa

export const TESTIMONIALS = [
  {
    quote: "¡El pastel de chocolate es una obra de arte! Nunca he probado algo tan delicioso y perfectamente equilibrado. Se ha convertido en mi favorito.",
    author: "Ana López",
    rating: 5,
  },
  {
    quote: "La atención es maravillosa y los postres son de otro nivel. El cheesecake de fresa es cremoso y fresco. ¡Totalmente recomendado!",
    author: "Carlos Mendoza",
    rating: 5,
  },
  {
    quote: "Cada pan dulce es un viaje a la infancia. Las conchas son increíblemente suaves y esponjosas. Un lugar con auténtico sabor a hogar.",
    author: "Sofía Ramírez",
    rating: 5,
  },
];


export const CUSTOM_CAKE_OPTIONS: CustomCakeSection[] = [
  {
    id: 'size',
    name: 'Tamaño (porciones)',
    options: [
      { id: 'small', name: '10-15', image: 'https://placehold.co/500x500/00000000/00000000?text=invisible' },
      { id: 'medium', name: '20-25', image: 'https://placehold.co/500x500/00000000/00000000?text=invisible' },
      { id: 'large', name: '30-40', image: 'https://placehold.co/500x500/00000000/00000000?text=invisible' },
    ],
  },
  {
    id: 'shape',
    name: 'Forma del Pastel',
    options: [
      { id: 'round', name: 'Redondo', image: 'https://placehold.co/500x500/00000000/00000000?text=invisible' },
      { id: 'square', name: 'Cuadrado', image: 'https://placehold.co/500x500/00000000/00000000?text=invisible' },
      { id: 'rectangle', name: 'Rectangular', image: 'https://placehold.co/500x500/00000000/00000000?text=invisible' },
    ],
  },
  {
    id: 'flavor',
    name: 'Sabor del Pan',
    options: [
      { id: 'vanilla', name: 'Vainilla', image: 'https://placehold.co/500x500/F3E5AB/3A2413?text=Pan+Vainilla' },
      { id: 'chocolate', name: 'Chocolate', image: 'https://placehold.co/500x500/5C4033/FFFFFF?text=Pan+Chocolate' },
      { id: 'strawberry', name: 'Fresa', image: 'https://placehold.co/500x500/FFB6C1/3A2413?text=Pan+Fresa' },
       { id: 'redvelvet', name: 'Red Velvet', image: 'https://placehold.co/500x500/9B1C31/FFFFFF?text=Pan+Red+Velvet' },
    ],
  },
  {
    id: 'syrup',
    name: 'Remojo (Tres Leches)',
    options: [
       { id: 'no-syrup', name: 'Sin Remojo', image: 'https://placehold.co/500x500/00000000/00000000?text=invisible' },
       { id: 'traditional', name: 'Tradicional', image: 'https://placehold.co/500x500/FFFFFF40/3A2413?text=Remojo' },
       { id: 'rompope', name: 'Rompope', image: 'https://placehold.co/500x500/F0E68C60/3A2413?text=Rompope' },
       { id: 'coffee', name: 'Café', image: 'https://placehold.co/500x500/6F4E3760/FFFFFF?text=Caf%C3%A9' },
    ]
  },
  {
    id: 'filling',
    name: 'Relleno',
    options: [
      { id: 'dulce-de-leche', name: 'Dulce de Leche', image: 'https://placehold.co/500x500/C3834C70/FFFFFF?text=Relleno' },
      { id: 'strawberry-jam', name: 'Mermelada de Fresa', image: 'https://placehold.co/500x500/DE316370/FFFFFF?text=Relleno' },
      { id: 'chocolate-ganache', name: 'Ganache de Chocolate', image: 'https://placehold.co/500x500/39120670/FFFFFF?text=Relleno' },
      { id: 'cream-cheese', name: 'Betún de Queso Crema', image: 'https://placehold.co/500x500/F5F5DC70/3A2413?text=Relleno' },
    ],
  },
  {
    id: 'frosting',
    name: 'Cobertura',
    options: [
      { id: 'buttercream', name: 'Buttercream', image: 'https://placehold.co/500x500/F0FFF0E6/3A2413?text=Cobertura' },
      { id: 'meringue', name: 'Merengue Italiano', image: 'https://placehold.co/500x500/FFFFFFE6/3A2413?text=Cobertura' },
      { id: 'fondant', name: 'Fondant', image: 'https://placehold.co/500x500/FFFFFF/3A2413?text=Cobertura' },
      { id: 'whipped-cream', name: 'Crema Batida', image: 'https://placehold.co/500x500/FFFAFAE6/3A2413?text=Cobertura' },
    ],
  },
];