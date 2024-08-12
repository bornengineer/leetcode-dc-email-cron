export default function formatDate(dateStr: string) {
  const dateObj = new Date(dateStr);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();

  return `${monthNames[monthIndex]} ${day}, ${year}`;
}
