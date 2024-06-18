export default interface InputProps {
  variant?: 'default';
  size?: 'default' | 'sm' | 'md' | 'flex';
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
