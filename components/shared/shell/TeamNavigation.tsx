import { Cog6ToothIcon, CodeBracketIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import NavigationItems from './NavigationItems';
import { NavigationProps, MenuItem } from './NavigationItems';

interface NavigationItemsProps extends NavigationProps {
  slug: string;
}

const TeamNavigation = ({ slug, activePathname }: NavigationItemsProps) => {
  const { t } = useTranslation('common');

  const menus: MenuItem[] = [
    {
      name: t('all-products'),
      href: `/teams/${slug}/products`,
      icon: CodeBracketIcon,
      active: activePathname === `/teams/${slug}/products`,
    },
    {
      name: t('Gestor de Pedidos'),
      href: `/teams/${slug}/kanban`,
      icon: BuildingStorefrontIcon,
      active: activePathname === `/teams/${slug}/kanban`,
    },
    {
      name: t('Configurações'),
      href: `/teams/${slug}/settings`,
      icon: Cog6ToothIcon,
      active: activePathname === `/teams/${slug}/settings`,
    },
  ];

  return <NavigationItems menus={menus} />;
};

export default TeamNavigation;
