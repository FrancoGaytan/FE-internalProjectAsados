import { EventStatesEnum } from "../enums/EventState.enum";

export const eventsDataMock = [ // TODO: Add Event Interface
	{
		eventId: 'ad5f4d0005d4s5df4',
		fakeDate: new Date(2017, 4, 4, 17, 23, 42, 11),
		fakeState: EventStatesEnum.AVAILABLE,
		fakeEventData: {
			eventTitle: 'CORDERITO SOLEADO',
			eventDescription: 'Cordero al fuego por tres horas con unas verduritas a la parrilla',
			eventParticipants: 8,
			eventParticipantLimit: 10,
			eventCook: 'Pablito'
		}
	},
	{
		eventId: 'ad5f4dab511d4s5df4',
		fakeDate: new Date(2017, 4, 5, 18, 20, 42, 11),
		fakeState: EventStatesEnum.AVAILABLE,
		fakeEventData: {
			eventTitle: 'PATA REBOZADA',
			eventDescription: 'Pata rebozada al horno durante 6 horas',
			eventParticipants: 15,
			eventParticipantLimit: 15,
			eventCook: 'Franco'
		}
	},
	{
		eventId: 'ad1f4d22af5d4s5df4',
		fakeDate: new Date(2016, 4, 4, 17, 23, 42, 11),
		fakeState: EventStatesEnum.CANCELED,
		fakeEventData: {
			eventTitle: 'ASADO DE VIERNES',
			eventDescription: 'Una tiritas a la parrila con ensalada',
			eventParticipants: 2,
			eventParticipantLimit: 10,
			eventCook: 'Pablito'
		}
	},
	{
		eventId: 'aa5f4daf5d433s5df4',
		fakeDate: new Date(2018, 8, 4, 17, 23, 42, 11),
		fakeState: EventStatesEnum.CLOSED,
		fakeEventData: {
			eventTitle: 'PARRILLA DE LOS JEFES',
			eventDescription: 'Asado completo con ensaladas',
			eventParticipants: 10,
			eventParticipantLimit: 10,
			eventCook: 'Juanca'
		}
	},
	{
		eventId: 'ad5f4da44f5hjs5df4',
		fakeDate: new Date(2017, 4, 4, 17, 23, 42, 11),
		fakeState: EventStatesEnum.AVAILABLE,
		fakeEventData: {
			eventTitle: 'ASADO NOCTURNO',
			eventDescription: 'Asadito a las brazas con vegetales a la parri',
			eventParticipants: 3,
			eventParticipantLimit: 10,
			eventCook: 'Pablito'
		}
	},
	{
		eventId: 'ad5f4daf5d4s555004',
		fakeDate: new Date(2017, 4, 4, 17, 23, 42, 11),
		fakeState: EventStatesEnum.CANCELED,
		fakeEventData: {
			eventTitle: 'OTRO CORDERITO SOLEADO',
			eventDescription: 'Cordero al fuego por tres horas con unas verduritas a la parrilla',
			eventParticipants: 10,
			eventParticipantLimit: 10,
			eventCook: 'Franco'
		}
	}
];