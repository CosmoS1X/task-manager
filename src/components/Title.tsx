import React from 'react';
import { z } from 'zod';

const propsSchema = z.object({
  text: z.string(),
});

type Props = z.infer<typeof propsSchema>;

export default function Title({ text }: Props) {
  return <h1 className="display-4 fw-bold mt-4">{text}</h1>;
}
