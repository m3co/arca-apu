import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { COLUMNS, COLUMNS_ORDER } from '../../utils/constants';
import { columns } from '../../types';

const useStyles = makeStyles({
  divider: {
    margin: '6px 0',
  },
  title: {
    marginBottom: 12,
  },
  selectWrap: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  formControl: {
    flex: 1,
    '&:not(:last-child)': {
      marginRight: 5,
    },
  },
});

interface SettingsProps {
  columns: columns,
  onChangeColumns: (order: number) => (event: React.ChangeEvent<{ value: unknown }>) => void,
}

const Settings: React.FunctionComponent<SettingsProps> = ({
  columns, onChangeColumns,
}) => {
  const classes = useStyles();

  return (
    <Fragment>
      <Divider className={classes.divider} />
      <Typography className={classes.title} variant='h6' component='h3'>
        Columns
      </Typography>
      <Box className={classes.selectWrap}>
        {
          COLUMNS_ORDER.map((COLUMN, i) => (
            <FormControl key={String(i)} className={classes.formControl}>
              <InputLabel id={`column-${COLUMN}`}>{`Column ${COLUMN + 1}`}</InputLabel>
              <Select
                labelId={`column-${COLUMN}`}
                value={columns[COLUMN][1]}
                onChange={onChangeColumns(COLUMN)}
                disableUnderline
              >
                {
                  COLUMNS.map(COL => <MenuItem key={`${COL}-${String(i)}`} value={COL}>{COL}</MenuItem>)
                }
              </Select>
            </FormControl>
          ))
        }
      </Box>
    </Fragment>
  );
};

export default Settings;
