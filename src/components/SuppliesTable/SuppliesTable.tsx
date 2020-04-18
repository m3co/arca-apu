import React from 'react';
import { State } from 'arca-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import { COLUMNS } from '../../utils/constants';

const useStyles = makeStyles({
  col: {
    textTransform: 'capitalize',
  },
  row: {
    // cursor: 'copy',
  },
  cell: {
    '&:hover': {
      backgroundColor: '#f7f7f7',
    },
  },
});

interface SuppliesTableProps {
  suppliesData: State['Source']['APU-Import-Supplies-in-App']['Aggs'][0]['Supplies'],
  onChangeSupplies: (supplyCell: string, supplyID: number) => (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const SuppliesTable: React.FunctionComponent<SuppliesTableProps> = ({
  suppliesData, onChangeSupplies,
}) => {
  const classes = useStyles();

  const onBlurCell = (cell: string) => () => {
    console.log('blur', cell);
  };

  return (
    <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow>
            {
              COLUMNS.map(col => (
                <TableCell className={classes.col} key={col}>{col}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            suppliesData.map((supply, i) => (
              <TableRow className={classes.row} key={`${supply.SupplyID}-${String(i)}`}>
                <TableCell
                  className={classes.cell}
                >
                  <Input
                    value={supply.Type}
                    disableUnderline
                    onBlur={onBlurCell(`${supply.SupplyID}-Type`)}
                    onChange={onChangeSupplies('Type', supply.SupplyID)}
                  />
                </TableCell>
                <TableCell
                  className={classes.cell}
                >
                  <Input
                    value={supply.Description}
                    disableUnderline
                    onBlur={onBlurCell(`${supply.SupplyID}-Description`)}
                    onChange={onChangeSupplies('Description', supply.SupplyID)}
                  />
                </TableCell>
                <TableCell
                  className={classes.cell}
                >
                  <Input
                    value={supply.Unit}
                    disableUnderline
                    onBlur={onBlurCell(`${supply.SupplyID}-Unit`)}
                    onChange={onChangeSupplies('Unit', supply.SupplyID)}
                  />
                </TableCell>
                <TableCell
                  className={classes.cell}
                >
                  <Input
                    value={supply.Estimated}
                    disableUnderline
                    onBlur={onBlurCell(`${supply.SupplyID}-Estimated`)}
                    onChange={onChangeSupplies('Estimated', supply.SupplyID)}
                  />
                </TableCell>
                <TableCell
                  className={classes.cell}
                >
                  <Input
                    value={supply.P}
                    disableUnderline
                    onBlur={onBlurCell(`${supply.SupplyID}-P`)}
                    onChange={onChangeSupplies('P', supply.SupplyID)}
                  />
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SuppliesTable;
