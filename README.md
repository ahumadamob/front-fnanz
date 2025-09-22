# Fnanz Frontend

Aplicación Angular para consumir la API Fnanz expuesta en `http://localhost:8080`. El proyecto está organizado alrededor de servicios que encapsulan la comunicación con los recursos principales expuestos en el swagger proporcionado (usuarios, categorías financieras y gastos reservados).

## Requisitos

- Node.js 18 o superior (Angular 20 requiere al menos Node 18)
- NPM 9 o superior
- Angular CLI 20 se instalará localmente con `npm install`
- API backend disponible en `http://localhost:8080`

## Instalación

```bash
npm install
```

## Scripts disponibles

- `npm start`: levanta la aplicación en modo desarrollo (`http://localhost:4200`).
- `npm run build`: genera una compilación de producción en `dist/`.
- `npm run test`: ejecuta los tests unitarios con Karma.

> Si estás ejecutando el proyecto en un entorno sin acceso a Internet es posible que la instalación de dependencias de Angular falle. En ese caso, descarga las dependencias previamente o configura un registro npm accesible.

## Estructura destacada

- `src/app/core/models`: definiciones tipadas basadas en los DTO expuestos por la API.
- `src/app/core/services`: servicios Angular que encapsulan cada recurso del swagger.
- `src/app/features/dashboard`: componente principal que utiliza los servicios para consultar la API y mostrar la información.
- `src/environments`: configuración de entornos con la URL base de la API.

## Configuración de entorno

Por defecto la URL de la API se define en `src/environments/environment*.ts`. Ajusta `apiUrl` según corresponda a tu despliegue backend.
