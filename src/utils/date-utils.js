// Function to get the current date and time in a formatted string.
// The returned date format will be "dd-MM-yyyy HH:mm:ss".
const getFormattedDate = () => {
   const currentDate = new Date();
    return `${currentDate.getDate().toString().padStart(2, '0')}-${
      (currentDate.getMonth() + 1).toString().padStart(2, '0')
    }-${currentDate.getFullYear()} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

};

const getDatePattern = () => {
  const datePattern = "(0[1-9]|[1-2][0-9]|3[0-1])/(0[1-9]|1[0-2])/\\d{4}"
  return datePattern;
};

export { getFormattedDate, getDatePattern };