import app from '@/lib/app';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  heading?: string;
  description?: string;
}

export default function AuthLayout({
  children,
  heading,
  description,
}: AuthLayoutProps) {
  const { t } = useTranslation('common');

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            src={app.logoUrl}
            className="mx-auto h-22"
            alt={app.name}
            width={130}
            height={70}
          />
          {heading && (
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-red-500">
              {t(heading)}
            </h2>
          )}
          {description && (
            <p className="text-center text-red-500 dark:text-white">
              {t(description)}
            </p>
          )}
        </div>
        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">{children}</div>
      </div>
    </>
  );
}
