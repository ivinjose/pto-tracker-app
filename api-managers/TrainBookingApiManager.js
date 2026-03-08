import useAxiosPrivate from "../hooks/useAxiosPrivate";

const useTrainBookingApiManager = () => {
    const axiosPrivate = useAxiosPrivate();
    const TRAIN_BOOKING_API = '/api/travelday';

    const createTrainBooking = async (data) => {
        const {
            name,
            travel_date,
            train_booking_date,
            remarks,
            is_tatkal,
            time_slot,
        } = data;

        if (!name || !travel_date || !train_booking_date) {
            return;
        }

        try {
            const response = await axiosPrivate.post(
                TRAIN_BOOKING_API,
                {
                    name,
                    travel_date,
                    train_booking_date,
                    remarks,
                    is_tatkal: Boolean(is_tatkal),
                    time_slot,
                }
            );
            return response.data.data;
        } catch (err) {
            console.log(err);
        }
    };

    const getTrainBookings = async (filters = {}) => {
        const { count } = filters;

        const searchParams = new URLSearchParams();
        if (count) {
            searchParams.set('count', count);
        }
        const query = searchParams.toString();
        const url = query ? `${TRAIN_BOOKING_API}?${query}` : TRAIN_BOOKING_API;

        try {
            const response = await axiosPrivate.get(url);
            const data = response.data.data;
            return Array.isArray(data) ? data : (data ? [data] : []);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteTrainBooking = async (id) => {
        if (!id) {
            return;
        }

        try {
            const response = await axiosPrivate.delete(`${TRAIN_BOOKING_API}/${id}`);
            return response.data?.data;
        } catch (err) {
            console.log(err);
        }
    };

    return {
        createTrainBooking,
        getTrainBookings,
        deleteTrainBooking,
    };
};

export default useTrainBookingApiManager;
