export interface Profile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  roles: string[];
}

export interface ProfileUpdatePayload {
  fullName?: string;
  phone?: string;
  address?: string;
}
