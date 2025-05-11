import { useGetUsersQuery } from '@/services/usersApi';

export default function useEmailCheck(currentUserId?: number) {
  const { data: users } = useGetUsersQuery();

  const checkEmailExists = (email: string) => users?.some((user) => (
    user.email === email && (currentUserId ? user.id !== currentUserId : true)
  ));

  return { checkEmailExists };
}
