export const NAVIGATION_PATHS = [
  {
    name: 'Home',
    path: '#top'
  },
  {
    name: 'About',
    path: '#about'
  },
  {
    name: 'Projects',
    path: '#projects'
  },
  {
    name: 'Contact',
    path: '#contact'
  }
] as const

export const SERVER_PATH = import.meta.env.PUBLIC_SERVER_PATH