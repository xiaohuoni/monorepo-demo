import React, { Suspense } from 'React';

const Button = React.lazy(async () => {
  const antd = await import(/* webpackChunkName: "antd" */ 'antd/lib/button');
  return antd;
});

export default function HomePage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Button>test</Button>
      </Suspense>
    </div>
  );
}
