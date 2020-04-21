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
import { columns } from '../../types';
import { SUPPLY_COLUMNS_MATCH } from '../../utils/constants';

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
  columnsOrder: columns,
  suppliesData: State['Source']['APU-Import-Supplies-in-App']['Aggs'][0]['Supplies'],
  onChangeSupplies: (supplyCell: string, supplyID: number) => (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const SuppliesTable: React.FunctionComponent<SuppliesTableProps> = ({
  suppliesData, onChangeSupplies, columnsOrder,
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
              columnsOrder.map((col, i) => (
                <TableCell className={classes.col} key={`${col[1]}-${String(i)}`}>{col[1]}</TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            suppliesData.map((supply, i) => (
              <TableRow className={classes.row} key={`${supply.SupplyID}-${String(i)}`}>
                {
                  columnsOrder.map((col, index) => (
                    <TableCell
                      key={`${col[1]}-${String(index)}}`}
                      className={classes.cell}
                    >
                      <Input
                        value={supply[SUPPLY_COLUMNS_MATCH[col[1]]]}
                        disableUnderline
                        onBlur={onBlurCell(`${supply.SupplyID}-${col[1]}`)}
                        onChange={onChangeSupplies(col[1], supply.SupplyID)}
                      />
                    </TableCell>
                  ))
                }
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SuppliesTable;
