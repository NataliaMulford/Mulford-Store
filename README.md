# MULFORD KORE

### Belleza, estilo y una experiencia de compra digital.

Mulford Kore es una tienda online independiente enfocada en la comercialización de productos de belleza y cosmética.

Este proyecto consiste en el desarrollo de una plataforma de comercio electrónico propia, diseñada para ofrecer a los clientes una experiencia de navegación y compra sencilla, organizada y adaptable a diferentes dispositivos.

El desarrollo integra una interfaz web, una API para la gestión de información y una base de datos para administrar los productos y pedidos.

## Funcionalidades

- Página principal de la tienda.
- Catálogo de productos.
- Navegación por categorías.
- Visualización de productos.
- Carrito de compras.
- Proceso de checkout y creación de pedidos.
- Selección de métodos de pago disponibles.
- Gestión de pedidos.
- Panel administrativo.
- Gestión de inventario y disponibilidad de productos.
- Diseño adaptable a dispositivos móviles y escritorio.

## Tecnologías

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- C#
- ASP.NET Core Web API
- Entity Framework Core
- Autenticación mediante JWT

### Base de datos
- Microsoft SQL Server

### Herramientas de desarrollo
- Visual Studio Code
- Visual Studio
- Git
- GitHub
- Postman

## Arquitectura

La plataforma está organizada en dos componentes principales:

**Frontend:** interfaz con la que interactúan los clientes y el personal administrativo.

**Backend:** API encargada de procesar las solicitudes, gestionar productos y pedidos, y comunicarse con la base de datos.

## Estructura del repositorio

```text
Mulford-Store/
│
├── assets/
├── backend/
│   └── MulfordStore.API/
│       ├── Controllers/
│       ├── Data/
│       ├── DTOs/
│       ├── Migrations/
│       └── Models/
│
├── css/
├── data/
├── js/
├── pages/
│
├── admin.html
├── catalogo.html
├── categorias.html
├── index.html
├── producto.html
└── README.md