export const faq = Object.seal({
	title: 'Frequently Asked Questions',
	questions: [
		{
			question: 'Where can I activate my notifications?',
			answer: 'In your profile, there is a checkbox called "Activate notifications". If you enable it, additional fields will open to enter the email where you want to receive them, and you can also choose when you want to receive them.'
		},
		{
			question: 'How can I recover my password?',
			answer: 'Click on "Forgot your password?" on the login page and follow the steps. You will be asked to enter the email with which you registered, and then an email with a code will be sent to you. This code is necessary in the next step to validate your identity and set your new password.'
		},
		{
			question: 'What to do if I appear as a debtor?',
			answer: 'If you appear as a debtor, it means that you have not paid for a previous event, or the person in charge of purchases for that event has not approved your payment. Make sure to cover these two possibilities, and then you will be able to register for another event without problems.'
		},
		{
			question: 'What is a private event and how does it work?',
			answer: 'A private event is one that only people who receive a direct invitation or have the access link can join. These events are not visible in the list of public events, so you will not be able to see them unless you access them directly and register. To create a private event, select the "Private Event" option when creating the event and then invite participants by sharing the event link.'
		},
		{
			question: 'How do penalties work in events?',
			answer: 'Penalties are configured when creating an event. You select the additional amount that will be charged per day of delay and from which day it starts to be charged. If you do not attend or do not pay on time, penalties will be applied according to the event rules and will increase as days pass.'
		},
		{
			question: 'How do I upload my purchase receipt?',
			answer: 'If you are one of the people in charge of purchases for an event, before the event is ready for payment, you must upload the purchase receipt. By selecting the "Upload Purchase" button, you will access a modal where you can enter the purchase amount and upload the payment receipt. Then, this amount will be added to the rest of the purchases, and from them, the total amount will be calculated.'
		},
		{
			question: 'How do I upload my payment for an event?',
			answer: 'When an event is ready for payment, the payment option is enabled. Depending on whether you pay in cash or by transfer, a field will be enabled to upload the payment receipt. If you pay in cash, it is not necessary to upload a receipt, but if you pay by transfer, it is mandatory to upload the payment receipt.'
		},
		{
			question: 'How to approve a payment without a receipt uploaded?',
			answer: 'If someone has paid you, either in cash or by transfer, and they have not yet uploaded the receipt, as the person in charge of purchases, you have the authority to approve it without requiring the participant to upload their payment. Next to the participant in the participants list, you will see a button to "Approve payment without receipt." When you click this button, a modal will open where you can confirm and approve the payment.'
		},
		{
			question: "Which are the possible event's states?",
			answer: 'The possible states of an event are: Available, from when an event is created until purchases are made and the people in charge of purchases decide to close it. Closed, from when an event is closed until payments from all participants are approved. Ready for payment, from when the people in charge of purchases finish entering and assigning purchases. Finished, from when payments from all participants are approved.'
		}
	],
	backBtn: 'BACK'
});
