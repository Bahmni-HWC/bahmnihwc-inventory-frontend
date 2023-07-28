// Function to get the current date and time in a formatted string.
// The returned date format will be "dd-MM-yyyy HH:mm:ss".
const getFormattedDate = () => {
   const currentDate = new Date();
    return `${currentDate.getDate().toString().padStart(2, '0')}-${
      (currentDate.getMonth() + 1).toString().padStart(2, '0')
    }-${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

};

export default getFormattedDate;