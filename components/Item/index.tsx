import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';



type ItemsType = {
  id: UniqueIdentifier;
  pedido: string;
  horario: Date;
  entregador: string;
  onDelete: (id: UniqueIdentifier) => void;
};

const Items = ({ id, pedido, horario, entregador, onDelete }: ItemsType) => {

  const { t } = useTranslation('common');
  



  const deletarPedido = () => {
    onDelete(id);
  };

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
      <div className="flex items-center justify-between">
        <div className='flex flex-col' {...listeners}>
          <div className='h-10'>{t('Pedido')}: {pedido}</div>
          <div className='h-10'>{t('Horário')}: {format(horario, 'dd/MM/yyyy HH:mm')}</div>
          <div className='h-10'>{t('Entregador')}: {entregador}</div>
        </div>
        <div
          className="w-5 h-5 text-red-500 rounded hover:text-black"
          onClick={deletarPedido}
        >
          <TrashIcon className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Items;
