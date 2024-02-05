export const NAVIGATION_PATHS = [
  {
    name: 'Inicio',
    path: '#top'
  },
  {
    name: 'Proyectos',
    path: '#projects'
  },
  {
    name: 'Sobre mí',
    path: '#about'
  },
  {
    name: 'Contacto',
    path: '#contact'
  }
] as const

export const SERVER_PATH = import.meta.env.PUBLIC_SERVER_PATH
