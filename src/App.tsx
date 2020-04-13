import React, { useState, useEffect, Fragment } from 'react';
import { ARCASocket, State } from 'arca-redux';
import Loader from './components/Loader/Loader';

interface AppProps {
  socket: ARCASocket,
}

const App: React.FunctionComponent<AppProps> = ({
  socket,
}) => {
  const [apuRows, setApuRows] = useState(null);

  useEffect(() => {
    socket.store.subscribe(() => {
      const state: State = socket.store.getState();

      setApuRows(state.Source['APU-Import-Supplies-in-App']);
    });

    socket.Select('APU-Import-Supplies-in-App');
    socket.GetInfo('APU-Import-Supplies-in-App');
    socket.Subscribe('APU-Import-Supplies-in-App');
  }, [socket]);

  console.log(apuRows);

  return (
    <Fragment>
      {
        apuRows
          ? JSON.stringify(apuRows)
          : <Loader />
      }
    </Fragment>
  );
};

export default App;
