import { _delete, _get, _post, _put } from './httpService';
import { IMembersWhoHaventVotedResponse, IOption, ISurveyParticipant } from '../models/options';

export async function getMembersWhoHaventVoted(eventId: string, signal?: AbortSignal): Promise<IMembersWhoHaventVotedResponse> {
  const url = `/options/getMembersWhoHaventVoted/${eventId}`;
  const res = await _get<any>(url, signal);
  return {
    membersWhoHaventVoted: Array.isArray(res.membersWhoHaventVoted)
      ? res.membersWhoHaventVoted
      : [],
  };
}

export async function createOption(eventId: string, title: string, signal?: AbortSignal): Promise<IOption> {
  const url = `/options/createOption/${eventId}`;
  return await _post<IOption, { title: string }>(url, { title }, signal);
}

export async function editOption(optionId: string, payload: Partial<Pick<IOption, 'title' | 'participants'>>, signal?: AbortSignal): Promise<IOption> {
  const url = `/options/editOption/${optionId}`;
  return await _put<IOption, typeof payload>(url, payload, signal);
}

export async function deleteOption(optionId: string, signal?: AbortSignal): Promise<void> {
  const url = `/options/deleteOption/${optionId}`;
  await _delete<void>(url, signal);
}

export async function toggleVoteOption(
  option: IOption,
  userId: string,
  signal?: AbortSignal
): Promise<IOption> {
  // 1) normalizamos el array actual a IDs (soporta objetos o strings, por las dudas)
  const currentIds: string[] = (option.participants ?? []).map((p: any) =>
    typeof p === 'string' ? p : p?._id
  );

  // 2) toggle: si ya está, lo saco; si no, lo agrego
  const already = currentIds.includes(userId);
  const nextIds = already
    ? currentIds.filter(id => id !== userId)
    : [...currentIds, userId];

  // 3) enviamos SOLO IDs al backend (el PUT sigue igual)
  //    casteamos para satisfacer el tipo del payload sin tocar la firma de editOption
  return await editOption(option._id, { participants: nextIds as unknown as any }, signal);
}
