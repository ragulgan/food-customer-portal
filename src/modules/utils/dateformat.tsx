import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const formatDisplayDateTime = (date: any) => {
    return dayjs(date).format('YYYY-MMM-DD, hh:mm A');
}
export const formatDisplayTime = (date: any) => {
    return dayjs(date).format('hh:mm a');
}
export const formatDisplayDate = (date: any) => {
    return dayjs(date).format('YYYY-MM-DD');
}
export const dateStringToObject = (date: any) => {
    return dayjs(date).format('MMM-DD-YYYY hh:mm A');
}
export const currentDateTime = () => { return dayjs() }
export const currentMonth = () => { return dayjs().utc().format('MMMM') }
export const startOfThisMonth = () => dayjs().startOf('month').utc().format();
export const endOfThisMonth = () => dayjs().endOf('month').utc().format();
export const startOfDay = (datetime: any) => dayjs(datetime).startOf('day').utc().format();
export const endOfDay = (datetime: any) => dayjs(datetime).endOf('day').utc().format();
export const formatToUTC = (datetime: any) =>  dayjs(datetime).utc().format() ;
