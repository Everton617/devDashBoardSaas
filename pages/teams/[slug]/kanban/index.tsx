import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    pedido: string;
    status: string;
    horario: Date;
    entregador: string;
    onDelete: (id: UniqueIdentifier) => void;
  }[];
};

export default function Home() {

  const { t } = useTranslation('common');

  const [containers, setContainers] = useState<DNDType[]>([
    {
      id: `container-${uuidv4()}`,
      title: 'BackLog',
      items: [],
    },
    {
      id: `container-${uuidv4()}`,
      title: 'Em Processo',
      items: [],
    },
    {
      id: `container-${uuidv4()}`,
      title: 'Saiu para entrega',
      items: [],
    },
    {
      id: `container-${uuidv4()}`,
      title: 'Concluído',
      items: [],
    },

  ]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>();

  const [Pedido, setPedido] = useState('');
  const [Status, setStatus] = useState('');
  const [Horario, setHorario] = useState('');
  const [Entregador, setEntregador] = useState('');

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [showTitleModal, setShowTitleModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const [itemIdToDelete, setItemIdToDelete] = useState<UniqueIdentifier | null>(null);
 
  const [showAddItemModal, setShowAddItemModal] = useState(false);


  const [activeContainerIndex] = useState<number | null>(null);




  

  const onAddItem = () => {
    if (!Pedido) return;
    const id = `item-${uuidv4()}`;
    const container = containers.find((item) => item.id === currentContainerId);
    if (!container) return;
    container.items.push({
      id,
      pedido: Pedido,
      status: Status,
      horario: new Date(),
      entregador: Entregador,
      onDelete: handleDeletePedido,
    });

    setContainers([...containers]);
    setPedido('');
    setStatus('');
    setHorario('');
    setEntregador('');
    setShowAddItemModal(false);
  };

  const handleDeletePedido = (id: UniqueIdentifier) => {
    setItemIdToDelete(id); // Definir o item a ser excluído
    setShowDeleteConfirmation(true); // Mostrar o modal de confirmação
  };
  
  const handleConfirmDeleteItem = () => {
    if (itemIdToDelete) {
      setContainers(prevContainers =>
        prevContainers.map(container => ({
          ...container,
          items: container.items.filter(item => item.id !== itemIdToDelete)
        }))
      );
      setShowDeleteConfirmation(false);
      setItemIdToDelete(null);
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

 
   

  return (
    <div className="mx-auto max-w-9xl py-10 ">
      {/* Add Container Modal */}
      
      {/* Add Item Modal */}
      <Modal 
      showModal={showAddItemModal}
      setShowModal={setShowAddItemModal}
      currentContainerId={currentContainerId}>

        <div className="flex flex-col w-full items-start gap-y-3">
          <h1 className="text-gray-800 text-2xl font-bold">{t('Adicionar Pedido')}</h1>
          
          <label>{t('Pedido: ')}</label>
          <Input
            type="text"
            placeholder="Insira o número do seu pedido"
            name="pedido"
            value={Pedido}
            onChange={(e) => setPedido(e.target.value)}
          />
          
          <label>{t('Entregador: ')}</label>
          <Input
            type="text"
            placeholder="Insira o nome do entregador"
            name="entregador"
            value={Entregador}
            onChange={(e) => setEntregador(e.target.value)}
          />

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

          <Button  variant='destructive'  onClick={onAddItem}>{t('Adicionar Pedido')}</Button>
        </div>
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
                     pedido={i.pedido} 
                     id={i.id} 
                     horario={i.horario}
                     entregador={i.entregador}
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