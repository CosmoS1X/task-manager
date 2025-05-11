import React from 'react';

type Props = {
  text: string;
};

export default function Title({ text }: Props) {
  return <h1 className="display-4 fw-bold my-4 text-center">{text}</h1>;
}
