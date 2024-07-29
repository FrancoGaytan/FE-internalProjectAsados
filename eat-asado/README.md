# internalProyectAsados

Documentación Requerimientos:
* usuario con mail de endava, password (no la de endava), y nombre de usuario elegible.
* registro con nombre - apellido - mail de endava y la contraseña
* forgot password
* permitir generar/crear un evento (pensar en que pasa si varios quieren organizar a la misma vez - parrilla compartida / o bien bloquear la parrilla)
* permitir que varios usuarios se puedan unir al evento
* permitir definir quien va a ser el asador
* quien va a colaborar con las compras
* permitir que todos puedan cargar sus cbu (el encargado de compras debe tener su cbu precargado en su perfil)
* permitir seleccionar el medio de pago a la hora de pagarle al encargado de compras
* permitir validar del lado del encargado de compras si recibio el pago.
* permitir subir comprobante de pago
* que sea visible para el encargado de compras que tenga visibilidad de saber cuantos faltan abonar y quienes son los que faltan.
* que sea visible para los comensales sepan si les falta abonar.
* bloquear a un usuario indicado a subirse a un nuevo asado sin haber abonado el anterior (pensar en los casos de posponer pagos).
* seleccionar el medio de pago(efectivo, transferencia, ver si se puede mercado pago).
* permitir subir el ticket de pago por parte del encargado de compras.
* hacer el calculo para determinar cuando debe abonar cada comensal y cuanto a favor o en contra tiene cada encargado de compras.
* obligar al encargado de compras que suba todos los comprobantes de pago antes de una determinada hora o momento.
* que el encargado de compras pueda bloquear la lista de comensales en el momento en el que esta realizando las compras para que ya ninguno se pueda bajar del evento.
* permitir modificar los datos del usuario (foto, cbu/alias, nombre de usuario)
* definir un numero maximo de comensales para un asado determinado (definido por el asador).
* permitir subir la descripcion del menu que se esta cocinando.
* permitir subir fotos de un asado determinado.
* pensar en la idea de permitir colaborar en futuras compras que se tienen que realizar para conseguir elementos (tabla, cubiertos, etc)<-- fuera de mvp
* seccion de foro para hacer propuestas, ponernos en contacto, etc.
* feedback de una comida (puntuación)<-- a revisar, fuera de mvp


Roles
* asador
* inicializador / organizador
* encargado de compras (el que hace las compras) 
* comensal

----------------------------------------------------------------------

CUR

* Login
* Registro
* Forgot Password

* Listado de Eventos (main page/dashboard)
    - Añadirse a Evento (popup) 
    - Bloquear a usuario para añadirse a nuevo evento (deuda)

* Generación de Evento
    - definir roles (cuando se selecciona al encargado de compras, debe estar la restricción de no poder seleccionar a un usuario que no tenga cargado su cbu - popup informativo o usuario bloqueado --> hover)
    - definir cantidad máxima de comensales
    - definir info general del evento(fecha, hora, descripción...)

* Evento
    - Pago
    - seleccionar medio de pago
    - Validación de Pago
    - Ver/Subir comprobante/ticket (forzar al co-organizador)
    - Ver cantidad de gente (a definir si los participantes)
    - Cerrar lista de comensales. (co-organizador)
    - Ver total a abonar (realizar calculo)
    - Ver datos del evento
    - Visibilizar quienes pagaron/faltan pagar (co-organizador) - Saber si faltas pagar (comensal)


* Actualización del profile (cbu, foto, nombre, dieta, restricciones (sal, etc)<--opcionales) 
    - configuraciones

* FAQ
    - foro, subir imagenes (a implementar a futuro)
    - colaboraciones (a futuro)

------------------------------------------------------

Pages (select language en todas las páginas)

* Landing
    - login
    - signup

* Login
    - mail
    - contraseña
    - link a recuperar contraseña

* Forgot Password
    - mail (para enviar código de autenticación)
    - en otra página: 
        + Código de autenticación.
        + Contraseña 
        + Confirmar contraseña

