import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAllAppliedJobs } from "../redux/actions"; // Assuming you have this action

const APPLICATION_API_END_POINT = "http://localhost:5001/api/applications"; // Replace with the actual endpoint

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
                
                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.application)); // Dispatching to Redux
                }
            } catch (error) {
                console.log("Error fetching applied jobs:", error);
            }
        };

        fetchAppliedJobs();
    }, [dispatch]);  // Include dispatch in the dependency array
};

export default useGetAppliedJobs;
