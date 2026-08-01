import axios from "axios";

export interface Country{
  name:{
    common:string
  }
}

export const fetchCountryApi=async()=>{
    try{
        const response=await axios.get<Country[]>( "https://restcountries.com/v3.1/all?fields=name");
        console.log(response.data)
        return response.data
        
    }catch(error){
         console.error("failed to fetch country names",error);
         return null;
    }
}

