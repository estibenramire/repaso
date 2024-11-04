//carga de  los modulos
const express = require("express");
const app = express();
const path = require("node:path");
//obtener el numero del puerto
process.loadEnvFile();
const PORT = process.env.PORT;

// console.log(PORT);
//cargar los datos

const datos = require("../data/customer.json");
//order datos

datos.sort((a, b) => a.surname.localeCompare(b.surname, "es-ES"));
// console.log(datos);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "index.html");
    // console.log("Estamos en /");
});

//Ruta API Global

app.get("/api/", (req, res) => {
    res.json(datos);
});

//Ruta  para filtrar los clinetes por el apellido

app.get("/api/apellido/:apellido", (req, res) => {
    const apellido = req.params.apellido;
    const clientes = datos.filter((cliente) =>
        cliente.surname.toLowerCase().includes(apellido.toLowerCase())
    );

    if (clientes.length == 0) {
        return res.status(404).send("Cliente no encontrado");
    }
    res.json(clientes);
});

//Ruta para filtra por nombre y apellido: api/nombre_apellido/John/Bezzos

app.get("/api/nombre_apellido/:nombre/:apellido", (req, res) => {
    const nombre = req.params.nombre;
    const apellido = req.params.apellido;
    const cliente = datos.filter(
        (cliente) =>
            cliente.name.toLowerCase() === nombre.toLowerCase() &&
            cliente.surname.toLowerCase() === apellido.toLowerCase()
    );

    if (!cliente) {
        return res.status(404).send("Cliente no encontrado");
    }
    res.json(cliente);
});
//Ruta  para filtrar por apellido y por las primeras letras del nombre

app.get("/api/apellido_nombre_iniciales/:apellido/:iniciales", (req, res) => {
    const apellido = req.params.apellido;
    const iniciales = req.params.iniciales;
    const clientes = datos.filter(
        (cliente) =>
            cliente.surname.toLowerCase() === apellido.toLowerCase() &&
            cliente.name.toLowerCase().startsWith(iniciales.toLowerCase())
    );

    if (clientes.length == 0) {
        return res.status(404).send("Cliente no encontrado");
    }
    res.json(clientes);
});

//Ruta para filtrar por nombre y las primeras letras del apellido
// api/nombre/Maria?apellido=Blanchard
//Tienes esta otra /api/nombre/Violetta

app.get("/api/nombre/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    const apellido = req.query.apellido;
    if (apellido == undefined) {
        const filtroclientes = datos.filter(
            (cliente) => cliente.name.toLowerCase() === nombre.toLowerCase()
        );

        if (filtroclientes.length == 0) {
            return res.status(404).send("Cliente no encontrado");
        }

        res.json(filtroclientes);
    }

    const letras = apellido.length;

    const clientes = datos.filter(
        (cliente) =>
            cliente.name.toLowerCase() === nombre.toLowerCase() &&
            cliente.surname.toLowerCase().startsWith(apellido.toLowerCase())
    );

    if (clientes.length == 0) {
        return res.status(404).send("Cliente no encontrado");
    }
    res.json(clientes);
});

//filtrar por marca
//api/marca/:apple

app.get("/api/marca/:marca", (req, res) => {
    const marca = req.params.marca;

    const filtroMarca = datos.flatMap((cliente) =>
        cliente.compras.filter((compra) => compra.marca == marca)
    );
    // console.log(filtroMarca);

    if (filtroMarca.length == 0) {
        return res.status(404).send("Marca no encontrada");
    }
    res.json(filtroMarca);
});
//error 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../public", "404.html"));
});

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});
