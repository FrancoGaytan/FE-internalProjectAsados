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
    - restricción alimenticia (opcional)?

* Listado de Evento

* Generación de eventos

* User Perfile
    - ver nombre y apellido
    - ver mail
    - cargar cbu / alias (opcional)
    - restricción alimenticia
    - cargar foto (opcional)

* Evento

* FAQ.