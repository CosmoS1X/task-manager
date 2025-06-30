import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDeleteTaskMutation } from '@/api/tasksApi';
import { showSuccess, showError } from '@/utils/flash';
import Endpoints, { buildEditRoute } from '@/endpoints';
import { isFetchBaseQueryError } from '@/api/helpers';

export default () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteTask] = useDeleteTaskMutation();

  const handleEdit = (id: number) => async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    navigate(buildEditRoute(Endpoints.Tasks, id));
  };

  const handleDelete = (id: number) => async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await deleteTask(id).unwrap();
      showSuccess(t('flash.tasks.delete.success'));
      navigate(Endpoints.Tasks);
    } catch (error) {
      const isForbidden = isFetchBaseQueryError(error) && error.status === 403;

      if (isForbidden) {
        showError(t('flash.tasks.delete.forbidden'));
      } else {
        showError(t('flash.tasks.delete.error'));
      }
    }
  };

  return { handleEdit, handleDelete };
};
