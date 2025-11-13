# Norma Gráfica — FeriaValle 2.0

Esta norma documenta el lenguaje visual único implementado en la nueva interfaz híbrida de FeriaValle. Todo diseño futuro (web, PWA, soporte impreso o redes) debe adherirse a estas pautas para mantener una experiencia coherente.

---

## 1. ADN de marca
- **Concepto:** tablero antideslizante para negocios que operan con o sin internet.
- **Sensación:** nocturna, futurista y cálida; combina tecnología (auroras, vidrio) con cercanía (tipografía redondeada, microcopys optimistas).
- **Palabras clave:** híbrido · seguro · fluido · humano.

---

## 2. Paleta cromática

| Token | Hex | Uso principal |
| --- | --- | --- |
| `midnight-900` | `#0B1120` | Fondo global. |
| `aurora-700` | `#111633` | Gradiente base / overlays. |
| `primary-400` | `#60A5FA` | Highlights, líneas activas. |
| `primary-600` | `#2563EB` | Botones + progresos. |
| `glow-rose` | `#F472B6` | Alertas suaves, focos secundarios. |
| `emerald-400` | `#34D399` | Estado en línea, confirmaciones. |
| `slate-100` | `#F1F5F9` | Tipografía sobre fondos claros. |
| `glass-white` | `rgba(255,255,255,0.85)` | Tarjetas flotantes. |

**Gradiente aurora oficial:** `radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.3), transparent 35%), radial-gradient(circle at 50% 80%, rgba(129,140,248,0.35), transparent 30%)`.

**Regla de contraste:** texto sobre vidrio ≥ `#0F172A` al 80% de opacidad; texto sobre fondo oscuro ≥ `glass-white`.

---

## 3. Tipografía
- `Inter` (peso 400-700) = base UI.
- `Poppins` (peso 600-700) = display/hero (clase `font-display`).
- Jerarquías:
  - Display hero: 32/40 `font-display font-semibold`.
  - Títulos secciones: 24/32 `font-semibold`.
  - UI y métricas: 16/24 `font-medium`.
  - Etiquetas: 12/18 `uppercase tracking-[0.3em]`.

---

## 4. Layout y espaciado
- **Background global:** degradado oscuro + patrón puntual (`#root` con dots).
- **Contenedor principal:** tarjeta gigante `rounded-[32px]` sobre fondo aurora con `shadow-[0_35px_80px_rgba(15,23,42,0.35)]`.
- **Cards** (`Card` component): `rounded-3xl`, `bg-white/70`, `backdrop-blur-xl`, bordes `border-white/40` y hover con elevación.
- **Espaciado base:** 4 px. Secciones: 32 px, sub-elementos: 12-16 px.

---

## 5. Componentes clave
### Navbar
- Bloque flotante `rounded-3xl`, `bg-white/10`, blur y sombra profunda.
- Logo: ícono carrito en cubo `w-12 h-12` gradiente primario.
- Texto: etiqueta uppercase + título con `font-display`.
- Botones: chips `rounded-2xl`; activos `bg-white text-primary-600`, inactivos `text-white/80`.
- Estado conexión: cápsula `bg-emerald-500/20` o `bg-rose-500/20`.

### Barra Offline / Respaldo
- Contenedor `rounded-[28px]`, gradiente translúcido.
- Icono de estado dentro de bloque `p-3` con color dinámico.
- Medidor de almacenamiento 2 px, degrade azul; alerta >85% cambia a rosa.
- Botones reutilizan el componente `Button` (`secondary` = vidrio, `primary` = gradiente).

### Botones
- Forma `rounded-2xl`, tipografía semibold.
- Primario: gradiente `primary-400 → primary-600`, sombra dinámica `shadow-button`.
- Secundario: `bg-white/10` + borde `white/30`, ideal para fondos oscuros.
- Todos los estados deben animarse con `transform` y `box-shadow`.

### Tarjetas de datos y formularios
- Tarjetas = glass, icono dentro de `w-12 h-12` con degradé.
- Formularios: inputs blancos sobre fondo claro, contenedor dentro de tarjeta gigante.

### Tutorial
- Aparece solo cuando `showWelcome` finaliza.
- Tooltip ocupa `max-w-sm`, fondo blanco puro, borde `#E2E8F0`, contadores con chips `primary-500`.

---

## 6. Iconografía & gráficos
- Librería única: `lucide-react`, stroke 1.5 px.
- Tamaños: 16–20 px en botones, 24 px en tarjetas, 32+ px en hero.
- Ilustraciones = blobs suaves, sin personajes; combinar con degradés aurora y partículas.

---

## 7. Animaciones
- Bienvenida multislide (1.7 s cada slide) con barra de progreso y blur backgrounds.
- Interacciones generales: `animate-fade-in`, `animate-slide-up`, `hover:-translate-y-0.5`.
- Estados offline: icono `WifiOff` con `animate-pulse` discreto.
- Botones: sombra incrementa y traslada -0.5 px en hover.

---

## 8. Uso del modo offline
- Mostrar barra secundaria inmediatamente bajo el navbar.
- Mensajes positivos, nunca alarmistas; rojos suaves solo cuando haya riesgo (espacio >85%).
- Tutorial y ayuda deben recalcar que los respaldos viven en esa barra.

---

## 9. Assets mínimos
1. **Logotipo tipográfico**: FeriaValle en `Inter Bold`, color `slate-100`.
2. **Ícono**: carrito en gradiente `primary-400 → primary-700` dentro de cubo redondeado.
3. **Capturas**: ubicar tarjetas en fondo aurora, con sombra profunda y borde blanco translúcido.

---

## 10. Gobernanza
- Toda pantalla nueva debe declarar: colores usados, estados del componente y animaciones asociadas.
- Cambios en tokens (colores/espaciados/tipografías) requieren actualizar `tailwind.config.js` y este documento.
- Verificar accesibilidad (WCAG AA) tanto en modo oscuro (actual) como en contextos impresos claros.

Esta norma diferencia a FeriaValle de dashboards genéricos al abrazar un estilo aurora-glass moderno, reforzando que la plataforma es tan avanzada como accesible para comercios locales.
