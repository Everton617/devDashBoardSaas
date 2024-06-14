import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { PencilIcon } from '@heroicons/react/24/outline';
import Button from '../Button';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useTranslation } from 'next-i18next';

type ContainerTypes = {
  id: UniqueIdentifier;
  children,
  title: string;
  onAddItem: () => void;
  onClickEdit;
  containerIndex: number | null;
};

const Container = ({ id, children, title, onClickEdit, onAddItem, containerIndex }: ContainerTypes) => {

  const { t } = useTranslation('common');

  const {
    attributes,
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
    'text-red-400 hover:text-red-900',
    'text-sky-500 hover:text-sky-900',
    'text-teal-400 hover:text-teal-900',
    'text-yellow-400 hover:text-yellow-900',
  ];

  const buttonColors = [
    'bg-red-400 hover:bg-red-500',
    'bg-sky-500 hover:bg-sky-600',
    'bg-teal-400 hover:bg-teal-500',
    'bg-yellow-400 hover:bg-yellow-500',
  ];

  const index = containerIndex !== null ? containerIndex : 0;

  const containerColor = containerColors[index % containerColors.length];
  const iconColor = iconColors[index % iconColors.length ];
  const buttonColor = buttonColors[index % buttonColors.length];

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

      <Button onClick={onAddItem} className={clsx(buttonColor)}>
      {t('Adicionar Pedido')}
      </Button>

    </div>
  );
};

export default Container;
