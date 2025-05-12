import React from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import type { TableNamesUnion, ColNamesUnion, EntitiesUnion } from '@/types';
import { formatDate } from '@/helpers';
import Button from './Button';

type Props = {
  name: TableNamesUnion,
  cols: ColNamesUnion[],
  rows: EntitiesUnion[],
  onDelete: (id: number) => (event: React.FormEvent<HTMLFormElement>) => void,
};

export default function Table({ name, cols, rows, onDelete }: Props) {
  const { t } = useTranslation();
  const cellClasses = cn('py-3');

  const renderTableHead = () => (
    <tr>
      {cols.map((col: ColNamesUnion) => <th key={col} className={cellClasses}>{t(`tableCols.${col}`)}</th>)}
      <th className={cellClasses}>{t('tableCols.actions')}</th>
    </tr>
  );

  const renderTableBody = () => rows.map((row: EntitiesUnion) => (
    <tr key={row.id}>
      {cols.map((col: ColNamesUnion) => {
        switch (col) {
          case 'fullName':
            return <td key={col}>{`${row.firstName} ${row.lastName}`}</td>;
          case 'createdAt':
            return <td key={col}>{formatDate(row.createdAt)}</td>;
          default:
            return <td key={col}>{row[col]}</td>;
        }
      })}
      <td>
        <div className="d-flex flex-wrap align-items-center">
          <a href={`${name}/${row.id}/edit`} className="btn btn-primary btn-sm me-1">{t('buttons.edit')}</a>
          <form onSubmit={onDelete(row.id)}>
            <Button type="submit" variant="danger" size="sm">{t('buttons.delete')}</Button>
          </form>
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="table-responsive">
      <table className="table table-borderless table-striped mt-5 bg-white">
        <thead>
          {renderTableHead()}
        </thead>
        <tbody>
          {renderTableBody()}
        </tbody>
      </table>
    </div>
  );
}
