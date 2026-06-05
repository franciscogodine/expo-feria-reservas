import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sql from "mssql";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();

// =========================
// MERCADO PAGO
// =========================
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// =========================
// APP
// =========================
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// =========================
// DB CONFIG
// =========================
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

const poolPromise = sql.connect(dbConfig);
const getPool = async () => await poolPromise;

// =========================
// ESTADOS
// =========================
const ESTADOS = ["disponible", "reservado", "ocupado"];

// =========================
// HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.json({ message: "Backend OK 🚀" });
});

// =========================
// LOGIN
// =========================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await getPool();

    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, password)
      .query(`
        SELECT id_usuario, nombre, email, tipo_usuario, bloqueado
        FROM Usuarios
        WHERE email=@email AND password_hash=@password
      `);

    if (result.recordset.length === 0)
      return res.status(401).json({ message: "Credenciales inválidas" });

    if (result.recordset[0].bloqueado)
      return res.status(403).json({ message: "Usuario bloqueado" });

    res.json({ success: true, usuario: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// GET STANDS
// =========================
app.get("/api/stands", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT
        id_stand,
        codigo,
        nombre,
        tipo,
        zona,
        dimension,
        precio,
        estado,
        servicios,
        latitud,
        longitud
      FROM Stands
      ORDER BY codigo
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// GET STAND BY ID
// =========================
app.get("/api/stands/:id", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request()
      .input("id", sql.Int, req.params.id)
      .query("SELECT * FROM Stands WHERE id_stand=@id");

    if (!result.recordset.length)
      return res.status(404).json({ message: "No encontrado" });

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// RESERVA
// =========================
app.post("/api/reservas", async (req, res) => {
  try {
    const { nombre, correo, stand } = req.body;
    const pool = await getPool();

    let user = await pool.request()
      .input("correo", sql.VarChar, correo)
      .query("SELECT id_usuario FROM Usuarios WHERE email=@correo");

    let idUsuario;

    if (!user.recordset.length) {
      const nuevo = await pool.request()
        .input("nombre", sql.VarChar, nombre)
        .input("correo", sql.VarChar, correo)
        .query(`
          INSERT INTO Usuarios (nombre, email, password_hash, tipo_usuario)
          OUTPUT INSERTED.id_usuario
          VALUES (@nombre, @correo, '123456', 'expositor')
        `);

      idUsuario = nuevo.recordset[0].id_usuario;
    } else {
      idUsuario = user.recordset[0].id_usuario;
    }

    const standInfo = await pool.request()
      .input("stand", sql.Int, stand)
      .query("SELECT precio FROM Stands WHERE id_stand=@stand");

    if (!standInfo.recordset.length)
      return res.status(404).json({ message: "Stand no existe" });

    const precio = standInfo.recordset[0].precio;

    await pool.request()
      .input("stand", sql.Int, stand)
      .input("user", sql.Int, idUsuario)
      .input("precio", sql.Decimal(12,2), precio)
      .query(`
        INSERT INTO Reservas (id_stand, id_usuario, estado_reserva, total_pagado)
        VALUES (@stand, @user, 'confirmada', @precio)
      `);

    await pool.request()
      .input("stand", sql.Int, stand)
      .query(`
        UPDATE Stands SET estado='reservado'
        WHERE id_stand=@stand
      `);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// =========================
// OBTENER RESERVAS
// =========================
app.get("/api/reservas", async (req, res) => {

  try {

    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT
        r.id_reserva,
        u.nombre,
        u.email,
        s.codigo AS stand,
        r.estado_reserva,
        r.total_pagado

      FROM Reservas r

      INNER JOIN Usuarios u
        ON r.id_usuario = u.id_usuario

      INNER JOIN Stands s
        ON r.id_stand = s.id_stand

      ORDER BY r.id_reserva DESC
    `);

    res.json(result.recordset);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
});
// =========================
// GET RESERVAS
// =========================
app.get("/api/reservas", async (req, res) => {

  try {

    const pool = await getPool();

    const result = await pool.request().query(`

      SELECT
        r.id_reserva,
        u.nombre,
        u.email,
        s.codigo AS stand,
        r.estado_reserva,
        r.total_pagado

      FROM Reservas r

      INNER JOIN Usuarios u
        ON r.id_usuario = u.id_usuario

      INNER JOIN Stands s
        ON r.id_stand = s.id_stand

      ORDER BY r.id_reserva DESC

    `);

    res.json(result.recordset);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});
// =========================
// LIBERAR STAND (ADMIN)
// =========================
app.put("/api/stands/liberar/:id", async (req, res) => {
  try {
    const pool = await getPool();

    await pool.request()
      .input("id", sql.Int, req.params.id)
      .query(`
        UPDATE Stands
        SET estado='disponible'
        WHERE id_stand=@id
      `);

    await pool.request()
      .input("id", sql.Int, req.params.id)
      .query(`
        UPDATE Reservas
        SET estado_reserva='cancelada'
        WHERE id_stand=@id
      `);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// BLOQUEAR USUARIO
// =========================
app.put("/api/usuarios/bloquear/:id", async (req, res) => {
  try {
    const pool = await getPool();

    await pool.request()
      .input("id", sql.Int, req.params.id)
      .query("UPDATE Usuarios SET bloqueado=1 WHERE id_usuario=@id");

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// CAMBIAR ESTADO STAND
// =========================
app.put("/api/stands/:id/estado", async (req, res) => {
  try {
    const { estado } = req.body;

    if (!ESTADOS.includes(estado))
      return res.status(400).json({ error: "Estado inválido" });

    const pool = await getPool();

    await pool.request()
      .input("id", sql.Int, req.params.id)
      .input("estado", sql.VarChar, estado)
      .query(`
        UPDATE Stands
        SET estado=@estado
        WHERE id_stand=@id
      `);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// MERCADO PAGO
// =========================
app.post("/api/pago", async (req, res) => {
  try {
    const { titulo, precio } = req.body;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: titulo,
            quantity: 1,
            unit_price: Number(precio),
            currency_id: "MXN",
          },
        ],
        back_urls: {
          success: "http://localhost:3000/",
          failure: "http://localhost:3000/",
          pending: "http://localhost:3000/",
        },
      },
    });

    res.json({ success: true, init_point: result.init_point });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// START
// =========================
app.listen(PORT, () => {
  console.log(`🚀 Server running http://localhost:${PORT}`);
});