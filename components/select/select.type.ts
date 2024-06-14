export default interface SelectProps {
    children?: React.ReactNode;
    name: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  }
  