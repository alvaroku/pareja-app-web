# ParejaApp

Aplicación web moderna para fortalecer relaciones de pareja a través de la gestión compartida de citas, metas y memorias.

## Descripción

ParejaApp es una plataforma integral diseñada para ayudar a las parejas a organizar y mantener viva su relación. La aplicación permite:

- **Gestión de Citas**: Planifica y organiza encuentros románticos con fechas, ubicaciones y descripciones detalladas.
- **Metas Compartidas**: Define objetivos en pareja y realiza seguimiento del progreso de cada meta.
- **Memorias**: Captura y almacena momentos especiales con fotos y descripciones.
- **Gestión de Pareja**: Sistema de invitaciones para conectar con tu pareja y compartir contenido.
- **Perfil Personalizado**: Administra tu información personal y foto de perfil.

### Funcionalidades Próximas

- **Recordatorios de Citas**: Sistema de notificaciones automáticas por email para recordar citas próximas.
- **Calendario Compartido**: Vista mensual de todas las citas programadas.
- **Estadísticas de Relación**: Dashboard con métricas sobre citas completadas, metas alcanzadas y memorias creadas.
- **Notificaciones Push**: Alertas en tiempo real para eventos importantes.
- **Verificación de Correo**: Confirmación de email mediante enlace de activación al registrarse.
- **Recuperación de Contraseña**: Sistema de restablecimiento de contraseña mediante email.

### Tecnologías

- **Frontend**: Angular 21.0.2
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide Angular
- **Backend**: .NET 8.0 API
- **Hosting**: Firebase Hosting

## Instalación

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm (versión 9 o superior)
- Angular CLI 21.0.2

### Pasos de instalación

1. Clona el repositorio:
```bash
git clone https://github.com/alvaroku/pareja-app-web.git
cd pareja-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Copia `src/environments/environment.ts` como base
   - Ajusta la URL del API en `src/environments/environment.production.ts` para producción

## Ejecución

### Servidor de desarrollo

Para iniciar el servidor de desarrollo y abrir automáticamente en el navegador:

```bash
ng serve -o
```

La aplicación estará disponible en `http://localhost:4200/`

### Build de producción

Para compilar el proyecto para producción:

```bash
ng build
```

Los archivos compilados se generarán en el directorio `dist/pareja-app/browser/` optimizados para rendimiento.

Para build de producción con configuración específica:

```bash
ng build --configuration production
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── guards/           # Guards de autenticación
│   ├── interceptors/     # Interceptores HTTP
│   ├── layouts/          # Layouts de la aplicación
│   ├── models/           # Modelos de datos
│   ├── pages/            # Componentes de páginas
│   │   ├── citas/        # Gestión de citas
│   │   ├── metas/        # Gestión de metas
│   │   ├── memorias/     # Gestión de memorias
│   │   ├── perfil/       # Perfil de usuario
│   │   └── ...
│   ├── services/         # Servicios de la aplicación
│   └── shared/           # Componentes compartidos
├── environments/         # Configuración de entornos
└── styles.css           # Estilos globales
```

## Scripts Disponibles

- `ng serve -o` - Inicia el servidor de desarrollo
- `ng build` - Compila el proyecto
- `ng test` - Ejecuta las pruebas unitarias
- `ng lint` - Ejecuta el linter

## Despliegue

El proyecto está configurado para despliegue automático en Firebase Hosting mediante GitHub Actions:

- **Rama master**: Despliega automáticamente a producción
- **Pull Requests**: Genera preview deployments

