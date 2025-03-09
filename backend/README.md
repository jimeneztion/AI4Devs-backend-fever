# LTI - Sistema de Seguimiento de Talento | Backend

Este directorio contiene el código del servidor (backend) para el Sistema de Seguimiento de Talento de LTI. El backend está construido con Express y TypeScript, utilizando Prisma como ORM para interactuar con la base de datos PostgreSQL.

## Estructura del Proyecto

El backend sigue una arquitectura basada en Domain-Driven Design (DDD) con una clara separación de responsabilidades:

- `src/`: Contiene el código fuente del backend.
  - `application/`: Capa de aplicación con la lógica de negocio.
    - `services/`: Servicios que implementan la lógica de negocio.
    - `validator/`: Validadores para asegurar la integridad de los datos.
  - `domain/`: Contiene los modelos del dominio y la lógica de negocio central.
    - `models/`: Modelos de dominio que representan las entidades del sistema.
  - `infrastructure/`: Código relacionado con infraestructura externa.
  - `presentation/`: Capa de presentación.
    - `controllers/`: Controladores que manejan las peticiones HTTP.
  - `routes/`: Definiciones de rutas para la API.
  - `index.ts`: Punto de entrada del servidor.
- `prisma/`: Contiene el esquema Prisma y migraciones.

## Instalación y Configuración

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Configurar variables de entorno:
   Asegúrate de tener un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombrebd"
   ```

3. Generar cliente Prisma:

   ```bash
   npx prisma generate
   ```

4. Ejecutar migraciones:

   ```bash
   npx prisma migrate dev
   ```

5. Poblar la base de datos con datos de prueba (opcional):

   ```bash
   ts-node seed.ts
   ```

6. Iniciar el servidor:
   ```bash
   npm start
   ```

## API Endpoints

### Candidatos

#### Obtener un candidato por ID

```
GET /candidates/:id
```

**Respuesta exitosa (200 OK)**

```json
{
  "id": 1,
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "phone": "666555444",
  "address": "Calle Principal 123",
  "educations": [...],
  "workExperiences": [...],
  "resumes": [...]
}
```

#### Añadir un nuevo candidato

```
POST /candidates
```

**Cuerpo de la solicitud**

```json
{
  "firstName": "María",
  "lastName": "García",
  "email": "maria.garcia@example.com",
  "phone": "666777888",
  "address": "Avenida Central 456",
  "educations": [
    {
      "institution": "Universidad Complutense",
      "title": "Ingeniería Informática",
      "startDate": "2015-09-01",
      "endDate": "2019-06-30"
    }
  ],
  "workExperiences": [
    {
      "company": "Empresa XYZ",
      "position": "Desarrolladora",
      "description": "Desarrollo de aplicaciones web",
      "startDate": "2019-07-01",
      "endDate": "2021-12-31"
    }
  ],
  "cv": {
    "filePath": "uploads/cv-maria.pdf",
    "fileType": "application/pdf"
  }
}
```

**Respuesta exitosa (201 Created)**

```json
{
  "message": "Candidate added successfully",
  "data": {
    "id": 2,
    "firstName": "María",
    "lastName": "García",
    "email": "maria.garcia@example.com",
    "phone": "666777888",
    "address": "Avenida Central 456"
  }
}
```

#### Actualizar la etapa de un candidato

```
PUT /candidates/:id/stage
```

**Cuerpo de la solicitud**

```json
{
  "stageId": 2
}
```

**Respuesta exitosa (200 OK)**

```json
{
  "message": "Etapa del candidato actualizada correctamente"
}
```

### Posiciones

#### Obtener una posición por ID

```
GET /positions/:id
```

**Respuesta exitosa (200 OK)**

```json
{
  "id": 1,
  "companyId": 1,
  "title": "Desarrollador Full Stack",
  "description": "Buscamos desarrollador Full Stack con experiencia en React y Node.js",
  "status": "Active",
  "isVisible": true,
  "location": "Madrid",
  "jobDescription": "Descripción detallada del puesto..."
}
```

#### Obtener candidatos para una posición

```
GET /positions/:id/candidates
```

**Respuesta exitosa (200 OK)**

```json
[
  {
    "candidateId": 1,
    "fullName": "Juan Pérez",
    "current_interview_step": "Entrevista Técnica",
    "averageScore": 4.2
  },
  {
    "candidateId": 2,
    "fullName": "María García",
    "current_interview_step": "Entrevista HR",
    "averageScore": 3.8
  }
]
```

## Errores Comunes

### 400 Bad Request

```json
{
  "error": "Formato de ID inválido"
}
```

### 404 Not Found

```json
{
  "error": "Candidato no encontrado"
}
```

```json
{
  "error": "Posición no encontrada"
}
```

```json
{
  "error": "Etapa de entrevista no encontrada"
}
```

```json
{
  "error": "El candidato no tiene aplicaciones activas"
}
```

### 500 Internal Server Error

```json
{
  "error": "Error interno del servidor"
}
```

## Ejemplos de Uso

### Actualizar la etapa de un candidato en el proceso de entrevista

```bash
curl -X PUT http://localhost:3010/candidates/1/stage \
  -H "Content-Type: application/json" \
  -d '{"stageId": 2}'
```

### Obtener todos los candidatos para una posición específica

```bash
curl -X GET http://localhost:3010/positions/1/candidates
```

## Notas Adicionales

- La API se ejecuta en el puerto 3010 por defecto.
- Todos los endpoints que devuelven datos de candidatos o posiciones requieren IDs numéricos válidos.
- Las puntuaciones (scores) de las entrevistas se calculan como un promedio simple de todas las entrevistas realizadas.
