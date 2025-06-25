export type Task = {
  id: string;
  text: string;
  completed: boolean;
  created_at?: string;
  user_id?: string;
};

export type User = {
  id: string;
  email: string;
};