* Registro
    - nombre 
    - apellido
    - mail de endava
    - contraseña
    - confirmar contraseña
    - restricción alimenticia (opcional)

* Listado de Eventos
	- calendarío.
	- opción eventos del día.
	- crear evento.
	- Dentro de cada evento:
	   + info del evento
	   + Opciones de botones:
		   + unirse a evento
		   + evento cerrado
		   + evento terminado
		   + unirse a evento (bloqueado) <-- para los deudores

* Generación de eventos
	- calendario para seleccionar la fecha / ver disponibilidad 
	- descripción (menu)
	- hora evento
	- limite de comensales
	- incluír checkbox de ¿queres designarte como encargado?
	- incluír checkbox de ¿queres designarte como asador?

* User Perfile
    - ver nombre y apellido
    - ver mail
    - cargar cbu / alias (opcional)
    - restricción alimenticia
    - punto de cocción. 
    - cargar foto (opcional)

* Unirse a Evento
	- unirse (en caso que no estes unido)
	- ver info del evento
		+ Título
		+ menu (descripción) 
		+ cantidad de comensales actuales
		+ fecha y hora del evento
		+ limite de personas
		+ asador
	- checkbox de asignarse como encargado de compras (en caso que no este asignado)
	- checkbox de asignarse como asador (en caso que no este asignado)

* Evento (como organizador)
	-  ver info del evento (habilitar la modificación)
		+ Título
		+ menu (descripción) 
		+ cantidad de comensales actuales
		+ fecha y hora del evento (no habilitar modificación)
		+ limite de personas
		+ asador
	- asignarse como encargado de compras (en caso que no este asignado)
	- asignarse como asador (en caso que no este asignado)
	- pagar (si ya estan cargados los comprobantes - evento terminado / sino bloquear el boton)
	- ver lista de participantes 
		+ nombre y apellido 
		+ si pago o no pago <-- definir como
		+ restricciones alimenticias (lo que esta en el perfil del usuario)
	- eliminar evento (advertir que hay inscriptos - avisar de la cancelación)
	- cerrar evento (cuando ya hiciste las compras)
	- terminar evento (cuando ya estan cargados los comprobantes)

* Evento (como comensal)
	-  ver info del evento
		+ menu
		+ cantidad de comensales actuales
		+ fecha y hora del evento
		+ limite de personas
		+ asador
	- asignarse como encargado de compras (en caso que no este asignado)
	- asignarse como asador (en caso que no este asignado)
	- pagar (si ya estan cargados los comprobantes - evento terminado / sino bloquear el boton)

	* Pagar (popup de la opción cuando se selecciona pagar)
		-  costo total
		-  costo a pagar
		-  comprobantes (ver comprobantes) <-- a priori no visibles
		-  encargado de compras + cbu o alias del encargado
		-  establecer como pagado
	
* Evento (como encargado de compras)
	-  ver info del evento
		+ menu
		+ cantidad de comensales actuales
		+ fecha y hora del evento
		+ limite de personas
		+ asador
	- asignarse como encargado de compras (en caso que no este asignado)
	- asignarse como asador (en caso que no este asignado)
	- pagar (si ya estan cargados los comprobantes - evento terminado / sino bloquear el boton)
	- ver lista de participantes 
		+ nombre y apellido 
		+ si pago o no pago <-- definir como

	* Información a pago
		-  costo total
		-  costo unitario de pago
		-  comprobantes (ver comprobantes) <-- a priori no visibles
		-  subir comprobante de pago

* FAQ


-------------------------------------------------------------
Especificaciones

* Apertura de Evento (condicion: que ya exista otro evento cerrado)
En este caso quien abra el segundo evento deberá solicitar permiso al organizador del primer evento, así acordar si el límite de personas entre ambos eventos es 	realizable. La cantidad entre ambos eventos se acordará entre ambos organizadores para saber si es factible poder realizar ambos eventos juntos.


