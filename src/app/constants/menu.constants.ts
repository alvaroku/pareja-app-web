import { MenuItem } from "../models/menu-item.model";

export const menuHome: MenuItem = {
  id: 1,
  ruta: '/app/home',
  icono: 'home',
  nombre: 'Inicio'
};

export const menuCitas: MenuItem = {
  id: 2,
  ruta: '/app/citas',
  icono: 'calendar',
  nombre: 'Citas'
};

export const menuMetas: MenuItem = {
  id: 3,
  ruta: '/app/metas',
  icono: 'target',
  nombre: 'Metas'
};

export const menuMemorias: MenuItem = {
  id: 4,
  ruta: '/app/memorias',
  icono: 'camera',
  nombre: 'Memorias'
};

export const menuUsuarios: MenuItem = {
  id: 5,
  ruta: '/app/usuarios',
  icono: 'users',
  nombre: 'Usuarios'
};

export const menuPerfil: MenuItem = {
  id: 6,
  ruta: '/app/perfil',
  icono: 'user',
  nombre: 'Perfil'
};

export const menuItems: MenuItem[] = [
  menuHome,
  menuCitas,
  menuMetas,
  menuMemorias,
  menuUsuarios,
  menuPerfil
];
