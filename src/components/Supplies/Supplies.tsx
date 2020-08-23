import React, { Fragment, useState } from 'react';
import toString from 'lodash/toString';
import { APUImportSuppliesInApp, Row } from 'arca-redux-v4';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import PublishIcon from '@material-ui/icons/Publish';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Input from '@material-ui/core/Input';
import SuppliesTable from '../SuppliesTable/SuppliesTable';
import { columns } from '../../types';
import { COLUMNS } from '../../utils/constants';
import { parseToNumber, parseToDotsFormat } from '../../utils';
import { socket } from '../../redux/store';

const useStyles = makeStyles({
  card: {
    marginBottom: 32,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  titleInput: {
    marginBottom: 5,
    '&:after': {
      borderColor: '#61dafb',
    },
  },
  titleDivider: {
    marginTop: 15,
  },
  titleButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  titleButtonsCancel: {
    marginRight: 15,
  },
  ExpansionPanel: {
    boxShadow: 'none',
    '&:before': {
      content: 'none',
    },
  },
  importButton: {
    paddingLeft: 16,
    fontWeight: 500,
  },
  icon: {
    color: '#61dafb',
  },
  dropPlace: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '16px 0',
    border: '2px dashed #e0e0e0',
    backgroundColor: '#f7f7f7',
    color: '#e0e0e0',
    fontSize: 64,
    fontWeight: 900,
    cursor: 'pointer',
  },
  expansionPanelTable: {
    padding: 0,
    flexDirection: 'column',
  },
  submitButton: {
    color: '#61dafb',
  },
  editTitleButton: {
    marginLeft: 10,
    '&:hover': {
      color: '#61dafb',
    },
  },
});

interface SuppliesProps {
  suppliesData: APUImportSuppliesInApp['Agg'],
  handleExpandPanel: (event: React.ChangeEvent<{}>, isExpanded: boolean) => void,
  expanded: boolean | string,
  columnsOrder: columns,
}

