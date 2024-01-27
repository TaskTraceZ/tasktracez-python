export const getPreviousDate = (date: Date) => {
    const previousDate = new Date(date);

    previousDate.setDate(date.getDate() + 1);

    return previousDate;
};

export const getNextDate = (date: Date) => {
    const nextDate = new Date(date);

    nextDate.setDate(date.getDate() + 1);

    return nextDate;
};

export const getFormattedDate = (date: Date) => {
    return date.toISOString().split('T')[0];
};

export const convertTimeToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(':');

    const parsedHours = +hours;
    const parsedMinutes = +minutes;
    const parsedSeconds = +seconds;

    return parsedHours * 3600 + parsedMinutes * 60 + parsedSeconds;
};

export const convertSecondsToTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const convertDateToTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedHours = (hours < 10) ? "0" + hours : hours.toString();
    const formattedMinutes = (minutes < 10) ? "0" + minutes : minutes.toString();
    const formattedSeconds = (seconds < 10) ? "0" + seconds : seconds.toString();

    const currentTime: string = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    
    return currentTime;
}
