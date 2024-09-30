const express = require("express");
const app = express();
const path = require("path");

const port = 3000;

// Middleware para servir archivos estáticos de la carpeta "public"
//app.use(express.static(path.join(__dirname, "public")));

// Define la ruta para la página de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'indexExpress.html'));  // Especifica el archivo HTML que será la página de inicio
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
