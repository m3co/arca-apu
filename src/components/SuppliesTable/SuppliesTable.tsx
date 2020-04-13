import React from 'react';
import { State } from 'arca-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

interface SuppliesTableProps {
  suppliesData: State['Source']['APU-Import-Supplies-in-App']['Aggs'][0]['Supplies'],
}

const SuppliesTable: React.FunctionComponent<SuppliesTableProps> = ({
  suppliesData,
}) => (
  <TableContainer component={Paper}>
    <Table size='small'>
      <TableHead>
        <TableRow>
          <TableCell>Type</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Unit</TableCell>
          <TableCell>Estimated</TableCell>
          <TableCell>P</TableCell>
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

export default SuppliesTable;
