import { OutputNodeContent, SymbolMasterDefinition } from '@/types/flow';

import Highlighter from '@/components/Highlighter';
import { fetchNetworkServe } from '@/services/networkServe';
import lodashGet from 'lodash.get';
import Output from './Preview';
import Render from './Render';

export const OutputSymbol: SymbolMasterDefinition<OutputNodeContent> = {
  id: 'network',
  title: '网络节点',
  avatar: '🔗',
  description: '将接受到的结果输出到服务器',
  preview: Output,
  render: Render,
  defaultContent: {
    url: 'https://www.xxx.com/api',
    data: '{"images":"{images}","text":"{text}"}',
  },
  run: async (node, vars, { updateParams }) => {
    let data: Record<string, any> = {};
    Object.keys(JSON.parse(node.data)).forEach((key) => {
      data[key] = lodashGet(vars, key);
    });

    const params = { ...node, data: JSON.stringify(data) };
    updateParams(params);

    const res = (await fetchNetworkServe({
      ...node,
      data: JSON.stringify(data),
    })) as unknown as {
      message: string;
    };

    return {
      type: 'text',
      output: JSON.stringify(res, null, 2),
    };
  },
  outputRender: (output: string) => {
    return <Highlighter language="json">{output}</Highlighter>;
  },
};