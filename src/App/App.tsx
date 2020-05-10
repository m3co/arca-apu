import React, { useState, useEffect } from 'react';
import { ARCASocket, State } from 'arca-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';
import Collapse from '@material-ui/core/Collapse';
import Loader from '../components/Loader/Loader';
import Supplies from '../components/Supplies/Supplies';
import Settings from '../components/Settings/Settings';
import { columns } from '../types';
import Tree from '../components/Tree/Tree';

const useStyles = makeStyles({
  topBarWrap: {
    marginTop: 12,
  },
  topBar: {
    padding: '6px 16px;',
  },
  topBarRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  settingsIcon: {
    color: '#61dafb',
    '&:hover': {
      opacity: '0.7',
      cursor: 'pointer',
    },
  },
});

interface AppProps {
  socket: ARCASocket,
}

const App: React.FunctionComponent<AppProps> = ({
  socket,
}) => {
  const classes = useStyles();
  const [apuRows, setApuRows] = useState(null);
  const [tree, setTree] = useState(null);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [isShowSettings, setIsShowSettings] = useState<boolean>(false);
  const [columnsOrder, setColumnsOrder] = useState<columns>([[0, 'Tipo'], [1, 'Descripcion'], [2, 'Unidad'], [3, 'Precio'], [4, 'Rdto']]);

  const handleExpandPanel = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const toggleSettings = () => {
    setIsShowSettings(!isShowSettings);
  };

  const handleColumnsOrder = (order: number) => (event: React.ChangeEvent<{ value: unknown }>) => {
    const newColumnsOreder: columns = columnsOrder.map((column): columns[0] => {
      if (column[0] === order) {
        return [order, String(event.target.value)];
      }

      return column;
    });

    setColumnsOrder(newColumnsOreder);
  };

  useEffect(() => {
    socket.store.subscribe(() => {
      const state: State = socket.store.getState();

      setApuRows(state.Source['APU-Import-Supplies-in-App']);
      setTree(state.Source['AAU-APU-in-App'].Rows);
    });

    socket.Subscribe('APU-Import-Supplies-in-App');

    socket.GetInfo('APU-MetaSupplies');

    socket.Select('AAU-APU-in-App');
  }, [socket]);

  const getContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} className={classes.topBarWrap}>
        <Card variant='outlined' className={classes.topBar}>
          <Grid container>
            <Grid item xs={3}>
              <Typography variant='h6' component='h1'>
                Arca APU
              </Typography>
            </Grid>
            <Grid item xs={9} className={classes.topBarRight}>
              <SettingsIcon className={classes.settingsIcon} onClick={toggleSettings} />
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <Collapse in={isShowSettings}>
                  <Settings onChangeColumns={handleColumnsOrder} columns={columnsOrder} />
                </Collapse>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={3}>
        { tree && tree.length ? <Tree treeItems={tree} socket={socket} /> : null }
      </Grid>
      <Grid item xs={9}>
        {
          apuRows.Aggs.map((arg: State['Source']['APU-Import-Supplies-in-App']['Aggs'][0], i: number) => (
            <Supplies
              key={String(i)}
              suppliesData={arg}
              handleExpandPanel={handleExpandPanel(String(arg.APUID))}
              expanded={expanded}
              columnsOrder={columnsOrder}
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
