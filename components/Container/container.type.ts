import { UniqueIdentifier } from '@dnd-kit/core';

export default interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title?: string;
  description?: string;
  onAddItem: (data: any) => Promise<void>;
  onClickEdit: (id: UniqueIdentifier) => void;
}
