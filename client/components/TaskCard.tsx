import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import Endpoints, { buildEditRoute } from '@/endpoints';

function Description({ description }: { description: string }) {
  return (
    <div className="col-12 col-md-8 order-2 order-md-1">
      <div className="lead fw-normal mb-4">{description}</div>
    </div>
  );
}

function Metadata({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-12 col-md-4 border-start px-3 order-1 order-md-2 mb-3 mb-md-0">
      {children}
    </div>
  );
}

function Badges({ status, labels }: { status: string; labels: string[] }) {
  return (
    <div className="mb-3">
      <span className="me-1 badge bg-danger text-white">{status}</span>
      {labels.map((label) => (
        <span key={label} className="me-1 badge bg-info text-white">{label}</span>
      ))}
    </div>
  );
}

function Info({ name, value }: { name: string; value: string }) {
  return (
    <div className="d-flex flex-wrap mb-3">
      <span className="text-muted me-2">{`${name}:`}</span>
      <span>{value}</span>
    </div>
  );
}

type ActionProps = {
  taskId: number;
  onDelete: (id: number) => (event: React.FormEvent<HTMLFormElement>) => void;
};

function Actions({ taskId, onDelete }: ActionProps) {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-wrap">
      <a href={buildEditRoute(Endpoints.Tasks, taskId)} className="btn btn-primary me-1">{t('buttons.edit')}</a>
      <form onSubmit={onDelete(taskId)}>
        <Button type="submit" variant="danger">{t('buttons.delete')}</Button>
      </form>
    </div>
  );
}

export default function TaskCard({ children }: { children: React.ReactNode }) {
  return <div className="row my-5 p-5 shadow bg-white">{children}</div>;
}

TaskCard.Description = Description;
TaskCard.Metadata = Metadata;
TaskCard.Badges = Badges;
TaskCard.Info = Info;
TaskCard.Actions = Actions;
