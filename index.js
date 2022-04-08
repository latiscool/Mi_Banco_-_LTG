//Modulo Requeridos
require('dotenv').config();
const { Pool } = require('pg');
const Cursor = require('pg-cursor');
const chalk = require('chalk');
const emoji = require('node-emoji');

//Definiendo detalles cosmeticos del terminal
const eCode = chalk.bgRed.bold.white;
const cRedB = chalk.redBright;
const skull = emoji.get('skull_and_crossbones');
const check2 = emoji.get('ballot_box_with_check');
const check = emoji.get('white_check_mark');
const star = emoji.get('sparkles');

//Fecha
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
const today = ` ${day}-${month}-${year}`;

//Variables Entorno BBDD
const config = {
  user: process.env.BD_USER,
  host: process.env.BD_HOST,
  database: process.env.BD_NAME,
  password: process.env.BD_PWD,
  port: process.env.BD_PORT,
};

//ARGUMETNOS POR LA TERMINAL
//Argumentos omitidos
const argv = process.argv.slice(2);
//Argumentos Capturados
//Funcion Capturada
const query = argv[0];
//Capturando
//Argumento para Abonar a Cuentas  // y Para Cursor
const acc = argv[1];
const amount = argv[2];

//Argumento para Transferencia
const origin = argv[1];
const cash = argv[2];
const recipient = argv[3];
////////

//Clase Pool
const pool = new Pool(config);

