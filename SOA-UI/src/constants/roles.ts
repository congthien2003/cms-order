export interface Role {
  id: number;
  name: string;
  vietnamese: string;
}
export const Roles: Role[] = [
  {
    id: 1,
    name: 'Admin',
    vietnamese: 'Quản trị viên',
  },
];

export const RoleKeys = {
  Admin: 'Admin',
};
