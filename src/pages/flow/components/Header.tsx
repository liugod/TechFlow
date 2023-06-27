import { PlayCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTheme } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import AgentAvatar from '@/components/AgentAvatar';
import { ControlInput } from '@/components/ControlInput';
import { hasFlowRunner } from '@/helpers/flow';
import { flowSelectors, useFlowStore } from '@/store/flow';

const Header = memo(() => {
  const [id, title, avatar, isTaskEmpty, runningTask, runFlow, dispatchFlow] = useFlowStore((s) => {
    const flow = flowSelectors.currentFlowSafe(s);
    const meta = flowSelectors.currentFlowMeta(s);
    return [
      flow.id,
      meta.title,
      meta.avatar,
      !hasFlowRunner(flow.flattenEdges),
      flow.state.runningTask,
      s.runFlow,
      s.dispatchFlow,
    ];
  }, shallow);

  const theme = useTheme();
  return (
    <Flexbox
      horizontal
      align={'center'}
      distribution={'space-between'}
      padding={8}
      paddingInline={16}
      style={{
        borderBottom: `1px solid ${theme.colorBorderDivider}`,
        gridArea: 'header',
      }}
    >
      <Flexbox horizontal align={'center'}>
        <AgentAvatar size={32} avatar={avatar} title={title} />
        <ControlInput
          bordered={false}
          value={title}
          onChange={(e) => {
            dispatchFlow({
              type: 'updateFlowMeta',
              id,
              meta: { title: e },
            });
          }}
        />
      </Flexbox>
      <Flexbox>
        <Button
          type={'primary'}
          disabled={isTaskEmpty}
          loading={runningTask}
          onClick={runFlow}
          icon={<PlayCircleOutlined />}
        >
          运 行
        </Button>
      </Flexbox>
    </Flexbox>
  );
});

export default Header;