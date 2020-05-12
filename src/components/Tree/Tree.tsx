import React, { Fragment } from 'react';
import toString from 'lodash/toString';
import { State, ARCASocket } from 'arca-redux';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import Description from '@material-ui/icons/Description';
import Folder from '@material-ui/icons/Folder';
import TreeItem from '@material-ui/lab/TreeItem';
import { parseTreeItems } from '../../utils';
import { tree } from '../../types';


interface TreeProps {
  treeItems: State['Source']['AAU-APU-in-App']['Rows'],
  socket: ARCASocket,
}

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
  treeItem: {
    marginTop: 10,
  },
  folder: {
    color: '#999999',
  },
  file: {
    color: '#61dafb',
  },
  labelTitle: {
    fontSize: 16,
    lineHeight: '16px',
    margin: '5px 5px 0 5px',
  },
  labelDesc: {
    fontSize: 14,
    lineHeight: '14px',
    color: '#999999',
    margin: '0 5px 5px 5px',
  },
});

const Tree: React.FunctionComponent<TreeProps> = ({
  treeItems, socket,
}) => {
  const classes = useStyles();
  const parsedItems = parseTreeItems(treeItems);

  const onClickTreeItem = (item: tree) => (event: React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault();

    socket.Select('APU-Import-Supplies-in-App', {
      PK: {
        Constraint: item.Constraint,
        ContractorID: item.ContractorID,
        Key: item.Key,
      },
    });
  };

  const getTreeItem = (treeItems: tree[]) => treeItems.map((item, i) => {
    if (item.items) {
      return (
        <TreeItem
          className={classes.treeItem}
          key={item.Key + String(i)}
          nodeId={item.Key}
          onLabelClick={onClickTreeItem(item)}
          label={(
            <Fragment>
              <h2 className={classes.labelTitle}>{`${item.Key} ${toString(item.Constraint)}`}</h2>
              <p className={classes.labelDesc}>{ item.Description }</p>
            </Fragment>
          )}
        >
          {
            getTreeItem(item.items)
          }
        </TreeItem>
      );
    }

    return (
      <TreeItem
        className={classes.treeItem}
        key={item.Key + String(i)}
        nodeId={item.Key}
        onLabelClick={onClickTreeItem(item)}
        label={(
          <Fragment>
            <h2 className={classes.labelTitle}>{`${item.Key} ${toString(item.Constraint)}`}</h2>
            <p className={classes.labelDesc}>{ item.Description }</p>
          </Fragment>
        )}
      />
    );
  });

  return (
    <TreeView
      defaultCollapseIcon={<Folder className={classes.folder} />}
      defaultExpandIcon={<Folder className={classes.folder} />}
      defaultEndIcon={<Description />}
    >
      {
        getTreeItem(parsedItems)
      }
    </TreeView>
  );
};

export default Tree;
