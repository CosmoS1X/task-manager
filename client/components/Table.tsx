import React from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { formatDate, buildFullName } from '@/helpers';
import Button from './Button';
import type {
  TableNamesUnion,
  TableColumns,
  TableRows,
  EntityMap,
  User,
  Status,
  Label,
  Task,
} from '@/types';
import Endpoints from '@/endpoints';

type RenderableValue = string | number | boolean | null | undefined;

const isRenderable = (value: unknown): value is RenderableValue => {
  const type = typeof value;

  return (
    value === null
    || value === undefined
    || type === 'string'
    || type === 'number'
    || type === 'boolean'
  );
};

const formatValue = (value: RenderableValue): React.ReactNode => {
  if (value === null || value === undefined) return '';

  if (typeof value === 'boolean') return value ? 'Yes' : 'No';

  return value.toString();
};

type Props<T extends TableNamesUnion> = {
  tableName: T;
  cols: TableColumns<T>;
  rows: TableRows<T>;
  onEdit: (id: number) => (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: (id: number) => (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function Table<T extends TableNamesUnion>({
  tableName,
  cols,
  rows,
  onEdit,
  onDelete,
}: Props<T>) {
  const { t } = useTranslation();
  const cellClasses = cn('py-3');

  const renderTableHead = () => (
    <tr>
      {cols.map((col) => <th key={col} className={cellClasses}>{t(`tableCols.${col}`)}</th>)}
      <th className={cellClasses}>{t('tableCols.actions')}</th>
    </tr>
  );

  const renderTableBody = () => rows.map((row) => (
    <tr key={row.id}>
      {cols.map((col) => {
        let cellValue: React.ReactNode = '';

        switch (col) {
          case 'fullName': {
            cellValue = buildFullName(row as User);
            break;
          }
          case 'name': {
            if (tableName === 'tasks') {
              cellValue = (
                <a href={`${Endpoints.Tasks}/${row.id}`} className="text-decoration-none">
                  {(row as Task).name}
                </a>
              );
              break;
            }
            cellValue = (row as Status | Label).name;
            break;
          }
          case 'status': {
            cellValue = (row as Task).status?.name ?? '';
            break;
          }
          case 'creator': {
            cellValue = buildFullName((row as Task).creator as User);
            break;
          }
          case 'executor': {
            cellValue = buildFullName((row as Task).executor as User);
            break;
          }
          case 'createdAt': {
            cellValue = formatDate(row.createdAt);
            break;
          }
          default: {
            const value = (row as EntityMap[T])[col as keyof EntityMap[T]];
            cellValue = isRenderable(value) ? formatValue(value) : '';
          }
        }

        return <td key={col}>{cellValue}</td>;
      })}
      <td>
        <div className="d-flex flex-wrap align-items-center">
          <Button type="button" variant="primary" size="sm" className="me-1" onClick={onEdit(row.id)}>
            {t('buttons.edit')}
          </Button>
          <form onSubmit={onDelete(row.id)}>
            <Button type="submit" variant="danger" size="sm">
              {t('buttons.delete')}
            </Button>
          </form>
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="table-responsive">
      <table className="table table-borderless table-striped mt-5 bg-white">
        <thead>{renderTableHead()}</thead>
        <tbody>{renderTableBody()}</tbody>
      </table>
    </div>
  );
}
