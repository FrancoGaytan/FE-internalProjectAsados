import { _delete, _get, _post, _put } from './httpService';
import { IOption } from '../models/options';

export async function getMembersWhoHaventVoted(eventId: string, signal?: AbortSignal): Promise<number> {
  const url = `/options/getMembersWhoHaventVoted/${eventId}`;
  const res = await _get<any>(url, signal);
  // tolerante al shape del backend: número directo o { count }
  return typeof res === 'number' ? res : (res?.count ?? 0);
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

/** Helper conveniente para toggle de voto sin endpoint específico */
export async function toggleVoteOption(option: IOption, userId: string, signal?: AbortSignal): Promise<IOption> {
  const already = option.participants.includes(userId);
  const participants = already
    ? option.participants.filter(id => id !== userId)
    : [...option.participants, userId];

  return await editOption(option._id, { participants }, signal);
}
