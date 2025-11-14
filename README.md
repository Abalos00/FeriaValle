# FeriaValle · Control de ventas sin conexión

FeriaValle es una PWA pensada para feriantes, emprendedores y comercios pequeños que necesitan registrar ventas, manejar inventario y generar reportes **aun cuando no tienen conexión a internet**. Todo se guarda localmente y se puede respaldar/restaurar con un clic.

## Tabla de contenido
1. [Características principales](#caracteristicas-principales)
2. [Diseño y experiencia](#diseno-y-experiencia)
3. [Respaldo automático de datos](#respaldo-automatico-de-datos)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Cómo ejecutar el proyecto](#como-ejecutar-el-proyecto)
6. [Guía para contribuir](#guia-para-contribuir)

## Características principales

| Módulo | Descripción |
| --- | --- |
| **Ventas** | Formulario rápido para registrar ventas, seleccionar productos, métodos de pago y obtener ganancias por unidad. |
| **Inventario** | Crear/editar productos, manejar stock, costes y boletas de honorarios con cálculo automático de 14.5%. |
| **Reportes** | Filtros por rango de fechas, métricas de ingresos, utilidades y exportación PDF/CSV. |
| **Ayuda** | Tutorial interactivo, preguntas frecuentes y consejos rápidos. Cada visita inicial muestra un guion guiado. |
| **Modo offline** | Detecta automáticamente la conectividad y permite trabajar sin red; sincroniza y respalda al volver a estar en línea. |

## Diseño y experiencia
- Estética “aurora glass” con tarjetas flotantes y transparencia suave.
- Navbar con indicador animado que se desliza entre tabs y menú hamburguesa para abrir el panel lateral en móviles.
- El panel “Modo en línea” funciona como sidebar (desktop) y drawer (móvil) para mostrar estado, uso de almacenamiento y botones de respaldo.
- Tipografías: `Inter` para cuerpo y `Poppins` para encabezados (ver `docs/brand-guidelines.md`).
- Inputs/botones laminados: bordes redondos, sombras suaves y estados accesibles.

## Respaldo automático de datos

El hook `useBackupManager` implementa una estrategia híbrida:
- **OPFS (Origin Private File System)**: si el navegador lo soporta, guarda `feriavalle-backups/ultimo-respaldo.json` directamente en el almacenamiento del sitio. El usuario solo presiona “Respaldo” o “Restaurar”, sin descargar archivos manualmente.
- **Fallback**: en navegadores sin OPFS se descarga un JSON con los datos y posteriormente se puede importar.

Además, en el sidebar existe un enlace “Importar archivo” para cargar un respaldo externo.

## Estructura del proyecto

```
src/
  components/
    Navbar.tsx
    offline/StatusSidebar.tsx
    tutorial/TutorialOverlay.tsx
    ...
  hooks/
    useOffline.ts
    useBackupManager.ts
    useTutorial.ts
  pages/
    VentasPage.tsx
    InventarioPage.tsx
    ReportesPage.tsx
    AyudaPage.tsx
  store/useStore.ts
  App.tsx
docs/
  brand-guidelines.md
```

## Cómo ejecutar el proyecto
1. Clona el repositorio y entra al directorio.
2. Instala dependencias: `npm install`.
3. Desarrollo: `npm run dev` (Vite abrirá `http://localhost:5173`).
4. Build: `npm run build`.
5. Preview: `npm run preview`.

> Nota: para que la detección offline funcione correctamente, ejecuta en un entorno con HTTPS o localhost y habilita el service worker en producción.

## Guía para contribuir

1. Respeta la [norma gráfica](docs/brand-guidelines.md): colores, tipografías y estados.
2. Antes de abrir un PR:
   - Ejecuta `npm run build`.
   - Si agregas nuevas vistas/componentes, documenta su comportamiento.
3. Para propuestas grandes (nuevos módulos, integraciones externas), crea primero un issue describiendo el caso de uso.

**Contacto:** Si tienes dudas sobre diseño o roadmap, abre un issue o escribe a g.abalos.v@gmail.com. Estamos construyendo este panel pensando en feriantes que necesitan herramientas gratuitas, robustas y disponibles aun sin conexión. ¡Toda ayuda es bienvenida! ❤️
