import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Button } from '../Button';
import { UniqueIdentifier } from '@dnd-kit/core';

type ContainerTypes = {
  id: UniqueIdentifier;
  children,
  title: string;
  onAddItem: () => void;
  onClickEdit: () => void;
  containerIndex: number;
};

const Container = ({ id, children, title, onClickEdit, onAddItem, containerIndex }: ContainerTypes) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'item',
    },
  });

  const showModal = () => {
    onClickEdit();
  };

  const containerColors = [
    'border-t-4 border-red-400',
    'border-t-4 border-sky-500',
    'border-t-4 border-teal-400',
    'border-t-4 border-yellow-400',
  ];

  const iconColors = [
    'text-red-400',
    'text-sky-500',
    'text-teal-400',
    'text-yellow-400',
  ];

  const buttonColors = [
    'bg-red-400',
    'bg-sky-500',
    'bg-teal-400',
    'bg-yellow-400',
  ];

  const containerColor = containerColors[containerIndex % containerColors.length];
  const iconColor = iconColors[containerIndex % iconColors.length];
  const buttonColor = buttonColors[containerIndex % buttonColors.length];

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'w-full h-full p-4 bg-gray-100 rounded-xl flex flex-col gap-y-4', containerColor,
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-gray-700 text-lg">{title}</h1>
        </div>
        <div
          className={clsx('w-5 h-5 rounded hover:text-black')}>
          <PencilIcon className={clsx('w-full h-full', iconColor)} onClick={showModal} />
        </div>
      </div>

      {children}

      <Button variant="ghost" onClick={onAddItem} className={clsx(buttonColor)}>
        Adicionar Pedido
      </Button>

    </div>
  );
};

export default Container;
