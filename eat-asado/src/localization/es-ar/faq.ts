export const faq = Object.seal({
	title: 'Preguntas frecuentes',
	questions: [
		{
			question: '¿Dónde puedo activar mis notificaciones?',
			answer: 'En tu perfil, tenés un checkbox llamado: activar notificaciones. Si lo activás, se abrirán otros campos para ingresar el mail a donde las querés recibir y además podés elegir cuándo querés recibirlas.'
		},
		{
			question: '¿Cómo puedo recuperar mi contraseña?',
			answer: 'Hacé clic en “¿Olvidaste tu contraseña?” en el login y seguí los pasos. Se te solicitará ingresar el mail con el cual te registraste y luego se te enviará un mail con un código, el cual será necesario para validar tu identidad y registrar tu nueva contraseña.'
		},
		{
			question: '¿Qué hacer si aparezco como deudor?',
			answer: 'Si aparecés como deudor, el motivo es que no abonaste alguno de los eventos previos, o que el encargado de compras de ese evento no ha aprobado tu pago. Asegurate de tener cubiertas esas dos posibilidades, luego podrás inscribirte sin problemas a otro evento.'
		},
		{
			question: '¿Qué es y cómo funciona un evento privado?',
			answer: 'Un evento privado es aquel al cual solo pueden unirse las personas que reciban una invitación directa o tengan el link de acceso. Estos eventos no son visibles en la lista de eventos públicos, por lo cual no lo podrás ver a menos que accedas directamente a este y te inscribas. Para crear un evento privado, debés seleccionar la opción de "Evento privado" al momento de crear el evento y luego invitar a los participantes compartiendo el enlace del evento.'
		},
		{
			question: '¿Cómo funcionan las penalizaciones en los eventos?',
			answer: 'Las penalizaciones se configuran al crear un evento. Se selecciona la cantidad adicional que se cobrará por día de atraso, y a partir de qué día se comienza a cobrar. Si no asistís o no pagás a tiempo, se aplicarán las penalizaciones según las reglas del evento y se irán incrementando a medida que pasen los días.'
		},
		{
			question: '¿Cómo cargo mi recibo de compras?',
			answer: 'Si sos uno de los encargados de compras de un evento, antes de que el evento se encuentre listo para abonar, debés cargar el recibo de compra. Seleccionando el botón de “Cargar compra” accederás a un modal donde podrás ingresar el monto y el comprobante de pago. Luego, este monto se sumará con el resto de las compras y a partir de ellas se calculará el monto total.'
		},
		{
			question: '¿Cómo cargar mi pago de un evento?',
			answer: 'Cuando un evento se encuentra listo para abonar, se habilita la opción de pago. Dependiendo de si abonaste en efectivo o con transferencia, se habilitará un campo para cargar el comprobante de pago. Si abonaste en efectivo, no es necesario cargar un comprobante, pero si fue por transferencia, es obligatorio cargarlo.'
		},
		{
			question: '¿Cómo aprobar un pago sin que me hayan subido un comprobante?',
			answer: 'Si alguien te abonó, ya sea en efectivo o por transferencia, y aún no cargó el comprobante, vos como encargado de compras tenés la potestad de aprobarlo sin necesidad de que ese comensal cargue su pago. Al lado del participante en la lista, verás un botón para “Aprobar pago sin comprobante”. Al hacer clic, se abrirá un modal donde podrás confirmar el pago y aprobarlo.'
		},
		{
			question: '¿Cuáles son los posibles estados de un evento?',
			answer: 'Los posibles estados de un evento son: Disponible — desde que un evento se crea hasta que se realizan las compras y se cierra; Cerrado — desde el cierre hasta que se aprueban todos los pagos; Listo para abonar — desde que se cargan y asignan todas las compras; y Finalizado — cuando se aprobaron todos los pagos.'
		}
	],
	backBtn: 'VOLVER'
});
