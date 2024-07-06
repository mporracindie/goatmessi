import dayjs, { Dayjs } from 'dayjs';

// Función para generar un número entero aleatorio entre min y max (ambos inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDateBetween = (startDate: string, endDate: string): Dayjs => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  // Asegúrate de que la fecha de inicio es anterior a la fecha de fin
  if (!start.isValid() || !end.isValid() || start.isAfter(end)) {
    throw new Error(
      'Fechas no válidas. Asegúrate de que las fechas están en el formato correcto y que la fecha de inicio es anterior a la fecha de fin.'
    );
  }

  const startUnix = start.unix();
  const endUnix = end.unix();
  const randomUnix = getRandomInt(startUnix, endUnix);
  return dayjs.unix(randomUnix);
};
const getDateFromDayjs = (day: Dayjs, month: Dayjs, year: Dayjs): string => {
  // return format dd-mm-yyyy
  return `${day.format('DD')}-${month.format('MM')}-${year.format('YYYY')}`;
}

export { getRandomDateBetween };
