# API REST - Sistema de Usuarios y Artículos
### Parcial Desarrollo Web

#### Presentado por:
- Mariana Patiño
- Mariana Gutierrez
- Sebastian Lopez

---

## ✅ Checklist de Requisitos del Parcial

### Punto 1 — Usuarios y Autenticación
- [x] Registro de usuario con `username`, `password` y `rol`
- [x] El password se guarda como **Hash con bcryptjs** (nunca en texto plano)
- [x] Login que valida credenciales y retorna un **token JWT**
- [x] El token incluye el `id`, `username`, `rol` del usuario y tiene **expiración de 5 días**
- [x] El token se verifica como middleware en las rutas protegidas

### Punto 2 — Crear artículos (solo Admin)
- [x] Ruta protegida para crear artículos con `titulo`, `descripcion` y `precio`
- [x] Solo un usuario con `rol: admin` puede crear artículos
- [x] Si un usuario `standard` intenta crear un artículo, recibe un error **403 Forbidden**
- [x] Validación de campos obligatorios y precio mayor a 0

### Punto 3 — Consultar artículos (usuario estándar)
- [x] Ruta protegida para listar todos los artículos
- [x] Cualquier usuario autenticado (admin o standard) puede consultarlos
- [x] Requiere token válido en el header `Authorization`

---

## 🏗️ Arquitectura del Proyecto

```
DesarrolloWeb-Parcial/
│
├── index.js                    → Punto de entrada: conecta MongoDB y levanta el servidor
├── application.js              → Configura Express, middlewares y registra los routers
│
├── models/                     → Capa de datos (Mongoose Schemas)
│   ├── usuarioModel.js         → Schema: username, password (hash), rol
│   └── articuloModel.js        → Schema: titulo, descripcion, precio
│
├── controllers/                → Lógica de negocio
│   ├── usuarioController.js    → registrar() y login()
│   └── articuloController.js   → crearArticulo() y obtenerArticulos()
│
├── routers/                    → Definición de rutas y métodos HTTP
│   ├── usuarioRouter.js        → POST /api/usuario/registrar  |  POST /api/usuario/login
│   └── articuloRouter.js       → POST /api/articulo  |  GET /api/articulos
│
├── helpers/
│   └── auth.js                 → Generación y verificación de tokens JWT
│
├── package.json
└── .gitignore
```

---

## 🔐 Lógica de Seguridad

### Hash de contraseña (bcryptjs)
Cuando un usuario se registra, el password **nunca se guarda en texto plano**. Se aplica `bcrypt.hashSync(password, 10)` que genera un hash irreversible. Al hacer login, se usa `bcrypt.compareSync()` para comparar sin necesidad de desencriptar.

```
password ingresado → bcrypt hash → guardado en MongoDB
password al login  → bcrypt.compareSync() → true/false
```

### JWT (JSON Web Token)
Al registrarse o hacer login exitoso, el servidor devuelve un **token JWT** firmado. Este token contiene:
- `sub` → ID del usuario en MongoDB
- `username` → nombre de usuario
- `rol` → `admin` o `standard`
- `iat` → fecha de creación
- `exp` → fecha de expiración (5 días)

El token debe enviarse en cada petición protegida dentro del header:
```
Authorization: Bearer <token>
```

### Control de Roles
El middleware `auth.verificarToken` decodifica el token y adjunta el rol al request (`req.userRol`). Los controladores verifican ese rol antes de ejecutar la acción:

```
Token válido ✓ → req.userRol = 'admin' → puede crear artículo ✓
Token válido ✓ → req.userRol = 'standard' → ERROR 403 al intentar crear ✗
```

---

## 📡 Endpoints de la API

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| `POST` | `/api/usuario/registrar` | Público | Registra un nuevo usuario |
| `POST` | `/api/usuario/login` | Público | Autentica y devuelve token |
| `POST` | `/api/articulo` | 🔒 Solo Admin | Crea un nuevo artículo |
| `GET` | `/api/articulos` | 🔒 Autenticado | Lista todos los artículos |

---

## 📦 Cuerpos de Petición (JSON)

**Registrar usuario:**
```json
{
  "username": "mariana",
  "password": "miPassword123",
  "rol": "admin"
}
```

**Login:**
```json
{
  "username": "mariana",
  "password": "miPassword123"
}
```

**Crear artículo** *(requiere header `Authorization: Bearer <token>` con rol admin)*:
```json
{
  "titulo": "Camiseta Nike",
  "descripcion": "Camiseta deportiva talla M",
  "precio": 75000
}
```

---

## 🚀 Cómo Ejecutar el Proyecto

**Requisitos previos:**
- Node.js instalado
- MongoDB corriendo localmente en el puerto `27017`

**Pasos:**
```bash
# 1. Instalar dependencias
npm install

# 2. Correr el servidor
node index.js

# Servidor disponible en: http://localhost:1702
```

> ⚠️ **Nota:** Usar **CMD** o **Git Bash** para correr los comandos npm. PowerShell puede bloquear scripts por política de ejecución de Windows.

---

## 🗄️ Modelos de Base de Datos

**Usuario:**
```
username  → String, único, obligatorio
password  → String (hash bcrypt), obligatorio
rol       → String, enum: ['admin', 'standard'], default: 'standard'
```

**Artículo:**
```
titulo      → String, obligatorio
descripcion → String, obligatorio
precio      → Number, obligatorio, mayor a 0
```
