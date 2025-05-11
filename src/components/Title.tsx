import React from 'react';

type Props = {
  text: string;
};

export default function Title({ text }: Props) {
  return <h1 className="display-4 fw-bold mt-4">{text}</h1>;
}
