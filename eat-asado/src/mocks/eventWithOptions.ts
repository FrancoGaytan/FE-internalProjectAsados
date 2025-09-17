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
		{ _id: 'opt1_vacio', title: 'Vacío', participants: [{}] },
		{ _id: 'opt2_chorizo', title: 'Chorizo', participants: [{ _id: '66b369ed80a40597d30163d2', name: 'Franco' }, { _id: '66b24c0d2b7f4f79c124942a', name: 'Ignacio' }, { _id: '684330e6bf1bfd74009b6bb4', name: 'Florencia' }] },
		{
			_id: 'opt3_matambre',
			title: 'Matambre',
			participants: [{ _id: '6838af924efe4e0ea8a25909', name: 'Sandro' }, { _id: '66b24c0d2b7f4f79c124942a', name: 'Ignacio' }, { _id: '6890ef4238f81a3ca915b91c', name: 'Gaëlle' }]
		},
		{ _id: 'opt4_tomate', title: 'Tomate', participants: [{ _id: '684330e6bf1bfd74009b6bb4', name: 'Florencia' }, { _id: '6890ef4238f81a3ca915b91c', name: 'Gaëlle' }] },
		{ _id: 'opt5_lechuga', title: 'Lechuga', participants: [{ _id: '66b369ed80a40597d30163d2', name: 'Franco' }, { _id: '684330e6bf1bfd74009b6bb4', name: 'Florencia' }, { _id: '6890ef4238f81a3ca915b91c', name: 'Gaëlle' }] },
		{ _id: 'opt6_zanahoria', title: 'Zanahoria', participants: [] }
	] as IOption[]
};
