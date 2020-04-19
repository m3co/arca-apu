import React, { useState, useEffect } from 'react';
import { ARCASocket, State } from 'arca-redux';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Loader from '../components/Loader/Loader';
import Supplies from '../components/Supplies/Supplies';

interface AppProps {
  socket: ARCASocket,
}

const App: React.FunctionComponent<AppProps> = ({
  socket,
}) => {
  const [apuRows, setApuRows] = useState(null);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleExpandPanel = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    socket.store.subscribe(() => {
      const state: State = socket.store.getState();

      setApuRows(state.Source['APU-Import-Supplies-in-App']);
    });

    socket.Select('APU-Import-Supplies-in-App');
    socket.GetInfo('APU-Import-Supplies-in-App');
    socket.Subscribe('APU-Import-Supplies-in-App');
  }, [socket]);

  const getContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <Alert severity='warning'>
          <AlertTitle>Warning</AlertTitle>
          Tree component don&apos;t ready
        </Alert>
      </Grid>
      <Grid item xs={9}>
        {
          apuRows.Aggs.map((arg: State['Source']['APU-Import-Supplies-in-App']['Aggs'][0], i: number) => (
            <Supplies
              key={String(i)}
              suppliesData={arg}
              handleExpandPanel={handleExpandPanel(String(arg.APUID))}
              expanded={expanded}
            />
          ))
        }
      </Grid>
    </Grid>
  );

  return (
    <div className='page'>
      {
        apuRows && apuRows.Aggs
          ? getContent()
          : <Loader />
      }
    </div>
  );
};

export default App;
