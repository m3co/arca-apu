import React, { Fragment, useState } from 'react';
import { State } from 'arca-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import PublishIcon from '@material-ui/icons/Publish';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SuppliesTable from '../SuppliesTable/SuppliesTable';

const useStyles = makeStyles({
  card: {
    marginBottom: 32,
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
});

interface SuppliesProps {
  suppliesData: State['Source']['APU-Import-Supplies-in-App']['Aggs'][0],
}

const Supplies: React.FunctionComponent<SuppliesProps> = ({
  suppliesData,
}) => {
  const classes = useStyles();
  const [pastedSupplies, setPastedSupplies] = useState([]);
  const [supplies, setSupplies] = useState(suppliesData.Supplies);

  const {
    Key, Constraint, Description, Unit, P, Estimated, Price,
  } = suppliesData;

  const onChangeSupplies = (supplyCell: string, supplyID: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSupplies(supplies.map(supply => {
      if (supply.SupplyID === supplyID) {
        return { ...supply, [supplyCell]: event.target.value };
      }
      return supply;
    }));
  };

  const onChangePastedSupplies = (supplyCell: string, supplyID: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPastedSupplies(pastedSupplies.map(supply => {
      if (supply.SupplyID === supplyID) {
        return { ...supply, [supplyCell]: event.target.value };
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

        return {
          SupplyID: id,
          OwnerID: id,
          P: Number(cells[4]),
          Description: cells[1],
          Unit: cells[2],
          Type: cells[0],
          Estimated: Number(cells[3]),
          ContractorID: id,
        };
      });

    setPastedSupplies(pasted);
    document.removeEventListener('paste', onPaste);
  };

  const onExpand = () => {
    document.addEventListener('paste', onPaste);
  };

  const onSubmit = () => {
    setPastedSupplies([]);
    document.addEventListener('paste', onPaste);
  };

  return (
    <Fragment>
      <Card className={classes.card} variant='outlined'>
        <CardContent>
          {`${Key} ${Constraint} ${Description} ${Unit} ${P} ${Price || Estimated}`}
        </CardContent>
        <SuppliesTable suppliesData={supplies} onChangeSupplies={onChangeSupplies} />
        <ExpansionPanel className={classes.ExpansionPanel} onChange={onExpand}>
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
                    <SuppliesTable suppliesData={pastedSupplies} onChangeSupplies={onChangePastedSupplies} />
                    <Button onClick={onSubmit} className={classes.submitButton}>Submit</Button>
                  </Fragment>
                )
            }
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Card>
    </Fragment>
  );
};

export default Supplies;
