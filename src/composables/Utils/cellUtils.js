export const parseCellNumber = (cellNumber) => {
  const [row, cell, level, warehouse, zone] = cellNumber.split(".");
  return {
    row: parseInt(row),
    cell: parseInt(cell),
    level: parseInt(level),
    warehouse: parseInt(warehouse),
    zone,
  };
};
export const formatCellNumber = ({ row, cell, level, warehouse, zone }) => {
  return `${row}.${cell}.${level}.${warehouse}.${zone}`;
};
export const isSameCell = (cell1, cell2) => {
  if (!cell1 || !cell2) return false;
  return (
    cell1 === cell2 ||
    (parseCellNumber(cell1).row === parseCellNumber(cell2).row &&
      parseCellNumber(cell1).cell === parseCellNumber(cell2).cell &&
      parseCellNumber(cell1).level === parseCellNumber(cell2).level &&
      parseCellNumber(cell1).warehouse === parseCellNumber(cell2).warehouse &&
      parseCellNumber(cell1).zone === parseCellNumber(cell2).zone)
  );
};
