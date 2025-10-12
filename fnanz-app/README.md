# Fnanz Angular Frontend

Proyecto base en Angular standalone orientado a servicios para la plataforma Fnanz. La aplicación incluye una capa de servicios HTTP reutilizable y un módulo de ejemplo (dashboard) que consume datos desde dichos servicios.

## Requisitos previos

- Node.js 18 LTS o superior (recomendado Node 20)
- npm 9+

## Instalación

```bash
npm install
```

Las dependencias incluyen `bootstrap`, `@popperjs/core` y `bootswatch` (tema **Yeti**) instaladas con:

```bash
npm install bootstrap@^5 @popperjs/core bootswatch@^5
```

> **Nota:** En este entorno no fue posible descargar las dependencias de npm por políticas de red, pero el `package.json` queda listo para que ejecutes la instalación en tu máquina local y obtengas los paquetes de Bootswatch/Bootstrap.

## Theming global con Bootswatch

El archivo global `src/styles.scss` importa el tema Yeti siguiendo la secuencia recomendada por Bootswatch:

```scss
@import "bootswatch/dist/yeti/variables";
@import "bootstrap/scss/bootstrap";
@import "bootswatch/dist/yeti/bootswatch";
```

Si quieres cambiar a otro tema, sustituye `yeti` por el nombre del tema deseado (por ejemplo `cerulean`, `cosmo`, etc.) en esas tres rutas.

## Scripts disponibles

- `npm run start`: levanta la aplicación en modo desarrollo (`http://localhost:4200`).
- `npm run build`: genera un build optimizado para producción.
- `npm run test`: ejecuta las pruebas unitarias con Karma + Jasmine.

## Configuración de entornos

La URL base del backend se define en `src/environments`:

- `environment.development.ts`: usado al ejecutar `ng serve` (modo desarrollo).
- `environment.ts`: usado en el build de producción.

Ajusta la propiedad `apiBaseUrl` con la URL real de tus servicios.

## Próximos pasos

1. Conectar los servicios reales usando los contratos Swagger que compartirás.
2. Reemplazar la respuesta mock del `DashboardService` por llamadas a los endpoints reales.
3. Añadir nuevas pantallas reutilizando la capa de servicios (`ApiHttpService`).

## Estructura relevante

```
src/
├── app/
│   ├── app.component.*        # Shell principal
│   ├── app.config.ts          # Configuración global de providers
│   ├── app.routes.ts          # Ruteo principal
│   ├── core/
│   │   └── services/          # Servicios compartidos (HTTP, environment, etc.)
│   ├── features/
│   │   └── dashboard/         # Ejemplo de pantalla basada en servicios
│   └── shared/                # Modelos y utilidades compartidas
└── environments/              # Configuración de entornos
```
