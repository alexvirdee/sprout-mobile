/** Jest mock for expo-secure-store (native module). */
export const getItemAsync = jest.fn(async (): Promise<string | null> => null);
export const setItemAsync = jest.fn(async (): Promise<void> => undefined);
export const deleteItemAsync = jest.fn(async (): Promise<void> => undefined);
