# Gradient Able Template Integration Plan

## 1. Preparación fuera del repositorio
- Crea una rama nueva desde `work` para aislar los cambios visuales, por ejemplo `git checkout -b feature/gradient-able-shell`.
- Descomprime el ZIP del template **fuera** del repositorio para evitar que Git intente versionar todos los archivos automáticamente. Un directorio temporal recomendado es `/workspace/tmp-gradient`.
  ```bash
  mkdir -p /workspace/tmp-gradient
  unzip -q gradient-able-free-admin-template-v5.4.0.zip -d /workspace/tmp-gradient
  ```
- Revisa la estructura descomprimida y anota qué librerías, imágenes y fuentes son imprescindibles. Evita copiar contenido duplicado con lo que ya usa la app (por ejemplo Bootstrap o iconos ya existentes).
- Decide un mapa de destino para los assets seleccionados dentro de `fnanz-app/src/assets/gradient-able/`, manteniendo subcarpetas claras (`css/`, `js/`, `images/`, `fonts/`).
- Documenta en esta misma guía qué archivos se copiarán en cada fase antes de moverlos definitivamente al repo.

## 2. Fase 1 – Assets base del tema
- Copia sólo los assets globales imprescindibles y registra cada lote en un commit pequeño.
- Actualiza `angular.json` agregando las rutas a los CSS/JS globales necesarios.
- Verifica con `ng serve` que no aparezcan errores por assets faltantes.

## 3. Fase 2 – Estilos globales y variables
- Extrae los estilos base en parciales SCSS y cárgalos desde `src/styles.scss`.
- Mantén la nomenclatura de variables de color existente (`--fnanz-*`) y crea un mapeo hacia las variables del template.
- Aísla tipografías y resets en commits separados para facilitar la revisión.

## 4. Fase 3 – Shell de la aplicación
- Refactoriza el layout principal (`app.component.html`/`.scss`) replicando la estructura de Gradient Able (sidebar, header, footer) mediante componentes Angular reutilizables.
- Inserta `router-outlet` en el contenedor correcto antes de migrar el resto de las páginas.

## 5. Fase 4 – Páginas funcionales
- Migra cada vista funcional en commits independientes, reutilizando la arquitectura de features existente (`src/app/features`).
- Prioriza dashboards y páginas con mayor tráfico para validar el layout antes.

## 6. Fase 5 – Limpieza y verificación
- Elimina assets sin uso y verifica que el ZIP no quede versionado.
- Ejecuta lint y pruebas (`npm run lint`, `npm run test`) y captura capturas de pantalla clave si hay cambios visuales significativos.
- Documenta en el PR cualquier dependencia nueva o instrucciones de build.
