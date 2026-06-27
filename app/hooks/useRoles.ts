import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  createRole,
  deleteRole,
  fetchRoles,
  fetchRoleSelect,
  selectFilteredRoles,
  setRoleError,
  setRoleSearchText,
  updateRole,
} from "~/store/slice/roleSlice";
import type { RolePayload } from "~/types/role.interface";

export const useRoles = () => {
  const dispatch = useAppDispatch();
  const roles = useAppSelector((state) => state.roles);
  const filteredRoles = useAppSelector(selectFilteredRoles);

  return {
    // state
    ...roles,
    filteredRoles,

    // actions
    setSearchText: (value: string) => dispatch(setRoleSearchText(value)),
    setError: (value: string | null) => dispatch(setRoleError(value)),

    // thunks
    fetchRoles: () => dispatch(fetchRoles()),
    fetchRoleSelect: () => dispatch(fetchRoleSelect()),
    createRole: (payload: RolePayload) => dispatch(createRole(payload)),
    updateRole: (id: number, data: RolePayload) =>
      dispatch(updateRole({ id, data })),
    deleteRole: (id: number) => dispatch(deleteRole(id)),
  };
};
