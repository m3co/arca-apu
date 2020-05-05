import React from 'react';
import { State } from 'arca-redux';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import { columns } from '../../types';
import { COLUMNS, SUPPLY_COLUMNS_MATCH } from '../../utils/constants';
import { parseToDotsFormat, parseToNumber } from '../../utils';
import { socket } from '../../redux/store';

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

  const onBlurCell = (supplyId: number, cell: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const changedSupply = suppliesData.find(supply => supply.SupplyID === supplyId);
    const row = {
      ...changedSupply,
      ID: changedSupply.SupplyID,
      [cell]: cell === SUPPLY_COLUMNS_MATCH.Precio ? parseToNumber(event.target.value) : event.target.value,
    };

    socket.Update('APU-MetaSupplies', row, {
      ID: uuidv4(),
      PK: {
        ID: changedSupply.SupplyID,
      },
    });
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
                  columnsOrder.map((col, index) => {
                    const value = supply[SUPPLY_COLUMNS_MATCH[col[1]]];
                    const parsedValue = col[1] === COLUMNS[3] ? parseToDotsFormat(String(value)) : value;

                    return (
                      <TableCell
                        key={`${col[1]}-${String(index)}}`}
                        className={classes.cell}
                      >
                        <Input
                          value={parsedValue}
                          disableUnderline
                          onBlur={onBlurCell(supply.SupplyID, SUPPLY_COLUMNS_MATCH[col[1]])}
                          onChange={onChangeSupplies(SUPPLY_COLUMNS_MATCH[col[1]], supply.SupplyID)}
                        />
                      </TableCell>
                    );
                  })
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
