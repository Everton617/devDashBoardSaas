import React from 'react';
import ContainerProps from './container.type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Button } from '../Button';
import { UniqueIdentifier } from '@dnd-kit/core';



type ContainerTypes = {
  id: UniqueIdentifier;
  children,
  title:string
  onAddItem,
  onClickEdit: () => void
};

const Container = ({ id, children, title, onClickEdit,onAddItem  }: ContainerTypes) => {
  

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
  

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'w-full h-full p-4 bg-red-50 rounded-xl flex flex-col gap-y-4',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-gray-800 text-xl">{title}</h1>
        </div>
        <div
          className="w-5 h-5 text-red-500 rounded hover:text-black">
            
          <PencilIcon className="w-full h-full" onClick={showModal} />
        </div>
      </div>

      {children}

      <Button variant="ghost" onClick={onAddItem}>
        Adicionar Pedido
      </Button>

    </div>
  );
};

export default Container;