// Conectarse a PostgreSQL con el método “connect()” y  Declarar que la función callback de la conexión será asíncrona
pool.connect(async (error_conexion, client, release) => {
  if (error_conexion) {
    return console.error(
      cRedB(skull + '  Hubo un error en la conexion ' + skull)
    );
  }

  ///FUNCION ABONAR SALDO A CUENTA1 o CUENTA2
  let accAdd = async (amount, acc, fecha) => {
    await client.query('BEGIN');
    const add = {
      name: 'Abonar Cuenta1',
      text: 'UPDATE cuentas SET saldo= saldo + $2 WHERE id=$1 RETURNING *;',
      values: [acc, amount],
    };

    const addLogAcc1 = {
      name: 'log abono acc1',
      text: `INSERT INTO transacciones (descripcion,fecha,monto,cuenta) VALUES($1,$2,$3,$4) RETURNING *; `,
      values: ['ABONO', fecha, amount, acc],
    };

    try {
      const res = await client.query(add);
      const res2 = await client.query(addLogAcc1);
      console.log(
        `En CUENTA: ${acc}, se ha realizado un ABONO de: $${amount}, cuyo Registro es`,
        res.rows[0]
      );

      console.log(
        `Se ha REGISTRADO UNA TRANSACCION de tipo ABONO a la cuenta ${acc}, cuyo Registro es`,
        res2.rows[0]
      );

      await client.query('COMMIT');
    } catch (error) {
      console.log('Hubo un error en la operacion en Catch');
      await client.query('ROLLBACK');
    }
    release();
    pool.end();
  };
  ///
  ///
  //FUNCION TRANSFERENCIA DE CUENTA1 A CUENTA2
  let Acca1ToAcc2 = async (fecha, cash, recipient, origin) => {
    await client.query('BEGIN');
    const restAcc1 = {
      name: 'descontar-acc1',
      text: 'UPDATE cuentas SET saldo= saldo - $2 WHERE id=$1 RETURNING *;',
      values: [origin, cash],
    };
    const addAcc2 = {
      name: 'abono-acc2',
      text: 'UPDATE cuentas SET saldo= saldo + $2 WHERE id=$1 RETURNING *;',
      values: [recipient, cash],
    };
    const transLogAcc1 = {
      name: 'log acc1',
      text: `INSERT INTO transacciones (descripcion,fecha,monto,cuenta) VALUES($1,$2,$3,$4) RETURNING *; `,
      values: ['RETIRO', fecha, cash, origin],
    };

    const transLogAcc2 = {
      name: 'log acc1',
      text: `INSERT INTO transacciones (descripcion,fecha,monto,cuenta) VALUES($1,$2,$3,$4) RETURNING *; `,
      values: ['ABONO', fecha, cash, recipient],
    };

    try {
      const res1 = await client.query(restAcc1);
      const res2 = await client.query(addAcc2);
      const res3 = await client.query(transLogAcc1);
      const res4 = await client.query(transLogAcc2);

      console.log(
        `En CUENTA: ${origin}, se ha realizado un RETIRO de: $${cash}, cuyo Registro es`,
        res1.rows[0]
      );
      console.log(
        `En CUENTA: ${recipient}, se ha realizado un ABONO de: $${cash}, cuyo Registro es`,
        res2.rows[0]
      );

      console.log(
        `Se ha REGISTRADO UNA TRANSACCION  tipo RETIRO en la cuenta ${origin}, cuyo Registro es`,
        res3.rows[0]
      );
      console.log(
        `Se ha REGISTRADO UNA TRANSACCION  tipo ABONO desde cuenta ${origin} a cuenta ${recipient}, cuyo Registro es`,
        res4.rows[0]
      );

      await client.query('COMMIT');
      //
    } catch (error) {
      console.log('Hubo un error en la operacion en Catch');
      await client.query('ROLLBACK');
    }
    release();
    pool.end();
  };
  ///
  ///
  //CURSOR CONSULTAS - LAS 10 PRIMERAS DE UNA CUENTA, por ID
  let cursorSelect = async (acc) => {
    const queryCursor = new Cursor(
      `SELECT * FROM transacciones WHERE cuenta=${acc}`
    );

    const cursor = await client.query(queryCursor);

    let qty = 10;
    cursor.read(qty, (err, rows) => {
      if (err) {
        console.log('UPS');
        console.log('Ha ocuurido una Falla: ', err.message);
        console.log('Eror de Codigo :', err.code);
        process.exit();
      }
      if (rows == '') {
        console.log('Hubo un error, verificar el id de la cuenta del');
        process.exit();
      }
      try {
        console.log(rows);
        console.log(
          `Se realizado una consulta de los ${qty} primeros registros`
        );
        cursor.close();
        release();
        pool.end();
      } catch (error) {
        console.log('Ha ocurrida una Falla');
      }
      process.exit();
    });
  };
  ////
  ////
  ///
  let cursorSaldo = async (acc) => {
    const queryCursor = new Cursor(`SELECT * FROM cuentas WHERE id=${acc}`);

    const cursor = await client.query(queryCursor);

    let qty = 1;
    cursor.read(qty, (err, rows) => {
      if (err) {
        console.log('UPS');
        console.log('Ha ocuurido una Falla: ', err.message);
        console.log('Eror de Codigo :', err.code);
        process.exit();
      }
      if (rows == '') {
        console.log('Hubo un error, verificar el id de la cuenta');
        process.exit();
      }
      try {
        let fila = rows.map((s) => s.saldo.toString());
        let saldo = fila.toString();
        console.log(`El Saldo de la cuenta ${acc} es: $${saldo}`);
        cursor.close();
        release();
        pool.end();
      } catch (error) {
        console.log('Ha ocurrida una Falla');
      }
      process.exit();
    });
  };
  ///
  ///
  // ****************************************
  // ***Seleccion Funciones por Terminal****
  // ****************************************
  query === 'trans'
    ? Acca1ToAcc2(today, cash, recipient, origin)
    : query === 'abonar'
    ? accAdd(amount, acc, today)
    : query === 'cursor10'
    ? cursorSelect(acc)
    : query === 'saldo'
    ? cursorSaldo(acc)
    : (console.log(
        cRedB(
          skull + '  Debe escribir una funcion existente en la app ' + skull
        )
      ),
      process.exit());

  //FIN POOL CONNECT
});
///
