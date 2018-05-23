'use strict';
(() => {
  const defaultRow = {};
  const validations = {};
  const fields = [
    'id', 'description', 'qop', 'preAPU_qop', 'unit', 'preAPU_cost'
  ];
  const header = ['', 'Descripcion', 'Cant', '_Cant', 'Unidad', 'Costo'];
  const actions = [];

  window.viewpreapu = setupTable({
    module: 'viewpreAPU',
    header: header, actions: actions,
    fields: fields, idkey: 'id', validations: validations,
    defaultRow: defaultRow, filter: { key: 'table', value: 'viewpreAPU' }
  });
})();
