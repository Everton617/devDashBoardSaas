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
import  Button  from '@/components/Button';
import Select from '@/components/select';

import { useTranslation } from 'next-i18next';
import { useSession } from "next-auth/react";

import { toast } from 'react-hot-toast';






type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    pedido: string;
    produtos: string[];
    quantidade: number;
    horario: Date;
    entregador: string;
    rua: string;
    numero: number;
    complemento: string;
    cep: string;
    cidade: string;
    estado: string;
    telefone:string;
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

  const [Pedido, setPedido] = useState('');
  const [Produtos, setProdutos] = useState<string[]>([]);;
  const [Quantidade, setQuantidade] = useState(0);
  const [Entregador, setEntregador] = useState('');
  const [Rua, setRua] = useState('');
  const [Numero, setNumero] = useState(0);
  const [Complemento, setComplemento] = useState('');
  const [Cep, setCep] = useState<string>('');
  const [Cidade, setCidade] = useState('');
  const [Estado, setEstado] = useState('');
  const [Pagamento, setPagamento] = useState('');
  const [Instructions, setInstructions] = useState('');
  const [Telefone, setTelefone] = useState('');
  const [Status, setStatus] = useState('');
 
  

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [showTitleModal, setShowTitleModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const [itemIdToDelete, setItemIdToDelete] = useState<UniqueIdentifier | null>(null);
 
  const [showAddItemModal, setShowAddItemModal] = useState(false);


  const [activeContainerIndex] = useState<number | null>(null);

  const validateFields = () => {
    if (!Pedido ||
       !Produtos.length || Quantidade <= 0 || !Rua || Numero <= 0 || !Cep || !Cidade || !Telefone || !Entregador || !Pagamento) {
      return false;
    }
    return true;
  };

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
             headers: {"content-type": "application/json"},
             body: JSON.stringify({orderId: itemIdToDelete})
        })

        const data = await response.json();
        console.log("response ==> ", data);
      } catch (error) {
        console.log("error ==> ", error);
      }
    }
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
    if (!newTitle || !activeId) return;
  
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

  const findItemCep = (id: UniqueIdentifier | undefined)  => {
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


  const findItemProdutos = (id: UniqueIdentifier | undefined): string[] => {
    const container = findValueOfItems(id, 'item');
    if (!container) return [''];
    const item = container.items.find((item) => item.id === id);
    if (!item) return [''];
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

 
  const handleChangeCep = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9-]*$/.test(value)) {  
      setCep(value);
    }
  };

  const handleChangeTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9-]*$/.test(value)) {  
      setTelefone(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9-]/.test(e.key)) {
      e.preventDefault();
    }
  };

  

  const onAddItem = async () => {

    if (!validateFields()) {
      toast.error('Por Favor preencha todos os campos!')
    }

    if (!Pedido) return;
    const id = `item-${uuidv4()}`;
    const container = containers.find((item) => item.id === currentContainerId);
    if (!container) return;
    console.log(container.title);
    container.items.push({
      id,
      pedido: Pedido,
      produtos: Produtos,
      quantidade: Quantidade,
      horario: new Date(),
      entregador: Entregador,
      rua: Rua,
      numero: Numero,
      complemento: Complemento,
      cep: Cep,
      cidade: Cidade,
      estado: Estado,
      telefone: Telefone,
      pagamento: Pagamento,
      instructions: Instructions,
      status: Status,
      onDelete: handleDeletePedido,
    });

    setContainers([...containers]);
    setPedido('');
    setProdutos(['']);
    setQuantidade(0);
    setEntregador('');
    setRua('');
    setNumero(0);
    setComplemento('');
    setCep('');
    setCidade('');
    setEstado('');
    setTelefone('');
    setPagamento('');
    setInstructions('');
    setStatus('');
    setShowAddItemModal(false);

    const order = {
        id: id,
        pedido: Pedido,
        status: container.title,
        entregador: Entregador,
    }

    const user = session ? session.user : "unknow";

    try {
        const response = await fetch(`/api/teams/${slug}/order`, {
             method: "POST",
             headers: {"content-type": "application/json"},
             body: JSON.stringify({order: order, user: user})
        })

        const data = await response.json();
        console.log("response ==> ", data);
    } catch (error) {
        console.log("error ==> ", error);
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
    <form >
  
          <div className="flex flex-col w-full items-start gap-y-5 overflow-auto max-h-[700px] pb-10">
            
  
            <div className='flex flex-col pl-8 pt-4'>
              <label className='text-black'>{t('Pedido: ')}</label>
              <Input
                type="text"
                size='flex'
                placeholder="Insira o número do seu pedido"
                name="pedido"
                value={Pedido}
                onChange={(e) => setPedido(e.target.value)}
                
              />
            </div>
  
            <form className="grid grid-cols-2 gap-2">
  
            <div className="space-y-2 pl-8">
            <label className='text-black'>{t('Produtos: ')}</label>
              <Input
                type="text"
                size='flex'
                placeholder=" Insira os produtos do pedido"
                name="produtos"
                value={Produtos.join(',')}
                onChange={(e) => setProdutos([e.target.value])}
              />
            </div>
            <div className="space-y-2 pl-7">
             <label className='text-black'>{t('Quantidade: ')}</label>
              <Input
                type="number"
                size='sm'
                placeholder="Insira a quantidade do seu pedido"
                name="quantidade"
                value={Quantidade.toString()}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1 pt-1 pl-8">
            <label className='text-black'>{t('Rua: ')}</label>
              <Input
                type="text"
                size='flex'
                placeholder=" Insira a Rua do destinatário"
                name="rua"
                value={Rua}
                onChange={(e) => setRua(e.target.value)}
              />
            </div>
  
                <div className="space-y-2 pl-7">
                <label className='text-black'>{t('Número: ')}</label>
                  <Input
                    size='sm'
                    type="number"
                    placeholder="Insira o número residencial do destinatário:"
                    name="numero"
                    value={Numero.toString()}
                    onChange={(e) => setNumero(Number(e.target.value))}
                  />
                </div>
  
  
                <div className="space-y-2 pt-2 pl-8">
                <label className='text-black '>{t('Complemento: ')}</label>
                  <Input
                    size='flex'
                    type="text"
                    placeholder="Insira o complemento do destinatário"
                    name="complemento"
                    value={Complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                  />
                </div>
  
                <div className="space-y-2 pt-2 pl-7 ">
                <label className='text-black block '>{t('CEP: ')}</label>
                  <Input
                    size='sm'
                    type="text"
                    placeholder="Ex: 00000-000"
                    name="cep"
                    value={Cep}
                    onChange={handleChangeCep}
                    onKeyPress={handleKeyPress}
                  />
                </div>
  
                <div className="space-y-2 pt-2 pl-8">
                <label className='text-black'>{t('Cidade: ')}</label>
                <Input
                  size='flex'
                  type="text"
                  placeholder="Insira a cidade do destinatário"
                  name="cidade"
                  value={Cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
  
                </div>
  
                <div className="space-y-2 pt-2 pl-7 ">
                <label className='text-black'>{t('Telefone: ')}</label>
                  <Input
                    type="number"
                    variant='default'
                    size='sm'
                    placeholder="Ex: (00) 0000-0000"
                    name="telefone"
                    value={Telefone.toString()}
                    onChange={handleChangeTelefone}
                    onKeyPress={handleKeyPress}
                  />
  
                </div>
              <div className="space-y-2 pl-8">
              <label className='text-black'>{t('Entregador: ')}</label>
                <Input
                  type="text"
                  size='flex'
                  placeholder="Insira o nome do entregador:"
                  name="entregador"
                  value={Entregador}
                  onChange={(e) => setEntregador(e.target.value)}
                />
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
          </form>
  
          <form className='grid grid-cols-1 w-full'>
            <div className="space-y-2 flex flex-col pl-8 w-full pr-10">
                <label className='text-black'>{t('Instruções Especiais: ')}</label>
                <textarea
                  className="textarea textarea-bordered bg-gray-100 text-black "
                  placeholder="Caso exista, informe alguma instrução"
                  name='instructions'
                  value={Instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                   ></textarea>
              </div>
  
            <div className="space-y-2 pl-8 pt-5">
            <select
             className="select w-full max-w-xs bg-gray-100 text-black rounded-lg"
             name='pagamento'
             onChange={(e) => setPagamento(e.target.value)}
             >
              <option disabled selected>{t('Selecione a forma de pagamento')}</option>
              <option value={"credito"}>{t('Cartão de Crédito')}</option>
              <option value={"debito"}>{t('Cartão de Débito')}</option>
              <option value={"pix"}>{t('PIX')}</option>
            </select>
            </div>
          </form>
  
          
      </div>

          <div className='p-5 flex justify-end'>
            <Button
                variant='destructive'
                onClick={onAddItem}>
                {t('Adicionar Pedido')}</Button>
          </div>
  
    </form>
  
  </Modal>

      <div className="flex items-center justify-between gap-y-2">
        <h1 className="text-gray-600 text-3xl font-bold">{t('Gestor de Pedidos')}</h1>
        <Button variant='destructive' onClick={() => {
          onAddItem();
          setShowAddItemModal(true);
        }}>
          {t('Adicionar Pedido')}
        </Button>
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
              {containers.map((container,containerIndex) => (
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
                        <div className="flex flex-col w-full items-start gap-y-4">
                        <h1 className="text-gray-800 text-3xl font-bold">{t('Alterar título')}</h1>
                            <Input
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
                        <div className="flex flex-col w-full items-start gap-y-4">
                          <h1 className="text-gray-800 text-3xl font-bold">
                          {t('Confirmar Exclusão ?')}
                          </h1>
                          <p>{t('Deseja mesmo excluir este pedido?')}</p>
                          <div className="flex gap-x-4">
                            <Button className="bg-red" onClick={handleConfirmDeleteItem}>{t('Sim')}</Button>
                            <Button className="bg-red"onClick={handleCancelDeleteItem}>{t('Cancelar')}</Button>
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
