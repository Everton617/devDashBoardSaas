import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';

type ItemsType = {
  id: UniqueIdentifier;
  pedido: string;
  status: string;
  horario: string;
  entregador: string;
  onDelete: (id: UniqueIdentifier) => void;
};

const Items = ({ id, pedido, status, horario, entregador, onDelete }: ItemsType) => {

  const { t } = useTranslation('common');
  
  const deletarPedido = () => {
    onDelete(id); // Chama a função onDelete com o id do pedido
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
          <div className='h-10'>{t('Status')}: {status}</div>
          <div className='h-10'>{t('Horário')}: {horario}</div>
          <div className='h-10'>{t('Entrgador')}: {entregador}</div>
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
