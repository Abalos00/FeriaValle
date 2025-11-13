import React, { useState } from 'react';
import { 
  HelpCircle, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Mail,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  Receipt,
  WifiOff,
  ShieldCheck,
  DownloadCloud,
  UploadCloud
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTutorial } from '../../hooks/useTutorial';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  steps: string[];
}

const tutorials: TutorialStep[] = [
  {
    id: 'ventas',
    title: 'Registrar una Venta',
    description: 'Aprende a registrar tus ventas diarias de forma rápida y sencilla',
    icon: ShoppingCart,
    steps: [
      'Ve a la sección "Ventas" desde el menú principal',
      'Selecciona el producto que vendiste del listado desplegable',
      'Ingresa la cantidad vendida',
      'Elige el método de pago (efectivo, transferencia o tarjeta)',
      'Agrega notas adicionales si es necesario',
      'Haz clic en "Registrar Venta" para guardar',
      'La venta aparecerá inmediatamente en el resumen del dí­a'
    ]
  },
  {
    id: 'inventario',
    title: 'Gestionar Inventario',
    description: 'Mantén control de tus productos, precios y stock disponible',
    icon: Package,
    steps: [
      'Accede a la sección "Inventario"',
      'Haz clic en "Nuevo Producto" para agregar un artículo',
      'Completa el nombre, precio de venta y costo del producto',
      'Establece el stock inicial disponible',
      'Opcionalmente, asigna una cateegoría',
      'Guarda el producto con "Crear Producto"',
      'Usa los botones de editar o eliminar para modificar productos existentes'
    ]
  },
  {
    id: 'reportes',
    title: 'Ver Reportes y Estadísticas',
    description: 'Analiza tus ventas y genera reportes para tomar mejores decisiones',
    icon: BarChart3,
    steps: [
      'Dirígete a la sección "Reportes"',
      'Selecciona el período que deseas analizar (hoy, esta semana, este mes, etc.)',
      'Revisa las métricas principales: ventas totales, ingresos y ganancias',
      'Consulta los productos más vendidos',
      'Revisa el historial de ventas recientes',
      'Usa los botones "PDF" o "CSV" para exportar los datos',
      'Los archivos se descargarán automáticamente a tu dispositivo'
    ]
  },
  {
    id: 'honorarios',
    title: 'Configurar Boletas de Honorarios',
    description: 'Aprende a configurar productos que requieren boletas de honorarios (14.5%)',
    icon: Receipt,
    steps: [
      'Ve a la sección "Inventario"',
      'Al crear o editar un producto, marca la casilla "Uso boletas de honorarios"',
      'El sistema calculará automáticamente el descuento del 14.5%',
      'La ganancia mostrada será la ganancia neta después del descuento',
      'En las ventas verás el desglose completo incluyendo honorarios',
      'Los reportes mostrarán las ganancias reales después de honorarios'
    ]
  }
];

