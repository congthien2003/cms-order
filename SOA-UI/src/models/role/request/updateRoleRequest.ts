import type { CreateRoleRequest } from './createRoleRequest';

export interface UpdateRoleRequest extends Partial<CreateRoleRequest> {
  id: string;
  status: string;
}
