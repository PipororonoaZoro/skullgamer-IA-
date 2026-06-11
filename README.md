# 1. Nombre de la aplicación
SkullGamer AI

# 2. Descripción del problema
En el mercado local de insumos de tecnología y hardware, los pequeños comercios y técnicos independientes suelen gestionar la atención y sus presupuestos de forma completamente manual a través de aplicaciones de mensajería como WhatsApp. Envían catálogos en archivos estáticos (PDF o Excel) que quedan obsoletos rápidamente debido a la constante variación de precios. Esto provoca una saturación de consultas repetitivas de los usuarios sobre compatibilidad de componentes (procesadores, placas madre, placas de video, memorias, almacenamiento y gabinetes) o recomendaciones para ejecutar software específico, ralentizando la atención y provocando la pérdida de clientes potenciales por falta de respuestas dinámicas.

# 3. Usuario objetivo
* **Clientes / Entusiastas del Hardware**: Usuarios que necesitan armar una computadora completa desde cero o actualizar sus componentes de forma óptima según sus necesidades específicas de juego o presupuestos acotados.
* **Comerciantes / Técnicos de PC locales**: Pequeños negocios que buscan automatizar la etapa inicial de asesoramiento y filtrado de stock para agilizar las ventas.

# 4. Solución propuesta
**SkullGamer AI** es una plataforma web Full-Stack que funciona como un asistente inteligente de hardware. Integra un modelo de Inteligencia Artificial (Gemini 2.5 Flash) configurado a través de un servidor backend. El sistema actúa como un técnico virtual interactivo: interpreta los requisitos del cliente (presupuesto disponible o juegos/programas que desea ejecutar) y genera al instante un presupuesto personalizado completo, sumando de forma exacta los costos de los componentes en stock (incluyendo CPU, GPU, Motherboard, RAM, SSD, Gabinete y Fuente) y garantizando la compatibilidad técnica.

# 5. Demo o prototipo
La propuesta cuenta con un prototipo funcional interactivo e integrado. Se adjunta la URL de despliegue generada y capturas de pantalla de la interfaz de usuario en producción, donde se documenta un flujo real en el que un cliente solicita una configuración de $600 USD para correr juegos como Red Dead Redemption 2, Valheim y League of Legends a 1080p, recibiendo asesoramiento inmediato basado en las existencias del comercio.

*(Aquí sumás tu captura de pantalla de la interacción y el enlace que te dé Vercel o GitHub).*

# 6. Funcionalidades construidas
* **Autenticación de Usuarios (Firebase Auth)**: Sistema de inicio de sesión seguro con Google, protegiendo el acceso a la plataforma.
* **Interfaz Gamer Inmersiva**: UI desarrollada con modo oscuro de alto contraste y acentos en rojo carmesí para conectar con el público objetivo.
* **Control Remoto de Contexto (System Instructions)**: Configuración del backend que restringe las respuestas del modelo para que se limite estrictamente al catálogo oficial.
* **Presupuestador Automatizado Integral**: Capacidad de procesar los precios del hardware y devolver cálculos precisos sumando mothers, micros, discos, etc., mostrando el monto total acumulado.
* **Filtro Semántico por Perfil de Uso**: El asistente procesa el lenguaje natural del usuario y determina qué componentes mitigan cuellos de botella según el juego solicitado.

# 7. Herramientas utilizadas
* **Project IDX**: Entorno de desarrollo en la nube utilizado para codificar el espacio de trabajo.
* **Google AI Studio / Gemini API**: Para la generación de la clave de acceso segura (GEMINI_API_KEY) y el consumo del modelo de lenguaje en el servidor.
* **Vite & React / HTML / JS**: Para la estructura, estilos y dinamismo de la interfaz de chat en el Frontend.
* **Node.js & Express**: Framework del lado del servidor empleado para canalizar las consultas de la API de forma segura mediante variables de entorno (.env).
* **Vercel & GitHub**: Herramientas utilizadas para el control de versiones y el despliegue de la aplicación web en producción.

# 8. Conceptos vistos en clase que fueron aplicados

* **Frontend (La interfaz del usuario)**
  * **Vite + React + TypeScript**: Armé una interfaz rápida, moderna y tipada para evitar errores en el código.
  * **Componentes modulares**: Separé la aplicación en bloques limpios (por ejemplo, el componente `<Chat />` maneja de forma aislada toda la ventana de los mensajes).
  * **Diseño y Estilos**: Usé archivos CSS (`index.css`) adaptados con una estética gamer, oscura y fluida para la experiencia del usuario.

* **Backend (El servidor)**
  * **Node.js + Express (`server.ts`)**: Hice un servidor backend propio para manejar la lógica de la aplicación fuera del alcance del navegador.
  * **Servidor Mixto (Monorepo)**: Armé una estructura donde el backend y el frontend conviven de forma integrada, permitiendo que la app se ejecute localmente con un único ecosistema de dependencias (`package.json`).

* **Integración con Inteligencia Artificial**
  * **Google Gemini API**: Conecté la aplicación con los modelos avanzados de IA de Google Studio.
  * **Seguridad de Claves (Variables de Entorno)**: Di uso a una API Key (`GEMINI_API_KEY`) protegida mediante variables de entorno en archivos `.env` para que la clave secreta de Google nunca quede expuesta públicamente en el código.

* **Despliegue (Raciocinio sobre la publicación)**
  * **Configuración de Servidores Cloud (`vercel.json`)**: Creé y estructuré un archivo de rutas específico para guiar a plataformas en la nube sobre cómo compilar el frontend y rutear las peticiones hacia el backend de Node.js.

# 9. Limitaciones actuales
* Los datos de stock y precios están acoplados al prompt del sistema en el servidor, lo que significa que el comerciante debe editar el código fuente si cambian los valores.
* No cuenta con conexión en tiempo real a una base de datos externa persistente (como MongoDB/Firestore) para automatizar el inventario o administrar el historial completo en base de datos.

# 10. Posibles mejoras futuras
* **Persistencia Integral de Datos**: Migrar el catálogo estático del servidor hacia Firebase Firestore o MongoDB para permitir actualizaciones dinámicas desde un panel administrador.
* **Integración de Cierre de Venta (API WhatsApp)**: Agregar un botón automatizado que recopile el desglose final generado por la IA y lo envíe estructurado en un solo clic al WhatsApp del local.

# 11. Instrucciones de instalación local
1. Clona este repositorio: `git clone <tu-url-de-github>`
2. Instala las dependencias: `npm install`
3. Renombra el archivo `.env.example` a `.env` y rellena tus claves de Gemini (`GEMINI_API_KEY`) y la configuración de Firebase (`VITE_FIREBASE_*`).
4. Inicia el servidor de desarrollo: `npm run dev`
5. Abre `http://localhost:3000` en tu navegador.

# 12. Despliegue en Vercel
Este repositorio está pre-configurado para desplegarse fácilmente en Vercel. 
1. Crea un nuevo proyecto en Vercel e importa el repositorio de GitHub.
2. En las configuraciones del proyecto (Environment Variables), asegúrate de agregar todas las mismas variables indicadas en `.env.example`, especialmente `GEMINI_API_KEY` y las de `VITE_FIREBASE_*`.
3. Vercel detectará el archivo `vercel.json` y los scripts en `package.json`, realizando el build full-stack (frontend + backend de Express) automáticamente.
