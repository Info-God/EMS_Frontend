import toast from "react-hot-toast";

export default function Debounce(condition: unknown, handler:()=>void){
    const id = setInterval(() => {
        if (condition === null || condition === undefined) {
            handler()
            toast.error("max try reach to fetch data check Connection")
        } else {
            clearInterval(id)
            return
        }
    }, 10000);
}
