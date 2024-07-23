import moment, { type Moment } from "moment"

export const dateFormatInMonthAndYear = (datetime: string | Moment) => {
    if(!Boolean(datetime)) return ''
    const momentReserve = moment(datetime);
    return momentReserve.format('MMMM [de] YYYY')
}

export const now = () => {
    return moment()
}

export const convertInMomentInstance = (date: string | Moment) => moment(date);

export const formatDateBR = (date: string | Moment) => {
    return moment(date).locale('pt-br').format('DD/MM/YYYY');
}

export const formatDateTimeBR = (date: string | Moment) => {
    return moment(date).locale('pt-br').format('DD/MM/YYYY HH:mm');
}