import { removeAccents } from './formatName';

export const handlePlayerNameChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPlayerName: (value: string) => void
): void => {
  const valueWithoutAccents = removeAccents(e.target.value);
  setPlayerName(valueWithoutAccents.toUpperCase());
};

export const handleSiglaChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setSigla: (value: string) => void
): void => {
  const valueWithoutAccents = removeAccents(e.target.value);
  setSigla(valueWithoutAccents.toUpperCase());
};

export const handleUsernameChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setUsername: (value: string) => void
): void => {
  const valueWithoutAccents = removeAccents(e.target.value);
  setUsername(valueWithoutAccents);
};

