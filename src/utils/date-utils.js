// Function to get the current date and time in a formatted string.
// The returned date format will be "dd-MM-yyyy HH:mm:ss".
const getFormattedDate = () => {
   const currentDate = new Date();
    return `${currentDate.getDate().toString().padStart(2, '0')}-${
      (currentDate.getMonth() + 1).toString().padStart(2, '0')
    }-${currentDate.getFullYear()} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

};

const convertToDateTimeFormat = (inputTime) => {
  const dateObject = new Date(inputTime);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');
  const hours = String(dateObject.getHours()).padStart(2, '0');
  const minutes = String(dateObject.getMinutes()).padStart(2, '0');
  const seconds = String(dateObject.getSeconds()).padStart(2, '0');
  const milliseconds = String(dateObject.getMilliseconds()).padStart(3, '0');
  const timezoneOffset = '0000';

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+${timezoneOffset}`;
};

const getDatePattern = () => {
  const datePattern = "(0[1-9]|[1-2][0-9]|3[0-1])/(0[1-9]|1[0-2])/\\d{4}"
  return datePattern;
};

export { getFormattedDate,convertToDateTimeFormat, getDatePattern };