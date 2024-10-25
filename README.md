# Trellify

![Logo](https://res.cloudinary.com/ma-cloud/image/upload/v1729893029/findy/logo_g0ff2y.png)


Trellify es una aplicación web similar a Trello que posibilita la creación de espacio de trabajo con tableros, columnas y tarjetas para organizar tareas. Es ideal para aquellos que desean tener una herramienta gráfica de trabajo en proyectos o actividades personales.

## Aspectos destacados del proyecto: 

1. Creación de Tableros: Se crea tableros con fondos seleccionados por el usuario (fotos o colores).
2. Columnas y Tarjetas: Crea grupos tareas en columnas y los reubicúa según la dinámica del proyecto.
3. Favoritos: Marcar tableros como favoritos para poder acceder a ellos en línea de preferencia.
4. Autenticación con Google: Puedes inciar sesión mediante el proveedor de Google con Firebase.

## Tech Stack 

### Desarrollo Front-end

* Tailwind CSS: Es un framework de CSS de código abierto​ para el diseño de páginas web. 
* Vite: Es una herramienta de desarrollo rápido y liviana que se utiliza principalmente en proyectos de desarrollo web front-end, especialmente con tecnologías como React, Vue.js, y Svelte, aunque no se limita a ellas.
  
### Gestión del Estado: 

* Redux: Un contenedor de estado predecible tanto como para aplicaciones con JavaScript como para TypeScript, ampliamente utilizado con React para gestionar el estado de la aplicación.

### Base de datos, Autenticación de Usuarios y Almacenamiento en la Nube:

* Firebase: Es una plataforma de desarrollo de aplicaciones móviles y web desarrollada por Google. Ofrece una amplia gama de servicios y herramientas que simplifican el desarrollo de aplicaciones y permiten a los desarrolladores construir aplicaciones de alta calidad de manera más rápida y eficiente.

### Framework de Desarrollo Front-end: 

* React: Una popular biblioteca de JavaScript para construir interfaces de usuario, que ofrece un desarrollo basado en componentes y una eficiente renderización del DOM.

### Gestión de Medios: 

* Cloudinary: Una plataforma de gestión de medios basada en la nube que te permite almacenar, gestionar y entregar imágenes y videos para tu aplicación.

## Instalación

### Requisitos previos: 

- Instalar Node js, para esto puedes correr el siguiente comando en tu terminal:

```bash
node js -v
```
En caso contario, puedes intalarlo con el siguiente comando: 

```bash
npm install node
```  
### Proceso de instalación 

1. Clonar el proyecto Trellify.

  - Asegurate de crear una carpeta en tu directorio antes de correr el siguiente comando en la terminal:
     
```bash
git clone https://github.com/christianrivera98/Trellify.git
```
  - Abrir el proyecto instalado:
  
```bash
cd Trellify
```
2. Instalación de paquetes y dependencias:

```bash
npm install
```
3. Abre el proyecto en tu editor, en cao de estar usando VSC:

```bash
code .
```
6. Crea un archivo .env en la raíz del proyecto con las siguientes variables (ajústalas a tu configuración de Firebase y Cloudinary):

```
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-auth-domain
VITE_FIREBASE_PROJECT_ID=tu-project-id
VITE_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
VITE_CLOUDINARY_API_KEY=tu-api-key
```
5. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

## Autores 
* Christian Lamadrid: https://github.com/christianrivera98

