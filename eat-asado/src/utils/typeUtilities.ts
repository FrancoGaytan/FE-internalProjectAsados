// @ts-nocheck
export type NestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType]: ObjectType[Key] extends object ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}` : Key;
}[keyof ObjectType];
