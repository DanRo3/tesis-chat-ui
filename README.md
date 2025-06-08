# Tesis Chat UI: Frontend para Sistema Multiagente

Este proyecto es la interfaz de usuario frontend para un sistema de chat multiagente. Proporciona una interfaz fácil de usar para interactuar con los servicios backend que gestionan la autenticación de usuarios, la gestión de chats y el análisis y visualización de datos impulsados por IA.

## ✨ Características

*   Autenticación y autorización de usuarios
*   Gestión de sesiones de chat
*   Mensajería en tiempo real
*   Visualización de respuestas de texto e imagen de los agentes de IA
*   Visualización interactiva de datos

## 🏗️ Arquitectura

El frontend está construido con React y se comunica con dos servicios backend:

1.  **Backend Django REST Framework:** Gestiona la autenticación de usuarios, la gestión de sesiones de chat y actúa como proxy para el servicio MAS (Sistema Multiagente).
2.  **Backend FastAPI:** Proporciona análisis y visualización de datos impulsados por IA utilizando una arquitectura multiagente y PandasAI.

El frontend interactúa con el backend de Django para la autenticación de usuarios y la gestión de chats. Cuando un usuario envía un mensaje, el frontend envía el mensaje al backend de Django, que luego lo reenvía al backend de FastAPI para su procesamiento. El backend de FastAPI analiza el mensaje y genera una respuesta, que puede incluir texto, imágenes o visualizaciones de datos. El backend de Django luego envía la respuesta de vuelta al frontend para que se muestre al usuario.

```
+-----------------+      (API: Auth, Chat, Msgs, Query)      +-------------------------+      (HTTP POST /api/query)      +-------------------------+
|  Frontend React | <--------------------------------------> | Backend Django (DRF)    | ---------------------------> | Servicio MAS (FastAPI)  |
| (User Browser)  |                                          | (Users, Chats, Msgs DB, |                               | (AI Processing, FAISS, |
+-----------------+                                          |  Proxy to MAS)          | <--------------------------- |  LLM, Image Gen)        |
                                                              +-------------------------+  (JSON Response w/ img_path)  +-------------------------+
```

## 🛠️ Tecnologías Utilizadas

*   React
*   TypeScript
*   Redux
*   Vite
*   axios

## 📂 Estructura del Proyecto

```
/tesis-chat-ui/
├── public/
│   └── logo.png
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── Chat.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   └── MessageList.tsx
│   │   ├── Common/
│   │   │   └── ScroolToBottom.tsx
│   │   ├── HistoryChat/
│   │   │   └── HistorySidebar.tsx
│   │   ├── Layout/
│   │   │   └── Layout.tsx
│   │   └── NavBar/
│   │       └── Navbar.tsx
│   ├── hooks/
│   │   ├── useHystory.ts
│   │   └── useStore.ts
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   └── ChatPage.tsx
│   ├── redux/
│   │   ├── auth/
│   │   │   ├── actions.ts
│   │   │   └── slice.ts
│   │   ├── chats/
│   │   │   ├── actions.ts
│   │   │   └── slice.ts
│   │   └── store/
│   │       └── store.ts
│   ├── router/
│   │   ├── ChatRouter.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── RouterApp.tsx
│   ├── types/
│   │   ├── chat.ts
│   │   ├── interfaces.ts
│   │   ├── react-syntax-highlighter.d.ts
│   │   └── user.ts
│   └── utils/
│       └── parceError.ts
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── yarn.lock
```

## 🚀 Cómo Empezar

### Requisitos Previos

*   Node.js
*   npm o yarn
*   Git

### Instalación

1.  Clona el repositorio:

    ```bash
    git clone <repository_url>
    cd tesis-chat-ui
    ```

2.  Instala las dependencias:

    ```bash
    yarn install
    ```

3.  Configura las variables de entorno:

    Crea un archivo `.env` en el directorio raíz y agrega las siguientes variables:

    ```
    VITE_API_URL=<django_backend_url>
    ```

    Reemplaza `<django_backend_url>` con la URL de tu backend de Django.

    Además, asegúrate de que el backend de Django y el backend de FastAPI estén en ejecución y accesibles.

### Ejecutando la aplicación

```bash
yarn dev
```

Abre tu navegador y navega a `http://localhost:5173`.

## 🔑 Autenticación

Este frontend utiliza JWT (JSON Web Tokens) para la autenticación. Después de un inicio de sesión o registro exitoso, el backend de Django devolverá un token de acceso que se almacena en el almacenamiento local del navegador. Este token se incluye en el encabezado `Authorization` de todas las solicitudes posteriores al backend de Django.

Para obtener un token de acceso, envía una solicitud `POST` a `/auth/jwt/create/` con tu `username` y `password`. Incluye el token de acceso en el encabezado `Authorization` como `Authorization: JWT <your_access_token>`.

## 📚 Endpoints de la API

El frontend interactúa con los siguientes endpoints de la API en el backend de Django:

*   `POST /auth/jwt/create/` - Crea un nuevo token JWT (inicio de sesión)
*   `POST /auth/users/` - Crea un nuevo usuario (registro)
*   `GET /api/chats/` - Lista todas las sesiones de chat
*   `POST /api/chats/` - Crea una nueva sesión de chat
*   `GET /api/chats/{id}/` - Obtiene una sesión de chat específica
*   `POST /api/chats/{id}/messages/` - Envía un mensaje a una sesión de chat

    Este endpoint se utiliza para enviar un mensaje a la sesión de chat. El cuerpo de la solicitud debe ser un objeto JSON con el siguiente formato:

    ```json
    {
      "text_message": "Tu mensaje aquí"
    }
    ```

    El cuerpo de la respuesta será un objeto JSON que contiene el mensaje del asistente, que puede incluir una URL de imagen si el asistente generó una imagen.

    ```json
    {
      "id": "...",
      "chat": "...",
      "text_message": "El mensaje del asistente",
      "image_url": "URL de la imagen generada (si existe)"
    }
    ```

    El frontend debe usar la `image_url` para mostrar la imagen generada.

## 🖼️ Manejo de Imágenes

Las imágenes generadas por el backend de FastAPI se envían al frontend como URLs. El frontend debe usar estas URLs para mostrar las imágenes.

## 🤖 Interactuando con el Backend de FastAPI

El backend de FastAPI proporciona análisis y visualización de datos impulsados por IA. Admite una variedad de consultas, incluyendo:

*   Filtrado de datos basado en múltiples criterios
*   Realización de cálculos y agregaciones
*   Generación de gráficos

Para enviar una consulta al backend de FastAPI, envía una solicitud `POST` al endpoint `/api/query` en el backend de Django. El cuerpo de la solicitud debe ser un objeto JSON con el siguiente formato:

```json
{
  "query": "Tu consulta aquí"
}
```

El cuerpo de la respuesta será un objeto JSON que contiene los resultados de la consulta, que puede incluir texto, una URL de imagen o un mensaje de error.

## 🤝 Contribuyendo

¡Las contribuciones son bienvenidas! Por favor, abre un problema o envía una solicitud de extracción.