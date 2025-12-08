# Integración Frontend-Backend - Pareja App

## 📋 Resumen

El frontend Angular está completamente conectado al backend .NET 8.0 con los siguientes componentes:

## 🔧 Configuración

### Environments
- **environment.ts** (desarrollo): `http://localhost:5185/api`
- **environment.prod.ts** (producción): `http://localhost:5185/api`

### HttpClient & Interceptors
- ✅ HttpClient configurado en `app.config.ts`
- ✅ AuthInterceptor añade automáticamente el token JWT a todas las peticiones

### Guards
- ✅ AuthGuard protege las rutas `/app/*`
- Redirige a `/login` si no hay token válido

## 📦 Modelos TypeScript

Todos los modelos coinciden con los DTOs del backend:

- **usuario.model.ts**: Usuario, LoginDto, RegisterDto, LoginResponse
- **cita.model.ts**: Cita, CreateCitaDto, UpdateCitaDto
- **meta.model.ts**: Meta, CreateMetaDto, UpdateMetaDto
- **memoria.model.ts**: Memoria, CreateMemoriaDto, UpdateMemoriaDto
- **api-response.model.ts**: ApiResponse<T>, PagedResponse<T>

## 🔐 Servicios Implementados

### AuthService (`auth.service.ts`)
```typescript
login(credentials: LoginDto): Observable<ApiResponse<LoginResponse>>
register(data: RegisterDto): Observable<ApiResponse<LoginResponse>>
logout(): void
isAuthenticated(): boolean
currentUser$: Observable<Usuario | null>
token$: Observable<string | null>
```

**Almacenamiento:**
- Token JWT en `localStorage` → clave: `token`
- Usuario actual en `localStorage` → clave: `currentUser`

### CitaService (`cita.service.ts`)
```typescript
getById(id: number): Observable<ApiResponse<Cita>>
getAll(): Observable<ApiResponse<Cita[]>>
getPaged(pageNumber, pageSize): Observable<PagedResponse<Cita>>
getByUsuarioId(usuarioId: number): Observable<ApiResponse<Cita[]>>
create(cita: CreateCitaDto): Observable<ApiResponse<Cita>>
update(cita: UpdateCitaDto): Observable<ApiResponse<Cita>>
delete(id: number): Observable<ApiResponse<boolean>>
```

### MetaService (`meta.service.ts`)
```typescript
getById(id: number): Observable<ApiResponse<Meta>>
getAll(): Observable<ApiResponse<Meta[]>>
getPaged(pageNumber, pageSize): Observable<PagedResponse<Meta>>
getByUsuarioId(usuarioId: number): Observable<ApiResponse<Meta[]>>
create(meta: CreateMetaDto): Observable<ApiResponse<Meta>>
update(meta: UpdateMetaDto): Observable<ApiResponse<Meta>>
delete(id: number): Observable<ApiResponse<boolean>>
```

### MemoriaService (`memoria.service.ts`)
```typescript
getById(id: number): Observable<ApiResponse<Memoria>>
getAll(): Observable<ApiResponse<Memoria[]>>
getPaged(pageNumber, pageSize): Observable<PagedResponse<Memoria>>
getByUsuarioId(usuarioId: number): Observable<ApiResponse<Memoria[]>>
create(memoria: CreateMemoriaDto): Observable<ApiResponse<Memoria>>
update(memoria: UpdateMemoriaDto): Observable<ApiResponse<Memoria>>
delete(id: number): Observable<ApiResponse<boolean>>
```

## 🎯 Ejemplo de Uso (CitasComponent)

```typescript
// 1. Inyectar servicios
constructor(
  private citaService: CitaService,
  private authService: AuthService,
  private loaderService: LoaderService
) {}

// 2. Cargar datos del usuario logueado
loadCitas() {
  const usuario = this.authService.currentUserValue;
  if (!usuario) return;

  this.loaderService.showLoading();
  
  this.citaService.getByUsuarioId(usuario.id).subscribe({
    next: (response) => {
      this.loaderService.hideLoading();
      if (response.isSuccess) {
        this.citas = response.data;
      } else {
        this.errorMessage = response.message;
      }
    },
    error: (error) => {
      this.loaderService.hideLoading();
      this.errorMessage = 'Error al cargar las citas';
    }
  });
}

// 3. Crear nueva cita
createCita() {
  const usuario = this.authService.currentUserValue;
  
  const nuevaCita: CreateCitaDto = {
    titulo: 'Cena romántica',
    descripcion: 'Restaurante italiano',
    fecha: '2025-12-15T20:00:00',
    lugar: 'La Taverna',
    usuarioId: usuario!.id
  };

  this.citaService.create(nuevaCita).subscribe({
    next: (response) => {
      if (response.isSuccess) {
        this.loadCitas(); // Recargar lista
      }
    },
    error: (error) => console.error(error)
  });
}
```

