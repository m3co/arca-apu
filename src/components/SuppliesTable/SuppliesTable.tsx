import React from 'react';
import { State } from 'arca-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { COLUMNS } from '../../utils/constants';

const useStyles = makeStyles({
  col: {
    textTransform: 'capitalize',
  },
});

interface SuppliesTableProps {
  suppliesData: State['Source']['APU-Import-Supplies-in-App']['Aggs'][0]['Supplies'],
}

const SuppliesTable: React.FunctionComponent<SuppliesTableProps> = ({
  suppliesData,
}) => {
  const classes = useStyles();

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
              <TableRow key={`${supply.SupplyID}-${String(i)}`}>
                <TableCell>{supply.Type}</TableCell>
                <TableCell>{supply.Description}</TableCell>
                <TableCell>{supply.Unit}</TableCell>
                <TableCell>{supply.Estimated}</TableCell>
                <TableCell>{supply.P}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SuppliesTable;