export const HelpView: React.FC = () => {
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null);
  const { resetTutorial } = useTutorial();

  const toggleTutorial = (id: string) => {
    setExpandedTutorial(expandedTutorial === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white text-gray-900 border border-gray-100 shadow-sm">

        <div className="text-center">

          <div className="flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mx-auto mb-4">

            <HelpCircle className="w-8 h-8 text-primary-600" />

          </div>

          <h2 className="text-2xl font-bold mb-2">Centro de Ayuda</h2>

          <p className="text-gray-600">

            Aprende a usar todas las funciones de FeriaValle - tu herramienta gratuita de control de ventas

          </p>

          <div className="mt-4">

            <Button

              variant="secondary"

              size="sm"

              onClick={resetTutorial}

              className="text-primary-600 border-primary-200 bg-primary-50 hover:bg-primary-100"

              icon={PlayCircle}

            >

              Ver Tutorial Interactivo

            </Button>

          </div>

        </div>

      </Card>

      {/* Offline & Backups */}
      <Card className="border border-primary-100 bg-gradient-to-r from-primary-50/70 to-white shadow-sm">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 flex items-start space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full">
              <WifiOff className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Modo sin conexión reforzado</h3>
              <p className="text-sm text-gray-600">
                Revisa la nueva barra de estado bajo el menú para conocer tu conexión, espacio utilizado y accesos directos a respaldos.
              </p>
              <div className="flex items-center space-x-2 text-primary-600 mt-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-medium">Tus datos permanecen solo en tu dispositivo</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 text-primary-600 mb-2">
                <UploadCloud className="w-5 h-5" />
                <h4 className="font-semibold text-gray-900">Respaldos manuales</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Toca "Respaldo" para descargar un archivo con todos tus productos y ventas. Funciona sin internet y lo puedes guardar en la nube o un pendrive.
              </p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-5">
                <li>Incluye inventario y historial de ventas.</li>
                <li>Ideal para compartir con tu contador.</li>
                <li>Ãšsalo también como copia externa de seguridad.</li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 text-primary-600 mb-2">
                <DownloadCloud className="w-5 h-5" />
                <h4 className="font-semibold text-gray-900">Restauración rápida</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Con el botón "Restaurar" puedes cargar un respaldo previo y recuperar tu negocio completo en segundos, incluso si cambiaste de dispositivo.
              </p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-5">
                <li>Compatible con todos los respaldos de FeriaValle.</li>
                <li>No requiere conexión.</li>
                <li>Los reportes PDF/CSV siguen disponibles desde la sección de reportes.</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PlayCircle className="w-5 h-5 mr-2 text-primary-600" />
          Consejos RÃ¡pidos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-success-50 rounded-lg border border-success-200">
            <h4 className="font-medium text-success-800 mb-2">Registra ventas al instante</h4>
            <p className="text-sm text-success-700">
              Registra cada venta inmediatamente para no olvidar ninguna transacción y mantener datos precisos.
            </p>
          </div>
          <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
            <h4 className="font-medium text-warning-800 mb-2">Revisa tus reportes</h4>
            <p className="text-sm text-warning-700">
              Consulta tus reportes semanalmente para identificar tendencias y productos más exitosos.
            </p>
          </div>
          <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
            <h4 className="font-medium text-primary-800 mb-2">Funciona sin internet</h4>
            <p className="text-sm text-primary-700">
              FeriaValle funciona completamente offline y es 100% gratuita. Tus datos se guardan localmente.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-800 mb-2">Exporta tus datos</h4>
            <p className="text-sm text-purple-700">
              Descarga reportes en PDF o CSV para compartir con tu contador o para respaldo.
            </p>
          </div>
        </div>
      </Card>

      {/* Tutorials */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Tutoriales Paso a Paso</h3>
        <div className="space-y-4">
          {tutorials.map((tutorial) => {
            const Icon = tutorial.icon;
            const isExpanded = expandedTutorial === tutorial.id;
            
            return (
              <div key={tutorial.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleTutorial(tutorial.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{tutorial.title}</h4>
                        <p className="text-sm text-gray-600">{tutorial.description}</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4 animate-slide-up">
                    <div className="ml-13 space-y-3">
                      {tutorial.steps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-primary-600 text-white text-xs font-medium rounded-full flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* FAQ */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preguntas Frecuentes</h3>
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-900 mb-2">¿Mis datos están seguros?</h4>
            <p className="text-sm text-gray-600">
             Sí­, FeriaValle almacena todos tus datos localmente en tu dispositivo. Es 100% gratuita y no envía 
             información a servidores externos, garantizando tu privacidad.
            </p>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-900 mb-2">¿Puedo usar la app sin internet?</h4>
            <p className="text-sm text-gray-600">
              Absolutamente. La aplicación está diseñada para funcionar completamente offline. 
              Puedes registrar ventas, gestionar inventario y ver reportes sin conexión a internet.
            </p>
          </div>
          <div className="border-b border-gray-200 pb-4">
           <h4 className="font-medium text-gray-900 mb-2">¿Cómo funciona el cálculo de honorarios?</h4>
           <p className="text-sm text-gray-600">
             Si usas boletas de honorarios, marca la opción al crear productos. FeriaValle calculará automáticamente 
             el 14.5% de descuento y te mostrará tu ganancia real después de este costo.
           </p>
         </div>
         <div className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-900 mb-2">¿Cómo hago respaldo de mis datos?</h4>
            <p className="text-sm text-gray-600">
              Bajo el menú principal verás la barra de estado: presiona "Respaldo" para descargar un archivo con toda tu información y 
              "Restaurar" para recuperarla cuando lo necesites, incluso sin internet. Además, en la sección Reportes sigues teniendo exportaciones en PDF o CSV para compartir.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">¿La app funciona en todos los dispositivos?</h4>
            <p className="text-sm text-gray-600">
             Sí­, FeriaValle es responsive y funciona en todos los dispositivos. Es gratuita y está 
             optimizada especialmente para uso en dispositivos móviles.
            </p>
          </div>
        </div>
      </Card>

      {/* Contact Support */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Necesitas más ayuda?</h3>
          <p className="text-gray-600 mb-4">
            FeriaValle es una herramienta gratuita creada para ayudar a emprendedores. Si tienes problemas o sugerencias, contáctanos.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Reporta errores o solicita ayuda:</p>
            <a 
              href="mailto:g.abalos.v@gmail.com?subject=Soporte%20-%20FeriaValle&body=Describe%20tu%20problema%20o%20consulta%20aquÃ­..."
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <Mail className="w-4 h-4" />
              <span>g.abalos.v@gmail.com</span>
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            FeriaValle es gratuita y responderemos tu consulta lo antes posible
          </p>
        </div>
      </Card>
    </div>
  );
};