## 🚀 Componentes Actualizados

### Login & Register
- ✅ Conectados al backend vía `AuthService`
- ✅ Manejo de errores con mensajes visuales
- ✅ Redirección automática después de login exitoso
- ✅ Token y usuario guardados en localStorage

### MenuLayout
- ✅ Botón de logout funcional
- ✅ Llama a `authService.logout()` que limpia localStorage y redirige

### CitasComponent (ejemplo completo)
- ✅ Carga citas del usuario logueado
- ✅ Muestra mensaje si no hay citas
- ✅ Botón eliminar funcional
- ✅ Manejo de errores
- ✅ Integración con LoaderService

## 📝 Patrón de Respuestas del Backend

Todas las respuestas del backend siguen este formato:

```typescript
interface ApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  data: T;
  message: string;
  errors: string[];
}
```

**Ejemplo de manejo:**
```typescript
this.citaService.getAll().subscribe({
  next: (response) => {
    if (response.isSuccess) {
      // Éxito: usar response.data
      this.items = response.data;
    } else {
      // Error del servidor: usar response.message
      this.errorMessage = response.message;
    }
  },
  error: (error) => {
    // Error de red/conexión
    this.errorMessage = error.error?.message || 'Error de conexión';
  }
});
```

## 🔄 Flujo de Autenticación

1. Usuario envía credenciales en `/login` o `/register`
2. Backend valida y responde con `{ usuario, token }`
3. AuthService guarda en localStorage:
   - `token` → JWT string
   - `currentUser` → JSON del usuario
4. AuthService emite valores en BehaviorSubjects
5. AuthInterceptor añade header `Authorization: Bearer {token}` a todas las peticiones
6. AuthGuard verifica token antes de acceder a `/app/*`

## ⚠️ Pendientes de Implementación

Los siguientes componentes tienen el HTML pero aún **NO** están conectados al backend:

- **MetasComponent**: Agregar lógica similar a CitasComponent
- **MemoriasComponent**: Agregar lógica similar a CitasComponent
- **PerfilComponent**: Mostrar/editar datos del usuario actual
- **HomeComponent**: Dashboard con resumen de citas/metas/memorias

## 🛠️ Cómo Implementar en Otros Componentes

**Patrón recomendado:**

```typescript
// 1. Importar servicios
import { MetaService } from '../../services/meta.service';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';

// 2. Inyectar en constructor
constructor(
  private metaService: MetaService,
  private authService: AuthService,
  private loaderService: LoaderService
) {}

// 3. Cargar datos en ngOnInit
ngOnInit() {
  this.loadMetas();
}

// 4. Método para cargar datos
loadMetas() {
  const usuario = this.authService.currentUserValue;
  if (!usuario) return;

  this.loaderService.showLoading();
  
  this.metaService.getByUsuarioId(usuario.id).subscribe({
    next: (response) => {
      this.loaderService.hideLoading();
      if (response.isSuccess) {
        this.metas = response.data;
      }
    },
    error: (error) => {
      this.loaderService.hideLoading();
      console.error('Error:', error);
    }
  });
}
```

## 🔗 Endpoints del Backend

Base URL: `http://localhost:5185/api`

### Auth
- `POST /auth/login` → LoginDto
- `POST /auth/register` → RegisterDto

### Citas (requiere auth)
- `GET /citas` → Lista todas
- `GET /citas/paged?pageNumber=1&pageSize=10` → Paginadas
- `GET /citas/{id}` → Una cita
- `GET /citas/usuario/{usuarioId}` → Citas del usuario
- `POST /citas` → Crear
- `PUT /citas/{id}` → Actualizar
- `DELETE /citas/{id}` → Eliminar

### Metas (requiere auth)
- Mismos endpoints que Citas, reemplazar `/citas` por `/metas`

### Memorias (requiere auth)
- Mismos endpoints que Citas, reemplazar `/citas` por `/memorias`

## ✅ Checklist de Conexión

- [x] Environments configurados
- [x] HttpClient + AuthInterceptor
- [x] AuthGuard en rutas protegidas
- [x] Modelos TypeScript
- [x] AuthService completo
- [x] CitaService completo
- [x] MetaService completo
- [x] MemoriaService completo
- [x] Login funcional
- [x] Register funcional
- [x] Logout funcional
- [x] CitasComponent con ejemplo completo
- [ ] MetasComponent pendiente
- [ ] MemoriasComponent pendiente
- [ ] PerfilComponent pendiente
- [ ] HomeComponent pendiente
