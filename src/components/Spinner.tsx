import { ClipLoader } from "react-spinners";


function Spinner({color}:{color:"#fff" | "#000"}) {

  return ( 
      <ClipLoader 
        color={color}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    
  );
}

export default Spinner;