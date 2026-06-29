import { View, Text } from '@tarojs/components';
import { NavBar } from '@/components/NavBar';
import { Button, PrimaryButton, SecondaryButton } from '@/components/Button';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { Spacer } from '@/components/Spacer';
import { EmptyState } from '@/components/EmptyState';
import { toast } from '@/utils/wxapi';
import './index.scss';

// 展示用的图标清单（与 Icon 组件 SVG_PATHS 对应）
const ICON_LIST = [
  'home', 'user', 'search', 'settings', 'bell', 'heart', 'star', 'tag',
  'plus', 'edit', 'trash-2', 'check', 'x', 'info', 'alert-circle', 'help-circle',
  'mail', 'phone', 'map-pin', 'image', 'lock', 'inbox', 'menu', 'refresh'
];

export default function Index() {
  return (
    <View className='page-index'>
      <NavBar title='Taro Template' showBack={false} />
      <View className='page-index__body'>
        <View className='page-index__hero'>
          <Text className='page-index__hero-title'>Taro 4 + React + TS</Text>
          <Text className='page-index__hero-sub'>跨端（weapp + H5）前端骨架模板</Text>
        </View>

        {/* Button 组件 */}
        <Card title='Button 按钮'>
          <View className='demo-row'>
            <Button type='primary' size='md' onClick={() => toast('primary')}>主按钮</Button>
            <Button type='secondary' size='md' onClick={() => toast('secondary')}>次按钮</Button>
            <Button type='danger' size='md' onClick={() => toast('danger')}>危险</Button>
            <Button type='ghost' size='md' onClick={() => toast('ghost')}>幽灵</Button>
          </View>
          <Spacer height={16} />
          <View className='demo-row'>
            <Button type='primary' size='sm'>小</Button>
            <Button type='primary' size='md'>中</Button>
            <Button type='primary' size='lg' block>大（block）</Button>
          </View>
        </Card>

        <Spacer height={24} />

        {/* Icon 组件 */}
        <Card title='Icon 图标（点击切到示例 Tab 看数据层）'>
          <View className='icon-grid'>
            {ICON_LIST.map(name => (
              <View key={name} className='icon-grid__item'>
                <Icon name={name} size={40} color='#1A1A1A' />
                <Text className='icon-grid__label'>{name}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Spacer height={24} />

        {/* EmptyState 组件 */}
        <Card title='EmptyState 空状态'>
          <EmptyState title='暂无内容' desc='这是一个空状态示例' />
        </Card>

        <Spacer height={24} />

        {/* 组合演示 */}
        <Card title='组合用法'>
          <PrimaryButton block onClick={() => toast('PrimaryButton block')}>PrimaryButton block</PrimaryButton>
          <Spacer height={12} />
          <SecondaryButton block onClick={() => toast('SecondaryButton block')}>SecondaryButton block</SecondaryButton>
        </Card>

        <Spacer height={48} />
        <Text className='page-index__footer'>切到「示例」Tab 体验数据层（Todo CRUD）</Text>
      </View>
    </View>
  );
}
