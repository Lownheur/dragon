export interface Profil {
  id: string;
  userId: string;
  nom: string;
  prenom: string;
  age: number | null;
  dateAniv: string | null; // YYYY-MM-DD
  adresse: string;
  taf: string; // métier / travail
  createdAt: string;
  updatedAt: string;
}

export const PROFIL_DEFAULTS: Omit<Profil, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  nom: '',
  prenom: '',
  age: null,
  dateAniv: null,
  adresse: '',
  taf: '',
};
