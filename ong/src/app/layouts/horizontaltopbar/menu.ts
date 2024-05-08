import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        link: '/',
    },
    {
        id: 2,
        label: 'MENUITEMS.UIELEMENTS.TEXT',
        icon: 'bx bx-package',
        subItems: [
            {
                id: 2.1,
                label: 'MENUITEMS.UIELEMENTS.LIST.ALERTS',
                link: '/ong-conforme/gerenciador',
                parentId: 2
            },
            {
                id: 2.2,
                label: 'MENUITEMS.UIELEMENTS.LIST.HISTORICO',
                link: '/ong-conforme/historico',
                parentId: 2
            }
        ]
    },
    {
        id: 3,
        label: 'MENUITEMS.FAMILIAS.TEXT',
        icon: 'bx bxs-group',
        subItems: [
            {
                id: 3.1,
                label: 'MENUITEMS.FAMILIAS.LIST.GERENCIAR',
                link: '/ong-conforme/familia-dashboard',
                parentId: 3
            }
        ]
    }
];

