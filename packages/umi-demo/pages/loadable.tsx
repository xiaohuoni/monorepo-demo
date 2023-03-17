import Loadable from 'react-loadable';

const Button = Loadable({
  loader: async () => {
    const antd = await import(/* webpackChunkName: "antd" */ 'antd/lib/button');
    return antd;
  },
  loading: () => <div>Loading...</div>,
});

export default function HomePage() {
  return (
    <div>
      <Button>test</Button>
    </div>
  );
}
