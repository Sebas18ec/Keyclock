const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const app = express();

// Configuración de la sesión
app.use(
  session({
    secret: 'ab128726-3c35-4ad0-b717-01baaa44d4ea', // Cambia esto por una clave segura en producción
    resave: false,
    saveUninitialized: true,
  })
);

// Configuración de Keycloak
const keycloak = new Keycloak({
  realm: 'myrealm',
  url: 'http://localhost:8080/auth', // URL de tu servidor Keycloak
  clientId: 'myclient',
  secret: 'ab128726-3c35-4ad0-b717-01baaa44d4ea', // Reemplaza con tu clientSecret
  bearerOnly: false, // No es necesario especificar esta opción, ya que es el valor predeterminado
});

// Middleware de Keycloak
app.use(keycloak.middleware());

// Página de inicio (landing page)
app.get('/', (req, res) => {
  res.send('¡Bienvenido! Haz clic <a href="/login">aquí</a> para iniciar sesión.');
});

// Página de inicio de sesión
app.get('/login', keycloak.protect(), (req, res) => {
  res.redirect('/mensaje');
});

// Página con un mensaje
app.get('/mensaje', keycloak.protect(), (req, res) => {
  const user = req.kauth.grant.access_token.content.preferred_username;
  res.send(`Hola ${user}! Esta es una página protegida. Has iniciado sesión correctamente.`);
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor en ejecución en http://localhost:3000');
});
