import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import TrashIcon from './trashicon';


type ItemsType = {
  id: UniqueIdentifier;
  pedido: string;
  status: string;
  horario: string;
  entregador: string;
};

const Items = ({ id, pedido, status, horario, entregador }: ItemsType) => {
 
  

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
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200 cursor-pointer',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between ">
      <div className='flex flex-col' {...listeners}>
        <div className='h-10'>Pedido:{pedido}</div>
        <div className='h-10'>Status:{status}</div>
        <div className='h-10'>Horário:{horario}</div>
        <div className='h-10'>Entregador:{entregador}</div>
      </div>
      <TrashIcon />
      </div>
    </div>
  );
};

export default Items;
