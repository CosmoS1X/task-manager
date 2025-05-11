import React from 'react';
import avatar from '../../assets/avatar.jpg';

type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: Props) {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8">
        <div className="card shadow-sm">
          <div className="card-body row p-5">
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
              <img src={avatar} alt="Avatar" className="rounded-circle" />
            </div>
            <div className="col-12 col-md-6 mt-3 mt-mb-0">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
