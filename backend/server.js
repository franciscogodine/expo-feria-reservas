import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sql from 'mssql';
import { MercadoPagoConfig, Preference } from 'mercadopago';

dotenv.config();

// ==========================================
// CONFIGURAR MERCADO PAGO
// ==========================================
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// CONFIGURACIÓN AZURE SQL
// ==========================================
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: 1433,

  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

// ==========================================
// RUTA PRINCIPAL
// ==========================================
app.get('/', (req, res) => {

  res.json({
    message: '✅ Backend funcionando correctamente'
  });
});

// ==========================================
// LOGIN
// ==========================================
app.post('/api/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .query(`
        SELECT
          id_usuario,
          nombre,
          email,
          tipo_usuario
        FROM Usuarios
        WHERE email = @email
        AND password_hash = @password
      `);

    if (result.recordset.length === 0) {

      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    res.json({
      success: true,
      usuario: result.recordset[0]
    });

  } catch (error) {

    console.error('ERROR LOGIN:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// OBTENER TODOS LOS STANDS
// ==========================================
app.get('/api/stands', async (req, res) => {

  try {

    const pool = await sql.connect(dbConfig);

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
        servicios
        latitud,
        longitud
      FROM Stands
      ORDER BY codigo
    `);

    res.json(result.recordset);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// OBTENER STAND POR ID
// ==========================================
app.get('/api/stands/:id', async (req, res) => {

  try {

    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT *
        FROM Stands
        WHERE id_stand = @id
      `);

    if (result.recordset.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Stand no encontrado'
      });
    }

    res.json(result.recordset[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// CREAR RESERVA
// ==========================================
app.post('/api/reservas', async (req, res) => {

  try {

    const { nombre, correo, stand } = req.body;

    if (!nombre || !correo || !stand) {

      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    const pool = await sql.connect(dbConfig);

    // ==========================================
    // BUSCAR USUARIO
    // ==========================================
    let usuario = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query(`
        SELECT id_usuario
        FROM Usuarios
        WHERE email = @correo
      `);

    let idUsuario;

    // ==========================================
    // CREAR USUARIO SI NO EXISTE
    // ==========================================
    if (usuario.recordset.length === 0) {

      const nuevoUsuario = await pool.request()
        .input('nombre', sql.VarChar, nombre)
        .input('correo', sql.VarChar, correo)
        .query(`
          INSERT INTO Usuarios (
            nombre,
            email,
            password_hash,
            tipo_usuario
          )
          OUTPUT INSERTED.id_usuario
          VALUES (
            @nombre,
            @correo,
            '123456',
            'expositor'
          )
        `);

      idUsuario = nuevoUsuario.recordset[0].id_usuario;

    } else {

      idUsuario = usuario.recordset[0].id_usuario;
    }

    // ==========================================
    // OBTENER PRECIO DEL STAND
    // ==========================================
    const standInfo = await pool.request()
      .input('stand', sql.Int, stand)
      .query(`
        SELECT precio
        FROM Stands
        WHERE id_stand = @stand
      `);

    if (standInfo.recordset.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Stand no encontrado'
      });
    }

    const precio = standInfo.recordset[0].precio;

    // ==========================================
    // INSERTAR RESERVA
    // ==========================================
    await pool.request()
      .input('id_stand', sql.Int, stand)
      .input('id_usuario', sql.Int, idUsuario)
      .input('total_pagado', sql.Decimal(12, 2), precio)
      .query(`
        INSERT INTO Reservas (
          id_stand,
          id_usuario,
          estado_reserva,
          total_pagado
        )
        VALUES (
          @id_stand,
          @id_usuario,
          'confirmada',
          @total_pagado
        )
      `);

    // ==========================================
    // ACTUALIZAR STAND
    // ==========================================
    await pool.request()
      .input('stand', sql.Int, stand)
      .query(`
        UPDATE Stands
        SET estado = 'reservado'
        WHERE id_stand = @stand
      `);

    res.json({
      success: true,
      message: '✅ Reserva realizada correctamente'
    });

  } catch (error) {

    console.error('ERROR RESERVA:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// OBTENER RESERVAS
// ==========================================
app.get('/api/reservas', async (req, res) => {

  try {

    const pool = await sql.connect(dbConfig);

    const result = await pool.request().query(`
      SELECT
        r.id_reserva,
        u.nombre,
        u.email,
        s.nombre AS stand,
        r.estado_reserva,
        r.total_pagado,
        r.fecha_reserva
      FROM Reservas r

      INNER JOIN Usuarios u
        ON r.id_usuario = u.id_usuario

      INNER JOIN Stands s
        ON r.id_stand = s.id_stand

      ORDER BY r.id_reserva DESC
    `);

    res.json(result.recordset);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// MERCADO PAGO
// ==========================================

app.post('/api/pago', async (req, res) => {

  try {

    const { titulo, precio } = req.body;

    const preferenceClient = new Preference(client);

    const response = await preferenceClient.create({
      body: {

        items: [
          {
            title: titulo,
            quantity: 1,
            unit_price: Number(precio),
            currency_id: 'MXN'
          }
        ],

        back_urls: {
          success: 'http://localhost:3000/',
          failure: 'http://localhost:3000/',
          pending: 'http://localhost:3000/'
        },

       
      }
    });

    res.json({
      success: true,
      init_point: response.init_point
    });

  } catch (error) {

    console.error('ERROR PAGO:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
app.listen(PORT, () => {

  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});