const Supplies: React.FunctionComponent<SuppliesProps> = ({
  suppliesData, handleExpandPanel, expanded, columnsOrder,
}) => {
  const {
    Key, Constraint, Description, Unit, P, Estimated, Price, APUID,
  } = suppliesData;

  const classes = useStyles();
  const [pastedSupplies, setPastedSupplies] = useState([]);
  const [isEditTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState({
    Description, Unit, P, Estimated,
  });
  const [supplies, setSupplies] = useState(suppliesData.Supplies);

  const toggleEditTitle = () => {
    setEditTitle(!isEditTitle);
  };

  const onCancel = () => {
    setTitle({
      Description, Unit, P, Estimated,
    });
    toggleEditTitle();
  };

  const onSave = () => {
    socket.update('APU', ({
      ID: APUID,
      Description: title.Description,
      Unit: title.Unit,
      P: title.P,
      Estimated: title.Estimated,
    } as Row), { ID: APUID });
    toggleEditTitle();
  };

  const onChangeTitle = (titleItem: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const parsedValue = value.includes('$') ? parseToNumber(value) : value;

    setTitle({
      ...title,
      [titleItem]: parsedValue,
    });
  };

  const onChangeSupplies = (supplyCell: string, supplyID: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const parsedValue = value.includes('$') ? parseToNumber(value) : value;

    setSupplies(supplies.map(supply => {
      if (supply.SupplyID === supplyID) {
        return { ...supply, [supplyCell]: parsedValue };
      }
      return supply;
    }));
  };

  const onChangePastedSupplies = (supplyCell: string, supplyID: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const parsedValue = value.includes('$') ? parseToNumber(value) : value;

    setPastedSupplies(pastedSupplies.map(supply => {
      if (supply.SupplyID === supplyID) {
        return { ...supply, [supplyCell]: parsedValue };
      }
      return supply;
    }));
  };

  const onPaste = (event: ClipboardEvent) => {
    const pasted = event.clipboardData
      .getData('text') // get Data from ctrl + v
      .split(/[\n\r]/) // create Array<string> where string is row of data
      .filter(row => row !== '') // remove empty rows
      .map((row, id) => { // create Array<object> where object is supplies
        const cells = row.split(/[\t]/);

        const indexes = COLUMNS.map(COLUMN => columnsOrder.findIndex(column => column[1] === COLUMN));

        return {
          SupplyID: id,
          OwnerID: id,
          P: Number(cells[indexes[4]]),
          Description: cells[indexes[1]],
          Unit: cells[indexes[2]],
          Type: cells[indexes[0]],
          Estimated: Number(cells[indexes[3]]),
          ContractorID: id,
        };
      });

    setPastedSupplies(pasted);
    document.removeEventListener('paste', onPaste);
  };

  const onExpand = (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    document.removeEventListener('paste', onPaste);
    handleExpandPanel(event, isExpanded);
    document.addEventListener('paste', onPaste);
  };

  const onSubmit = () => {
    pastedSupplies.forEach(row => {
      const rowToImport = {
        APUID: suppliesData.APUID,
        OwnerID: 1,
        P: row.P,
        Description: row.Description,
        Unit: row.Unit,
        Type: row.Type,
        Estimated: row.Estimated,
      };

      socket.insert('APU-Import-Supplies', rowToImport);
    });

    setPastedSupplies([]);
    document.addEventListener('paste', onPaste);
  };

  return (
    <Card className={classes.card} variant='outlined'>
      <CardContent className={classes.cardContent}>
        {
          isEditTitle
            ? (
              <>
                <Typography variant='h6' component='h2'>
                  {`${Key}`}
                </Typography>
                <Typography variant='h6' component='h2'>
                  {`${Constraint}`}
                </Typography>
                <Input
                  className={classes.titleInput}
                  value={title.Description}
                  onChange={onChangeTitle('Description')}
                  placeholder='Description'
                />
                <Input
                  className={classes.titleInput}
                  value={toString(title.Unit)}
                  onChange={onChangeTitle('Unit')}
                  placeholder='Unit'
                />
                <Input
                  className={classes.titleInput}
                  value={title.P}
                  onChange={onChangeTitle('P')}
                  placeholder='P'
                />
                {
                  suppliesData.Supplies.length
                    ? (
                      <Typography variant='h6' component='h2'>
                        {`${parseToDotsFormat(String(title.Estimated))}`}
                      </Typography>
                    )
                    : (
                      <Input
                        className={classes.titleInput}
                        value={parseToDotsFormat(String(title.Estimated))}
                        onChange={onChangeTitle('Estimated')}
                        placeholder='Estimated'
                      />
                    )
                }
                <Typography variant='h6' component='h2'>
                  {`${toString(Price)}`}
                </Typography>
                <div className={classes.titleButtons}>
                  <Button
                    className={classes.titleButtonsCancel}
                    variant='contained'
                    size='small'
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    size='small'
                    onClick={onSave}
                  >
                    Save
                  </Button>
                </div>
                <Divider className={classes.titleDivider} />
              </>
            )
            : (
              <Typography variant='h6' component='h2'>
                {`${Key} ${Constraint} ${Description} ${toString(Unit)} ${P} ${Price || Estimated}`}
                <IconButton
                  onClick={toggleEditTitle}
                  className={classes.editTitleButton}
                  aria-label='edit title'
                  component='span'
                >
                  <EditIcon />
                </IconButton>
              </Typography>
            )
        }
      </CardContent>
      {
        supplies.length
          ? <SuppliesTable suppliesData={supplies} onChangeSupplies={onChangeSupplies} columnsOrder={columnsOrder} />
          : <Divider />
      }
      <ExpansionPanel className={classes.ExpansionPanel} onChange={onExpand} expanded={expanded === String(APUID)}>
        <ExpansionPanelSummary
          className={classes.importButton}
          expandIcon={<PublishIcon className={classes.icon} />}
        >
          Import
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={pastedSupplies.length ? classes.expansionPanelTable : ''}>
          {
            !pastedSupplies.length
              ? (
                <Paper
                  className={classes.dropPlace}
                  elevation={0}
                >
                  <span>CTRL + V</span>
                </Paper>
              )
              : (
                <Fragment>
                  <SuppliesTable
                    suppliesData={pastedSupplies}
                    onChangeSupplies={onChangePastedSupplies}
                    columnsOrder={columnsOrder}
                  />
                  <Button onClick={onSubmit} className={classes.submitButton}>Submit</Button>
                </Fragment>
              )
          }
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Card>
  );
};

export default Supplies;
