import { utils as XLSXUtils, writeFile as XLSXWriteFile } from "xlsx";
import { getFormattedDate } from '../utils/date-utils';

export const exportToExcel = (rows) => {
  const currentDate = getFormattedDate();
  const fileName = `inv_${currentDate}.xlsx`;
  const exportData = rows.map(({ id, ...rest }) => ({
    "Product Name": rest.productName,
    "Quantity": rest.quantity,
  }));

  const worksheet = XLSXUtils.json_to_sheet([...exportData]);
  const workbook = XLSXUtils.book_new();
  XLSXUtils.book_append_sheet(workbook, worksheet, "Inventory Data");

  XLSXWriteFile(workbook, fileName);
};
