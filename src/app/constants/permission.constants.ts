import { UserRole } from "../models/usuario.model";
import { menuCitas, menuHome, menuMemorias, menuMetas, menuPerfil, menuUsuarios } from "./menu.constants";

export const permissionUser =  [menuHome,menuCitas,menuMetas,menuMemorias,menuPerfil]

export const permissionSuperAdmin = [menuHome,menuCitas,menuMetas,menuMemorias,menuUsuarios,menuPerfil]

export const PERMISSIONS = {
  [UserRole.User]: permissionUser ,
  [UserRole.SuperAdmin]: permissionSuperAdmin
}
