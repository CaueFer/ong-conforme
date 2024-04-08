import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
    },
    {
        id: 7,
        label: 'MENUITEMS.UIELEMENTS.TEXT',
        icon: 'bx-tone',
        subItems: [
            {
                id: 8,
                label: 'MENUITEMS.UIELEMENTS.LIST.ALERTS',
                link: '/',
                parentId: 7
            },
            {
                id: 9,
                label: 'MENUITEMS.UIELEMENTS.LIST.HISTORICO',
                link: '/',
                parentId: 7
            }
        ]
    }
];

