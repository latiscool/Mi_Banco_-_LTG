----- ● Crear una base de datos llamada ​banco.
CREATE DATABASE Banco;

----● Crear una tabla ​transacciones
CREATE TABLE transacciones (
	descripcion varchar(50),
	fecha varchar(10),
	monto DECIMAL,
	cuenta INT
);

----- ● Crear una tabla ​cuentas / con un restricion que no pueda haber saldo negativo
CREATE TABLE cuentas(
	id INT,
	saldo DECIMAL CHECK (saldo >= 0)
);

-----● Registrar por lo menos 1 cuenta en la tabla ​cuentas​ con un saldo inicial.
INSERT INTO cuenta values (1, 20000);
INSERT INTO cuenta values (2, 0);



-- -- SELECT*FROM cuentas;
-- SELECT*FROM transacciones;

