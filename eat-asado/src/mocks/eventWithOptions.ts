import { IOption } from "../models/options";

export const eventWithOptionsMock = {
	_id: '68911674236d936fab12e495',
	title: 'Churros con mate',
	// solo necesitamos esto para el max del range
	members: [
		{ _id: '66b369ed80a40597d30163d2', name: 'Franco' },
		{ _id: '6838af924efe4e0ea8a25909', name: 'Sandro' },
		{ _id: '66b24c0d2b7f4f79c124942a', name: 'Ignacio' },
		{ _id: '66bf416c5aaac18c8a6d7fea', name: 'Julian' },
		{ _id: '684330e6bf1bfd74009b6bb4', name: 'Florencia' },
		{ _id: '6890ef4238f81a3ca915b91c', name: 'Gaëlle' }
	],
	// 👇 lo que consume FoodSurvey
	options: [
		{ _id: 'opt1_vacio', title: 'Vacío', participants: ['66b369ed80a40597d30163d2', '6838af924efe4e0ea8a25909', '66bf416c5aaac18c8a6d7fea'] },
		{ _id: 'opt2_chorizo', title: 'Chorizo', participants: ['66b369ed80a40597d30163d2', '66b24c0d2b7f4f79c124942a', '684330e6bf1bfd74009b6bb4'] },
		{
			_id: 'opt3_matambre',
			title: 'Matambre',
			participants: ['6838af924efe4e0ea8a25909', '66b24c0d2b7f4f79c124942a', '6890ef4238f81a3ca915b91c']
		},
		{ _id: 'opt4_tomate', title: 'Tomate', participants: ['684330e6bf1bfd74009b6bb4', '6890ef4238f81a3ca915b91c'] },
		{ _id: 'opt5_lechuga', title: 'Lechuga', participants: ['66b369ed80a40597d30163d2', '684330e6bf1bfd74009b6bb4', '6890ef4238f81a3ca915b91c'] },
		{ _id: 'opt6_zanahoria', title: 'Zanahoria', participants: [] }
	] as IOption[]
};
