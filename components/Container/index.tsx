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
  onClickEdit: () => void,
  containerIndex: number;
  iconIndex:number;
};

const Container = ({ id, children, title, onClickEdit,onAddItem,containerIndex,iconIndex  }: ContainerTypes) => {
  

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
    'border-t-4 border-blue-800',
    'border-t-4 border-teal-400',
    'border-t-4 border-yellow-300',
  
  ];

  const iconColors = [
    'text-color-red-400',
    'text-color-blue-800',
    'text-color-teal-400',
    'text-color-yellow-300',
  ];

  const iconColorClass = iconColors[iconIndex % iconColors.length];

  const containerColor = containerColors[containerIndex % containerColors.length];

  
  

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'w-full h-full p-4 bg-gray-100 rounded-xl flex flex-col gap-y-4',containerColor,
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-gray-700 text-lg">{title}</h1>
        </div>
        <div
          className={clsx('w-5 h-5 rounded hover:text-black', iconColorClass)}>
            
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
