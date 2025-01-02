import moment, { type Moment } from "moment"

export const dateFormatInMonthAndYear = (datetime: string | Moment) => {
    if(!Boolean(datetime)) return ''
    const momentReserve = moment(datetime);
    return momentReserve.format('MMMM [de] YYYY')
}

export const dateFormatInDayAndMonth = (datetime: string | Moment) => {
    if(!Boolean(datetime)) return ''
    const momentReserve = moment(datetime);
    return momentReserve.format('DD/MM')
}

export const dateFormatInDayAndMonthAndYearBR = (date: string | moment.Moment) => {
    if (!date) return '';
    return moment(date).locale('pt-br').format('DD [de] MMMM [de] YYYY');
};

export const now = () => {
    return moment()
}

export const convertInMomentInstance = (date: string | Moment, formatDate = "YYYY-MM-DD") => moment(date, formatDate);

export const formatDateBR = (date: string | Moment) => {
    return moment(date).locale('pt-br').format('DD/MM/YYYY');
}

export const formatDateTimeBR = (date: string | Moment) => {
    return moment(date).locale('pt-br').format('DD/MM/YYYY HH:mm');
}

export const formatShortDateTimeBR = (date: string | Moment) => {
    return moment(date).locale('pt-br').format('DD/MM HH:mm');
}
