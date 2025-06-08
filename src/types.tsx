export type Credentials = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

export type Status = {
  id: number;
  name: string;
  createdAt: string;
};

export type Label = {
  id: number;
  name: string;
  createdAt: string;
};

export type Task = {
  id: number;
  name: string;
  statusId: number;
  creatorId: number;
  executorId: number | null;
  createdAt: string;
  status?: Status;
  creator?: User;
  executor?: User | null;
  labels?: Label[];
};

export type EntityMap = {
  users: User;
  statuses: Status;
  labels: Label;
  tasks: Task;
};

export type TableNamesUnion = keyof EntityMap;

type ColumnMap = {
  users: Array<keyof User | 'fullName'>;
  statuses: Array<keyof Status>;
  labels: Array<keyof Label>;
  tasks: Array<keyof Task>;
};

export type TableColumns<T extends TableNamesUnion> = ColumnMap[T];

export type TableRows<T extends TableNamesUnion> = EntityMap[T][];
