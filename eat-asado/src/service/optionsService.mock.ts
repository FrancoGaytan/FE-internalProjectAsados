import { eventWithOptionsMock } from "../mocks/eventWithOptions";

// === Model ===
export interface IOption {
  _id: string;
  title: string;
  participants: string[];
}

// === Memoria ===
const store: Record<string, IOption[]> = {};
const membersByEvent: Record<string, string[]> = {
  [eventWithOptionsMock._id]: eventWithOptionsMock.members.map(m => m._id),
};

seed(eventWithOptionsMock._id);

// === Utils ===
function makeId() {
  // 24 hex chars estilo ObjectId (no-crypto, suficiente para mock)
  const hex = '0123456789abcdef';
  return Array.from({ length: 24 }, () => hex[Math.floor(Math.random() * hex.length)]).join('');
}
function wait(ms = 250) { return new Promise(res => setTimeout(res, ms)); }

function seed(eventId: string) {
  // Opciones iniciales tipo parrilla
  const base = ['Vacío', 'Chorizo', 'Matambre', 'Tomate', 'Lechuga', 'Zanahoria'];
  const members = membersByEvent[eventId] ?? [];
  store[eventId] = base.map(title => ({
    _id: makeId(),
    title,
    participants: members.filter(() => Math.random() < 0.5), // asignación random
  }));
}

// === API MOCK (mismos nombres que el service real) ===
export async function getMembersWhoHaventVoted(eventId: string, signal?: AbortSignal): Promise<number> {
  await wait();
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const members = new Set(membersByEvent[eventId] ?? []);
  const voted = new Set<string>();
  (store[eventId] ?? []).forEach(o => o.participants.forEach(p => voted.add(p)));
  let count = 0;
  members.forEach(m => { if (!voted.has(m)) count++; });
  return count;
}

export async function createOption(eventId: string, title: string, signal?: AbortSignal): Promise<IOption> {
  await wait();
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const opt: IOption = { _id: makeId(), title, participants: [] };
  store[eventId] = [...(store[eventId] ?? []), opt];
  return opt;
}

export async function editOption(optionId: string, payload: Partial<Pick<IOption, 'title'|'participants'>>, signal?: AbortSignal): Promise<IOption> {
  await wait();
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  for (const [eventId, arr] of Object.entries(store)) {
    const idx = arr.findIndex(o => o._id === optionId);
    if (idx >= 0) {
      const updated = store[eventId][idx] = { ...arr[idx], ...payload };
      return updated;
    }
  }
  throw new Error('Option not found');
}

export async function deleteOption(optionId: string, signal?: AbortSignal): Promise<void> {
  await wait();
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  for (const [eventId, arr] of Object.entries(store)) {
    const next = arr.filter(o => o._id !== optionId);
    if (next.length !== arr.length) { store[eventId] = next; return; }
  }
  throw new Error('Option not found');
}

export async function toggleVoteOption(option: IOption, userId: string, signal?: AbortSignal): Promise<IOption> {
  await wait();
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const already = option.participants.includes(userId);
  const participants = already
    ? option.participants.filter(id => id !== userId)
    : [...option.participants, userId];
  return editOption(option._id, { participants }, signal);
}

// Solo para el Playground: snapshot de opciones actuales
export function __getOptionsSnapshot(eventId: string): IOption[] {
  return JSON.parse(JSON.stringify(store[eventId] ?? []));
}
