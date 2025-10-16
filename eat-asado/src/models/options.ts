export interface IOption {
  _id: string;
  title: string;
  participants: ISurveyParticipant[];
}

export interface ISurveyParticipant {
  _id: string;
  name: string;
  lastName: string;
}

export interface IMembersWhoHaventVotedResponse {
  membersWhoHaventVoted: ISurveyParticipant[] | [];
}