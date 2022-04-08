# Mi_Banco_-_LTG
  <h2>CLONANDO EL PROYECTO</h2>
  <ol>
    <li> Una vez descargado el proyecto debes instalar las dependencia que estan en el package.json, con el stge comando
      (antes debes tener instalado npm)
    </br>
      <b> $npm install</b><br><br>
    <li> Ahora se debe crear la base datos y tablas .Por lo cual, se
      debera ejecutar el script de comandos SQL que estan en el achivo<b> Mi_Banco_V1.session.sql</b></li><br>
    <ul>Para ejecutar las funciones y/o consultas se debe seguir los stges. pasos.<br>
  <ul>Desde la Terminal escribe estos comandos
      <li>
        <h4>FUNCION ABONAR SALDO A CUENTA1 o CUENTA2</h4>
        <p> node index.js &#8249;abonar&#8250; &#8249;id_de_la_cuenta&#8250;
          &#8249;monto_abonar&#8250;</p>
        <p></p><u> EJEMPLO</p></u>
        node index.js abonar 1 5000
    </ul>
    <ul>
      <li>
        <h4>FUNCION TRANSFERENCIA DE SALDO DESDE CUENTA1 A CUENTA2 </h4>
        node index.js &#8249;trans&#8250; &#8249;id_cuenta_origen&#8250; &#8249;monto_tranferir&#8250;
        &#8249;id_de_la_cuenta_destino&#8250;
        <p></p><u> EJEMPLO</p></u>
        node index.js trans 1 5000 2
    </ul>
    <ul>
      <li>
        <h4>CURSOR CONSULTAS - LOS 10 PRIMEROS REGISTROS DE UNA CUENTA, por ID</h4>
        node index.js &#8249;cursor10&#8250; &#8249;id_cuenta&#8250;
        <p></p><u> EJEMPLO</p></u>
        node index.js cursor10 2
    </ul>
    <ul>
      <li>
        <h4>CURSOR SALDO DE CUENTA por ID</h4>
        node index.js &#8249;saldo&#8250; &#8249;id_cuenta&#8250;
        <p></p><u> EJEMPLO</p></u>
        node index.js saldo 1
    </ul>
  </ol>
  </li>
</body>
