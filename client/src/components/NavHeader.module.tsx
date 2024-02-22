import React, { useState } from 'react';
import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

const items: MenuProps['items'] = [
    {
        label: '投资汇总',
        key: 'invest',
        icon: <AppstoreOutlined />,
    },
    {
        label: '设置',
        key: 'setting',
        icon: <SettingOutlined />
    }
];

// 定义组件的props类型
interface NavHeaderProps {
    className?: string;
    // items: MenuProps['items']; // 假设你需要从外部传入items
  }

const NavHeader: React.FC<NavHeaderProps> = ({className}) => {
    const [current, setCurrent] = useState('mail');

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    return (
        <div>
            <Menu className={className} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} /> 
        </div>
    );
};

export default NavHeader;