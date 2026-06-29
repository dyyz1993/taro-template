import { useState, useCallback } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Loading } from '@/components/Loading';
import { Spacer } from '@/components/Spacer';
import { dbQuery, dbAdd, dbUpdate, dbDelete } from '@/utils/cloud';
import { toast } from '@/utils/wxapi';
import './index.scss';

interface Todo {
  _id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

export default function Demo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 查询：调用 dbQuery（H5 端走 localStorage mock，weapp 端走云函数）
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await dbQuery<Todo>('todos');
      setTodos(list);
    } catch (e) {
      console.error('[demo] query failed', e);
      toast('查询失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 首次进入自动加载
  useState(() => {
    refresh();
  });

  // 新增
  const handleAdd = async () => {
    const text = input.trim();
    if (!text) return toast('请输入内容');
    try {
      await dbAdd<Todo>('todos', { text, done: false });
      setInput('');
      toast('已添加', 'success');
      refresh();
    } catch (e) {
      console.error('[demo] add failed', e);
      toast('添加失败');
    }
  };

  // 切换完成状态
  const handleToggle = async (id: string, done: boolean) => {
    try {
      await dbUpdate('todos', { _id: id }, { done: !done });
      refresh();
    } catch (e) {
      console.error('[demo] update failed', e);
    }
  };

  // 删除
  const handleDelete = async (id: string) => {
    try {
      await dbDelete('todos', { _id: id });
      toast('已删除', 'success');
      refresh();
    } catch (e) {
      console.error('[demo] delete failed', e);
    }
  };

  const doneCount = todos.filter(t => t.done).length;

  return (
    <View className='page-demo'>
      <NavBar title='Todo 示例（数据层）' showBack={false} />
      <View className='page-demo__body'>
        <View className='page-demo__intro'>
          <Text className='page-demo__intro-text'>
            此页演示 cloud.ts 的 CRUD 全链路。H5 端走 localStorage mock，
            weapp 端走云函数（需先 initCloud + 部署 db 云函数）。
          </Text>
        </View>

        <View className='page-demo__input-row'>
          <Input
            className='page-demo__input'
            value={input}
            placeholder='输入待办事项...'
            onInput={e => setInput(e.detail.value)}
            confirmType='done'
            onConfirm={handleAdd}
          />
          <Button type='primary' size='md' onClick={handleAdd}>添加</Button>
        </View>

        <View className='page-demo__stat'>
          <Text>共 {todos.length} 项 · 已完成 {doneCount} 项</Text>
          <Text className='page-demo__refresh' onClick={refresh}>刷新</Text>
        </View>

        {loading && todos.length === 0 ? (
          <View className='page-demo__loading'><Loading text='加载中...' /></View>
        ) : todos.length === 0 ? (
          <EmptyState title='还没有待办' desc='添加第一条试试' />
        ) : (
          <ScrollView scrollY className='page-demo__list'>
            {todos.map(todo => (
              <View key={todo._id} className={`todo-item ${todo.done ? 'todo-item--done' : ''}`}>
                <View className='todo-item__check' onClick={() => handleToggle(todo._id, todo.done)}>
                  <Text className={`todo-item__checkbox ${todo.done ? 'is-checked' : ''}`}>
                    {todo.done ? '✓' : ''}
                  </Text>
                </View>
                <Text className='todo-item__text'>{todo.text}</Text>
                <View className='todo-item__del' onClick={() => handleDelete(todo._id)}>
                  <Text className='todo-item__del-text'>删除</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
        <Spacer height={48} />
      </View>
    </View>
  );
}
