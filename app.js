const {createServer} = require("http")

const server = createServer((req, res) =>{
    console.log(req);
    res.write("Bienvenido a mi primer servidor web");
    res.end();
}
);

server.listen(8080);
console.log("Servidor Web inicializado en 8080")