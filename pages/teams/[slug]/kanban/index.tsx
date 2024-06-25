import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';

// DnD
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';


// Components
import Container from '@/components/Container';
import Items from '@/components/Item';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Select from '@/components/select';

import { useTranslation } from 'next-i18next';
import { useSession } from "next-auth/react";

import { toast } from 'react-hot-toast';




import { useForm, SubmitHandler } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { FormDataSchema } from '@/lib/FormDataSchema'

type Inputs = z.infer<typeof FormDataSchema>



type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    pedido: string;
    produtos: string;
    quantidade: number;
    horario: Date;
    entregador: string;
    rua: string;
    numero: number;
    complemento: string;
    cep: string;
    cidade: string;
    estado: string;
    telefone: string;
    pagamento: string;
    instructions: string;
    status: string;
    onDelete: (id: UniqueIdentifier) => void;
  }[];
};

export default function Home() {

  const { t } = useTranslation('common');
  const { data: session } = useSession();
  const router = useRouter();
  const { slug } = router.query;

  const [containers, setContainers] = useState<DNDType[]>([
    {
      id: `container-${uuidv4()}`,
      title: 'Backlog',
      items: [],
    },
    {
      id: `container-${uuidv4()}`,
      title: 'Andamento',
      items: [],
    },
    {
      id: `container-${uuidv4()}`,
      title: 'Entrega',
      items: [],
    },
    {
      id: `container-${uuidv4()}`,
      title: 'Concluído ',
      items: [],
    },

  ]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();


  const [Status, setStatus] = useState('');



  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [showTitleModal, setShowTitleModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const [itemIdToDelete, setItemIdToDelete] = useState<UniqueIdentifier | null>(null);

  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const [data, setData] = useState<Inputs>()

  const [inputBackgroundColor, setinputBackgroundColor] = useState('bg-white-700'); 

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema)
  })

  //   console.log(watch('name'))
  //   console.log('rendering')

  const processForm: SubmitHandler<Inputs> = data => {
    console.log(data)
    reset()
    setData(data)
    onAddItem(data)
    setShowAddItemModal(false);
  }


  const [activeContainerIndex] = useState<number | null>(null);


  const handleDeletePedido = (id: UniqueIdentifier) => {
    setItemIdToDelete(id); // Definir o item a ser excluído
    setShowDeleteConfirmation(true); // Mostrar o modal de confirmação

  };

  const handleConfirmDeleteItem = async () => {
    if (itemIdToDelete) {
      setContainers(prevContainers =>
        prevContainers.map(container => ({
          ...container,
          items: container.items.filter(item => item.id !== itemIdToDelete)
        }))
      );
      setShowDeleteConfirmation(false);
      setItemIdToDelete(null);
      try {
        const response = await fetch("/api/teams/qu1ck/order", {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderId: itemIdToDelete })
        })

        const data = await response.json();
        console.log("response ==> ", data);
      } catch (error) {
        console.log("error ==> ", error);
      }
    }
    toast.success('Pedido excluído com sucesso!');
  };

  const handleCancelDeleteItem = () => {
    setShowDeleteConfirmation(false);
    setItemIdToDelete(null);
  };

  const handleChangeTitle = (id: UniqueIdentifier) => {
    setActiveId(id);
    setShowTitleModal(true);
  };

  const handleSaveTitle = () => {
    if (!newTitle) {
      toast.error('Por favor insira um título!');
      return;
    }

    if (!activeId) return;
    setContainers(prevContainers =>
      prevContainers.map(container => {
        if (container.id === activeId) {
          return {
            ...container,
            title: newTitle,
          };
        }
        return container;
      })
    );


    toast.success('Título atualizado com sucesso!');

    setShowTitleModal(false);
    setNewTitle('');
  };


  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === 'container') {
      return containers.find((item) => item.id === id);
    }
    if (type === 'item') {
      return containers.find((container) =>
        container.items.find((item) => item.id === id),
      );
    }
  }



  const findItemPedido = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.pedido;
  };

  const findItemHorario = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.horario;
  };

  const findItemEntregador = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.entregador;
  };

  const findItemRua = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.rua;
  };

  const findItemNumero = (id: UniqueIdentifier | undefined): number | undefined => {
    const container = findValueOfItems(id, 'item');
    if (!container) return undefined;
    const item = container.items.find((item) => item.id === id);
    if (!item) return undefined;
    return item.numero;
  }

  const findItemComplemento = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.complemento;
  };

  const findItemCep = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.cep;
  };

  const findItemCidade = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.cidade;
  };

  const findItemEstado = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.estado;
  };

  const findItemTelefone = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.telefone;
  };


  const findItemProdutos = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.produtos;
  };

  const findItemQuantidade = (id: UniqueIdentifier | undefined): number | undefined => {
    const container = findValueOfItems(id, 'item');
    if (!container) return undefined;
    const item = container.items.find((item) => item.id === id);
    if (!item) return undefined;
    return item.quantidade;
  };

  const findItemPagamento = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.pagamento;
  };

  const findItemInstructions = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item');
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    if (!item) return '';
    return item.instructions;
  };


  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'container');
    if (!container) return '';
    return container.title;
  };

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'container');
    if (!container) return [];
    return container.items;
  };

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    // Handle Items Sorting
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'item');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      );
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex,
        );

        setContainers(newItems);
      } else {
        // In different containers
        const newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1,
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem,
        );
        setContainers(newItems);
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'container');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );

      // Remove the active item from the active container and add it to the over container
      const newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1,
      );
      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
  };

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // Handling Container Sorting
    if (
      active.id.toString().includes('container') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === active.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === over.id,
      );
      // Swap the active and over container
      let newItems = [...containers];
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
      setContainers(newItems);
    }

    // Handling item Sorting
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'item');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      );

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers];
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex,
        );
        setContainers(newItems);
      } else {
        // In different containers
        const newItems = [...containers];
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1,
        );
        newItems[overContainerIndex].items.splice(
          overitemIndex,
          0,
          removeditem,
        );
        setContainers(newItems);
      }
    }
    // Handling item dropping into Container
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item');
      const overContainer = findValueOfItems(over.id, 'container');

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return;
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      );
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      );
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      );

      const newItems = [...containers];
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1,
      );
      newItems[overContainerIndex].items.push(removeditem);
      setContainers(newItems);
    }
    setActiveId(null);
  }


  

  const [endereco, setEndereco] = useState({});

  const handleCEPChange = async (event) => {
    const cep = event.target.value;
    setValue('cep', cep);

    const cepFormatado = cep.replace("-", "");

    if( cepFormatado.length > 8){
      toast.error('O cep deve ter no máximo 8 caracteres');
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
      const data = await response.json();
      if (!response.ok || data.erro) {
        toast.error('Cep Inexistente');
        throw new Error('Erro ao buscar dados do CEP');
      } 
      
      setEndereco(data);
      
      setValue('rua', data.logradouro || '');
      setValue('cidade', data.localidade || '');
      setValue('estado', data.uf || '');  

      setinputBackgroundColor('bg-gray-300');
    } catch (error) {
      setEndereco({}); 
      
    }


  };

  const onAddItem = async (data: Inputs) => {

    console.log('Adding item:', data);
    const {
      pedido,
      produtos,
      quantidade,
      entregador,
      rua,
      numero,
      complemento,
      cep,
      cidade,
      estado,
      telefone,
      pagamento,
      instructions,
    } = data;


    const cepFormatado = cep.replace("-", "");

    const id = `item-${uuidv4()}`;
    const container = containers.find((item) => item.id === currentContainerId);
    if (!container) {
      console.error('Container not found');
      return;
    }

    const validarCep = async (cep) => {
      const url = `https://viacep.com.br/ws/${cep}/json/`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erro ao validar o CEP');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Erro:', error);
        return null;
      }
    };
    

    const cepDados = await validarCep(cepFormatado);
    if (!cepDados) {
      console.error('CEP inválido');
      return;
    }

    const { logradouro, uf, localidade } = cepDados;


    console.log('Container title:', container.title);
    container.items.push({
      id,
      pedido,
      produtos,
      quantidade,
      horario: new Date(),
      entregador,
      rua: rua || logradouro,
      numero,
      complemento,
      cep,
      cidade: cidade || localidade,
      estado: estado || uf,
      telefone,
      pagamento,
      instructions: instructions ?? '',
      status,
      onDelete: handleDeletePedido,
    });

    const order = {
      id,
      pedido,
      status: container.title,
      entregador,
    };

    const user = session ? session.user : "unknown";

    try {
      const response = await fetch(`/api/teams/${slug}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order, user }),
      });

      const data = await response.json();
      console.log("response ==> ", data);
    } catch (error) {
      console.error("error ==> ", error);
    }


  };


  return (

    <div className="mx-auto max-w-9xl py-10 ">
      {/* Add Container Modal */}

      {/* Add Item Modal */}
      <Modal
        showModal={showAddItemModal}
        setShowModal={setShowAddItemModal}
        currentContainerId={currentContainerId}>
        <div className='p-1 pb-5  rounded-lg'>
          <h1 className="text-gray-800 text-2xl font-bold pt-8 pl-8 text-black">{t('Adicionar Pedido')}</h1>
        </div>
        <form onSubmit={handleSubmit(processForm)}
          className='flex flex-1 flex-col gap-4 w-full'>

          <div className="flex flex-col w-full items-start gap-y-5 overflow-auto max-h-[700px] pb-10">


            <div className='flex flex-col pl-8 pt-4 w-full'>
              <label className='text-black '>{t('Pedido: ')}</label>
              <input
                placeholder="Insira o número do pedido"
                className='rounded-lg border p-2 bg-white rounded-lg hover:shadow-xl w-80'
                {...register('pedido')}
              />
              {errors.pedido?.message && (
                <p className='text-sm text-red-400'>{errors.pedido.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 ">

              <div className="space-y-2 pl-8 ">
                <label className='text-black '>{t('Produtos: ')}</label>
                <input
                  placeholder='produtos'
                  className='rounded-lg border p-2 bg-white rounded-lg hover:shadow-xl w-60 '
                  {...register('produtos')}
                />
                {errors.produtos?.message && (
                  <p className='text-sm text-red-400'>{errors.produtos.message}</p>
                )}
              </div>

              <div className="space-y-2 pl-7 ">
                <label className='text-black'>{t('Quantidade: ')}</label>
                <input
                  placeholder='Quantidade'
                  className='rounded-lg border p-2 bg-white rounded-lg hover:shadow-xl'
                  {...register('quantidade')}
                />
                {errors.quantidade?.message && (
                  <p className='text-sm text-red-400'>{errors.quantidade.message}</p>
                )}
              </div>

              <div className="space-y-2 pt-2 pl-7">
                <label className='text-black block '>{t('CEP: ')}</label>
                <input
                  placeholder='cep'
                  className='rounded-lg border p-2 bg-white rounded-lg hover:shadow-xl w-60'
                  {...register('cep', { required: 'O CEP é obrigatório.' })}
                  onChange={handleCEPChange} // Adiciona o evento onChange para buscar dados do CEP
                />
                {errors.cep?.message && (
                  <p className='text-sm text-red-400'>{errors.cep.message}</p>
                )}
              </div>

              <div className="space-y-2 pt-2 pl-7 ">
                <label className='text-black block'>{t('Estado: ')}</label>
                <input
                disabled
                  placeholder='Estado'
                  className={`rounded-lg border p-2 bg-white rounded-lg hover:shadow-xl hover:cursor-not-allowed w-50 ${inputBackgroundColor}`}
                  {...register('estado')}
                />
                {errors.estado?.message && (
                  <p className='text-sm text-red-400'>{errors.estado.message}</p>
                )}
              </div>

              <div className="space-y-2 pt-0 pl-8">
                <label className='text-black block'>{t('Cidade: ')}</label>
                <input
                disabled
                  placeholder='cidade'
                  className={`rounded-lg border p-2 bg-white rounded-lg hover:shadow-xl hover:cursor-not-allowed w-60 ${inputBackgroundColor}`}
                  {...register('cidade')}
                />
                {errors.cidade?.message && (
                  <p className='text-sm text-red-400'>{errors.cidade.message}</p>
                )}
              </div>

              <div className="space-y-1 pt-1 pl-8 ">
                <label className='text-black block'>{t('Rua: ')}</label>
                <input
                  placeholder='rua'
                  disabled
                  className={`rounded-lg border p-2 bg-white rounded-lg hover:shadow-xl hover:cursor-not-allowed  w-50  ${inputBackgroundColor}`}
                  {...register('rua')}
                />
                {errors.rua?.message && (
                  <p className='text-sm text-red-400'>{errors.rua.message}</p>
                )}
              </div>

              <div className="space-y-2 pl-7 pt-1">
                <label className='text-black'>{t('Número: ')}</label>
                <input
                  placeholder='numero'
                  className='rounded-lg border p-2 bg-white rounded-lg hover:shadow-xl w-60'
                  {...register('numero')}
                />
                {errors.numero?.message && (
                  <p className='text-sm text-red-400'>{errors.numero.message}</p>
                )}
              </div>

              <div className="space-y-2 pt-2 pl-8 p-2">
                <label className='text-black '>{t('Complemento: ')}</label>
                <input
                  placeholder='complemento'
                  className='rounded-lg border p-2 bg-white rounded-lg hover:shadow-xl w-50'
                  {...register('complemento')}
                />
                {errors.complemento?.message && (
                  <p className='text-sm text-red-400'>{errors.complemento.message}</p>
                )}
              </div>

              

              

              <div className="space-y-2 pl-7 ">
                <label className='text-black'>{t('Telefone: ')}</label>
                <input
                  placeholder='telefone'
                  className='rounded-lg border p-2 bg-white rounded-lg hover:shadow-xl w-60'
                  {...register('telefone')}
                />
                {errors.telefone?.message && (
                  <p className='text-sm text-red-400'>{errors.telefone.message}</p>
                )}

              </div>

            

              <div className="space-y-2 pl-8">
                <label className='text-black'>{t('Entregador: ')}</label>
                <input
                  placeholder='entregador'
                  className='rounded-lg border p-2 bg-white rounded-lg hover:shadow-xl'
                  {...register('entregador')}
                />
                {errors.entregador?.message && (
                  <p className='text-sm text-red-400'>{errors.entregador.message}</p>
                )}
              </div>


              <div className="space-y-2 flex flex-col items-start pl-7 ">
                <label className='text-black'>{t('Status: ')}</label>
                <Select
                  name="status"
                  value={Status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {containers
                    .filter(container => container.id === currentContainerId) // Filtrar apenas o contêiner atual
                    .map(container => (
                      <option key={container.id} value={container.title}>{container.title}</option>
                    ))
                  }
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-1 w-full'>
              <div className="space-y-2 flex flex-col pl-8 w-full pr-10">
                <label className='text-black'>{t('Instruções Especiais: ')}</label>
                <textarea
                  className="textarea textarea-bordered bg-gray-100 text-black "
                  placeholder="Caso exista, informe alguma instrução"
                  {...register('instructions')}
                ></textarea>
              </div>

              <div className="space-y-2 pl-8 pt-5">
                <select
                  className="select w-full max-w-xs bg-gray-100 text-black rounded-lg"
                  {...register('pagamento')}
                  defaultValue=""
                >
                  <option value="" disabled selected>{t('Selecione a forma de pagamento')}</option>
                  <option value={"credito"}>{t('Cartão de Crédito')}</option>
                  <option value={"debito"}>{t('Cartão de Débito')}</option>
                  <option value={"pix"}>{t('PIX')}</option>
                </select>
                {errors.pagamento?.message && (
                  <p className='text-sm text-red-400'>{errors.pagamento.message}</p>
                )}
              </div>



            </div>


          </div>

          <div className='p-5 flex justify-end'>
            <Button
              variant='destructive'
            >
              {t('Adicionar Pedido')}</Button>
          </div>

        </form>

      </Modal>

      <div className="flex items-center justify-between gap-y-2">
        <h1 className="text-gray-600 text-3xl font-bold">{t('Gestor de Pedidos')}</h1>
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-4 gap-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >

            <SortableContext items={containers.map((i) => i.id)}>
              {containers.map((container, containerIndex) => (
                <Container
                  id={container.id}
                  title={container.title}
                  key={container.id}
                  containerIndex={containerIndex}

                  onAddItem={() => {
                    setShowAddItemModal(true);
                    setCurrentContainerId(container.id);

                  }}

                  onClickEdit={() => handleChangeTitle(container.id)}


                >
                  <Modal
                    showModal={showTitleModal}
                    setShowModal={setShowTitleModal}
                  >
                    <div className="flex flex-col w-full items-center gap-y-4 p-10">
                      <h1 className="text-gray-800 text-3xl font-bold">{t('Alterar título')}</h1>
                      <Input
                        size='flex'
                        name='input'
                        type="text"
                        placeholder="Novo Título"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                      <Button variant='destructive' onClick={handleSaveTitle}>{t('Salvar')}</Button>
                    </div>
                  </Modal>

                  <SortableContext items={container.items.map((i) => i.id)}>
                    <div className="flex items-start flex-col gap-y-4">
                      <Modal
                        showModal={showDeleteConfirmation}
                        setShowModal={setShowDeleteConfirmation}
                      >
                        <div className="flex flex-col w-full items-center rounded-lg p-10 gap-2">
                          <h1 className="text-gray-800 text-3xl font-bold">
                            {t('Confirmar Exclusão')}
                          </h1>
                          <p>{t('Deseja mesmo excluir este pedido?')}</p>
                          <div className="flex gap-x-5 pt-5">
                            <Button className="bg-error h-8 hover:bg-red-700" onClick={handleConfirmDeleteItem}>{t('Sim')}</Button>
                            <Button className="bg-error h-8 hover:bg-red-700" onClick={handleCancelDeleteItem}>{t('Cancelar')}</Button>
                          </div>
                        </div>
                      </Modal>

                      {container.items.map((i) => (
                        <Items
                          key={i.id}
                          id={i.id}
                          pedido={i.pedido}
                          horario={i.horario}
                          entregador={i.entregador}
                          rua={i.rua}
                          numero={i.numero}
                          complemento={i.complemento}
                          cep={i.cep}
                          cidade={i.cidade}
                          estado={i.estado}
                          telefone={i.telefone}
                          produtos={i.produtos}
                          quantidade={i.quantidade}
                          pagamento={i.pagamento}
                          instructions={i.instructions}
                          onDelete={handleDeletePedido}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </Container>
              ))}
            </SortableContext>
            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For item Item */}
              {activeId && activeId.toString().includes('item') && (
                <Items
                  id={activeId}
                  pedido={findItemPedido(activeId)}
                  horario={new Date(findItemHorario(activeId))}
                  entregador={findItemEntregador(activeId)}
                  rua={findItemRua(activeId)}
                  numero={findItemNumero(activeId) ?? 0}
                  complemento={findItemComplemento(activeId)}
                  cep={findItemCep(activeId)}
                  cidade={findItemCidade(activeId)}
                  estado={findItemEstado(activeId)}
                  telefone={findItemTelefone(activeId)}
                  produtos={findItemProdutos(activeId)}
                  quantidade={findItemQuantidade(activeId) ?? 0}
                  pagamento={findItemPagamento(activeId)}
                  instructions={findItemInstructions(activeId)}
                  onDelete={handleDeletePedido} />
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes('container') && (
                <Container

                  id={activeId}
                  title={findContainerTitle(activeId)}
                  onAddItem={onAddItem}
                  onClickEdit={handleChangeTitle}
                  containerIndex={activeContainerIndex}
                >

                  {findContainerItems(activeId).map((i) => (
                    <Items
                      key={i.id}
                      id={i.id}
                      pedido={i.pedido}
                      horario={i.horario}
                      entregador={i.entregador}
                      rua={i.rua}
                      numero={i.numero}
                      complemento={i.complemento}
                      cep={i.cep}
                      cidade={i.cidade}
                      estado={i.estado}
                      telefone={i.telefone}
                      produtos={i.produtos}
                      quantidade={i.quantidade}
                      pagamento={i.pagamento}
                      instructions={i.instructions}
                      onDelete={handleDeletePedido}

                    />
                  ))}
                </Container>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}