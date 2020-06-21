import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });

  // 单独拆分 fetchData
  const fetchData = async () => {
    const result = await axios(
      'http://hn.algolia.com/api/v1/search?query=redux',
    );

    setData(result.data);
  };
  // 单独拆分 fetchData 的原因是： 上面的 waring 部分，不推荐把 async 写在 effect 中

  useEffect(() => {
    fetchData();
  }, []);
  // 这里的第二个参数： 是 hooks 来观测数值的变化
  // 这里添加 []，当我们的组件更新的时候回去观测 effect 的值是否有变化，这里添加空 [] ，是为了防止 hooks 再一次运行。

  return (
    <ul>
      {data.hits.map(item => (
        // <li key={item.objectID}>
        //   <a href={item.url}>{item.title}</a>
        // </li>
      <div>{item}</div>
      ))}
    </ul>
  );
}

export default App;
