import useAxiosPrivate from "../hooks/useAxiosPrivate";
// import { add } from "date-fns";

const useOffDaysApiManager = () => {
    const axiosPrivate = useAxiosPrivate();
    const PROCESSED_OFFDAYS_API = '/api/offdays';
    const RAW_OFFDAYS_API = '/api/offdays/raw';

    const createOffDay = async (data) => {
        const {
            offday_name,
            offday_owner,
            start_date,
            end_date,
            remarks,
        } = data;

        if (!offday_name || !start_date || !end_date) {
            return;
        }

        // const dateWithTime = add(date, {
        //     hours: Number(hrs),
        //     minutes: Number(mins)
        // });

        try {
            const response = await axiosPrivate.post(
                PROCESSED_OFFDAYS_API,
                {
                    offday_name,
                    offday_owner,
                    start_date,
                    end_date,
                    remarks,
                }
            )
            return response.data.data;
        } catch (err) {
            console.log(err);
        }
    };

    const getProcessedOffDays = async (filters) => {
        const {
            from,
            to,
            count,
        } = filters;

        let api = PROCESSED_OFFDAYS_API;

        const searchParams = new URLSearchParams();
        if (from) {
            searchParams.set('from', from);
        }
        if (to) {
            searchParams.set('to', to);
        }
        if (count) {
            searchParams.set('count', count);
        }
        try {
            const response = await axiosPrivate.get(`${api}?${searchParams}`);
            return response.data.data;
        } catch (err) {
            console.log(err);
        }
    };

    const getRawOffDays = async () => {

        try {
            const response = await axiosPrivate.get(`${RAW_OFFDAYS_API}`);
            return response.data.data;
        } catch (err) {
            console.log(err);
        }
    };

    /** not being used right now */
    const deleteOffDay = async (data) => {
        const offday = data;
        try {
            const response = await axiosPrivate.delete(`${PROCESSED_OFFDAYS_API}/${offday}`)
            return response.data.data;
        } catch (err) {
            console.log(err);
        }
    };

    return {
        createOffDay, getProcessedOffDays, getRawOffDays, deleteOffDay
    }
}

export default useOffDaysApiManager;